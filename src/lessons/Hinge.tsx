import { playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type Mark, fillFor, rangeAround, roleMark, stepsFor } from '../components/layout';
import { Bar, Board, Legend, Notes, PlayButton } from '../components/ui';
import { pcOf, scaleSemitones } from '../theory';
import { useLab } from '../state/useLab';

export function Hinge() {
  const { t, nm, keyName, cur, sc } = useLab();
  const b = pcOf(cur);
  const notes = scaleSemitones(b);
  const lay = rangeAround(b, b + 12);
  const marks: Record<number, Mark> = {};
  notes.forEach((k, i) => {
    const deg = (i % 7) + 1;
    marks[k] = roleMark(k, deg === 1 ? 'tonic' : deg === 4 ? 'sub' : deg === 7 ? 'lt' : 'scale', deg, nm(sc[i % 7]));
  });
  const up = notes[3] + 1;
  const down = notes[6] - 1;
  const upN = { letter: sc[3].letter, acc: sc[3].acc + 1 };
  const dnN = { letter: sc[6].letter, acc: sc[6].acc - 1 };
  marks[up] = { ghost: 'var(--k-lt-line)', ink: fillFor(up, 'var(--k-start-ink)', 'var(--k-tonic-ink)'), label: '↑', name: nm(upN) };
  marks[down] = { ghost: 'var(--k-sub-line)', ink: fillFor(down, 'var(--k-start-ink)', 'var(--k-tonic-ink)'), label: '↓', name: nm(dnN) };
  return (
    <>
      <p className="desc">{t.hingeDesc}</p>
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
        { dash: 'var(--k-lt-line)', html: t.hUp(nm(sc[3]), nm(upN), keyName(sc[4])) },
        { dash: 'var(--k-sub-line)', html: t.hDown(nm(sc[6]), nm(dnN), keyName(sc[3])) },
        { color: 'var(--k-scale)', html: t.hRes(nm(sc[3]), nm(sc[6]), nm(sc[2]), nm(sc[0])) },
      ]} />
    </>
  );
}
