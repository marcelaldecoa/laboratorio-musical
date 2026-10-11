import { playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark, stepsFor } from '../components/layout';
import { Bar, Board, Html, Notes, PlayButton } from '../components/ui';
import { MAJOR_OFFSETS, census, pcOf, quality } from '../theory';
import { setState } from '../state/store';
import { useLab } from '../state/useLab';

const QC: Record<string, string> = { P: 'q-a', M: 'q-a', m: 'q-b', A: 'q-c', d: 'q-c' };

export function Intervals() {
  const { s, t, nm, sc } = useLab();
  const g = s.ivl || 5;
  const stp = g - 1;
  const r = s.ivr || 0;
  const ivName = (num: number, semis: number) => t.ivName(num, t.q[quality(num, semis)]);
  const rows = census(g);
  const p0 = pcOf(sc[r]);
  const size = rows[r].semis;
  const lay = rangeAround(p0, p0 + 12);
  const marks: Record<number, Mark> = {};
  const pts: number[] = [];
  for (let k = 0; k <= stp; k++) {
    const d = (r + k) % 7;
    const p = p0 + (k === 7 ? 12 : (MAJOR_OFFSETS[d] - MAJOR_OFFSETS[r] + 12) % 12);
    pts.push(p);
    marks[p] = roleMark(p, k === 0 || k === stp ? 'tonic' : 'scale', k + 1, nm(sc[d]));
  }
  const a = nm(sc[r]);
  const b = nm(sc[(r + stp) % 7]);
  const now = t.intNow(a, b, g, size, ivName(g, size));
  const play = (from = p0, to = p0 + size) =>
    playNotes([{ s: from, t: 0, d: 0.6 }, { s: to, t: 0.55, d: 0.6 }, { s: from, t: 1.2, d: 1.3, v: 0.55 }, { s: to, t: 1.2, d: 1.3, v: 0.55 }], 'int');
  return (
    <>
      <p className="desc">{t.intDesc}</p>
      <p className="rowlab">{t.intPick}</p>
      <div className="chips" role="group">
        {[2, 3, 4, 5, 6, 7, 8].map((n) => (
          <button key={n} type="button" className="chip neutral" aria-pressed={n === g} onClick={() => setState({ ivl: n })}>{t.ord(n)}</button>
        ))}
      </div>
      <div className="census">
        {rows.map((row) => (
          <button key={row.from} type="button" className="crow" aria-pressed={row.from === r} onClick={() => {
            setState({ ivr: row.from });
            const f = pcOf(sc[row.from]);
            play(f, f + row.semis);
          }}>
            <span>{nm(sc[row.from])}–{nm(sc[(row.from + stp) % 7])}</span>
            <span className="cbar" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => <i key={i} className={i < row.semis ? QC[row.quality] : ''} />)}
            </span>
            <span className={'cq ' + QC[row.quality] + 't'}>{row.semis} · {t.q[row.quality]}</span>
          </button>
        ))}
      </div>
      <Bar now={now}><PlayButton label={t.playInt} seconds={2.5} onPlay={() => play()} /></Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} steps={stepsFor(pts, t.W, t.H)} top={50} channel="int" label={now}
          ann={(l) => <Bracket lay={l} a={p0} b={p0 + size} y={22} label={`${size} ${t.steps}`} />} />
      </Board>
      <Html as="p" className="readout" html={t.intInv(b, a, ivName(9 - g, 12 - size), 12 - size, g, 9 - g, size)} />
      <h3 className="sub-h">{t.intWhyTitle}</h3>
      <Notes items={t.intWhy.map((html) => ({ html }))} />
    </>
  );
}
