import { playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark, stepsFor } from '../components/layout';
import { Bar, Board, Notes, PlayButton } from '../components/ui';
import { pcOf } from '../theory';
import { useLab } from '../state/useLab';

export function Tritone() {
  const { t, nm, keyName, cur, sc } = useLab();
  const s = pcOf(sc[3]);
  const R = [0, 2, 4, 6, 7, 9, 11, 12];
  const D = [3, 4, 5, 6, 0, 1, 2, 3];
  const lay = rangeAround(s, s + 12);
  const marks: Record<number, Mark> = {};
  R.forEach((o, i) => {
    const p = s + o;
    const d = D[i];
    const role = d === 3 ? 'sub' : d === 6 ? 'lt' : d === 0 ? 'tonic' : i < 3 ? 'path' : 'scale';
    marks[p] = roleMark(p, role, d + 1, nm(sc[d]));
  });
  return (
    <>
      <p className="desc">{t.triDesc}</p>
      <Bar now={`${nm(sc[3])}–${nm(sc[6])} · 6 ${t.steps}`}>
        <PlayButton label={t.playTri} seconds={3} onPlay={() => playNotes([
          { s, t: 0, d: 1.3 }, { s: s + 6, t: 0, d: 1.3 }, { s, t: 1.5, d: 1.3 }, { s: s + 7, t: 1.5, d: 1.3 },
        ], 'tri')} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} steps={stepsFor(R.map((o) => s + o), t.W, t.H)} top={74} channel="tri" label={`${nm(sc[3])}–${nm(sc[6])}`}
          ann={(l) => (<>
            <Bracket lay={l} a={s} b={s + 6} y={22} label={t.triB1} />
            <Bracket lay={l} a={s + 6} b={s + 12} y={48} label={t.triB2} />
          </>)} />
      </Board>
      <Notes items={[
        { color: 'var(--k-path)', html: t.trName(nm(sc[3]), nm(sc[4]), nm(sc[5]), nm(sc[6])) },
        { color: 'var(--k-scale)', html: t.trMirror },
        { color: 'var(--k-sub)', html: t.trUnique(nm(sc[3]), nm(sc[6]), keyName(cur)) },
        { color: 'var(--k-lt)', html: t.trRes(nm(sc[3]), nm(sc[6]), nm(sc[2]), nm(sc[0])) },
        { color: 'var(--line)', html: t.trDevil },
      ]} />
    </>
  );
}
