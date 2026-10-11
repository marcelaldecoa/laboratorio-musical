import { FUNCTION_OF, type HarmonicFunction } from './chord';
import { type Note, mod, pcOf } from './note';
import { MAJOR_OFFSETS } from './scale';

/**
 * A melody note written as a scale step and a duration, so the same tune works in every key.
 * `i` counts scale steps from the tonic: 0 = degree 1, 6 = degree 7, 7 = degree 1 an octave up, −1 = degree 7 below.
 */
export interface MelNote {
  i: number;
  /** duration in beats (quarter notes) */
  dur: number;
}

/** A tune: one chord (scale degree 0–6) per bar of 4 beats, and the melody over it. */
export interface Tune {
  chords: number[];
  notes: MelNote[];
}

export const BEATS = 4;

/** Scale degree 0–6 of a step index. */
export const degreeOf = (i: number) => mod(i, 7);
/** Octave of a step index relative to the tonic's octave. */
export const octaveOf = (i: number) => Math.floor(i / 7);

/** Spelled note of each melody note in a key (letter + accidental from the scale, never from pitch class). */
export function melodyNotes(scale: Note[], notes: MelNote[]): Note[] {
  return notes.map((n) => scale[degreeOf(n.i)]);
}

/** Semitone (C4 = 0) of a step index when the tonic sits at semitone `base`. */
export const stepSemi = (base: number, i: number) => base + MAJOR_OFFSETS[degreeOf(i)] + 12 * octaveOf(i);

/** Semitones of the melody, with the tonic placed at `base`. */
export function melodySemis(base: number, notes: MelNote[]): number[] {
  return notes.map((n) => stepSemi(base, n.i));
}

/**
 * Keyboard range around the given semitones that keeps the black-key groups whole:
 * it starts on a C or an F and ends on an E or a B.
 */
export function groupRange(semis: number[]): [number, number] {
  let lo = Math.min(...semis);
  let hi = Math.max(...semis);
  while (mod(lo, 12) !== 0 && mod(lo, 12) !== 5) lo--;
  while (mod(hi, 12) !== 4 && mod(hi, 12) !== 11) hi++;
  return [lo, hi];
}

/**
 * Where to put the tonic so that steps `lo`…`hi` need the narrowest keyboard
 * (ties: the placement closest to middle C). Returns the tonic's semitone.
 */
export function fitBase(tonic: Note, lo: number, hi: number): number {
  const pc = pcOf(tonic);
  let best = pc;
  let bestCost = Infinity;
  for (const base of [pc - 12, pc, pc + 12]) {
    const a = stepSemi(base, lo);
    const b = stepSemi(base, hi);
    const [x, y] = groupRange([a, b]);
    const cost = (y - x) * 100 + Math.abs(a + b);
    if (cost < bestCost) {
      bestCost = cost;
      best = base;
    }
  }
  return best;
}

/* ---------- role of each melody note ---------- */

export type ToneRole = 'root' | 'third' | 'fifth' | 'passing' | 'neighbor' | 'appoggiatura' | 'other';

export interface NoteRole {
  role: ToneRole;
  /** true for root, third and fifth */
  chordTone: boolean;
  /** bar index and beat (0-based) where the note starts */
  bar: number;
  beat: number;
  /** start in beats from the beginning */
  start: number;
  /** beats 1 and 3 of a 4/4 bar */
  strong: boolean;
  /** degree of the chord under the note */
  chord: number;
}

/** Which member of the triad on `chordDeg` a scale degree is, or null if it is not in the chord. */
export function chordMember(chordDeg: number, deg: number): 'root' | 'third' | 'fifth' | null {
  const d = mod(deg - chordDeg, 7);
  return d === 0 ? 'root' : d === 2 ? 'third' : d === 4 ? 'fifth' : null;
}

/**
 * Classifies every melody note against the chord of its bar.
 * Chord tones are root, third or fifth. A non-chord tone is:
 * passing when it is reached by step and left by step in the same direction;
 * neighbor when it steps away and steps back to the same note;
 * appoggiatura when it is reached by leap and left by step;
 * other in any remaining case.
 */
export function classify(tune: Tune): NoteRole[] {
  const out: NoteRole[] = [];
  let start = 0;
  tune.notes.forEach((n, k) => {
    const bar = Math.floor(start / BEATS);
    const beat = start - bar * BEATS;
    const chord = tune.chords[Math.min(bar, tune.chords.length - 1)];
    const strong = beat === 0 || beat === 2;
    const member = chordMember(chord, degreeOf(n.i));
    let role: ToneRole;
    if (member) role = member;
    else {
      const prev = tune.notes[k - 1]?.i;
      const next = tune.notes[k + 1]?.i;
      const a = prev == null ? null : n.i - prev;
      const b = next == null ? null : next - n.i;
      if (a != null && b != null && Math.abs(a) === 1 && Math.abs(b) === 1) role = a === b ? 'passing' : 'neighbor';
      else if (a != null && Math.abs(a) >= 2 && b != null && Math.abs(b) === 1) role = 'appoggiatura';
      else role = 'other';
    }
    out.push({ role, chordTone: !!member, bar, beat, start, strong, chord });
    start += n.dur;
  });
  return out;
}

/** Total length in beats. */
export const tuneBeats = (t: Tune) => t.notes.reduce((s, n) => s + n.dur, 0);

/* ---------- lesson tunes (original melodies) ---------- */

const q = (...is: number[]): MelNote[] => is.map((i) => ({ i, dur: 1 }));
const n = (i: number, dur: number): MelNote => ({ i, dur });

/** Chord tones vs non-chord tones: I | IV | V | I, every non-chord-tone type appears once or more. */
export const ROLE_TUNE: Tune = {
  chords: [0, 3, 4, 0],
  notes: [...q(2, 1, 2, 4), ...q(5, 4, 3, 5), ...q(7, 6, 4, 3), ...q(2, 1), n(0, 2)],
};

/** Only the notes on strong beats, each held for two beats: the skeleton of a tune. */
export function skeleton(tune: Tune): Tune {
  const roles = classify(tune);
  const notes: MelNote[] = [];
  const total = tuneBeats(tune);
  for (let b = 0; b < total; b += 2) {
    let k = roles.length - 1;
    while (k > 0 && roles[k].start > b) k--;
    notes.push({ i: tune.notes[k].i, dur: 2 });
  }
  return { chords: tune.chords, notes };
}

/* ---------- phrases and form ---------- */

export type Ending = 'authentic' | 'half' | 'deceptive';
export const ENDINGS: Ending[] = ['authentic', 'half', 'deceptive'];

/** Bars 1–4: the question (antecedent), ending on V (half cadence). */
export const QUESTION: Tune = {
  chords: [0, 3, 0, 4],
  notes: [...q(0, 1, 2, 4), n(5, 2), ...q(3, 5), ...q(4, 2, 0, 2), n(1, 4)],
};

/** Bars 5–8: the answer (consequent). It starts like the question; only the ending changes. */
export function answer(ending: Ending): Tune {
  const start = { chords: [0, 3], notes: [...q(0, 1, 2, 4), n(5, 2), ...q(3, 5)] };
  if (ending === 'half') return { chords: [...start.chords, 0, 4], notes: [...start.notes, ...q(4, 2, 0, 2), n(1, 4)] };
  return {
    chords: [...start.chords, 4, ending === 'authentic' ? 0 : 5],
    notes: [...start.notes, ...q(4, 3, 1, -1), n(0, 4)],
  };
}

/** The whole 8-bar period. */
export function period(ending: Ending): Tune {
  const a = answer(ending);
  return { chords: [...QUESTION.chords, ...a.chords], notes: [...QUESTION.notes, ...a.notes] };
}

/** Last chord of a tune and the degree of its last melody note. */
export function cadenceOf(t: Tune): { chord: number; melody: number; fn: HarmonicFunction } {
  const chord = t.chords[t.chords.length - 1];
  return { chord, melody: degreeOf(t.notes[t.notes.length - 1].i), fn: FUNCTION_OF[chord] };
}

/** Section types: A = home, B = contrast (bridge), C = chorus. Each is 4 bars. */
export type SectionKind = 'A' | 'B' | 'C';
export const SECTIONS: Record<SectionKind, Tune> = {
  A: { chords: [0, 3, 4, 0], notes: [...q(0, 1, 2, 4), n(5, 2), ...q(3, 5), ...q(4, 3, 1, -1), n(0, 4)] },
  B: { chords: [5, 3, 1, 4], notes: [...q(7, 9, 7, 5), ...q(5, 7), n(5, 2), ...q(3, 5, 3, 1), n(1, 2), n(4, 2)] },
  C: { chords: [3, 0, 4, 0], notes: [n(7, 2), n(5, 2), ...q(4, 7), n(9, 2), n(8, 2), ...q(6, 4), n(7, 4)] },
};

export type FormId = 'verse' | 'aaba' | 'aba';
export interface FormDef {
  id: FormId;
  /** section kinds in order */
  parts: SectionKind[];
}
export const FORMS: FormDef[] = [
  { id: 'verse', parts: ['A', 'C', 'A', 'C', 'B', 'C'] },
  { id: 'aaba', parts: ['A', 'A', 'B', 'A'] },
  { id: 'aba', parts: ['A', 'B', 'A'] },
];

/* ---------- harmonizing a melody ---------- */

/** An 8-note melody, one note per bar: E F G A G E D C in C major. */
export const HARM_MELODY = [2, 3, 4, 5, 4, 2, 1, 0];

/** One model answer (there are many good ones): I IV I ii V vi V I. */
export const HARM_SUGGESTION = [0, 3, 0, 1, 4, 5, 4, 0];

export type HarmTip = 'pick' | 'start' | 'end' | 'cadence' | 'dim' | 'back' | 'ok';

/**
 * Gentle tips for a harmonization (chord degree per bar, null = not chosen yet).
 * Each tip comes with the bar it refers to (or −1 for the whole piece).
 */
export function harmTips(choice: (number | null)[]): { tip: HarmTip; bar: number }[] {
  const out: { tip: HarmTip; bar: number }[] = [];
  const missing = choice.findIndex((c) => c == null);
  if (missing >= 0) out.push({ tip: 'pick', bar: missing });
  const last = choice.length - 1;
  if (choice[0] != null && choice[0] !== 0) out.push({ tip: 'start', bar: 0 });
  if (choice[last] != null && choice[last] !== 0) out.push({ tip: 'end', bar: last });
  if (choice[last] === 0 && choice[last - 1] != null && choice[last - 1] !== 4) out.push({ tip: 'cadence', bar: last - 1 });
  choice.forEach((c, k) => {
    if (c === 6 && choice[k + 1] !== 0) out.push({ tip: 'dim', bar: k });
  });
  choice.forEach((c, k) => {
    const nx = choice[k + 1];
    if (c != null && nx != null && FUNCTION_OF[c] === 'D' && FUNCTION_OF[nx] === 'SD') out.push({ tip: 'back', bar: k + 1 });
  });
  if (!out.length) out.push({ tip: 'ok', bar: -1 });
  return out;
}

/**
 * Voices a triad under a melody note: the other chord tones just below the melody (within an octave)
 * and the root in the bass, below them. Input: the triad's pitch classes [root, third, fifth].
 */
export function voiceUnder(pcs: number[], top: number): { bass: number; inner: number[]; top: number } {
  const inner = pcs
    .filter((p) => mod(p - top, 12) !== 0)
    .map((p) => top - 12 + mod(p - top, 12))
    .sort((a, b) => a - b);
  let bass = top - 12 + mod(pcs[0] - top, 12);
  while (bass >= Math.min(top, ...inner)) bass -= 12;
  return { bass, inner, top };
}
