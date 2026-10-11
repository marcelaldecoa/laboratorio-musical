/* Small building blocks shared by the "scales" track lessons. */
import type { ReactNode } from 'react';
import type { KeyLayout, Step } from './layout';

/** Absolute semitones of a scale from `base` (C4 = 0), closing on the octave. */
export const scaleSemis = (base: number, offsets: readonly number[]) => [...offsets.map((o) => base + o), base + 12];

/** Steps below the keyboard for any sizes: H (coral), W, or a wider gap with its own label. */
export function stepsAny(semis: number[], W: string, H: string, wide: string, wideCoral = false): Step[] {
  const out: Step[] = [];
  for (let i = 0; i < semis.length - 1; i++) {
    const d = semis[i + 1] - semis[i];
    out.push({ a: semis[i], b: semis[i + 1], t: d === 1 ? H : d === 2 ? W : wide, h: d === 1 || (d > 2 && wideCoral) });
  }
  return out;
}

/** Up and back down (the top note once). */
export const upDown = (up: number[], down: number[] = up) => [...up, ...[...down].reverse().slice(1)];

export interface FifthCell {
  name: string;
  sub?: string;
  fill?: string;
  ink?: string;
  stroke?: string;
  dash?: boolean;
  subInk?: string;
}

/** A row of the line of fifths: boxes left (flat side) to right (sharp side), with an optional bracket. */
export function ScalesFifthsRow({
  cells, bracket, label,
}: { cells: FifthCell[]; bracket?: { from: number; to: number; text: string }; label: string }) {
  const W = 34;
  const G = 4;
  const X = (i: number) => 2 + i * (W + G);
  const top = bracket ? 36 : 6;
  return (
    <svg className="scales-line" viewBox={`0 0 ${X(cells.length - 1) + W + 2} ${top + 60}`} role="img" aria-label={label}>
      {bracket && (
        <>
          <path d={`M${X(bracket.from)} 30 V22 H${X(bracket.to) + W} V30`} fill="none" stroke="var(--muted)" strokeWidth="1.2" />
          <text className="ann" x={(X(bracket.from) + X(bracket.to) + W) / 2} y="12" textAnchor="middle">{bracket.text}</text>
        </>
      )}
      {cells.map((c, i) => (
        <g key={i}>
          <rect x={X(i)} y={top} width={W} height={54} rx={5}
            style={{ fill: c.fill ?? 'transparent', stroke: c.stroke ?? c.fill ?? 'var(--line)', strokeWidth: 1.4, strokeDasharray: c.dash ? '4 3' : undefined }} />
          <text x={X(i) + W / 2} y={top + 20} textAnchor="middle" dominantBaseline="central"
            style={{ font: '500 13px var(--f-mono)', fill: c.ink ?? 'var(--muted)' }}>{c.name}</text>
          {c.sub && (
            <text x={X(i) + W / 2} y={top + 40} textAnchor="middle" dominantBaseline="central"
              style={{ font: '500 12px var(--f-mono)', fill: c.subInk ?? c.ink ?? 'var(--muted)' }}>{c.sub}</text>
          )}
        </g>
      ))}
    </svg>
  );
}

export interface FormulaToken {
  t: string;
  h?: boolean;
  /** marked as moved / changed */
  mv?: boolean;
}

/** One labelled row of step tokens (T T S …). */
export function ScalesFormulaRow({ label, tokens, extra }: { label: ReactNode; tokens: FormulaToken[]; extra?: ReactNode }) {
  return (
    <div className="scales-frow">
      <span className="scales-flab">{label}</span>
      <span className="scales-ftoks">
        {tokens.map((k, i) => (
          <span key={i} className={'scales-tok' + (k.h ? ' h' : '') + (k.mv ? ' mv' : '')}>{k.t}</span>
        ))}
      </span>
      {extra}
    </div>
  );
}

/** Bracket above the keyboard whose label is kept inside the drawing (long labels near the edges). */
export function ScalesBracket({ lay, a, b, y, label }: { lay: KeyLayout; a: number; b: number; y: number; label: string }) {
  const x1 = lay.c(a);
  const x2 = lay.c(b);
  const half = (label.length * 7.3) / 2 + 2;
  const cx = Math.min(Math.max((x1 + x2) / 2, half), lay.width - half);
  return (
    <g>
      <path d={`M${x1.toFixed(1)} ${y + 10} V${y} H${x2.toFixed(1)} V${y + 10}`} fill="none" stroke="var(--muted)" strokeWidth={1.2} />
      <text className="ann" x={cx.toFixed(1)} y={y - 7} textAnchor="middle">{label}</text>
    </g>
  );
}
