import { describe, expect, it } from 'vitest';
import { V7 } from './V7';
import { smokeRender } from './smoke';

describe('V7 renders in several keys and both languages', () => {
  it('renders', () => {
    const html = smokeRender(V7);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
