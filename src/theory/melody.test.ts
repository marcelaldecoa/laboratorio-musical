import { describe, expect, it } from 'vitest';
import { FS, GB, displayed, majorScale, noteName, pcOf } from './index';
import {
  BEATS, ENDINGS, FORMS, HARM_MELODY, HARM_SUGGESTION, QUESTION, ROLE_TUNE, SECTIONS, answer, cadenceOf, chordMember,
  classify, fitBase, harmTips, melodyNotes, melodySemis, groupRange, period, skeleton, stepSemi, tuneBeats, voiceUnder,
} from './melody';

const ALL_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const en = (ns: { letter: number; acc: number }[]) => ns.map((x) => noteName(x, 'en')).join(' ');

describe('chordMember', () => {
  it('finds root, third and fifth of every diatonic triad', () => {
    for (let c = 0; c < 7; c++) {
      expect(chordMember(c, c)).toBe('root');
      expect(chordMember(c, (c + 2) % 7)).toBe('third');
      expect(chordMember(c, (c + 4) % 7)).toBe('fifth');
      for (const off of [1, 3, 5, 6]) expect(chordMember(c, (c + off) % 7)).toBeNull();
    }
  });
});

describe('classify (role of each melody note)', () => {
  const roles = classify(ROLE_TUNE).map((r) => r.role);
  it('labels the lesson tune', () => {
    expect(roles).toEqual([
      'third', 'neighbor', 'third', 'fifth',
      'third', 'passing', 'root', 'third',
      'appoggiatura', 'third', 'root', 'passing',
      'third', 'passing', 'root',
    ]);
  });
  it('puts chord tones on every strong beat except the one appoggiatura', () => {
    const strong = classify(ROLE_TUNE).filter((r) => r.strong);
    expect(strong.filter((r) => !r.chordTone).map((r) => r.role)).toEqual(['appoggiatura']);
  });
  it('computes bars, beats and strong beats', () => {
    const r = classify(ROLE_TUNE);
    expect(r[0]).toMatchObject({ bar: 0, beat: 0, strong: true, chord: 0 });
    expect(r[1]).toMatchObject({ bar: 0, beat: 1, strong: false });
    expect(r[6]).toMatchObject({ bar: 1, beat: 2, strong: true, chord: 3 });
    expect(r[14]).toMatchObject({ bar: 3, beat: 2, strong: true });
  });
  it('recognizes passing, neighbor, appoggiatura and other in small cases', () => {
    const one = (is: number[], chord = 0) => classify({ chords: [chord], notes: is.map((i) => ({ i, dur: 1 })) }).map((r) => r.role);
    expect(one([0, 1, 2])[1]).toBe('passing');
    expect(one([4, 3, 2])[1]).toBe('passing');
    expect(one([2, 3, 2])[1]).toBe('neighbor');
    expect(one([0, -1, 0])[1]).toBe('neighbor');
    expect(one([4, 1, 0])[1]).toBe('appoggiatura');
    expect(one([0, 3, 7])[1]).toBe('other');
    expect(one([3])[0]).toBe('other');
  });
});

describe('transposition keeps the spelling by letter in all 12 keys', () => {
  it('spells the role tune with one letter per scale step', () => {
    for (const enh of ['Fs', 'Gb'] as const)
      for (const k of ALL_SLOTS) {
        const sc = majorScale(displayed(k, enh));
        const ns = melodyNotes(sc, ROLE_TUNE.notes);
        ROLE_TUNE.notes.forEach((x, j) => expect(ns[j]).toEqual(sc[((x.i % 7) + 7) % 7]));
        const semis = melodySemis(0, ROLE_TUNE.notes);
        ROLE_TUNE.notes.forEach((_, j) => expect(((semis[j] + pcOf(sc[0])) % 12 + 12) % 12).toBe(pcOf(ns[j])));
      }
  });
  it('keeps E♯ in F♯ major and C♭ in G♭ major', () => {
    expect(en(melodyNotes(majorScale(FS), ROLE_TUNE.notes.slice(8, 12)))).toBe('F♯ E♯ C♯ B');
    expect(en(melodyNotes(majorScale(GB), [{ i: 3, dur: 1 }, { i: -1, dur: 1 }]))).toBe('C♭ F');
  });
  it('the harmonizing melody is E F G A G E D C in C and correct in every key', () => {
    const toNotes = (sc: ReturnType<typeof majorScale>) => melodyNotes(sc, HARM_MELODY.map((i) => ({ i, dur: 4 })));
    expect(en(toNotes(majorScale(displayed(0, 'Fs'))))).toBe('E F G A G E D C');
    expect(en(toNotes(majorScale(displayed(11, 'Fs'))))).toBe('A B♭ C D C A G F');
    expect(en(toNotes(majorScale(displayed(5, 'Fs'))))).toBe('D♯ E F♯ G♯ F♯ D♯ C♯ B');
  });
  it('stepSemi follows W W H W W W H and the octave', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, -1].map((i) => stepSemi(0, i))).toEqual([0, 2, 4, 5, 7, 9, 11, 12, -1]);
  });
  it('fitBase keeps each tune on a narrow keyboard in every key', () => {
    for (const k of ALL_SLOTS) {
      const t = displayed(k, 'Fs');
      const b = fitBase(t, -1, 9);
      expect(((b % 12) + 12) % 12).toBe(pcOf(t));
      const [lo, hi] = groupRange([stepSemi(b, -1), stepSemi(b, 9)]);
      expect(hi - lo + 1).toBeLessThanOrEqual(29);
      expect([0, 5]).toContain(((lo % 12) + 12) % 12);
      expect([4, 11]).toContain(((hi % 12) + 12) % 12);
    }
  });
});

describe('tunes have full 4/4 bars', () => {
  it('every tune fills its bars exactly', () => {
    const all = [ROLE_TUNE, QUESTION, ...ENDINGS.map(answer), ...ENDINGS.map(period), SECTIONS.A, SECTIONS.B, SECTIONS.C];
    for (const t of all) expect(tuneBeats(t)).toBe(t.chords.length * BEATS);
  });
  it('the skeleton keeps only the strong-beat notes', () => {
    const s = skeleton(ROLE_TUNE);
    expect(s.notes.map((x) => x.i)).toEqual([2, 2, 5, 3, 7, 4, 2, 0]);
    expect(tuneBeats(s)).toBe(16);
  });
  it('forms are built from known sections', () => {
    expect(FORMS.map((f) => f.parts.join(''))).toEqual(['ACACBC', 'AABA', 'ABA']);
  });
});

describe('cadences of the period', () => {
  it('question ends on V with the melody on degree 2 (half cadence)', () => {
    expect(cadenceOf(QUESTION)).toEqual({ chord: 4, melody: 1, fn: 'D' });
  });
  it('the three endings of the answer', () => {
    expect(cadenceOf(answer('authentic'))).toEqual({ chord: 0, melody: 0, fn: 'T' });
    expect(cadenceOf(answer('half'))).toEqual({ chord: 4, melody: 1, fn: 'D' });
    expect(cadenceOf(answer('deceptive'))).toEqual({ chord: 5, melody: 0, fn: 'T' });
    expect(answer('authentic').chords.slice(-2)).toEqual([4, 0]);
    expect(answer('deceptive').chords.slice(-2)).toEqual([4, 5]);
  });
  it('the melody fits its chords on every strong beat', () => {
    for (const e of ENDINGS)
      for (const r of classify(period(e))) if (r.beat === 0) expect(r.chordTone).toBe(true);
    for (const t of Object.values(SECTIONS)) for (const r of classify(t)) if (r.beat === 0) expect(r.chordTone).toBe(true);
  });
});

describe('harmonizing', () => {
  it('the suggestion uses only chords that contain each melody note', () => {
    HARM_SUGGESTION.forEach((c, k) => expect(chordMember(c, HARM_MELODY[k])).not.toBeNull());
  });
  it('the suggestion gets no warnings', () => {
    expect(harmTips(HARM_SUGGESTION)).toEqual([{ tip: 'ok', bar: -1 }]);
  });
  it('asks for missing chords', () => {
    expect(harmTips(Array(8).fill(null))[0]).toEqual({ tip: 'pick', bar: 0 });
  });
  it('warns about start, end, cadence, lone vii° and D→SD', () => {
    const tips = (c: (number | null)[]) => harmTips(c).map((x) => x.tip);
    expect(tips([2, 3, 0, 1, 4, 5, 4, 0])).toContain('start');
    expect(tips([0, 3, 0, 1, 4, 5, 4, 5])).toContain('end');
    expect(tips([0, 3, 0, 1, 4, 5, 1, 0])).toContain('cadence');
    expect(tips([0, 3, 0, 1, 4, 5, 6, 0])).not.toContain('dim');
    expect(tips([0, 6, 0, 1, 4, 5, 4, 0])).not.toContain('dim');
    expect(tips([0, 3, 6, 1, 4, 5, 4, 0])).toContain('dim');
    expect(tips([0, 3, 0, 1, 4, 3, 4, 0])).toContain('back');
  });
});

describe('voiceUnder', () => {
  it('puts the melody on top, the other tones within the octave below and the root in the bass', () => {
    for (let top = 0; top < 24; top++)
      for (const pcs of [[0, 4, 7], [2, 5, 9], [7, 11, 2], [11, 2, 5]]) {
        if (!pcs.includes(((top % 12) + 12) % 12)) continue;
        const v = voiceUnder(pcs, top);
        expect(v.inner.length).toBe(2);
        v.inner.forEach((x) => {
          expect(x).toBeLessThan(top);
          expect(x).toBeGreaterThan(top - 12);
        });
        expect(((v.bass % 12) + 12) % 12).toBe(pcs[0]);
        expect(v.bass).toBeLessThan(Math.min(...v.inner));
        expect(top - v.bass).toBeLessThanOrEqual(24);
      }
  });
});
