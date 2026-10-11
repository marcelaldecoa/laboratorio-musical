import type { ComponentType } from 'react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { setState } from '../state/store';
import type { Direction, Enharmonic } from '../theory';

/**
 * Renders a lesson to HTML in several keys, both languages and both directions.
 * Throws if any render fails. Use it in `*.smoke.test.tsx` files.
 * Keys checked: C (slot 0), F♯ and G♭ (slot 6), B♭ (slot 10), plus A and E♭.
 */
export function smokeRender(Comp: ComponentType): string[] {
  const out: string[] = [];
  const cases: [number, Direction, Enharmonic][] = [[0, 'cw', 'Fs'], [6, 'cw', 'Fs'], [6, 'ccw', 'Gb'], [10, 'ccw', 'Fs'], [3, 'cw', 'Fs'], [9, 'ccw', 'Gb']];
  for (const lang of ['pt', 'en'] as const)
    for (const [k, dir, enh] of cases) {
      setState({ k, dir, enh, lang, nt: lang === 'pt' ? 'pt' : 'en' });
      out.push(renderToString(createElement(Comp)));
    }
  return out;
}
