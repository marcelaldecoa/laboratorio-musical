import type { Lab } from '../state/useLab';
import {
  FUNCTION_OF, type Enharmonic, type Note, chordInfo, diatonicSize, displayed, keySignature, majorScale, pcOf, quality,
  triad, voice,
} from '../theory';

export type Mode = 'sig' | 'int' | 'fn' | 'ear' | 'sev' | 'mode' | 'dict';
export const MODES: Mode[] = ['sig', 'int', 'ear', 'fn', 'sev', 'mode', 'dict'];

export interface NoteEv { s: number; t: number; d: number; v?: number }

export interface Question {
  id: string;
  mode: Mode;
  prompt: string;
  options: string[];
  answer: string;
  why: string;
  /** what to draw */
  tonic?: Note;
  keys?: number[];
  labels?: (string | number)[];
  /** what to play, and whether to play right away / hide the keys until answered */
  sound?: NoteEv[];
  auto?: boolean;
  hideKeys?: boolean;
}

const rnd = (n: number) => Math.floor(Math.random() * n);
const shuffle = <T,>(a: T[]) => a.map((x) => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
const pick3 = <T,>(pool: T[], not: T) => shuffle(pool.filter((x) => x !== not)).slice(0, 3);

export const SEVENTH: Record<string, number[]> = { maj7: [0, 4, 7, 11], dom7: [0, 4, 7, 10], m7: [0, 3, 7, 10], hd: [0, 3, 6, 10] };
/** quality of the diatonic seventh chord on each degree of a major key */
export const DIATONIC_SEVENTH = ['maj7', 'm7', 'm7', 'maj7', 'dom7', 'm7', 'hd'];
export const MODE_STEPS: Record<string, number[]> = {
  lydian: [0, 2, 4, 6, 7, 9, 11, 12], ionian: [0, 2, 4, 5, 7, 9, 11, 12], mixolydian: [0, 2, 4, 5, 7, 9, 10, 12],
  dorian: [0, 2, 3, 5, 7, 9, 10, 12], aeolian: [0, 2, 3, 5, 7, 8, 10, 12], phrygian: [0, 1, 3, 5, 7, 8, 10, 12],
};
export const DICTATIONS = [[0, 3, 4, 0], [0, 4, 5, 3], [0, 5, 3, 4], [0, 1, 4, 0], [0, 3, 0, 4], [0, 2, 3, 4], [0, 5, 1, 4], [0, 4, 3, 0]];

const sevSuffix = (q: string, lang: string) =>
  ({ maj7: lang === 'pt' ? '7M' : 'maj7', dom7: '7', m7: 'm7', hd: lang === 'pt' ? 'm7(♭5)' : 'm7♭5' })[q] ?? '';

/** Builds a new random question id for a mode, in the current key where the drill uses a key. */
export function newId(mode: Mode, lab: Lab): string {
  const { s } = lab;
  const k = `${s.k}:${s.enh}`;
  switch (mode) {
    case 'sig': return `sig:${rnd(12)}:${Math.random() < 0.5 ? 'Fs' : 'Gb'}`;
    case 'int': case 'ear': return `${mode}:${k}:${2 + rnd(7)}:${rnd(7)}`;
    case 'fn': return `fn:${k}:${rnd(7)}`;
    case 'sev': return `sev:${k}:${rnd(7)}`;
    case 'mode': return `mode:${k}:${Object.keys(MODE_STEPS)[rnd(6)]}`;
    case 'dict': return `dict:${k}:${rnd(DICTATIONS.length)}`;
  }
}

/** Rebuilds a question from its id, so spaced review can ask the same thing again. */
export function fromId(id: string, lab: Lab): Question {
  const { t, s, nm, keyName } = lab;
  const P = t.practice;
  const parts = id.split(':');
  const mode = parts[0] as Mode;
  const tonic = displayed(+parts[1], parts[2] as Enharmonic);
  const sc = majorScale(tonic);
  const base = pcOf(tonic);

  if (mode === 'sig') {
    const answer = keyName(tonic);
    const enh = parts[2] as Enharmonic;
    const others = shuffle([...Array(12).keys()].filter((o) => o !== +parts[1])).slice(0, 3).map((o) => keyName(displayed(o, enh)));
    const sig = keySignature(tonic);
    let why: string;
    if (sig.type > 0) why = t.chkSharp(nm(sig.list[sig.list.length - 1]), nm(tonic));
    else if (sig.type < 0 && sig.list.length > 1) why = t.chkFlats(nm(sig.list[sig.list.length - 2]), nm(tonic));
    else if (sig.type < 0) why = t.chkFlat1(nm(sig.list[0]), nm(tonic));
    else why = t.chkNone(nm(tonic));
    return { id, mode, prompt: P.question.sig, options: shuffle([answer, ...others]), answer, why, tonic };
  }

  if (mode === 'int' || mode === 'ear') {
    const num = +parts[3];
    const from = +parts[4];
    const semis = diatonicSize(from, num);
    const name = (g: number, x: number) => t.ivName(g, t.q[quality(g, x)]);
    const answer = name(num, semis);
    const pool = new Set<string>();
    for (let g = 2; g <= 8; g++) for (let f = 0; f < 7; f++) pool.add(name(g, diatonicSize(f, g)));
    const a = pcOf(sc[from]);
    const b = a + semis;
    return {
      id, mode, prompt: mode === 'int' ? P.question.int : P.question.ear,
      options: shuffle([answer, ...pick3([...pool], answer)]), answer,
      why: P.whyInt(nm(sc[from]), nm(sc[(from + num - 1) % 7]), semis, answer),
      keys: [a, b], labels: [1, num],
      sound: [{ s: a, t: 0, d: 0.7 }, { s: b, t: 0.6, d: 0.7 }, { s: a, t: 1.3, d: 1.2, v: 0.5 }, { s: b, t: 1.3, d: 1.2, v: 0.5 }],
      auto: mode === 'ear', hideKeys: mode === 'ear',
    };
  }

  if (mode === 'fn') {
    const d = +parts[3];
    const c = chordInfo(sc, d);
    const label = `${c.roman} (${nm(c.root)}${c.suffix})`;
    const fnOpt = (f: string) => `${f} · ${t.fnName[f]}`;
    const notes = triad(sc, d);
    const keys = voice(notes.map(pcOf), null);
    return {
      id, mode, prompt: P.question.fn(label, keyName(tonic)), options: ['T', 'SD', 'D'].map(fnOpt), answer: fnOpt(FUNCTION_OF[d]),
      why: P.whyFn(label, t.fnName[FUNCTION_OF[d]], notes.map(nm).join(' ')),
      keys, labels: ['1', '3', '5'], sound: keys.map((x) => ({ s: x, t: 0, d: 1.4, v: 0.55 })), auto: true,
    };
  }

  if (mode === 'sev') {
    const d = +parts[3];
    const q = DIATONIC_SEVENTH[d];
    const notes = [sc[d], sc[(d + 2) % 7], sc[(d + 4) % 7], sc[(d + 6) % 7]];
    const root = pcOf(sc[d]);
    const keys = SEVENTH[q].map((x) => root + x);
    const steps = SEVENTH[q].slice(1).map((x, i) => x - SEVENTH[q][i]).join(' + ');
    const sym = nm(sc[d]) + sevSuffix(q, s.lang);
    return {
      id, mode, prompt: P.question.sev, options: Object.keys(SEVENTH).map((k) => P.sevNames[k]), answer: P.sevNames[q],
      why: P.sevWhy(sym, notes.map(nm).join(' '), steps),
      keys, labels: ['1', '3', '5', '7'],
      sound: [...keys.map((x, i) => ({ s: x, t: i * 0.3, d: 0.5 })), ...keys.map((x) => ({ s: x, t: 1.35, d: 1.6, v: 0.5 }))], auto: true,
    };
  }

  if (mode === 'mode') {
    const m = parts[3];
    const keys = MODE_STEPS[m].map((x) => base + x);
    const names = Object.keys(MODE_STEPS);
    return {
      id, mode, prompt: P.question.mode, options: shuffle([P.modeNames[m], ...pick3(names.map((n) => P.modeNames[n]), P.modeNames[m])]),
      answer: P.modeNames[m], why: P.modeWhy[m], keys, labels: [1, 2, 3, 4, 5, 6, 7, 8],
      sound: [...keys.map((x, i) => ({ s: x, t: i * 0.3, d: 0.45 })), ...[keys[0], keys[2], keys[4]].map((x) => ({ s: x, t: 2.7, d: 1.4, v: 0.45 }))],
      auto: true, hideKeys: true,
    };
  }

  // dictation
  const idx = +parts[3];
  const degs = DICTATIONS[idx];
  const roman = (ds: number[]) => ds.map((d) => chordInfo(sc, d).roman).join(' – ');
  const answer = roman(degs);
  const others = shuffle(DICTATIONS.filter((_, i) => i !== idx)).slice(0, 3).map(roman);
  const sound: NoteEv[] = [];
  let prev: number[] | null = null;
  degs.forEach((d, i) => {
    const v = voice(triad(sc, d).map(pcOf), prev);
    prev = v;
    sound.push({ s: pcOf(sc[d]) - 12, t: i * 1.1, d: 1, v: 0.5 }, ...v.map((x) => ({ s: x, t: i * 1.1, d: 1, v: 0.5 })));
  });
  return {
    id, mode: 'dict', prompt: P.question.dict(keyName(tonic)), options: shuffle([answer, ...others]), answer,
    why: P.dictWhy(degs.map((d) => `${chordInfo(sc, d).roman} (${nm(sc[d])}${chordInfo(sc, d).suffix})`).join(' – '), degs.map((d) => FUNCTION_OF[d]).join(' → ')),
    sound, auto: true,
  };
}
