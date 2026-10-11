import { useRef } from 'react';
import { ACC_SYMBOL, type Note, majorScale } from '../theory';
import {
  BOTTOM_LINE, type Clef, MIDDLE_C, accidentalToShow, clefFor, diatonic, ledgerLines, signaturePositions,
} from '../theory/piano';

export interface StaffNote {
  note: Note;
  oct: number;
  /** notehead color (a CSS var) */
  color?: string;
  /** small text under the note */
  label?: string;
}

interface Props {
  /** tonic of the key: draws its key signature on both staves */
  tonic: Note;
  notes: StaffNote[];
  /** tap on a line or space: diatonic index (C4 = 28) */
  onPick?: (dia: number) => void;
  /** highlighted line or space (diatonic index) */
  pick?: number | null;
  /** draw the "missing" 11th line (middle C) dashed across both staves */
  showMiddle?: boolean;
  middleLabel?: string;
  label: string;
  className?: string;
}

/** Lowest and highest positions drawn (C2 … C6). */
export const STAFF_MIN = 14;
export const STAFF_MAX = 42;
const H = 7;
const PADT = 12;
const W = 340;
const yOf = (d: number) => PADT + (STAFF_MAX - d) * H;
const HEIGHT = yOf(STAFF_MIN) + 30;

/** Grand staff (treble + bass) with key signature, notes, ledger lines and accidentals. */
export function PianoGrandStaff({ tonic, notes, onPick, pick, showMiddle, middleLabel, label, className }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const scale = majorScale(tonic);
  const sig: Record<Clef, { acc: number; pos: number }[]> = {
    treble: signaturePositions(tonic, 'treble'),
    bass: signaturePositions(tonic, 'bass'),
  };
  const nSig = sig.treble.length;
  const xSig = 50;
  const xN = xSig + nSig * 10 + 22;
  const span = W - xN - 16;
  const step = notes.length > 1 ? Math.min(46, span / notes.length) : 0;
  const x0 = notes.length > 1 ? xN + step / 2 + 6 : xN + span / 2;

  const pickAt = (e: React.PointerEvent<SVGRectElement>) => {
    const svg = ref.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m || !onPick) return;
    const p = svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    const q = p.matrixTransform(m.inverse());
    const d = Math.round(STAFF_MAX - (q.y - PADT) / H);
    onPick(Math.max(STAFF_MIN, Math.min(STAFF_MAX, d)));
  };

  const lines = (c: Clef) => [0, 2, 4, 6, 8].map((p) => BOTTOM_LINE[c] + p);

  return (
    <svg ref={ref} className={'piano-staff ' + (className ?? '')} viewBox={`0 0 ${W} ${HEIGHT}`} role="img" aria-label={label}>
      {pick != null && (
        <rect x={xN - 8} y={yOf(pick) - H / 2} width={W - xN + 2} height={H} rx={2} fill="var(--accent-soft)" />
      )}
      {(['treble', 'bass'] as Clef[]).map((c) =>
        lines(c).map((d) => <line key={c + d} x1={6} x2={W - 6} y1={yOf(d)} y2={yOf(d)} stroke="var(--fg)" strokeWidth={1} opacity={0.8} />),
      )}
      <line x1={6} x2={6} y1={yOf(38)} y2={yOf(18)} stroke="var(--fg)" strokeWidth={2.4} />
      <line x1={W - 6} x2={W - 6} y1={yOf(38)} y2={yOf(18)} stroke="var(--fg)" strokeWidth={1.4} />
      {showMiddle && (
        <g>
          <line x1={10} x2={W - 6} y1={yOf(MIDDLE_C)} y2={yOf(MIDDLE_C)} stroke="var(--change)" strokeWidth={1.2} strokeDasharray="5 4" />
          {middleLabel && (
            <text x={W - 10} y={yOf(MIDDLE_C) - 4} textAnchor="end" className="piano-staff-mid">{middleLabel}</text>
          )}
        </g>
      )}
      {/* Noto Music metrics: the G clef sits on its baseline (G line); the F clef ink spans 0.1–0.9 em above it */}
      <text x={12} y={yOf(32)} className="mus piano-clef" style={{ fontSize: 48 }}>𝄞</text>
      <text x={13} y={yOf(26) + 0.9 * 50} className="mus piano-clef" style={{ fontSize: 50 }}>𝄢</text>
      {(['treble', 'bass'] as Clef[]).map((c) =>
        sig[c].map((a, i) => (
          <text key={c + i} x={xSig + i * 10} y={yOf(BOTTOM_LINE[c] + a.pos) + (a.acc < 0 ? -3 : 0)} textAnchor="middle"
            dominantBaseline="central" className="mus piano-acc">{ACC_SYMBOL[a.acc]}</text>
        )),
      )}
      {notes.map((n, i) => {
        const d = diatonic(n.note, n.oct);
        const c = clefFor(d);
        const x = x0 + i * step;
        const y = yOf(d);
        const acc = accidentalToShow(n.note, scale);
        const col = n.color ?? 'var(--fg)';
        return (
          <g key={i}>
            {ledgerLines(d - BOTTOM_LINE[c]).map((p) => (
              <line key={p} x1={x - 13} x2={x + 13} y1={yOf(BOTTOM_LINE[c] + p)} y2={yOf(BOTTOM_LINE[c] + p)} stroke="var(--fg)" strokeWidth={1.2} />
            ))}
            {acc != null && (
              <text x={x - 17} y={y + (acc < 0 ? -3 : 0)} textAnchor="middle" dominantBaseline="central" className="mus piano-acc"
                style={{ fill: col }}>{acc === 0 ? '♮' : ACC_SYMBOL[acc]}</text>
            )}
            <ellipse cx={x} cy={y} rx={7.6} ry={5.6} transform={`rotate(-20 ${x} ${y})`} style={{ fill: col }} />
            {n.label && <text x={x} y={HEIGHT - 8} textAnchor="middle" className="piano-staff-lab" style={{ fill: col }}>{n.label}</text>}
          </g>
        );
      })}
      {onPick && (
        <rect x={xN - 8} y={yOf(STAFF_MAX) - H / 2} width={W - xN + 2} height={(STAFF_MAX - STAFF_MIN + 1) * H}
          fill="transparent" style={{ cursor: 'pointer' }} onPointerDown={pickAt} />
      )}
    </svg>
  );
}
