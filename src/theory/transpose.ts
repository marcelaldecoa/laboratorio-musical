import { NAT, type Note, mod, pcOf } from './note';
import { type Quality, quality } from './interval';
import { majorScale } from './scale';

/**
 * Transposition: moving music to another key. Every note moves by the same interval, spelled
 * by letter (degree by degree), never by counting semitones alone.
 */

/** Accidental (−6..+6, normally −2..+2) that gives `letter` the pitch class `pc`. */
export function accFor(letter: number, pc: number): number {
  let acc = mod(pc - NAT[letter], 12);
  if (acc > 6) acc -= 12;
  return acc;
}

/** The interval from tonic `from` up to tonic `to`: letters moved (0–6), half steps (0–11), number and quality. */
export function keyInterval(from: Note, to: Note): { letters: number; semis: number; num: number; quality: Quality } {
  const letters = mod(to.letter - from.letter, 7);
  const semis = mod(pcOf(to) - pcOf(from), 12);
  const num = letters + 1;
  return { letters, semis, num, quality: num === 1 ? (semis === 0 ? 'P' : semis < 6 ? 'A' : 'd') : quality(num, semis) };
}

/** Moves one note by the interval from key `from` to key `to`: letter by the letter distance, pitch by the semitone distance. */
export function transposeNote(n: Note, from: Note, to: Note): Note {
  const { letters, semis } = keyInterval(from, to);
  const letter = (n.letter + letters) % 7;
  return { letter, acc: accFor(letter, pcOf(n) + semis) };
}

/** A melody written as scale degrees (0 = degree 1; −1 = degree 7 below; 7 = the octave) read in a key. */
export function degreeNote(tonic: Note, deg: number): Note {
  return majorScale(tonic)[mod(deg, 7)];
}

/** Semitones above the tonic of a degree, counting octaves (deg −1 → −1, deg 7 → 12). */
export function degreeSemis(deg: number): number {
  const OFF = [0, 2, 4, 5, 7, 9, 11];
  return OFF[mod(deg, 7)] + 12 * Math.floor(deg / 7);
}

/**
 * The name you get by counting semitones only and writing every black key with the same accidental
 * (sharps for sharp keys, flats otherwise) and every white key natural. This is the mistake to avoid:
 * it can give two notes with the same letter (A♯ and A in F major) and lose a letter.
 */
export function naiveName(pc: number, preferSharps: boolean): Note {
  const p = mod(pc, 12);
  const white = NAT.indexOf(p as (typeof NAT)[number]);
  if (white >= 0) return { letter: white, acc: 0 };
  if (preferSharps) return { letter: NAT.indexOf(((p - 1) % 12) as (typeof NAT)[number]), acc: 1 };
  return { letter: NAT.indexOf(((p + 1) % 12) as (typeof NAT)[number]), acc: -1 };
}

/** The other common spelling of the same key (E♯ ↔ F, C♭ ↔ B, F♯ ↔ G♭): the neighboring letter. */
export function enharmonic(n: Note): Note {
  const letter = n.acc > 0 || (n.acc === 0 && [2, 6].includes(n.letter)) ? (n.letter + 1) % 7 : (n.letter + 6) % 7;
  return { letter, acc: accFor(letter, pcOf(n)) };
}

/**
 * The degree (1–6, never the tonic, whose name the key already gives) of a key's scale that best shows "spell by letter": the first one whose enharmonic
 * spelling is a natural letter (E♯, B♯, C♭, F♭), otherwise the first with an accidental; null in C major.
 */
export function spellingTrap(tonic: Note): number | null {
  const sc = majorScale(tonic);
  const nat = sc.findIndex((n, i) => i > 0 && n.acc !== 0 && enharmonic(n).acc === 0);
  if (nat >= 0) return nat;
  const any = sc.findIndex((n, i) => i > 0 && n.acc !== 0);
  return any >= 0 ? any : null;
}

/** A short tune in scale degrees, one bar per chord, quarter notes (a bar of one note = a whole note). */
export const TUNE: { chord: number; melody: number[] }[] = [
  { chord: 0, melody: [2, 3, 4, 2] },
  { chord: 3, melody: [5, 4, 3, 5] },
  { chord: 4, melody: [4, 3, 1, -1] },
  { chord: 0, melody: [0] },
];
