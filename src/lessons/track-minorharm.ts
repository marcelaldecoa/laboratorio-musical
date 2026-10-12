import type { LessonDef } from './index';
import { text as minorcadText } from '../i18n/lessons/minorcad';
import { text as minorfieldText } from '../i18n/lessons/minorfield';
import { MinorCad } from './MinorCad';
import { MinorField } from './MinorField';

/** Lessons of the "minorharm" track, in study order (see curriculum.ts). */
export const TRACK_MINORHARM: LessonDef[] = [
  { id: 'minorfield', Comp: MinorField, icon: '△', tone: 'flat', track: 'minorharm', text: minorfieldText },
  { id: 'minorcad', Comp: MinorCad, icon: '→', tone: 'change', track: 'minorharm', text: minorcadText },
];
