import { useState } from 'react';
import { playNotes } from '../audio/audio';
import { ColorBracket } from '../components/ChordsKit';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, rangeAround, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Bar, Board, Legend, Notes, PlayButton, Seg } from '../components/ui';
import { text } from '../i18n/lessons/inversions';
import { useLessonText } from '../i18n/lessonText';
import { type Note, chordInfo, pcOf, triad, voice } from '../theory';
import {
  diatonicSeventh, diatonicSeventhInfo, intervalsAboveBass, invert, letterName, seventhSuffix, stackUp,
} from '../theory/chords7';
import { setState } from '../state/store';
import { useLab } from '../state/useLab';
import '../styles/chords.css';

const FIG3 = ['5/3', '6', '6/4'];
const FIG4 = ['7', '6/5', '4/3', '4/2'];

export function Inversions() {
  const { s, nm, keyName, cur, sc } = useLab();
  const t = useLessonText(text);
  const st = s.lang;
  const [kind, setKind] = useState<3 | 4>(3);
  const [inv, setInv] = useState(1);
  const d = s.deg || 0;
  const k = Math.min(inv, kind - 1);

  const notesOf = (deg: number): Note[] => (kind === 3 ? triad(sc, deg) : diatonicSeventh(sc, deg));
  const symOf = (deg: number) =>
    kind === 3
      ? letterName(sc[deg]) + chordInfo(sc, deg).suffix
      : letterName(sc[deg]) + seventhSuffix(diatonicSeventhInfo(sc, deg).quality, st);
  const notes = notesOf(d);
  const sym = symOf(d);
  // root position from the root in the lower octave; each inversion moves the lowest notes up an octave
  const rootPos = (nn: Note[]) => stackUp(nn.map(pcOf), -12);
  const invSemis = (nn: Note[], kk: number) => {
    const rp = rootPos(nn);
    return [...rp.slice(kk), ...rp.slice(0, kk).map((p) => p + 12)];
  };
  const semisFor = (kk: number) => invSemis(notes, kk);
  const ps = semisFor(k);
  const inverted = invert(notes, k);
  const bass = inverted[0];
  const fullSym = k === 0 ? sym : `${sym}/${letterName(bass)}`;
  const nums = intervalsAboveBass(inverted);
  const fig = (kind === 3 ? FIG3 : FIG4)[k];

  const marks: Record<number, Mark> = {};
  let ghost: number | null = null;
  if (k > 0) {
    ghost = semisFor(k - 1)[0];
    marks[ghost] = { ghost: 'var(--muted)' };
  }
  inverted.forEach((n, i) => {
    const p = ps[i];
    const tone = String(1 + 2 * ((i + k) % kind));
    marks[p] = roleMark(p, i === 0 ? 'chg' : (i + k) % kind === 0 ? 'tonic' : 'scale', tone, nm(n));
  });
  const read = t.read(fullSym, t.inv[k], t.invBass[k], nm(bass));
  const playChord = (pp: number[], ch = 'inv') =>
    playNotes([...pp.map((p, i) => ({ s: p, t: i * 0.22, d: 0.5 })), ...pp.map((p) => ({ s: p, t: pp.length * 0.22 + 0.1, d: 1.5, v: 0.5 }))], ch);

  // bass line: I – V/7 – vi against I – V – vi
  const [mode, setMode] = useState<'inv' | 'root'>('inv');
  const [pi, setPi] = useState(1);
  const DEG = [0, 4, 5];
  const r0 = pcOf(sc[0]);
  const b0 = r0 >= 3 ? r0 - 12 : r0;
  const basses = mode === 'inv' ? [b0, b0 - 1, b0 - 3] : [b0, b0 - 5, b0 - 3];
  const bassNotes = mode === 'inv' ? [sc[0], sc[6], sc[5]] : [sc[0], sc[4], sc[5]];
  const uppers: number[][] = [];
  let prev: number[] | null = null;
  for (const dd of DEG) {
    const v = voice(triad(sc, dd).map(pcOf), prev);
    uppers.push(v);
    prev = v;
  }
  const lsym = [
    letterName(sc[0]),
    letterName(sc[4]) + (mode === 'inv' ? '/' + letterName(sc[6]) : ''),
    letterName(sc[5]) + 'm',
  ];
  const lay2 = rangeAround(Math.min(...basses), Math.max(23, ...uppers.flat()));
  const m2: Record<number, Mark> = {};
  if (pi > 0) m2[basses[pi - 1]] = { ghost: 'var(--muted)' };
  const tri = triad(sc, DEG[pi]);
  uppers[pi].forEach((p) => {
    const i = tri.findIndex((n) => pcOf(n) === ((p % 12) + 12) % 12);
    m2[p] = roleMark(p, 'scale', String(1 + 2 * i), nm(tri[i]));
  });
  const bi = tri.findIndex((n) => pcOf(n) === pcOf(bassNotes[pi]));
  m2[basses[pi]] = roleMark(basses[pi], 'chg', String(1 + 2 * bi), nm(bassNotes[pi]));
  const chordAt = (i: number) => [basses[i], ...uppers[i]].map((p) => ({ s: p, t: 0, d: 1.2, v: 0.55 }));
  const playLine = () => {
    playNotes([0, 1, 2].flatMap((i) => chordAt(i).map((e) => ({ ...e, t: i * 1.1 }))), 'invline');
  };
  const lineRead = t.bassLine(bassNotes.map(nm).join(' → '), mode === 'inv' ? t.byStep : t.leaps);

  // predict 1: the triad in root position; which note goes to the bass in 1st inversion?
  const pTri = triad(sc, d);
  const pPs = stackUp(pTri.map(pcOf), 0);
  const pMarks: Record<number, Mark> = {};
  pPs.forEach((p, i) => (pMarks[p] = roleMark(p, i === 0 ? 'tonic' : 'scale', undefined, nm(pTri[i]))));
  const pSym = letterName(sc[d]) + chordInfo(sc, d).suffix;
  // predict 2: the bass from I to vi, which note of V in between?
  const p2Marks: Record<number, Mark> = {
    [b0]: roleMark(b0, 'tonic', undefined, nm(sc[0])),
    [b0 - 3]: roleMark(b0 - 3, 'scale', undefined, nm(sc[5])),
  };
  const vSym = letterName(sc[4]);
  const reset = `${s.k}${s.enh}`;

  return (
    <>
      <p className="desc">{t.desc}</p>
      <Predict mode="key" resetOn={reset + d} lay={layout(0, 23)} marks={pMarks} answer={[pPs[1]]} anyOctave
        prompt={t.p1(pSym, pTri.map(nm).join(' '), nm(pTri[0]))} reveal={t.p1r(nm(pTri[1]), nm(pTri[0]))} />
      <div className="bar mt">
        <Seg label={t.kind} value={kind} onChange={(v) => setKind(v)} options={[{ v: 3, label: t.triad }, { v: 4, label: t.tetrad }]} />
      </div>
      <p className="rowlab">{t.pick(keyName(cur))}</p>
      <div className="chips" role="group">
        {[0, 1, 2, 3, 4, 5, 6].map((dd) => (
          <button key={dd} type="button" className={'chip ' + chordInfo(sc, dd).quality} aria-pressed={dd === d}
            onClick={() => { setState({ deg: dd }); playChord(invSemis(notesOf(dd), k)); }}>
            {symOf(dd)}
          </button>
        ))}
      </div>
      <p className="rowlab">{t.invLabel}</p>
      <div className="chips" role="group">
        {Array.from({ length: kind }, (_, kk) => (
          <button key={kk} type="button" className="chip neutral" aria-pressed={kk === k}
            onClick={() => { setInv(kk); playChord(semisFor(kk)); }}>
            {t.inv[kk]}<small>{kk === 0 ? sym : `${sym}/${letterName(invert(notes, kk)[0])}`}</small>
          </button>
        ))}
      </div>
      <Bar now={<span className="chords-sym">{fullSym}</span>}>
        <PlayButton label={t.playIt} seconds={2} onPlay={() => playChord(ps)} />
        <PlayButton label={t.playAll} seconds={kind * 1.3} onPlay={() => playNotes(
          Array.from({ length: kind }, (_, kk) => semisFor(kk).map((p) => ({ s: p, t: kk * 1.2, d: 1.1, v: 0.55 }))).flat(), 'inv')} />
      </Bar>
      <Board>
        <Keyboard lay={layout(-12, 19)} marks={marks} channel="inv" label={read} top={46 + 22 * nums.length} minWidth={480}
          ann={(l) => (
            <>
              {nums.map((n, i) => (
                <ColorBracket key={i} lay={l} a={ps[0]} b={ps[i + 1]} y={14 + 22 * (nums.length - i)} color="var(--change)"
                  label={t.ord(n)} />
              ))}
            </>
          )} />
      </Board>
      <Legend items={[
        { colors: ['var(--k-chg)', 'var(--k-chgb)'], label: t.lgBass },
        { color: 'var(--k-tonic)', label: t.lgRoot },
        { colors: ['var(--k-scale)', 'var(--k-scaleb)'], label: t.lgOther },
        ...(ghost != null ? [{ dash: 'var(--muted)', label: t.lgWas }] : []),
      ]} />
      <p className="readout">{read}</p>
      <p className="readout">{t.figured(nums.map(t.ord).join(', '))} · {fig}</p>
      {k > 0 && <p className="hint">{t.moved(nm(invert(notes, k - 1)[0]))}</p>}
      <p className="hint">{t.slash}</p>

      <h3 className="sub-h">{t.lineTitle}</h3>
      <Predict mode="key" resetOn={reset} lay={layout(-12, 11)} marks={p2Marks} answer={[b0 - 1]} anyOctave
        prompt={t.p2(lsym[0], vSym, lsym[2], nm(sc[0]), nm(sc[5]), triad(sc, 4).map(nm).join(' '))}
        reveal={t.p2r(nm(sc[6]), vSym, nm(sc[0]), nm(sc[5]), `${vSym}/${letterName(sc[6])}`)} />
      <p className="desc">{t.lineDesc(lsym[0], letterName(sc[4]) + '/' + letterName(sc[6]), lsym[2])}</p>
      <div className="bar">
        <Seg label={t.lineTitle} value={mode} onChange={setMode} options={[{ v: 'inv', label: t.withInv }, { v: 'root', label: t.rootOnly }]} />
      </div>
      <div className="chips timeline" role="group">
        {lsym.map((ls, i) => (
          <button key={i} type="button" className={'chip ' + chordInfo(sc, DEG[i]).quality} aria-pressed={i === pi}
            onClick={() => { setPi(i); playNotes(chordAt(i), 'invline'); }}>
            {ls}
          </button>
        ))}
      </div>
      <Bar now={lineRead}><PlayButton label={t.playLine} seconds={3.4} onPlay={playLine} /></Bar>
      <Board>
        <Keyboard lay={lay2} marks={m2} channel="invline" label={lineRead} minWidth={460} />
      </Board>
      <Legend items={[
        { colors: ['var(--k-chg)', 'var(--k-chgb)'], label: t.lgBass2 },
        { colors: ['var(--k-scale)', 'var(--k-scaleb)'], label: t.lgUpper },
        { dash: 'var(--muted)', label: t.lgWas },
      ]} />
      <h3 className="sub-h">{t.logicTitle}</h3>
      <Notes items={t.logic.map((html) => ({ html }))} more={[4, 5]} />
      <Transfer question={t.transfer} />
      <Recap {...t.recap} />
    </>
  );
}
