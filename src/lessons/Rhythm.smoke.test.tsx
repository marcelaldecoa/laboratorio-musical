import { describe, expect, it } from 'vitest';
import { Rhythm } from './Rhythm';
import { smokeRender } from './smoke';

describe('Rhythm', () => {
  it('renders in every key and language', () => {
    const html = smokeRender(Rhythm);
    expect(html.every((h) => h.length > 1000)).toBe(true);
    expect(html[0]).toContain('semínima');
  });
});
