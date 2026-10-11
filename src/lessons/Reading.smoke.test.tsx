import { describe, expect, it } from 'vitest';
import { Reading } from './Reading';
import { smokeRender } from './smoke';

describe('Reading', () => {
  it('renders in several keys and both languages', () => {
    const html = smokeRender(Reading);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
