import { playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { Predict, Recap, Transfer } from '../components/Learn';
import { type Mark, rangeAround, roleMark, stepsFor } from '../components/layout';
import { Bar, Board, Notes, PlayButton } from '../components/ui';
import { extras } from '../i18n/lessons/extras/tri';
import { pcOf } from '../theory';
import { useLab } from '../state/useLab';

export function Tritone() {
  const { s: st, t, nm, keyName, cur, sc } = useLab();
  const X = extras[st.lang];
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
  const [a, b, c, d] = [nm(sc[3]), nm(sc[6]), nm(sc[2]), nm(sc[0])];
  const reset = `${st.k}${st.enh}`;
  return (
    <>
      <p className="desc">{t.triDesc}</p>
      <Predict mode="choice" resetOn={reset} prompt={X.pMirror(a, b)} options={X.pMirrorOpts} answer={X.pMirrorAns} reveal={X.pMirrorRev} />
      <Bar now={`${a}–${b} · 6 ${t.steps}`}>
        <PlayButton label={t.playTri} seconds={3} onPlay={() => playNotes([
          { s, t: 0, d: 1.3 }, { s: s + 6, t: 0, d: 1.3 }, { s, t: 1.5, d: 1.3 }, { s: s + 7, t: 1.5, d: 1.3 },
        ], 'tri')} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} steps={stepsFor(R.map((o) => s + o), t.W, t.H)} top={74} channel="tri" label={`${a}–${b}`}
          ann={(l) => (<>
            <Bracket lay={l} a={s} b={s + 6} y={22} label={t.triB1} />
            <Bracket lay={l} a={s + 6} b={s + 12} y={48} label={t.triB2} />
          </>)} />
      </Board>
      <Predict mode="key" resetOn={reset} lay={rangeAround(s - 2, s + 9)}
        marks={{ [s]: roleMark(s, 'sub', 4, a), [s + 6]: roleMark(s + 6, 'lt', 7, b) }}
        prompt={X.pRes(b)} answer={[s + 7]} reveal={X.pResRev(a, b, c, d)} />
      <Notes more={[4]} items={[
        { color: 'var(--k-scale)', html: t.trMirror },
        { color: 'var(--k-lt)', html: X.devil },
        { color: 'var(--k-sub)', html: X.unique(a, b, keyName(cur)) },
        { color: 'var(--k-tonic)', html: t.trRes(a, b, c, d) },
        { color: 'var(--k-path)', html: X.name(a, nm(sc[4]), nm(sc[5]), b) },
      ]} />
      <Transfer question={X.transfer} />
      <Recap {...X.recap} />
    </>
  );
}
