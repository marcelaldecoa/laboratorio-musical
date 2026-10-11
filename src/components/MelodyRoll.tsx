import type { ReactNode } from 'react';

export interface RollNote {
  /** scale-step index (0 = tonic, 7 = tonic an octave up) */
  i: number;
  start: number;
  dur: number;
  fill: string;
  ink: string;
  label?: string;
}

export interface RollBar {
  /** chord label shown above the bar (roman numeral · name) */
  label: string;
  fill: string;
  ink: string;
}

interface Props {
  notes: RollNote[];
  bars: RollBar[];
  beatsPerBar?: number;
  selected?: number;
  onSelect?: (k: number) => void;
  /** shade beats 1 and 3 */
  strong?: boolean;
  /** beat numbers under the strip (strong beats in bold) */
  beatNumbers?: boolean;
  label: string;
  /** extra drawing on top (gets x of a beat and the bottom y) */
  ann?: (x: (beat: number) => number, bottom: number) => ReactNode;
  beatW?: number;
  /** extra room under the strip for `ann` */
  foot?: number;
}

const ROW = 16;
const HEAD = 34;

/** Piano-roll strip: time left to right, scale steps bottom to top, one chord per bar above. */
export function MelodyRoll({
  notes, bars, beatsPerBar = 4, selected, onSelect, strong = false, beatNumbers = false, label, ann, beatW = 22, foot = 0,
}: Props) {
  const lo = Math.min(...notes.map((n) => n.i)) - 1;
  const hi = Math.max(...notes.map((n) => n.i)) + 1;
  const beats = bars.length * beatsPerBar;
  const L = 6;
  const x = (b: number) => L + b * beatW;
  const y = (i: number) => HEAD + (hi - i) * ROW;
  const bottom = y(lo) + ROW;
  const W = x(beats) + 6;
  const H = bottom + (beatNumbers ? 18 : 6) + foot;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="mel-roll">
      {strong &&
        Array.from({ length: beats }, (_, b) =>
          b % 2 === 0 ? <rect key={'s' + b} x={x(b)} y={HEAD - 4} width={beatW} height={bottom - HEAD + 4} fill="var(--surface-2)" /> : null,
        )}
      {Array.from({ length: hi - lo + 1 }, (_, r) => (
        <line key={'r' + r} x1={x(0)} x2={x(beats)} y1={y(lo + r) + ROW} y2={y(lo + r) + ROW} stroke="var(--line)" strokeWidth={0.6} />
      ))}
      {bars.map((b, k) => (
        <g key={'b' + k}>
          <rect x={x(k * beatsPerBar) + 2} y={2} width={beatsPerBar * beatW - 4} height={22} rx={6} fill={b.fill} />
          <text className="mel-chord" x={x(k * beatsPerBar + beatsPerBar / 2)} y={17} textAnchor="middle" style={{ fill: b.ink }}>{b.label}</text>
          <line x1={x(k * beatsPerBar)} x2={x(k * beatsPerBar)} y1={HEAD - 6} y2={bottom} stroke="var(--muted)" strokeWidth={1} />
        </g>
      ))}
      <line x1={x(beats)} x2={x(beats)} y1={HEAD - 6} y2={bottom} stroke="var(--muted)" strokeWidth={1.4} />
      {notes.map((n, k) => {
        const sel = k === selected;
        return (
          <g key={'n' + k} onPointerDown={onSelect ? (e) => { if (e.button === 0) onSelect(k); } : undefined}
            style={onSelect ? { cursor: 'pointer' } : undefined}>
            <rect x={x(n.start) + 1.5} y={y(n.i) + 0.5} width={n.dur * beatW - 3} height={ROW - 1} rx={4}
              fill={n.fill} stroke={sel ? 'var(--fg)' : 'var(--k-edge)'} strokeWidth={sel ? 2.4 : 0.8} />
            {n.label && (
              <text className="mel-lab" x={x(n.start) + (n.dur * beatW) / 2} y={y(n.i) + ROW - 4} textAnchor="middle" style={{ fill: n.ink }}>{n.label}</text>
            )}
          </g>
        );
      })}
      {beatNumbers &&
        Array.from({ length: beats }, (_, b) => (
          <text key={'t' + b} className={'mel-beat' + (b % 2 ? ' weak' : '')} x={x(b) + beatW / 2} y={bottom + 13} textAnchor="middle">
            {(b % beatsPerBar) + 1}
          </text>
        ))}
      {ann?.(x, bottom)}
    </svg>
  );
}
