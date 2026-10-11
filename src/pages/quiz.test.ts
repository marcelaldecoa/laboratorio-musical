import { describe, expect, it } from 'vitest';
import { getState } from '../state/store';
import { makeLab } from '../state/useLab';
import { MODES, fromId, newId } from './quiz';

describe('practice questions', () => {
  for (const lang of ['pt', 'en'] as const)
    for (const mode of MODES)
      it(`${mode} (${lang}) always offers the right answer once`, () => {
        for (let k = 0; k < 12; k++)
          for (let n = 0; n < 15; n++) {
            const lab = makeLab({ ...getState(), k, enh: k % 2 ? 'Gb' : 'Fs', lang, nt: lang === 'pt' ? 'pt' : 'en' });
            const id = newId(mode, lab);
            const q = fromId(id, lab);
            expect(q.options.filter((o) => o === q.answer)).toHaveLength(1);
            expect(new Set(q.options).size).toBe(q.options.length);
            expect(q.options.length).toBeGreaterThanOrEqual(3);
            expect(q.why.length).toBeGreaterThan(5);
            expect(fromId(id, lab).answer).toBe(q.answer);
          }
      });
});
