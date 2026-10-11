import type { LessonDef } from './index';
import { ChordTones } from './ChordTones';
import { Form } from './Form';
import { Harmonize } from './Harmonize';
import { text as chordtones } from '../i18n/lessons/chordtones';
import { text as form } from '../i18n/lessons/form';
import { text as harmonize } from '../i18n/lessons/harmonize';

/** Lessons of the "melody" track, in study order (docs/ROADMAP.md, Phase 3). */
export const TRACK_MELODY: LessonDef[] = [
  { id: 'chordtones', Comp: ChordTones, icon: '♪', tone: 'accent', track: 'melody', text: chordtones },
  { id: 'form', Comp: Form, icon: '▭', tone: 'flat', track: 'melody', text: form },
  { id: 'harmonize', Comp: Harmonize, icon: '△', tone: 'dom', track: 'melody', text: harmonize },
];
