import { playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark, type Role } from '../components/layout';
import { Board, Html, Legend, Notes, PlayButton } from '../components/ui';
import { note, pcOf } from '../theory';
import { useLab } from '../state/useLab';

export function Names() {
  const { t, nm, cur, sc } = useLab();
  const c = pcOf(cur) + 7;
  const lay = rangeAround(c - 7, c + 7);
  const P: [number, number, Role][] = [
    [c - 7, 3, 'sub'], [c - 3, 5, 'acc'], [c - 1, 6, 'lt'], [c, 0, 'tonic'], [c + 2, 1, 'chg'], [c + 4, 2, 'acc'], [c + 7, 4, 'dom'],
  ];
  const marks: Record<number, Mark> = {};
  P.forEach(([k, d, r]) => (marks[k] = roleMark(k, r, d + 1, nm(sc[d]))));
  const ys = [96, 91, 86, 81, 76];
  const xs = [100, 140, 180, 220, 260];
  const cap = t.staffCap(nm(note(0)), nm(note(4)));
  return (
    <>
      <p className="desc">{t.namesDesc}</p>
      <Board>
        <Keyboard lay={lay} marks={marks} top={100} channel="names" label={P.map(([, d]) => nm(sc[d])).join(' ')}
          ann={(l) => (<>
            <Bracket lay={l} a={c - 7} b={c + 7} y={22} label={t.mFifth} />
            <Bracket lay={l} a={c - 3} b={c + 4} y={48} label={t.mThird} />
            <Bracket lay={l} a={c - 1} b={c + 2} y={74} label={t.mStep} />
          </>)} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: t.lgTonic },
        { colors: ['var(--k-sub)', 'var(--k-dom)'], label: t.lgFifths },
        { color: 'var(--k-acc)', label: t.lgMed },
        { colors: ['var(--k-lt)', 'var(--k-chg)'], label: t.lgNb },
      ]} />
      <div className="degree-grid">
        {t.degreeNames.map((dn, i) => (
          <button key={i} type="button" className={'deg-card d' + i} onClick={() => playNotes([{ s: pcOf(cur), t: 0, d: 1 }, { s: pcOf(cur) + [0, 2, 4, 5, 7, 9, 11][i] + (i === 0 ? 12 : 0), t: 0.45, d: 1 }], 'names')}>
            <span className="deg-n">{i + 1}</span>
            <span className="deg-name">{dn}</span>
            <span className="deg-note">{nm(sc[i])}</span>
          </button>
        ))}
      </div>
      <Board className="mt">
        <svg className="sm staffint" viewBox="0 0 300 132" role="img" aria-label={cap}>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="40" x2="290" y1={46 + i * 10} y2={46 + i * 10} stroke="var(--fg)" strokeWidth="1" opacity=".7" />
          ))}
          <text x="44" y="76" className="mus" style={{ fontSize: 48, fill: 'var(--fg)' }}>𝄞</text>
          <line x1={xs[0] - 12} x2={xs[0] + 12} y1="96" y2="96" stroke="var(--fg)" strokeWidth="1" opacity=".7" />
          {xs.map((x, i) => {
            const end = i === 0 || i === 4;
            const col = end ? 'var(--accent)' : 'var(--fg)';
            return (
              <g key={i} className="staff-note" onClick={() => playNotes([{ s: [0, 2, 4, 5, 7][i], t: 0, d: 0.8 }])} style={{ cursor: 'pointer' }}>
                <ellipse cx={x} cy={ys[i]} rx="6.5" ry="4.6" transform={`rotate(-20 ${x} ${ys[i]})`} fill={col} />
                <text x={x} y="116" textAnchor="middle" style={{ font: '500 12px var(--f-mono)', fill: col }}>{i + 1}</text>
                <text x={x} y="30" textAnchor="middle" style={{ font: '400 12px var(--f-mono)', fill: 'var(--muted)' }}>{nm(note(i))}</text>
              </g>
            );
          })}
        </svg>
      </Board>
      <div className="bar"><Html as="p" className="readout" html={cap} />
        <PlayButton label={t.playFifth} onPlay={() => playNotes([0, 2, 4, 5, 7].map((s, i) => ({ s, t: i * 0.3, d: 0.45 })).concat([{ s: 0, t: 1.8, d: 1.2 }, { s: 7, t: 1.8, d: 1.2 }]))} />
      </div>
      <Notes items={t.nI.map((html) => ({ html }))} />
    </>
  );
}
