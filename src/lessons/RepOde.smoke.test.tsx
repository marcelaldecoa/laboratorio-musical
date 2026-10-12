import { describe, expect, it } from 'vitest';
import { RepOde } from './RepOde';
import { smokeRender } from './smoke';

describe('RepOde', () => {
  it('renders in several keys and both languages', () => {
    const html = smokeRender(RepOde);
    expect(html.every((h) => h.length > 200)).toBe(true);
    expect(html.some((h) => /\{[A-G][#b]?\}/.test(h))).toBe(false);
  });
});
