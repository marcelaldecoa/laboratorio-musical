/** A note is a letter (0 = C … 6 = B) plus an accidental (−2 = 𝄫 … +2 = 𝄪). */
export interface Note {
  letter: number;
  acc: number;
}

export type Notation = 'en' | 'pt';

/** Pitch class of each natural letter, C D E F G A B. */
export const NAT = [0, 2, 4, 5, 7, 9, 11] as const;
export const LETTERS_EN = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
export const LETTERS_PT = ['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Si'] as const;
export const ACC_SYMBOL: Record<number, string> = { [-2]: '𝄫', [-1]: '♭', 0: '', 1: '♯', 2: '𝄪' };

export const note = (letter: number, acc = 0): Note => ({ letter, acc });

export const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Pitch class 0–11. */
export const pcOf = (n: Note) => mod(NAT[n.letter] + n.acc, 12);

export const sameNote = (a: Note, b: Note) => a.letter === b.letter && a.acc === b.acc;

/** Name from letter + accidental, never from pitch class (so F♯ major keeps E♯). */
export function noteName(n: Note, notation: Notation): string {
  const letters = notation === 'pt' ? LETTERS_PT : LETTERS_EN;
  return letters[n.letter] + ACC_SYMBOL[n.acc];
}

export const isBlackKey = (s: number) => [1, 3, 6, 8, 10].includes(mod(s, 12));
