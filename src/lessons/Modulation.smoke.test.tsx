import { describe, expect, it } from 'vitest';
import { Modulation } from './Modulation';
import { smokeRender } from './smoke';

describe('Modulation renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
  it('renders', () => {
    const html = smokeRender(Modulation);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
