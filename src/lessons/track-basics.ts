import { text as formulaText } from '../i18n/lessons/formula';
import { text as intqText } from '../i18n/lessons/intq';
import { text as keysText } from '../i18n/lessons/keys';
import { Formula } from './Formula';
import type { LessonDef } from './index';
import { IntervalQuality } from './IntervalQuality';
import { Keys } from './Keys';

/** Fundamentals: the keyboard and the major scale formula, before anything else. */
export const BASICS: LessonDef[] = [
  { id: 'keys', Comp: Keys, icon: '♮', tone: 'accent', track: 'basics', text: keysText, keyFree: true },
  { id: 'formula', Comp: Formula, icon: '𝄞', tone: 'accent', track: 'basics', text: formulaText },
  { id: 'intq', Comp: IntervalQuality, icon: '⇔', tone: 'flat', track: 'basics', text: intqText },
];
