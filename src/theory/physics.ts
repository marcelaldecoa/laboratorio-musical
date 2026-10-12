import { fifthIndex, fromFifthIndex } from './fifths';
import { type Note, mod } from './note';

/** Frequency of middle C (C4) in equal temperament with A4 = 440 Hz. */
export const C4_HZ = 440 * Math.pow(2, -9 / 12);

/** Equal-tempered frequency of a piano key (semitones from C4). */
export const keyHz = (s: number) => C4_HZ * Math.pow(2, s / 12);

/** Frequency of harmonic `n` (1 = the fundamental) over a fundamental `f0`. */
export const harmonicHz = (f0: number, n: number) => f0 * n;

/** Size of a frequency ratio in cents (1200 cents = one octave). */
export const cents = (ratio: number) => 1200 * Math.log2(ratio);

/** Distance in semitones from the fundamental to the piano key nearest harmonic `n`. */
export const nearestSemitone = (n: number) => Math.round(cents(n) / 100);

/** How far harmonic `n` is from its nearest piano key, in cents (− = lower, + = higher). */
export const centsOff = (n: number) => cents(n) - 100 * nearestSemitone(n);

/** Harmonics more than this many cents away from the piano are "noticeably off". */
export const OFF_LIMIT = 20;

export const isOff = (n: number) => Math.abs(centsOff(n)) > OFF_LIMIT;

/** Steps on the line of fifths from the tonic for each pitch class above it that the first 16 harmonics reach. */
const FIFTHS_FROM_TONIC: Record<number, number> = { 0: 0, 2: 2, 4: 4, 6: 6, 7: 1, 8: -4, 10: -2, 11: 5 };

/** Octave-reduced ratio n / 2^k, as [numerator, denominator] (e.g. 3 → 3/2, 5 → 5/4, 8 → 1/1). */
export function octaveReduced(n: number): [number, number] {
  let d = 1;
  while (n / d >= 2) d *= 2;
  const g = gcd(n, d);
  return [n / g, d / g];
}

export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export interface Harmonic {
  /** harmonic number, 1 = fundamental */
  n: number;
  /** semitones from the fundamental to the nearest key */
  semis: number;
  /** deviation from that key in cents */
  off: number;
  /** spelled note name (letter + accidental) relative to the tonic */
  note: Note;
  /** octave-reduced ratio */
  ratio: [number, number];
}

/** The first `count` harmonics of a fundamental whose pitch class is `tonic`, spelled by letter. */
export function harmonicSeries(tonic: Note, count = 16): Harmonic[] {
  const f = fifthIndex(tonic);
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const semis = nearestSemitone(n);
    const step = FIFTHS_FROM_TONIC[mod(semis, 12)];
    if (step === undefined) throw new Error('no spelling for harmonic ' + n);
    return { n, semis, off: centsOff(n), note: fromFifthIndex(f + step), ratio: octaveReduced(n) };
  });
}

/**
 * Harmonics of the lower note (up to `limit`) that coincide with a harmonic of the upper note,
 * for an interval with frequency ratio p:q (p > q, in lowest terms). They are the multiples of p.
 */
export function sharedHarmonics(p: number, q: number, limit = 16): number[] {
  const out: number[] = [];
  for (let k = 1; k <= limit; k++) if ((k * q) % p === 0) out.push(k);
  return out;
}

/** Simple intervals with their just ratios, from most to least consonant. */
export const JUST_INTERVALS: { id: string; p: number; q: number; semis: number }[] = [
  { id: '8', p: 2, q: 1, semis: 12 },
  { id: '5', p: 3, q: 2, semis: 7 },
  { id: '4', p: 4, q: 3, semis: 5 },
  { id: 'M3', p: 5, q: 4, semis: 4 },
  { id: 'm3', p: 6, q: 5, semis: 3 },
  { id: 'M2', p: 9, q: 8, semis: 2 },
  { id: 'm2', p: 16, q: 15, semis: 1 },
];

/* ---------- consonance ---------- */

export type ConsClass = 'perfect' | 'imperfect' | 'dissonant';

export interface ConsInterval {
  /** short id: quality letter + number (P8, M3, m2, A4…) */
  id: string;
  /** interval number (2nd = 2…) */
  num: number;
  /** size in half steps on the piano */
  semis: number;
  /** just ratio p:q (p > q, lowest terms) */
  p: number;
  q: number;
  /** steps on the line of fifths from the lower note to the upper one (gives the spelling) */
  fifths: number;
  /** traditional class (common-practice counterpoint) */
  cls: ConsClass;
}

/** The intervals inside one octave with their just ratios (the tritone as 45:32, from stacked fifths and thirds). */
export const CONS_INTERVALS: ConsInterval[] = [
  { id: 'P8', num: 8, semis: 12, p: 2, q: 1, fifths: 0, cls: 'perfect' },
  { id: 'P5', num: 5, semis: 7, p: 3, q: 2, fifths: 1, cls: 'perfect' },
  { id: 'P4', num: 4, semis: 5, p: 4, q: 3, fifths: -1, cls: 'perfect' },
  { id: 'M6', num: 6, semis: 9, p: 5, q: 3, fifths: 3, cls: 'imperfect' },
  { id: 'M3', num: 3, semis: 4, p: 5, q: 4, fifths: 4, cls: 'imperfect' },
  { id: 'm3', num: 3, semis: 3, p: 6, q: 5, fifths: -3, cls: 'imperfect' },
  { id: 'm6', num: 6, semis: 8, p: 8, q: 5, fifths: -4, cls: 'imperfect' },
  { id: 'm7', num: 7, semis: 10, p: 9, q: 5, fifths: -2, cls: 'dissonant' },
  { id: 'M2', num: 2, semis: 2, p: 9, q: 8, fifths: 2, cls: 'dissonant' },
  { id: 'M7', num: 7, semis: 11, p: 15, q: 8, fifths: 5, cls: 'dissonant' },
  { id: 'm2', num: 2, semis: 1, p: 16, q: 15, fifths: -5, cls: 'dissonant' },
  { id: 'A4', num: 4, semis: 6, p: 45, q: 32, fifths: 6, cls: 'dissonant' },
];

/**
 * The first harmonic of the lower note that coincides with one of the upper note: harmonic p
 * (= harmonic q of the upper note). The sooner the two series meet, the more consonant the interval.
 */
export const firstShared = (p: number) => p;

/** Sort from most to least consonant: the earlier the first shared harmonic (p), then the smaller q. */
export function byConsonance<T extends { p: number; q: number }>(list: T[]): T[] {
  return [...list].sort((a, b) => a.p - b.p || a.q - b.q);
}

/** Two voices given as scale degrees (0 = tonic; 7 and up = the next octave). */
export interface Resolution {
  id: string;
  from: [number, number];
  to: [number, number];
}

/** Classic resolutions: a dissonance moves by step into a consonance. */
export const RESOLUTIONS: Resolution[] = [
  { id: 'second', from: [0, 1], to: [0, 2] },
  { id: 'fourth', from: [0, 3], to: [0, 2] },
  { id: 'tritone', from: [3, 6], to: [2, 7] },
  { id: 'dim5', from: [6, 10], to: [7, 9] },
];

const MAJOR = [0, 2, 4, 5, 7, 9, 11];
/** Half steps above the tonic of a scale degree (0-based, may be ≥ 7). */
export const degreeSemis = (d: number) => MAJOR[mod(d, 7)] + 12 * Math.floor(d / 7);

/** Number and half steps of the interval between two degrees (lower first). */
export function degreeInterval(a: number, b: number): { num: number; semis: number } {
  return { num: b - a + 1, semis: degreeSemis(b) - degreeSemis(a) };
}
