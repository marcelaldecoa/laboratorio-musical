import { describe, expect, it } from 'vitest';
import { displayed } from './fifths';
import { type Note, noteName, pcOf } from './note';
import { majorScale } from './scale';
import {
  TUNE, accFor, degreeNote, degreeSemis, enharmonic, keyInterval, naiveName, spellingTrap, transposeNote,
} from './transpose';

const C: Note = { letter: 0, acc: 0 };
const n = (x: Note) => noteName(x, 'en');
/** All 12 keys, in both spellings of slot 6 (F♯ and G♭). */
const KEYS: Note[] = [...Array.from({ length: 12 }, (_, k) => displayed(k, 'Fs')), displayed(6, 'Gb')];

describe('keyInterval', () => {
  it('names the distance from C to each key', () => {
    const got = KEYS.map((k) => {
      const i = keyInterval(C, k);
      return `${i.quality}${i.num}:${i.semis}`;
    });
    expect(got).toEqual(['P1:0', 'P5:7', 'M2:2', 'M6:9', 'M3:4', 'M7:11', 'A4:6', 'm2:1', 'm6:8', 'm3:3', 'm7:10', 'P4:5', 'd5:6']);
  });
  it('works downward around the circle too (from any key to any key)', () => {
    expect(keyInterval({ letter: 4, acc: 0 }, { letter: 3, acc: 0 })).toMatchObject({ num: 7, semis: 10, quality: 'm' });
    expect(keyInterval({ letter: 3, acc: 1 }, { letter: 4, acc: -1 })).toMatchObject({ num: 2, semis: 0, quality: 'd' });
  });
});

describe('transposeNote', () => {
  it('moving the C major scale gives the major scale of every key, spelled by letter', () => {
    for (const k of KEYS) expect(majorScale(C).map((x) => transposeNote(x, C, k))).toEqual(majorScale(k));
  });
  it('keeps every degree in both directions between all pairs of keys', () => {
    for (const a of KEYS)
      for (const b of KEYS) {
        const moved = majorScale(a).map((x) => transposeNote(x, a, b));
        expect(moved).toEqual(majorScale(b));
        // and back again
        expect(moved.map((x) => transposeNote(x, b, a))).toEqual(majorScale(a));
      }
  });
  it('spells the tricky ones: E♯ in F♯, C♭ in G♭, B♭ in F', () => {
    expect(n(transposeNote({ letter: 6, acc: 0 }, C, { letter: 3, acc: 1 }))).toBe('E♯');
    expect(n(transposeNote({ letter: 3, acc: 0 }, C, { letter: 4, acc: -1 }))).toBe('C♭');
    expect(n(transposeNote({ letter: 3, acc: 0 }, C, { letter: 3, acc: 0 }))).toBe('B♭');
  });
  it('moves chromatic notes too (F♯ in C → C♯ in G)', () => {
    expect(n(transposeNote({ letter: 3, acc: 1 }, C, { letter: 4, acc: 0 }))).toBe('C♯');
  });
  it('every note moves by the same number of semitones', () => {
    for (const k of KEYS) {
      const { semis } = keyInterval(C, k);
      majorScale(C).forEach((x) => expect((pcOf(transposeNote(x, C, k)) - pcOf(x) - semis + 24) % 12).toBe(0));
    }
  });
});

describe('degrees', () => {
  it('degreeNote reads a degree in a key (octave and below wrap)', () => {
    expect(n(degreeNote({ letter: 2, acc: 0 }, 4))).toBe('B');
    expect(n(degreeNote({ letter: 1, acc: 0 }, -1))).toBe('C♯');
    expect(n(degreeNote({ letter: 1, acc: 0 }, 7))).toBe('D');
  });
  it('degreeSemis counts octaves', () => {
    expect([-1, 0, 2, 4, 7, 9].map(degreeSemis)).toEqual([-1, 0, 4, 7, 12, 16]);
  });
  it('the tune fits its chords on the downbeat and ends on the tonic', () => {
    for (const bar of TUNE) {
      const tones = [bar.chord, bar.chord + 2, bar.chord + 4].map((d) => d % 7);
      expect(tones).toContain(((bar.melody[0] % 7) + 7) % 7);
    }
    expect(TUNE[TUNE.length - 1].melody).toEqual([0]);
    expect(TUNE.map((b) => b.chord)).toEqual([0, 3, 4, 0]);
  });
});

describe('spelling helpers', () => {
  it('accFor', () => {
    expect(accFor(2, 5)).toBe(1); // E♯
    expect(accFor(0, 11)).toBe(-1); // C♭
    expect(accFor(3, 7)).toBe(2); // F𝄪
  });
  it('enharmonic gives the neighboring letter', () => {
    expect(n(enharmonic({ letter: 2, acc: 1 }))).toBe('F');
    expect(n(enharmonic({ letter: 0, acc: -1 }))).toBe('B');
    expect(n(enharmonic({ letter: 3, acc: 1 }))).toBe('G♭');
    expect(n(enharmonic({ letter: 6, acc: -1 }))).toBe('A♯');
  });
  it('counting semitones loses letters: F major spelled naively has A and A♯', () => {
    const F: Note = { letter: 3, acc: 0 };
    const naive = majorScale(F).map((x) => naiveName(pcOf(x), true));
    expect(naive.map(n)).toEqual(['F', 'G', 'A', 'A♯', 'C', 'D', 'E']);
    expect(new Set(naive.map((x) => x.letter)).size).toBe(6);
    expect(new Set(majorScale(F).map((x) => x.letter)).size).toBe(7);
  });
  it('every key except C has a spelling trap whose enharmonic is a different letter', () => {
    for (const k of KEYS) {
      const d = spellingTrap(k);
      if (k.letter === 0 && k.acc === 0) {
        expect(d).toBeNull();
        continue;
      }
      expect(d).not.toBeNull();
      const right = majorScale(k)[d!];
      const wrong = enharmonic(right);
      expect(right.acc).not.toBe(0);
      expect(d).toBeGreaterThan(0);
      expect(wrong.letter).not.toBe(right.letter);
      expect(pcOf(wrong)).toBe(pcOf(right));
    }
    expect(n(majorScale({ letter: 3, acc: 1 })[spellingTrap({ letter: 3, acc: 1 })!])).toBe('E♯');
    expect(n(majorScale({ letter: 4, acc: -1 })[spellingTrap({ letter: 4, acc: -1 })!])).toBe('C♭');
  });
});
