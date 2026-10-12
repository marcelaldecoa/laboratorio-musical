import type { LessonDef } from './index';
import { Rhythm } from './Rhythm';
import { text as rhythm } from '../i18n/lessons/rhythm';
import { Rhythm2 } from './Rhythm2';
import { text as rhythm2 } from '../i18n/lessons/rhythm2';

/** Lessons of the "rhythm" track, in study order (docs/ROADMAP.md, Phase 3). */
export const TRACK_RHYTHM: LessonDef[] = [
  { id: 'rhythm', Comp: Rhythm, icon: '♩', tone: 'dom', track: 'rhythm', text: rhythm },
  { id: 'rhythm2', Comp: Rhythm2, icon: '♫', tone: 'change', track: 'rhythm', text: rhythm2, keyFree: true },
];
