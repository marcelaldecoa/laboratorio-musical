import { playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, roleMark } from '../components/layout';
import { Bar, Board, Legend, PlayButton } from '../components/ui';
import { pcOf } from '../theory';
import { useLab } from '../state/useLab';

export function Jump() {
  const { s, t, nm, pred, lcur, diff } = useLab();
  const up = s.dir === 'cw' ? 7 : 5;
  const s0 = pcOf(pred);
  const marks: Record<number, Mark> = {};
  for (let i = 0; i <= up; i++) {
    const k = s0 + i;
    if (i === 0) marks[k] = roleMark(k, 'start', '0', nm(pred));
    else if (i === up) marks[k] = roleMark(k, 'tonic', i, nm(lcur));
    else marks[k] = roleMark(k, 'path', i);
  }
  if (diff && s.dir === 'cw') marks[s0 + 6] = roleMark(s0 + 6, 'chg', 6, nm({ letter: diff.letter, acc: diff.to }));
  const a = s0;
  const b = s0 + up;
  return (
    <>
      <p className="desc">{t.jumpDesc}</p>
      <Bar now={`${nm(pred)} → ${nm(lcur)} · ${up} ${t.steps}`}>
        <PlayButton label={t.playJump} seconds={2.6} onPlay={() =>
          playNotes([{ s: a, t: 0, d: 0.7 }, { s: b, t: 0.6, d: 0.7 }, { s: a, t: 1.35, d: 1.2 }, { s: b, t: 1.35, d: 1.2 }], 'jump')} />
      </Bar>
      <Board><Keyboard marks={marks} channel="jump" label={`${nm(pred)} → ${nm(lcur)}`} /></Board>
      <Legend items={[
        { color: 'var(--k-start)', label: t.lgStart },
        { color: 'var(--k-path)', label: t.lgPath },
        { color: 'var(--k-tonic)', label: t.lgDest },
        { color: 'var(--k-chg)', label: t.lgChg },
      ]} />
    </>
  );
}
