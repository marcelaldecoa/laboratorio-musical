import { type Note, pcOf } from './note';

export type TriadQuality = 'maj' | 'min' | 'dim';
export type HarmonicFunction = 'T' | 'SD' | 'D';

/** Position of each degree inside the 7-slot window (F C G D A E B ↔ 4 1 5 2 6 3 7). */
export const WINDOW_SLOT = [1, 3, 5, 0, 2, 4, 6];
export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
export const FUNCTION_OF: HarmonicFunction[] = ['T', 'SD', 'T', 'SD', 'D', 'T', 'D'];

export interface ChordInfo {
  degree: number;
  /** slot on the window, 0 = subdominant … 6 = leading tone */
  slot: number;
  quality: TriadQuality;
  roman: string;
  root: Note;
  /** suffix for the chord symbol: '' | 'm' | '°' */
  suffix: string;
}

export function chordInfo(scale: Note[], degree: number): ChordInfo {
  const slot = WINDOW_SLOT[degree];
  const quality: TriadQuality = slot <= 2 ? 'maj' : slot <= 5 ? 'min' : 'dim';
  const roman = quality === 'maj' ? ROMAN[degree] : ROMAN[degree].toLowerCase() + (quality === 'dim' ? '°' : '');
  const suffix = quality === 'min' ? 'm' : quality === 'dim' ? '°' : '';
  return { degree, slot, quality, roman, root: scale[degree], suffix };
}

export const triad = (scale: Note[], degree: number): Note[] => [
  scale[degree],
  scale[(degree + 2) % 7],
  scale[(degree + 4) % 7],
];

/** Half steps root→third and third→fifth. */
export function triadSteps(q: TriadQuality): [number, number] {
  return [q === 'maj' ? 4 : 3, q === 'min' ? 4 : 3];
}

/** Notes of chord `b` that are also in chord `a`. */
export function commonTones(scale: Note[], a: number, b: number): Note[] {
  const A = triad(scale, a).map(pcOf);
  return triad(scale, b).filter((n) => A.includes(pcOf(n)));
}

/** The three diatonic chords that contain a melody degree: as root, third and fifth. */
export function harmonizations(melodyDegree: number): { degree: number; role: 'root' | 'third' | 'fifth' }[] {
  return [
    { degree: melodyDegree, role: 'root' },
    { degree: (melodyDegree + 5) % 7, role: 'third' },
    { degree: (melodyDegree + 3) % 7, role: 'fifth' },
  ];
}
