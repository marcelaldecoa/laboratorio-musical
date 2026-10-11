import { describe, expect, it } from 'vitest';
import { Seventh } from './Seventh';
import { smokeRender } from './smoke';

describe('Seventh renders in several keys and both languages', () => {
  it('renders', () => {
    const html = smokeRender(Seventh);
    expect(html.every((h) => h.length > 200)).toBe(true);
    expect(html[0]).toContain('C7M');
    expect(html[6]).toContain('Cmaj7');
  });
});
