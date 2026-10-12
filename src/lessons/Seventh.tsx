import { useState } from 'react';
import { playNotes } from '../audio/audio';
import { ColorBracket, type FifthCell, FifthsStrip } from '../components/ChordsKit';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Bar, Board, Legend, Notes, PlayButton } from '../components/ui';
import { text } from '../i18n/lessons/seventh';
import { useLessonText } from '../i18n/lessonText';
import { type Note, chordInfo, fifthIndex, fromFifthIndex, pcOf, sameNote } from '../theory';
import {
  SEVENTH_QUALITIES, SEVENTH_SEMIS, type SeventhQuality, diatonicSeventhInfo, fifthShape, letterName,
  seventhNotes, seventhRoman, seventhSuffix, thirdsOf,
} from '../theory/chords7';
import { setState } from '../state/store';
import { useLab } from '../state/useLab';
import '../styles/chords.css';

/** Chip class per quality: green = major, blue = dominant, purple = minor, coral = diminished. */
const Q_CHIP: Record<SeventhQuality, string> = { maj7: 'maj', dom7: 'fD', min7: 'min', hdim7: 'dim', dim7: 'dim' };

const ROLE = ['tonic', 'scale', 'scale', 'lt'] as const;

/** Four notes, ascending from the root in the 4th octave. */
const semisOf = (root: Note, q: SeventhQuality) => SEVENTH_SEMIS[q].map((x) => pcOf(root) + x);

const arpThenChord = (ps: number[], ch: string) =>
  playNotes([...ps.map((p, k) => ({ s: p, t: k * 0.3, d: 0.6 })), ...ps.map((p) => ({ s: p, t: ps.length * 0.3 + 0.1, d: 1.8, v: 0.5 }))], ch);

export function Seventh() {
  const { s, nm, keyName, cur, sc } = useLab();
  const t = useLessonText(text);
  const st = s.lang;
  const d = s.deg || 0;
  const info = diatonicSeventhInfo(sc, d);
  const sym = (n: Note, q: SeventhQuality) => letterName(n) + seventhSuffix(q, st);
  const label = sym(info.notes[0], info.quality);
  const ps = semisOf(info.notes[0], info.quality);
  const th = thirdsOf(info.quality);
  const names = info.notes.map(nm).join(' ');
  const read = t.read(label, names, th.join(' + '), ps[3] - ps[0]);

  const marks: Record<number, Mark> = {};
  ps.forEach((p, k) => (marks[p] = roleMark(p, ROLE[k], String(1 + 2 * k), nm(info.notes[k]))));
  const thirdColor = (n: number) => (n === 4 ? 'var(--accent)' : 'var(--flat)');

  // line of fifths: window of the key, plus two slots on each side
  const f0 = fifthIndex(sc[3]);
  const shape = fifthShape(info.notes);
  const rootF = fifthIndex(info.notes[0]) - f0;
  const FROM = -2;
  const TO = 8;
  const cells: FifthCell[] = [];
  for (let j = FROM; j <= TO; j++) {
    const k = shape.findIndex((x) => rootF + x === j);
    const n = fromFifthIndex(f0 + j);
    const out = j < 0 || j > 6;
    if (k >= 0) {
      const col = [['var(--k-tonic)', 'var(--k-tonic-ink)'], ['var(--k-scale)', 'var(--k-scale-ink)'], ['var(--k-scale)', 'var(--k-scale-ink)'], ['var(--k-lt)', 'var(--k-lt-ink)']][k];
      cells.push({ name: nm(n), fill: col[0], ink: col[1], tag: String(1 + 2 * k), out });
    } else cells.push({ name: nm(n), out });
  }
  const spans = shape.some((x) => rootF + x === 0) && shape.some((x) => rootF + x === 6);
  const shapeTxt = shape.map((x) => (x > 0 ? '+' + x : String(x))).join(' ');

  // five qualities on the selected root
  const [q, setQ] = useState<SeventhQuality>('maj7');
  const qNotes = seventhNotes(info.notes[0], q);
  const qps = semisOf(info.notes[0], q);
  const qMarks: Record<number, Mark> = {};
  qps.forEach((p, k) => {
    const inKey = sc.some((n) => sameNote(n, qNotes[k]));
    qMarks[p] = inKey ? roleMark(p, k === 0 ? 'tonic' : 'scale', String(1 + 2 * k), nm(qNotes[k])) : roleMark(p, 'chg', String(1 + 2 * k), nm(qNotes[k]));
  });
  const romans = (qq: SeventhQuality) =>
    [0, 1, 2, 3, 4, 5, 6].filter((k) => diatonicSeventhInfo(sc, k).quality === qq).map((k) => seventhRoman(k, qq, st));
  // relative minor (degree 6) raises its 7th (degree 5 + ♯): vii°7 of harmonic minor
  const lt = { letter: sc[4].letter, acc: sc[4].acc + 1 };
  const minorName = t.minorOf(nm(sc[5]));
  const where = (qq: SeventhQuality) => {
    if (qq === 'dim7') return t.qWhere.dim7(minorName, sym(lt, 'dim7'));
    return t.qWhere[qq](romans(qq).join(t.and));
  };

  // predict: the triad is given, the learner taps the 7th
  const pMarks: Record<number, Mark> = {};
  ps.slice(0, 3).forEach((p, k) => (pMarks[p] = roleMark(p, k === 0 ? 'tonic' : 'scale', String(1 + 2 * k), nm(info.notes[k]))));
  const sevSemis = ps[3] - ps[0];
  const p1r = t.p1r(nm(info.notes[2]), nm(sc[(d + 5) % 7]), nm(info.notes[3]), sevSemis, sevSemis === 11 ? t.sizeM : t.sizem, label);

  return (
    <>
      <p className="desc">{t.desc}</p>
      <Predict mode="key" resetOn={`${s.k}${s.enh}${d}`} lay={layout(0, 23)} marks={pMarks} answer={[ps[3]]} anyOctave
        prompt={t.p1(chordInfo(sc, d).roman, info.notes.slice(0, 3).map(nm).join(' '), nm(info.notes[2]))} reveal={p1r} />
      <p className="rowlab">{t.pick(keyName(cur))}</p>
      <div className="chips" role="group">
        {[0, 1, 2, 3, 4, 5, 6].map((k) => {
          const c = diatonicSeventhInfo(sc, k);
          return (
            <button key={k} type="button" className={'chip ' + Q_CHIP[c.quality]} aria-pressed={k === d} onClick={() => {
              setState({ deg: k });
              arpThenChord(semisOf(c.notes[0], c.quality), 'sev');
            }}>
              {seventhRoman(k, c.quality, st)}<small>{sym(c.notes[0], c.quality)}</small>
            </button>
          );
        })}
      </div>
      <p className="hint">{t.cifra}</p>
      <Bar now={<span className="chords-sym">{label}</span>}>
        <PlayButton label={t.playChord} seconds={3} onPlay={() => arpThenChord(ps, 'sev')} />
      </Bar>
      <Board>
        <Keyboard lay={layout(0, 23)} marks={marks} channel="sev" label={read} top={104}
          steps={[0, 1, 2].map((k) => ({ a: ps[k], b: ps[k + 1], t: th[k] }))}
          ann={(l) => (
            <>
              {[0, 1, 2].map((k) => (
                <ColorBracket key={k} lay={l} a={ps[k]} b={ps[k + 1]} y={70 - k * 22} color={thirdColor(th[k])}
                  label={`${th[k] === 4 ? t.thirdM : t.thirdm} · ${th[k]}`} />
              ))}
            </>
          )} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: t.lgRoot },
        { color: 'var(--k-scale)', label: t.lgMid },
        { color: 'var(--k-lt)', label: t.lgSev },
        { color: 'var(--accent)', label: t.lgBM },
        { color: 'var(--flat)', label: t.lgBm },
      ]} />
      <p className="readout">{read}</p>
      <p className="hint">{t.stepsNote}</p>

      <h3 className="sub-h">{t.lineTitle}</h3>
      <p className="desc">{t.lineDesc}</p>
      <Board>
        <FifthsStrip cells={cells} win={[0 - FROM, 6 - FROM]} winLabel={`${t.window} · ${keyName(cur)}`} label={t.shape(label, shapeTxt)} />
      </Board>
      <p className="readout">{t.shape(label, shapeTxt)}</p>
      {spans && <p className="hint">{t.spans}</p>}

      <h3 className="sub-h">{t.qTitle}</h3>
      <Predict mode="choice" options={t.p2opts} answer={t.p2ans} prompt={t.p2} reveal={t.p2r} />
      <p className="desc">{t.qDesc(nm(info.notes[0]))}</p>
      <div className="chords-qlist">
        {SEVENTH_QUALITIES.map((qq) => {
          const tt = thirdsOf(qq);
          return (
            <button key={qq} type="button" className="chords-qrow" aria-pressed={qq === q} onClick={() => {
              setQ(qq);
              arpThenChord(semisOf(info.notes[0], qq), 'sevq');
            }}>
              <span className={'chords-qsym chip ' + Q_CHIP[qq]}>{sym(info.notes[0], qq)}</span>
              <span className="chords-qbody">
                <b>{t.qName[qq]}</b>
                <span className="chords-thirds" aria-label={tt.join(' + ')}>
                  {tt.map((x, k) => <i key={k} className={x === 4 ? 'M' : 'm'}>{x}</i>)}
                </span>
                <small>{where(qq)}</small>
              </span>
            </button>
          );
        })}
      </div>
      <Board>
        <Keyboard lay={layout(0, 23)} marks={qMarks} channel="sevq" label={t.qRead(sym(info.notes[0], q), qNotes.map(nm).join(' '))} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: t.lgRoot },
        { colors: ['var(--k-scale)', 'var(--k-scaleb)'], label: t.lgIn },
        { colors: ['var(--k-chg)', 'var(--k-chgb)'], label: t.lgOut },
      ]} />
      <p className="readout">{t.qRead(sym(info.notes[0], q), qNotes.map(nm).join(' '))}</p>

      <h3 className="sub-h">{t.logicTitle}</h3>
      <Notes items={t.logic.map((html) => ({ html }))} more={[4]} />
      <Transfer question={t.transfer} />
      <Recap {...t.recap} />
    </>
  );
}
