import type { LessonDef } from './index';
import { TRACK_CHORDS } from './track-chords';
import { TRACK_HARMONY } from './track-harmony';
import { TRACK_MELODY } from './track-melody';
import { TRACK_MINORHARM } from './track-minorharm';
import { TRACK_MOTION } from './track-motion';
import { TRACK_PHYSICS } from './track-physics';
import { TRACK_PIANO } from './track-piano';
import { TRACK_REPERTOIRE } from './track-repertoire';
import { TRACK_RHYTHM } from './track-rhythm';
import { TRACK_SCALES } from './track-scales';

/** Lessons written after the prototype. Each track registers its own in track-*.ts; the order comes from curriculum.ts. */
export const EXTRA: LessonDef[] = [
  ...TRACK_PHYSICS, ...TRACK_HARMONY, ...TRACK_RHYTHM, ...TRACK_MELODY, ...TRACK_SCALES, ...TRACK_MINORHARM,
  ...TRACK_CHORDS, ...TRACK_MOTION, ...TRACK_PIANO, ...TRACK_REPERTOIRE,
];
