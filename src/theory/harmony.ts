/**
 * Harmony in motion: secondary dominants, close keys and pivot chords, modal borrowing
 * and tritone substitution. Pure functions; every note is spelled by letter + accidental.
 */
import { NAT, type Note, mod, pcOf, sameNote } from './note';
import { majorScale } from './scale';
import { fifthIndex, fromFifthIndex } from './fifths';

/* ---------- spelling helpers ---------- */

/** The note `steps` letters above `n` that sits `semis` half steps above it. */
export function spellAbove(n: Note, steps: number, semis: number): Note {
  const letter = mod(n.letter + steps, 7);
  let acc = mod(pcOf(n) + semis - NAT[letter], 12);
  if (acc > 6) acc -= 12;
  return { letter, acc };
}

export type ChordQuality = 'maj' | 'min' | 'dim' | 'aug' | 'dom7';

/** A triad stacked in thirds from `root`. */
export function triadOn(root: Note, q: 'maj' | 'min' | 'dim'): Note[] {
  return [root, spellAbove(root, 2, q === 'maj' ? 4 : 3), spellAbove(root, 4, q === 'dim' ? 6 : 7)];
}

/** Dominant seventh chord: major triad + minor seventh (4 + 3 + 3 half steps). */
export function dom7(root: Note): Note[] {
  return [root, spellAbove(root, 2, 4), spellAbove(root, 4, 7), spellAbove(root, 6, 10)];
}

/** Quality of a chord stacked in thirds (root first). */
export function qualityOf(notes: Note[]): ChordQuality {
  const r = pcOf(notes[0]);
  const third = mod(pcOf(notes[1]) - r, 12);
  const fifth = mod(pcOf(notes[2]) - r, 12);
  if (notes.length === 4 && third === 4 && fifth === 7 && mod(pcOf(notes[3]) - r, 12) === 10) return 'dom7';
  if (third === 4) return fifth === 8 ? 'aug' : 'maj';
  return fifth === 6 ? 'dim' : 'min';
}

/** Suffix for the chord symbol. */
export const SUFFIX: Record<ChordQuality, string> = { maj: '', min: 'm', dim: '°', aug: '+', dom7: '7' };

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

/** Roman numeral: upper case for major (and dominant 7th), lower case for minor and diminished. */
export function romanOf(degree: number, q: ChordQuality, prefix = ''): string {
  const r = ROMAN[degree];
  if (q === 'maj' || q === 'aug') return prefix + r + (q === 'aug' ? '+' : '');
  if (q === 'dom7') return prefix + r + '7';
  return prefix + r.toLowerCase() + (q === 'dim' ? '°' : '');
}

export const inScale = (scale: Note[], n: Note) => scale.some((x) => sameNote(x, n));

/** Enharmonic spelling without double accidentals (B𝄫 → A, F𝄪 → G), via the line of fifths (±12). */
export function simpler(n: Note): Note {
  if (n.acc >= 2) return fromFifthIndex(fifthIndex(n) - 12);
  if (n.acc <= -2) return fromFifthIndex(fifthIndex(n) + 12);
  return n;
}

export const hasDouble = (notes: Note[]) => notes.some((n) => Math.abs(n.acc) >= 2);

/* ---------- keys ---------- */

export interface Key {
  tonic: Note;
  minor: boolean;
}

/** Natural minor on `tonic`: the major scale with degrees 3, 6 and 7 lowered (same letters). */
export function naturalMinor(tonic: Note): Note[] {
  return majorScale(tonic).map((n, i) => (i === 2 || i === 5 || i === 6 ? { letter: n.letter, acc: n.acc - 1 } : n));
}

export const keyScale = (k: Key) => (k.minor ? naturalMinor(k.tonic) : majorScale(k.tonic));

/** The major key that shares the key signature (a minor key's relative major). */
export const relativeMajor = (k: Key) => (k.minor ? spellAbove(k.tonic, 2, 3) : k.tonic);

/** Position of the key's window on the line of fifths (fifth index of its relative major's tonic). */
export const windowOf = (k: Key) => fifthIndex(relativeMajor(k));

export const diatonicTriad = (scale: Note[], d: number): Note[] => [scale[d], scale[(d + 2) % 7], scale[(d + 4) % 7]];

/** Degree (0–6) of a root inside a key, or −1. */
export const degreeIn = (scale: Note[], n: Note) => scale.findIndex((x) => sameNote(x, n));

/* ---------- secondary dominants ---------- */

/** Degrees that can be tonicized: ii, iii, IV, V, vi (not I: its V is the plain V; not vii°: a diminished chord is not a key). */
export const SECDOM_TARGETS = [1, 2, 3, 4, 5] as const;

export interface SecondaryDominant {
  /** target degree 0–6 */
  target: number;
  targetChord: Note[];
  targetQuality: ChordQuality;
  /** root of the V7: a fifth above the target */
  root: Note;
  /** root, third (temporary leading tone), fifth, seventh */
  notes: Note[];
  /** which notes fall outside the current key */
  borrowed: boolean[];
}

/** V7 of a diatonic chord: borrowed from the key whose tonic is that chord. */
export function secondaryDominant(tonic: Note, target: number): SecondaryDominant {
  const sc = majorScale(tonic);
  const targetChord = diatonicTriad(sc, target);
  const root = spellAbove(sc[target], 4, 7);
  const notes = dom7(root);
  return {
    target,
    targetChord,
    targetQuality: qualityOf(targetChord),
    root,
    notes,
    borrowed: notes.map((n) => !inScale(sc, n)),
  };
}

/* ---------- close keys and pivot chords ---------- */

export type CloseRel = 'V' | 'IV' | 'vi' | 'ii' | 'iii';
export const CLOSE_RELS: CloseRel[] = ['V', 'IV', 'vi', 'ii', 'iii'];
const REL_DEGREE: Record<CloseRel, number> = { ii: 1, iii: 2, IV: 3, V: 4, vi: 5 };

/** The close key built on a degree of a major key (major for IV and V, minor for ii, iii, vi). */
export function closeKey(tonic: Note, rel: CloseRel): Key {
  const d = REL_DEGREE[rel];
  return { tonic: majorScale(tonic)[d], minor: d === 1 || d === 2 || d === 5 };
}

export const relDegree = (rel: CloseRel) => REL_DEGREE[rel];

export interface Pivot {
  notes: Note[];
  quality: ChordQuality;
  degA: number;
  degB: number;
  romanA: string;
  romanB: string;
}

/** Triads of key `a` whose three notes all belong to key `b`: they make sense in both keys. */
export function pivotChords(a: Key, b: Key): Pivot[] {
  const sa = keyScale(a);
  const sb = keyScale(b);
  const out: Pivot[] = [];
  for (let d = 0; d < 7; d++) {
    const notes = diatonicTriad(sa, d);
    if (!notes.every((n) => inScale(sb, n))) continue;
    const q = qualityOf(notes);
    const degB = degreeIn(sb, notes[0]);
    out.push({ notes, quality: q, degA: d, degB, romanA: romanOf(d, q), romanB: romanOf(degB, q) });
  }
  return out;
}

/**
 * The pivot that best prepares the new key: one that is a pre-dominant there
 * (ii or IV in major, iv, ii° or VI in minor), falling back to any chord that is
 * neither the old tonic nor the new key's tonic or dominant.
 */
export function bestPivot(a: Key, b: Key): Pivot {
  const ps = pivotChords(a, b);
  const pref = b.minor ? [3, 1, 5, 2] : [1, 3, 5, 2];
  for (const d of pref) {
    const p = ps.find((x) => x.degB === d && x.degA !== 0);
    if (p) return p;
  }
  return ps.find((x) => x.degA !== 0 && x.degB !== 0 && x.degB !== 4) ?? ps[0];
}

export interface Modulation {
  from: Key;
  to: Key;
  /** −1, 0 or +1: how far the window slides on the line of fifths */
  shift: number;
  pivots: Pivot[];
  pivot: Pivot;
  /** I (old key) → pivot → V7 (new key, with its leading tone) → I (new key) */
  chords: Note[][];
}

export function modulation(tonic: Note, rel: CloseRel): Modulation {
  const from: Key = { tonic, minor: false };
  const to = closeKey(tonic, rel);
  const pivot = bestPivot(from, to);
  const tonicTo = triadOn(to.tonic, to.minor ? 'min' : 'maj');
  return {
    from,
    to,
    shift: windowOf(to) - windowOf(from),
    pivots: pivotChords(from, to),
    pivot,
    chords: [diatonicTriad(majorScale(tonic), 0), pivot.notes, dom7(spellAbove(to.tonic, 4, 7)), tonicTo],
  };
}

/* ---------- modal borrowing ---------- */

export type BorrowId = 'iv' | 'bVI' | 'bVII' | 'bIII';
export const BORROW_IDS: BorrowId[] = ['iv', 'bVI', 'bVII', 'bIII'];
const BORROW_DEGREE: Record<BorrowId, number> = { bIII: 2, iv: 3, bVI: 5, bVII: 6 };

export interface Borrowed {
  id: BorrowId;
  degree: number;
  roman: string;
  notes: Note[];
  quality: ChordQuality;
  /** notes lowered compared with the major key */
  changed: boolean[];
  /** the major key's chord on the same degree */
  counterpart: Note[];
}

/** A chord from the parallel minor (same tonic, three flats more), used inside the major key. */
export function borrowedChord(tonic: Note, id: BorrowId): Borrowed {
  const d = BORROW_DEGREE[id];
  const minor = naturalMinor(tonic);
  const major = majorScale(tonic);
  const notes = diatonicTriad(minor, d);
  const q = qualityOf(notes);
  return {
    id,
    degree: d,
    roman: romanOf(d, q, minor[d].acc < major[d].acc ? '♭' : ''),
    notes,
    quality: q,
    changed: notes.map((n) => !inScale(major, n)),
    counterpart: diatonicTriad(major, d),
  };
}

/* ---------- tritone substitution ---------- */

export interface TritoneSub {
  /** V7 of the key */
  v: Note[];
  /** ♭II7: a half step above the tonic */
  sub: Note[];
  /** enharmonic root without double flats, when the logical spelling has them */
  practical: Note | null;
}

export function tritoneSub(tonic: Note): TritoneSub {
  const v = dom7(spellAbove(tonic, 4, 7));
  const subRoot = spellAbove(tonic, 1, 1);
  const sub = dom7(subRoot);
  return { v, sub, practical: hasDouble(sub) ? simpler(subRoot) : null };
}

/* ---------- voicing ---------- */

/**
 * Close voicing of any number of pitch classes inside [lo, hi], moving as little as
 * possible from the previous chord (or centred on `center` for the first one).
 */
export function closeVoicing(pcs: number[], prev: number[] | null, lo = 0, hi = 23, center = 8): number[] {
  const cands = pcs.map((p) => {
    const out: number[] = [];
    for (let x = lo + mod(p - lo, 12); x <= hi; x += 12) out.push(x);
    return out;
  });
  let best: number[] = [];
  let bestCost = Infinity;
  const near = (x: number, set: number[]) => Math.min(...set.map((y) => Math.abs(x - y)));
  const walk = (i: number, acc: number[]) => {
    if (i === cands.length) {
      const v = [...acc].sort((a, b) => a - b);
      if (new Set(v).size !== v.length || v[v.length - 1] - v[0] > 12) return;
      const mid = (v[0] + v[v.length - 1]) / 2;
      const cost = prev && prev.length
        ? v.reduce((s, x) => s + near(x, prev), 0) + prev.reduce((s, x) => s + near(x, v), 0) + Math.abs(mid - center) * 0.05
        : Math.abs(mid - center);
      if (cost < bestCost) {
        bestCost = cost;
        best = v;
      }
      return;
    }
    for (const c of cands[i]) walk(i + 1, [...acc, c]);
  };
  walk(0, []);
  return best;
}
