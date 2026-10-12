import { playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { Predict, Recap, Transfer } from '../components/Learn';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { Bar, Board, Notes, PlayButton } from '../components/ui';
import { extras } from '../i18n/lessons/extras/func';
import { pcOf } from '../theory';
import { useLab } from '../state/useLab';

export function Func() {
  const { s, t, nm, keyName, cur, sc } = useLab();
  const X = extras[s.lang];
  const c = pcOf(cur) + 12;
  const sub = c - 7;
  const lt = c - 1;
  const dom = c + 7;
  const lay = rangeAround(sub, dom);
  const marks: Record<number, Mark> = {
    [sub]: roleMark(sub, 'sub', 4, nm(sc[3])),
    [lt]: roleMark(lt, 'lt', 7, nm(sc[6])),
    [c]: roleMark(c, 'tonic', 1, nm(sc[0])),
    [dom]: roleMark(dom, 'dom', 5, nm(sc[4])),
  };
  const reset = `${s.k}${s.enh}`;
  return (
    <>
      <p className="desc">{t.funcDesc}</p>
      <Predict mode="key" resetOn={reset} lay={rangeAround(c - 9, c + 7)} anyOctave
        marks={{ [c]: roleMark(c, 'tonic', 1, nm(sc[0])) }}
        prompt={X.pSub(nm(sc[0]))} answer={[sub]} reveal={X.pSubRev(nm(sc[3]))} />
      <Predict mode="choice" resetOn={reset} prompt={X.pSide(keyName(cur))} options={X.sides} answer={X.sides[0]} reveal={X.pSideRev} />
      <Bar now={keyName(cur)}>
        <PlayButton label={t.playFunc} onPlay={() => playNotes([{ s: lt, t: 0, d: 0.75 }, { s: c, t: 0.7, d: 1.3 }], 'func')} />
        <PlayButton label={X.playVI} seconds={2.4} onPlay={() => playNotes([
          { s: dom - 12, t: 0, d: 1.1 }, { s: lt, t: 0, d: 1.1 }, { s: c + 2, t: 0, d: 1.1 },
          { s: c - 12, t: 1.1, d: 1.4 }, { s: c, t: 1.1, d: 1.4 }, { s: c + 4, t: 1.1, d: 1.4 },
        ], 'func')} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} top={72} channel="func"
          label={`${nm(sc[3])} 4, ${nm(sc[6])} 7, ${nm(sc[0])} 1, ${nm(sc[4])} 5`}
          ann={(l) => {
            const x1 = l.c(lt);
            const x2 = l.c(c);
            return (<>
              <defs>
                <marker id="fa" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M1 1L8 5L1 9" fill="none" stroke="var(--change)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>
              <Bracket lay={l} a={sub} b={c} y={26} label={t.fifthBelow} />
              <Bracket lay={l} a={c} b={dom} y={26} label={t.fifthAbove} />
              <path className="pull" d={`M${(x1 - 2).toFixed(1)} 52 Q${((x1 + x2) / 2).toFixed(1)} 40 ${(x2 - 2).toFixed(1)} 51`}
                fill="none" stroke="var(--change)" strokeWidth="1.8" markerEnd="url(#fa)" />
            </>);
          }} />
      </Board>
      <Notes more={[4]} items={[
        { color: 'var(--k-sub)', html: t.fSub(nm(sc[3]), keyName(sc[3])) },
        { color: 'var(--k-dom)', html: X.dom(nm(sc[4]), keyName(sc[4])) },
        { color: 'var(--k-lt)', html: t.fLt(nm(sc[6]), nm(sc[0])) },
        { color: 'var(--k-tonic)', html: X.why(nm(sc[4]), nm(sc[6]), nm(sc[1]), nm(sc[0]), nm(sc[3])) },
        { color: 'var(--k-tonic)', html: t.fTonic(nm(sc[0])) },
      ]} />
      <Transfer question={X.transfer} />
      <Recap {...X.recap} />
    </>
  );
}
