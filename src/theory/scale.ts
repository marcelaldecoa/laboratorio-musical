import { NAT, type Note, mod, pcOf } from './note';

/** Semitone offsets of the major scale from the tonic (W W H W W W H). */
export const MAJOR_OFFSETS = [0, 2, 4, 5, 7, 9, 11] as const;

/** Major scale spelled one letter per degree. */
export function majorScale(tonic: Note): Note[] {
  const tp = pcOf(tonic);
  return MAJOR_OFFSETS.map((o, i) => {
    const letter = (tonic.letter + i) % 7;
    let acc = mod(mod(tp + o, 12) - NAT[letter], 12);
    if (acc > 6) acc -= 12;
    return { letter, acc };
  });
}

/** Absolute semitones (relative to C4 = 0) of the scale from `base`, plus the octave. */
export function scaleSemitones(base: number): number[] {
  return [...MAJOR_OFFSETS.map((o) => base + o), base + 12];
}
