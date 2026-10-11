import { describe, expect, it } from 'vitest';
import { SLOTS, FS, GB, majorScale, noteName, pcOf } from './index';
import {
  C4_HZ, JUST_INTERVALS, cents, centsOff, gcd, harmonicHz, harmonicSeries, isOff, keyHz, nearestSemitone, octaveReduced, sharedHarmonics,
} from './physics';

const TONICS = [...SLOTS.filter((n) => n !== null), FS, GB];

describe('harmonic series math', () => {
  it('frequencies are whole multiples of the fundamental', () => {
    expect(harmonicHz(100, 1)).toBe(100);
    expect(harmonicHz(100, 3)).toBe(300);
    expect(harmonicHz(65.4, 16)).toBeCloseTo(1046.4, 6);
  });
  it('equal-tempered keys', () => {
    expect(keyHz(9)).toBeCloseTo(440, 9);
    expect(keyHz(0)).toBeCloseTo(C4_HZ, 9);
    expect(keyHz(12)).toBeCloseTo(2 * C4_HZ, 9);
    expect(C4_HZ).toBeCloseTo(261.626, 3);
  });
  it('cents', () => {
    expect(cents(2)).toBeCloseTo(1200, 9);
    expect(cents(1.5)).toBeCloseTo(701.955, 3);
    expect(cents(5 / 4)).toBeCloseTo(386.314, 3);
  });
  it('nearest key in semitones from the fundamental', () => {
    expect(Array.from({ length: 16 }, (_, i) => nearestSemitone(i + 1))).toEqual(
      [0, 12, 19, 24, 28, 31, 34, 36, 38, 40, 42, 43, 44, 46, 47, 48],
    );
  });
  it('deviation in cents', () => {
    expect(centsOff(1)).toBe(0);
    expect(centsOff(2)).toBeCloseTo(0, 9);
    expect(centsOff(3)).toBeCloseTo(1.955, 3);
    expect(centsOff(5)).toBeCloseTo(-13.686, 3);
    expect(centsOff(7)).toBeCloseTo(-31.174, 3);
    expect(centsOff(11)).toBeCloseTo(-48.682, 3);
    expect(centsOff(13)).toBeCloseTo(40.528, 3);
  });
  it('7, 11, 13 (and 14 = 2 × 7) are the noticeably off ones', () => {
    expect(Array.from({ length: 16 }, (_, i) => i + 1).filter(isOff)).toEqual([7, 11, 13, 14]);
  });
  it('octave-reduced ratios', () => {
    expect(octaveReduced(1)).toEqual([1, 1]);
    expect(octaveReduced(3)).toEqual([3, 2]);
    expect(octaveReduced(5)).toEqual([5, 4]);
    expect(octaveReduced(6)).toEqual([3, 2]);
    expect(octaveReduced(7)).toEqual([7, 4]);
    expect(octaveReduced(8)).toEqual([1, 1]);
    expect(octaveReduced(15)).toEqual([15, 8]);
    expect(gcd(12, 18)).toBe(6);
  });
});

describe('harmonic series spelling in the 12 keys (both spellings of F♯/G♭)', () => {
  it('C: C C G C E G B♭ C D E F♯ G A♭ B♭ B C', () => {
    expect(harmonicSeries({ letter: 0, acc: 0 }).map((h) => noteName(h.note, 'en')).join(' ')).toBe(
      'C C G C E G B♭ C D E F♯ G A♭ B♭ B C',
    );
  });
  it('F♯ keeps letters: E for the 7th, B♯ for the 11th', () => {
    const h = harmonicSeries(FS);
    expect(noteName(h[6].note, 'en')).toBe('E');
    expect(noteName(h[10].note, 'en')).toBe('B♯');
    expect(noteName(h[4].note, 'en')).toBe('A♯');
  });
  it('G♭: the 13th is E𝄫, the 7th is F♭', () => {
    const h = harmonicSeries(GB);
    expect(noteName(h[12].note, 'en')).toBe('E𝄫');
    expect(noteName(h[6].note, 'en')).toBe('F♭');
  });
  for (const t of TONICS)
    it(`${noteName(t, 'en')}: pitch classes match the nearest keys and the 4:5:6 triad is the major tonic triad`, () => {
      const h = harmonicSeries(t);
      h.forEach((x) => expect(pcOf(x.note)).toBe((pcOf(t) + x.semis) % 12));
      const sc = majorScale(t);
      expect([h[3].note, h[4].note, h[5].note]).toEqual([sc[0], sc[2], sc[4]]);
      expect(h[8].note).toEqual(sc[1]);
      expect(h[14].note).toEqual(sc[6]);
      // spelled by letter: never more than a double accidental
      h.forEach((x) => expect(Math.abs(x.note.acc)).toBeLessThanOrEqual(2));
    });
});

describe('shared harmonics (consonance)', () => {
  it('octave shares every 2nd harmonic, the fifth every 3rd', () => {
    expect(sharedHarmonics(2, 1)).toEqual([2, 4, 6, 8, 10, 12, 14, 16]);
    expect(sharedHarmonics(3, 2)).toEqual([3, 6, 9, 12, 15]);
    expect(sharedHarmonics(4, 3)).toEqual([4, 8, 12, 16]);
    expect(sharedHarmonics(5, 4)).toEqual([5, 10, 15]);
  });
  it('the counts fall from the octave to the half step', () => {
    const c = JUST_INTERVALS.map((i) => sharedHarmonics(i.p, i.q).length);
    expect(c).toEqual([8, 5, 4, 3, 2, 1, 1]);
  });
  it('just ratios are close to the piano sizes', () => {
    JUST_INTERVALS.forEach((i) => expect(Math.abs(cents(i.p / i.q) - 100 * i.semis)).toBeLessThan(20));
  });
});
