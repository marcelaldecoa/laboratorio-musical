import { describe, expect, it } from 'vitest';
import { COMPOSERS } from './composers';
import { PERIOD_ORDER } from './types';
import { CURRICULUM } from '../lessons/curriculum';

const lessonIds = new Set(CURRICULUM.map((s) => s.id));

describe('COMPOSERS', () => {
  it('has unique ids', () => {
    const ids = COMPOSERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has plausible years (born < died, no future dates)', () => {
    for (const c of COMPOSERS) {
      expect(c.born, c.id).toBeGreaterThan(900);
      if (c.died !== null) {
        expect(c.born, c.id).toBeLessThan(c.died);
        expect(c.died, c.id).toBeLessThanOrEqual(new Date().getFullYear());
      }
    }
  });

  it('gives every period at least 3 composers, and uses only known periods', () => {
    for (const p of PERIOD_ORDER) {
      expect(COMPOSERS.filter((c) => c.period === p).length, p).toBeGreaterThanOrEqual(3);
    }
    for (const c of COMPOSERS) expect(PERIOD_ORDER, c.id).toContain(c.period);
  });

  it('keeps cards in period order, then by birth year', () => {
    for (let i = 1; i < COMPOSERS.length; i++) {
      const a = COMPOSERS[i - 1], b = COMPOSERS[i];
      const pa = PERIOD_ORDER.indexOf(a.period), pb = PERIOD_ORDER.indexOf(b.period);
      expect(pa <= pb, `${a.id} → ${b.id}`).toBe(true);
      if (pa === pb) expect(a.born <= b.born, `${a.id} → ${b.id}`).toBe(true);
    }
  });

  it('runs a Brazilian thread through the periods', () => {
    const brazil = COMPOSERS.filter((c) => c.brazil);
    const later = PERIOD_ORDER.filter((p) => p !== 'medieval' && p !== 'renaissance');
    const everyLaterPeriod = later.every((p) => brazil.some((c) => c.period === p));
    const spread = new Set(brazil.map((c) => c.period)).size;
    expect(everyLaterPeriod || (brazil.length >= 6 && spread >= 5)).toBe(true);
  });

  it('links only to existing lessons', () => {
    for (const c of COMPOSERS) {
      for (const l of c.lessons ?? []) expect(lessonIds.has(l), `${c.id}: ${l}`).toBe(true);
    }
  });

  it('has the same shape in pt and en, with non-empty texts', () => {
    for (const c of COMPOSERS) {
      expect(c.pt.listen.length, c.id).toBe(c.en.listen.length);
      expect(c.pt.listen.length, c.id).toBeGreaterThanOrEqual(2);
      expect(c.pt.listen.length, c.id).toBeLessThanOrEqual(4);
      expect(c.pt.play === '', c.id).toBe(c.en.play === '');
      for (const t of [c.pt, c.en]) {
        expect(t.why.trim(), c.id).not.toBe('');
        expect(t.fact.trim(), c.id).not.toBe('');
        for (const w of t.listen) expect(w.trim(), c.id).not.toBe('');
      }
    }
  });
});
