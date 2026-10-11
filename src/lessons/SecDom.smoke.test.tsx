import { describe, expect, it } from 'vitest';
import { SecDom } from './SecDom';
import { smokeRender } from './smoke';

describe('SecDom renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
  it('renders', () => {
    const html = smokeRender(SecDom);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
