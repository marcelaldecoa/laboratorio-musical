import type { LessonDef } from './index';
import { Fingering } from './Fingering';
import { LeftHand } from './LeftHand';
import { Reading } from './Reading';
import { text as fingering } from '../i18n/lessons/fingering';
import { text as lefthand } from '../i18n/lessons/lefthand';
import { text as reading } from '../i18n/lessons/reading';

/** Lessons of the "piano" track, in study order (docs/ROADMAP.md, Phase 3). */
export const TRACK_PIANO: LessonDef[] = [
  { id: 'fingering', Comp: Fingering, icon: '↷', tone: 'change', track: 'piano', text: fingering },
  { id: 'lefthand', Comp: LeftHand, icon: '∿', tone: 'dom', track: 'piano', text: lefthand },
  { id: 'reading', Comp: Reading, icon: '𝄢', tone: 'accent', track: 'piano', text: reading },
];
