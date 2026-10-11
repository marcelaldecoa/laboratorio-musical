import { describe, expect, it } from 'vitest';
import { LESSONS } from './index';
import { smokeRender } from './smoke';

describe('every lesson renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
  for (const L of LESSONS)
    it(L.id, () => {
      const html = smokeRender(L.Comp);
      expect(html.every((h) => h.length > 200)).toBe(true);
    });
});
