import { describe, expect, it } from 'vitest';
import { Intervals } from './Intervals';
import { smokeRender } from './smoke';

describe('Intervals', () => {
  it('renders in every key and language', () => {
    const html = smokeRender(Intervals);
    expect(html.every((h) => h.length > 1000)).toBe(true);
    expect(html[0]).toContain('Sol');
  });
});
