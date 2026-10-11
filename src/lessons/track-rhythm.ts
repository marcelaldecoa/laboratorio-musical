import type { LessonDef } from './index';
import { Rhythm } from './Rhythm';
import { text as rhythm } from '../i18n/lessons/rhythm';

/** Lessons of the "rhythm" track, in study order (docs/ROADMAP.md, Phase 3). */
export const TRACK_RHYTHM: LessonDef[] = [
  { id: 'rhythm', Comp: Rhythm, icon: '♩', tone: 'dom', track: 'rhythm', text: rhythm },
];
