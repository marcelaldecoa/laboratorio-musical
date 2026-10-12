import type { LessonDef } from './index';
import { RepBach } from './RepBach';
import { RepElise } from './RepElise';
import { RepMinuet } from './RepMinuet';
import { RepOde } from './RepOde';
import { text as repbach } from '../i18n/lessons/repbach';
import { text as repelise } from '../i18n/lessons/repelise';
import { text as repminuet } from '../i18n/lessons/repminuet';
import { text as repode } from '../i18n/lessons/repode';

/** Lessons of the "repertoire" track, in study order (see curriculum.ts). The pieces stay in their original keys. */
export const TRACK_REPERTOIRE: LessonDef[] = [
  { id: 'repminuet', Comp: RepMinuet, icon: '♪', tone: 'accent', track: 'repertoire', keyFree: true, text: repminuet },
  { id: 'repode', Comp: RepOde, icon: '♫', tone: 'dom', track: 'repertoire', keyFree: true, text: repode },
  { id: 'repelise', Comp: RepElise, icon: '♯', tone: 'change', track: 'repertoire', keyFree: true, text: repelise },
  { id: 'repbach', Comp: RepBach, icon: '𝄞', tone: 'flat', track: 'repertoire', keyFree: true, text: repbach },
];
