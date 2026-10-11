import { describe, expect, it } from 'vitest';
import { TritSub } from './TritSub';
import { smokeRender } from './smoke';

describe('TritSub renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
  it('renders', () => {
    const html = smokeRender(TritSub);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
