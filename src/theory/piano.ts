import { NAT, type Note, mod, pcOf } from './note';
import { STAFF_FLAT, STAFF_SHARP, keySignature } from './fifths';
import { majorScale } from './scale';

/* ====================== scale fingering ====================== */

export type Hand = 'rh' | 'lh';
export type ScaleDir = 'up' | 'down';

/** One octave of a major scale, ascending (8 notes), finger 1 = thumb … 5 = little finger. */
export interface ScaleFingering {
  rh: number[];
  lh: number[];
}

const F = (s: string) => s.split('').map(Number);

/** Standard fingerings by pitch class of the tonic (C♯/D♭ and F♯/G♭ share the same keys). */
const FINGERINGS: Record<number, ScaleFingering> = {
  0: { rh: F('12312345'), lh: F('54321321') }, // C
  7: { rh: F('12312345'), lh: F('54321321') }, // G
  2: { rh: F('12312345'), lh: F('54321321') }, // D
  9: { rh: F('12312345'), lh: F('54321321') }, // A
  4: { rh: F('12312345'), lh: F('54321321') }, // E
  11: { rh: F('12312345'), lh: F('43214321') }, // B
  6: { rh: F('23412312'), lh: F('43213214') }, // F♯ / G♭
  1: { rh: F('23123412'), lh: F('32143213') }, // D♭
  8: { rh: F('34123123'), lh: F('32143213') }, // A♭
  3: { rh: F('31234123'), lh: F('32143213') }, // E♭
  10: { rh: F('41231234'), lh: F('32143213') }, // B♭
  5: { rh: F('12341234'), lh: F('54321321') }, // F
};

/** Standard fingering of the major scale on `tonic`, ascending, one octave. */
export function scaleFingering(tonic: Note): ScaleFingering {
  return FINGERINGS[pcOf(tonic)];
}

/**
 * Hand positions: runs of fingers played without crossing.
 * Right hand going up (and left hand going down) starts a new position on each thumb;
 * left hand going up ends a position on each thumb. Returns note indices (ascending order).
 */
export function handPositions(f: number[], hand: Hand): number[][] {
  const out: number[][] = [[]];
  f.forEach((fi, i) => {
    if (hand === 'rh' && fi === 1 && i > 0 && out[out.length - 1].length) out.push([]);
    out[out.length - 1].push(i);
    if (hand === 'lh' && fi === 1 && i < f.length - 1) out.push([]);
  });
  return out.filter((g) => g.length);
}

export interface Crossing {
  /** note index played before the crossing (in playing order) */
  from: number;
  /** note index played right after it */
  to: number;
  /** 'under' = the thumb passes under the hand; 'over' = a finger (3 or 4) crosses over the thumb */
  kind: 'under' | 'over';
}

/** Where the hand crosses, in playing order for the direction. */
export function crossings(f: number[], hand: Hand, dir: ScaleDir): Crossing[] {
  const out: Crossing[] = [];
  const n = f.length;
  for (let k = 0; k < n - 1; k++) {
    const a = dir === 'up' ? k : n - 1 - k;
    const b = dir === 'up' ? k + 1 : n - 2 - k;
    // RH going up and LH going down move toward the little finger: the thumb must pass under
    const outward = (hand === 'rh') === (dir === 'up');
    if (outward && f[b] === 1 && f[a] !== 1) out.push({ from: a, to: b, kind: 'under' });
    if (!outward && f[a] === 1 && f[b] !== 1) out.push({ from: a, to: b, kind: 'over' });
  }
  return out;
}

/* ====================== the grand staff ====================== */

export type Clef = 'treble' | 'bass';

/** Diatonic index of a written note: 7 per octave + letter (C4 = 28 = middle C). */
export const diatonic = (n: Note, oct: number) => oct * 7 + n.letter;
export const MIDDLE_C = 28;

/** Diatonic index of the bottom line of each staff: E4 (treble) and G2 (bass). */
export const BOTTOM_LINE: Record<Clef, number> = { treble: 30, bass: 18 };

/** Position on the staff in half-line steps above the bottom line (0 = bottom line, 1 = first space…). */
export const staffPos = (n: Note, oct: number, clef: Clef) => diatonic(n, oct) - BOTTOM_LINE[clef];

/** Short extra lines (ledger lines) a note at `pos` needs (positions, outside 0–8). */
export function ledgerLines(pos: number): number[] {
  const out: number[] = [];
  for (let p = -2; p >= pos; p -= 2) out.push(p);
  for (let p = 10; p <= pos; p += 2) out.push(p);
  return out;
}

/** Middle C and above go on the treble staff; below it, on the bass staff. */
export const clefFor = (dia: number): Clef => (dia >= MIDDLE_C ? 'treble' : 'bass');

export const fromDiatonic = (d: number) => ({ letter: mod(d, 7), oct: Math.floor(d / 7) });

/** Letters on the lines (0, 2, 4, 6, 8) or spaces (1, 3, 5, 7) of a staff. */
export function staffLetters(clef: Clef, kind: 'line' | 'space'): number[] {
  const start = kind === 'line' ? 0 : 1;
  return [0, 2, 4, 6, 8].slice(0, kind === 'line' ? 5 : 4).map((p) => mod(BOTTOM_LINE[clef] + start + p, 7));
}

/** Semitone of a written note relative to C4 = 0 (B♯3 sounds as C4; C♭5 as B4). */
export const semitoneOf = (n: Note, oct: number) => (oct - 4) * 12 + NAT[n.letter] + n.acc;

/** Octave number of the written note `n` that sounds as semitone `s`. */
export const octaveOf = (n: Note, s: number) => 4 + Math.floor((s - NAT[n.letter] - n.acc) / 12);

/** Accidental a letter carries in the key (from the scale). */
export const keyAcc = (scale: Note[], letter: number) => scale.find((x) => x.letter === letter)?.acc ?? 0;

/**
 * Spell a piano key in a key: the scale note if the key belongs to the scale;
 * otherwise a natural if possible, else a sharp (sharp keys and C) or a flat (flat keys).
 */
export function spellInKey(tonic: Note, s: number): Note {
  const scale = majorScale(tonic);
  const pc = mod(s, 12);
  const inScale = scale.find((x) => pcOf(x) === pc);
  if (inScale) return inScale;
  const sharps = keySignature(tonic).type >= 0;
  const cands: Note[] = [];
  for (let l = 0; l < 7; l++) {
    let a = mod(pc - NAT[l], 12);
    if (a > 6) a -= 12;
    if (Math.abs(a) <= 1) cands.push({ letter: l, acc: a });
  }
  return cands.find((c) => c.acc === 0) ?? cands.find((c) => (sharps ? c.acc > 0 : c.acc < 0)) ?? cands[0];
}

/** The accidental to print before a note in this key: null if the key signature already says it (0 = natural sign). */
export function accidentalToShow(n: Note, scale: Note[]): number | null {
  return keyAcc(scale, n.letter) === n.acc ? null : n.acc;
}

/** Positions of the key signature's sharps or flats on a staff (same order as written). */
export function signaturePositions(tonic: Note, clef: Clef): { acc: number; pos: number }[] {
  const s = keySignature(tonic);
  const table = s.type > 0 ? STAFF_SHARP : STAFF_FLAT;
  // the bass staff is the treble staff two letters lower (G on the bottom line instead of E)
  const shift = clef === 'treble' ? 0 : -2;
  return s.list.map((n) => ({ acc: n.acc, pos: table[n.letter] + shift }));
}

/** The written note on a staff position, with the accidental of the key. */
export function noteAtDiatonic(scale: Note[], d: number): { note: Note; oct: number; s: number } {
  const { letter, oct } = fromDiatonic(d);
  const note = { letter, acc: keyAcc(scale, letter) };
  return { note, oct, s: semitoneOf(note, oct) };
}

/* ====================== left-hand patterns ====================== */

export type LhPattern = 'oompah' | 'broken' | 'alberti';
export const LH_PATTERNS: LhPattern[] = ['oompah', 'broken', 'alberti'];

/** One left-hand event in a 4/4 bar, in eighth notes. `tone` = chord member (1, 3, 5, 8). */
export interface LhEvent {
  at: number;
  len: number;
  tones: number[];
}

/** The bar of each pattern, as chord members (1 root, 3 third, 5 fifth, 8 octave). */
export const LH_BAR: Record<LhPattern, LhEvent[]> = {
  // bass on the strong beats (root, then fifth), chord on the weak ones
  oompah: [
    { at: 0, len: 2, tones: [1] }, { at: 2, len: 2, tones: [3, 5, 8] },
    { at: 4, len: 2, tones: [5] }, { at: 6, len: 2, tones: [3, 5, 8] },
  ],
  // 1-5-8-5: open fifth and octave, one note per eighth
  broken: [1, 5, 8, 5, 1, 5, 8, 5].map((t, i) => ({ at: i, len: 1, tones: [t] })),
  // low-high-middle-high
  alberti: [1, 5, 3, 5, 1, 5, 3, 5].map((t, i) => ({ at: i, len: 1, tones: [t] })),
};

/** Semitone of a chord member above the root `r` (third size 4 for major, 3 for minor). */
export function chordTone(r: number, third: number, tone: number): number {
  const m: Record<number, number> = { 1: 0, 3: third, 5: 7, 8: 12 };
  return r + m[tone];
}
