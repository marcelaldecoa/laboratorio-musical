import type { LessonDef } from './index';
import { Transpose } from './Transpose';
import { text as transpose } from '../i18n/lessons/transpose';

/** Lessons of the "harmony" track, in study order (see curriculum.ts). Field and Progressions live in index.ts (prototype). */
export const TRACK_HARMONY: LessonDef[] = [
  { id: 'transpose', Comp: Transpose, icon: '⇄', tone: 'accent', track: 'harmony', text: transpose },
];
