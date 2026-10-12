import { useState } from 'react';
import { chord, later, playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type Mark, type Role, rangeAround, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Bar, Board, Legend, Notes, PlayButton, Seg } from '../components/ui';
import { text } from '../i18n/lessons/consonance';
import { useLessonText } from '../i18n/lessonText';
import { fifthIndex, fromFifthIndex, pcOf, quality } from '../theory';
import { CONS_INTERVALS, type ConsClass, RESOLUTIONS, degreeInterval, degreeSemis, sharedHarmonics } from '../theory/physics';
import { useLab } from '../state/useLab';
import '../styles/physics.css';

const N = 16;
const ROLE: Record<ConsClass, Role> = { perfect: 'tonic', imperfect: 'scale', dissonant: 'chg' };
const BAR: Record<ConsClass, string> = { perfect: 'cons-p', imperfect: 'cons-i', dissonant: 'cons-d' };
const TXT: Record<ConsClass, string> = { perfect: 'q-at', imperfect: 'cons-it', dissonant: 'q-ct' };
/** status of 8ª 5ª 4ª 3ª 6ª 2ª 7ª in each era: p perfect, i imperfect, d dissonant, f dissonance used freely */
const ERAS = ['pppdddd', 'pppiidd', 'ppdiidd', 'pppiiff'];

export function Consonance() {
  const { s, nm, sc, cur } = useLab();
  const x = useLessonText(text);
  const [sel, setSel] = useState('P5');
  const [res, setRes] = useState(2);
  const [after, setAfter] = useState(false);
  const reset = s.k + s.enh + s.lang + s.nt;
  const base = pcOf(cur);
  const f0 = fifthIndex(cur);
  const T = nm(cur);
  const upName = (fifths: number) => nm(fromFifthIndex(f0 + fifths));
  const dyad = (a: number, b: number, t = 0, d = 1.3) => chord([a, b], t, d, 0.55);

  // 1 · spectrum
  const iv = CONS_INTERVALS.find((i) => i.id === sel) ?? CONS_INTERVALS[1];
  const lay = rangeAround(base - 4, base + 14);
  const lay0 = rangeAround(base, base + 12);
  const m1: Record<number, Mark> = {
    [base]: roleMark(base, 'tonic', 1, T),
    [base + iv.semis]: roleMark(base + iv.semis, ROLE[iv.cls], iv.num, upName(iv.fifths)),
  };
  const now1 = x.now(T, upName(iv.fifths), x.long[iv.id], iv.semis, sharedHarmonics(iv.p, iv.q, N).length);
  const pick = (id: string, semis: number) => {
    setSel(id);
    playNotes([{ s: base, t: 0, d: 0.6 }, { s: base + semis, t: 0.5, d: 0.6 }, ...dyad(base, base + semis, 1.1)], 'cons1');
  };
  const playAll = () => playNotes(CONS_INTERVALS.flatMap((i, k) => dyad(base, base + i.semis, k * 1.05, 0.95)), 'cons1');

  // 2 · resolution
  const r = RESOLUTIONS[res];
  const at = (d: number) => base + degreeSemis(d);
  const nd = (d: number) => nm(sc[d % 7]);
  const ivLabel = (a: number, b: number) => {
    const { num, semis } = degreeInterval(a, b);
    return { name: x.ivName(num, x.q[quality(num, semis)]), semis };
  };
  const i1 = ivLabel(r.from[0], r.from[1]);
  const i2 = ivLabel(r.to[0], r.to[1]);
  const lay2 = rangeAround(base, base + 17);
  const m2: Record<number, Mark> = {};
  const shown = after ? r.to : r.from;
  const other = after ? r.from : r.to;
  shown.forEach((d) => (m2[at(d)] = roleMark(at(d), after ? 'tonic' : 'chg', undefined, nd(d))));
  other.forEach((d) => {
    if (!shown.includes(d)) m2[at(d)] = { ghost: 'var(--k-lt-line)', name: nd(d) };
  });
  const cur2 = after ? i2 : i1;
  const read2 = x.resRead(nd(r.from[0]), nd(r.from[1]), i1.name, i1.semis, nd(r.to[0]), nd(r.to[1]), i2.name, i2.semis);
  const playRes = () => {
    setAfter(false);
    playNotes([...dyad(at(r.from[0]), at(r.from[1]), 0, 1.4), ...dyad(at(r.to[0]), at(r.to[1]), 1.5, 1.8)], 'cons2');
    later(() => setAfter(true), 1.5);
  };

  return (
    <>
      <p className="desc">{x.desc}</p>

      <h3 className="sub-h">{x.s1}</h3>
      <Predict mode="key" prompt={x.p1(T)} lay={lay0} answer={[base + 7]} anyOctave resetOn={reset}
        marks={{ [base]: roleMark(base, 'tonic', 1, T), [base + 12]: roleMark(base + 12, 'tonic', 8, T) }}
        reveal={x.p1Rev(upName(1), T)} />
      <p className="desc">{x.s1d(T)}</p>
      <div className="census">
        {CONS_INTERVALS.map((i) => {
          const sh = sharedHarmonics(i.p, i.q, N);
          return (
            <button key={i.id} type="button" className="crow phys-crow" aria-pressed={i.id === sel} onClick={() => pick(i.id, i.semis)}>
              <span>{x.short[i.id]} <small className="phys-r">{i.p}:{i.q}</small></span>
              <span className="phys-cbar" aria-hidden="true">
                {Array.from({ length: N }, (_, k) => <i key={k} className={sh.includes(k + 1) ? BAR[i.cls] : ''} />)}
              </span>
              <span className={'cq ' + TXT[i.cls]}>{x.clsShort[i.cls]}</span>
            </button>
          );
        })}
      </div>
      <Bar now={now1}>
        <PlayButton label={x.playOne} seconds={2.4} onPlay={() => pick(iv.id, iv.semis)} />
        <PlayButton label={x.playAll} seconds={12.6} onPlay={playAll} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={m1} top={50} channel="cons1" label={now1}
          ann={(l) => <Bracket lay={l} a={base} b={base + iv.semis} y={22} label={x.bracket(x.short[iv.id], iv.semis)} />} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: x.lgP }, { color: 'var(--k-scale)', label: x.lgI }, { color: 'var(--k-chg)', label: x.lgD },
      ]} />

      <h3 className="sub-h">{x.s2}</h3>
      <Predict mode="key" prompt={x.p2(nd(3), nd(6))} lay={rangeAround(base, base + 12)} answer={[base + 12]} anyOctave resetOn={reset}
        marks={{ [at(3)]: roleMark(at(3), 'chg', 4, nd(3)), [at(6)]: roleMark(at(6), 'chg', 7, nd(6)) }}
        reveal={x.p2Rev(nd(0), nd(3), nd(2), nd(6))} />
      <p className="desc">{x.s2d}</p>
      <p className="rowlab">{x.resPick}</p>
      <div className="chips" role="group" aria-label={x.resPick}>
        {RESOLUTIONS.map((rr, k) => (
          <button key={rr.id} type="button" className="chip neutral" aria-pressed={k === res} onClick={() => { setRes(k); setAfter(false); }}>
            {x.resNames[rr.id]}
          </button>
        ))}
      </div>
      <div className="bar">
        <Seg value={after ? 1 : 0} onChange={(v) => setAfter(v === 1)} options={[{ v: 0, label: x.before }, { v: 1, label: x.after }]} />
        <div className="row"><PlayButton label={x.playRes} seconds={3.3} onPlay={playRes} /></div>
      </div>
      <Board>
        <Keyboard lay={lay2} marks={m2} top={50} channel="cons2" label={read2}
          ann={(l) => <Bracket lay={l} a={at(shown[0])} b={at(shown[1])} y={22} label={x.bracket(cur2.name, cur2.semis)} />} />
      </Board>
      <Legend items={after
        ? [{ color: 'var(--k-tonic)', label: x.lgRest }, { dash: 'var(--k-lt-line)', label: x.lgWas }]
        : [{ color: 'var(--k-chg)', label: x.lgTense }, { dash: 'var(--k-lt-line)', label: x.lgGo }]} />
      <p className="readout">{read2}</p>
      <p className="hint">{x.resWhy[r.id]}</p>

      <h3 className="sub-h">{x.s3}</h3>
      <p className="desc">{x.s3d}</p>
      <div className="phys-eras">
        {x.eras.map((era, k) => (
          <div key={k} className="fcard">
            <h3>{era.t}</h3>
            <div className="phys-ivs">
              {x.ivRow.map((n, j) => <span key={j} className={'phys-iv ' + ERAS[k][j]}>{n}</span>)}
            </div>
            <p>{era.d}</p>
          </div>
        ))}
      </div>
      <Legend items={[
        { color: 'var(--k-tonic)', label: x.lgP }, { color: 'var(--k-scale)', label: x.lgI },
        { color: 'var(--k-chg)', label: x.lgD }, { dash: 'var(--k-chg)', label: x.lgFree },
      ]} />

      <h3 className="sub-h">{x.why}</h3>
      <Notes items={x.notes.map((html) => ({ html }))} more={x.more} />
      <Transfer question={x.transfer} />
      <Recap {...x.recap} />
    </>
  );
}
