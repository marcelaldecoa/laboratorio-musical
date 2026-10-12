import { useState } from 'react';
import { chord, playNotes, seq } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark, stepsFor } from '../components/layout';
import { type FifthCell, ScalesFifthsRow, scaleSemis, upDown } from '../components/ScalesKit';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Bar, Board, Html, Legend, Notes, PlayButton, Seg } from '../components/ui';
import { useLessonText } from '../i18n/lessonText';
import { text } from '../i18n/lessons/modes';
import { useLab } from '../state/useLab';
import { MAJOR_OFFSETS, fifthIndex, fromFifthIndex, pcOf, sameNote } from '../theory';
import {
  MODES_BY_BRIGHTNESS, MODE_CHAR, type ModeId, modeAlterations, modeBrightness, modeDegree, modeIsMajor, modeOfKey,
  modeOffsets, modeScale, naturalMinor,
} from '../theory/scales';
import '../styles/scales.css';

const sign = (d: number) => (d > 0 ? '♯' : d < 0 ? '♭' : '');

export function Modes() {
  const { s, t, nm, keyName, cur, sc } = useLab();
  const tx = useLessonText(text);
  const [mode, setMode] = useState<ModeId>('dorian');
  const [view, setView] = useState<'rel' | 'par'>('rel');
  const rel = view === 'rel';
  const T = rel ? sc[modeDegree(mode)] : cur;
  const notes = rel ? modeOfKey(cur, mode) : modeScale(cur, mode);
  const offs = modeOffsets(mode);
  const alts = modeAlterations(mode);
  const ch = MODE_CHAR[mode];
  const charDegs = [ch.deg, ch.deg2 ?? 0].filter((d) => d > 0);
  const base = pcOf(T);
  const semis = scaleSemis(base, offs);
  const lay = rangeAround(base, base + 12);
  const modeName = tx.modeOn(nm(T), tx.names[mode]);

  const marks: Record<number, Mark> = {};
  semis.forEach((x, i) => {
    const d = (i % 7) + 1;
    const n = notes[i % 7];
    if (d === 1) marks[x] = roleMark(x, 'tonic', d, nm(n));
    else if (rel && charDegs.includes(d)) marks[x] = roleMark(x, 'chg', d, nm(n));
    else if (!rel && alts[d - 1] !== 0) {
      marks[x] = roleMark(x, 'chg', sign(alts[d - 1]) + d, nm(n));
      marks[base + MAJOR_OFFSETS[d - 1]] = { ghost: 'var(--k-lt-line)' };
    } else marks[x] = roleMark(x, 'scale', d, nm(n));
  });

  // line of fifths
  const cells: FifthCell[] = [];
  let bracket: { from: number; to: number; text: string };
  const letterDeg = (n: { letter: number }) => ((n.letter - T.letter + 7) % 7) + 1;
  if (rel) {
    const f0 = fifthIndex(sc[3]);
    for (let j = -2; j <= 8; j++) {
      const n = fromFifthIndex(f0 + j);
      const inW = j >= 0 && j <= 6;
      if (!inW) { cells.push({ name: nm(n), dash: true }); continue; }
      const d = letterDeg(n);
      const isT = sameNote(n, T);
      const isC = charDegs.includes(d);
      cells.push({
        name: nm(n), sub: String(d),
        fill: isT ? 'var(--k-tonic)' : isC ? 'var(--k-chg)' : 'var(--k-scale)',
        ink: isT ? 'var(--k-tonic-ink)' : isC ? 'var(--k-chg-ink)' : 'var(--k-scale-ink)',
      });
    }
    bracket = { from: 2, to: 8, text: tx.lineKey(keyName(cur)) };
  } else {
    const ion = fifthIndex(cur) - 1;
    const ms = fifthIndex(cur) - modeBrightness(mode);
    const from = ion - 5;
    for (let f = from; f <= ion + 7; f++) {
      const n = fromFifthIndex(f);
      const inM = f >= ms && f <= ms + 6;
      const inI = f >= ion && f <= ion + 6;
      if (inM) {
        const isT = sameNote(n, T);
        const isA = !inI;
        cells.push({
          name: nm(n), sub: (isA ? sign(n.acc - sc[letterDeg(n) - 1].acc) : '') + letterDeg(n),
          fill: isT ? 'var(--k-tonic)' : isA ? 'var(--k-chg)' : 'var(--k-scale)',
          ink: isT ? 'var(--k-tonic-ink)' : isA ? 'var(--k-chg-ink)' : 'var(--k-scale-ink)',
        });
      } else if (inI) cells.push({ name: nm(n), dash: true, stroke: 'var(--k-lt-line)', ink: 'var(--fg)' });
      else cells.push({ name: nm(n), dash: true });
    }
    bracket = { from: ms - from, to: ms - from + 6, text: tx.lineMode(modeName) };
  }

  // predict: Dorian on degree 2 vs the natural minor on the same tonic
  const dT = sc[1];
  const dBase = pcOf(dT);
  const dSemis = scaleSemis(dBase, modeOffsets('dorian'));
  const dNotes = modeOfKey(cur, 'dorian');
  const pMarks: Record<number, Mark> = {};
  dSemis.forEach((x, i) => (pMarks[x] = roleMark(x, i % 7 === 0 ? 'tonic' : 'scale', (i % 7) + 1, nm(dNotes[i % 7]))));
  const altList = alts.map((a, i) => (a ? sign(a) + (i + 1) : '')).filter(Boolean);
  const altTxt = altList.length > 1 ? altList.slice(0, -1).join(', ') + tx.and + altList[altList.length - 1] : altList.join('');
  const now = (rel ? tx.relNow : tx.parNow)(tx.cap(modeName), notes.map(nm).join(' '));
  const play = () =>
    playNotes([...chord([base - 12, base - 5], 0, 5.2, 0.35), ...seq(upDown(semis), 0.3, 0.45).map((e) => ({ ...e, t: e.t + 0.4 }))], 'modes');

  const charTxt = (m: ModeId) => {
    const c = MODE_CHAR[m];
    const ref = c.ref === 'maj' ? tx.charMaj : tx.charMin;
    const alt = c.deg ? [c.deg, c.deg2].filter(Boolean).map((d) => sign(c.dir) + d).join(' ') : '';
    return tx.charSmall(ref, alt);
  };

  return (
    <>
      <p className="desc">{tx.desc}</p>
      <Predict mode="key" prompt={tx.predict(keyName(cur), nm(dT))} reveal={tx.predictReveal(nm(dNotes[5]), nm(dT), nm(naturalMinor(dT)[5]))}
        lay={rangeAround(dBase, dBase + 12)} marks={pMarks} answer={[dSemis[5]]} anyOctave top={30} resetOn={s.k + s.enh} />
      <p className="rowlab">{tx.pick}</p>
      <div className="chips" role="group" aria-label={tx.pick}>
        {MODES_BY_BRIGHTNESS.map((m) => (
          <button key={m} type="button" className={'chip scales-mode ' + (m === 'locrian' ? 'dim' : modeIsMajor(m) ? 'maj' : 'min')}
            aria-pressed={m === mode} onClick={() => setMode(m)}>
            {tx.cap(tx.names[m])}<small>{charTxt(m)}</small>
          </button>
        ))}
      </div>
      <p className="rowlab">{tx.view}</p>
      <Seg value={view} label={tx.view} onChange={setView} options={[{ v: 'rel', label: tx.viewRel }, { v: 'par', label: tx.viewPar }]} />
      <Bar now={now}><PlayButton label={tx.play} seconds={5} onPlay={play} /></Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} steps={stepsFor(semis, t.W, t.H)} top={30} channel="modes" label={now} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: tx.lgTonic },
        { color: 'var(--k-chg)', label: rel ? tx.lgChar : tx.lgAlt },
        { color: 'var(--k-scale)', label: tx.lgScale },
        ...(rel ? [] : [{ dash: 'var(--k-lt-line)', label: tx.lgGhost }]),
      ]} />
      <Html as="p" className="readout" html={rel ? tx.relRead(tx.cap(modeName), keyName(cur), modeDegree(mode) + 1) : tx.parRead(tx.cap(modeName), altTxt, altList.length)} />
      <p className="hint">{tx.dronesHint}</p>
      <h3 className="sub-h">{tx.lineTitle}</h3>
      <Board>
        <ScalesFifthsRow cells={cells} bracket={bracket} label={bracket.text} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: tx.lgTonic },
        { color: 'var(--k-chg)', label: rel ? tx.lgChar : tx.lgAlt },
        { color: 'var(--k-scale)', label: tx.lgLineIn },
        ...(rel ? [] : [{ dash: 'var(--k-lt-line)', label: tx.lgLineOut }]),
      ]} />
      <h3 className="sub-h">{tx.whyTitle}</h3>
      <Notes items={tx.why(tx.names.lydian, tx.names.locrian).map((html) => ({ html }))} more={[4, 5]} />
      <Transfer question={tx.transfer} />
      <Recap {...tx.recap} />
    </>
  );
}
