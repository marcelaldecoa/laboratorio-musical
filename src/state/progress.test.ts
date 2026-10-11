import { describe, expect, it } from 'vitest';
import { BOX_DAYS, dueReviews, nextBox, streak, today } from './store';

describe('progress', () => {
  it('counts consecutive days', () => {
    const now = new Date(2026, 9, 11, 20);
    const d = (n: number) => today(new Date(2026, 9, 11 - n));
    expect(streak([d(0), d(1), d(2)], now)).toBe(3);
    expect(streak([d(1), d(2)], now)).toBe(2);
    expect(streak([d(0), d(2)], now)).toBe(1);
    expect(streak([d(3)], now)).toBe(0);
  });
  it('moves Leitner boxes', () => {
    const t0 = 1_000_000;
    const a = nextBox(undefined, false, t0);
    expect(a.box).toBe(0);
    const b = nextBox(a, true, t0);
    expect(b.box).toBe(1);
    expect(b.due - t0).toBe(BOX_DAYS[1] * 86_400_000);
    expect(nextBox(b, false, t0).box).toBe(0);
    expect(dueReviews({ x: { box: 0, due: t0 }, y: { box: 1, due: t0 + 5 } }, t0)).toEqual(['x']);
  });
});
