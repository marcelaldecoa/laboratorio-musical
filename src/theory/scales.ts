/* Scales beyond the major: minor forms, modes, pentatonics and symmetric scales.
   Every spelling is letter + accidental (never a name from the pitch class). */
import { NAT, type Note, mod, pcOf } from './note';
import { fifthIndex, fromFifthIndex } from './fifths';
import { MAJOR_OFFSETS, majorScale } from './scale';

/** Spell a seven-note scale: one letter per degree, accidental from the semitone offset. */
export function spellScale(tonic: Note, offsets: readonly number[]): Note[] {
  const tp = pcOf(tonic);
  return offsets.map((o, i) => {
    const letter = (tonic.letter + i) % 7;
    let acc = mod(mod(tp + o, 12) - NAT[letter], 12);
    if (acc > 6) acc -= 12;
    return { letter, acc };
  });
}

/** Semitone offsets from the tonic of a spelled scale (ascending, 0…11). */
export function offsetsOf(scale: Note[]): number[] {
  const t = pcOf(scale[0]);
  return scale.map((n) => mod(pcOf(n) - t, 12));
}

/** Step sizes between consecutive notes, closing the octave (sum 12). */
export function stepsOf(offsets: readonly number[]): number[] {
  return offsets.map((o, i) => (i + 1 < offsets.length ? offsets[i + 1] : 12) - o);
}

/* ---------- minor ---------- */
export const NATURAL_MINOR = [0, 2, 3, 5, 7, 8, 10] as const;
export const HARMONIC_MINOR = [0, 2, 3, 5, 7, 8, 11] as const;
export const MELODIC_MINOR = [0, 2, 3, 5, 7, 9, 11] as const;
export type MinorForm = 'natural' | 'harmonic' | 'melodic';
export const MINOR_FORMS: Record<MinorForm, readonly number[]> = {
  natural: NATURAL_MINOR, harmonic: HARMONIC_MINOR, melodic: MELODIC_MINOR,
};

/** The relative minor: degree 6 of the major scale (same key signature). */
export const relativeMinor = (major: Note): Note => majorScale(major)[5];
/** The relative major of a minor tonic: its degree 3. */
export const relativeMajor = (minor: Note): Note => spellScale(minor, NATURAL_MINOR)[2];

export const naturalMinor = (tonic: Note) => spellScale(tonic, NATURAL_MINOR);
export const harmonicMinor = (tonic: Note) => spellScale(tonic, HARMONIC_MINOR);
export const melodicMinor = (tonic: Note) => spellScale(tonic, MELODIC_MINOR);
export const minorScale = (tonic: Note, form: MinorForm) => spellScale(tonic, MINOR_FORMS[form]);

/** Rotate a list so it starts at index `k`. */
export const rotate = <T>(xs: readonly T[], k: number): T[] => xs.map((_, i) => xs[(i + k) % xs.length]);

/* ---------- modes ---------- */
export type ModeId = 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian';
/** Modes in the order of the major scale degrees they start on (index = degree − 1). */
export const MODES_BY_DEGREE: ModeId[] = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];
/** Brightest to darkest: each step moves the window one fifth to the flat side. */
export const MODES_BY_BRIGHTNESS: ModeId[] = ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'];

export const modeDegree = (m: ModeId) => MODES_BY_DEGREE.indexOf(m);
export const modeBrightness = (m: ModeId) => MODES_BY_BRIGHTNESS.indexOf(m);

/** Semitone offsets of a mode: the major pattern started on another degree. */
export function modeOffsets(m: ModeId): number[] {
  const d = modeDegree(m);
  return rotate(MAJOR_OFFSETS, d).map((o) => mod(o - MAJOR_OFFSETS[d], 12));
}

/** A mode spelled on any tonic ("parallel" view). */
export const modeScale = (tonic: Note, m: ModeId) => spellScale(tonic, modeOffsets(m));

/** The mode that uses the major key's own notes, starting on its degree ("relative" view). */
export const modeOfKey = (major: Note, m: ModeId) => rotate(majorScale(major), modeDegree(m));

/** Same notes, read on the line of fifths: the tonic sits at position `brightness` of a 7-wide window. */
export function modeByFifths(tonic: Note, m: ModeId): Note[] {
  const start = fifthIndex(tonic) - modeBrightness(m);
  const win = Array.from({ length: 7 }, (_, j) => fromFifthIndex(start + j));
  return Array.from({ length: 7 }, (_, i) => win.find((n) => n.letter === (tonic.letter + i) % 7)!);
}

/** Change of each degree compared with the major scale on the same tonic (−1, 0 or +1). */
export function modeAlterations(m: ModeId): number[] {
  return modeOffsets(m).map((o, i) => o - MAJOR_OFFSETS[i]);
}

export interface ModeChar {
  /** compared with the major or the natural minor on the same tonic */
  ref: 'maj' | 'min';
  /** degree 1–7, or 0 when the mode is the reference itself */
  deg: number;
  /** +1 raised, −1 lowered */
  dir: 1 | -1 | 0;
  /** second altered degree (Locrian also lowers 5) */
  deg2?: number;
}

/** The note that gives each mode its color, compared with the nearest of major / natural minor. */
export const MODE_CHAR: Record<ModeId, ModeChar> = {
  lydian: { ref: 'maj', deg: 4, dir: 1 },
  ionian: { ref: 'maj', deg: 0, dir: 0 },
  mixolydian: { ref: 'maj', deg: 7, dir: -1 },
  dorian: { ref: 'min', deg: 6, dir: 1 },
  aeolian: { ref: 'min', deg: 0, dir: 0 },
  phrygian: { ref: 'min', deg: 2, dir: -1 },
  locrian: { ref: 'min', deg: 2, dir: -1, deg2: 5 },
};

/** Is the mode's third major (bright family) or minor (dark family)? */
export const modeIsMajor = (m: ModeId) => modeOffsets(m)[2] === 4;

/* ---------- pentatonic and blues ---------- */
/** Major pentatonic: degrees 1 2 3 5 6, with no 4 and no 7 (the two hinges). */
export const majorPentatonic = (tonic: Note) => [0, 1, 2, 4, 5].map((i) => majorScale(tonic)[i]);
/** Minor pentatonic: degrees 1 ♭3 4 5 ♭7 of the natural minor (no 2 and no ♭6). */
export const minorPentatonic = (tonic: Note) => [0, 2, 3, 4, 6].map((i) => naturalMinor(tonic)[i]);
/** Major pentatonic as five consecutive fifths starting on the tonic. */
export const pentatonicByFifths = (tonic: Note) => Array.from({ length: 5 }, (_, j) => fromFifthIndex(fifthIndex(tonic) + j));
/** The blue note: the fifth lowered by a half step (same letter as the 5th). */
export function blueNote(tonic: Note): Note {
  const five = naturalMinor(tonic)[4];
  return { letter: five.letter, acc: five.acc - 1 };
}
/** Blues scale: minor pentatonic plus the blue note between 4 and 5. */
export function bluesScale(tonic: Note): Note[] {
  const p = minorPentatonic(tonic);
  return [p[0], p[1], p[2], blueNote(tonic), p[3], p[4]];
}

/* ---------- symmetric scales ---------- */
export type SymId = 'chromatic' | 'whole' | 'octatonic';
export const SYM_OFFSETS: Record<SymId, readonly number[]> = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  whole: [0, 2, 4, 6, 8, 10],
  /** half–whole diminished */
  octatonic: [0, 1, 3, 4, 6, 7, 9, 10],
};
/** How many different transpositions exist (12 ÷ the size of the repeating cell). */
export function transpositions(offsets: readonly number[]): number {
  const set = new Set(offsets.map((o) => mod(o, 12)));
  for (let t = 1; t <= 12; t++) if ([...set].every((o) => set.has(mod(o + t, 12)))) return t;
  return 12;
}

/** Every way to give `n` notes letters that advance by `allowed` steps and sum to one octave (7 letters). */
function letterPlans(n: number, allowed: number[]): number[][] {
  const out: number[][] = [];
  const go = (acc: number[], sum: number) => {
    if (acc.length === n) {
      if (sum === 7) out.push(acc);
      return;
    }
    for (const a of allowed) if (sum + a <= 7) go([...acc, a], sum + a);
  };
  go([], 0);
  return out;
}

/**
 * Spell a scale with any number of notes (symmetric scales): try every letter plan,
 * keep accidentals within 𝄫…𝄪, use the fewest accidentals, and break ties with
 * sharps for sharp-side or natural tonics and flats for flat tonics.
 */
export function spellCycle(tonic: Note, offsets: readonly number[]): Note[] {
  const n = offsets.length;
  if (n === 7) return spellScale(tonic, offsets);
  const allowed = n > 7 ? [0, 1] : [1, 2];
  const pref = tonic.acc < 0 || (tonic.acc === 0 && tonic.letter === 3) ? -1 : 1;
  const tp = pcOf(tonic);
  let best: Note[] = [];
  let bestScore = Infinity;
  for (const plan of letterPlans(n, allowed)) {
    // plan[i] is the letter step from note i to note i+1; the first note keeps the tonic's letter
    let letter = tonic.letter;
    const notes: Note[] = [];
    let ok = true;
    for (let i = 0; i < n; i++) {
      if (i > 0) letter = (letter + plan[i - 1]) % 7;
      let acc = mod(mod(tp + offsets[i], 12) - NAT[letter], 12);
      if (acc > 6) acc -= 12;
      if (acc < -2 || acc > 2 || (i === 0 && acc !== tonic.acc)) { ok = false; break; }
      notes.push({ letter, acc });
    }
    if (!ok) continue;
    const abs = notes.reduce((s, x) => s + Math.abs(x.acc), 0);
    const wrong = notes.reduce((s, x) => s + (x.acc * pref < 0 ? 1 : 0), 0);
    const score = abs * 100 + wrong;
    if (score < bestScore) {
      bestScore = score;
      best = notes;
    }
  }
  return best;
}
