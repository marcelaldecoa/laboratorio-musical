import { fifthIndex } from './fifths';
import { quality } from './interval';
import { NAT, type Note, mod, pcOf } from './note';
import { ROMAN } from './chord';

/** Chord symbol style: Brazilian cifra (C7M, Bm7(♭5)) or common English (Cmaj7, Bm7♭5). */
export type SymbolStyle = 'pt' | 'en';

/** One chord tone: interval number above the root (1, 3, 5, 7, 9 …) and its size in half steps. */
export interface ChordTone {
  num: number;
  semis: number;
}

/** The note `num` letter names above `root` (counting both ends), `semis` half steps above it. */
export function noteAt(root: Note, num: number, semis: number): Note {
  const letter = (root.letter + num - 1) % 7;
  const acc = mod(pcOf(root) + semis - NAT[letter] + 6, 12) - 6;
  return { letter, acc };
}

/** Interval number between two spelled notes (b above a, within an octave): 1–7. */
export const intervalNumber = (a: Note, b: Note) => mod(b.letter - a.letter, 7) + 1;

/** Half steps from a up to b, 0–11. */
export const semisUp = (a: Note, b: Note) => mod(pcOf(b) - pcOf(a), 12);

/* ---------- seventh chords ---------- */

export type SeventhQuality = 'maj7' | 'dom7' | 'min7' | 'hdim7' | 'dim7';
export const SEVENTH_QUALITIES: SeventhQuality[] = ['maj7', 'dom7', 'min7', 'hdim7', 'dim7'];

/** Half steps of root, 3rd, 5th and 7th above the root. */
export const SEVENTH_SEMIS: Record<SeventhQuality, [number, number, number, number]> = {
  maj7: [0, 4, 7, 11],
  dom7: [0, 4, 7, 10],
  min7: [0, 3, 7, 10],
  hdim7: [0, 3, 6, 10],
  dim7: [0, 3, 6, 9],
};

/** Sizes of the three stacked thirds (e.g. 7M = 4 + 3 + 4). */
export const thirdsOf = (q: SeventhQuality) => {
  const s = SEVENTH_SEMIS[q];
  return [s[1] - s[0], s[2] - s[1], s[3] - s[2]];
};

/** Seventh chord on any root, spelled by letter (root, 3rd, 5th, 7th). */
export function seventhNotes(root: Note, q: SeventhQuality): Note[] {
  return SEVENTH_SEMIS[q].map((s, i) => noteAt(root, 1 + 2 * i, s));
}

/** Quality from the sizes of the 3rd, 5th and 7th. */
export function seventhQualityOf(notes: Note[]): SeventhQuality | null {
  const r = notes[0];
  const key = notes.slice(1).map((n) => semisUp(r, n)).join(',');
  return SEVENTH_QUALITIES.find((q) => SEVENTH_SEMIS[q].slice(1).join(',') === key) ?? null;
}

/** Diatonic seventh chord on a degree: every other scale note, four times. */
export const diatonicSeventh = (scale: Note[], degree: number): Note[] =>
  [0, 2, 4, 6].map((k) => scale[(degree + k) % 7]);

export function seventhSuffix(q: SeventhQuality, style: SymbolStyle): string {
  switch (q) {
    case 'maj7': return style === 'pt' ? '7M' : 'maj7';
    case 'dom7': return '7';
    case 'min7': return 'm7';
    case 'hdim7': return style === 'pt' ? 'm7(♭5)' : 'm7♭5';
    case 'dim7': return '°7';
  }
}

/** Roman numeral of a seventh chord: I7M / Imaj7, ii7, V7, viiø7, vii°7. */
export function seventhRoman(degree: number, q: SeventhQuality, style: SymbolStyle): string {
  const R = ROMAN[degree];
  switch (q) {
    case 'maj7': return R + (style === 'pt' ? '7M' : 'maj7');
    case 'dom7': return R + '7';
    case 'min7': return R.toLowerCase() + '7';
    case 'hdim7': return R.toLowerCase() + 'ø7';
    case 'dim7': return R.toLowerCase() + '°7';
  }
}

/** Letter name with any number of accidentals (cifras always use letters A–G). */
export function letterName(n: Note): string {
  const acc = n.acc > 0 ? (n.acc === 2 ? '𝄪' : '♯'.repeat(n.acc)) : n.acc < 0 ? (n.acc === -2 ? '𝄫' : '♭'.repeat(-n.acc)) : '';
  return 'CDEFGAB'[n.letter] + acc;
}

export interface SeventhInfo {
  degree: number;
  quality: SeventhQuality;
  notes: Note[];
}

export function diatonicSeventhInfo(scale: Note[], degree: number): SeventhInfo {
  const notes = diatonicSeventh(scale, degree);
  return { degree, notes, quality: seventhQualityOf(notes)! };
}

/** Each chord tone's offset from the root on the line of fifths (the chord's "shape"). */
export const fifthShape = (notes: Note[]) => notes.map((n) => fifthIndex(n) - fifthIndex(notes[0]));

/* ---------- inversions and voicing ---------- */

/** Rotate a chord so that tone `k` is in the bass (0 = root position). */
export const invert = <T>(notes: T[], k: number): T[] => [...notes.slice(k), ...notes.slice(0, k)];

/** Absolute semitones of pitch classes stacked upward, the first one at or above `base`. */
export function stackUp(pcs: number[], base: number): number[] {
  const out: number[] = [];
  let x = base + mod(pcs[0] - base, 12);
  out.push(x);
  for (let i = 1; i < pcs.length; i++) {
    x = x + 1 + mod(pcs[i] - x - 1, 12);
    out.push(x);
  }
  return out;
}

/** Intervals above the bass (generic numbers, e.g. 1st inversion triad = 3 and 6: “6” in figured bass). */
export function intervalsAboveBass(notes: Note[]): number[] {
  return notes.slice(1).map((n) => intervalNumber(notes[0], n));
}

/* ---------- extensions ---------- */

export interface Extension {
  num: 9 | 11 | 13;
  note: Note;
  /** half steps above the root (14–21) */
  semis: number;
  /** a half step above a chord tone: clashes (minor 9th against it) */
  avoid: boolean;
  /** the chord tone it clashes with */
  clash: Note | null;
}

/** Interval number with its compound size reduced: 9 → 2, 11 → 4, 13 → 6 (n + 8 − 1 goes back). */
export const simpleNumber = (num: number) => (num > 8 ? num - 7 : num);

/** The diatonic 9th, 11th and 13th over the seventh chord on `degree`, with the avoid-note test. */
export function extensionsOf(scale: Note[], degree: number): Extension[] {
  const chord = diatonicSeventh(scale, degree);
  const r = chord[0];
  return ([9, 11, 13] as const).map((num) => {
    const note = scale[(degree + num - 1) % 7];
    const semis = semisUp(r, note) + 12;
    const clash = chord.find((c) => semisUp(c, note) === 1) ?? null;
    return { num, note, semis, avoid: !!clash, clash };
  });
}

/** Size of the major (or perfect) interval for any number up to 13, from the major scale. */
export function majorSize(num: number): number {
  const simple = [0, 2, 4, 5, 7, 9, 11][(num - 1) % 7];
  return simple + 12 * Math.floor((num - 1) / 7);
}

/** Chord-tone label as in jazz charts: 1, ♭3, 5, ♭7, 𝄫7, 9, ♯11, ♭13 … */
export function toneLabel(t: ChordTone): string {
  const d = t.semis - majorSize(t.num);
  const acc = d === -2 ? '𝄫' : d === -1 ? '♭' : d === 1 ? '♯' : d === 2 ? '𝄪' : '';
  return acc + t.num;
}

/** Interval quality (P M m A d) of any chord tone, compound ones reduced by an octave. */
export function toneQuality(t: ChordTone) {
  const n = simpleNumber(t.num);
  return quality(n, t.semis - (t.num > 8 ? 12 : 0));
}

/** Pitch class of each tone (handy for sound). */
export const tonePcs = (root: Note, tones: ChordTone[]) => tones.map((t) => pcOf(root) + t.semis);
