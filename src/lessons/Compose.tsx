import { useState } from 'react';
import { playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { Predict, Recap, Transfer } from '../components/Learn';
import { type Mark, layout, roleMark } from '../components/layout';
import { Board, Html, Legend, Notes } from '../components/ui';
import { extras } from '../i18n/lessons/extras/comp';
import { FUNCTION_OF, chordInfo, harmonizations, pcOf, triad } from '../theory';
import { setState } from '../state/store';
import { useLab } from '../state/useLab';
import { FN_KEY } from './melodyShared';
import '../styles/melody.css';

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
  const { s, nm, sc } = useLab();
  const X = extras[s.lang];
  const m = s.mel || 0;
  const [sel, setSel] = useState<number | null>(null);
  const mp = pcOf(sc[m]) + 12;
  const opts = harmonizations(m);
  const lab = (d: number) => {
    const c = chordInfo(sc, d);
    return `${c.roman} (${nm(c.root)}${c.suffix})`;
  };
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
  const f = FN_KEY[FUNCTION_OF[shownDeg]];
  const tri = triad(sc, shownDeg);
  const marks: Record<number, Mark> = {};
  [shown.bass, ...shown.inner].forEach((p) => {
    const k = tri.findIndex((n) => pcOf(n) === ((p % 12) + 12) % 12);
    marks[p] = { fill: f[0], ink: f[1], label: ['1', '3', '5'][k], name: nm(tri[k]) };
  });
  marks[shown.top] = { fill: 'var(--k-chg)', ink: 'var(--k-chg-ink)', label: '♪', name: nm(sc[m]) };

  // predictions, from the chosen melody note
  const reset = `${s.k}${s.enh}${s.nt}${m}`;
  const third = opts.find((o) => o.role === 'third')!.degree;
  const thirdRoot = pcOf(sc[third]);
  const melName = nm(sc[m]);
  const predMarks: Record<number, Mark> = { [mp]: { ...roleMark(mp, 'chg', '♪', melName) } };
  const countOpts = ['1', '2', '3', '7'];
  const [a, b, c] = opts.map((o) => lab(o.degree));

  return (
    <>
      <p className="desc">{X.desc}</p>
      <p className="rowlab">{X.melLabel}</p>
      <div className="chips" role="group" aria-label={X.melLabel}>
        {sc.map((n, i) => (
          <button key={i} type="button" className="chip neutral" aria-pressed={i === m} onClick={() => {
            setState({ mel: i });
            setSel(null);
            playNotes([{ s: pcOf(n) + 12, t: 0, d: 0.8 }], 'comp');
          }}>{nm(n)}<small>{i + 1}</small></button>
        ))}
      </div>
      <Predict mode="key" resetOn={reset} lay={layout(0, 23)} marks={predMarks} answer={[thirdRoot]} anyOctave
        prompt={X.predThird(melName)} reveal={X.predThirdReveal(melName, nm(sc[third]), lab(third))} />
      <Predict mode="choice" resetOn={reset + s.lang} options={countOpts} answer="3"
        prompt={X.predCount(melName)} reveal={X.predCountReveal(melName, a, b, c)} />
      <div className="harm">
        {opts.map(({ degree, role }) => {
          const ci = chordInfo(sc, degree);
          const fn = FUNCTION_OF[degree];
          return (
            <button key={degree} type="button" className={'hcard f' + fn + (degree === shownDeg ? ' sel' : '')}
              aria-pressed={degree === shownDeg} onClick={() => { setSel(degree); play(degree); }}>
              <span className="hrom">{ci.roman} · {nm(ci.root) + ci.suffix}</span>
              <span>{X.harmRole(melName, X.roleName[role])}</span>
              <span className="hfn">{fn} · {X.fnName[fn]}</span>
              <span className="hplay">▶ {X.playHarm}</span>
            </button>
          );
        })}
      </div>
      <Board className="mt"><Keyboard lay={layout(-12, 23)} marks={marks} channel="comp" label={X.keyLabel(lab(shownDeg), melName)} /></Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: X.lgT },
        { color: 'var(--k-sub)', label: X.lgSD },
        { color: 'var(--k-dom)', label: X.lgD },
        { color: 'var(--k-chg)', label: X.lgMel },
      ]} />

      <h3 className="sub-h">{X.chooseTitle}</h3>
      <ol className="mel-steps">{X.choose.map((r, i) => <Html as="li" key={i} html={r} />)}</ol>

      <h3 className="sub-h">{X.recipeTitle}</h3>
      <ol className="recipe">{X.recipe.map((r, i) => <Html as="li" key={i} html={r} />)}</ol>
      <p className="hint mt">{X.nextHint}</p>

      <h3 className="sub-h">{X.logicTitle}</h3>
      <Notes items={[...X.logic, X.moreBass].map((html) => ({ html }))} more={[X.logic.length]} />
      <Transfer question={X.transfer} />
      <Recap {...X.recap} />
    </>
  );
}
