import { useState } from 'react';
import { playNotes } from '../audio/audio';
import { ColorBracket, VoiceArrow } from '../components/ChordsKit';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, rangeAround, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Bar, Board, Legend, Notes, PlayButton, Seg } from '../components/ui';
import { text } from '../i18n/lessons/v7';
import { useLessonText } from '../i18n/lessonText';
import { pcOf } from '../theory';
import { letterName, stackUp } from '../theory/chords7';
import { WHH } from '../components/layout';
import { useLab } from '../state/useLab';
import '../styles/chords.css';

export function V7() {
  const { s, nm, keyName, cur, sc } = useLab();
  const t = useLessonText(text);
  const [view, setView] = useState<'v7' | 'i'>('v7');
  let T = pcOf(sc[0]);
  if (T > 6) T -= 12;

  // V7 in four voices: bass on 5, then 7, 2, 4 close above; each voice's target in I
  const V = [T - 17, T - 1, T + 2, T + 5];
  const DEG = [4, 6, 1, 3];
  const GO = [T - 12, T, T, T + 4];
  const IDEG = [0, 0, 0, 2];
  const ROLE = ['dom', 'lt', 'dom', 'sub'] as const;
  const v7sym = letterName(sc[4]) + '7';
  const lay = rangeAround(T - 17, T + 7);
  const top = 52;

  const marks: Record<number, Mark> = {};
  if (view === 'v7') {
    GO.forEach((p) => (marks[p] = { ghost: 'var(--accent)' }));
    V.forEach((p, k) => (marks[p] = roleMark(p, ROLE[k], DEG[k] + 1, nm(sc[DEG[k]]))));
  } else {
    V.forEach((p) => (marks[p] = { ghost: 'var(--muted)' }));
    GO.forEach((p, k) => (marks[p] = roleMark(p, 'tonic', IDEG[k] + 1, nm(sc[IDEG[k]]))));
  }
  const names = DEG.map((d) => nm(sc[d])).join(' ');
  const read = view === 'v7' ? t.readV7(v7sym, names) : t.readI(nm(sc[6]), nm(sc[0]), nm(sc[3]), nm(sc[2]));

  const ch = 'v7';
  const play = (a: number[], b: number[]) =>
    playNotes([...a.map((s) => ({ s, t: 0, d: 1.3, v: 0.55 })), ...[...new Set(b)].map((s) => ({ s, t: 1.45, d: 1.9, v: 0.55 }))], ch);

  // predict: the V7 in root position, all blue; which one is the leading tone?
  const pDeg = [4, 6, 1, 3];
  const pPs = stackUp(pDeg.map((dd) => pcOf(sc[dd])), 0);
  const pMarks: Record<number, Mark> = {};
  pPs.forEach((p, k) => (pMarks[p] = roleMark(p, 'dom', undefined, nm(sc[pDeg[k]]))));

  return (
    <>
      <p className="desc">{t.desc(v7sym, keyName(cur))}</p>
      <Predict mode="key" resetOn={`${s.k}${s.enh}`} lay={layout(0, 23)} marks={pMarks} answer={[pPs[1]]} anyOctave
        prompt={t.p1(v7sym, keyName(cur), nm(sc[0]))} reveal={t.p1r(nm(sc[6]), nm(sc[0]), v7sym)} />
      <ol className="recipe">
        <li>{t.steps[0](nm(sc[4]), v7sym)}</li>
        <li>{t.steps[1](nm(sc[6]), nm(sc[0]))}</li>
        <li>{t.steps[2](nm(sc[3]), nm(sc[2]))}</li>
        <li>{t.steps[3](nm(sc[6]), nm(sc[3]))}</li>
      </ol>
      <Predict mode="choice" options={t.p2opts} answer={t.p2opts[0]} prompt={t.p2} resetOn={`${s.k}${s.enh}`}
        reveal={t.p2r(nm(sc[6]), nm(sc[0]), nm(sc[3]), nm(sc[2]))} />
      <div className="bar mt">
        <Seg label={t.view} value={view} onChange={setView} options={[{ v: 'v7', label: t.vV7 }, { v: 'i', label: t.vI }]} />
      </div>
      <Bar now={<span className="chords-sym">{view === 'v7' ? v7sym : letterName(sc[0])}</span>}>
        <PlayButton label={t.playV7I} seconds={3.4} onPlay={() => { setView('i'); play(V, GO); }} />
        <PlayButton label={t.playVI} seconds={3.4} onPlay={() => play([T - 17, T - 1, T + 2, T + 7], [T - 12, T, T + 4, T + 7])} />
        <PlayButton label={t.playTri} seconds={3.4} onPlay={() => play([T - 1, T + 5], [T, T + 4])} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} channel={ch} label={read} top={top} steps={[]}
          ann={(l) => (
            <>
              {view === 'v7'
                ? <ColorBracket lay={l} a={T - 1} b={T + 5} y={22} color="var(--change)" label={t.tritone} />
                : <ColorBracket lay={l} a={T} b={T + 4} y={22} color="var(--accent)" label={t.third} />}
              {V.map((p, k) => (
                <VoiceArrow key={k} lay={l} a={p} b={GO[k]} y={top + WHH + 26} below
                  color={k === 1 ? 'var(--change)' : k === 3 ? 'var(--flat)' : 'var(--muted)'} />
              ))}
            </>
          )} />
      </Board>
      <Legend items={[
        { color: 'var(--k-dom)', label: t.lgDom },
        { color: 'var(--k-lt)', label: t.lgLt },
        { color: 'var(--k-sub)', label: t.lgSub },
        { color: 'var(--k-tonic)', label: t.lgTon },
        view === 'v7' ? { dash: 'var(--accent)', label: t.lgGo } : { dash: 'var(--muted)', label: t.lgWas },
      ]} />
      <p className="readout">{read}</p>
      <p className="hint">{t.numNote}</p>
      <p className="rule mt">{t.compare}</p>
      <h3 className="sub-h">{t.logicTitle}</h3>
      <Notes items={t.logic.map((html) => ({ html }))} more={[4]} />
      <Transfer question={t.transfer} />
      <Recap {...t.recap} />
    </>
  );
}
