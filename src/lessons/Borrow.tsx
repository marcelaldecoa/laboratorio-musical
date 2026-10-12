import { useState } from 'react';
import { playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { MotionFifthsLine, type FifthsCell } from '../components/MotionFifthsLine';
import { MotionProgression, type ProgChord, type ProgTone } from '../components/MotionProgression';
import { Bar, Board, Html, Legend, Notes, PlayButton } from '../components/ui';
import { FUNCTION_OF, type Note, chordInfo, fifthIndex, fromFifthIndex, pcOf } from '../theory';
import {
  BORROW_IDS, type BorrowId, SUFFIX, borrowedChord, closeVoicing, diatonicTriad, hasDouble, inScale, naturalMinor, qualityOf, simpler,
} from '../theory/harmony';
import { text } from '../i18n/lessons/borrow';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import '../styles/motion.css';

const PROGS: { id: string; seq: (number | BorrowId)[] }[] = [
  { id: 'amen', seq: [0, 3, 'iv', 0] },
  { id: 'rock', seq: [0, 'bVII', 3, 0] },
  { id: 'epic', seq: [0, 'bVI', 'bVII', 0] },
];

export function Borrow() {
  const { s, nm, keyName, cur, sc } = useLab();
  const t = useLessonText(text);
  const [id, setId] = useState<BorrowId>('iv');
  const [pi, setPi] = useState(0);
  const sym = (ns: Note[]) => nm(ns[0]) + SUFFIX[qualityOf(ns)];
  const majName = t.major(nm(cur));
  const minName = t.minor(nm(cur));
  const minor = naturalMinor(cur);
  const b = borrowedChord(cur, id);
  const cRoman = chordInfo(sc, b.degree).roman;

  /* line of fifths: major window and the parallel minor's window, 3 steps to the left */
  const f0 = fifthIndex(sc[3]);
  const cells: Record<number, FifthsCell> = {};
  sc.forEach((n) => (cells[fifthIndex(n)] = inScale(minor, n)
    ? { fill: 'var(--k-scale)', ink: 'var(--k-scale-ink)' }
    : { stroke: 'var(--muted)', dash: true, ink: 'var(--muted)' }));
  [2, 5, 6].forEach((d) => (cells[fifthIndex(minor[d])] = { fill: 'var(--k-lt)', ink: 'var(--k-lt-ink)', sub: '♭' + (d + 1) }));
  cells[fifthIndex(cur)] = { ...cells[fifthIndex(cur)], sub: '1' };

  /* keyboard: the borrowed chord, with a dashed key where the major note was */
  const v = closeVoicing(b.notes.map(pcOf), null, 0, 23, 9);
  const marks: Record<number, Mark> = {};
  v.forEach((s) => {
    const k = b.notes.findIndex((n) => ((pcOf(n) - s) % 12 + 12) % 12 === 0);
    if (b.changed[k]) marks[s + 1] = { ghost: 'var(--k-lt-line)' };
  });
  v.forEach((s) => {
    const k = b.notes.findIndex((n) => ((pcOf(n) - s) % 12 + 12) % 12 === 0);
    const hot = b.changed[k];
    marks[s] = { fill: hot ? 'var(--k-lt)' : 'var(--k-sub)', ink: hot ? 'var(--k-lt-ink)' : 'var(--k-sub-ink)', label: ['1', '3', '5'][k], name: nm(b.notes[k]) };
  });
  const changedNames = b.notes.filter((_, i) => b.changed[i]).map((n) => {
    const was = b.counterpart.find((x) => x.letter === n.letter)!;
    return `${nm(was)} → ${nm(n)}`;
  }).join(', ');
  const read = t.read(b.roman, sym(b.notes), b.notes.map(nm).join(' '), changedNames, cRoman, sym(b.counterpart));

  const playChord = (ns: Note[], at = 0) => {
    const vv = closeVoicing(ns.map(pcOf), null, 0, 23, 9);
    return [{ s: pcOf(ns[0]) - 12, t: at, d: 1.3, v: 0.5 }, ...vv.map((s) => ({ s, t: at, d: 1.3, v: 0.5 }))];
  };
  const compare = () => playNotes([...playChord(b.counterpart, 0), ...playChord(b.notes, 1.5)], 'borrow');

  /* double flats */
  const all = BORROW_IDS.flatMap((x) => borrowedChord(cur, x).notes);
  const dbls = all.filter((n, i) => Math.abs(n.acc) >= 2 && all.findIndex((y) => y.letter === n.letter && y.acc === n.acc) === i);

  /* famous progressions */
  const P = PROGS[pi];
  const chords: ProgChord[] = P.seq.map((x) => {
    if (typeof x === 'number') {
      const ns = diatonicTriad(sc, x);
      return { notes: ns, roman: chordInfo(sc, x).roman, name: sym(ns), tone: FUNCTION_OF[x] as ProgTone };
    }
    const bc = borrowedChord(cur, x);
    return { notes: bc.notes, roman: bc.roman, name: sym(bc.notes), tone: 'B', hot: bc.changed };
  });
  /* predict: which note of IV drops in iv? */
  const ivChord = diatonicTriad(sc, 3);
  const ivV = closeVoicing(ivChord.map(pcOf), null, 0, 23, 9);
  const ivMarks: Record<number, Mark> = {};
  let ivAnswer = 0;
  ivV.forEach((x) => {
    const k = ivChord.findIndex((n) => ((pcOf(n) - x) % 12 + 12) % 12 === 0);
    ivMarks[x] = roleMark(x, 'sub', ['1', '3', '5'][k], nm(ivChord[k]));
    if (k === 1) ivAnswer = x;
  });
  const labels = { play: t.play, stop: t.stop, prev: t.prev, next: t.next, now: t.now };

  const chip = (ns: Note[], roman: string, cls: string, pressed: boolean | undefined, on: () => void, key: string) => (
    <button key={key} type="button" className={'chip ' + cls} aria-pressed={pressed} onClick={on}>
      {roman}<small>{sym(ns)}</small>
    </button>
  );

  return (
    <>
      <Html as="p" className="desc" html={t.desc} />
      <Predict mode="key" resetOn={`${s.k}${s.enh}`} lay={layout(0, 23)} marks={ivMarks} answer={[ivAnswer]} anyOctave
        prompt={t.predictQ(keyName(cur), sym(ivChord), ivChord.map(nm).join(' '))}
        reveal={t.predictA(nm(sc[5]), nm(minor[5]))} />
      <h3 className="sub-h">{t.stepsTitle}</h3>
      <ol className="recipe">
        <Html as="li" html={t.step1(majName, minName)} />
        <Html as="li" html={t.step2(nm(minor[2]), nm(minor[5]), nm(minor[6]))} />
        <Html as="li" html={t.step3} />
      </ol>

      <h3 className="sub-h">{t.winTitle}</h3>
      <Board>
        <MotionFifthsLine from={f0 - 3} to={f0 + 6} name={(f) => nm(fromFifthIndex(f))} label={t.winAria(majName, minName)} cells={cells}
          wins={[
            { start: f0, end: f0 + 6, label: majName, color: 'var(--accent)' },
            { start: f0 - 3, end: f0 + 3, label: minName, color: 'var(--flat)', dash: true, below: true },
          ]} />
      </Board>
      <Legend items={[
        { color: 'var(--k-scale)', label: t.lgCommon },
        { dash: 'var(--muted)', label: t.lgOut },
        { color: 'var(--k-lt)', label: t.lgIn },
      ]} />

      <p className="rowlab mt">{t.rowMajor(majName)}</p>
      <div className="chips" role="group">
        {[0, 1, 2, 3, 4, 5, 6].map((d) => {
          const c = chordInfo(sc, d);
          const ns = diatonicTriad(sc, d);
          return chip(ns, c.roman, c.quality, d === b.degree ? true : undefined, () => playNotes(playChord(ns), 'borrow'), 'M' + d);
        })}
      </div>
      <p className="rowlab">{t.rowBorrow(minName)}</p>
      <div className="chips" role="group">
        {BORROW_IDS.map((x) => {
          const bc = borrowedChord(cur, x);
          return chip(bc.notes, bc.roman, 'min', x === id, () => { setId(x); playNotes(playChord(bc.notes), 'borrow'); }, x);
        })}
      </div>
      <Bar now={`${cRoman} → ${b.roman}`}>
        <PlayButton label={t.compare(`${cRoman} (${sym(b.counterpart)})`, `${b.roman} (${sym(b.notes)})`)} seconds={3} onPlay={compare} />
      </Bar>
      <Board>
        <Keyboard lay={layout(0, 23)} marks={marks} channel="borrow" label={read.replace(/<[^>]+>/g, '')} />
      </Board>
      <Legend items={[
        { color: 'var(--k-sub)', label: t.lgBorrow },
        { color: 'var(--k-lt)', label: t.lgChg },
        { dash: 'var(--k-lt-line)', label: t.lgWas },
      ]} />
      <Html as="p" className="readout" html={read} />
      {hasDouble(all) && <p className="hint">{t.dbl(dbls.map((n) => `${nm(n)} = ${nm(simpler(n))}`).join(', '))}</p>}

      <h3 className="sub-h">{t.progTitle}</h3>
      <div className="chips" role="group">
        {PROGS.map((p, i) => (
          <button key={p.id} type="button" className="chip neutral row-chip" aria-pressed={i === pi} onClick={() => setPi(i)}>{t.progs[p.id]}</button>
        ))}
      </div>
      <p className="desc">{t.progDesc[P.id]}</p>
      <MotionProgression key={P.id} chords={chords} channel="borrow-prog" nm={nm} labels={labels}
        read={(i) => t.readProg(chords[i].roman, chords[i].name, chords[i].tone === 'B')}
        legend={[
          { color: 'var(--k-tonic)', label: t.lgT },
          { color: 'var(--k-sub)', label: t.lgSD },
          { color: 'var(--k-dom)', label: t.lgD },
          { color: 'var(--k-lt)', label: t.lgChg },
        ]} />

      <h3 className="sub-h">{t.logicTitle}</h3>
      <Notes items={t.logic(majName, minName).map((html) => ({ html }))} more={[4]} />
      <Transfer question={t.transfer} />
      <Recap {...t.recap} />
    </>
  );
}
