import { useMemo } from 'react';
import { DICTS } from '../i18n';
import {
  type Note, displayed, logical, majorScale, noteName, predLogical, sameNote, scaleDiff,
} from '../theory';
import { useStore } from './store';

/** Global key + derived theory + localized helpers, shared by every lesson. */
export function useLab() {
  const s = useStore();
  return useMemo(() => {
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
  }, [s]);
}

export type Lab = ReturnType<typeof useLab>;
