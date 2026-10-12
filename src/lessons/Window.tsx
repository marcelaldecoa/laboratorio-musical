import { useRef } from 'react';
import { playNotes, seq } from '../audio/audio';
import { Predict, Recap, Transfer } from '../components/Learn';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { Board, Notes, PlayButton } from '../components/ui';
import { extras } from '../i18n/lessons/extras/win';
import { fifthIndex, fromFifthIndex, pcOf, scaleSemitones } from '../theory';
import { goToKey, setDirection } from '../state/store';
import { useLab } from '../state/useLab';

const DEG = [4, 1, 5, 2, 6, 3, 7];
const ROLE: Record<number, [string, string]> = {
  0: ['var(--k-sub)', 'var(--k-sub-ink)'], 1: ['var(--k-tonic)', 'var(--k-tonic-ink)'],
  2: ['var(--k-dom)', 'var(--k-dom-ink)'], 6: ['var(--k-lt)', 'var(--k-lt-ink)'],
};

export function Window() {
  const { s, t, nm, keyName, cur, sc } = useLab();
  const f0 = fifthIndex(sc[3]);
  const W = 34;
  const G = 4;
  const from = -2;
  const to = 8;
  const X = (j: number) => 2 + (j - from) * (W + G);
  const win = [0, 1, 2, 3, 4, 5, 6].map((j) => nm(fromFifthIndex(f0 + j))).join(' ');
  const slide = (d: 1 | -1) => {
    setDirection(d > 0 ? 'cw' : 'ccw');
    goToKey(s.k + d);
  };
  const sx = useRef<number | null>(null);
  const E = extras[s.lang];
  // predictions follow the current direction: clockwise = slide right
  const right = s.dir === 'cw';
  const b = pcOf(cur);
  const notes = scaleSemitones(b);
  const pMarks: Record<number, Mark> = {};
  notes.forEach((k, i) => (pMarks[k] = roleMark(k, i % 7 === 0 ? 'tonic' : 'scale', (i % 7) + 1, nm(sc[i % 7]))));
  const outN = nm(fromFifthIndex(right ? f0 : f0 + 6));
  const inN = nm(fromFifthIndex(right ? f0 + 7 : f0 - 1));
  const winNotes = [0, 1, 2, 3, 4, 5, 6].map((j) => nm(fromFifthIndex(f0 + j)));
  const reset = `${s.k}${s.enh}${s.dir}`;
  return (
    <>
      <p className="desc">{t.winDesc}</p>
      <Predict mode="choice" resetOn={reset} prompt={E.pOut(right)} options={winNotes} answer={outN}
        reveal={right ? E.pOutRevR(outN) : E.pOutRevL(outN)} />
      <Predict mode="key" resetOn={reset} lay={rangeAround(b, b + 12)} marks={pMarks} anyOctave
        prompt={E.pIn(right)} answer={[right ? notes[3] + 1 : notes[6] - 1]}
        reveal={right ? E.pInRevR(inN, outN) : E.pInRevL(inN, outN)} />
      <div className="bar">
        <span className="now">{win}</span>
        <div className="nav">
          <button type="button" onClick={() => slide(-1)}>{t.slideL}</button>
          <button type="button" onClick={() => slide(1)}>{t.slideR}</button>
        </div>
      </div>
      <Board>
        <svg
          className="win-line"
          viewBox={`0 0 ${X(to) + W + 2} 100`}
          role="img"
          aria-label={`${keyName(cur)}: ${win}`}
          style={{ touchAction: 'pan-y' }}
          onPointerDown={(e) => (sx.current = e.clientX)}
          onPointerUp={(e) => {
            if (sx.current == null) return;
            const dx = e.clientX - sx.current;
            sx.current = null;
            if (Math.abs(dx) > 40) slide(dx < 0 ? 1 : -1);
          }}
        >
          <path d={`M${X(0)} 30 V22 H${X(6) + W} V30`} fill="none" stroke="var(--muted)" strokeWidth="1.2" />
          <text className="ann" x={(X(0) + X(6) + W) / 2} y="12" textAnchor="middle">{keyName(cur)}</text>
          {Array.from({ length: to - from + 1 }, (_, i) => {
            const j = from + i;
            const n = fromFifthIndex(f0 + j);
            const x = X(j);
            const inW = j >= 0 && j <= 6;
            if (inW) {
              const r = ROLE[j] ?? ['var(--accent-soft)', 'var(--accent-ink)'];
              return (
                <g key={j} className="slot in" onClick={() => playNotes([{ s: pcOf(n), t: 0, d: 0.8 }])} style={{ cursor: 'pointer' }}>
                  <rect x={x} y={36} width={W} height={54} rx={5} style={{ fill: r[0], stroke: r[0], strokeWidth: 1.2 }} />
                  <text x={x + W / 2} y={56} textAnchor="middle" dominantBaseline="central" style={{ font: '500 13px var(--f-mono)', fill: r[1] }}>{nm(n)}</text>
                  <text x={x + W / 2} y={76} textAnchor="middle" dominantBaseline="central" style={{ font: '400 11px var(--f-mono)', fill: r[1] }}>{DEG[j]}</text>
                </g>
              );
            }
            const near = j === -1 || j === 7;
            return (
              <g key={j} className="slot out">
                <rect x={x} y={36} width={W} height={54} rx={5} style={{ fill: 'transparent', stroke: near ? 'var(--change)' : 'var(--line)', strokeWidth: 1.2, strokeDasharray: '4 3' }} />
                <text x={x + W / 2} y={56} textAnchor="middle" dominantBaseline="central" style={{ font: '500 13px var(--f-mono)', fill: near ? 'var(--fg)' : 'var(--muted)' }}>{nm(n)}</text>
                {near && <text x={x + W / 2} y={76} textAnchor="middle" dominantBaseline="central" style={{ font: '500 13px var(--f-mono)', fill: 'var(--change)' }}>{j < 0 ? '←' : '→'}</text>}
              </g>
            );
          })}
        </svg>
      </Board>
      <div className="bar">
        <span className="hint">{t.winSwipe}</span>
        <PlayButton label={t.playScale} seconds={3} onPlay={() => playNotes(seq(scaleSemitones(pcOf(cur))))} />
      </div>
      <Notes items={[
        { color: 'var(--accent-soft)', html: t.winRead(keyName(cur), win) },
        { color: 'var(--k-lt)', html: E.why(nm(sc[6]), nm(sc[3])) },
        { dash: 'var(--k-lt-line)', html: t.winR(nm(fromFifthIndex(f0)), nm(fromFifthIndex(f0 + 7)), keyName(fromFifthIndex(f0 + 2))) },
        { dash: 'var(--k-lt-line)', html: t.winL(nm(fromFifthIndex(f0 + 6)), nm(fromFifthIndex(f0 - 1)), keyName(fromFifthIndex(f0))) },
      ]} />
      <Transfer question={E.transfer} />
      <Recap {...E.recap} />
    </>
  );
}
