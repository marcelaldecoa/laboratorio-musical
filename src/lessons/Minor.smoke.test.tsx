import { describe, expect, it } from 'vitest';
import { Minor } from './Minor';
import { smokeRender } from './smoke';

describe('Minor', () => {
  it('renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
    const html = smokeRender(Minor);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
