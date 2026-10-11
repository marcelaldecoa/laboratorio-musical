import { describe, expect, it } from 'vitest';
import { type Note, noteName, pcOf } from './note';
import { FS, GB, SLOTS, fifthIndex, fromFifthIndex, keySignature } from './fifths';
import { majorScale } from './scale';
import {
  MODES_BY_BRIGHTNESS, MODES_BY_DEGREE, MODE_CHAR, SYM_OFFSETS, blueNote, bluesScale, harmonicMinor,
  majorPentatonic, melodicMinor, modeBrightness, minorPentatonic, modeAlterations, modeByFifths, modeIsMajor, modeOfKey,
  modeOffsets, modeScale, naturalMinor, offsetsOf, pentatonicByFifths, relativeMajor, relativeMinor,
  spellCycle, stepsOf, transpositions,
} from './scales';

const en = (ns: Note[]) => ns.map((n) => noteName(n, 'en')).join(' ');
/** The 12 circle keys plus both spellings of slot 6. */
const KEYS: Note[] = [...SLOTS.filter((n): n is Note => !!n), FS, GB];
const distinctLetters = (ns: Note[]) => new Set(ns.map((n) => n.letter)).size;

describe('natural minor and relative minor', () => {
  const REL: Record<string, string> = {
    C: 'A', G: 'E', D: 'B', A: 'F♯', E: 'C♯', B: 'G♯', 'F♯': 'D♯', 'G♭': 'E♭', 'D♭': 'B♭', 'A♭': 'F', 'E♭': 'C', 'B♭': 'G', F: 'D',
  };
  for (const k of KEYS) {
    const name = noteName(k, 'en');
    it(`${name} major → ${REL[name]} minor`, () => {
      const m = relativeMinor(k);
      expect(noteName(m, 'en')).toBe(REL[name]);
      // 3 half steps below the major tonic
      expect((pcOf(k) - pcOf(m) + 12) % 12).toBe(3);
      // same seven notes, same spelling
      const nat = naturalMinor(m);
      expect(new Set(nat.map((n) => noteName(n, 'en')))).toEqual(new Set(majorScale(k).map((n) => noteName(n, 'en'))));
      expect(relativeMajor(m)).toEqual(k);
      expect(stepsOf(offsetsOf(nat))).toEqual([2, 1, 2, 2, 1, 2, 2]);
    });
  }
  it('spells A minor and E♭ minor', () => {
    expect(en(naturalMinor({ letter: 5, acc: 0 }))).toBe('A B C D E F G');
    expect(en(naturalMinor({ letter: 2, acc: -1 }))).toBe('E♭ F G♭ A♭ B♭ C♭ D♭');
  });
});

describe('harmonic and melodic minor', () => {
  const LT: Record<string, string> = {
    A: 'G♯', E: 'D♯', B: 'A♯', 'F♯': 'E♯', 'C♯': 'B♯', 'G♯': 'F𝄪', 'D♯': 'C𝄪', 'E♭': 'D', 'B♭': 'A', F: 'E', C: 'B', G: 'F♯', D: 'C♯',
  };
  for (const k of KEYS) {
    const m = relativeMinor(k);
    const name = noteName(m, 'en');
    it(`${name} minor: raised 7th is ${LT[name]}`, () => {
      const h = harmonicMinor(m);
      expect(noteName(h[6], 'en')).toBe(LT[name]);
      expect(h[6].letter).toBe(naturalMinor(m)[6].letter);
      expect(h[6].acc).toBe(naturalMinor(m)[6].acc + 1);
      expect(distinctLetters(h)).toBe(7);
      // augmented second between ♭6 and ♯7
      expect(stepsOf(offsetsOf(h))).toEqual([2, 1, 2, 2, 1, 3, 1]);
      // leading tone a half step below the tonic
      expect((pcOf(m) - pcOf(h[6]) + 12) % 12).toBe(1);
      const mel = melodicMinor(m);
      expect(stepsOf(offsetsOf(mel))).toEqual([2, 1, 2, 2, 2, 2, 1]);
      expect(mel[5].acc).toBe(naturalMinor(m)[5].acc + 1);
      expect(mel[6]).toEqual(h[6]);
    });
  }
  it('G♯ harmonic minor', () => expect(en(harmonicMinor({ letter: 4, acc: 1 }))).toBe('G♯ A♯ B C♯ D♯ E F𝄪'));
});

describe('modes', () => {
  it('formulas', () => {
    expect(modeOffsets('ionian')).toEqual([0, 2, 4, 5, 7, 9, 11]);
    expect(modeOffsets('dorian')).toEqual([0, 2, 3, 5, 7, 9, 10]);
    expect(modeOffsets('phrygian')).toEqual([0, 1, 3, 5, 7, 8, 10]);
    expect(modeOffsets('lydian')).toEqual([0, 2, 4, 6, 7, 9, 11]);
    expect(modeOffsets('mixolydian')).toEqual([0, 2, 4, 5, 7, 9, 10]);
    expect(modeOffsets('aeolian')).toEqual([0, 2, 3, 5, 7, 8, 10]);
    expect(modeOffsets('locrian')).toEqual([0, 1, 3, 5, 6, 8, 10]);
  });
  it('brightness: each step darker lowers exactly one degree', () => {
    const sum = (m: (typeof MODES_BY_BRIGHTNESS)[number]) => modeOffsets(m).reduce((a, b) => a + b, 0);
    for (let i = 1; i < 7; i++) expect(sum(MODES_BY_BRIGHTNESS[i - 1]) - sum(MODES_BY_BRIGHTNESS[i])).toBe(1);
  });
  it('alterations versus major', () => {
    expect(modeAlterations('lydian')).toEqual([0, 0, 0, 1, 0, 0, 0]);
    expect(modeAlterations('locrian')).toEqual([0, -1, -1, 0, -1, -1, -1]);
    expect(MODES_BY_DEGREE.filter(modeIsMajor)).toEqual(['ionian', 'lydian', 'mixolydian']);
  });
  it('characteristic notes match the formulas', () => {
    for (const m of MODES_BY_DEGREE) {
      const c = MODE_CHAR[m];
      if (!c.deg) continue;
      const ref = c.ref === 'maj' ? modeOffsets('ionian') : modeOffsets('aeolian');
      expect(modeOffsets(m)[c.deg - 1] - ref[c.deg - 1]).toBe(c.dir);
    }
  });
  for (const k of KEYS)
    it(`modes in ${noteName(k, 'en')}: relative and parallel spellings`, () => {
      const sc = majorScale(k);
      for (const m of MODES_BY_DEGREE) {
        const rel = modeOfKey(k, m);
        // same notes as the key, started on another degree, spelled the same way
        expect(rel[0]).toEqual(sc[MODES_BY_DEGREE.indexOf(m)]);
        expect(modeScale(rel[0], m)).toEqual(rel);
        // parallel: one letter per degree on the current tonic
        const par = modeScale(k, m);
        expect(par[0]).toEqual(k);
        expect(distinctLetters(par)).toBe(7);
        expect(offsetsOf(par)).toEqual(modeOffsets(m));
        // the line of fifths gives the same spelling
        expect(modeByFifths(k, m)).toEqual(par);
        // the mode's notes are the major key one slot right of its window start
        const parent = fromFifthIndex(fifthIndex(k) - modeBrightness(m) + 1);
        expect(new Set(par.map((n) => noteName(n, 'en')))).toEqual(new Set(majorScale(parent).map((n) => noteName(n, 'en'))));
      }
    });
  it('examples', () => {
    expect(en(modeScale({ letter: 3, acc: 1 }, 'lydian'))).toBe('F♯ G♯ A♯ B♯ C♯ D♯ E♯');
    expect(en(modeScale({ letter: 0, acc: 0 }, 'phrygian'))).toBe('C D♭ E♭ F G A♭ B♭');
    expect(en(modeOfKey({ letter: 0, acc: 0 }, 'dorian'))).toBe('D E F G A B C');
  });
});

describe('pentatonic and blues', () => {
  it('the black keys are F♯ major pentatonic', () => {
    expect(majorPentatonic(FS).map(pcOf).sort((a, b) => a - b)).toEqual([1, 3, 6, 8, 10]);
    expect(en(majorPentatonic(FS))).toBe('F♯ G♯ A♯ C♯ D♯');
  });
  for (const k of KEYS)
    it(`${noteName(k, 'en')}: pentatonic subsets`, () => {
      const sc = majorScale(k);
      const p = majorPentatonic(k);
      // five consecutive fifths
      expect(p.map((n) => noteName(n, 'en')).sort()).toEqual(pentatonicByFifths(k).map((n) => noteName(n, 'en')).sort());
      // no 4 and no 7: no half steps left
      expect(p).not.toContainEqual(sc[3]);
      expect(p).not.toContainEqual(sc[6]);
      expect(stepsOf(offsetsOf(p))).toEqual([2, 2, 3, 2, 3]);
      // minor pentatonic of the relative minor = same five notes
      const m = relativeMinor(k);
      const mp = minorPentatonic(m);
      expect(new Set(mp.map((n) => noteName(n, 'en')))).toEqual(new Set(p.map((n) => noteName(n, 'en'))));
      expect(stepsOf(offsetsOf(mp))).toEqual([3, 2, 2, 3, 2]);
      // blues: adds ♭5, a tritone above the tonic, spelled on the 5th's letter
      const b = bluesScale(m);
      expect(b).toHaveLength(6);
      expect((pcOf(blueNote(m)) - pcOf(m) + 12) % 12).toBe(6);
      expect(blueNote(m).letter).toBe((m.letter + 4) % 7);
      expect(stepsOf(offsetsOf(b))).toEqual([3, 2, 1, 1, 3, 2]);
    });
  it('A blues', () => expect(en(bluesScale({ letter: 5, acc: 0 }))).toBe('A C D E♭ E G'));
});

describe('symmetric scales', () => {
  it('transpositions', () => {
    expect(transpositions(SYM_OFFSETS.chromatic)).toBe(1);
    expect(transpositions(SYM_OFFSETS.whole)).toBe(2);
    expect(transpositions(SYM_OFFSETS.octatonic)).toBe(3);
    expect(transpositions([0, 2, 4, 5, 7, 9, 11])).toBe(12);
  });
  for (const k of KEYS)
    it(`${noteName(k, 'en')}: symmetric spellings`, () => {
      for (const id of ['chromatic', 'whole', 'octatonic'] as const) {
        const ns = spellCycle(k, SYM_OFFSETS[id]);
        expect(ns).toHaveLength(SYM_OFFSETS[id].length);
        expect(ns[0]).toEqual(k);
        expect(offsetsOf(ns)).toEqual([...SYM_OFFSETS[id]]);
        expect(ns.every((n) => Math.abs(n.acc) <= 2)).toBe(true);
      }
      // whole tone uses 6 different letters; the chromatic scale never needs more than 7 accidentals
      expect(distinctLetters(spellCycle(k, SYM_OFFSETS.whole))).toBe(6);
      expect(spellCycle(k, SYM_OFFSETS.chromatic).filter((n) => n.acc !== 0).length).toBeLessThanOrEqual(7);
    });
  it('examples', () => {
    expect(en(spellCycle({ letter: 0, acc: 0 }, SYM_OFFSETS.whole))).toBe('C D E F♯ G♯ A♯');
    expect(en(spellCycle({ letter: 6, acc: -1 }, SYM_OFFSETS.whole))).toBe('B♭ C D E G♭ A♭');
    expect(en(spellCycle({ letter: 0, acc: 0 }, SYM_OFFSETS.chromatic))).toBe('C C♯ D D♯ E F F♯ G G♯ A A♯ B');
    expect(en(spellCycle({ letter: 0, acc: 0 }, SYM_OFFSETS.octatonic))).toBe('C C♯ D♯ E F♯ G A B♭');
  });
  it('key signatures stay consistent', () => expect(keySignature(GB).list).toHaveLength(6));
});
