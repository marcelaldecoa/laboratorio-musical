import { describe, expect, it } from 'vitest';
import { Rhythm2 } from './Rhythm2';
import { smokeRender } from './smoke';

describe('Rhythm2', () => {
  it('renders in every key and language', () => {
    const html = smokeRender(Rhythm2);
    expect(html.every((h) => h.length > 1000)).toBe(true);
    expect(html[0]).toContain('pontuada');
  });
});
