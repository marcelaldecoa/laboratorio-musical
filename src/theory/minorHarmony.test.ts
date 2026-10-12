import { describe, expect, it } from 'vitest';
import { type Note, displayed, mod, noteName, pcOf } from './index';
import { relativeMinor } from './scales';
import {
  DEGREES_WITH_SEVENTH, MINOR_PROGS, MINOR_PROG_IDS, MINOR_USUAL, minorChord, minorLeadingTone, minorTriads, sharedNotes,
  subtonic, voiceMinorProg,
} from './minorHarmony';

const en = (n: Note) => noteName(n, 'en');
const names = (ns: Note[]) => ns.map(en).join(' ');
// the 12 minor keys, plus both spellings at the enharmonic slot (D♯ minor and E♭ minor)
const MINORS: Note[] = [
  ...Array.from({ length: 12 }, (_, k) => relativeMinor(displayed(k, 'Fs'))),
  relativeMinor(displayed(6, 'Gb')),
];

describe('triads of the natural minor', () => {
  it('A minor: i ii° III iv v VI VII', () => {
    const t = minorTriads({ letter: 5, acc: 0 }, 'natural');
    expect(t.map((x) => x.roman)).toEqual(['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']);
    expect(names(t[4].notes)).toBe('E G B');
  });
  it.each(MINORS.map((m) => [en(m), m] as const))('%s minor has the same qualities', (_, m) => {
    expect(minorTriads(m, 'natural').map((x) => x.roman)).toEqual(['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']);
    // one letter per chord tone, stacked in thirds
    for (const tr of minorTriads(m, 'natural')) {
      expect(mod(tr.notes[1].letter - tr.notes[0].letter, 7)).toBe(2);
      expect(mod(tr.notes[2].letter - tr.notes[0].letter, 7)).toBe(4);
    }
  });
});

describe('the raised 7th changes exactly III, v and VII', () => {
  it.each(MINORS.map((m) => [en(m), m] as const))('%s minor', (_, m) => {
    const nat = minorTriads(m, 'natural');
    const har = minorTriads(m, 'harmonic');
    expect(har.map((x) => x.roman)).toEqual(['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°']);
    const changed = har.map((x, i) => (x.roman !== nat[i].roman ? i : -1)).filter((i) => i >= 0);
    expect(changed).toEqual(DEGREES_WITH_SEVENTH);
    // the raised note is the third of V, the root of vii° and the fifth of III+
    expect(har[4].raised).toEqual([1]);
    expect(har[6].raised).toEqual([0]);
    expect(har[2].raised).toEqual([2]);
  });
});

describe('spelling', () => {
  it('V of G♯ minor = D♯ F𝄪 A♯', () => {
    const gs = { letter: 4, acc: 1 };
    expect(names(minorChord(gs, 'V').notes)).toBe('D♯ F𝄪 A♯');
    expect(names(minorChord(gs, 'viio').notes)).toBe('F𝄪 A♯ C♯');
    expect(en(minorLeadingTone(gs))).toBe('F𝄪');
  });
  it('E♭ minor: V = B♭ D F, VII = D♭ F A♭, Picardy I = E♭ G B♭', () => {
    const eb = { letter: 2, acc: -1 };
    expect(names(minorChord(eb, 'V').notes)).toBe('B♭ D F');
    expect(names(minorChord(eb, 'VII').notes)).toBe('D♭ F A♭');
    expect(names(minorChord(eb, 'I').notes)).toBe('E♭ G B♭');
  });
  it('D minor: V = A C♯ E, vii° = C♯ E G, VI = B♭ D F', () => {
    const d = { letter: 1, acc: 0 };
    expect(names(minorChord(d, 'V').notes)).toBe('A C♯ E');
    expect(names(minorChord(d, 'viio').notes)).toBe('C♯ E G');
    expect(names(minorChord(d, 'VI').notes)).toBe('B♭ D F');
  });
  it.each(MINORS.map((m) => [en(m), m] as const))('%s minor: leading tone a half step below, subtonic a whole step below', (_, m) => {
    expect(mod(pcOf(m) - pcOf(minorLeadingTone(m)), 12)).toBe(1);
    expect(mod(pcOf(m) - pcOf(subtonic(m)), 12)).toBe(2);
    expect(minorLeadingTone(m).letter).toBe(subtonic(m).letter);
    expect(minorLeadingTone(m).acc).toBe(subtonic(m).acc + 1);
  });
});

describe('the usual chords of a minor key', () => {
  it.each(MINORS.map((m) => [en(m), m] as const))('%s minor', (_, m) => {
    const ch = MINOR_USUAL.map((id) => minorChord(m, id));
    expect(ch.map((c) => c.roman)).toEqual(['i', 'ii°', 'III', 'iv', 'V', 'VI', 'vii°', 'VII']);
    expect(ch.map((c) => c.fn)).toEqual(['T', 'SD', 'T', 'SD', 'D', 'T', 'D', 'D']);
    // V contains the leading tone as its 3rd
    expect(minorChord(m, 'V').notes[1]).toEqual(minorLeadingTone(m));
    // the Picardy third: same root and 5th as i, 3rd a half step higher, same letter
    const i = minorChord(m, 'i').notes;
    const I = minorChord(m, 'I').notes;
    expect(I[0]).toEqual(i[0]);
    expect(I[2]).toEqual(i[2]);
    expect(I[1].letter).toBe(i[1].letter);
    expect(I[1].acc).toBe(i[1].acc + 1);
  });
});

describe('progressions', () => {
  it('common tones: i and VI share two notes; V and i share one', () => {
    const a = { letter: 5, acc: 0 };
    expect(names(sharedNotes(minorChord(a, 'i').notes, minorChord(a, 'VI').notes))).toBe('A C');
    expect(names(sharedNotes(minorChord(a, 'V').notes, minorChord(a, 'i').notes))).toBe('E');
  });
  it('Andalusian bass in A minor walks down by step: A G F E', () => {
    const a = { letter: 5, acc: 0 };
    expect(names(MINOR_PROGS.andalusian.map((id) => minorChord(a, id).notes[0]))).toBe('A G F E');
  });
  it.each(MINORS.map((m) => [en(m), m] as const))('%s minor: every progression voices close and smooth', (_, m) => {
    for (const p of MINOR_PROG_IDS) {
      const v = voiceMinorProg(m, MINOR_PROGS[p]);
      v.forEach((st, i) => {
        expect(st.upper).toHaveLength(3);
        expect(st.upper[2] - st.upper[0]).toBeLessThanOrEqual(12);
        expect(new Set(st.upper.map((x) => mod(x, 12)))).toEqual(new Set(st.chord.notes.map(pcOf)));
        expect(mod(st.bass, 12)).toBe(pcOf(st.chord.notes[0]));
        if (i > 0) {
          // no voice leaps more than a 4th between chords
          const prev = v[i - 1].upper;
          for (const x of st.upper) expect(Math.min(...prev.map((y) => Math.abs(x - y)))).toBeLessThanOrEqual(5);
        }
      });
    }
  });
});
