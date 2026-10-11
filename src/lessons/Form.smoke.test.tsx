import { describe, expect, it } from 'vitest';
import { Form } from './Form';
import { smokeRender } from './smoke';

describe('Form renders in C, F♯, G♭, B♭, A, E♭ (pt and en)', () => {
  it('renders', () => {
    const html = smokeRender(Form);
    expect(html.every((h) => h.length > 200)).toBe(true);
  });
});
