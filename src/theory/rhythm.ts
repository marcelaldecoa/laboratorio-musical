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

/* ------------------------------------------------------------------------------------------------
 * Reading rhythm on paper (lesson rhythm2): dots, ties, rests, syncopation, pickups and triplets.
 * Durations here are in ticks: a quarter note = 12, so halves, thirds and quarters of a beat are whole numbers.
 * ---------------------------------------------------------------------------------------------- */

/** Ticks per quarter note. */
export const TQ = 12;

/** One written symbol: a note or a rest, with its length in ticks. */
export interface RNote {
  /** length in ticks (quarter = 12, dotted quarter = 18, triplet eighth = 4) */
  dur: number;
  /** the base note value of the symbol (1, 2, 4, 8, 16) */
  v: NoteValue;
  /** a dot after the note */
  dot?: boolean;
  rest?: boolean;
  /** tied to the next note: the next one is not played again */
  tie?: boolean;
  accent?: boolean;
  /** part of a triplet group (3 in the time of 2) */
  tri?: boolean;
  /** pitch in semitones from middle C, when the example has a melody */
  s?: number;
}

/** Length in ticks of a value, with an optional dot (the dot adds half of the value). */
export const ticks = (v: NoteValue, dot = false) => (len16(v) * TQ * (dot ? 3 : 2)) / 8;

/** Triplet length: three of them take the time of two of the same value. */
export const tripletTicks = (v: NoteValue) => (ticks(v) * 2) / 3;

export const nt = (v: NoteValue, o: Partial<RNote> = {}): RNote => ({ v, dur: ticks(v, o.dot), ...o });
export const rest = (v: NoteValue, o: Partial<RNote> = {}): RNote => nt(v, { ...o, rest: true });
export const trip = (v: NoteValue, o: Partial<RNote> = {}): RNote => ({ v, dur: tripletTicks(v), tri: true, ...o });

export const totalTicks = (r: RNote[]) => r.reduce((a, n) => a + n.dur, 0);

/** Start of each symbol, in ticks. */
export function startsT(r: RNote[]): number[] {
  const out: number[] = [];
  let t = 0;
  for (const n of r) {
    out.push(t);
    t += n.dur;
  }
  return out;
}

/** What you actually play: one attack per note, ties merged into the first note, rests skipped. */
export function attacks(r: RNote[]): { t: number; dur: number; accent: boolean; s?: number }[] {
  const st = startsT(r);
  const out: { t: number; dur: number; accent: boolean; s?: number }[] = [];
  let tied = false;
  r.forEach((n, i) => {
    if (n.rest) {
      tied = false;
      return;
    }
    if (tied) out[out.length - 1].dur += n.dur;
    else out.push({ t: st[i], dur: n.dur, accent: !!n.accent, s: n.s });
    tied = !!n.tie;
  });
  return out;
}

/** How many attacks start in each beat (beat = `beatT` ticks). */
export function attacksPerBeat(r: RNote[], beatT = TQ): number[] {
  const out = Array<number>(Math.ceil(totalTicks(r) / beatT)).fill(0);
  for (const a of attacks(r)) out[Math.floor(a.t / beatT)]++;
  return out;
}

/** Beats (0-based) on which no note starts while a note started earlier is still sounding: the felt syncopation. */
export function syncopatedBeats(r: RNote[], beatT = TQ): number[] {
  const out: number[] = [];
  for (const a of attacks(r)) {
    if (a.t % beatT === 0) continue;
    const next = Math.ceil(a.t / beatT) * beatT;
    if (a.t + a.dur > next) out.push(next / beatT);
  }
  return out;
}

/** Start ticks of the attacks that are syncopated (off the beat and held over the next beat). */
export function syncopatedStarts(r: RNote[], beatT = TQ): Set<number> {
  return new Set(attacks(r).filter((a) => a.t % beatT !== 0 && a.t + a.dur > Math.ceil(a.t / beatT) * beatT).map((a) => a.t));
}

export interface RExample {
  id: 'dot' | 'tie' | 'rest' | 'sync' | 'pickup' | 'tri';
  /** beats per bar */
  beats: number;
  /** ticks before the first bar line (anacrusis) */
  pickup: number;
  /** rows to compare: the plain version first, the concept last */
  rows: RNote[][];
}

/** The examples of the lesson. Every row fills whole bars after its pickup. */
export const REXAMPLES: RExample[] = [
  { id: 'dot', beats: 4, pickup: 0, rows: [
    [nt(4, { tie: true }), nt(8), nt(8), nt(4, { tie: true }), nt(8), nt(8)],
    [nt(4, { dot: true }), nt(8), nt(4, { dot: true }), nt(8)],
  ] },
  { id: 'tie', beats: 4, pickup: 0, rows: [
    [nt(2), nt(4), nt(4), nt(4), nt(4), nt(2)],
    [nt(2), nt(4), nt(4, { tie: true }), nt(4), nt(4), nt(2)],
  ] },
  { id: 'rest', beats: 4, pickup: 0, rows: [
    [nt(4), nt(4), nt(4), nt(4)],
    [nt(4), rest(4), nt(4), rest(8), nt(8)],
  ] },
  { id: 'sync', beats: 4, pickup: 0, rows: [
    [nt(8), nt(8), nt(8), nt(8), nt(4), nt(4)],
    [nt(8), nt(4, { accent: true }), nt(8), nt(4), nt(4)],
  ] },
  { id: 'pickup', beats: 3, pickup: TQ, rows: [
    [nt(8, { s: 7 }), nt(8, { s: 7 }), nt(4, { s: 9 }), nt(4, { s: 7 }), nt(4, { s: 12 }), nt(2, { s: 11 }), rest(4)],
  ] },
  { id: 'tri', beats: 4, pickup: 0, rows: [
    [nt(8), nt(8), nt(8), nt(8), nt(8), nt(8), nt(8), nt(8)],
    [nt(8), nt(8), trip(8), trip(8), trip(8), nt(8), nt(8), trip(8), trip(8), trip(8)],
  ] },
];
