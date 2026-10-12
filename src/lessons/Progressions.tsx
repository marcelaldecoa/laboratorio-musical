import { useEffect, useRef, useState } from 'react';
import { later, playNotes, stopAll } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Board, Html, Legend, Notes } from '../components/ui';
import { extras } from '../i18n/lessons/extras/prog';
import {
  FUNCTION_OF, PROGRESSIONS, type HarmonicFunction, type Note, chordInfo, commonTones, pcOf, triad, voice,
} from '../theory';
import { setState } from '../state/store';
import { useLab } from '../state/useLab';
import '../styles/harmony.css';

const FC: Record<HarmonicFunction, [string, string]> = {
  T: ['var(--k-tonic)', 'var(--k-tonic-ink)'],
  SD: ['var(--k-sub)', 'var(--k-sub-ink)'],
  D: ['var(--k-dom)', 'var(--k-dom-ink)'],
};

export function Progressions() {
  const { s, t, nm, keyName, cur, sc } = useLab();
  const pi = Math.min(s.pat || 0, PROGRESSIONS.length - 1);
  const P = PROGRESSIONS[pi];
  const degs = P.degrees;
  const idx = s.pi >= 0 && s.pi < degs.length ? s.pi : 0;
  const [playing, setPlaying] = useState(false);
  const tok = useRef(0);
  useEffect(() => () => { tok.current++; stopAll(); }, []);

  const ci = (d: number) => chordInfo(sc, d);
  const lab = (d: number) => nm(ci(d).root) + ci(d).suffix;
  const cn = (a: number, b: number) => commonTones(sc, a, b).map(nm).join(t.and);
  const patName = (id: string) => t.patNames[id] ?? PROGRESSIONS.find((p) => p.id === id)!.degrees.map((d) => ci(d).roman).join('–');

  const vs: number[][] = [];
  let prev: number[] | null = null;
  for (const d of degs) {
    const v = voice(triad(sc, d).map(pcOf), prev);
    vs.push(v);
    prev = v;
  }
  const roots = degs.map((d) => pcOf(sc[d]));
  const v = vs[idx];
  const d = degs[idx];
  const fc = FC[FUNCTION_OF[d]];
  const tri = triad(sc, d);
  const marks: Record<number, Mark> = {};
  if (idx > 0) vs[idx - 1].forEach((p) => { if (!v.includes(p)) marks[p] = { ghost: 'var(--muted)' }; });
  v.forEach((p) => {
    const k = tri.findIndex((n: Note) => pcOf(n) === ((p % 12) + 12) % 12);
    marks[p] = { fill: fc[0], ink: fc[1], label: ['1', '3', '5'][k], name: nm(tri[k]) };
  });
  const c = ci(d);
  let read: string;
  if (idx === 0) read = t.progStart(`${c.roman} (${lab(d)})`, FUNCTION_OF[d]);
  else {
    const d0 = degs[idx - 1];
    const diff = (d - d0 + 7) % 7;
    const cm = commonTones(sc, d0, d);
    read = t.progMove(`${ci(d0).roman} (${lab(d0)})`, `${c.roman} (${lab(d)})`, t.mv[diff], cm.length, cm.map(nm).join(t.and), t.feel[diff]);
  }

  const playAt = (i: number) => {
    playNotes([{ s: roots[i] - 12, t: 0, d: 1.1, v: 0.5 }, ...vs[i].map((p) => ({ s: p, t: 0, d: 1.1, v: 0.5 }))], 'prog');
  };
  const go = (i: number) => {
    tok.current++;
    setPlaying(false);
    stopAll();
    setState({ pi: i });
    playAt(i);
  };
  const playAll = () => {
    if (playing) { tok.current++; stopAll(); setPlaying(false); return; }
    const my = ++tok.current;
    setPlaying(true);
    const D = 1.0;
    vs.forEach((vv, i) => {
      playNotes([{ s: roots[i] - 12, t: i * D, d: D * 0.95, v: 0.5 }, ...vv.map((p) => ({ s: p, t: i * D, d: D * 0.95, v: 0.5 }))], 'prog');
      later(() => { if (tok.current === my) setState({ pi: i }); }, i * D + 0.08);
    });
    later(() => { if (tok.current === my) setPlaying(false); }, vs.length * D + 0.3);
  };

  const fcard = (f: HarmonicFunction, title: string, ds: number[], text: string) => (
    <div className={'fcard f-' + f}>
      <h3><i className="sw" style={{ background: FC[f][0] }} />{f} · {title}</h3>
      <div className="chips">
        {ds.map((dd) => (
          <button key={dd} type="button" className={'chip f' + FUNCTION_OF[dd]} onClick={() => {
            const vv = voice(triad(sc, dd).map(pcOf), null);
            playNotes([{ s: pcOf(sc[dd]) - 12, t: 0, d: 1.2, v: 0.5 }, ...vv.map((p) => ({ s: p, t: 0, d: 1.2, v: 0.5 }))]);
          }}>{ci(dd).roman}<small>{lab(dd)}</small></button>
        ))}
      </div>
      <p>{text}</p>
    </div>
  );

  const x = extras[s.lang];
  const reset = `${s.k}${s.enh}`;
  const pats = { ...t.pats, ...x.pats };
  const vV = voice(triad(sc, 4).map(pcOf), null);
  const vMarks: Record<number, Mark> = {};
  vV.forEach((p, k) => (vMarks[p] = { ...roleMark(p, 'dom', ['1', '3', '5'][k]), name: nm(triad(sc, 4)[k]) }));

  return (
    <>
      <Html as="p" className="desc" html={x.desc} />
      <Predict mode="choice" resetOn={reset} prompt={x.p1(keyName(cur), lab(0))}
        options={[lab(4), lab(5), lab(1)]} answer={lab(5)} reveal={x.p1r(lab(5), lab(0), cn(0, 5))} />
      <div className="fgrid">
        {fcard('T', t.fT, [0, 5, 2], t.fTd(lab(5), lab(2), lab(0), cn(0, 5), cn(0, 2)))}
        {fcard('SD', t.fSD, [3, 1], t.fSDd(lab(1), lab(3), cn(3, 1)))}
        {fcard('D', t.fD, [4, 6], t.fDd(lab(6), lab(4), cn(4, 6), nm(sc[6])))}
      </div>
      <p className="rule">{t.flow}</p>
      <Predict mode="key" resetOn={reset} prompt={x.p2(keyName(cur), lab(4))} lay={layout(0, 23)} marks={vMarks}
        answer={[pcOf(sc[4])]} anyOctave reveal={x.p2r(nm(sc[4]), nm(sc[6]), nm(sc[0]))} />
      <h3 className="sub-h">{t.patTitle}</h3>
      <div className="chips" role="group">
        {PROGRESSIONS.map((p, i) => (
          <button key={p.id} type="button" className="chip neutral row-chip" aria-pressed={i === pi}
            onClick={() => { tok.current++; stopAll(); setPlaying(false); setState({ pat: i, pi: 0 }); }}>
            {patName(p.id)}
          </button>
        ))}
      </div>
      <Html as="p" className="desc" html={pats[P.id]} />
      <p className="rowlab mt">{t.chordsLabel}</p>
      <div className="chips timeline" role="group">
        {degs.map((dd, i) => (
          <button key={i} type="button" className={'chip f' + FUNCTION_OF[dd] + (i === idx && playing ? ' beat' : '')} aria-pressed={i === idx} onClick={() => go(i)}>
            {ci(dd).roman}<small>{lab(dd)} · {FUNCTION_OF[dd]}</small>
          </button>
        ))}
      </div>
      <div className="bar">
        <span className="now">{keyName(cur)} · {idx + 1}/{degs.length}</span>
        <div className="row">
          <div className="nav">
            <button type="button" aria-label="◀" onClick={() => go((idx - 1 + degs.length) % degs.length)}>{t.prevC}</button>
            <button type="button" aria-label="▶" onClick={() => go((idx + 1) % degs.length)}>{t.nextC}</button>
          </div>
          <button type="button" className={'play' + (playing ? ' on' : '')} onClick={playAll}>
            <span className="play-ic" aria-hidden="true">{playing ? '■' : '▶'}</span> {playing ? t.stop : t.playProg}
          </button>
        </div>
      </div>
      <Board><Keyboard lay={layout(0, 23)} marks={marks} channel="prog" label={read} /></Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: t.lgFT },
        { color: 'var(--k-sub)', label: t.lgFSD },
        { color: 'var(--k-dom)', label: t.lgFD },
        { dash: 'var(--muted)', label: t.lgWas },
      ]} />
      <p className="readout">{read}</p>
      <h3 className="sub-h">{t.logicTitle}</h3>
      <Notes items={x.logic.map((html) => ({ html }))} more={[4, 5]} />
      <Transfer question={x.transfer} />
      <Recap {...x.recap} />
    </>
  );
}
