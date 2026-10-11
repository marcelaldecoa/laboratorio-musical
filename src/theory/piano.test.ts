import { describe, expect, it } from 'vitest';
import { FS, GB, displayed, isBlackKey, majorScale, noteName, pcOf, scaleSemitones, type Note } from './index';
import {
  LH_BAR, MIDDLE_C, accidentalToShow, chordTone, clefFor, crossings, diatonic, handPositions, ledgerLines,
  noteAtDiatonic, octaveOf, scaleFingering, semitoneOf, signaturePositions, spellInKey, staffLetters, staffPos,
} from './piano';

const ALL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const keys: Note[] = [...ALL.map((k) => displayed(k, 'Fs')), GB];
const en = (n: Note) => noteName(n, 'en');

describe('scale fingering', () => {
  it('has 8 notes per hand with fingers 1–5 in every key', () => {
    for (const t of keys) {
      const f = scaleFingering(t);
      for (const h of [f.rh, f.lh]) {
        expect(h).toHaveLength(8);
        expect(h.every((x) => x >= 1 && x <= 5)).toBe(true);
      }
    }
  });
  it('puts the thumb only on white keys', () => {
    for (const t of keys) {
      const keysUp = scaleSemitones(pcOf(t));
      const f = scaleFingering(t);
      for (const h of [f.rh, f.lh]) h.forEach((x, i) => { if (x === 1) expect(isBlackKey(keysUp[i])).toBe(false); });
    }
  });
  it('uses the thumb twice per octave in each hand', () => {
    for (const t of keys) {
      const f = scaleFingering(t);
      expect(f.rh.filter((x) => x === 1)).toHaveLength(2);
      expect(f.lh.filter((x) => x === 1)).toHaveLength(2);
    }
  });
  it('crosses only after finger 3 or 4 (right hand up, left hand down)', () => {
    for (const t of keys) {
      const f = scaleFingering(t);
      for (const c of crossings(f.rh, 'rh', 'up')) {
        expect(c.kind).toBe('under');
        expect([3, 4]).toContain(f.rh[c.from]);
      }
      for (const c of crossings(f.lh, 'lh', 'down')) {
        expect(c.kind).toBe('under');
        expect([3, 4]).toContain(f.lh[c.from]);
      }
      for (const c of crossings(f.lh, 'lh', 'up')) {
        expect(c.kind).toBe('over');
        expect([3, 4]).toContain(f.lh[c.to]);
      }
      for (const c of crossings(f.rh, 'rh', 'down')) {
        expect(c.kind).toBe('over');
        expect([3, 4]).toContain(f.rh[c.to]);
      }
    }
  });
  it('moves finger by finger between crossings (adjacent notes, adjacent fingers)', () => {
    for (const t of keys) {
      const { rh, lh } = scaleFingering(t);
      for (let i = 0; i < 7; i++) {
        if (rh[i + 1] !== 1) expect(rh[i + 1] - rh[i]).toBe(1);
        if (lh[i] !== 1) expect(lh[i] - lh[i + 1]).toBe(1);
      }
    }
  });
  it('knows the standard patterns', () => {
    const s = (t: Note) => scaleFingering(t).rh.join('') + '/' + scaleFingering(t).lh.join('');
    expect(s({ letter: 0, acc: 0 })).toBe('12312345/54321321');
    expect(s({ letter: 3, acc: 0 })).toBe('12341234/54321321');
    expect(s({ letter: 6, acc: 0 })).toBe('12312345/43214321');
    expect(s(FS)).toBe('23412312/43213214');
    expect(s(GB)).toBe(s(FS));
    expect(s({ letter: 6, acc: -1 })).toBe('41231234/32143213');
    expect(s({ letter: 2, acc: -1 })).toBe('31234123/32143213');
    expect(s({ letter: 5, acc: -1 })).toBe('34123123/32143213');
    expect(s({ letter: 1, acc: -1 })).toBe('23123412/32143213');
  });
  it('groups the fingers in positions of 3 and 4 (C major)', () => {
    const f = scaleFingering({ letter: 0, acc: 0 });
    expect(handPositions(f.rh, 'rh').map((g) => g.length)).toEqual([3, 5]);
    expect(handPositions(f.lh, 'lh').map((g) => g.length)).toEqual([5, 3]);
  });
  it('places fingers 2-3 and 2-3-4 on the two black-key groups in F♯ (right hand)', () => {
    const f = scaleFingering(FS).rh;
    const ks = scaleSemitones(pcOf(FS));
    const blacks = f.filter((_, i) => isBlackKey(ks[i]));
    expect(blacks.join('')).toBe('234232');
  });
});

describe('staff positions', () => {
  const C = { letter: 0, acc: 0 };
  it('puts middle C one ledger line below the treble staff and one above the bass staff', () => {
    expect(diatonic(C, 4)).toBe(MIDDLE_C);
    expect(staffPos(C, 4, 'treble')).toBe(-2);
    expect(staffPos(C, 4, 'bass')).toBe(10);
    expect(ledgerLines(-2)).toEqual([-2]);
    expect(ledgerLines(10)).toEqual([10]);
    expect(clefFor(MIDDLE_C)).toBe('treble');
    expect(clefFor(MIDDLE_C - 1)).toBe('bass');
  });
  it('lines and spaces of both staves', () => {
    const L = (ls: number[]) => ls.map((l) => en({ letter: l, acc: 0 })).join('');
    expect(L(staffLetters('treble', 'line'))).toBe('EGBDF');
    expect(L(staffLetters('treble', 'space'))).toBe('FACE');
    expect(L(staffLetters('bass', 'line'))).toBe('GBDFA');
    expect(L(staffLetters('bass', 'space'))).toBe('ACEG');
  });
  it('works across octaves', () => {
    expect(staffPos({ letter: 4, acc: 0 }, 4, 'treble')).toBe(2); // G4 on the G-clef line
    expect(staffPos({ letter: 3, acc: 0 }, 3, 'bass')).toBe(6); // F3 on the F-clef line
    expect(staffPos({ letter: 5, acc: 0 }, 5, 'treble')).toBe(10); // A5
    expect(staffPos({ letter: 2, acc: 0 }, 2, 'bass')).toBe(-2); // E2
    expect(staffPos({ letter: 0, acc: 0 }, 6, 'treble')).toBe(12);
    expect(ledgerLines(12)).toEqual([10, 12]);
    expect(ledgerLines(-5)).toEqual([-2, -4]);
    expect(ledgerLines(3)).toEqual([]);
    expect(staffPos({ letter: 0, acc: 0 }, 5, 'treble') - staffPos(C, 4, 'treble')).toBe(7);
  });
  it('accidentals do not move the note on the staff', () => {
    expect(staffPos({ letter: 3, acc: 1 }, 4, 'treble')).toBe(staffPos({ letter: 3, acc: 0 }, 4, 'treble'));
  });
  it('octave numbers follow the letter, not the sound', () => {
    expect(semitoneOf({ letter: 6, acc: 1 }, 3)).toBe(0); // B♯3 = middle C key
    expect(octaveOf({ letter: 6, acc: 1 }, 0)).toBe(3);
    expect(octaveOf({ letter: 0, acc: -1 }, 11)).toBe(5); // C♭5 = B4 key
    for (let s = -24; s <= 24; s++) {
      const n = spellInKey({ letter: 0, acc: 0 }, s);
      expect(semitoneOf(n, octaveOf(n, s))).toBe(s);
    }
  });
  it('spells keys inside the current key (12 keys)', () => {
    for (const t of keys) {
      const sc = majorScale(t);
      scaleSemitones(pcOf(t)).slice(0, 7).forEach((s, i) => expect(spellInKey(t, s)).toEqual(sc[i]));
      for (let s = 0; s < 12; s++) expect(pcOf(spellInKey(t, s))).toBe(s);
    }
    expect(en(spellInKey(FS, 5))).toBe('E♯');
    expect(en(spellInKey(GB, 11))).toBe('C♭');
    expect(en(spellInKey({ letter: 6, acc: -1 }, 6))).toBe('G♭');
    expect(en(spellInKey({ letter: 1, acc: 0 }, 8))).toBe('G♯');
  });
  it('shows accidentals only when the key signature does not say them', () => {
    const sc = majorScale({ letter: 1, acc: 0 }); // D major: F♯ C♯
    expect(accidentalToShow({ letter: 3, acc: 1 }, sc)).toBeNull();
    expect(accidentalToShow({ letter: 3, acc: 0 }, sc)).toBe(0);
    expect(accidentalToShow({ letter: 4, acc: 1 }, sc)).toBe(1);
  });
  it('reads staff positions with the key signature', () => {
    const sc = majorScale({ letter: 6, acc: -1 });
    const r = noteAtDiatonic(sc, diatonic({ letter: 6, acc: 0 }, 3));
    expect(en(r.note)).toBe('B♭');
    expect(r.s).toBe(-2);
  });
  it('places key signatures on both staves', () => {
    expect(signaturePositions(FS, 'treble').map((x) => x.pos)).toEqual([8, 5, 9, 6, 3, 7]);
    expect(signaturePositions(FS, 'bass').map((x) => x.pos)).toEqual([6, 3, 7, 4, 1, 5]);
    expect(signaturePositions(GB, 'bass').map((x) => x.pos)).toEqual([2, 5, 1, 4, 0, 3]);
    expect(signaturePositions({ letter: 0, acc: 0 }, 'treble')).toEqual([]);
  });
});

describe('left-hand patterns', () => {
  it('fill a 4/4 bar of 8 eighths', () => {
    for (const bar of Object.values(LH_BAR)) expect(bar.reduce((a, e) => a + e.len, 0)).toBe(8);
  });
  it('build chord tones', () => {
    expect([1, 3, 5, 8].map((t) => chordTone(-24, 4, t))).toEqual([-24, -20, -17, -12]);
    expect(chordTone(-24, 3, 3)).toBe(-21);
  });
});
