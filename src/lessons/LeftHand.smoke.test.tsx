import { describe, expect, it } from 'vitest';
import { LeftHand } from './LeftHand';
import { smokeRender } from './smoke';

describe('LeftHand', () => {
  it('renders in several keys and both languages', () => {
    const html = smokeRender(LeftHand);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
