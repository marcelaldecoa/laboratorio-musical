import { describe, expect, it } from 'vitest';
import { MinorCad } from './MinorCad';
import { smokeRender } from './smoke';

describe('MinorCad', () => {
  it('renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
    const html = smokeRender(MinorCad);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
