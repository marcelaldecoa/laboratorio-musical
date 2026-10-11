import type { LessonDef } from './index';
import { Borrow } from './Borrow';
import { Modulation } from './Modulation';
import { SecDom } from './SecDom';
import { TritSub } from './TritSub';
import { text as borrow } from '../i18n/lessons/borrow';
import { text as modulation } from '../i18n/lessons/modulation';
import { text as secdom } from '../i18n/lessons/secdom';
import { text as tritsub } from '../i18n/lessons/tritsub';

/** Lessons of the "motion" track, in study order (docs/ROADMAP.md, Phase 3). */
export const TRACK_MOTION: LessonDef[] = [
  { id: 'secdom', Comp: SecDom, icon: '7', tone: 'dom', track: 'motion', text: secdom },
  { id: 'modulation', Comp: Modulation, icon: '⇄', tone: 'accent', track: 'motion', text: modulation },
  { id: 'borrow', Comp: Borrow, icon: '♭', tone: 'flat', track: 'motion', text: borrow },
  { id: 'tritsub', Comp: TritSub, icon: '◐', tone: 'change', track: 'motion', text: tritsub },
];
