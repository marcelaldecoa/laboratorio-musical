import { describe, expect, it } from 'vitest';
import { Inversions } from './Inversions';
import { smokeRender } from './smoke';

describe('Inversions renders in several keys and both languages', () => {
  it('renders', () => {
    const html = smokeRender(Inversions);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
