import { useEffect, useState } from 'react';
import { playNotes, seq } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, rangeAround, roleMark, stepsFor } from '../components/layout';
import { KeySigStaff } from '../components/Staff';
import { Bar, Board, Legend, Notes, PlayButton } from '../components/ui';
import { text } from '../i18n/lessons/formula';
import { useLessonText } from '../i18n/lessonText';
import { MAJOR_OFFSETS, displayed, keySignature, majorScale, note, pcOf, scaleSemitones } from '../theory';
import { goToKey } from '../state/store';
import { useLab } from '../state/useLab';

/** Circle order, so neighbouring chips differ by one accidental. */
const SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export function Formula() {
  const { s, t, nm, keyName, cur, sc } = useLab();
  const x = useLessonText(text);
  const [n, setN] = useState(0);
  useEffect(() => setN(0), [s.k, s.enh]);

  // 1 · C major on the white keys
  const cScale = majorScale(note(0));
  const c = scaleSemitones(0);
  const m1: Record<number, Mark> = {};
  c.forEach((k, i) => (m1[k] = roleMark(k, i % 7 === 0 ? 'tonic' : 'scale', (i % 7) + 1, nm(cScale[i % 7]))));

  // 2 · building the current key step by step
  const base = pcOf(cur);
  const semis = scaleSemitones(base);
  const lay = rangeAround(base, base + 12);
  const m2: Record<number, Mark> = {};
  for (let i = 0; i <= Math.min(n, 7); i++) {
    const d = i % 7;
    m2[semis[i]] = roleMark(semis[i], d === 0 ? 'tonic' : sc[d].acc !== 0 ? 'chg' : 'scale', d + 1, nm(sc[d]));
  }
  if (n < 7) m2[semis[n + 1]] = { ...(m2[semis[n + 1]] ?? {}), ghost: 'var(--k-lt-line)' };
  const stepName = (i: number) => (MAJOR_OFFSETS[(i + 1) % 7] - MAJOR_OFFSETS[i] + 12) % 12 === 2 ? t.W : t.H;
  const lines = [x.stepFirst(nm(sc[0]))];
  for (let i = 1; i <= Math.min(n, 7); i++) {
    const d = i % 7;
    let line = x.stepLine(nm(sc[i - 1]), stepName(i - 1), nm(sc[d]));
    if (sc[d].acc !== 0 && i < 7) line += ` · ${x.stepWhy(nm(sc[d]), nm(note(sc[d].letter)))}`;
    lines.push(line);
  }
  const altered = sc.filter((q) => q.acc !== 0);
  const sig = keySignature(cur);

  return (
    <>
      <p className="desc">{x.desc}</p>

      <h3 className="sub-h">{x.s1}</h3>
      <p className="desc">{x.s1d}</p>
      <Bar now={cScale.map(nm).join(' ')}>
        <PlayButton label={x.play} seconds={3} onPlay={() => playNotes(seq(c), 'formula1')} />
      </Bar>
      <Board><Keyboard lay={layout(0, 12)} marks={m1} steps={stepsFor(c, t.W, t.H)} channel="formula1" label={x.s1} /></Board>
      <Legend items={[{ color: 'var(--k-tonic)', label: x.lgTonic }, { color: 'var(--k-scale)', label: x.lgScale }]} />

      <h3 className="sub-h">{x.s2}</h3>
      <p className="desc">{x.s2d}</p>
      <p className="rowlab">{x.start}</p>
      <div className="chips" role="group" aria-label={x.start}>
        {SLOTS.map((k) => (
          <button key={k} type="button" className="chip neutral" aria-pressed={k === s.k} onClick={() => goToKey(k)}>
            {nm(displayed(k, k === s.k ? s.enh : 'Fs'))}
          </button>
        ))}
      </div>
      <div className="bar">
        <span className="now">{keyName(cur)}</span>
        <div className="row">
          <button type="button" className="ghost" onClick={() => setN(0)} disabled={n === 0}>{x.restart}</button>
          <button type="button" onClick={() => setN(7)} disabled={n >= 7}>{x.allBtn}</button>
          <button type="button" className="primary" disabled={n >= 7} onClick={() => {
            const nn = n + 1;
            setN(nn);
            playNotes([{ s: semis[n], t: 0, d: 0.45 }, { s: semis[nn], t: 0.35, d: 0.8 }], 'formula2');
          }}>{x.stepBtn}</button>
        </div>
      </div>
      <Board>
        <Keyboard lay={lay} marks={m2} steps={stepsFor(semis.slice(0, Math.min(n, 7) + 1), t.W, t.H)} channel="formula2" label={lines.join('. ')} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: x.lgTonic }, { color: 'var(--k-scale)', label: x.lgScale },
        { color: 'var(--k-chg)', label: x.lgNew }, { dash: 'var(--k-lt-line)', label: x.lgNext },
      ]} />
      <ol className="recipe formula-steps">{lines.map((l, i) => <li key={i}>{l}</li>)}</ol>
      {n >= 7 && (
        <div className="bar">
          <p className="readout">{x.done(keyName(cur), altered.length)}</p>
          <PlayButton label={t.playScale} seconds={3} onPlay={() => playNotes(seq(semis), 'formula2')} />
        </div>
      )}

      <h3 className="sub-h">{x.s3}</h3>
      <p className="desc">{x.s3d}</p>
      <Board className="formula-sig">
        <KeySigStaff tonic={cur} noneLabel={x.sigNone} label={x.sigLabel(keyName(cur))} />
      </Board>
      <p className="readout">{x.sigLabel(keyName(cur))} · {sig.list.length ? x.sigList(sig.list.map(nm).join(' ')) : x.sigNone}</p>

      <h3 className="sub-h">{x.why}</h3>
      <Notes items={x.notes.map((html) => ({ html }))} />
    </>
  );
}
