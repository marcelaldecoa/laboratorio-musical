/** Famous progressions as scale degrees (0 = I). Names/descriptions live in i18n. */
export const PROGRESSIONS: { id: string; degrees: number[]; named?: boolean }[] = [
  { id: 'story', degrees: [0, 3, 4, 0] },
  { id: 'pop', degrees: [0, 4, 5, 3] },
  { id: 'popMinor', degrees: [5, 3, 0, 4] },
  { id: 'fifties', degrees: [0, 5, 3, 4] },
  { id: 'twoFiveOne', degrees: [1, 4, 0] },
  { id: 'cycle', degrees: [5, 1, 4, 0] },
  { id: 'plagal', degrees: [0, 3, 0] },
  { id: 'deceptive', degrees: [0, 3, 4, 5] },
  { id: 'pachelbel', degrees: [0, 4, 5, 2, 3, 0, 3, 4], named: true },
  { id: 'phrase8', degrees: [0, 5, 3, 4, 0, 5, 1, 4, 0], named: true },
];
