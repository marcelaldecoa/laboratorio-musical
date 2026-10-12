import { describe, expect, it } from 'vitest';
import { RepElise } from './RepElise';
import { smokeRender } from './smoke';

describe('RepElise', () => {
  it('renders in several keys and both languages', () => {
    const html = smokeRender(RepElise);
    expect(html.every((h) => h.length > 200)).toBe(true);
    expect(html.some((h) => /\{[A-G][#b]?\}/.test(h))).toBe(false);
  });
});
