import { useSyncExternalStore } from 'react';
import type { Direction, Enharmonic, Notation } from '../theory';
import type { Lang } from '../i18n';

export type Theme = 'auto' | 'light' | 'dark';

export interface LabState {
  /** circle slot 0–11 */
  k: number;
  dir: Direction;
  enh: Enharmonic;
  nt: Notation;
  lang: Lang;
  theme: Theme;
  tune: 'pure' | 'eq';
  /** selected degree in Diatonic chords */
  deg: number;
  /** interval number and starting degree */
  ivl: number;
  ivr: number;
  /** progression pattern and chord index */
  pat: number;
  pi: number;
  /** melody degree in Composing */
  mel: number;
  /** last visited lesson */
  last: string;
  /** practice records */
  best: Record<string, number>;
  /** lessons the user marked as done */
  done: string[];
  /** days with study activity, as YYYY-MM-DD (local time) */
  days: string[];
  /** spaced review: question id → Leitner box and due time (ms) */
  review: Record<string, { box: number; due: number }>;
  /** show lesson notes one step at a time */
  stepMode: boolean;
}

const KEY = 'laboratorio-musical';

const defaults: LabState = {
  k: 0, dir: 'cw', enh: 'Fs', nt: 'pt', lang: 'pt', theme: 'auto', tune: 'pure',
  deg: 0, ivl: 5, ivr: 0, pat: 0, pi: 0, mel: 0, last: '', best: {},
  done: [], days: [], review: {}, stepMode: false,
};

function load(): LabState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && typeof s.k === 'number') {
        const merged = { ...defaults, ...s } as LabState;
        if (merged.lang !== 'pt' && merged.lang !== 'en') merged.lang = 'pt';
        return merged;
      }
    }
  } catch {
    /* storage unavailable: use defaults */
  }
  if (typeof navigator !== 'undefined' && !/^pt\b/i.test(navigator.language || 'pt')) {
    return { ...defaults, lang: 'en', nt: 'en' };
  }
  return defaults;
}

let state: LabState = typeof window === 'undefined' ? defaults : load();
const listeners = new Set<() => void>();

export function getState() {
  return state;
}

export function setState(patch: Partial<LabState> | ((s: LabState) => Partial<LabState>)) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T = LabState>(sel?: (s: LabState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => (sel ? sel(state) : (state as unknown as T)),
    () => (sel ? sel(defaults) : (defaults as unknown as T)),
  );
}

/* ---------- actions ---------- */
const m12 = (n: number) => ((n % 12) + 12) % 12;

/** Go to circle slot `k`; tapping F♯/G♭ again flips the spelling. */
export function goToKey(k: number) {
  setState((s) => {
    const nk = m12(k);
    let enh = s.enh;
    if (nk === 6) enh = nk === s.k ? (s.enh === 'Fs' ? 'Gb' : 'Fs') : s.dir === 'cw' ? 'Fs' : 'Gb';
    return { k: nk, enh };
  });
}

export function stepKey(delta: 1 | -1) {
  const s = getState();
  goToKey(s.k + (s.dir === 'cw' ? delta : -delta));
}

export function setDirection(dir: Direction) {
  setState((s) => ({ dir, enh: s.k === 6 ? (dir === 'cw' ? 'Fs' : 'Gb') : s.enh }));
}

export function setLang(lang: Lang) {
  setState({ lang, nt: lang === 'pt' ? 'pt' : 'en' });
}

/* ---------- progress ---------- */
export const today = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Records that the user studied today (lesson opened or drill answered). */
export function markStudied() {
  const d = today();
  if (!getState().days.includes(d)) setState((s) => ({ days: [...s.days, d].slice(-400) }));
}

/** Consecutive study days ending today (or yesterday, so the streak survives until tonight). */
export function streak(days: string[], now = new Date()): number {
  const set = new Set(days);
  const d = new Date(now);
  if (!set.has(today(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(today(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function toggleDone(id: string) {
  setState((s) => ({ done: s.done.includes(id) ? s.done.filter((x) => x !== id) : [...s.done, id] }));
}

/* ---------- spaced review (Leitner boxes) ---------- */
const DAY = 24 * 60 * 60 * 1000;
export const BOX_DAYS = [0, 1, 3, 7, 16, 35];

/** Updates a question's box after an answer: wrong goes back to box 0, right moves up one box. */
export function nextBox(prev: { box: number; due: number } | undefined, ok: boolean, now = Date.now()) {
  const box = ok ? Math.min((prev?.box ?? 0) + 1, BOX_DAYS.length - 1) : 0;
  return { box, due: now + BOX_DAYS[box] * DAY };
}

export function recordAnswer(id: string, ok: boolean) {
  const prev = getState().review[id];
  // only track questions once they have been missed, so review stays focused on weak spots
  if (!prev && ok) return;
  setState((s) => ({ review: { ...s.review, [id]: nextBox(prev, ok) } }));
}

export function dueReviews(review: LabState['review'], now = Date.now()): string[] {
  return Object.entries(review)
    .filter(([, r]) => r.due <= now && r.box < BOX_DAYS.length - 1)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => id);
}
