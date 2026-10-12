import { playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { Predict, Recap, Transfer } from '../components/Learn';
import { type Mark, fillFor, rangeAround, roleMark, stepsFor } from '../components/layout';
import { Bar, Board, Legend, Notes, PlayButton } from '../components/ui';
import { extras } from '../i18n/lessons/extras/hinge';
import { pcOf, scaleSemitones } from '../theory';
import { useLab } from '../state/useLab';

export function Hinge() {
  const { s, t, nm, keyName, cur, sc } = useLab();
  const X = extras[s.lang];
  const b = pcOf(cur);
  const notes = scaleSemitones(b);
  const lay = rangeAround(b, b + 12);
  const marks: Record<number, Mark> = {};
  const pMarks: Record<number, Mark> = {};
  notes.forEach((k, i) => {
    const deg = (i % 7) + 1;
    marks[k] = roleMark(k, deg === 1 ? 'tonic' : deg === 4 ? 'sub' : deg === 7 ? 'lt' : 'scale', deg, nm(sc[i % 7]));
    pMarks[k] = roleMark(k, deg === 1 ? 'tonic' : 'scale', deg, nm(sc[i % 7]));
  });
  const up = notes[3] + 1;
  const down = notes[6] - 1;
  const upN = { letter: sc[3].letter, acc: sc[3].acc + 1 };
  const dnN = { letter: sc[6].letter, acc: sc[6].acc - 1 };
  marks[up] = { ghost: 'var(--k-lt-line)', ink: fillFor(up, 'var(--k-start-ink)', 'var(--k-tonic-ink)'), label: '↑', name: nm(upN) };
  marks[down] = { ghost: 'var(--k-sub-line)', ink: fillFor(down, 'var(--k-start-ink)', 'var(--k-tonic-ink)'), label: '↓', name: nm(dnN) };
  // the predictions follow the current direction around the circle
  const cw = s.dir === 'cw';
  const reset = `${s.k}${s.enh}${s.dir}`;
  return (
    <>
      <p className="desc">{t.hingeDesc}</p>
      <Predict mode="key" resetOn={reset} lay={lay} marks={pMarks} anyOctave
        prompt={X.pMove(keyName(cw ? sc[4] : sc[3]), cw)} answer={[cw ? up : down]}
        reveal={cw ? X.pMoveRev(X.deg4, nm(sc[3]), nm(upN)) : X.pMoveRev(X.deg7, nm(sc[6]), nm(dnN))} />
      <Predict mode="choice" resetOn={reset} prompt={X.pRole(cw)} options={X.roles}
        answer={X.roles[cw ? 3 : 1]} reveal={cw ? X.pRoleRevUp : X.pRoleRevDown} />
      <Bar now={`${keyName(cur)} · ${nm(sc[3])}–${nm(sc[6])}`}>
        <PlayButton label={t.playHinge} seconds={2.4} onPlay={() => playNotes([
          { s: notes[3], t: 0, d: 1 }, { s: notes[6], t: 0, d: 1 }, { s: notes[3] - 1, t: 0.95, d: 1.4 }, { s: notes[6] + 1, t: 0.95, d: 1.4 },
        ], 'hinge')} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} steps={stepsFor(notes, t.W, t.H)} top={72} channel="hinge" label={`${nm(sc[3])}–${nm(sc[6])}`}
          ann={(l) => <Bracket lay={l} a={notes[3]} b={notes[6]} y={26} label={t.tritone} />} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: t.lgTonic },
        { color: 'var(--k-sub)', label: t.lgSub },
        { color: 'var(--k-lt)', label: t.lgLt },
        { dash: ['var(--k-lt-line)', 'var(--k-sub-line)'], label: t.lgGhost },
      ]} />
      <Notes items={[
        { color: 'var(--k-scale)', html: X.why },
        { dash: 'var(--k-lt-line)', html: t.hUp(nm(sc[3]), nm(upN), keyName(sc[4])) },
        { dash: 'var(--k-sub-line)', html: t.hDown(nm(sc[6]), nm(dnN), keyName(sc[3])) },
        { color: 'var(--k-lt)', html: t.hRes(nm(sc[3]), nm(sc[6]), nm(sc[2]), nm(sc[0])) },
      ]} />
      <Transfer question={X.transfer} />
      <Recap {...X.recap} />
    </>
  );
}
