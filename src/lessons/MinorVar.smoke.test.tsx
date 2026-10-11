import { describe, expect, it } from 'vitest';
import { MinorVar } from './MinorVar';
import { smokeRender } from './smoke';

describe('MinorVar', () => {
  it('renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
    const html = smokeRender(MinorVar);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
