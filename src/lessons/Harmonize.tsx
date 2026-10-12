import { useEffect, useRef, useState } from 'react';
import { type NoteEvent, later, playNotes, stopAll } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Board, Legend, Notes } from '../components/ui';
import { text } from '../i18n/lessons/harmonize';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import { FUNCTION_OF, chordInfo, harmonizations, pcOf, triad } from '../theory';
import { HARM_MELODY, HARM_SUGGESTION, groupRange, harmTips, stepSemi, voiceUnder } from '../theory/melody';
import { FN_KEY } from './melodyShared';
import '../styles/melody.css';

const BAR = 1.25;

export function Harmonize() {
  const { s: st, nm, sc, cur } = useLab();
  const L = useLessonText(text);
  const N = HARM_MELODY.length;
  const [choice, setChoice] = useState<(number | null)[]>(() => Array(N).fill(null));
  const [bar, setBar] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tok = useRef(0);
  useEffect(() => () => { tok.current++; stopAll(); }, []);

  const pc = pcOf(cur);
  const base = pc < 7 ? pc + 12 : pc;
  const tops = HARM_MELODY.map((i) => stepSemi(base, i));
  const melName = (k: number) => nm(sc[HARM_MELODY[k]]);
  const ci = (d: number) => chordInfo(sc, d);
  const lab = (d: number) => nm(ci(d).root) + ci(d).suffix;
  const voiced = (k: number, d: number) => voiceUnder(triad(sc, d).map(pcOf), tops[k]);
  const events = (k: number, d: number | null, t: number, len: number): NoteEvent[] => {
    const top: NoteEvent = { s: tops[k], t, d: len, v: 0.8 };
    if (d == null) return [top];
    const v = voiced(k, d);
    return [{ s: v.bass, t, d: len, v: 0.45 }, ...v.inner.map((s) => ({ s, t, d: len, v: 0.4 })), top];
  };

  const stop = () => { tok.current++; stopAll(); setPlaying(false); };
  const pick = (d: number) => {
    stop();
    setChoice((c) => c.map((x, k) => (k === bar ? d : x)));
    playNotes(events(bar, d, 0, 1.6), 'harm');
  };
  const goBar = (k: number) => {
    stop();
    const kk = (k + N) % N;
    setBar(kk);
    playNotes(events(kk, choice[kk], 0, 1.4), 'harm');
  };
  const playAll = () => {
    if (playing) { stop(); return; }
    stopAll();
    const my = ++tok.current;
    setPlaying(true);
    const ev: NoteEvent[] = [];
    choice.forEach((d, k) => {
      ev.push(...events(k, d, k * BAR, BAR * 0.95));
      later(() => { if (tok.current === my) setBar(k); }, k * BAR + 0.05);
    });
    playNotes(ev, 'harm');
    later(() => { if (tok.current === my) setPlaying(false); }, N * BAR + 0.4);
  };

  // stable keyboard range: every voicing of every option
  const all: number[] = [];
  HARM_MELODY.forEach((m, k) => harmonizations(m).forEach((o) => {
    const v = voiced(k, o.degree);
    all.push(v.bass, v.top);
  }));
  const [from, to] = groupRange(all);

  const d = choice[bar];
  const marks: Record<number, Mark> = {};
  if (d != null) {
    const v = voiced(bar, d);
    const tri = triad(sc, d);
    const f = FN_KEY[FUNCTION_OF[d]];
    [v.bass, ...v.inner].forEach((s) => {
      const m = tri.findIndex((n) => pcOf(n) === ((s % 12) + 12) % 12);
      marks[s] = { fill: f[0], ink: f[1], label: ['1', '3', '5'][m], name: nm(tri[m]) };
    });
  }
  marks[tops[bar]] = { fill: 'var(--k-chg)', ink: 'var(--k-chg-ink)', label: '♪', name: melName(bar) };

  const tips = harmTips(choice);
  const opts = harmonizations(HARM_MELODY[bar]);

  // prediction: the closing pair of chords
  const rom = (dd: number) => `${ci(dd).roman} (${lab(dd)})`;
  const endPairs = [[1, 0], [4, 0], [6, 5], [4, 5]].map(([x, y]) => `${rom(x)} → ${rom(y)}`);

  return (
    <>
      <p className="desc">{L.desc}</p>
      <h3 className="sub-h">{L.stepsTitle}</h3>
      <ol className="mel-steps">{L.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      <Predict mode="choice" resetOn={`${st.k}${st.enh}${st.nt}${st.lang}`} options={endPairs} answer={endPairs[1]}
        prompt={L.predEnd(melName(N - 2), melName(N - 1))}
        reveal={L.predEndReveal(melName(N - 2), rom(4), nm(sc[6]), nm(sc[0]))} />

      <p className="rowlab">{L.melLabel}</p>
      <div className="mel-cells" role="group" aria-label={L.progLabel}>
        {HARM_MELODY.map((_, k) => {
          const c = choice[k];
          return (
            <button key={k} type="button" aria-pressed={k === bar} aria-label={`${L.barLabel(k + 1)}: ${melName(k)}`}
              className={'mel-cell' + (c != null ? ' f' + FUNCTION_OF[c] : '') + (k === bar && playing ? ' beat' : '')}
              onClick={() => goBar(k)}>
              <span className="mel-cell-n">{k + 1}</span>
              <span className="mel-cell-m">♪ {melName(k)}</span>
              <b>{c != null ? ci(c).roman : L.none}</b>
              <small>{c != null ? `${lab(c)} · ${FUNCTION_OF[c]}` : ' '}</small>
            </button>
          );
        })}
      </div>
      <div className="bar">
        <span className="now">{L.stepNow(bar + 1, N, melName(bar))}</span>
        <div className="row">
          <div className="nav">
            <button type="button" aria-label="◀" onClick={() => goBar(bar - 1)}>{L.prev}</button>
            <button type="button" aria-label="▶" onClick={() => goBar(bar + 1)}>{L.next}</button>
          </div>
        </div>
      </div>
      <p className="rowlab">{L.options(melName(bar))}</p>
      <div className="harm">
        {opts.map(({ degree, role }) => {
          const fn = FUNCTION_OF[degree];
          return (
            <button key={degree} type="button" className={'hcard f' + fn + (degree === d ? ' sel' : '')} aria-pressed={degree === d} onClick={() => pick(degree)}>
              <span className="hrom">{ci(degree).roman} · {lab(degree)}</span>
              <span>{L.roleIn(melName(bar), L.roleName[role])}</span>
              <span className="hfn">{fn} · {L.fnName[fn]}</span>
              <span className="hplay">{degree === d ? '✓ ' + L.chosen : '▶ ' + L.choose}</span>
            </button>
          );
        })}
      </div>
      <Board className="mt">
        <Keyboard lay={layout(from, to)} marks={marks} channel="harm"
          label={L.keyLabel(d != null ? `${ci(d).roman} (${lab(d)})` : L.none, melName(bar))} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: L.lgT },
        { color: 'var(--k-sub)', label: L.lgSD },
        { color: 'var(--k-dom)', label: L.lgD },
        { color: 'var(--k-chg)', label: L.lgMel },
      ]} />

      <h3 className="sub-h">{L.tipsTitle}</h3>
      <ul className="tests">
        {tips.map((t, i) => (
          <li key={i}>
            <span className={t.tip === 'ok' ? 'ok' : t.tip === 'pick' ? 'mel-info' : 'no'} aria-hidden="true">
              {t.tip === 'ok' ? '✓' : t.tip === 'pick' ? '○' : '!'}
            </span>
            <span>{L.tip[t.tip](t.bar + 1)}</span>
          </li>
        ))}
      </ul>
      <div className="mel-tools">
        <button type="button" className={'play' + (playing ? ' on' : '')} onClick={playAll}>
          <span className="play-ic" aria-hidden="true">{playing ? '■' : '▶'}</span> {playing ? L.stop : L.play}
        </button>
        <button type="button" onClick={() => { stop(); setChoice([...HARM_SUGGESTION]); }}>{L.suggest}</button>
        <button type="button" onClick={() => { stop(); setChoice(Array(N).fill(null)); setBar(0); }}>{L.clear}</button>
      </div>

      <h3 className="sub-h">{L.logicTitle}</h3>
      <Notes items={L.logic.map((html) => ({ html }))} more={[4]} />
      <Transfer question={L.transfer} />
      <Recap {...L.recap} />
    </>
  );
}
