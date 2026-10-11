import type { LessonDef } from './index';
import { TRACK_CHORDS } from './track-chords';
import { TRACK_MELODY } from './track-melody';
import { TRACK_MOTION } from './track-motion';
import { TRACK_PHYSICS } from './track-physics';
import { TRACK_PIANO } from './track-piano';
import { TRACK_RHYTHM } from './track-rhythm';
import { TRACK_SCALES } from './track-scales';

/** Phase 3 lessons, in study order. Each track registers its own lessons in track-*.ts. */
export const EXTRA: LessonDef[] = [
  ...TRACK_PHYSICS, ...TRACK_SCALES, ...TRACK_CHORDS, ...TRACK_MOTION, ...TRACK_MELODY, ...TRACK_PIANO, ...TRACK_RHYTHM,
];
