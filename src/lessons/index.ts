import type { ComponentType } from 'react';
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

export type LessonId = 'jump' | 'scale' | 'tetra' | 'func' | 'names' | 'int' | 'hinge' | 'tri' | 'origin' | 'win' | 'field' | 'prog' | 'comp' | 'gloss';

/** Lessons in the order of the prototype page (docs/ROADMAP.md, Phase 2). */
export const LESSONS: { id: LessonId; Comp: ComponentType; icon: string; tone: string }[] = [
  { id: 'jump', Comp: Jump, icon: '↻', tone: 'accent' },
  { id: 'scale', Comp: Scale, icon: '𝄞', tone: 'accent' },
  { id: 'tetra', Comp: Tetra, icon: '⊞', tone: 'dom' },
  { id: 'func', Comp: Func, icon: '⌂', tone: 'flat' },
  { id: 'names', Comp: Names, icon: '⇋', tone: 'flat' },
  { id: 'int', Comp: Intervals, icon: '↔', tone: 'accent' },
  { id: 'hinge', Comp: Hinge, icon: '↕', tone: 'change' },
  { id: 'tri', Comp: Tritone, icon: '◐', tone: 'change' },
  { id: 'origin', Comp: Origin, icon: '◎', tone: 'accent' },
  { id: 'win', Comp: Window, icon: '▭', tone: 'dom' },
  { id: 'field', Comp: Field, icon: '△', tone: 'accent' },
  { id: 'prog', Comp: Progressions, icon: '→', tone: 'dom' },
  { id: 'comp', Comp: Compose, icon: '♪', tone: 'flat' },
  { id: 'gloss', Comp: Glossary, icon: 'Aa', tone: 'neutral' },
];
