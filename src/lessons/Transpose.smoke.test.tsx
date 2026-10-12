import { describe, expect, it } from 'vitest';
import { Transpose } from './Transpose';
import { smokeRender } from './smoke';

describe('Transpose', () => {
  it('renders in every key and language', () => {
    const html = smokeRender(Transpose);
    expect(html.every((h) => h.length > 1000)).toBe(true);
    expect(html[0]).toContain('Sol maior'); // in C the lesson falls back to G
  });
});
