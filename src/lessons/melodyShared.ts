import { type HarmonicFunction, type Note, mod, pcOf, triad } from '../theory';
import type { NoteEvent } from '../audio/audio';
import { BEATS, type Tune, stepSemi } from '../theory/melody';

/** Soft chip colors for chord labels, by function (same as the progression chips). */
export const FN_SOFT: Record<HarmonicFunction, [string, string]> = {
  T: ['var(--accent-soft)', 'var(--accent-ink)'],
  SD: ['var(--flat-soft)', 'var(--flat-ink)'],
  D: ['var(--dom-soft)', 'var(--dom-ink)'],
};

/** Solid key colors by function. */
export const FN_KEY: Record<HarmonicFunction, [string, string]> = {
  T: ['var(--k-tonic)', 'var(--k-tonic-ink)'],
  SD: ['var(--k-sub)', 'var(--k-sub-ink)'],
  D: ['var(--k-dom)', 'var(--k-dom-ink)'],
};

/** Block triad of a chord degree placed in the octave just below the tonic at `base`. */
export function chordBelow(sc: Note[], deg: number, base: number): number[] {
  return triad(sc, deg).map((n) => base - 12 + mod(pcOf(n) - base, 12)).sort((a, b) => a - b);
}

/** Events for a tune: block chords below the tonic at `base`, melody on top. Returns the start time of each note. */
export function tuneEvents(tune: Tune, sc: Note[], base: number, q: number, t0 = 0): { ev: NoteEvent[]; starts: number[] } {
  const ev: NoteEvent[] = [];
  tune.chords.forEach((d, b) => chordBelow(sc, d, base).forEach((s) => ev.push({ s, t: t0 + b * BEATS * q, d: BEATS * q * 0.95, v: 0.32 })));
  const starts: number[] = [];
  let t = 0;
  tune.notes.forEach((n) => {
    starts.push(t0 + t * q);
    ev.push({ s: stepSemi(base, n.i), t: t0 + t * q, d: n.dur * q * 0.92, v: 0.8 });
    t += n.dur;
  });
  return { ev, starts };
}
