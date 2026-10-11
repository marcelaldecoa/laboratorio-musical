import { describe, expect, it } from 'vitest';
import { Extensions } from './Extensions';
import { smokeRender } from './smoke';

describe('Extensions renders in several keys and both languages', () => {
  it('renders', () => {
    const html = smokeRender(Extensions);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
