import { describe, expect, it } from 'vitest';
import { Consonance } from './Consonance';
import { smokeRender } from './smoke';

describe('Consonance', () => {
  it('renders in every key and language', () => {
    const html = smokeRender(Consonance);
    expect(html.every((h) => h.length > 1000)).toBe(true);
    expect(html[0]).toContain('Fá');
  });
});
