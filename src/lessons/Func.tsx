import { playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { Bar, Board, Notes, PlayButton } from '../components/ui';
import { pcOf } from '../theory';
import { useLab } from '../state/useLab';

export function Func() {
  const { t, nm, keyName, cur, sc } = useLab();
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
  return (
    <>
      <p className="desc">{t.funcDesc}</p>
      <Bar now={keyName(cur)}>
        <PlayButton label={t.playFunc} onPlay={() => playNotes([{ s: lt, t: 0, d: 0.75 }, { s: c, t: 0.7, d: 1.3 }], 'func')} />
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
      <Notes items={[
        { color: 'var(--k-tonic)', html: t.fTonic(nm(sc[0])) },
        { color: 'var(--k-sub)', html: t.fSub(nm(sc[3]), keyName(sc[3])) },
        { color: 'var(--k-dom)', html: t.fDom(nm(sc[4]), keyName(sc[4])) },
        { color: 'var(--k-lt)', html: t.fLt(nm(sc[6]), nm(sc[0])) },
      ]} />
    </>
  );
}
