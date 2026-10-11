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
