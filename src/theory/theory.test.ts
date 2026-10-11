import { describe, expect, it } from 'vitest';
import {
  FS, GB, census, chordInfo, commonTones, diatonicSize, displayed, fifthIndex, fromFifthIndex, harmonizations,
  keySignature, logical, majorScale, noteName, pcOf, predLogical, quality, scaleDiff, sigShort, slotOf, triad,
  triadSteps, voice, type Direction, type Note,
} from './index';

const names = (ns: Note[]) => ns.map((n) => noteName(n, 'en')).join(' ');
const ALL_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const EXPECTED_SCALES: Record<string, string> = {
  C: 'C D E F G A B', G: 'G A B C D E F♯', D: 'D E F♯ G A B C♯', A: 'A B C♯ D E F♯ G♯',
  E: 'E F♯ G♯ A B C♯ D♯', B: 'B C♯ D♯ E F♯ G♯ A♯', 'F♯': 'F♯ G♯ A♯ B C♯ D♯ E♯', 'G♭': 'G♭ A♭ B♭ C♭ D♭ E♭ F',
  'D♭': 'D♭ E♭ F G♭ A♭ B♭ C', 'A♭': 'A♭ B♭ C D♭ E♭ F G', 'E♭': 'E♭ F G A♭ B♭ C D', 'B♭': 'B♭ C D E♭ F G A',
  F: 'F G A B♭ C D E',
};

describe('major scale spelling', () => {
  it('spells all keys one letter per degree', () => {
    for (const enh of ['Fs', 'Gb'] as const)
      for (const k of ALL_SLOTS) {
        const t = displayed(k, enh);
        const sc = majorScale(t);
        expect(names(sc)).toBe(EXPECTED_SCALES[noteName(t, 'en')]);
        expect(new Set(sc.map((n) => n.letter)).size).toBe(7);
      }
  });
  it('keeps E♯ in F♯ major and C♭ in G♭ major', () => {
    expect(majorScale(FS)[6]).toEqual({ letter: 2, acc: 1 });
    expect(majorScale(GB)[3]).toEqual({ letter: 0, acc: -1 });
  });
  it('localizes names in Portuguese', () => {
    expect(majorScale(FS).map((n) => noteName(n, 'pt')).join(' ')).toBe('Fá♯ Sol♯ Lá♯ Si Dó♯ Ré♯ Mi♯');
  });
  it('follows W W H W W W H', () => {
    for (const k of ALL_SLOTS) {
      const sc = majorScale(displayed(k, 'Fs'));
      const steps = sc.map((n, i) => (pcOf(sc[(i + 1) % 7]) - pcOf(n) + 12) % 12);
      expect(steps).toEqual([2, 2, 1, 2, 2, 2, 1]);
    }
  });
});

describe('circle of fifths', () => {
  it('signatures grow by one accidental per step in both directions', () => {
    const counts = ALL_SLOTS.map((k) => sigShort(displayed(k, 'Fs')));
    expect(counts).toEqual(['0', '1♯', '2♯', '3♯', '4♯', '5♯', '6♯', '5♭', '4♭', '3♭', '2♭', '1♭']);
    expect(sigShort(GB)).toBe('6♭');
  });
  it('lists sharps and flats in order', () => {
    expect(names(keySignature(FS).list)).toBe('F♯ C♯ G♯ D♯ A♯ E♯');
    expect(names(keySignature(GB).list)).toBe('B♭ E♭ A♭ D♭ G♭ C♭');
  });
  for (const dir of ['cw', 'ccw'] as Direction[]) {
    it(`changes exactly one note per step (${dir})`, () => {
      for (const k of ALL_SLOTS) {
        const cur = logical(k, dir);
        const prev = predLogical(k, dir);
        const d = scaleDiff(prev, cur)!;
        expect(d).not.toBeNull();
        const changed = majorScale(cur).filter(
          (n) => !majorScale(prev).some((p) => p.letter === n.letter && p.acc === n.acc),
        );
        expect(changed).toHaveLength(1);
        if (dir === 'cw') {
          expect(d.deg).toBe(7);
          expect(d.to - d.from).toBe(1);
        } else {
          expect(d.deg).toBe(4);
          expect(d.to - d.from).toBe(-1);
        }
        // jump is a perfect fifth clockwise, a perfect fourth counter-clockwise
        expect((pcOf(cur) - pcOf(prev) + 12) % 12).toBe(dir === 'cw' ? 7 : 5);
      }
    });
  }
  it('line of fifths round-trips and slots resolve', () => {
    for (let f = -14; f <= 20; f++) expect(fifthIndex(fromFifthIndex(f))).toBe(f);
    for (const k of ALL_SLOTS) expect(slotOf(displayed(k, 'Gb'))).toBe(k);
  });
  it('window holds the 7 scale notes from subdominant to leading tone', () => {
    for (const k of ALL_SLOTS) {
      const sc = majorScale(displayed(k, 'Fs'));
      const f0 = fifthIndex(sc[3]);
      const win = [0, 1, 2, 3, 4, 5, 6].map((j) => fromFifthIndex(f0 + j));
      expect(names(win)).toBe(names([3, 0, 4, 1, 5, 2, 6].map((d) => sc[d])));
    }
  });
});

describe('triads', () => {
  it('gives I ii iii IV V vi vii° in every key', () => {
    for (const enh of ['Fs', 'Gb'] as const)
      for (const k of ALL_SLOTS) {
        const sc = majorScale(displayed(k, enh));
        const romans = [0, 1, 2, 3, 4, 5, 6].map((d) => chordInfo(sc, d).roman);
        expect(romans).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
        for (let d = 0; d < 7; d++) {
          const ci = chordInfo(sc, d);
          const [r, t, f] = triad(sc, d).map(pcOf);
          const [a, b] = triadSteps(ci.quality);
          expect((t - r + 12) % 12).toBe(a);
          expect((f - t + 12) % 12).toBe(b);
        }
      }
  });
  it('spells triads by letter', () => {
    const sc = majorScale(FS);
    expect(names(triad(sc, 6))).toBe('E♯ G♯ B');
  });
  it('finds common tones between chords', () => {
    const sc = majorScale(displayed(0, 'Fs'));
    expect(names(commonTones(sc, 0, 5))).toBe('C E');
    expect(names(commonTones(sc, 0, 2))).toBe('E G');
    expect(commonTones(sc, 3, 4)).toHaveLength(0);
    expect(names(commonTones(sc, 4, 6))).toBe('B D');
  });
  it('each melody note harmonizes as root, third and fifth', () => {
    const sc = majorScale(displayed(0, 'Fs'));
    for (let m = 0; m < 7; m++)
      for (const h of harmonizations(m)) {
        const idx = { root: 0, third: 1, fifth: 2 }[h.role];
        expect(triad(sc, h.degree)[idx]).toEqual(sc[m]);
      }
  });
});

describe('intervals', () => {
  it('every number has exactly two sizes in the scale, the octave one', () => {
    for (let num = 2; num <= 7; num++) expect(new Set(census(num).map((c) => c.semis)).size).toBe(2);
    expect(new Set(census(8).map((c) => c.semis)).size).toBe(1);
  });
  it('names qualities', () => {
    expect(census(5).map((c) => c.quality).join('')).toBe('PPPPPPd');
    expect(census(4).map((c) => c.quality).join('')).toBe('PPPAPPP');
    expect(census(3).map((c) => c.quality).join('')).toBe('MmmMMmm');
    expect(quality(8, 12)).toBe('P');
  });
  it('inversions sum to 9 and 12 and swap qualities', () => {
    const swap = { P: 'P', M: 'm', m: 'M', A: 'd', d: 'A' } as const;
    for (let num = 2; num <= 7; num++)
      for (let from = 0; from < 7; from++) {
        const s = diatonicSize(from, num);
        const inv = diatonicSize((from + num - 1) % 7, 9 - num);
        expect(s + inv).toBe(12);
        expect(quality(9 - num, inv)).toBe(swap[quality(num, s)]);
      }
  });
});

describe('voice leading', () => {
  it('keeps common tones still', () => {
    const I = voice([0, 4, 7], null);
    const vi = voice([9, 0, 4], I);
    expect(I).toEqual([0, 4, 7]);
    expect(vi.filter((p) => I.includes(p))).toHaveLength(2);
    expect(Math.max(...vi) - Math.min(...vi)).toBeLessThanOrEqual(12);
  });
});
