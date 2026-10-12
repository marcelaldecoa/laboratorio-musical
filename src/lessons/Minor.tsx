import { useState } from 'react';
import { playNotes, seq } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { type FormulaToken, ScalesBracket, ScalesFormulaRow, scaleSemis, stepsAny } from '../components/ScalesKit';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Bar, Board, Html, Legend, Notes, PlayButton, Seg } from '../components/ui';
import { useLessonText } from '../i18n/lessonText';
import { text } from '../i18n/lessons/minor';
import { goToKey } from '../state/store';
import { useLab } from '../state/useLab';
import { MAJOR_OFFSETS, displayed, fifthIndex, fromFifthIndex, pcOf } from '../theory';
import { NATURAL_MINOR, naturalMinor, relativeMinor, stepsOf } from '../theory/scales';
import '../styles/scales.css';

const CX = 150;
const CY = 150;
const pos = (k: number, r: number): [number, number] => {
  const a = ((-90 + 30 * k) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};

export function Minor() {
  const { s, t, nm, keyName, cur, sc } = useLab();
  const tx = useLessonText(text);
  const [view, setView] = useState<'maj' | 'min'>('min');
  const mt = relativeMinor(cur);
  const minSc = naturalMinor(mt);
  const minName = `${nm(mt)} ${tx.minor}`;
  const base = pcOf(cur);
  const mBase = base - 3;
  const lay = rangeAround(mBase, base + 12);
  const majSemis = scaleSemis(base, MAJOR_OFFSETS);
  const minSemis = scaleSemis(mBase, NATURAL_MINOR);
  // every scale key in the range, with its spelled note
  const names: Record<number, string> = {};
  majSemis.forEach((x, i) => (names[x] = nm(sc[i % 7])));
  minSemis.forEach((x, i) => (names[x] = nm(minSc[i % 7])));
  const all = Object.keys(names).map(Number).sort((x, y) => x - y);
  const tonicPc = view === 'maj' ? base : mBase;
  const otherPc = view === 'maj' ? mBase : base;
  const offs: readonly number[] = view === 'maj' ? MAJOR_OFFSETS : NATURAL_MINOR;
  const m12 = (x: number) => ((x % 12) + 12) % 12;
  const marks: Record<number, Mark> = {};
  for (const x of all) {
    const d = offs.indexOf(m12(x - tonicPc)) + 1;
    marks[x] = roleMark(x, d === 1 ? 'tonic' : 'scale', d, names[x]);
    if (m12(x - otherPc) === 0) marks[x].ghost = 'var(--k-sub-line)';
  }
  const majTxt = sc.map(nm).join(' ');
  const minTxt = minSc.map(nm).join(' ');
  const now = view === 'maj' ? tx.now(keyName(cur), majTxt) : tx.now(minName, minTxt);
  const play = (which: 'maj' | 'min' | 'both') => {
    const a = seq(majSemis, 0.3, 0.45);
    const b = seq(minSemis, 0.3, 0.45);
    const ev = which === 'maj' ? a : which === 'min' ? b : [...a, ...b.map((e) => ({ ...e, t: e.t + 2.9 }))];
    playNotes(ev, 'minor');
  };
  const tok = (st: number[]): FormulaToken[] => st.map((x) => ({ t: x === 1 ? t.H : t.W, h: x === 1 }));
  const majSteps = tok(stepsOf(MAJOR_OFFSETS));
  const minSteps = tok(stepsOf(NATURAL_MINOR)).map((k, i) => ({ ...k, mv: i < 2 }));
  majSteps[5].mv = true;
  majSteps[6].mv = true;
  const f = fifthIndex(cur);
  // predict: the major scale's keys, tonic marked; find degree 6
  const pMarks: Record<number, Mark> = {};
  for (const x of majSemis) pMarks[x] = roleMark(x, m12(x - base) === 0 ? 'tonic' : 'scale', m12(x - base) === 0 ? 1 : undefined, names[x]);
  for (const x of minSemis) if (!pMarks[x]) pMarks[x] = roleMark(x, 'scale', undefined, names[x]);
  const line = [0, 1, 2, 3].map((j) => nm(fromFifthIndex(f + j))).join(' → ');

  return (
    <>
      <p className="desc">{tx.desc}</p>
      <Predict mode="key" prompt={tx.predict(keyName(cur))} reveal={tx.predictReveal(nm(mt), keyName(cur), minName)}
        lay={lay} marks={pMarks} answer={[mBase, mBase + 12]} anyOctave resetOn={s.k + s.enh} />
      <h3 className="sub-h">{tx.step1}</h3>
      <p className="rowlab">{tx.view}</p>
      <Seg value={view} label={tx.view} onChange={setView}
        options={[{ v: 'maj', label: tx.viewMaj(nm(cur)) }, { v: 'min', label: tx.viewMin(nm(mt)) }]} />
      <Bar now={now}>
        <PlayButton label={tx.playMaj} seconds={2.6} onPlay={() => play('maj')} />
        <PlayButton label={tx.playMin} seconds={2.6} onPlay={() => play('min')} />
        <PlayButton label={tx.playBoth} seconds={5.6} onPlay={() => play('both')} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} steps={stepsAny(all, t.W, t.H, '')} top={50} channel="minor"
          label={tx.kbdLabel(keyName(cur), view === 'maj' ? keyName(cur) : minName)}
          ann={(l) => <ScalesBracket lay={l} a={mBase} b={base} y={22} label={tx.bracket} />} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: tx.lgTonic },
        { color: 'var(--k-scale)', label: tx.lgScale },
        { dash: 'var(--k-sub-line)', label: tx.lgOther },
      ]} />

      <h3 className="sub-h">{tx.step2}</h3>
      <div className="scales-formula">
        <ScalesFormulaRow label={`${tx.fMaj} · ${nm(cur)}`} tokens={majSteps} />
        <ScalesFormulaRow label={`${tx.fMin} · ${nm(mt)}`} tokens={minSteps} />
        <p className="hint">{tx.fHint}</p>
      </div>
      <Html as="p" className="readout" html={tx.fWhy(keyName(cur), minName)} />

      <h3 className="sub-h">{tx.step3}</h3>
      <Board>
        <svg className="scales-circle" viewBox="0 0 300 300" role="group" aria-label={tx.circleLabel}>
          <circle cx={CX} cy={CY} r={118} fill="none" stroke="var(--line)" />
          <circle cx={CX} cy={CY} r={76} fill="none" stroke="var(--line)" />
          {Array.from({ length: 12 }, (_, k) => {
            const M = displayed(k, s.enh);
            const mm = relativeMinor(M);
            const on = k === s.k;
            const [x, y] = pos(k, 118);
            const [ix, iy] = pos(k, 76);
            const ml = nm(M);
            const nl = nm(mm) + tx.m;
            return (
              <g key={k} className="node" role="button" tabIndex={0} aria-pressed={on}
                aria-label={tx.pair(keyName(M), `${nm(mm)} ${tx.minor}`)}
                onClick={() => goToKey(k)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToKey(k); } }}>
                {on && <line x1={x} y1={y} x2={ix} y2={iy} stroke="var(--muted)" strokeWidth={1.4} strokeDasharray="3 3" />}
                <circle cx={x} cy={y} r={on ? 22 : 20}
                  style={{ fill: on ? 'var(--accent)' : 'var(--surface)', stroke: on ? 'var(--accent)' : 'var(--line)', strokeWidth: 1.4 }} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                  style={{ font: `500 ${ml.length > 3 ? 11 : 13}px var(--f-body)`, fill: on ? 'var(--on-accent)' : 'var(--fg)' }}>{ml}</text>
                <circle cx={ix} cy={iy} r={on ? 19 : 17}
                  style={{ fill: on ? 'var(--k-sub)' : 'var(--flat-soft)', stroke: on ? 'var(--k-sub)' : 'var(--flat-soft)', strokeWidth: 1.4 }} />
                <text x={ix} y={iy} textAnchor="middle" dominantBaseline="central"
                  style={{ font: `500 ${nl.length > 3 ? 10 : 11.5}px var(--f-body)`, fill: on ? 'var(--k-sub-ink)' : 'var(--flat-ink)' }}>{nl}</text>
              </g>
            );
          })}
          <text x={CX} y={CY - 8} textAnchor="middle" dominantBaseline="central" style={{ font: '400 20px var(--f-display)', fill: 'var(--fg)' }}>{nm(cur)}</text>
          <text x={CX} y={CY + 16} textAnchor="middle" dominantBaseline="central" style={{ font: '400 15px var(--f-display)', fill: 'var(--flat)' }}>{nm(mt) + tx.m}</text>
        </svg>
      </Board>
      <p className="hint mt">{tx.circleTap}</p>
      <h3 className="sub-h">{tx.whyTitle}</h3>
      <Notes items={tx.why(keyName(cur), minName, nm(mt), line).map((html) => ({ html }))} more={[2, 4]} />
      <Transfer question={tx.transfer} />
      <Recap {...tx.recap} />
    </>
  );
}
