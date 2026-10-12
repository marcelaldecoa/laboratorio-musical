import { describe, expect, it } from 'vitest';
import { RepBach } from './RepBach';
import { smokeRender } from './smoke';

describe('RepBach', () => {
  it('renders in several keys and both languages', () => {
    const html = smokeRender(RepBach);
    expect(html.every((h) => h.length > 200)).toBe(true);
    expect(html.some((h) => /\{[A-G][#b]?\}/.test(h))).toBe(false);
  });
});
