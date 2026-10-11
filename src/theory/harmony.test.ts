import { describe, expect, it } from 'vitest';
import { type Direction, type Note, fifthIndex, logical, majorScale, noteName, pcOf } from './index';
import {
  BORROW_IDS, CLOSE_RELS, SECDOM_TARGETS, borrowedChord, closeKey, closeVoicing, dom7, hasDouble, inScale,
  keyScale, modulation, pivotChords, qualityOf, secondaryDominant, simpler, spellAbove, tritoneSub, windowOf,
} from './harmony';

const names = (ns: Note[]) => ns.map((n) => noteName(n, 'en')).join(' ');
const m12 = (n: number) => ((n % 12) + 12) % 12;
const SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
/** the 12 keys reached in each direction of the circle (F♯ clockwise, G♭ counter-clockwise) */
const KEYS: [string, Note][] = (['cw', 'ccw'] as Direction[]).flatMap((dir) =>
  SLOTS.map((k): [string, Note] => [`${noteName(logical(k, dir), 'en')} (${dir})`, logical(k, dir)]),
);
const intervalsFromRoot = (ns: Note[]) => ns.map((n) => m12(pcOf(n) - pcOf(ns[0])));
const stacksThirds = (ns: Note[]) => ns.every((n, i) => i === 0 || (n.letter - ns[0].letter + 7) % 7 === 2 * i);

describe('spelling helpers', () => {
  it('spells above by letter, keeping double accidentals', () => {
    expect(spellAbove({ letter: 2, acc: 1 }, 2, 4)).toEqual({ letter: 4, acc: 2 }); // E♯ → G𝄪
    expect(names(dom7({ letter: 1, acc: -1 }))).toBe('D♭ F A♭ C♭');
  });
  it('simplifies double accidentals along the line of fifths', () => {
    expect(simpler({ letter: 6, acc: -2 })).toEqual({ letter: 5, acc: 0 }); // B𝄫 = A
    expect(simpler({ letter: 4, acc: 2 })).toEqual({ letter: 5, acc: 0 }); // G𝄪 = A
    expect(simpler({ letter: 0, acc: 1 })).toEqual({ letter: 0, acc: 1 });
  });
});

describe('secondary dominants', () => {
  for (const [label, tonic] of KEYS)
    it(label, () => {
      const sc = majorScale(tonic);
      const borrowedCount = SECDOM_TARGETS.map((d) => {
        const sd = secondaryDominant(tonic, d);
        expect(qualityOf(sd.notes)).toBe('dom7');
        expect(intervalsFromRoot(sd.notes)).toEqual([0, 4, 7, 10]);
        expect(stacksThirds(sd.notes)).toBe(true);
        // root a perfect fifth above the target, by letter and by sound
        expect(sd.root.letter).toBe((sc[d].letter + 4) % 7);
        expect(m12(pcOf(sd.root) - pcOf(sc[d]))).toBe(7);
        // third = temporary leading tone: a half step and one letter below the target
        expect(m12(pcOf(sc[d]) - pcOf(sd.notes[1]))).toBe(1);
        expect((sd.notes[1].letter + 1) % 7).toBe(sc[d].letter);
        sd.notes.forEach((n, i) => expect(sd.borrowed[i]).toBe(!inScale(sc, n)));
        // the V7 fits inside the window of the key whose tonic is the target
        const f = sd.notes.map(fifthIndex);
        const w = fifthIndex(sc[d]) - 1;
        f.forEach((x) => expect(x >= w && x <= w + 6).toBe(true));
        return sd.borrowed.filter(Boolean).length;
      });
      // ii, iii, IV, V, vi
      expect(borrowedCount).toEqual([1, 2, 1, 1, 1]);
      // V/IV borrows its seventh; the others borrow the leading tone
      expect(secondaryDominant(tonic, 3).borrowed).toEqual([false, false, false, true]);
      for (const d of [1, 2, 4, 5]) expect(secondaryDominant(tonic, d).borrowed[1]).toBe(true);
    });
  it('spells C, F♯ and G♭ correctly', () => {
    const C: Note = { letter: 0, acc: 0 };
    expect(SECDOM_TARGETS.map((d) => names(secondaryDominant(C, d).notes))).toEqual([
      'A C♯ E G', 'B D♯ F♯ A', 'C E G B♭', 'D F♯ A C', 'E G♯ B D',
    ]);
    expect(names(secondaryDominant({ letter: 3, acc: 1 }, 2).notes)).toBe('E♯ G𝄪 B♯ D♯');
    expect(names(secondaryDominant({ letter: 4, acc: -1 }, 3).notes)).toBe('G♭ B♭ D♭ F♭');
  });
});

describe('close keys and pivot chords', () => {
  for (const [label, tonic] of KEYS)
    it(label, () => {
      const shifts = CLOSE_RELS.map((rel) => {
        const m = modulation(tonic, rel);
        const sa = keyScale(m.from);
        const sb = keyScale(m.to);
        expect(m.to).toEqual(closeKey(tonic, rel));
        // the windows overlap in 6 notes (or all 7 for the relative minor)
        expect(sa.filter((n) => inScale(sb, n)).length).toBe(m.shift === 0 ? 7 : 6);
        expect(m.pivots.length).toBe(m.shift === 0 ? 7 : 4);
        m.pivots.forEach((p) => p.notes.forEach((n) => {
          expect(inScale(sa, n)).toBe(true);
          expect(inScale(sb, n)).toBe(true);
        }));
        // pivot is neither the old tonic nor the new tonic
        expect(m.pivot.degA).not.toBe(0);
        expect(m.pivot.degB).not.toBe(0);
        // the new key's V7 is the secondary dominant of that degree
        const d = { ii: 1, iii: 2, IV: 3, V: 4, vi: 5 }[rel];
        expect(m.chords[2]).toEqual(secondaryDominant(tonic, d).notes);
        expect(m.chords[3][0]).toEqual(majorScale(tonic)[d]);
        return m.shift;
      });
      expect(shifts).toEqual([1, -1, 0, -1, 1]);
    });
  it('C → G: Am is vi in C and ii in G', () => {
    const C: Note = { letter: 0, acc: 0 };
    const m = modulation(C, 'V');
    expect(m.pivots.map((p) => `${p.romanA}=${p.romanB}`)).toEqual(['I=IV', 'iii=vi', 'V=I', 'vi=ii']);
    expect(names(m.pivot.notes)).toBe('A C E');
    expect(modulation(C, 'vi').pivot.romanB).toBe('iv');
    expect(names(modulation(C, 'ii').pivot.notes)).toBe('F A C');
    expect(windowOf(closeKey(C, 'vi'))).toBe(windowOf({ tonic: C, minor: false }));
    expect(pivotChords({ tonic: C, minor: false }, closeKey(C, 'IV')).length).toBe(4);
  });
});

describe('modal borrowing', () => {
  for (const [label, tonic] of KEYS)
    it(label, () => {
      const sc = majorScale(tonic);
      const r = BORROW_IDS.map((id) => {
        const b = borrowedChord(tonic, id);
        expect(stacksThirds(b.notes)).toBe(true);
        b.notes.forEach((n, i) => {
          const same = sc.find((x) => x.letter === n.letter)!;
          if (b.changed[i]) {
            expect(n.acc).toBe(same.acc - 1);
            expect(m12(pcOf(same) - pcOf(n))).toBe(1);
          } else expect(n).toEqual(same);
        });
        expect(b.counterpart[0].letter).toBe(b.notes[0].letter);
        return `${b.roman}:${b.quality}:${b.changed.filter(Boolean).length}`;
      });
      expect(r).toEqual(['iv:min:1', '♭VI:maj:2', '♭VII:maj:1', '♭III:maj:2']);
    });
  it('spells C and G♭', () => {
    const C: Note = { letter: 0, acc: 0 };
    expect(BORROW_IDS.map((id) => names(borrowedChord(C, id).notes))).toEqual(['F A♭ C', 'A♭ C E♭', 'B♭ D F', 'E♭ G B♭']);
    const Gb: Note = { letter: 4, acc: -1 };
    expect(names(borrowedChord(Gb, 'bVI').notes)).toBe('E𝄫 G♭ B𝄫');
    expect(hasDouble(borrowedChord(Gb, 'bVI').notes)).toBe(true);
  });
});

describe('tritone substitution', () => {
  for (const [label, tonic] of KEYS)
    it(label, () => {
      const { v, sub, practical } = tritoneSub(tonic);
      expect(intervalsFromRoot(sub)).toEqual([0, 4, 7, 10]);
      expect(stacksThirds(sub)).toBe(true);
      // same tritone, roles swapped: V's 3rd = sub's 7th, V's 7th = sub's 3rd
      expect(pcOf(v[1])).toBe(pcOf(sub[3]));
      expect(pcOf(v[3])).toBe(pcOf(sub[1]));
      // roots a tritone apart: opposite sides of the circle, 6 fifths apart on the line
      expect(m12(pcOf(sub[0]) - pcOf(v[0]))).toBe(6);
      expect(fifthIndex(v[0]) - fifthIndex(sub[0])).toBe(6);
      // ♭II: a half step and one letter above the tonic
      expect(sub[0].letter).toBe((tonic.letter + 1) % 7);
      expect(m12(pcOf(sub[0]) - pcOf(tonic))).toBe(1);
      expect(practical != null).toBe(hasDouble(sub));
      if (practical) expect(pcOf(practical)).toBe(pcOf(sub[0]));
    });
  it('G7 and D♭7 share B/C♭ and F', () => {
    const { v, sub } = tritoneSub({ letter: 0, acc: 0 });
    expect(names(v)).toBe('G B D F');
    expect(names(sub)).toBe('D♭ F A♭ C♭');
    expect(noteName(tritoneSub({ letter: 4, acc: -1 }).practical!, 'en')).toBe('G');
  });
});

describe('close voicing', () => {
  it('keeps notes inside the range and moves little', () => {
    const a = closeVoicing([7, 11, 2, 5], null);
    expect(a.map(m12).sort()).toEqual([11, 2, 5, 7].sort());
    const b = closeVoicing([0, 4, 7], a);
    b.forEach((x) => expect(x >= 0 && x <= 23).toBe(true));
    expect(b[b.length - 1] - b[0]).toBeLessThanOrEqual(12);
    // the leading tone B resolves up to C, the seventh F down to E
    expect(b).toContain(a[a.indexOf(a.find((x) => m12(x) === 11)!)] + 1);
  });
});
