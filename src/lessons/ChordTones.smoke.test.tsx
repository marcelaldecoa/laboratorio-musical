import { describe, expect, it } from 'vitest';
import { ChordTones } from './ChordTones';
import { smokeRender } from './smoke';

describe('ChordTones renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
  it('renders', () => {
    const html = smokeRender(ChordTones);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
