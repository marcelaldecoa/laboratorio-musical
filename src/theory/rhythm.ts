/** Meters, note values and beat strength. Durations are measured in sixteenths (a whole note = 16). */

export type MeterId = '2/4' | '3/4' | '4/4' | '6/8';
export const METERS: MeterId[] = ['2/4', '3/4', '4/4', '6/8'];

/** Note values by their denominator: 1 = whole, 2 = half, 4 = quarter, 8 = eighth, 16 = sixteenth. */
export type NoteValue = 1 | 2 | 4 | 8 | 16;
export const VALUES: NoteValue[] = [1, 2, 4, 8, 16];

/** Musical glyphs (Unicode musical symbols, shown with the Noto Music font). */
export const VALUE_GLYPH: Record<NoteValue, string> = {
  1: '\u{1D15D}', 2: '\u{1D15E}', 4: '\u{1D15F}', 8: '\u{1D160}', 16: '\u{1D161}',
};

export type Strength = 'strong' | 'medium' | 'weak';

export interface Meter {
  id: MeterId;
  /** top number: how many counts */
  counts: number;
  /** bottom number: which note value gets one count */
  unit: NoteValue;
  /** counts that carry an accent besides count 1 (index from 0) */
  medium: number[];
  /** simple (beat splits in 2) or compound (beat splits in 3) */
  kind: 'simple' | 'compound';
}

const DEFS: Record<MeterId, Meter> = {
  '2/4': { id: '2/4', counts: 2, unit: 4, medium: [], kind: 'simple' },
  '3/4': { id: '3/4', counts: 3, unit: 4, medium: [], kind: 'simple' },
  '4/4': { id: '4/4', counts: 4, unit: 4, medium: [2], kind: 'simple' },
  '6/8': { id: '6/8', counts: 6, unit: 8, medium: [3], kind: 'compound' },
};

export const meter = (id: MeterId): Meter => DEFS[id];

/** Length of a note value in sixteenths. */
export const len16 = (v: NoteValue) => 16 / v;

/** Length of one count in sixteenths. */
export const count16 = (m: Meter) => len16(m.unit);

/** Length of a bar in sixteenths. */
export const bar16 = (m: Meter) => m.counts * count16(m);

/** Bar length as a fraction of a whole note, in lowest terms: 3/4 → [3, 4], 6/8 → [3, 4], 4/4 → [1, 1]. */
export function barFraction(m: Meter): [number, number] {
  const a = bar16(m);
  const g = gcd(a, 16);
  return [a / g, 16 / g];
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** How many notes of value `v` fit in a bar, and what is left over (in sixteenths). */
export function fit(m: Meter, v: NoteValue): { count: number; rest16: number } {
  const L = len16(v);
  const B = bar16(m);
  return { count: Math.floor(B / L), rest16: B % L };
}

/** Strength of count `i` (0-based): count 1 is strong; 4/4 count 3 and 6/8 count 4 are medium. */
export function strength(m: Meter, i: number): Strength {
  if (i === 0) return 'strong';
  return m.medium.includes(i) ? 'medium' : 'weak';
}

/** How many notes of value `v` make one whole note: 1, 2, 4, 8, 16 (the halving tree). */
export const perWhole = (v: NoteValue) => v;

/** A rhythm is a list of note values that should fill exactly one bar. */
export type Rhythm = NoteValue[];

export const rhythm16 = (r: Rhythm) => r.reduce((a, v) => a + len16(v), 0);

/** Start of each note of the rhythm, in sixteenths from the downbeat. */
export function onsets(r: Rhythm): number[] {
  const out: number[] = [];
  let t = 0;
  for (const v of r) {
    out.push(t);
    t += len16(v);
  }
  return out;
}

/** How many notes start inside each count of the bar. */
export function onsetsPerCount(r: Rhythm, m: Meter): number[] {
  const c = count16(m);
  const out = Array<number>(m.counts).fill(0);
  for (const o of onsets(r)) {
    const i = Math.floor(o / c);
    if (i < m.counts) out[i]++;
  }
  return out;
}

/** Practice rhythms for each meter (every one fills exactly one bar). */
export const RHYTHMS: Record<MeterId, Rhythm[]> = {
  '2/4': [[4, 8, 8], [8, 8, 16, 16, 16, 16]],
  '3/4': [[2, 4], [4, 8, 8, 4]],
  '4/4': [[4, 8, 8, 4, 4], [2, 8, 8, 4], [4, 16, 16, 16, 16, 8, 8, 4]],
  '6/8': [[8, 8, 8, 8, 8, 8], [4, 8, 4, 8]],
};

/**
 * Sorts tap times (seconds) into counts: a tap belongs to the count it is nearest to the start of,
 * allowing it to come up to `early` of a count before that count. Taps outside the bar are ignored.
 */
export function tapsPerCount(taps: number[], start: number, countDur: number, counts: number, early = 0.2): number[] {
  const out = Array<number>(counts).fill(0);
  for (const t of taps) {
    const i = Math.floor((t - start) / countDur + early);
    if (i >= 0 && i < counts) out[i]++;
  }
  return out;
}

/** Compares expected and tapped counts: true where they match. */
export const compareCounts = (want: number[], got: number[]) => want.map((w, i) => w === (got[i] ?? 0));

/** Seconds per count at a given tempo (beats per minute). */
export const secondsPerCount = (bpm: number) => 60 / bpm;
