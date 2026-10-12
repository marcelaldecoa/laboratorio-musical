import { useEffect, useRef, useState } from 'react';
import { type NoteEvent, later, playNotes, stopAll } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, rangeAround, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Board, Legend, Notes, Seg } from '../components/ui';
import { text } from '../i18n/lessons/lefthand';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import { FUNCTION_OF, type HarmonicFunction, MAJOR_OFFSETS, chordInfo, pcOf, triad, triadSteps } from '../theory';
import { LH_BAR, LH_PATTERNS, type LhPattern, chordTone } from '../theory/piano';
import '../styles/piano.css';

const CH = 'lefthand';
/** I–IV–V–I */
const DEGS = [0, 3, 4, 0];
/** Right-hand melody per bar, as scale degrees from 0 (7+ = an octave up): 3 5 | 6 4 | 9 7 | 8 */
const MEL = [[2, 4], [5, 3], [8, 6], [7]];
const TEMPO = { slow: 60, mid: 84, fast: 108 } as const;
type Tempo = keyof typeof TEMPO;

const FC: Record<HarmonicFunction, [string, string]> = {
  T: ['var(--k-tonic)', 'var(--k-tonic-ink)'],
  SD: ['var(--k-sub)', 'var(--k-sub-ink)'],
  D: ['var(--k-dom)', 'var(--k-dom-ink)'],
};

export function LeftHand() {
  const T = useLessonText(text);
  const { s, nm, keyName, cur, sc } = useLab();
  const [pat, setPat] = useState<LhPattern>('alberti');
  const [tempo, setTempo] = useState<Tempo>('mid');
  const [hands, setHands] = useState<'lh' | 'both'>('both');
  const [bar, setBar] = useState(0);
  const [eighth, setEighth] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const tok = useRef(0);
  useEffect(() => () => { tok.current++; stopAll(); }, []);
  const halt = () => { tok.current++; stopAll(); setPlaying(false); setEighth(-1); };
  useEffect(halt, [pat, tempo, hands, s.k, s.enh]);

  const t0 = pcOf(cur);
  const tp = t0 <= 5 ? t0 : t0 - 12;
  const rootS = (d: number) => tp - 24 + MAJOR_OFFSETS[d];
  const third = (d: number) => triadSteps(chordInfo(sc, d).quality)[0];
  const lhBar = (b: number) =>
    LH_BAR[pat].map((e) => ({ ...e, ss: e.tones.map((tn) => chordTone(rootS(DEGS[b]), third(DEGS[b]), tn)) }));
  const melS = (deg: number) => tp + (deg >= 7 ? 12 : 0) + MAJOR_OFFSETS[deg % 7];
  const melBar = (b: number) => MEL[b].map((deg, i) => ({ deg, s: melS(deg), at: i * (8 / MEL[b].length), len: 8 / MEL[b].length }));

  const allLh = [0, 1, 2, 3].flatMap((b) => lhBar(b).flatMap((e) => e.ss));
  const allRh = [0, 1, 2, 3].flatMap((b) => melBar(b).map((m) => m.s));
  const lay = rangeAround(tp - 24, tp + 14);

  const d = DEGS[bar];
  const fc = FC[FUNCTION_OF[d]];
  const lab = (dd: number) => nm(chordInfo(sc, dd).root) + chordInfo(sc, dd).suffix;
  const marks: Record<number, Mark> = {};
  for (const e of lhBar(bar))
    e.ss.forEach((x, i) => (marks[x] = { fill: fc[0], ink: fc[1], label: e.tones[i], name: nm(triad(sc, d)[{ 1: 0, 3: 1, 5: 2, 8: 0 }[e.tones[i]] ?? 0]) }));
  for (const m of melBar(bar)) marks[m.s] = roleMark(m.s, 'scale', (m.deg % 7) + 1, nm(sc[m.deg % 7]));

  const eDur = 30 / TEMPO[tempo];
  const barEvents = (b: number, base: number): NoteEvent[] => {
    const ev: NoteEvent[] = [];
    for (const e of lhBar(b)) e.ss.forEach((x) => ev.push({ s: x, t: base + e.at * eDur, d: e.len * eDur * 0.95, v: 0.45 }));
    if (hands === 'both') for (const m of melBar(b)) ev.push({ s: m.s, t: base + m.at * eDur, d: m.len * eDur * 0.95, v: 0.7 });
    return ev;
  };
  const run = (bars: number[]) => {
    const my = ++tok.current;
    stopAll();
    setPlaying(true);
    const B = 8 * eDur;
    playNotes(bars.flatMap((b, j) => barEvents(b, j * B)), CH);
    bars.forEach((b, j) => {
      for (let k = 0; k < 8; k++)
        later(() => { if (tok.current === my) { setBar(b); setEighth(k); } }, j * B + k * eDur + 0.05);
    });
    later(() => { if (tok.current === my) { setPlaying(false); setEighth(-1); } }, bars.length * B + 0.2);
  };

  const cells = Array.from({ length: 8 }, (_, k) => lhBar(bar).find((e) => e.at === k));

  // predictions, from the current key
  const tonicLow = -24 + t0;
  const p1Marks: Record<number, Mark> = { [tonicLow]: roleMark(tonicLow, 'tonic', 'I', nm(sc[0])) };
  const vNotes = triad(sc, 4);
  const p2Opts = [...vNotes, sc[0]].map(nm).sort((a, b) => a.localeCompare(b));
  const recap = T.recap(keyName(cur), triad(sc, 0).map(nm), nm(sc[3]), nm(sc[0]));

  return (
    <>
      <p className="desc">{T.desc}</p>
      <Predict mode="key" resetOn={s.k + s.enh} lay={layout(-24, -1)} marks={p1Marks} anyOctave
        answer={[-24 + pcOf(sc[3])]} prompt={T.p1(keyName(cur))} reveal={T.p1Reveal(nm(sc[3]))} />
      <Predict mode="choice" resetOn={s.k + s.enh} options={p2Opts} answer={nm(vNotes[2])}
        prompt={T.p2(lab(4))} reveal={T.p2Reveal(nm(vNotes[2]))} />
      <p className="rowlab">{T.patLabel}</p>
      <div className="chips" role="group" aria-label={T.patLabel}>
        {LH_PATTERNS.map((p) => (
          <button key={p} type="button" className="chip neutral row-chip" aria-pressed={p === pat} onClick={() => setPat(p)}>
            {T.pats[p]}
          </button>
        ))}
      </div>
      <p className="desc">{T.patDesc[pat]}</p>
      <div className="piano-ctrls">
        <Seg label={T.tempoLabel} value={tempo} onChange={setTempo}
          options={(Object.keys(TEMPO) as Tempo[]).map((k) => ({ v: k, label: T.tempos[k] }))} />
        <Seg label={T.handsLabel} value={hands} onChange={setHands}
          options={[{ v: 'lh', label: T.handsOpts.lh }, { v: 'both', label: T.handsOpts.both }]} />
      </div>
      <p className="rowlab mt">{T.chordsLabel}</p>
      <div className="chips timeline" role="group" aria-label={T.chordsLabel}>
        {DEGS.map((dd, i) => (
          <button key={i} type="button" className={'chip f' + FUNCTION_OF[dd] + (i === bar && playing ? ' beat' : '')}
            aria-pressed={i === bar} onClick={() => { halt(); setBar(i); run([i]); }}>
            {chordInfo(sc, dd).roman}<small>{lab(dd)} · {FUNCTION_OF[dd]}</small>
          </button>
        ))}
      </div>
      <div className="bar">
        <span className="now">{T.read(bar + 1, chordInfo(sc, d).roman, lab(d), nm(sc[d]))}</span>
        <button type="button" className={'play' + (playing ? ' on' : '')} onClick={() => (playing ? halt() : run([0, 1, 2, 3]))}>
          <span className="play-ic" aria-hidden="true">{playing ? '■' : '▶'}</span> {playing ? T.stop : T.playAll}
        </button>
      </div>
      <Board>
        <Keyboard lay={lay} marks={marks} top={40} channel={CH} minWidth={560} label={T.kbdAria(keyName(cur), T.pats[pat])}
          ann={(l) => (
            <>
              <text className="ann piano-tag" x={((l.c(Math.min(...allLh)) + l.c(Math.max(...allLh))) / 2).toFixed(1)} y={14} textAnchor="middle">{T.lhTag}</text>
              <text className="ann piano-tag" x={((l.c(Math.min(...allRh)) + l.c(Math.max(...allRh))) / 2).toFixed(1)} y={14} textAnchor="middle">{T.rhTag}</text>
            </>
          )} />
      </Board>
      <Legend items={[
        { color: FC.T[0], label: T.lgT },
        { color: FC.SD[0], label: T.lgSD },
        { color: FC.D[0], label: T.lgD },
        { colors: ['var(--k-scale)', 'var(--k-scaleb)'], label: T.lgRh },
        { label: T.lgNum },
      ]} />
      <p className="rowlab mt">{T.beatsLabel}</p>
      <div className="piano-beats" aria-hidden="true">
        {cells.map((e, k) => (
          <span key={k} className={(k === eighth ? 'on ' : '') + (k % 2 === 0 ? 'strong' : '')}
            style={e ? { background: fc[0], color: fc[1] } : undefined}>
            {e ? e.tones.join('·') : '–'}
          </span>
        ))}
      </div>
      <h3 className="sub-h">{T.logicTitle}</h3>
      <Notes items={T.logic.map((html) => ({ html }))} more={[4]} />
      <Transfer question={T.transfer} />
      <Recap oneLine={recap.oneLine} confusions={recap.confusions} show={recap.show} />
    </>
  );
}
