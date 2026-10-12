import { playNotes, seq } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { Predict, Recap, Transfer } from '../components/Learn';
import { type Mark, layout, roleMark, stepsFor } from '../components/layout';
import { Bar, Board, Legend, Notes, PlayButton } from '../components/ui';
import { extras } from '../i18n/lessons/extras/scale';
import { FLAT_ORDER, SHARP_ORDER, majorScale, note, pcOf, scaleSemitones } from '../theory';
import { useLab } from '../state/useLab';

export function Scale() {
  const { s, t, nm, keyName, cur, sc, consistent, diff, pred, lcur } = useLab();
  const X = extras[s.lang];
  const notes = scaleSemitones(pcOf(cur));
  const chIdx = consistent && diff ? diff.deg - 1 : -1;
  const marks: Record<number, Mark> = {};
  notes.forEach((k, i) => {
    const n = sc[i % 7];
    const deg = (i % 7) + 1;
    const role = i % 7 === 0 ? 'tonic' : i === chIdx ? 'chg' : n.acc !== 0 ? 'acc' : 'scale';
    marks[k] = roleMark(k, role, deg, nm(n));
  });
  const names = sc.map(nm).join(' ');
  // prediction: the previous key's scale, and the key that replaces the changing note
  const psc = majorScale(pred);
  const pNotes = scaleSemitones(pcOf(pred));
  const pMarks: Record<number, Mark> = {};
  pNotes.forEach((k, i) => (pMarks[k] = roleMark(k, i % 7 === 0 ? 'start' : 'scale', (i % 7) + 1, nm(psc[i % 7]))));
  const pi = diff ? psc.findIndex((n) => n.letter === diff.letter) : -1;
  const pAns = diff && pi >= 0 ? pNotes[pi] + (diff.to - diff.from) : -1;
  const oldN = diff ? nm({ letter: diff.letter, acc: diff.from }) : '';
  const newN = diff ? nm({ letter: diff.letter, acc: diff.to }) : '';
  const sharps = SHARP_ORDER.map((l) => nm(note(l, 1))).join(' ');
  const flats = FLAT_ORDER.map((l) => nm(note(l, -1))).join(' ');
  return (
    <>
      <p className="desc">{t.scaleDesc}</p>
      {diff && pAns >= 0 && (
        <Predict mode="key" resetOn={`${s.k}${s.dir}`} lay={layout(0, 23)} marks={pMarks} anyOctave
          prompt={X.pChange(keyName(pred), keyName(lcur))} answer={[pAns]}
          reveal={s.dir === 'cw' ? X.pChangeCw(oldN, newN) : X.pChangeCcw(oldN, newN)} />
      )}
      <Bar now={`${keyName(cur)} · ${names}`}>
        <PlayButton label={t.playScale} seconds={3} onPlay={() => playNotes(seq(notes), 'scale')} />
      </Bar>
      <Board>
        <Keyboard lay={layout(0, 23)} marks={marks} steps={stepsFor(notes, t.W, t.H)} channel="scale" label={`${keyName(cur)}: ${names}`} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: t.lgTonic },
        { color: 'var(--k-scale)', label: t.lgScale },
        { color: 'var(--k-acc)', label: t.lgAcc },
        { color: 'var(--k-chg)', label: t.lgNow },
      ]} />
      <Notes items={[
        { color: 'var(--k-tonic)', html: X.n1(keyName(cur)) },
        { color: 'var(--k-scale)', html: X.n2 },
        { color: 'var(--k-chg)', html: X.n3 },
        { color: 'var(--k-acc)', html: X.n4(sharps, flats) },
      ]} />
      <Transfer question={X.transfer} />
      <Recap {...X.recap} />
    </>
  );
}
