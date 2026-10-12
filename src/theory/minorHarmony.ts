/**
 * Harmony in a minor key: the triads of the natural and harmonic minor, the chords used in
 * practice (a mixture of both), their functions and the usual progressions and cadences.
 * Pure functions; every note is spelled by letter + accidental (V of G♯ minor = D♯ F𝄪 A♯).
 */
import { type Note, pcOf } from './note';
import { closeVoicing, qualityOf, spellAbove } from './harmony';
import { harmonicMinor, naturalMinor } from './scales';

export type MinorTriadQuality = 'maj' | 'min' | 'dim' | 'aug';
export type MinorFunction = 'T' | 'SD' | 'D';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

/** Roman numeral from degree (0–6) and quality: upper case major/augmented, lower case minor/diminished. */
export function minorRoman(degree: number, q: MinorTriadQuality): string {
  const r = ROMAN[degree];
  if (q === 'maj') return r;
  if (q === 'aug') return r + '+';
  return r.toLowerCase() + (q === 'dim' ? '°' : '');
}

/** Quality of a root-position triad (root, 3rd, 5th). */
export function triadQuality(notes: Note[]): MinorTriadQuality {
  const q = qualityOf(notes.slice(0, 3));
  return q === 'dom7' ? 'maj' : q;
}

export interface MinorTriad {
  /** 0–6 */
  degree: number;
  notes: Note[];
  quality: MinorTriadQuality;
  roman: string;
  /** indexes (0 root, 1 third, 2 fifth) of chord tones that are the raised 7th */
  raised: number[];
}

/** The triad on `degree` of the natural or harmonic minor on `tonic`. */
export function minorTriad(tonic: Note, degree: number, form: 'natural' | 'harmonic'): MinorTriad {
  const sc = form === 'natural' ? naturalMinor(tonic) : harmonicMinor(tonic);
  const notes = [sc[degree], sc[(degree + 2) % 7], sc[(degree + 4) % 7]];
  const quality = triadQuality(notes);
  const raised = form === 'harmonic' ? [0, 1, 2].filter((i) => (degree + 2 * i) % 7 === 6) : [];
  return { degree, notes, quality, roman: minorRoman(degree, quality), raised };
}

/** The seven triads of one form of the minor scale. */
export const minorTriads = (tonic: Note, form: 'natural' | 'harmonic') =>
  Array.from({ length: 7 }, (_, d) => minorTriad(tonic, d, form));

/** Degrees whose triad contains degree 7 (and so change when it is raised): III, v, VII. */
export const DEGREES_WITH_SEVENTH = [2, 4, 6];

/* ---------- the chords used in practice ---------- */

export type MinorChordId = 'i' | 'I' | 'iio' | 'III' | 'III+' | 'iv' | 'v' | 'V' | 'VI' | 'VII' | 'viio';

interface ChordSpec {
  degree: number;
  form: 'natural' | 'harmonic' | 'picardy';
}
const SPEC: Record<MinorChordId, ChordSpec> = {
  i: { degree: 0, form: 'natural' },
  I: { degree: 0, form: 'picardy' },
  iio: { degree: 1, form: 'natural' },
  III: { degree: 2, form: 'natural' },
  'III+': { degree: 2, form: 'harmonic' },
  iv: { degree: 3, form: 'natural' },
  v: { degree: 4, form: 'natural' },
  V: { degree: 4, form: 'harmonic' },
  VI: { degree: 5, form: 'natural' },
  VII: { degree: 6, form: 'natural' },
  viio: { degree: 6, form: 'harmonic' },
};

/** Function of each chord in a minor key (same logic as in major: shared notes with i, iv or V). */
export const MINOR_FUNCTION: Record<MinorChordId, MinorFunction> = {
  i: 'T', I: 'T', III: 'T', 'III+': 'T', VI: 'T',
  iio: 'SD', iv: 'SD',
  v: 'D', V: 'D', viio: 'D', VII: 'D',
};

/** The chords a minor key uses in practice: natural minor chords, plus V and vii° from the harmonic minor. */
export const MINOR_USUAL: MinorChordId[] = ['i', 'iio', 'III', 'iv', 'V', 'VI', 'viio', 'VII'];

export interface MinorChord extends MinorTriad {
  id: MinorChordId;
  fn: MinorFunction;
}

/** One chord of the minor key, by id. 'I' is the Picardy third: the tonic triad with a major 3rd. */
export function minorChord(tonic: Note, id: MinorChordId): MinorChord {
  const { degree, form } = SPEC[id];
  if (form === 'picardy') {
    const notes = [tonic, spellAbove(tonic, 2, 4), spellAbove(tonic, 4, 7)];
    return { id, fn: MINOR_FUNCTION[id], degree, notes, quality: 'maj', roman: 'I', raised: [] };
  }
  return { id, fn: MINOR_FUNCTION[id], ...minorTriad(tonic, degree, form) };
}

/** The leading tone of a minor key: degree 7 raised a half step, same letter. */
export const minorLeadingTone = (tonic: Note): Note => harmonicMinor(tonic)[6];

/** The subtonic: the natural degree 7, a whole step below the tonic. */
export const subtonic = (tonic: Note): Note => naturalMinor(tonic)[6];

/* ---------- progressions and cadences ---------- */

export type MinorProgId = 'basic' | 'pop' | 'andalusian' | 'picardy' | 'half';
export const MINOR_PROGS: Record<MinorProgId, MinorChordId[]> = {
  basic: ['i', 'iv', 'V', 'i'],
  pop: ['i', 'VI', 'III', 'VII'],
  andalusian: ['i', 'VII', 'VI', 'V'],
  picardy: ['i', 'iv', 'V', 'I'],
  half: ['i', 'VI', 'iv', 'V'],
};
export const MINOR_PROG_IDS: MinorProgId[] = ['basic', 'half', 'picardy', 'andalusian', 'pop'];

/** Notes shared by two chords (by spelling). */
export function sharedNotes(a: Note[], b: Note[]): Note[] {
  return a.filter((x) => b.some((y) => y.letter === x.letter && y.acc === x.acc));
}

export interface VoicedStep {
  chord: MinorChord;
  /** close voicing (semitones, C4 = 0) */
  upper: number[];
  /** bass: the root, an octave lower */
  bass: number;
}

/** Each chord of a progression in close position, moving each voice as little as possible. */
export function voiceMinorProg(tonic: Note, ids: MinorChordId[], lo = 0, hi = 23, center = 8): VoicedStep[] {
  let prev: number[] | null = null;
  return ids.map((id) => {
    const chord = minorChord(tonic, id);
    const upper = closeVoicing(chord.notes.map(pcOf), prev, lo, hi, center);
    prev = upper;
    const r = pcOf(chord.notes[0]);
    return { chord, upper, bass: lo - 12 + r };
  });
}

/** Bass line (root pitch classes) of a progression. */
export const bassLine = (tonic: Note, ids: MinorChordId[]): Note[] => ids.map((id) => minorChord(tonic, id).notes[0]);
