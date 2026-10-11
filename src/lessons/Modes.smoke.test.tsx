import { describe, expect, it } from 'vitest';
import { Modes } from './Modes';
import { smokeRender } from './smoke';

describe('Modes', () => {
  it('renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
    const html = smokeRender(Modes);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
