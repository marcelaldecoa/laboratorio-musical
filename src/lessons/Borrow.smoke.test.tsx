import { describe, expect, it } from 'vitest';
import { Borrow } from './Borrow';
import { smokeRender } from './smoke';

describe('Borrow renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
  it('renders', () => {
    const html = smokeRender(Borrow);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
