import { playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout } from '../components/layout';
import { Bar, Board, Legend, PlayButton } from '../components/ui';
import { chordInfo, fifthIndex, fromFifthIndex, pcOf, triadSteps } from '../theory';
import { setState } from '../state/store';
import { useLab } from '../state/useLab';

const QCOL = {
  maj: ['var(--k-tonic)', 'var(--k-tonic-ink)'],
  min: ['var(--k-sub)', 'var(--k-sub-ink)'],
  dim: ['var(--k-lt)', 'var(--k-lt-ink)'],
} as const;

export function chordSemis(rootPc: number, q: 'maj' | 'min' | 'dim') {
  const [a, b] = triadSteps(q);
  return [rootPc, rootPc + a, rootPc + a + b];
}

export function Field() {
  const { s, t, nm, keyName, cur, sc } = useLab();
  const f0 = fifthIndex(sc[3]);
  const d = s.deg || 0;
  const ci = chordInfo(sc, d);
  const i = ci.slot;
  const third = i + (ci.quality === 'maj' ? 4 : -3);
  const fifth = i + (ci.quality === 'dim' ? -6 : 1);
  const role: Record<number, string> = { [i]: '1', [third]: '3', [fifth]: '5' };
  const QC = QCOL[ci.quality];
  const tests: ['maj' | 'min' | 'dim', string, number[]][] = [
    ['maj', t.tMaj, [i + 4, i + 1]], ['min', t.tMin, [i - 3, i + 1]], ['dim', t.tDim, [i - 3, i - 6]],
  ];
  const ghosts: Record<number, boolean> = {};
  tests.forEach(([q, , ss]) => { if (q !== ci.quality) ss.forEach((x) => { if (x < 0 || x > 6) ghosts[x] = true; }); });
  const W = 36;
  const G = 4;
  const from = -1;
  const to = 7;
  const X = (j: number) => 2 + (j - from) * (W + G);
  const names = [i, third, fifth].map((x) => nm(fromFifthIndex(f0 + x)));
  const label = nm(ci.root) + ci.suffix;
  const ps = chordSemis(pcOf(sc[d]), ci.quality);
  const [a, b] = triadSteps(ci.quality);
  const lay = layout(0, 19);
  const marks: Record<number, Mark> = {};
  ps.forEach((p, k) => (marks[p] = { fill: QC[0], ink: QC[1], label: ['1', '3', '5'][k], name: names[k] }));
  const play = (pp = ps) => playNotes([...pp.map((x, k) => ({ s: x, t: k * 0.35, d: 0.6 })), ...pp.map((x) => ({ s: x, t: 1.15, d: 1.6, v: 0.55 }))], 'field');

  const chip = (k: number) => {
    const c = chordInfo(sc, k);
    return (
      <button key={k} type="button" className={'chip ' + c.quality} aria-pressed={k === d} onClick={() => {
        setState({ deg: k });
        play(chordSemis(pcOf(sc[k]), c.quality));
      }}>
        {c.roman}<small>{nm(c.root) + c.suffix}</small>
      </button>
    );
  };
  const read = t.chordRead(label, names, a, b);
  return (
    <>
      <p className="desc">{t.fieldDesc}</p>
      <p className="rowlab">{t.orderScale}</p>
      <div className="chips" role="group">{[0, 1, 2, 3, 4, 5, 6].map(chip)}</div>
      <p className="rowlab">{t.orderWin}</p>
      <div className="chips" role="group">{[3, 0, 4, 1, 5, 2, 6].map(chip)}</div>
      <Board>
        <svg viewBox={`0 0 ${X(to) + W + 2} 100`} role="img" aria-label={`${label}: ${names.join(' ')}`}>
          <path d={`M${X(0)} 30 V22 H${X(6) + W} V30`} fill="none" stroke="var(--muted)" strokeWidth="1.2" />
          <text className="ann" x={(X(0) + X(6) + W) / 2} y="12" textAnchor="middle">{t.window} · {keyName(cur)}</text>
          {Array.from({ length: to - from + 1 }, (_, n) => {
            const j = from + n;
            const nn = fromFifthIndex(f0 + j);
            const x = X(j);
            const inW = j >= 0 && j <= 6;
            const r = role[j];
            if (inW && r)
              return (
                <g key={j} className="pop">
                  <rect x={x} y={36} width={W} height={54} rx={5} style={{ fill: QC[0], stroke: QC[0], strokeWidth: 1.2 }} />
                  <text x={x + W / 2} y={56} textAnchor="middle" dominantBaseline="central" style={{ font: '500 13px var(--f-mono)', fill: QC[1] }}>{nm(nn)}</text>
                  <text x={x + W / 2} y={76} textAnchor="middle" dominantBaseline="central" style={{ font: '500 12px var(--f-mono)', fill: QC[1] }}>{r}</text>
                </g>
              );
            if (inW)
              return (
                <g key={j}>
                  <rect x={x} y={36} width={W} height={54} rx={5} style={{ fill: 'var(--surface)', stroke: 'var(--accent)', strokeWidth: 1.2 }} />
                  <text x={x + W / 2} y={56} textAnchor="middle" dominantBaseline="central" style={{ font: '400 13px var(--f-mono)', fill: 'var(--muted)' }}>{nm(nn)}</text>
                </g>
              );
            const g = ghosts[j];
            return (
              <g key={j}>
                <rect x={x} y={36} width={W} height={54} rx={5} style={{ fill: 'transparent', stroke: g ? 'var(--change)' : 'var(--line)', strokeWidth: 1.2, strokeDasharray: '4 3' }} />
                <text x={x + W / 2} y={56} textAnchor="middle" dominantBaseline="central" style={{ font: '400 13px var(--f-mono)', fill: 'var(--muted)' }}>{nm(nn)}</text>
                {g && <text x={x + W / 2} y={76} textAnchor="middle" dominantBaseline="central" style={{ font: '500 13px var(--f-mono)', fill: 'var(--change)' }}>✗</text>}
              </g>
            );
          })}
        </svg>
      </Board>
      <ul className="tests">
        {tests.map(([q, txt, ss]) => {
          const ok = q === ci.quality;
          const miss = ss.filter((x) => x < 0 || x > 6).map((x) => nm(fromFifthIndex(f0 + x)));
          return (
            <li key={q}>
              <span className={ok ? 'ok' : 'no'}>{ok ? '✓' : '✗'}</span>
              <span>{txt} · {ok ? t.fits(names.join(' ')) : t.outside(miss.join(t.and))}</span>
            </li>
          );
        })}
      </ul>
      <Bar now={read}><PlayButton label={t.playChord} seconds={2.8} onPlay={() => play()} /></Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} channel="field" label={read}
          steps={[{ a: ps[0], b: ps[1], t: a }, { a: ps[1], b: ps[2], t: b }]} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: t.lgMaj },
        { color: 'var(--k-sub)', label: t.lgMin },
        { color: 'var(--k-lt)', label: t.lgDim },
      ]} />
    </>
  );
}
