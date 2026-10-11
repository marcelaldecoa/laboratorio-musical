import { describe, expect, it } from 'vitest';
import { Penta } from './Penta';
import { smokeRender } from './smoke';

describe('Penta', () => {
  it('renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
    const html = smokeRender(Penta);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
