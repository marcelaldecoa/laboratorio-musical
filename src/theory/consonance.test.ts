import { describe, expect, it } from 'vitest';
import { FS, GB, SLOTS, fifthIndex, fromFifthIndex, mod, pcOf, quality } from './index';
import {
  CONS_INTERVALS, RESOLUTIONS, byConsonance, cents, degreeInterval, degreeSemis, firstShared, gcd, sharedHarmonics,
} from './physics';

const TONICS = [...SLOTS.filter((n) => n !== null), FS, GB];

describe('consonance spectrum', () => {
  it('is already sorted from most to least consonant', () => {
    expect(byConsonance(CONS_INTERVALS).map((i) => i.id)).toEqual(CONS_INTERVALS.map((i) => i.id));
    expect(CONS_INTERVALS.map((i) => i.id).join(' ')).toBe('P8 P5 P4 M6 M3 m3 m6 m7 M2 M7 m2 A4');
  });
  it('ratios are in lowest terms and match the piano size', () => {
    for (const iv of CONS_INTERVALS) {
      expect(gcd(iv.p, iv.q), iv.id).toBe(1);
      expect(Math.round(cents(iv.p / iv.q) / 100), iv.id).toBe(iv.semis);
      expect(mod(7 * iv.fifths, 12), iv.id).toBe(iv.semis % 12);
      expect(firstShared(iv.p)).toBe(iv.p);
    }
  });
  it('shared harmonics among the first 16 fall as the ratio gets complex', () => {
    expect(CONS_INTERVALS.map((i) => sharedHarmonics(i.p, i.q, 16).length)).toEqual([8, 5, 4, 3, 3, 2, 2, 1, 1, 1, 1, 0]);
  });
  it('quality and number agree with the interval theory', () => {
    const q = (n: number, s: number) => quality(n === 8 ? 8 : n, s);
    expect(CONS_INTERVALS.map((i) => q(i.num, i.semis) + i.num).join(' ')).toBe('P8 P5 P4 M6 M3 m3 m6 m7 M2 M7 m2 A4');
  });
  it('classes: perfect = 4, 5, 8; imperfect = 3, 6; the rest dissonant', () => {
    for (const iv of CONS_INTERVALS) {
      const want = [4, 5, 8].includes(iv.num) && iv.id !== 'A4' ? 'perfect' : [3, 6].includes(iv.num) ? 'imperfect' : 'dissonant';
      expect(iv.cls, iv.id).toBe(want);
    }
  });
  it('spells the upper note by letter in all 12 keys (number = letter distance + 1)', () => {
    for (const t of TONICS)
      for (const iv of CONS_INTERVALS) {
        const up = fromFifthIndex(fifthIndex(t) + iv.fifths);
        expect(mod(up.letter - t.letter, 7) + 1, iv.id).toBe(iv.num === 8 ? 1 : iv.num);
        expect(mod(pcOf(up) - pcOf(t), 12)).toBe(iv.semis % 12);
      }
  });
});

describe('resolutions', () => {
  it('degree sizes', () => {
    expect([0, 1, 2, 3, 6, 7, 9, 10].map(degreeSemis)).toEqual([0, 2, 4, 5, 11, 12, 16, 17]);
  });
  it('each voice moves by step (1 or 2 half steps) into a 3rd or 6th', () => {
    for (const r of RESOLUTIONS) {
      for (const v of [0, 1]) {
        const d = Math.abs(degreeSemis(r.to[v]) - degreeSemis(r.from[v]));
        expect(d, r.id).toBeLessThanOrEqual(2);
        expect(Math.abs(r.to[v] - r.from[v]), r.id).toBeLessThanOrEqual(1);
      }
      expect([3, 6], r.id).toContain(degreeInterval(r.to[0], r.to[1]).num);
    }
  });
  it('the starting intervals: M2, P4, A4, d5', () => {
    const iv = RESOLUTIONS.map((r) => degreeInterval(r.from[0], r.from[1]));
    expect(iv.map(({ num, semis }) => quality(num, semis) + num)).toEqual(['M2', 'P4', 'A4', 'd5']);
    const to = RESOLUTIONS.map((r) => degreeInterval(r.to[0], r.to[1]));
    expect(to.map(({ num, semis }) => quality(num, semis) + num)).toEqual(['M3', 'M3', 'm6', 'M3']);
  });
});
