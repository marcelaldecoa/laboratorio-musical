import { useMemo } from 'react';
import { DICTS } from '../i18n';
import {
  type Note, displayed, logical, majorScale, noteName, predLogical, sameNote, scaleDiff,
} from '../theory';
import { type LabState, useStore } from './store';

/** Global key + derived theory + localized helpers for a given state (pure). */
export function makeLab(s: LabState) {
  const t = DICTS[s.lang];
  const nm = (n: Note) => noteName(n, s.nt);
  const keyName = (n: Note) => `${nm(n)} ${t.major}`;
  const cur = displayed(s.k, s.enh);
  const lcur = logical(s.k, s.dir);
  const pred = predLogical(s.k, s.dir);
  const consistent = sameNote(cur, lcur);
  const diff = scaleDiff(pred, lcur);
  const sc = majorScale(cur);
  return { s, t, nm, keyName, cur, lcur, pred, consistent, diff, sc };
}

/** Global key + derived theory + localized helpers, shared by every lesson. */
export function useLab() {
  const s = useStore();
  return useMemo(() => makeLab(s), [s]);
}

export type Lab = ReturnType<typeof makeLab>;
