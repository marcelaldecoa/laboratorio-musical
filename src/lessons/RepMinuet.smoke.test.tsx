import { describe, expect, it } from 'vitest';
import { RepMinuet } from './RepMinuet';
import { smokeRender } from './smoke';

describe('RepMinuet', () => {
  it('renders in several keys and both languages', () => {
    const html = smokeRender(RepMinuet);
    expect(html.every((h) => h.length > 200)).toBe(true);
    expect(html.some((h) => /\{[A-G][#b]?\}/.test(h))).toBe(false);
  });
});
