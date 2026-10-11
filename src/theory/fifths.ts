import { type Note, mod, note, sameNote } from './note';
import { majorScale } from './scale';

export type Direction = 'cw' | 'ccw';
export type Enharmonic = 'Fs' | 'Gb';

/** Circle slots 0–11 clockwise from C; slot 6 is F♯/G♭ and depends on context. */
export const SLOTS: (Note | null)[] = [
  note(0), note(4), note(1), note(5), note(2), note(6), null,
  note(1, -1), note(5, -1), note(2, -1), note(6, -1), note(3),
];
export const FS = note(3, 1);
export const GB = note(4, -1);

export const SHARP_ORDER = [3, 0, 4, 1, 5, 2, 6];
export const FLAT_ORDER = [6, 2, 5, 1, 4, 0, 3];
/** Staff position (half line steps above the bottom treble line) of each sharp/flat. */
export const STAFF_SHARP: Record<number, number> = { 3: 8, 0: 5, 4: 9, 1: 6, 5: 3, 2: 7, 6: 4 };
export const STAFF_FLAT: Record<number, number> = { 6: 4, 2: 7, 5: 3, 1: 6, 4: 2, 0: 5, 3: 1 };

export interface KeySignature {
  /** 1 = sharps, −1 = flats, 0 = none */
  type: 1 | -1 | 0;
  list: Note[];
}

export function keySignature(tonic: Note): KeySignature {
  const acc = majorScale(tonic).filter((n) => n.acc !== 0);
  if (!acc.length) return { type: 0, list: [] };
  const sharp = acc[0].acc > 0;
  const order = sharp ? SHARP_ORDER : FLAT_ORDER;
  return {
    type: sharp ? 1 : -1,
    list: order.map((l) => acc.find((n) => n.letter === l)).filter((n): n is Note => !!n),
  };
}

export function sigShort(tonic: Note): string {
  const s = keySignature(tonic);
  return s.type === 0 ? '0' : s.list.length + (s.type > 0 ? '♯' : '♭');
}

/** The spelling shown in a slot. */
export function displayed(k: number, enh: Enharmonic): Note {
  return k === 6 ? (enh === 'Gb' ? GB : FS) : (SLOTS[k] as Note);
}

/** The spelling you logically arrive at when travelling in `dir`. */
export function logical(k: number, dir: Direction): Note {
  return k === 6 ? (dir === 'cw' ? FS : GB) : (SLOTS[k] as Note);
}

export const predSlot = (k: number, dir: Direction) => (dir === 'cw' ? mod(k - 1, 12) : mod(k + 1, 12));

export function predLogical(k: number, dir: Direction): Note {
  const p = predSlot(k, dir);
  if (p === 6) return dir === 'cw' ? GB : FS;
  return SLOTS[p] as Note;
}

export interface ScaleDiff {
  letter: number;
  from: number;
  to: number;
  /** degree 1–7 in the new key */
  deg: number;
}

/** The single note that changes between neighboring keys. */
export function scaleDiff(prev: Note, cur: Note): ScaleDiff | null {
  const pm: Record<number, number> = {};
  majorScale(prev).forEach((n) => (pm[n.letter] = n.acc));
  const sc = majorScale(cur);
  for (let i = 0; i < 7; i++) {
    const n = sc[i];
    if (pm[n.letter] !== n.acc) return { letter: n.letter, from: pm[n.letter], to: n.acc, deg: i + 1 };
  }
  return null;
}

/* ---------- line of fifths ---------- */
const LINE_INDEX = [1, 3, 5, 0, 2, 4, 6];
const LINE_ORDER = [3, 0, 4, 1, 5, 2, 6];

/** Position on the line of fifths (F = 0, C = 1, G = 2 …; each ♯ adds 7). */
export const fifthIndex = (n: Note) => LINE_INDEX[n.letter] + 7 * n.acc;
export const fromFifthIndex = (f: number): Note => note(LINE_ORDER[mod(f, 7)], Math.floor(f / 7));

/** Circle slot of any tonic (useful to jump to a key). */
export function slotOf(n: Note): number {
  const k = SLOTS.findIndex((s) => s && sameNote(s, n));
  if (k >= 0) return k;
  if (sameNote(n, FS) || sameNote(n, GB)) return 6;
  return mod(fifthIndex(n) - 1, 12);
}
