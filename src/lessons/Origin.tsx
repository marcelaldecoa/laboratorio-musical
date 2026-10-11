import { playHz } from '../audio/audio';
import { Board, Seg } from '../components/ui';
import { fromFifthIndex } from '../theory';
import { setState } from '../state/store';
import { useLab } from '../state/useLab';

const C4 = 261.63;

export function Origin() {
  const { s, t, nm } = useLab();
  const pure = s.tune !== 'eq';
  const cx = 180;
  const cy = 180;
  const pts: [number, number, number, number][] = [];
  for (let k = 0; k <= 12; k++) {
    const cents = pure ? (k * 701.955) % 1200 : (k * 700) % 1200;
    const a = (cents / 1200) * 2 * Math.PI - Math.PI / 2;
    const r = pure ? 64 + k * 8 : 128;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a), r, a]);
  }
  const read = pure ? t.readPure : t.readEq;
  const strings: [number, string][] = [[1, t.stringWhole], [1 / 2, t.stringHalf], [2 / 3, t.stringTwoThirds], [3 / 4, t.stringThreeQuarters]];
  return (
    <>
      <p className="desc">{t.originDesc}</p>

      <h3 className="sub-h">{t.stringTitle}</h3>
      <p className="hint">{t.stringHint}</p>
      <div className="strings">
        {strings.map(([f, label]) => (
          <button key={label} type="button" className="string-row" onClick={() => playHz([{ hz: (C4 / 2) / f, t: 0, d: 1.4 }])}>
            <span className="string-track">
              <span className="string-vib" style={{ width: `${f * 100}%` }} />
            </span>
            <span className="string-label">{label}</span>
          </button>
        ))}
      </div>

      <div className="bar mt">
        <Seg value={s.tune} onChange={(v) => setState({ tune: v })} options={[{ v: 'pure', label: t.tunePure }, { v: 'eq', label: t.tuneEq }]} />
        <div className="row">
          <button type="button" className="play" onClick={() => {
            const g = pure ? C4 * 1.5 : C4 * Math.pow(2, 7 / 12);
            playHz([{ hz: C4, t: 0, d: 0.8 }, { hz: g, t: 0.75, d: 0.8 }, { hz: C4, t: 1.6, d: 1.8 }, { hz: g, t: 1.6, d: 1.8 }]);
          }}><span className="play-ic" aria-hidden="true">▶</span> {t.playFifth}</button>
          <button type="button" className="play" onClick={() => {
            const bs = pure ? (C4 * Math.pow(1.5, 12)) / 128 : C4;
            playHz([{ hz: C4, t: 0, d: 0.9 }, { hz: bs, t: 0.85, d: 0.9 }, { hz: C4, t: 1.8, d: 2.6 }, { hz: bs, t: 1.8, d: 2.6 }]);
          }}><span className="play-ic" aria-hidden="true">▶</span> {t.playComma}</button>
        </div>
      </div>
      <Board>
        <svg className="sq origin" viewBox="0 0 360 360" role="img" aria-label={read}>
          <line x1={cx} y1="62" x2={cx} y2="6" stroke="var(--muted)" strokeWidth="1" strokeDasharray="3 4" />
          {!pure && <circle cx={cx} cy={cy} r="128" fill="none" stroke="var(--line)" strokeWidth="1" />}
          <polyline key={s.tune} className="spiral" points={pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}
            fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinejoin="round" opacity=".8" pathLength={1} />
          {pts.map((p, k) => {
            const last = k === 12;
            if (!pure && last) return null;
            const col = k === 0 ? 'var(--k-tonic)' : last ? 'var(--change)' : 'var(--accent)';
            const lr = p[2] + 16;
            const lx = cx + lr * Math.cos(p[3]);
            const ly = cy + lr * Math.sin(p[3]);
            const name = k === 0 && !pure ? `${nm(fromFifthIndex(1))} = ${nm(fromFifthIndex(13))}` : nm(fromFifthIndex(1 + k));
            return (
              <g key={k}>
                <circle cx={p[0].toFixed(1)} cy={p[1].toFixed(1)} r={k === 0 || last ? 5 : 3.5} fill={col} />
                <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor="middle" dominantBaseline="central"
                  style={{ font: '500 12px var(--f-mono)', fill: last ? 'var(--change)' : 'var(--fg)' }}>{name}</text>
              </g>
            );
          })}
          {pure && <text x={cx + 26} y="36" dominantBaseline="central" style={{ font: '500 12px var(--f-mono)', fill: 'var(--change)' }}>{t.comma}</text>}
        </svg>
      </Board>
      <p className="readout">{read}</p>
    </>
  );
}
