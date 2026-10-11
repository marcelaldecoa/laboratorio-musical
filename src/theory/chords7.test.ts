import { describe, expect, it } from 'vitest';
import {
  SEVENTH_QUALITIES, diatonicSeventh, diatonicSeventhInfo, extensionsOf, fifthShape, intervalsAboveBass, invert,
  letterName, noteAt, seventhNotes, seventhQualityOf, seventhRoman, seventhSuffix, stackUp, thirdsOf, toneLabel, toneQuality,
} from './chords7';
import { FS, GB, SLOTS } from './fifths';
import { type Note, note, pcOf } from './note';
import { majorScale } from './scale';

const KEYS: Note[] = [...SLOTS.filter((n): n is Note => !!n), FS, GB];
const names = (ns: Note[]) => ns.map(letterName).join(' ');
const P = (s: string): Note => {
  const letter = 'CDEFGAB'.indexOf(s[0]);
  const rest = s.slice(1);
  const acc = rest === '♯' ? 1 : rest === '♭' ? -1 : rest === '𝄪' ? 2 : rest === '𝄫' ? -2 : 0;
  return note(letter, acc);
};

describe('noteAt spells by letter', () => {
  it('thirds and sevenths', () => {
    expect(letterName(noteAt(P('F♯'), 3, 4))).toBe('A♯');
    expect(letterName(noteAt(P('C♯'), 3, 4))).toBe('E♯');
    expect(letterName(noteAt(P('G♭'), 7, 11))).toBe('F');
    expect(letterName(noteAt(P('B'), 7, 9))).toBe('A♭');
    expect(letterName(noteAt(P('G♯'), 7, 9))).toBe('F');
    expect(letterName(noteAt(P('D♯'), 9, 15))).toBe('E𝄪');
  });
});

describe('seventh chords', () => {
  it('qualities stack the right thirds', () => {
    expect(thirdsOf('maj7')).toEqual([4, 3, 4]);
    expect(thirdsOf('dom7')).toEqual([4, 3, 3]);
    expect(thirdsOf('min7')).toEqual([3, 4, 3]);
    expect(thirdsOf('hdim7')).toEqual([3, 3, 4]);
    expect(thirdsOf('dim7')).toEqual([3, 3, 3]);
  });
  it('spellings', () => {
    expect(names(seventhNotes(P('G♭'), 'maj7'))).toBe('G♭ B♭ D♭ F');
    expect(names(seventhNotes(P('F♯'), 'dom7'))).toBe('F♯ A♯ C♯ E');
    expect(names(seventhNotes(P('B'), 'hdim7'))).toBe('B D F A');
    expect(names(seventhNotes(P('G♯'), 'dim7'))).toBe('G♯ B D F');
    expect(names(seventhNotes(P('C♯'), 'dim7'))).toBe('C♯ E G B♭');
    expect(names(seventhNotes(P('E♭'), 'min7'))).toBe('E♭ G♭ B♭ D♭');
  });
  it('quality detection round-trips', () => {
    for (const k of KEYS) for (const q of SEVENTH_QUALITIES) expect(seventhQualityOf(seventhNotes(k, q))).toBe(q);
  });
  it('symbols and roman numerals in both styles', () => {
    expect(SEVENTH_QUALITIES.map((q) => seventhSuffix(q, 'pt'))).toEqual(['7M', '7', 'm7', 'm7(♭5)', '°7']);
    expect(SEVENTH_QUALITIES.map((q) => seventhSuffix(q, 'en'))).toEqual(['maj7', '7', 'm7', 'm7♭5', '°7']);
    expect(seventhRoman(0, 'maj7', 'pt')).toBe('I7M');
    expect(seventhRoman(0, 'maj7', 'en')).toBe('Imaj7');
    expect(seventhRoman(6, 'hdim7', 'en')).toBe('viiø7');
    expect(seventhRoman(1, 'min7', 'pt')).toBe('ii7');
  });
});

describe('the 7 diatonic seventh chords in every key (both directions of the circle)', () => {
  const PATTERN = ['maj7', 'min7', 'min7', 'maj7', 'dom7', 'min7', 'hdim7'];
  for (const k of KEYS)
    it(letterName(k) + ' major', () => {
      const sc = majorScale(k);
      for (let d = 0; d < 7; d++) {
        const info = diatonicSeventhInfo(sc, d);
        expect(info.quality).toBe(PATTERN[d]);
        // every tone comes from the scale and the letters skip one each time
        info.notes.forEach((n, i) => {
          expect(sc).toContainEqual(n);
          expect(n.letter).toBe((k.letter + d + 2 * i) % 7);
        });
        // same notes as the formula built on the root
        expect(info.notes).toEqual(seventhNotes(sc[d], info.quality));
      }
    });
  it('known spellings', () => {
    const fs = majorScale(FS);
    expect(names(diatonicSeventh(fs, 4))).toBe('C♯ E♯ G♯ B');
    expect(names(diatonicSeventh(fs, 6))).toBe('E♯ G♯ B D♯');
    const gb = majorScale(GB);
    expect(names(diatonicSeventh(gb, 0))).toBe('G♭ B♭ D♭ F');
    expect(names(diatonicSeventh(gb, 3))).toBe('C♭ E♭ G♭ B♭');
  });
  it('shapes on the line of fifths are fixed per quality', () => {
    for (const k of KEYS) {
      const sc = majorScale(k);
      expect(fifthShape(diatonicSeventh(sc, 0))).toEqual([0, 4, 1, 5]);
      expect(fifthShape(diatonicSeventh(sc, 4))).toEqual([0, 4, 1, -2]);
      expect(fifthShape(diatonicSeventh(sc, 1))).toEqual([0, -3, 1, -2]);
      expect(fifthShape(diatonicSeventh(sc, 6))).toEqual([0, -3, -6, -2]);
    }
  });
});

describe('inversions', () => {
  it('rotate the chord', () => {
    expect(invert(['C', 'E', 'G'], 1)).toEqual(['E', 'G', 'C']);
    expect(invert(['G', 'B', 'D', 'F'], 3)).toEqual(['F', 'G', 'B', 'D']);
  });
  it('stack upward from the bass', () => {
    expect(stackUp([4, 7, 0], 0)).toEqual([4, 7, 12]);
    expect(stackUp([11, 2, 7], -12)).toEqual([-1, 2, 7]);
    expect(stackUp([0, 4, 7], 0)).toEqual([0, 4, 7]);
  });
  it('intervals above the bass give the figured-bass numbers', () => {
    const C = [P('C'), P('E'), P('G')];
    expect(intervalsAboveBass(invert(C, 0))).toEqual([3, 5]);
    expect(intervalsAboveBass(invert(C, 1))).toEqual([3, 6]);
    expect(intervalsAboveBass(invert(C, 2))).toEqual([4, 6]);
    const G7 = seventhNotes(P('G'), 'dom7');
    expect(intervalsAboveBass(invert(G7, 1))).toEqual([3, 5, 6]);
    expect(intervalsAboveBass(invert(G7, 2))).toEqual([3, 4, 6]);
    expect(intervalsAboveBass(invert(G7, 3))).toEqual([2, 4, 6]);
  });
});

describe('extensions', () => {
  it('in C major: avoid notes are a half step above a chord tone', () => {
    const sc = majorScale(note(0));
    const av = (d: number) => extensionsOf(sc, d).map((e) => (e.avoid ? 'x' : 'ok') + e.num).join(' ');
    expect(av(0)).toBe('ok9 x11 ok13');
    expect(av(1)).toBe('ok9 ok11 ok13');
    expect(av(2)).toBe('x9 ok11 x13');
    expect(av(3)).toBe('ok9 ok11 ok13');
    expect(av(4)).toBe('ok9 x11 ok13');
    expect(av(5)).toBe('ok9 ok11 x13');
    expect(av(6)).toBe('x9 ok11 ok13');
  });
  it('same pattern and correct letters in every key', () => {
    for (const k of KEYS) {
      const sc = majorScale(k);
      for (let d = 0; d < 7; d++) {
        const ex = extensionsOf(sc, d);
        expect(ex.map((e) => e.note.letter)).toEqual([1, 3, 5].map((s) => (k.letter + d + s) % 7));
        expect(ex.map((e) => e.avoid)).toEqual(
          extensionsOf(majorScale(note(0)), d).map((e) => e.avoid),
        );
        ex.forEach((e) => expect(pcOf(e.note)).toBe((pcOf(sc[d]) + e.semis) % 12));
      }
    }
  });
  it('9 = 2 + 8 − 1: a 9th is a 2nd plus an octave', () => {
    const ex = extensionsOf(majorScale(note(0)), 0);
    expect(ex.map((e) => e.semis)).toEqual([14, 17, 21]);
    expect(ex.map((e) => toneQuality(e))).toEqual(['M', 'P', 'M']);
  });
  it('labels', () => {
    expect(toneLabel({ num: 3, semis: 3 })).toBe('♭3');
    expect(toneLabel({ num: 7, semis: 9 })).toBe('𝄫7');
    expect(toneLabel({ num: 11, semis: 18 })).toBe('♯11');
    expect(toneLabel({ num: 13, semis: 20 })).toBe('♭13');
    expect(toneLabel({ num: 5, semis: 7 })).toBe('5');
  });
});
