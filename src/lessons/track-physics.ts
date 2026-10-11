import type { LessonDef } from './index';
import { Harmonics } from './Harmonics';
import { text as harmonics } from '../i18n/lessons/harmonics';

/** Lessons of the "physics" track, in study order (docs/ROADMAP.md, Phase 3). */
export const TRACK_PHYSICS: LessonDef[] = [
  { id: 'harmonics', Comp: Harmonics, icon: '∿', tone: 'accent', track: 'physics', text: harmonics },
];
