import { playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { Predict, Recap, Transfer } from '../components/Learn';
import { type Mark, rangeAround, roleMark, stepsFor } from '../components/layout';
import { Bar, Board, Legend, Notes, PlayButton } from '../components/ui';
import { extras } from '../i18n/lessons/extras/tetra';
import { SHARP_ORDER, majorScale, note, pcOf, type Note } from '../theory';
import { useLab } from '../state/useLab';

export function Tetra() {
  const { s, t, nm, keyName, cur, sc } = useLab();
  const X = extras[s.lang];
  const b = pcOf(cur);
  const dsc = majorScale(sc[4]);
  const lay = rangeAround(b, b + 19);
  const T1 = [0, 2, 4, 5];
  const T2 = [7, 9, 11, 12];
  const T3 = [14, 16, 18, 19];
  const n1 = [sc[0], sc[1], sc[2], sc[3]];
  const n2 = [sc[4], sc[5], sc[6], sc[0]];
  const n3 = [dsc[4], dsc[5], dsc[6], dsc[0]];
  const marks: Record<number, Mark> = {};
  T1.forEach((o, i) => (marks[b + o] = roleMark(b + o, 'scale', i + 1, nm(n1[i]))));
  T2.forEach((o, i) => (marks[b + o] = roleMark(b + o, 'dom', i + 1, nm(n2[i]))));
  // the prediction shows the same chain with the third block's 3rd note left blank
  const pMarks: Record<number, Mark> = { ...marks };
  T3.forEach((o, i) => {
    if (i !== 2) pMarks[b + o] = roleMark(b + o, 'acc', i + 1, nm(n3[i]));
  });
  T3.forEach((o, i) => (marks[b + o] = roleMark(b + o, i === 2 ? 'lt' : 'acc', i + 1, nm(n3[i]))));
  const all = [...T1, ...T2, ...T3].map((o) => b + o);
  const j = (a: Note[]) => a.map(nm).join(' ');
  const sharps = SHARP_ORDER.map((l) => nm(note(l, 1))).join(' ');
  const reset = `${s.k}${s.enh}`;
  return (
    <>
      <p className="desc">{X.desc}</p>
      <Predict mode="choice" prompt={X.pSize} options={X.pSizeOpts} answer={X.pSizeAns} reveal={X.pSizeRev} />
      <Predict mode="key" resetOn={reset} lay={lay} marks={pMarks} top={30}
        prompt={X.pAcc(nm(n3[0]))} answer={[b + 18]}
        reveal={X.pAccRev(nm(n3[1]), nm(n3[2]), keyName(sc[4]))} />
      <Bar now={`${j(n1)} · ${j(n2)} · ${j(n3)}`}>
        <PlayButton label={t.playTetra} seconds={4.6} onPlay={() =>
          playNotes(all.map((s, i) => ({ s, t: i * 0.3 + Math.floor(i / 4) * 0.35, d: 0.45 })), 'tetra')} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} steps={stepsFor(all, t.W, t.H)} top={78} channel="tetra"
          label={`${j(n1)} | ${j(n2)} | ${j(n3)}`}
          ann={(l) => (<>
            <Bracket lay={l} a={b} b={b + 12} y={22} label={keyName(cur)} />
            <Bracket lay={l} a={b + 7} b={b + 19} y={50} label={keyName(sc[4])} />
          </>)} />
      </Board>
      <Legend items={[
        { color: 'var(--k-scale)', label: t.lgT1 },
        { color: 'var(--k-dom)', label: t.lgT2 },
        { color: 'var(--k-acc)', label: t.lgT3 },
        { color: 'var(--k-lt)', label: t.lgTch },
      ]} />
      <Notes more={[4, 5]} items={[
        { color: 'var(--k-scale)', html: t.tetN1(keyName(cur), j(n1), j(n2)) },
        { color: 'var(--k-lt)', html: t.tetN2(j(n2), keyName(sc[4]), j(n3), nm(dsc[6])) },
        { color: 'var(--k-acc)', html: t.tetN4 },
        { color: 'var(--k-lt)', html: X.sharps(keyName(note(0)), sharps) },
        { color: 'var(--k-dom)', html: t.tetN3 },
        { color: 'var(--line)', html: X.history },
      ]} />
      <Transfer question={X.transfer} />
      <Recap {...X.recap} />
    </>
  );
}
