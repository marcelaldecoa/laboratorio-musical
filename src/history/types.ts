import type { NoteEvent } from '../audio/audio';

/** The periods of the timeline, in chronological order. */
export type PeriodId =
  | 'medieval' | 'renaissance' | 'baroque' | 'classical' | 'romantic'
  | 'impressionism' | 'modern' | 'jazz' | 'contemporary';

export const PERIOD_ORDER: PeriodId[] = [
  'medieval', 'renaissance', 'baroque', 'classical', 'romantic', 'impressionism', 'modern', 'jazz', 'contemporary',
];

/** Texts of a period, one object per language with the same shape. */
export interface PeriodText {
  name: string;
  /** e.g. "c. 500–1400" */
  years: string;
  /** the question the period page opens with and answers (ends with "?") */
  question: string;
  /** 2–3 sentences: what music was for, where it was played, what changed */
  intro: string;
  /** numbered steps answering the question: what changed in sound and why (3–5 items, simple html with <b>) */
  steps: string[];
  /** the keyboard instrument of the time and why it sounded the way it did */
  instrument: { name: string; text: string };
  /** what the sound sketch demonstrates */
  sketch: { title: string; caption: string };
  /** one-sentence answer to `question`, to explain to someone */
  oneLine: string;
  /** curiosities, cautious wording (shown collapsed) */
  more: string[];
}

export interface Period {
  id: PeriodId;
  /** approximate start and end years, for the timeline bar */
  from: number;
  to: number;
  /** keyboard range of a typical instrument of the time, in semitones from middle C (C4 = 0; A0 = −39, C8 = 48).
   *  null when there was no keyboard instrument in common use for this music. */
  range: [number, number] | null;
  /** a short playable sketch of the period's characteristic sound (built only from pitches/durations, original material
   *  or public-domain patterns). Semitones from middle C; t and d in seconds. */
  sketch: NoteEvent[];
  /** lesson ids (see src/lessons/curriculum.ts) whose theory was born or shaped in this period */
  lessons: string[];
  pt: PeriodText;
  en: PeriodText;
}

/** Texts of a composer card, per language. */
export interface ComposerText {
  /** why this person matters for the piano and for the theory in this app (2–3 sentences) */
  why: string;
  /** 2–4 works to listen to (title only, as commonly known) */
  listen: string[];
  /** one piece (or collection) a beginner/intermediate pianist can actually play, or '' if none fits */
  play: string;
  /** one curious, well-established fact (cautious wording) */
  fact: string;
}

export interface Composer {
  id: string;
  name: string;
  /** birth and death years; died = null if living */
  born: number;
  died: number | null;
  period: PeriodId;
  /** part of the Brazilian thread */
  brazil?: boolean;
  /** lesson ids related to this composer's music, optional */
  lessons?: string[];
  pt: ComposerText;
  en: ComposerText;
}
