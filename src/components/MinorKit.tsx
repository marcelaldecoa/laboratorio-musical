/* Small building blocks shared by the "minorharm" track lessons (minorfield, minorcad). */
import { type NoteEvent, chord as chordEv } from '../audio/audio';
import { type Note, mod, pcOf, sameNote } from '../theory';
import type { MinorFunction, MinorTriadQuality } from '../theory/minorHarmony';
import { Keyboard } from './Keyboard';
import { type Mark, type Role, rangeAround, roleMark } from './layout';

export const QUALITY_ROLE: Record<MinorTriadQuality, Role> = { maj: 'tonic', min: 'sub', dim: 'chg', aug: 'chg' };
export const FUNCTION_ROLE: Record<MinorFunction, Role> = { T: 'tonic', SD: 'sub', D: 'dom' };
/** chip class by quality (app.css: chip.maj / .min / .dim) and by function (.fT / .fSD / .fD) */
export const QUALITY_CHIP: Record<MinorTriadQuality, string> = { maj: 'maj', min: 'min', dim: 'dim', aug: 'dim' };

/** Root-position semitones of a triad whose root lies in the octave above `base`. */
export function triadSemis(base: number, notes: Note[]): number[] {
  const r = base + mod(pcOf(notes[0]) - base, 12);
  return notes.map((n, i) => (i === 0 ? r : r + mod(pcOf(n) - pcOf(notes[0]), 12)));
}

/** The chord with a low root underneath, for playing. */
export const chordWithBass = (semis: number[], t = 0, d = 1.3): NoteEvent[] => [
  { s: semis[0] - 12, t, d, v: 0.45 },
  ...chordEv(semis, t, d, 0.5),
];

/**
 * A keyboard from the minor tonic (two octaves) showing one triad in root position over the scale.
 * The raised 7th (if any) is coral, with a dashed key where it was in natural minor.
 */
export function MinorChordKeys({
  base, notes, role, scale, raised = [], natural7, nm, channel, label, tones,
}: {
  base: number;
  notes: Note[];
  role: Role;
  scale: Note[];
  raised?: number[];
  natural7?: Note;
  nm: (n: Note) => string;
  channel: string;
  label: string;
  /** labels of the chord tones, e.g. ['1', '3', '5'] */
  tones: string[];
}) {
  const lay = rangeAround(base, base + 19);
  const semis = triadSemis(base, notes);
  const marks: Record<number, Mark> = {};
  for (let x = lay.from; x <= lay.to; x++) {
    const n = scale.find((s) => pcOf(s) === mod(x, 12));
    if (n) marks[x] = roleMark(x, 'scale', undefined, nm(n));
  }
  semis.forEach((x, i) => {
    marks[x] = roleMark(x, raised.includes(i) ? 'lt' : role, tones[i], nm(notes[i]));
    if (raised.includes(i) && natural7 && !sameNote(natural7, notes[i])) marks[x - 1] = { ghost: 'var(--k-lt-line)', name: nm(natural7) };
  });
  return <Keyboard lay={lay} marks={marks} top={30} channel={channel} label={label} />;
}
