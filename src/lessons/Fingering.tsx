import { useEffect, useRef, useState } from 'react';
import { later, playNotes, stopAll } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type KeyLayout, type Mark, rangeAround, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Board, Legend, Notes, Seg } from '../components/ui';
import { text } from '../i18n/lessons/fingering';
import { useLessonText } from '../i18n/lessonText';
import { setState } from '../state/store';
import { useLab } from '../state/useLab';
import { displayed, pcOf, sameNote, scaleSemitones } from '../theory';
import { type Hand, type ScaleDir, crossings, handPositions, scaleFingering } from '../theory/piano';
import '../styles/piano.css';

const CH = 'fingering';

/** Curved arrow above the keys from one key to another (a crossing). */
function CrossArrow({ lay, a, b, y, label }: { lay: KeyLayout; a: number; b: number; y: number; label: string }) {
  const x1 = lay.c(a);
  const x2 = lay.c(b);
  const cx = (x1 + x2) / 2;
  const cy = y - 30;
  const dx = x2 - cx;
  const dy = y - cy;
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  const tip = `${x2},${y}`;
  const p1 = `${(x2 - ux * 8 - uy * 4.5).toFixed(1)},${(y - uy * 8 + ux * 4.5).toFixed(1)}`;
  const p2 = `${(x2 - ux * 8 + uy * 4.5).toFixed(1)},${(y - uy * 8 - ux * 4.5).toFixed(1)}`;
  return (
    <g>
      <path d={`M${x1.toFixed(1)} ${y} Q${cx.toFixed(1)} ${cy} ${x2.toFixed(1)} ${y}`} fill="none" stroke="var(--change)" strokeWidth={2} />
      <polygon points={`${tip} ${p1} ${p2}`} fill="var(--change)" />
      <text className="ann piano-cross" x={cx.toFixed(1)} y={y - 25} textAnchor="middle">{label}</text>
    </g>
  );
}

export function Fingering() {
  const T = useLessonText(text);
  const { s, nm, keyName, cur, sc } = useLab();
  const [hand, setHand] = useState<Hand>('rh');
  const [dir, setDir] = useState<ScaleDir>('up');
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const tok = useRef(0);
  useEffect(() => () => { tok.current++; stopAll(); }, []);
  useEffect(() => { tok.current++; setPlaying(false); setStep(-1); }, [hand, dir, s.k, s.enh]);

  const fing = scaleFingering(cur);
  const f = fing[hand];
  const ks = scaleSemitones(pcOf(cur) - (hand === 'lh' ? 12 : 0));
  const order = dir === 'up' ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
  const cross = crossings(f, hand, dir);
  const groups = handPositions(f, hand);
  const lay = rangeAround(ks[0], ks[7]);

  const marks: Record<number, Mark> = {};
  ks.forEach((k, i) => (marks[k] = roleMark(k, i % 7 === 0 ? 'tonic' : 'scale', f[i], nm(sc[i % 7]))));
  const cur8 = step >= 0 ? order[step] : -1;
  const nxt = step >= 0 && step < 7 ? order[step + 1] : step < 0 ? order[0] : -1;
  if (nxt >= 0) marks[ks[nxt]] = { ...marks[ks[nxt]], ghost: 'var(--k-lt-line)' };

  const playOne = (i: number) => playNotes([{ s: ks[i], t: 0, d: 0.9 }], CH);
  const go = (st: number) => {
    tok.current++;
    setPlaying(false);
    stopAll();
    const v = Math.max(0, Math.min(7, st));
    setStep(v);
    playOne(order[v]);
  };
  const playAll = () => {
    if (playing) { tok.current++; stopAll(); setPlaying(false); return; }
    const my = ++tok.current;
    stopAll();
    setPlaying(true);
    const gap = 0.5;
    playNotes(order.map((i, j) => ({ s: ks[i], t: j * gap, d: 0.6 })), CH);
    order.forEach((_, j) => later(() => { if (tok.current === my) setStep(j); }, j * gap + 0.05));
    later(() => { if (tok.current === my) setPlaying(false); }, 8 * gap + 0.3);
  };

  let read = T.idle;
  if (cur8 >= 0) {
    read = T.stepRead(step + 1, nm(sc[cur8 % 7]), f[cur8]);
    const c = cross.find((x) => x.from === cur8);
    if (c) read += c.kind === 'under' ? T.under : T.over(f[c.to]);
  }

  const thumbs = f.map((x, i) => (x === 1 ? i : -1)).filter((i) => i >= 0).map((i) => nm(sc[i % 7]));
  const fmt = (ff: number[], h: Hand) => handPositions(ff, h).map((g) => g.map((i) => ff[i]).join('')).join(' ');

  const seen = new Set<string>();
  const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].flatMap((k) => {
    const ns = k === 6 ? [displayed(6, 'Fs'), displayed(6, 'Gb')] : [displayed(k, 'Fs')];
    return ns.map((n) => ({ k, n }));
  }).filter(({ n }) => {
    const key = nm(n);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // predictions (always right hand / left hand going up, from the current key)
  const ksR = scaleSemitones(pcOf(cur));
  const crossR = crossings(fing.rh, 'rh', 'up');
  const p1Marks: Record<number, Mark> = {};
  ksR.forEach((k, i) => (p1Marks[k] = roleMark(k, i % 7 === 0 ? 'tonic' : 'scale', i === 0 ? fing.rh[0] : undefined, nm(sc[i % 7]))));
  const lhThumb = fing.lh.findIndex((x, i) => x === 1 && i < 7);
  const lhNext = fing.lh[lhThumb + 1];
  const N = (letter: number, acc = 0) => nm({ letter, acc });
  const recap = T.recap({ d: N(1), a: N(5), f: N(3), g: N(4), la: N(5), bb: N(6, -1), c: N(0) });

  return (
    <>
      <p className="desc">{T.desc}</p>
      <Predict mode="key" resetOn={s.k + s.enh} lay={rangeAround(ksR[0], ksR[7])} marks={p1Marks}
        answer={crossR.map((c) => ksR[c.to])}
        prompt={T.p1(keyName(cur), nm(cur), fing.rh[0])}
        reveal={T.p1Reveal(crossR.map((c) => T.via(nm(sc[c.to % 7]), fing.rh[c.from], nm(sc[c.from % 7]))).join(T.and))} />
      <Predict mode="choice" resetOn={s.k + s.enh} options={['1', '2', '3', '4', '5']} answer={String(lhNext)}
        prompt={T.p2(keyName(cur), nm(sc[lhThumb % 7]), nm(sc[(lhThumb + 1) % 7]))}
        reveal={T.p2Reveal(lhNext)} />
      <div className="piano-ctrls">
        <Seg label={T.handLabel} value={hand} onChange={setHand}
          options={[{ v: 'rh', label: T.hands.rh }, { v: 'lh', label: T.hands.lh }]} />
        <Seg label={T.dirLabel} value={dir} onChange={setDir}
          options={[{ v: 'up', label: T.dirs.up }, { v: 'down', label: T.dirs.down }]} />
      </div>
      <div className="bar">
        <span className="now">{keyName(cur)} · {T.hands[hand]}</span>
        <div className="row">
          <div className="nav">
            <button type="button" onClick={() => go(step - 1)} disabled={step <= 0}>{T.prev}</button>
            <button type="button" onClick={() => go(step + 1)} disabled={step >= 7}>{T.next}</button>
          </div>
          <button type="button" className={'play' + (playing ? ' on' : '')} onClick={playAll}>
            <span className="play-ic" aria-hidden="true">{playing ? '■' : '▶'}</span> {playing ? T.stop : T.playScale}
          </button>
        </div>
      </div>
      <Board>
        <Keyboard lay={lay} marks={marks} top={92} channel={CH} maxScale={1.5} label={T.kbdAria(keyName(cur), T.hands[hand])}
          ann={(l) => (
            <>
              {groups.map((g, i) => (
                <Bracket key={'g' + i} lay={l} a={ks[g[0]]} b={ks[g[g.length - 1]]} y={22} label={g.map((j) => f[j]).join('-')} />
              ))}
              {cross.map((c, i) => (
                <CrossArrow key={'c' + i} lay={l} a={ks[c.from]} b={ks[c.to]} y={70} label={`${f[c.from]}→${f[c.to]}`} />
              ))}
            </>
          )} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: T.lgTonic },
        { colors: ['var(--k-scale)', 'var(--k-scaleb)'], label: T.lgScale },
        { label: T.lgNum },
        { color: 'var(--change)', label: T.lgCross },
        { dash: 'var(--k-lt-line)', label: T.lgNext },
        { label: T.lgGroup },
      ]} />
      <p className="readout" aria-live="polite">{read}</p>
      <p className="readout">{T.formula(fmt(fing.rh, 'rh'), fmt(fing.lh, 'lh'))}</p>

      <h3 className="sub-h">{T.tableTitle}</h3>
      <p className="hint">{T.tableHint}</p>
      <div className="piano-ftable" role="table">
        <div className="piano-frow head" role="row">
          <span role="columnheader">{T.colKey}</span>
          <span role="columnheader">{T.colRh}</span>
          <span role="columnheader">{T.colLh}</span>
        </div>
        {rows.map(({ k, n }) => {
          const fi = scaleFingering(n);
          const on = sameNote(n, cur);
          return (
            <button key={nm(n)} type="button" role="row" className="piano-frow" aria-pressed={on}
              onClick={() => setState(k === 6 ? { k, enh: n.acc < 0 ? 'Gb' : 'Fs' } : { k })}>
              <span role="cell">{nm(n)}</span>
              <span role="cell">{fmt(fi.rh, 'rh')}</span>
              <span role="cell">{fmt(fi.lh, 'lh')}</span>
            </button>
          );
        })}
      </div>

      <h3 className="sub-h">{T.logicTitle}</h3>
      <Notes items={[
        { html: T.thumbs(T.hands[hand].toLowerCase(), thumbs[0], thumbs[1]) },
        { html: T.groups },
        { html: T.blacks },
        { color: 'var(--change)', html: T.exceptions },
        { html: T.mirror },
        { html: T.history },
      ]} more={[4, 5]} />
      <Transfer question={T.transfer} />
      <Recap oneLine={recap.oneLine} confusions={recap.confusions} show={recap.show} />
    </>
  );
}
