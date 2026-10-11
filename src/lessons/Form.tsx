import { useEffect, useRef, useState } from 'react';
import { type NoteEvent, later, playNotes, stopAll } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { MelodyRoll, type RollBar, type RollNote } from '../components/MelodyRoll';
import { type Mark, layout } from '../components/layout';
import { Board, Legend, Notes, Seg } from '../components/ui';
import { text } from '../i18n/lessons/form';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import { FUNCTION_OF, chordInfo, mod, pcOf, triad } from '../theory';
import {
  BEATS, ENDINGS, type Ending, FORMS, type FormId, QUESTION, SECTIONS, type SectionKind, answer, cadenceOf, degreeOf,
  fitBase, groupRange, period, stepSemi, tuneBeats,
} from '../theory/melody';
import { FN_KEY, FN_SOFT, chordBelow, tuneEvents } from './melodyShared';
import '../styles/melody.css';

const Q = 0.36;
const KIND_COL: Record<SectionKind, [string, string]> = {
  A: ['var(--accent-soft)', 'var(--accent-ink)'],
  B: ['var(--flat-soft)', 'var(--flat-ink)'],
  C: ['var(--dom-soft)', 'var(--dom-ink)'],
};

export function Form() {
  const { nm, sc, cur } = useLab();
  const L = useLessonText(text);
  const [ending, setEnding] = useState<Ending>('authentic');
  const [show, setShow] = useState<'q' | 'a'>('a');
  const [form, setForm] = useState<FormId>('aaba');
  const [sel, setSel] = useState(-1);
  const [part, setPart] = useState(-1);
  const [playing, setPlaying] = useState<'' | 'q' | 'a' | 'both' | 'form' | 'part'>('');
  const tok = useRef(0);
  useEffect(() => () => { tok.current++; stopAll(); }, []);

  const base = fitBase(cur, -1, 9);
  const per = period(ending);
  const qLen = QUESTION.notes.length;
  const ci = (d: number) => chordInfo(sc, d);
  const lab = (d: number) => nm(ci(d).root) + ci(d).suffix;
  const rom = (d: number) => `${ci(d).roman} (${lab(d)})`;

  const stop = () => { tok.current++; stopAll(); setPlaying(''); setSel(-1); setPart(-1); };
  const run = (kind: 'q' | 'a' | 'both') => {
    if (playing) { stop(); return; }
    const my = ++tok.current;
    const tune = kind === 'q' ? QUESTION : kind === 'a' ? answer(ending) : per;
    const off = kind === 'a' ? qLen : 0;
    const { ev, starts } = tuneEvents(tune, sc, base, Q);
    setPlaying(kind);
    playNotes(ev, 'form');
    starts.forEach((t, j) => later(() => { if (tok.current === my) setSel(j + off); }, t + 0.05));
    later(() => { if (tok.current === my) { setPlaying(''); setSel(-1); } }, tuneBeats(tune) * Q + 0.4);
  };
  const playParts = (idx: number[]) => {
    const my = ++tok.current;
    stopAll();
    const parts = FORMS.find((f) => f.id === form)!.parts;
    const ev: NoteEvent[] = [];
    let t0 = 0;
    idx.forEach((pi) => {
      const sec = SECTIONS[parts[pi]];
      ev.push(...tuneEvents(sec, sc, base, Q, t0).ev);
      const at = t0;
      later(() => { if (tok.current === my) setPart(pi); }, at + 0.05);
      t0 += tuneBeats(sec) * Q;
    });
    setPlaying(idx.length > 1 ? 'form' : 'part');
    playNotes(ev, 'form');
    later(() => { if (tok.current === my) { setPlaying(''); setPart(-1); } }, t0 + 0.4);
  };

  // roll: plain notes in light green, the last note of each phrase in its cadence color
  const starts: number[] = [];
  per.notes.reduce((t, n) => { starts.push(t); return t + n.dur; }, 0);
  const qEnd = cadenceOf(QUESTION);
  const aEnd = cadenceOf(answer(ending));
  const rollNotes: RollNote[] = per.notes.map((n, j) => {
    const last = j === qLen - 1 ? qEnd : j === per.notes.length - 1 ? aEnd : null;
    const f = last ? FN_KEY[last.fn] : (['var(--k-scale)', 'var(--k-scale-ink)'] as [string, string]);
    return { i: n.i, start: starts[j], dur: n.dur, fill: f[0], ink: f[1], label: last ? '♪' : undefined };
  });
  const bars: RollBar[] = per.chords.map((d) => {
    const f = FN_SOFT[FUNCTION_OF[d]];
    return { label: ci(d).roman, fill: f[0], ink: f[1] };
  });
  const mark = (e: Ending | 'q') => (e === 'q' || e === 'half' ? ',' : e === 'authentic' ? '.' : '…');
  const BW = 12;
  const ann = (x: (b: number) => number, bottom: number) => {
    const y = bottom + 10;
    const half = 4 * BEATS;
    return (
      <g>
        {[[0, L.question], [half, L.answer]].map(([b0, name]) => {
          const a = x(b0 as number) + 3;
          const b = x((b0 as number) + half) - 3;
          return (
            <g key={name as string}>
              <path d={`M${a} ${y - 6} V${y} H${b} V${y - 6}`} fill="none" stroke="var(--muted)" strokeWidth={1.2} />
              <text className="mel-ann" x={(a + b) / 2} y={y + 15} textAnchor="middle">{`${name as string} · ${L.bars4}`}</text>
            </g>
          );
        })}
        <text className="mel-mark" x={x(half) - 2} y={34} textAnchor="end">{mark('q')}</text>
        <text className="mel-mark" x={x(2 * half) - 2} y={34} textAnchor="end">{mark(ending)}</text>
      </g>
    );
  };

  // keyboard: the cadence chord (function color, 1 3 5) and the melody's last note on top
  const end = show === 'q' ? qEnd : aEnd;
  const lastI = show === 'q' ? QUESTION.notes[qLen - 1].i : per.notes[per.notes.length - 1].i;
  const top = stepSemi(base, lastI);
  const marks: Record<number, Mark> = {};
  const tri = triad(sc, end.chord);
  const fk = FN_KEY[end.fn];
  chordBelow(sc, end.chord, base).forEach((s) => {
    const m = tri.findIndex((n) => pcOf(n) === mod(s, 12));
    marks[s] = { fill: fk[0], ink: fk[1], label: ['1', '3', '5'][m], name: nm(tri[m]) };
  });
  marks[top] = { fill: fk[0], ink: fk[1], label: '♪', name: nm(sc[degreeOf(lastI)]) };
  if (show === 'a' && ending !== 'half') {
    const was = stepSemi(base, QUESTION.notes[qLen - 1].i);
    marks[was] = { ...marks[was], ghost: 'var(--muted)' };
  }
  const [from, to] = groupRange([base - 12, base + 11, top]);
  const v = rom(4);
  const read = show === 'q'
    ? L.qRead(v, nm(sc[1]))
    : L.endRead[ending](v, rom(0), nm(sc[0]), nm(sc[1]), rom(5));

  const F = FORMS.find((f) => f.id === form)!;

  return (
    <>
      <p className="desc">{L.desc}</p>
      <h3 className="sub-h">{L.stepsTitle}</h3>
      <ol className="mel-steps">{L.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>

      <p className="rowlab">{L.endLabel}</p>
      <div className="mel-tools">
        <Seg value={ending} label={L.endLabel} onChange={(e) => { stop(); setEnding(e); setShow('a'); }}
          options={ENDINGS.map((e) => ({ v: e, label: L.endName[e] }))} />
      </div>
      <p className="rowlab">{L.rollLabel}</p>
      <Board>
        <MelodyRoll notes={rollNotes} bars={bars} beatW={BW} selected={sel} foot={30} ann={ann} label={L.rollLabel} />
      </Board>
      <div className="bar">
        <span className="now">{L.endName[ending]}</span>
        <div className="row">
          {(['q', 'a', 'both'] as const).map((k) => (
            <button key={k} type="button" className={'play' + (playing === k ? ' on' : '')} onClick={() => run(k)}>
              <span className="play-ic" aria-hidden="true">{playing === k ? '■' : '▶'}</span>
              {playing === k ? L.stop : k === 'q' ? L.playQ : k === 'a' ? L.playA : L.playBoth}
            </button>
          ))}
        </div>
      </div>
      <p className="rowlab">{L.showLabel}</p>
      <div className="mel-tools">
        <Seg value={show} label={L.showLabel} onChange={setShow} options={[{ v: 'q', label: L.showQ }, { v: 'a', label: L.showA }]} />
      </div>
      <Board>
        <Keyboard lay={layout(from, to)} marks={marks} channel="form" label={L.keyLabel(rom(end.chord), nm(sc[degreeOf(lastI)]))} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: L.lgT },
        { color: 'var(--k-dom)', label: L.lgD },
        { color: 'var(--k-scale)', label: L.lgScale },
        { dash: 'var(--muted)', label: L.lgWas },
      ]} />
      <p className="readout">{read}</p>

      <h3 className="sub-h">{L.formTitle}</h3>
      <p className="desc">{L.formDesc}</p>
      <p className="rowlab">{L.formLabel}</p>
      <div className="mel-tools">
        <Seg value={form} label={L.formLabel} onChange={(f) => { stop(); setForm(f); }}
          options={FORMS.map((f) => ({ v: f.id, label: L.formName[f.id] }))} />
      </div>
      <div className="mel-form" role="group" aria-label={L.formName[form]}>
        {F.parts.map((k, i) => (
          <button key={i} type="button" className={'mel-block' + (i === part ? ' on' : '')}
            style={{ background: KIND_COL[k][0], color: KIND_COL[k][1] }}
            onClick={() => { if (playing === 'form' || playing === 'part') stop(); playParts([i]); }}>
            <b>{k}</b>
            <small>{L.partName[form][k]}</small>
          </button>
        ))}
      </div>
      <Legend items={(['A', 'B', 'C'] as const).filter((k) => F.parts.includes(k)).map((k) => ({ color: KIND_COL[k][0], label: L.kindName[k] }))} />
      <p className="hint mt">{L.tapBlock}</p>
      <div className="bar">
        <span className="now">{F.parts.join(' ')}</span>
        <div className="row">
          <button type="button" className={'play' + (playing === 'form' ? ' on' : '')}
            onClick={() => (playing ? stop() : playParts(F.parts.map((_, i) => i)))}>
            <span className="play-ic" aria-hidden="true">{playing === 'form' ? '■' : '▶'}</span> {playing === 'form' ? L.stop : L.playForm}
          </button>
        </div>
      </div>
      <p className="readout">{L.formRead[form]}</p>

      <h3 className="sub-h">{L.logicTitle}</h3>
      <Notes items={L.logic.map((html) => ({ html }))} />
    </>
  );
}
