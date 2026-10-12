import { describe, expect, it } from 'vitest';
import { MinorField } from './MinorField';
import { smokeRender } from './smoke';

describe('MinorField', () => {
  it('renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
    const html = smokeRender(MinorField);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
