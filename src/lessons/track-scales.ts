import type { LessonDef } from './index';
import { text as minorText } from '../i18n/lessons/minor';
import { text as minorvarText } from '../i18n/lessons/minorvar';
import { text as modesText } from '../i18n/lessons/modes';
import { text as pentaText } from '../i18n/lessons/penta';
import { text as symText } from '../i18n/lessons/sym';
import { Minor } from './Minor';
import { MinorVar } from './MinorVar';
import { Modes } from './Modes';
import { Penta } from './Penta';
import { Symmetric } from './Symmetric';

/** Lessons of the "scales" track, in study order (docs/ROADMAP.md, Phase 3). */
export const TRACK_SCALES: LessonDef[] = [
  { id: 'minor', Comp: Minor, icon: '♭', tone: 'flat', track: 'scales', text: minorText },
  { id: 'minorvar', Comp: MinorVar, icon: '♯', tone: 'change', track: 'scales', text: minorvarText },
  { id: 'modes', Comp: Modes, icon: '○', tone: 'accent', track: 'scales', text: modesText },
  { id: 'penta', Comp: Penta, icon: '♫', tone: 'dom', track: 'scales', text: pentaText },
  { id: 'sym', Comp: Symmetric, icon: '⇄', tone: 'neutral', track: 'scales', text: symText },
];
