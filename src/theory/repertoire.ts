/**
 * Score excerpts of public-domain pieces, as data, plus pure helpers to read them:
 * chord tones of the stated harmony, a playable timeline (ties merged) and a classification
 * of each note (chord tone, passing tone, neighbor tone…). Spelling is always letter + accidental.
 */
import { noteAt } from './chords7';
import { NAT, type Note } from './note';

/** A spelled note with its octave (C4 = middle C). */
export interface PNote extends Note {
  oct: number;
}

export type Hand = 'R' | 'L';

/** One event of a bar: a note or a rest (p = null). Positions and lengths in quarter notes. */
export interface Ev {
  p: PNote | null;
  at: number;
  d: number;
  h: Hand;
  /** tied into the same pitch at the start of the next bar (no new attack there) */
  tie?: boolean;
}

export type ChordQ = 'maj' | 'min' | 'dom7' | 'min7' | 'maj7';
/** T, SD, D, or a secondary dominant (V of another degree). */
export type RepFunc = 'T' | 'SD' | 'D' | 'secD';

export interface Harm {
  at: number;
  d: number;
  root: Note;
  q: ChordQ;
  /** bass note when the chord is inverted (cifra com barra) */
  bass?: Note;
  /** roman numeral with figures, e.g. "V⁶₅", "V⁷/V" */
  roman: string;
  fn: RepFunc;
}

export interface RepBar {
  /** length in quarter notes (a pickup bar is shorter) */
  beats: number;
  ev: Ev[];
  harm: Harm[];
  pickup?: boolean;
}

export interface Piece {
  id: string;
  /** time signature as written */
  meter: string;
  /** strong-beat positions inside a full bar (quarters) */
  strong: number[];
  /** quarter notes per minute at "normal" speed */
  bpm: number;
  tonic: Note;
  minor: boolean;
  bars: RepBar[];
}

/* ---------- parsing a compact notation ---------- */

const ACC: Record<string, number> = { '': 0, '#': 1, '##': 2, x: 2, b: -1, bb: -2 };
/** "F#4" → { letter: 3, acc: 1, oct: 4 } */
export function pn(s: string): PNote {
  const m = /^([A-G])(##|#|x|bb|b)?(-?\d)$/.exec(s);
  if (!m) throw new Error(`bad note "${s}"`);
  return { letter: 'CDEFGAB'.indexOf(m[1]), acc: ACC[m[2] ?? ''], oct: Number(m[3]) };
}
/** "F#" → Note (no octave) */
export const nt = (s: string): Note => {
  const p = pn(s + '4');
  return { letter: p.letter, acc: p.acc };
};

const DUR: Record<string, number> = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25 };

/**
 * A single voice, as space-separated tokens: pitch (or r for a rest) + length letter
 * (w h q e s) + optional "." or ".." (dotted, double-dotted) + optional "~" (tied into the next bar).
 * "D5q G4e A4e" → three events in a row.
 */
export function voice(src: string, h: Hand, start = 0): Ev[] {
  let at = start;
  return src.trim().split(/\s+/).map((tok) => {
    const m = /^(r|[A-G](?:##|#|x|bb|b)?-?\d)([whqes])(\.{0,2})(~?)$/.exec(tok);
    if (!m) throw new Error(`bad token "${tok}"`);
    const d = DUR[m[2]] * (m[3] === '..' ? 1.75 : m[3] ? 1.5 : 1);
    const ev: Ev = { p: m[1] === 'r' ? null : pn(m[1]), at, d, h };
    if (m[4]) ev.tie = true;
    at += d;
    return ev;
  });
}

/** Harmony span helper: H(0, 4, 'D', 'dom7', 'V⁴₂/V', 'secD', 'C'). */
export const H = (at: number, d: number, root: string, q: ChordQ, roman: string, fn: RepFunc, bass?: string): Harm => ({
  at, d, root: nt(root), q, roman, fn, ...(bass ? { bass: nt(bass) } : {}),
});

/** A bar from voice strings (each string is one voice). */
export function bar(beats: number, rh: string | string[], lh: string | string[], harm: Harm[], pickup = false): RepBar {
  const ev = [
    ...(Array.isArray(rh) ? rh : [rh]).flatMap((v) => voice(v, 'R')),
    ...(Array.isArray(lh) ? lh : [lh]).flatMap((v) => voice(v, 'L')),
  ];
  return { beats, ev, harm, ...(pickup ? { pickup } : {}) };
}

/* ---------- reading the data ---------- */

/** Semitone from middle C (C4 = 0). Uses the written octave of the letter (B♯3 = C4). */
export const semi = (p: PNote) => NAT[p.letter] + p.acc + (p.oct - 4) * 12;
/** Diatonic position (letters counted across octaves): one step = 1. */
export const dia = (p: PNote) => p.letter + 7 * p.oct;
const same = (a: Note, b: Note) => a.letter === b.letter && a.acc === b.acc;

const SHAPE: Record<ChordQ, [number, number][]> = {
  maj: [[1, 0], [3, 4], [5, 7]],
  min: [[1, 0], [3, 3], [5, 7]],
  dom7: [[1, 0], [3, 4], [5, 7], [7, 10]],
  min7: [[1, 0], [3, 3], [5, 7], [7, 10]],
  maj7: [[1, 0], [3, 4], [5, 7], [7, 11]],
};
/** The chord's notes, spelled by letter (D7 → D F♯ A C). */
export const chordNotes = (h: Pick<Harm, 'root' | 'q'>): Note[] => SHAPE[h.q].map(([n, s]) => noteAt(h.root, n, s));
/** Which chord tone (1, 3, 5, 7) a note is, or null. */
export function toneNumber(h: Pick<Harm, 'root' | 'q'>, n: Note): number | null {
  const i = chordNotes(h).findIndex((c) => same(c, n));
  return i < 0 ? null : SHAPE[h.q][i][0];
}

const SUFFIX: Record<ChordQ, [string, string]> = { maj: ['', ''], min: ['m', 'm'], dom7: ['7', '7'], min7: ['m7', 'm7'], maj7: ['7M', 'maj7'] };
const L = (n: Note) => 'CDEFGAB'[n.letter] + (n.acc > 0 ? '♯'.repeat(n.acc) : '♭'.repeat(-n.acc));
/** Chord symbol (cifra): letters always, Brazilian 7M or English maj7, slash for the bass. */
export const chordSymbol = (h: Harm, style: 'pt' | 'en') =>
  L(h.root) + SUFFIX[h.q][style === 'pt' ? 0 : 1] + (h.bass ? '/' + L(h.bass) : '');

/** Harmony sounding at a position of a bar. */
export const harmAt = (b: RepBar, at: number) => b.harm.find((h) => at >= h.at - 1e-9 && at < h.at + h.d - 1e-9) ?? null;

/** Absolute start (quarters) of every bar. */
export function barStarts(p: Piece): number[] {
  const out: number[] = [];
  let t = 0;
  for (const b of p.bars) {
    out.push(t);
    t += b.beats;
  }
  return out;
}

export interface TNote {
  s: number;
  p: PNote;
  /** absolute start and length in quarters (ties merged) */
  at: number;
  d: number;
  h: Hand;
  bar: number;
  /** index of the event in its bar */
  i: number;
}

/** Every attacked note of the piece in time order; a tie extends the note instead of re-attacking. */
export function timeline(p: Piece): TNote[] {
  const st = barStarts(p);
  const out: TNote[] = [];
  const skip = new Set<string>();
  p.bars.forEach((b, bi) =>
    b.ev.forEach((e, i) => {
      if (!e.p || skip.has(bi + ':' + i)) return;
      const n: TNote = { s: semi(e.p), p: e.p, at: st[bi] + e.at, d: e.d, h: e.h, bar: bi, i };
      // follow ties forward
      let cur = e;
      let cb = bi;
      while (cur.tie && cb + 1 < p.bars.length) {
        const nb = p.bars[cb + 1];
        const j = nb.ev.findIndex((x) => x.h === cur.h && x.at === 0 && x.p && semi(x.p) === n.s);
        if (j < 0) break;
        skip.add(cb + 1 + ':' + j);
        n.d += nb.ev[j].d;
        cur = nb.ev[j];
        cb++;
      }
      out.push(n);
    }),
  );
  return out.sort((a, b) => a.at - b.at || a.s - b.s);
}

export type NoteRole = 'ct' | 'pass' | 'nb' | 'ant' | 'inc' | 'other';

/**
 * Role of every attacked note of one hand against the stated harmony.
 * ct = chord tone; pass = passing tone (step in, step on, same direction); nb = neighbor tone
 * (step away and back); ant = anticipation (the next note is the same pitch and belongs to the next chord);
 * inc = incomplete neighbor (leap in, step out). Notes with no stated harmony are left out.
 */
export function classify(p: Piece, h: Hand = 'R'): Map<string, NoteRole> {
  const line = timeline(p).filter((n) => n.h === h);
  const st = barStarts(p);
  const out = new Map<string, NoteRole>();
  const harmOf = (n: TNote) => harmAt(p.bars[n.bar], n.at - st[n.bar]);
  const isCt = (n: TNote) => {
    const hm = harmOf(n);
    return !!hm && toneNumber(hm, n.p) != null;
  };
  line.forEach((n, k) => {
    const hm = harmOf(n);
    if (!hm) return;
    const key = n.bar + ':' + n.i;
    if (isCt(n)) return void out.set(key, 'ct');
    const a = line[k - 1];
    const b = line[k + 1];
    const din = a ? dia(n.p) - dia(a.p) : 99;
    const dout = b ? dia(b.p) - dia(n.p) : 99;
    let r: NoteRole = 'other';
    if (b && b.s === n.s && isCt(b)) r = 'ant';
    else if (Math.abs(din) === 1 && Math.abs(dout) === 1 && din === dout) r = 'pass';
    else if (Math.abs(din) === 1 && dout === -din) r = 'nb';
    else if (Math.abs(din) >= 2 && din !== 99 && Math.abs(dout) === 1) r = 'inc';
    out.set(key, r);
  });
  return out;
}

/* ---------- the pieces ---------- */

/** One bar of the C-major Prelude: bass, tenor, then three notes repeated, the whole pattern twice. */
function bachBar(n: [string, string, string, string, string], hm: Harm): RepBar {
  const [a, b, c, d, e] = n;
  const half = `re ${c}s ${d}s ${e}s ${c}s ${d}s ${e}s`;
  return bar(4, `${half} ${half}`, [`${a}h ${a}h`, `rs ${b}q.. rs ${b}q..`], [{ ...hm, at: 0, d: 4 }]);
}

/** J. S. Bach, Prelude in C major BWV 846 (Well-Tempered Clavier I), bars 1–11. */
export const BACH: Piece = {
  id: 'bach', meter: '4/4', strong: [0, 2], bpm: 66, tonic: nt('C'), minor: false,
  bars: [
    bachBar(['C4', 'E4', 'G4', 'C5', 'E5'], H(0, 4, 'C', 'maj', 'I', 'T')),
    bachBar(['C4', 'D4', 'A4', 'D5', 'F5'], H(0, 4, 'D', 'min7', 'ii⁴₂', 'SD', 'C')),
    bachBar(['B3', 'D4', 'G4', 'D5', 'F5'], H(0, 4, 'G', 'dom7', 'V⁶₅', 'D', 'B')),
    bachBar(['C4', 'E4', 'G4', 'C5', 'E5'], H(0, 4, 'C', 'maj', 'I', 'T')),
    bachBar(['C4', 'E4', 'A4', 'E5', 'A5'], H(0, 4, 'A', 'min', 'vi⁶', 'T', 'C')),
    bachBar(['C4', 'D4', 'F#4', 'A4', 'D5'], H(0, 4, 'D', 'dom7', 'V⁴₂/V', 'secD', 'C')),
    bachBar(['B3', 'D4', 'G4', 'D5', 'G5'], H(0, 4, 'G', 'maj', 'V⁶', 'D', 'B')),
    bachBar(['B3', 'C4', 'E4', 'G4', 'C5'], H(0, 4, 'C', 'maj7', 'I⁴₂', 'T', 'B')),
    bachBar(['A3', 'C4', 'E4', 'G4', 'C5'], H(0, 4, 'A', 'min7', 'vi⁷', 'T')),
    bachBar(['D3', 'A3', 'D4', 'F#4', 'C5'], H(0, 4, 'D', 'dom7', 'V⁷/V', 'secD')),
    bachBar(['G3', 'B3', 'D4', 'G4', 'B4'], H(0, 4, 'G', 'maj', 'V', 'D')),
  ],
};

/** Minuet in G major, BWV Anh. 114 (Notebook for Anna Magdalena Bach, by Christian Petzold), bars 1–16; left hand simplified. */
const mI = (at = 0, d = 3) => H(at, d, 'G', 'maj', 'I', 'T');
const mI6 = (at = 0, d = 3) => H(at, d, 'G', 'maj', 'I⁶', 'T', 'B');
const mIV = H(0, 3, 'C', 'maj', 'IV', 'SD');
const mii = H(0, 3, 'A', 'min', 'ii', 'SD');
const mV = (at = 0, d = 3) => H(at, d, 'D', 'maj', 'V', 'D');
const MIN_A = [
  bar(3, 'D5q G4e A4e B4e C5e', 'G3h.', [mI()]),
  bar(3, 'D5q G4q G4q', 'B3h.', [mI6()]),
  bar(3, 'E5q C5e D5e E5e F#5e', 'C4h.', [mIV]),
  bar(3, 'G5q G4q G4q', 'B3h.', [mI6()]),
  bar(3, 'C5q D5e C5e B4e A4e', 'A3h.', [mii]),
  bar(3, 'B4q C5e B4e A4e G4e', 'G3h.', [mI()]),
];
export const MINUET: Piece = {
  id: 'minuet', meter: '3/4', strong: [0], bpm: 112, tonic: nt('G'), minor: false,
  bars: [
    ...MIN_A,
    bar(3, 'F#4q G4e A4e B4e G4e', 'D4q B3q G3q', [mV(0, 1), mI6(1, 1), mI(2, 1)]),
    bar(3, 'A4h.', 'D3h.', [mV()]),
    ...MIN_A,
    bar(3, 'A4q B4e A4e G4e F#4e', 'D3h.', [mV()]),
    bar(3, 'G4h.', 'G3h.', [mI()]),
  ],
};

/** "Ode to Joy" theme (Beethoven, Symphony No. 9, finale), in its original key, D major. Simple harmonization (ours). */
const oD = (at = 0, d = 4) => H(at, d, 'D', 'maj', 'I', 'T');
const oA = (at = 0, d = 4) => H(at, d, 'A', 'maj', 'V', 'D');
const oA7 = (at = 0, d = 4) => H(at, d, 'A', 'dom7', 'V⁷', 'D');
const ODE_1 = bar(4, 'F#4q F#4q G4q A4q', 'D3w', [oD()]);
const ODE_2 = bar(4, 'A4q G4q F#4q E4q', 'D3h. A2q', [oD(0, 3), oA(3, 1)]);
const ODE_3 = bar(4, 'D4q D4q E4q F#4q', 'D3w', [oD()]);
const ODE_END = bar(4, 'E4q. D4e D4h', 'A2h D3h', [oA(0, 2), oD(2, 2)]);
/** bar 12 and 13 as Beethoven wrote them: the F♯ arrives a beat early, tied over the bar line */
export const ODE_SYNC = [
  bar(4, 'D4q E4q A3q F#4q~', 'D3q A2h.', [oD(0, 1), oA(1, 3)]),
  bar(4, 'F#4q F#4q G4q A4q', 'D3w', [oD()]),
];
/** the same two bars without the anticipation (how many easy arrangements print them) */
export const ODE_PLAIN = [
  bar(4, 'D4q E4q A3h', 'D3q A2h.', [oD(0, 1), oA(1, 3)]),
  bar(4, 'F#4q F#4q G4q A4q', 'D3w', [oD()]),
];
export function odePiece(sync: boolean): Piece {
  return {
    id: 'ode', meter: '4/4', strong: [0, 2], bpm: 112, tonic: nt('D'), minor: false,
    bars: [
      ODE_1, ODE_2, ODE_3, bar(4, 'F#4q. E4e E4h', 'D3h A2h', [oD(0, 2), oA(2, 2)]),
      ODE_1, ODE_2, ODE_3, ODE_END,
      bar(4, 'E4q E4q F#4q D4q', 'A2h D3h', [oA(0, 2), oD(2, 2)]),
      bar(4, 'E4q F#4e G4e F#4q D4q', 'A2h D3h', [oA7(0, 2), oD(2, 2)]),
      bar(4, 'E4q F#4e G4e F#4q E4q', 'A2h D3h', [oA7(0, 2), oD(2, 2)]),
      ...(sync ? ODE_SYNC : ODE_PLAIN),
      ODE_2, ODE_3, ODE_END,
    ],
  };
}
export const ODE = odePiece(true);

/** Beethoven, "Für Elise" (WoO 59), opening: pickup + bars 1–8 (first ending simplified). */
const eAm = H(0, 1.5, 'A', 'min', 'i', 'T');
const eE = H(0, 1.5, 'E', 'maj', 'V', 'D');
const E_MOTIF = bar(1.5, 'E5s D#5s E5s B4s D5s C5s', 'rq.', []);
const E_AM = bar(1.5, 'A4e rs C4s E4s A4s', 'A2s E3s A3s re.', [eAm]);
export const ELISE: Piece = {
  id: 'elise', meter: '3/8', strong: [0], bpm: 50, tonic: nt('A'), minor: true,
  bars: [
    bar(0.5, 'E5s D#5s', 're', [], true),
    E_MOTIF,
    E_AM,
    bar(1.5, 'B4e rs E4s G#4s B4s', 'E2s E3s G#3s re.', [eE]),
    bar(1.5, 'C5e rs E4s E5s D#5s', 'A2s E3s A3s re.', [eAm]),
    E_MOTIF,
    E_AM,
    bar(1.5, 'B4e rs E4s C5s B4s', 'E2s E3s G#3s re.', [eE]),
    bar(1.5, 'A4e rq', 'A2s E3s A3s re.', [eAm]),
  ],
};
