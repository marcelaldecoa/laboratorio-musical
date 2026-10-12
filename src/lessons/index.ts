import type { ComponentType } from 'react';
import type { LessonMeta, LessonText } from '../i18n/lessonText';
import { Compose } from './Compose';
import { Field } from './Field';
import { Func } from './Func';
import { Glossary } from './Glossary';
import { Hinge } from './Hinge';
import { Intervals } from './Intervals';
import { text as intText } from '../i18n/lessons/int';
import { Jump } from './Jump';
import { Names } from './Names';
import { Origin } from './Origin';
import { Progressions } from './Progressions';
import { Scale } from './Scale';
import { Tetra } from './Tetra';
import { Tritone } from './Tritone';
import { Window } from './Window';
import { CURRICULUM } from './curriculum';
import { EXTRA } from './extra';
import { BASICS } from './track-basics';

export type TrackId = 'basics' | 'physics' | 'circle' | 'harmony' | 'rhythm' | 'melody' | 'scales' | 'minorharm' | 'chords' | 'motion' | 'piano' | 'repertoire' | 'ref';
/** Track order follows the syllabus in curriculum.ts */
export const TRACKS: TrackId[] = ['basics', 'physics', 'circle', 'harmony', 'rhythm', 'melody', 'scales', 'minorharm', 'chords', 'motion', 'piano', 'repertoire', 'ref'];

export interface LessonDef {
  id: string;
  Comp: ComponentType;
  icon: string;
  tone: string;
  track: TrackId;
  /** the lesson does not depend on the key (no "start in C" hint) */
  keyFree?: boolean;
  /** lessons this one builds on (from curriculum.ts) */
  needs?: string[];
  /** glossary terms (English key) this lesson introduces (from curriculum.ts) */
  terms?: string[];
  /** texts for lessons added after the prototype (the prototype's lessons use Dict.lessons) */
  text?: LessonText<{ meta: LessonMeta }>;
}

/** Lessons in the order of the prototype page (docs/ROADMAP.md, Phase 2). */
const CIRCLE: LessonDef[] = [
  { id: 'jump', Comp: Jump, icon: '↻', tone: 'accent', track: 'circle' },
  { id: 'scale', Comp: Scale, icon: '𝄞', tone: 'accent', track: 'circle' },
  { id: 'tetra', Comp: Tetra, icon: '⊞', tone: 'dom', track: 'circle' },
  { id: 'func', Comp: Func, icon: '⌂', tone: 'flat', track: 'circle' },
  { id: 'names', Comp: Names, icon: '⇋', tone: 'flat', track: 'circle' },
  { id: 'int', Comp: Intervals, icon: '↔', tone: 'accent', track: 'circle', text: intText },
  { id: 'hinge', Comp: Hinge, icon: '↕', tone: 'change', track: 'circle' },
  { id: 'tri', Comp: Tritone, icon: '◐', tone: 'change', track: 'circle' },
  { id: 'origin', Comp: Origin, icon: '◎', tone: 'accent', track: 'circle' },
  { id: 'win', Comp: Window, icon: '▭', tone: 'dom', track: 'circle' },
  { id: 'field', Comp: Field, icon: '△', tone: 'accent', track: 'circle' },
  { id: 'prog', Comp: Progressions, icon: '→', tone: 'dom', track: 'circle' },
  { id: 'comp', Comp: Compose, icon: '♪', tone: 'flat', track: 'melody' },
];

const GLOSS: LessonDef = { id: 'gloss', Comp: Glossary, icon: 'Aa', tone: 'neutral', track: 'ref' };

const REGISTRY = new Map([...BASICS, ...CIRCLE, ...EXTRA, GLOSS].map((L) => [L.id, L]));

/** Every lesson in study order, as set by the syllabus (curriculum.ts). */
export const LESSONS: LessonDef[] = CURRICULUM.map((c) => {
  const L = REGISTRY.get(c.id);
  if (!L) throw new Error(`curriculum lists unknown lesson "${c.id}"`);
  return { ...L, track: c.track, needs: c.needs, terms: c.terms };
});

/** Lessons registered but missing from the syllabus (should be empty; checked by tests). */
export const UNLISTED = [...REGISTRY.keys()].filter((id) => !CURRICULUM.some((c) => c.id === id));
// while a lesson is being written it can be registered before it enters the syllabus: show it at the end
LESSONS.push(...UNLISTED.map((id) => REGISTRY.get(id)!).filter((L) => L.id !== 'gloss'));

