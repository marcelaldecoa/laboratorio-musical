import type { LessonDef } from './index';
import { Extensions } from './Extensions';
import { Inversions } from './Inversions';
import { Seventh } from './Seventh';
import { Symbols } from './Symbols';
import { V7 } from './V7';
import { text as extensions } from '../i18n/lessons/extensions';
import { text as inversions } from '../i18n/lessons/inversions';
import { text as seventh } from '../i18n/lessons/seventh';
import { text as symbols } from '../i18n/lessons/symbols';
import { text as v7 } from '../i18n/lessons/v7';

/** Lessons of the "chords" track, in study order (docs/ROADMAP.md, Phase 3). */
export const TRACK_CHORDS: LessonDef[] = [
  { id: 'seventh', Comp: Seventh, icon: '7', tone: 'accent', track: 'chords', text: seventh },
  { id: 'v7', Comp: V7, icon: '◐', tone: 'dom', track: 'chords', text: v7 },
  { id: 'inversions', Comp: Inversions, icon: '↻', tone: 'change', track: 'chords', text: inversions },
  { id: 'extensions', Comp: Extensions, icon: '9', tone: 'flat', track: 'chords', text: extensions },
  { id: 'symbols', Comp: Symbols, icon: '♯', tone: 'neutral', track: 'chords', text: symbols },
];
