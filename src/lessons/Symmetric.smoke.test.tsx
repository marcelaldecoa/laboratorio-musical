import { describe, expect, it } from 'vitest';
import { Symmetric } from './Symmetric';
import { smokeRender } from './smoke';

describe('Symmetric', () => {
  it('renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
    const html = smokeRender(Symmetric);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
