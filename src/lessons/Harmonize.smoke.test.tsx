import { describe, expect, it } from 'vitest';
import { Harmonize } from './Harmonize';
import { smokeRender } from './smoke';

describe('Harmonize renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
  it('renders', () => {
    const html = smokeRender(Harmonize);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
