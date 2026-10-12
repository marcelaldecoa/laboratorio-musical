import { describe, expect, it } from 'vitest';
import { IntervalQuality } from './IntervalQuality';
import { smokeRender } from './smoke';

describe('IntervalQuality', () => {
  it('renders in every key and language', () => {
    const html = smokeRender(IntervalQuality);
    expect(html.every((h) => h.length > 1000)).toBe(true);
    expect(html[0]).toContain('diminuta');
  });
});
