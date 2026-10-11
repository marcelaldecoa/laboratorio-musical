import { isBlackKey } from '../theory';

export const KW = 28;
export const WHH = 118;
export const BH = 72;
export const BW = 17;

export interface KeyLayout {
  from: number;
  to: number;
  whites: number[];
  blacks: number[];
  x: (s: number) => number;
  /** horizontal center of a key */
  c: (s: number) => number;
  width: number;
}

/** Layout of the keys from `from` to `to` (semitones, C4 = 0). */
export function layout(from: number, to: number): KeyLayout {
  const wx: Record<number, number> = {};
  const whites: number[] = [];
  const blacks: number[] = [];
  for (let s = from; s <= to; s++)
    if (!isBlackKey(s)) {
      wx[s] = 1 + whites.length * KW;
      whites.push(s);
    }
  for (let s = from; s <= to; s++) if (isBlackKey(s) && wx[s - 1] != null && wx[s + 1] != null) blacks.push(s);
  const x = (s: number) => (isBlackKey(s) ? wx[s - 1] + KW - BW / 2 : wx[s]);
  const c = (s: number) => (isBlackKey(s) ? x(s) + BW / 2 : x(s) + KW / 2);
  return { from, to, whites, blacks, x, c, width: whites.length * KW + 2 };
}

/** Range that starts and ends on white keys around [a, b]. */
export const rangeAround = (a: number, b: number) =>
  layout(isBlackKey(a) ? a - 1 : a, isBlackKey(b) ? b + 1 : b);

/** Pick the white-key or black-key variant of a color token. */
export const fillFor = (s: number, white: string, black: string) => (isBlackKey(s) ? black : white);

export interface Mark {
  fill?: string;
  ink?: string;
  label?: string | number;
  name?: string;
  ghost?: string;
}

export type Role = 'tonic' | 'scale' | 'acc' | 'chg' | 'start' | 'path' | 'sub' | 'lt' | 'dom';

/** Standard colored mark by role, choosing the right variant for black keys. */
export function roleMark(s: number, role: Role, label?: string | number, name?: string): Mark {
  const solid: Partial<Record<Role, [string, string]>> = {
    tonic: ['var(--k-tonic)', 'var(--k-tonic-ink)'],
    sub: ['var(--k-sub)', 'var(--k-sub-ink)'],
    lt: ['var(--k-lt)', 'var(--k-lt-ink)'],
    dom: ['var(--k-dom)', 'var(--k-dom-ink)'],
  };
  const pair: Partial<Record<Role, [string, string, string, string]>> = {
    scale: ['var(--k-scale)', 'var(--k-scale-ink)', 'var(--k-scaleb)', 'var(--k-scaleb-ink)'],
    acc: ['var(--k-acc)', 'var(--k-acc-ink)', 'var(--k-accb)', 'var(--k-accb-ink)'],
    chg: ['var(--k-chg)', 'var(--k-chg-ink)', 'var(--k-chgb)', 'var(--k-chgb-ink)'],
    start: ['var(--k-start)', 'var(--k-start-ink)', 'var(--k-startb)', 'var(--k-startb-ink)'],
    path: ['var(--k-path)', 'var(--k-path-ink)', 'var(--k-scaleb)', 'var(--k-scaleb-ink)'],
  };
  const sd = solid[role];
  if (sd) return { fill: sd[0], ink: sd[1], label, name };
  const p = pair[role]!;
  return { fill: fillFor(s, p[0], p[2]), ink: fillFor(s, p[1], p[3]), label, name };
}

export interface Step {
  a: number;
  b: number;
  t: string | number;
  h?: boolean;
}

/** W/H steps between consecutive semitones. */
export function stepsFor(notes: number[], W: string, H: string): Step[] {
  const out: Step[] = [];
  for (let i = 0; i < notes.length - 1; i++) {
    const w = notes[i + 1] - notes[i] === 2;
    out.push({ a: notes[i], b: notes[i + 1], t: w ? W : H, h: !w });
  }
  return out;
}
