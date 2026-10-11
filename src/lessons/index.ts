import type { ComponentType } from 'react';
import type { LessonMeta, LessonText } from '../i18n/lessonText';
import { Compose } from './Compose';
import { Field } from './Field';
import { Func } from './Func';
import { Glossary } from './Glossary';
import { Hinge } from './Hinge';
import { Intervals } from './Intervals';
import { Jump } from './Jump';
import { Names } from './Names';
import { Origin } from './Origin';
import { Progressions } from './Progressions';
import { Scale } from './Scale';
import { Tetra } from './Tetra';
import { Tritone } from './Tritone';
import { Window } from './Window';
import { EXTRA } from './extra';

export type TrackId = 'circle' | 'physics' | 'scales' | 'chords' | 'motion' | 'melody' | 'piano' | 'rhythm' | 'ref';
export const TRACKS: TrackId[] = ['circle', 'physics', 'scales', 'chords', 'motion', 'melody', 'piano', 'rhythm', 'ref'];

export interface LessonDef {
  id: string;
  Comp: ComponentType;
  icon: string;
  tone: string;
  track: TrackId;
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
  { id: 'int', Comp: Intervals, icon: '↔', tone: 'accent', track: 'circle' },
  { id: 'hinge', Comp: Hinge, icon: '↕', tone: 'change', track: 'circle' },
  { id: 'tri', Comp: Tritone, icon: '◐', tone: 'change', track: 'circle' },
  { id: 'origin', Comp: Origin, icon: '◎', tone: 'accent', track: 'circle' },
  { id: 'win', Comp: Window, icon: '▭', tone: 'dom', track: 'circle' },
  { id: 'field', Comp: Field, icon: '△', tone: 'accent', track: 'circle' },
  { id: 'prog', Comp: Progressions, icon: '→', tone: 'dom', track: 'circle' },
  { id: 'comp', Comp: Compose, icon: '♪', tone: 'flat', track: 'circle' },
];

const GLOSS: LessonDef = { id: 'gloss', Comp: Glossary, icon: 'Aa', tone: 'neutral', track: 'ref' };

/** Every lesson in study order: the prototype's chain first, then the new tracks (docs/ROADMAP.md, Phase 3). */
export const LESSONS: LessonDef[] = [...CIRCLE, ...EXTRA, GLOSS];

