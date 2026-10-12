import { useState } from 'react';
import { playNotes, seq } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, fillFor, layout, rangeAround, roleMark } from '../components/layout';
import { type FifthCell, ScalesFifthsRow, scaleSemis, stepsAny, upDown } from '../components/ScalesKit';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Bar, Board, Html, Legend, Notes, PlayButton, Seg } from '../components/ui';
import { useLessonText } from '../i18n/lessonText';
import { text } from '../i18n/lessons/penta';
import { useLab } from '../state/useLab';
import { FS, MAJOR_OFFSETS, type Note, fifthIndex, fromFifthIndex, pcOf, sameNote } from '../theory';
import {
  blueNote, bluesScale, majorPentatonic, minorPentatonic, naturalMinor, offsetsOf, pentatonicByFifths, relativeMinor,
} from '../theory/scales';
import '../styles/scales.css';

type View = 'maj' | 'min' | 'blues';
const DEG: Record<View, string[]> = {
  maj: ['1', '2', '3', '5', '6'],
  min: ['1', '♭3', '4', '5', '♭7'],
  blues: ['1', '♭3', '4', '♭5', '5', '♭7'],
};
const BLACK = [6, 8, 10, 13, 15];

export function Penta() {
  const { s, t, nm, keyName, cur, sc } = useLab();
  const tx = useLessonText(text);
  const [view, setView] = useState<View>('maj');

  // 1 · the black keys
  const fsP = majorPentatonic(FS);
  const blackLay = layout(5, 19);
  const blackMarks: Record<number, Mark> = {};
  BLACK.forEach((x, i) => (blackMarks[x] = roleMark(x, i === 0 ? 'tonic' : 'scale', DEG.maj[i], nm(fsP[i]))));
  blackMarks[18] = roleMark(18, 'tonic', 1, nm(fsP[0]));

  // 2 · the current key
  const mt = relativeMinor(cur);
  const T = view === 'maj' ? cur : mt;
  const notes: Note[] = view === 'maj' ? majorPentatonic(cur) : view === 'min' ? minorPentatonic(mt) : bluesScale(mt);
  const base = pcOf(T);
  const semis = scaleSemis(base, offsetsOf(notes));
  const lay = rangeAround(base, base + 12);
  const marks: Record<number, Mark> = {};
  semis.forEach((x, i) => {
    const k = i % notes.length;
    const lab = DEG[view][k];
    marks[x] = roleMark(x, k === 0 ? 'tonic' : lab === '♭5' ? 'chg' : 'scale', lab, nm(notes[k]));
  });
  const nat = naturalMinor(mt);
  const missing: [number, Note, string][] =
    view === 'maj' ? [[5, sc[3], '4'], [11, sc[6], '7']] : view === 'min' ? [[2, nat[1], '2'], [8, nat[5], '♭6']] : [];
  for (const [o, n, lab] of missing) {
    const x = base + o;
    marks[x] = { ghost: 'var(--k-lt-line)', label: lab, ink: fillFor(x, 'var(--k-start-ink)', 'var(--k-tonic-ink)'), name: nm(n) };
  }
  const name = tx.name[view](nm(T));
  const now = tx.now(name, notes.map(nm).join(' '));
  const blue = blueNote(mt);
  const read =
    view === 'blues' ? tx.bluesRead(nm(blue), nm(notes[2]), nm(notes[4])) : tx.missing(nm(missing[0][1]), nm(missing[1][1]));

  // predict: which two notes leave the major scale?
  const kBase = pcOf(cur);
  const kSemis = scaleSemis(kBase, MAJOR_OFFSETS);
  const pMarks: Record<number, Mark> = {};
  kSemis.forEach((x, i) => (pMarks[x] = roleMark(x, i % 7 === 0 ? 'tonic' : 'scale', (i % 7) + 1, nm(sc[i % 7]))));

  // 3 · line of fifths
  const f0 = fifthIndex(sc[3]);
  const cells: FifthCell[] = [];
  for (let j = -1; j <= 7; j++) {
    const n = fromFifthIndex(f0 + j);
    const k = notes.findIndex((x) => sameNote(x, n));
    const d = k >= 0 ? DEG[view][k] : String(((n.letter - T.letter + 7) % 7) + 1);
    if (j < 0 || j > 6) cells.push({ name: nm(n), dash: true });
    else if (j === 0 || j === 6) cells.push({ name: nm(n), sub: '✗', dash: true, stroke: 'var(--k-lt-line)', ink: 'var(--fg)', subInk: 'var(--change)' });
    else {
      const isT = sameNote(n, T);
      cells.push({
        name: nm(n), sub: d,
        fill: isT ? 'var(--k-tonic)' : 'var(--k-scale)', ink: isT ? 'var(--k-tonic-ink)' : 'var(--k-scale-ink)',
      });
    }
  }

  return (
    <>
      <p className="desc">{tx.desc}</p>
      <h3 className="sub-h">{tx.blackTitle}</h3>
      <p className="desc">{tx.blackDesc}</p>
      <Bar now={fsP.map(nm).join(' ')}>
        <PlayButton label={tx.playBlack} seconds={3.4} onPlay={() => playNotes(seq(upDown([...BLACK, 18]), 0.3, 0.45), 'penta-black')} />
      </Bar>
      <Board>
        <Keyboard lay={blackLay} marks={blackMarks} top={30} channel="penta-black" label={tx.blackLabel} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: tx.lgTonicBlack },
        { color: 'var(--k-scaleb)', label: tx.lgBlack },
      ]} />

      <h3 className="sub-h">{tx.mainTitle}</h3>
      <Predict mode="key" prompt={tx.predict(keyName(cur))} reveal={tx.predictReveal(nm(sc[3]), nm(sc[6]))}
        lay={rangeAround(kBase, kBase + 12)} marks={pMarks} answer={[kSemis[3], kSemis[6]]} anyOctave top={30} resetOn={s.k + s.enh} />
      <p className="rowlab">{tx.view}</p>
      <Seg value={view} label={tx.view} onChange={setView}
        options={[{ v: 'maj', label: tx.vMaj }, { v: 'min', label: tx.vMin }, { v: 'blues', label: tx.vBlues }]} />
      <Bar now={now}>
        <PlayButton label={tx.playUp} seconds={3.6} onPlay={() => playNotes(seq(upDown(semis), 0.3, 0.45), 'penta')} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} steps={stepsAny(semis, t.W, t.H, tx.wide)} top={30} channel="penta" label={now} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: tx.lgTonic },
        { color: 'var(--k-scale)', label: tx.lgScale },
        ...(view === 'blues' ? [{ color: 'var(--k-chg)', label: tx.lgBlue }] : [{ dash: 'var(--k-lt-line)', label: tx.lgMissing }]),
      ]} />
      <Html as="p" className="readout" html={read} />

      <h3 className="sub-h">{tx.lineTitle}</h3>
      <Board>
        <ScalesFifthsRow cells={cells} bracket={{ from: 2, to: 6, text: tx.lineBr }} label={tx.lineLabel(keyName(cur))} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: tx.lgTonic },
        { color: 'var(--k-scale)', label: tx.lgLineIn },
        { dash: 'var(--k-lt-line)', label: tx.lgLineOut },
      ]} />
      <h3 className="sub-h">{tx.whyTitle}</h3>
      <Notes items={tx.why(nm(cur), pentatonicByFifths(cur).map(nm).join(' → '), nm(sc[3]), nm(sc[6]), nm(mt), nm(blue)).map((html) => ({ html }))} more={[4]} />
      <Transfer question={tx.transfer} />
      <Recap {...tx.recap} />
    </>
  );
}
