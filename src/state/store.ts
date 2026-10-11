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
}

const KEY = 'laboratorio-musical';

const defaults: LabState = {
  k: 0, dir: 'cw', enh: 'Fs', nt: 'pt', lang: 'pt', theme: 'auto', tune: 'pure',
  deg: 0, ivl: 5, ivr: 0, pat: 0, pi: 0, mel: 0, last: '', best: {},
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
