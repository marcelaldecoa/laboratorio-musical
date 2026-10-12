import { useState } from 'react';
import { playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark, stepsFor } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Bar, Board, Html, Legend, Notes, PlayButton } from '../components/ui';
import { text } from '../i18n/lessons/intq';
import { useLessonText } from '../i18n/lessonText';
import { census, pcOf, quality } from '../theory';
import { degreeSemis } from '../theory/physics';
import { useLab } from '../state/useLab';

const QC: Record<string, string> = { P: 'q-a', M: 'q-a', m: 'q-b', A: 'q-c', d: 'q-c' };

export function IntervalQuality() {
  const { s, t, nm, sc, cur, keyName } = useLab();
  const x = useLessonText(text);
  const [g, setG] = useState(3);
  const [r, setR] = useState(0);
  const reset = s.k + s.enh + s.lang + s.nt;
  const base = pcOf(cur);
  const at = (d: number) => base + degreeSemis(d);
  const nd = (d: number) => nm(sc[d % 7]);
  const scaleKeys = [0, 1, 2, 3, 4, 5, 6, 7].map(at);
  const lay = rangeAround(base, base + 12);
  const ivName = (num: number, semis: number) => x.ivName(num, x.q[quality(num, semis)]);
  const two = (a: number, b: number) => [
    { s: a, t: 0, d: 0.6 }, { s: b, t: 0.55, d: 0.6 }, { s: a, t: 1.2, d: 1.3, v: 0.55 }, { s: b, t: 1.2, d: 1.3, v: 0.55 },
  ];

  // 1 · two thirds
  const m1: Record<number, Mark> = {};
  scaleKeys.forEach((k, i) => (m1[k] = roleMark(k, 'scale', i === 7 ? 8 : i + 1, nd(i))));
  m1[at(0)] = roleMark(at(0), 'tonic', 1, nd(0));
  m1[at(2)] = roleMark(at(2), 'tonic', 3, nd(2));
  m1[at(1)] = roleMark(at(1), 'sub', 2, nd(1));
  m1[at(3)] = roleMark(at(3), 'sub', 4, nd(3));

  // 2 · census
  const stp = g - 1;
  const rows = census(g);
  const size = rows[r].semis;
  const p0 = at(r);
  const m2: Record<number, Mark> = {};
  const pts: number[] = [];
  for (let k = 0; k <= stp; k++) {
    const p = at(r + k);
    pts.push(p);
    m2[p] = roleMark(p, k === 0 || k === stp ? 'tonic' : 'scale', k + 1, nd(r + k));
  }
  const now = x.now(nd(r), nd(r + stp), g, size, ivName(g, size));
  const m2p: Record<number, Mark> = {};
  scaleKeys.forEach((k, i) => (m2p[k] = roleMark(k, i === 0 || i === 7 ? 'tonic' : 'scale', i === 7 ? 8 : i + 1, nd(i))));

  // 3 · the reference: the major scale from the tonic
  const m3: Record<number, Mark> = {};
  scaleKeys.forEach((k, i) => (m3[k] = roleMark(k, i === 0 ? 'tonic' : 'scale', x.ref[i], nd(i))));

  return (
    <>
      <p className="desc">{x.desc}</p>

      <h3 className="sub-h">{x.s1}</h3>
      <Predict mode="choice" prompt={x.p1(nd(0), nd(2), nd(1), nd(3))} options={x.p1Opts} answer={x.p1Opts[1]}
        reveal={x.p1Rev(nd(1), nd(3), nd(2))} resetOn={reset} />
      <p className="desc">{x.s1d}</p>
      <Bar>
        <PlayButton label={x.playMaj} seconds={2.5} onPlay={() => playNotes(two(at(0), at(2)), 'intq1')} />
        <PlayButton label={x.playMin} seconds={2.5} onPlay={() => playNotes(two(at(1), at(3)), 'intq1')} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={m1} top={76} channel="intq1" steps={stepsFor(scaleKeys, t.W, t.H)} label={`${x.big(nd(0), nd(2))} · ${x.small(nd(1), nd(3))}`}
          ann={(l) => (<>
            <Bracket lay={l} a={at(0)} b={at(2)} y={50} label={x.big(nd(0), nd(2))} />
            <Bracket lay={l} a={at(1)} b={at(3)} y={20} label={x.small(nd(1), nd(3))} />
          </>)} />
      </Board>
      <Legend items={[{ color: 'var(--k-tonic)', label: x.lgMaj }, { color: 'var(--k-sub)', label: x.lgMin }, { color: 'var(--change)', label: x.lgShort }]} />

      <h3 className="sub-h">{x.s2}</h3>
      <Predict mode="key" prompt={x.p2(keyName(cur))} lay={lay} marks={m2p} answer={[at(6)]} anyOctave
        reveal={x.p2Rev(nd(6), nd(3))} resetOn={reset} />
      <p className="desc">{x.s2d}</p>
      <p className="rowlab">{x.pick}</p>
      <div className="chips" role="group" aria-label={x.pick}>
        {[2, 3, 4, 5, 6, 7, 8].map((n) => (
          <button key={n} type="button" className="chip neutral" aria-pressed={n === g} onClick={() => setG(n)}>{x.ord(n)}</button>
        ))}
      </div>
      <div className="census">
        {rows.map((row) => (
          <button key={row.from} type="button" className="crow" aria-pressed={row.from === r} onClick={() => {
            setR(row.from);
            playNotes(two(at(row.from), at(row.from) + row.semis), 'intq2');
          }}>
            <span>{nd(row.from)}–{nd(row.from + stp)}</span>
            <span className="cbar" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => <i key={i} className={i < row.semis ? QC[row.quality] : ''} />)}
            </span>
            <span className={'cq ' + QC[row.quality] + 't'}>{row.semis} · {x.q[row.quality]}</span>
          </button>
        ))}
      </div>
      <Bar now={now}><PlayButton label={x.playInt} seconds={2.5} onPlay={() => playNotes(two(p0, p0 + size), 'intq2')} /></Bar>
      <Board>
        <Keyboard lay={rangeAround(p0, p0 + 12)} marks={m2} steps={stepsFor(pts, t.W, t.H)} top={50} channel="intq2" label={now}
          ann={(l) => <Bracket lay={l} a={p0} b={p0 + size} y={22} label={`${size} ${x.steps}`} />} />
      </Board>
      <Html as="p" className="readout" html={x.inv(nd(r + stp), nd(r), ivName(9 - g, 12 - size), 12 - size, g, 9 - g, size)} />

      <h3 className="sub-h">{x.s3}</h3>
      <p className="desc">{x.s3d}</p>
      <Board>
        <Keyboard lay={lay} marks={m3} channel="intq3" label={x.refRead}
          onKey={(k) => playNotes(k === base ? [{ s: k, t: 0, d: 1 }] : two(base, k), 'intq3')} />
      </Board>
      <Legend items={[{ color: 'var(--k-tonic)', label: x.lgTonic }, { color: 'var(--k-scale)', label: x.lgRef }]} />
      <p className="readout">{x.refRead}</p>
      <ol className="recipe">{x.rules.map((h, i) => <Html as="li" key={i} html={h} />)}</ol>

      <h3 className="sub-h">{x.why}</h3>
      <Notes items={x.notes.map((html) => ({ html }))} more={x.more} />
      <Transfer question={x.transfer} />
      <Recap {...x.recap} />
    </>
  );
}
