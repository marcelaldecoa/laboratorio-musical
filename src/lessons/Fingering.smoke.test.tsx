import { describe, expect, it } from 'vitest';
import { Fingering } from './Fingering';
import { smokeRender } from './smoke';

describe('Fingering', () => {
  it('renders in several keys and both languages', () => {
    const html = smokeRender(Fingering);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
