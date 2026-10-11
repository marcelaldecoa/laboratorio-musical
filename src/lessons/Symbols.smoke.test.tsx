import { describe, expect, it } from 'vitest';
import { Symbols } from './Symbols';
import { smokeRender } from './smoke';

describe('Symbols renders in several keys and both languages', () => {
  it('renders', () => {
    const html = smokeRender(Symbols);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
