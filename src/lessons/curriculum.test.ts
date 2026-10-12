import { describe, expect, it } from 'vitest';
import { CURRICULUM } from './curriculum';
import { GLOSSARY } from './glossaryAll';
import { LESSONS, TRACKS, UNLISTED } from './index';

describe('syllabus: concepts arrive gradually', () => {
  it('lists every lesson exactly once', () => {
    expect(UNLISTED).toEqual([]);
    expect(new Set(CURRICULUM.map((c) => c.id)).size).toBe(CURRICULUM.length);
  });

  it('every lesson only builds on lessons that come before it', () => {
    CURRICULUM.forEach((c, i) => {
      for (const n of c.needs) {
        const j = CURRICULUM.findIndex((x) => x.id === n);
        expect(j, `${c.id} needs unknown "${n}"`).toBeGreaterThanOrEqual(0);
        expect(j, `${c.id} needs "${n}", which comes later`).toBeLessThan(i);
      }
    });
  });

  it('every lesson except the first and the glossary builds on something', () => {
    CURRICULUM.slice(1).filter((c) => c.track !== 'ref').forEach((c) => expect(c.needs.length, c.id).toBeGreaterThan(0));
  });

  it('tracks are contiguous and in menu order', () => {
    const order = LESSONS.map((L) => L.track).filter((t, i, a) => a.indexOf(t) === i);
    expect(order).toEqual(TRACKS.filter((t) => order.includes(t)));
  });

  it('every new term is in the glossary, introduced by one lesson only', () => {
    const all = CURRICULUM.flatMap((c) => c.terms);
    for (const term of all) expect(GLOSSARY.some((g) => g[0] === term), `"${term}" missing from glossary`).toBe(true);
    expect(new Set(all).size).toBe(all.length);
  });

  it('every glossary term is introduced by some lesson', () => {
    const all = new Set(CURRICULUM.flatMap((c) => c.terms));
    const orphans = GLOSSARY.map((g) => g[0]).filter((en) => !all.has(en));
    expect(orphans).toEqual([]);
  });
});

import { HOOKS } from '../i18n/hooks';
describe('every lesson opens with a question', () => {
  it('has a hook in both languages', () => {
    CURRICULUM.filter((c) => c.track !== 'ref').forEach((c) => {
      expect(HOOKS[c.id]?.pt, c.id).toMatch(/\?$/);
      expect(HOOKS[c.id]?.en, c.id).toMatch(/\?$/);
    });
  });
});
