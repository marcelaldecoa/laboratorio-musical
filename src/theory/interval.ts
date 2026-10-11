import { MAJOR_OFFSETS } from './scale';

export type Quality = 'P' | 'M' | 'm' | 'A' | 'd';

/** Size in half steps of each interval number measured from the tonic of the major scale. */
export const REF: Record<number, number> = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 12 };
export const PERFECT_NUMBERS = [1, 4, 5, 8];

export function quality(num: number, semis: number): Quality {
  const d = semis - REF[num];
  if (PERFECT_NUMBERS.includes(num)) return d === 0 ? 'P' : d < 0 ? 'd' : 'A';
  return d === 0 ? 'M' : d === -1 ? 'm' : d > 0 ? 'A' : 'd';
}

/** Half steps of the interval `num` (2–8) starting on degree index `from` (0–6) of a major scale. */
export function diatonicSize(from: number, num: number): number {
  const step = num - 1;
  if (step === 7) return 12;
  return (MAJOR_OFFSETS[(from + step) % 7] - MAJOR_OFFSETS[from] + 12) % 12;
}

/** The 7 diatonic intervals of a number, one from each degree. */
export function census(num: number): { from: number; semis: number; quality: Quality }[] {
  return [0, 1, 2, 3, 4, 5, 6].map((from) => {
    const semis = diatonicSize(from, num);
    return { from, semis, quality: quality(num, semis) };
  });
}

export const invertNumber = (num: number) => 9 - num;
export const invertSemis = (semis: number) => 12 - semis;
