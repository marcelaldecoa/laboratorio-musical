import { playNotes, seq } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, roleMark, stepsFor } from '../components/layout';
import { Bar, Board, Legend, PlayButton } from '../components/ui';
import { pcOf, scaleSemitones } from '../theory';
import { useLab } from '../state/useLab';

export function Scale() {
  const { t, nm, keyName, cur, sc, consistent, diff } = useLab();
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
  return (
    <>
      <p className="desc">{t.scaleDesc}</p>
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
    </>
  );
}
