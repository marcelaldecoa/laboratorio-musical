import type { TrackId } from './index';

/**
 * The syllabus: lesson order, the lessons each one builds on, and the glossary terms it introduces.
 * Principle (CLAUDE.md): deduce, don't memorize. Every lesson may only rely on lessons listed before it,
 * and `curriculum.test.ts` enforces that. Terms are glossary keys (the English term).
 */
export interface Step {
  id: string;
  track: TrackId;
  /** lessons whose ideas this one uses directly */
  needs: string[];
  /** glossary terms (English key) first explained in this lesson */
  terms: string[];
}

export const CURRICULUM: Step[] = [
  // 1. Fundamentals: the keyboard, the formula, how to measure distances, the names of the degrees
  { id: 'keys', track: 'basics', needs: [], terms: ['Half step', 'Whole step', 'Accidental', 'Sharp', 'Flat', 'Natural', 'Enharmonic', 'Octave', 'Pitch class'] },
  { id: 'formula', track: 'basics', needs: ['keys'], terms: ['Major scale', 'Scale degree', 'Tonic', 'Key', 'Key signature', 'Diatonic'] },
  { id: 'int', track: 'basics', needs: ['formula'], terms: ['Interval', 'Interval number', 'Compound interval', 'Inversion'] },
  { id: 'intq', track: 'basics', needs: ['int'], terms: ['Interval quality', 'Perfect interval', 'Perfect fifth', 'Perfect fourth', 'Major third', 'Minor third', 'Augmented, diminished'] },
  { id: 'names', track: 'basics', needs: ['int', 'formula'], terms: ['Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading tone'] },
  // 2. Why the fifth: the physics under the circle
  { id: 'harmonics', track: 'physics', needs: ['intq'], terms: ['Harmonic series', 'Harmonic', 'Fundamental', 'Node', 'Timbre', 'Cent'] },
  { id: 'origin', track: 'physics', needs: ['harmonics'], terms: ['Pythagorean comma', 'Equal temperament'] },
  { id: 'consonance', track: 'physics', needs: ['origin', 'names', 'intq'], terms: ['Consonance', 'Dissonance', 'Resolution', 'Imperfect consonance'] },
  // 3. The circle of fifths, deduced from the formula
  { id: 'tetra', track: 'circle', needs: ['formula', 'int'], terms: ['Tetrachord', 'Order of sharps'] },
  { id: 'jump', track: 'circle', needs: ['tetra', 'origin'], terms: ['Circle of fifths', 'Circle of fourths', 'Clockwise'] },
  { id: 'scale', track: 'circle', needs: ['jump'], terms: ['Order of flats'] },
  { id: 'hinge', track: 'circle', needs: ['scale', 'names'], terms: [] },
  { id: 'tri', track: 'circle', needs: ['hinge'], terms: ['Tritone'] },
  { id: 'win', track: 'circle', needs: ['tri'], terms: ['Line of fifths'] },
  { id: 'func', track: 'circle', needs: ['win', 'names'], terms: [] },
  // 4. Chords from the scale, and how they move
  { id: 'field', track: 'harmony', needs: ['win', 'int'], terms: ['Root', 'Triad', 'Major, minor, diminished', 'Diatonic chords', 'Roman numerals'] },
  { id: 'prog', track: 'harmony', needs: ['field', 'func'], terms: ['Harmonic function', 'Progression', 'Cadence', 'Authentic cadence', 'Plagal cadence', 'Half cadence', 'Deceptive cadence', 'Voice leading', 'Common tone'] },
  { id: 'transpose', track: 'harmony', needs: ['prog'], terms: ['Transposition'] },
  // 5. Time
  { id: 'rhythm', track: 'rhythm', needs: ['keys'], terms: ['Beat', 'Time signature', 'Downbeat', 'Note value', 'Compound meter', 'Tempo'] },
  { id: 'rhythm2', track: 'rhythm', needs: ['rhythm'], terms: ['Dotted note', 'Tie', 'Rest', 'Syncopation', 'Anacrusis', 'Triplet'] },
  // 6. Melody over chords, phrases, composing
  { id: 'chordtones', track: 'melody', needs: ['prog', 'rhythm'], terms: ['Step (conjunct motion)', 'Chord tone', 'Passing tone', 'Neighbor tone', 'Appoggiatura'] },
  { id: 'form', track: 'melody', needs: ['chordtones'], terms: ['Phrase', 'Period', 'Form', 'Bridge', 'Chorus'] },
  { id: 'comp', track: 'melody', needs: ['form'], terms: ['Harmonic rhythm'] },
  { id: 'harmonize', track: 'melody', needs: ['comp'], terms: ['Harmonization'] },
  // 7. Other scales from the same window
  { id: 'minor', track: 'scales', needs: ['formula', 'field'], terms: ['Relative minor', 'Natural minor scale', 'Relative major', 'Accidental (in the music)'] },
  { id: 'minorvar', track: 'scales', needs: ['minor', 'tri'], terms: ['Harmonic minor', 'Melodic minor', 'Augmented second', 'Parallel key'] },
  { id: 'modes', track: 'scales', needs: ['minor', 'win'], terms: ['Mode', 'Characteristic note', 'Drone'] },
  { id: 'penta', track: 'scales', needs: ['modes', 'hinge'], terms: ['Pentatonic scale', 'Blues scale', 'Blue note'] },
  { id: 'sym', track: 'scales', needs: ['penta'], terms: ['Chromatic', 'Whole-tone scale', 'Diminished scale', 'Symmetric scale'] },
  // 7b. Harmony in minor
  { id: 'minorfield', track: 'minorharm', needs: ['minorvar', 'prog'], terms: ['Subtonic', 'Augmented triad'] },
  { id: 'minorcad', track: 'minorharm', needs: ['minorfield'], terms: ['Andalusian cadence', 'Picardy third'] },
  // 8. Bigger chords
  { id: 'seventh', track: 'chords', needs: ['field', 'minorfield'], terms: ['Seventh chord', 'Half-diminished chord', 'Diminished seventh chord'] },
  { id: 'v7', track: 'chords', needs: ['seventh', 'tri'], terms: ['Dominant seventh chord'] },
  { id: 'inversions', track: 'chords', needs: ['seventh'], terms: ['Chord inversion', 'Slash chord', 'Figured bass'] },
  { id: 'extensions', track: 'chords', needs: ['inversions'], terms: ['Extension', 'Avoid note', 'Altered tension'] },
  { id: 'symbols', track: 'chords', needs: ['extensions'], terms: ['Chord symbol', 'Suspended chord'] },
  // 9. Leaving the key for a moment, or for good
  { id: 'secdom', track: 'motion', needs: ['v7'], terms: ['Secondary dominant', 'Tonicization'] },
  { id: 'modulation', track: 'motion', needs: ['secdom'], terms: ['Modulation', 'Pivot chord', 'Closely related keys'] },
  { id: 'borrow', track: 'motion', needs: ['modulation', 'minorvar'], terms: ['Parallel minor', 'Modal borrowing'] },
  { id: 'tritsub', track: 'motion', needs: ['borrow', 'v7'], terms: ['Tritone substitution'] },
  // 10. At the piano
  { id: 'reading', track: 'piano', needs: ['formula', 'int'], terms: ['Treble clef', 'Bass clef', 'Grand staff', 'Ledger line', 'Middle C'] },
  { id: 'fingering', track: 'piano', needs: ['formula'], terms: ['Fingering', 'Finger numbers', 'Thumb under', 'Finger crossing', 'Hand position'] },
  { id: 'lefthand', track: 'piano', needs: ['prog', 'reading'], terms: ['Alberti bass', 'Broken chord', 'Oom-pah'] },
  // 11. Real pieces, analyzed with everything above
  { id: 'repminuet', track: 'repertoire', needs: ['form', 'lefthand'], terms: ['Minuet', 'Binary form'] },
  { id: 'repode', track: 'repertoire', needs: ['form', 'rhythm2'], terms: ['Anticipation'] },
  { id: 'repelise', track: 'repertoire', needs: ['minorvar', 'chordtones', 'lefthand'], terms: ['Motif'] },
  { id: 'repbach', track: 'repertoire', needs: ['secdom', 'inversions', 'lefthand'], terms: [] },
  // Reference
  { id: 'gloss', track: 'ref', needs: [], terms: [] },
];
