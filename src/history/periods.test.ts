import { describe, expect, it } from 'vitest';
import { PERIODS } from './periods';
import { PERIOD_ORDER } from './types';
import { CURRICULUM } from '../lessons/curriculum';

const lessonIds = new Set(CURRICULUM.map((s) => s.id));

describe('history periods', () => {
  it('has the 9 periods in PERIOD_ORDER', () => {
    expect(PERIODS.map((p) => p.id)).toEqual(PERIOD_ORDER);
  });

  it('dates are ordered: from < to, and periods start chronologically', () => {
    PERIODS.forEach((p, i) => {
      expect(p.from).toBeLessThan(p.to);
      if (i > 0) expect(p.from).toBeGreaterThanOrEqual(PERIODS[i - 1].from);
    });
  });

  it('links only to existing lessons, without repeats', () => {
    for (const p of PERIODS) {
      expect(p.lessons.length).toBeGreaterThan(0);
      expect(new Set(p.lessons).size).toBe(p.lessons.length);
      for (const id of p.lessons) expect(lessonIds.has(id), `${p.id}: ${id}`).toBe(true);
    }
  });

  it('keyboard ranges are ascending and inside A0..C8', () => {
    for (const p of PERIODS) {
      if (!p.range) continue;
      const [lo, hi] = p.range;
      expect(lo).toBeLessThan(hi);
      expect(lo).toBeGreaterThanOrEqual(-39);
      expect(hi).toBeLessThanOrEqual(48);
    }
    // instruments only grow over time
    const ranged = PERIODS.filter((p) => p.range);
    for (let i = 1; i < ranged.length; i++) {
      expect(ranged[i].range![0]).toBeLessThanOrEqual(ranged[i - 1].range![0]);
      expect(ranged[i].range![1]).toBeGreaterThanOrEqual(ranged[i - 1].range![1]);
    }
  });

  it('sketches fit the instrument, have positive durations and last 3–12 s', () => {
    for (const p of PERIODS) {
      expect(p.sketch.length, p.id).toBeGreaterThan(0);
      expect(p.sketch.length, p.id).toBeLessThan(120);
      const [lo, hi] = p.range ?? [-39, 48];
      for (const e of p.sketch) {
        expect(Number.isInteger(e.s), p.id).toBe(true);
        expect(e.s, p.id).toBeGreaterThanOrEqual(lo);
        expect(e.s, p.id).toBeLessThanOrEqual(hi);
        expect(e.t, p.id).toBeGreaterThanOrEqual(0);
        expect(e.d, p.id).toBeGreaterThan(0);
        if (e.v !== undefined) {
          expect(e.v).toBeGreaterThan(0);
          expect(e.v).toBeLessThanOrEqual(1);
        }
      }
      const end = Math.max(...p.sketch.map((e) => e.t + e.d));
      expect(end, p.id).toBeGreaterThanOrEqual(3);
      expect(end, p.id).toBeLessThanOrEqual(12);
    }
  });

  it('pt and en have the same shape and the texts are filled', () => {
    for (const p of PERIODS) {
      for (const lang of ['pt', 'en'] as const) {
        const t = p[lang];
        expect(t.question.trim().endsWith('?'), `${p.id}/${lang}`).toBe(true);
        expect(t.steps.length).toBeGreaterThanOrEqual(3);
        expect(t.steps.length).toBeLessThanOrEqual(5);
        for (const s of [t.name, t.years, t.intro, t.oneLine, t.instrument.name, t.instrument.text, t.sketch.title, t.sketch.caption, ...t.steps, ...t.more]) {
          expect(s.trim().length, `${p.id}/${lang}`).toBeGreaterThan(0);
        }
      }
      expect(p.pt.steps.length, p.id).toBe(p.en.steps.length);
      expect(p.pt.more.length, p.id).toBe(p.en.more.length);
    }
  });
});
