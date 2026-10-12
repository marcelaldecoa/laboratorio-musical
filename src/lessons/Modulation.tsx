import { useState } from 'react';
import { playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout } from '../components/layout';
import { MotionFifthsLine, type FifthsCell } from '../components/MotionFifthsLine';
import { MotionProgression, type ProgChord, type ProgTone } from '../components/MotionProgression';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Board, Html, Legend, Notes } from '../components/ui';
import { FUNCTION_OF, type Note, fifthIndex, fromFifthIndex, pcOf } from '../theory';
import {
  CLOSE_RELS, type CloseRel, type Key, SUFFIX, closeKey, closeVoicing, diatonicTriad, inScale, keyScale, modulation, qualityOf, windowOf,
} from '../theory/harmony';
import { text } from '../i18n/lessons/modulation';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import '../styles/motion.css';

const QCOL: Record<string, [string, string]> = {
  maj: ['var(--k-tonic)', 'var(--k-tonic-ink)'],
  min: ['var(--k-sub)', 'var(--k-sub-ink)'],
  dim: ['var(--k-lt)', 'var(--k-lt-ink)'],
};

export function Modulation() {
  const { s, nm, cur } = useLab();
  const t = useLessonText(text);
  const [rel, setRel] = useState<CloseRel>('V');
  const [pick, setPick] = useState<number | null>(null);
  const m = modulation(cur, rel);
  const kn = (k: Key) => (k.minor ? t.minor(nm(k.tonic)) : t.major(nm(k.tonic)));
  const sym = (ns: Note[]) => nm(ns[0]) + SUFFIX[qualityOf(ns)];
  const fromName = kn(m.from);
  const toName = kn(m.to);
  const sa = keyScale(m.from);
  const sb = keyScale(m.to);
  const outN = sa.filter((n) => !inScale(sb, n));
  const inN = sb.filter((n) => !inScale(sa, n));
  const pIdx = pick != null && pick < m.pivots.length ? pick : m.pivots.findIndex((p) => p.degA === m.pivot.degA);
  const pivot = m.pivots[pIdx];
  const choose = (r: CloseRel) => { setRel(r); setPick(null); };

  /* line of fifths */
  const wa = windowOf(m.from) - 1;
  const wb = windowOf(m.to) - 1;
  const cells: Record<number, FifthsCell> = {};
  sa.forEach((n) => (cells[fifthIndex(n)] = inScale(sb, n)
    ? { fill: 'var(--k-scale)', ink: 'var(--k-scale-ink)' }
    : { stroke: 'var(--muted)', dash: true, ink: 'var(--muted)' }));
  inN.forEach((n) => (cells[fifthIndex(n)] = { fill: 'var(--k-lt)', ink: 'var(--k-lt-ink)' }));
  cells[fifthIndex(m.to.tonic)] = { ...cells[fifthIndex(m.to.tonic)], sub: '1' };
  const toColor = m.shift > 0 ? 'var(--dom)' : m.shift < 0 ? 'var(--flat)' : 'var(--accent)';

  /* pivot keyboard */
  const pv = closeVoicing(pivot.notes.map(pcOf), null, 0, 23, 9);
  const qc = QCOL[pivot.quality] ?? QCOL.maj;
  const pMarks: Record<number, Mark> = {};
  pv.forEach((s) => {
    const k = pivot.notes.findIndex((n) => ((pcOf(n) - s) % 12 + 12) % 12 === 0);
    pMarks[s] = { fill: qc[0], ink: qc[1], label: ['1', '3', '5'][k], name: nm(pivot.notes[k]) };
  });
  const playPivot = (ns: Note[]) => {
    const v = closeVoicing(ns.map(pcOf), null, 0, 23, 9);
    playNotes([{ s: pcOf(ns[0]) - 12, t: 0, d: 1.4, v: 0.5 }, ...v.map((s) => ({ s, t: 0, d: 1.4, v: 0.5 }))], 'mod-pivot');
  };
  const pivotText = t.pivotRead(sym(pivot.notes), pivot.romanA, fromName, pivot.romanB, toName);

  /* the modulation */
  const [c0, , cV, cI] = m.chords;
  const lt = cV[1];
  const pTone = FUNCTION_OF[pivot.degB] as ProgTone;
  const chords: ProgChord[] = [
    { notes: c0, roman: 'I', name: sym(c0), tone: 'T' },
    { notes: pivot.notes, roman: `${pivot.romanA} = ${pivot.romanB}`, name: sym(pivot.notes), tone: pTone },
    { notes: cV, roman: 'V7', name: sym(cV), tone: 'D', hot: cV.map((n) => !inScale(sa, n)) },
    { notes: cI, roman: m.to.minor ? 'i' : 'I', name: sym(cI), tone: 'T' },
  ];
  const read = (i: number) =>
    i === 0 ? t.r0(sym(c0), fromName)
      : i === 1 ? t.r1(sym(pivot.notes), pivot.romanA, pivot.romanB)
        : i === 2 ? (m.shift === 0 ? t.r2same : t.r2)(sym(cV), nm(lt), toName)
          : t.r3(sym(cI), toName);

  const steps = [
    t.step1(fromName, toName, t.relName[rel], rel),
    m.shift === 0 ? t.step2same(toName, fromName) : t.step2(m.shift, outN.map(nm).join(' '), inN.map(nm).join(' ')),
    t.step3(m.pivots.length),
    t.step4(sym(pivot.notes), pivot.romanA, pivot.romanB),
    t.step5(sym(cV), nm(lt), toName),
  ];
  /* predict: from the current key to its dominant, which chord is a pivot? */
  const pm = modulation(cur, 'V');
  const pmA = keyScale(pm.from);
  const pmB = keyScale(pm.to);
  const pmDegrees = [0, 1, 2, 3, 4, 5, 6].filter((d) => d === pm.pivot.degA || !pm.pivots.some((p) => p.degA === d));
  const pmOptions = pmDegrees.map((d) => sym(diatonicTriad(pmA, d)));
  const pmOut = pmA.find((n) => !inScale(pmB, n));
  const labels = { play: t.play, stop: t.stop, prev: t.prev, next: t.next, now: t.now };
  const v = kn(closeKey(cur, 'V'));
  const iv = kn(closeKey(cur, 'IV'));
  const vi = kn(closeKey(cur, 'vi'));

  return (
    <>
      <p className="desc">{t.desc}</p>
      <Predict mode="choice" resetOn={`${s.k}${s.enh}`} options={pmOptions} answer={sym(pm.pivot.notes)}
        prompt={t.predictQ(kn(pm.from), kn(pm.to))}
        reveal={t.predictA(sym(pm.pivot.notes), pm.pivot.romanA, pm.pivot.romanB, pmOut ? nm(pmOut) : '')} />
      <p className="rowlab">{t.targetLab}</p>
      <div className="chips" role="group">
        {CLOSE_RELS.map((r) => {
          const k = closeKey(cur, r);
          return (
            <button key={r} type="button" className={'chip ' + (k.minor ? 'min' : 'maj')} aria-pressed={r === rel} onClick={() => choose(r)}>
              {r}<small>{kn(k)}</small>
            </button>
          );
        })}
      </div>

      <h3 className="sub-h">{t.winTitle}</h3>
      <Board>
        <MotionFifthsLine from={Math.min(wa, wb)} to={Math.max(wa, wb) + 6} name={(f) => nm(fromFifthIndex(f))}
          label={t.winAria(fromName, toName)} cells={cells}
          wins={[
            { start: wa, end: wa + 6, label: fromName, color: 'var(--accent)' },
            { start: wb, end: wb + 6, label: toName, color: toColor, dash: true, below: true },
          ]} />
      </Board>
      <Legend items={[
        { color: 'var(--k-scale)', label: t.lgCommon },
        { dash: 'var(--muted)', label: t.lgOut },
        { color: 'var(--k-lt)', label: t.lgIn },
      ]} />

      <h3 className="sub-h">{t.stepsTitle}</h3>
      <ol className="recipe">{steps.map((h, i) => <Html key={i} as="li" html={h} />)}</ol>

      <h3 className="sub-h">{t.pivotsTitle}</h3>
      <p className="desc">{t.pivotsDesc}</p>
      <div className="chips" role="group">
        {m.pivots.map((p, i) => (
          <button key={i} type="button" className={'chip ' + p.quality} aria-pressed={i === pIdx}
            onClick={() => { setPick(i); playPivot(p.notes); }}>
            {sym(p.notes)}<small>{p.romanA} = {p.romanB}</small>
          </button>
        ))}
      </div>
      <Board>
        <Keyboard lay={layout(0, 23)} marks={pMarks} channel="mod-pivot" label={pivotText.replace(/<[^>]+>/g, '')} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: t.lgMaj },
        { color: 'var(--k-sub)', label: t.lgMin },
        { color: 'var(--k-lt)', label: t.lgDim },
      ]} />
      <Html as="p" className="readout" html={pivotText} />

      <h3 className="sub-h">{t.progTitle}</h3>
      <p className="desc">{t.progDesc}</p>
      <MotionProgression chords={chords} channel="mod-prog" nm={nm} labels={labels} read={read} beat={1.2}
        legend={[
          { color: 'var(--k-tonic)', label: t.lgT },
          { color: 'var(--k-sub)', label: t.lgSD },
          { color: 'var(--k-dom)', label: t.lgD },
          { color: 'var(--k-lt)', label: t.lgLt },
          { dash: 'var(--muted)', label: t.lgWas },
        ]} />

      <h3 className="sub-h">{t.logicTitle}</h3>
      <Notes items={t.logic(kn(m.from), v, iv, vi).map((html) => ({ html }))} more={[4]} />
      <Transfer question={t.transfer} />
      <Recap {...t.recap} />
    </>
  );
}
