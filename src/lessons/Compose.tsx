import { useState } from 'react';
import { playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout } from '../components/layout';
import { Board } from '../components/ui';
import { FUNCTION_OF, chordInfo, harmonizations, pcOf, triad } from '../theory';
import { setState } from '../state/store';
import { useLab } from '../state/useLab';

const FCOL: Record<string, [string, string]> = {
  T: ['var(--k-tonic)', 'var(--k-tonic-ink)'], SD: ['var(--k-sub)', 'var(--k-sub-ink)'], D: ['var(--k-dom)', 'var(--k-dom-ink)'],
};

/** Voices a triad below the melody note (melody on top) plus a bass root. */
function harmonize(pcs: number[], mp: number) {
  const below = pcs.filter((p) => p !== mp % 12).map((p) => {
    let x = p;
    while (x + 12 < mp) x += 12;
    while (x >= mp) x -= 12;
    return x;
  });
  return { bass: pcs[0] - 12, inner: below, top: mp };
}

export function Compose() {
  const { s, t, nm, sc } = useLab();
  const m = s.mel || 0;
  const [sel, setSel] = useState<number | null>(null);
  const mp = pcOf(sc[m]) + 12;
  const roleName = { root: t.roleRoot, third: t.roleThird, fifth: t.roleFifth };
  const opts = harmonizations(m);
  const play = (d: number) => {
    const v = harmonize(triad(sc, d).map(pcOf), mp);
    playNotes([
      { s: v.bass, t: 0, d: 1.6, v: 0.45 },
      ...v.inner.map((x) => ({ s: x, t: 0, d: 1.6, v: 0.42 })),
      { s: v.top, t: 0, d: 1.6, v: 0.75 },
    ], 'comp');
  };
  const shownDeg = sel != null && opts.some((o) => o.degree === sel) ? sel : opts[0].degree;
  const shown = harmonize(triad(sc, shownDeg).map(pcOf), mp);
  const f = FCOL[FUNCTION_OF[shownDeg]];
  const marks: Record<number, Mark> = {};
  [shown.bass, ...shown.inner].forEach((p) => (marks[p] = { fill: f[0], ink: f[1] }));
  marks[shown.top] = { fill: 'var(--k-chg)', ink: 'var(--k-chg-ink)', label: '♪', name: nm(sc[m]) };
  return (
    <>
      <p className="desc">{t.composeDesc}</p>
      <p className="rowlab">{t.melLabel}</p>
      <div className="chips" role="group">
        {sc.map((n, i) => (
          <button key={i} type="button" className="chip neutral" aria-pressed={i === m} onClick={() => {
            setState({ mel: i });
            playNotes([{ s: pcOf(n) + 12, t: 0, d: 0.8 }], 'comp');
          }}>{nm(n)}<small>{i + 1}</small></button>
        ))}
      </div>
      <div className="harm">
        {opts.map(({ degree, role }) => {
          const c = chordInfo(sc, degree);
          const fn = FUNCTION_OF[degree];
          return (
            <button key={degree} type="button" className={'hcard f' + fn + (degree === shownDeg ? ' sel' : '')} onClick={() => { setSel(degree); play(degree); }}>
              <span className="hrom">{c.roman} · {nm(c.root) + c.suffix}</span>
              <span>{t.harmRole(nm(sc[m]), roleName[role])}</span>
              <span className="hfn">{fn} · {t.fnName[fn]}</span>
              <span className="hplay">▶ {t.playHarm}</span>
            </button>
          );
        })}
      </div>
      <Board className="mt"><Keyboard lay={layout(-12, 23)} marks={marks} channel="comp" /></Board>
      <h3 className="sub-h">{t.recipeTitle}</h3>
      <ol className="recipe">{t.recipe.map((r, i) => <li key={i}>{r}</li>)}</ol>
    </>
  );
}
