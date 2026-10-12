import { text as formulaText } from '../i18n/lessons/formula';
import { text as keysText } from '../i18n/lessons/keys';
import { Formula } from './Formula';
import type { LessonDef } from './index';
import { Keys } from './Keys';

/** Fundamentals: the keyboard and the major scale formula, before anything else. */
export const BASICS: LessonDef[] = [
  { id: 'keys', Comp: Keys, icon: '♮', tone: 'accent', track: 'basics', text: keysText },
  { id: 'formula', Comp: Formula, icon: '𝄞', tone: 'accent', track: 'basics', text: formulaText },
];
