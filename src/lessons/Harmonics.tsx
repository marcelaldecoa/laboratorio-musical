import { useEffect, useRef, useState } from 'react';
import { later, playHz, playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Bar, Board, Legend, Notes, PlayButton } from '../components/ui';
import { text } from '../i18n/lessons/harmonics';
import { useLessonText } from '../i18n/lessonText';
import { pcOf } from '../theory';
import { JUST_INTERVALS, type Harmonic, harmonicSeries, isOff, keyHz, sharedHarmonics } from '../theory/physics';
import { useLab } from '../state/useLab';
import '../styles/physics.css';

type View = 'all' | 'oct' | 'fifth' | 'fourth' | 'triad';
const VIEWS: View[] = ['all', 'oct', 'fifth', 'fourth', 'triad'];
const FOCUS: Record<View, number[]> = { all: [], oct: [1, 2], fifth: [2, 3], fourth: [3, 4], triad: [4, 5, 6] };
const N = 16;
const MINOR = new Set(['m3', 'm2']);

/** Static drawing of a string in modes 1–4 (the wave swings only if the user allows motion). */
function StringModes({ labels, aria, onPick }: { labels: string[]; aria: string; onPick: (n: number) => void }) {
  const x0 = 24;
  const x1 = 336;
  const rowH = 58;
  const amp = 13;
  const wave = (n: number, y: number, sgn: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 96; i++) {
      const u = i / 96;
      pts.push(`${(x0 + u * (x1 - x0)).toFixed(1)},${(y - sgn * amp * Math.sin(n * Math.PI * u)).toFixed(1)}`);
    }
    return pts.join(' ');
  };
  return (
    <svg className="sm phys-modes" viewBox={`0 0 360 ${rowH * 4 + 6}`} role="img" aria-label={aria}>
      {[1, 2, 3, 4].map((n, k) => {
        const y = 38 + k * rowH;
        return (
          <g key={n} className="phys-mode" onClick={() => onPick(n)} style={{ cursor: 'pointer' }}>
            <rect x={0} y={y - 34} width={360} height={rowH} fill="transparent" />
            <text className="phys-mlab" x={x0} y={y - 20}>{labels[k]}</text>
            <polyline points={wave(n, y, -1)} fill="none" stroke="var(--line)" strokeWidth={1.2} strokeDasharray="3 3" />
            <polyline className="phys-wave" points={wave(n, y, 1)} fill="none" stroke="var(--accent)" strokeWidth={2.2}
              style={{ transformOrigin: `0px ${y}px`, animationDuration: `${(0.9 / n).toFixed(2)}s` }} />
            {Array.from({ length: n + 1 }, (_, j) => (
              <circle key={j} cx={x0 + (j / n) * (x1 - x0)} cy={y} r={j === 0 || j === n ? 4 : 3.4}
                fill={j === 0 || j === n ? 'var(--fg)' : 'var(--change)'} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function Harmonics() {
  const { s, nm, cur } = useLab();
  const reset = s.k + s.enh + s.lang + s.nt;
  const t = useLessonText(text);
  const [view, setView] = useState<View>('all');
  const [sel, setSel] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [build, setBuild] = useState(6);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const p0 = pcOf(cur);
  const F = p0 - 24;
  const f0 = keyHz(F);
  const series = harmonicSeries(cur, N);
  const fName = nm(cur);
  const keyOf = (h: Harmonic) => F + h.semis;
  const ratioOf = (h: Harmonic) => `${h.ratio[0]}:${h.ratio[1]}`;
  const focus = FOCUS[view];
  const lay = rangeAround(F, F + 48);

  const marks: Record<number, Mark> = {};
  for (const h of series) {
    const s = keyOf(h);
    const role = view !== 'all' && !focus.includes(h.n) ? 'start' : h.semis % 12 === 0 || view === 'triad' ? 'tonic' : isOff(h.n) ? 'chg' : 'scale';
    marks[s] = roleMark(s, role, h.n, nm(h.note));
    if (h.n === active) marks[s] = { ...marks[s], fill: 'var(--glow)', ink: 'var(--k-lt-ink)' };
  }

  const flash = (n: number, at: number, dur: number) => {
    later(() => alive.current && setActive(n), at);
    later(() => alive.current && setActive((a) => (a === n ? null : a)), at + dur);
  };
  const playOne = (h: Harmonic) => {
    setSel(h.n);
    playHz([{ hz: f0 * h.n, t: 0, d: 0.9 }]);
    flash(h.n, 0, 0.9);
    playNotes([{ s: keyOf(h), t: 1.0, d: 1.0 }], 'harm');
  };
  const playSeries = () => {
    const gap = 0.42;
    playHz(series.map((h, i) => ({ hz: f0 * h.n, t: i * gap, d: 0.55 })));
    series.forEach((h, i) => flash(h.n, i * gap, gap));
  };
  const play456 = () => {
    const tri = [4, 5, 6];
    playHz([...tri.map((n, i) => ({ hz: f0 * n, t: i * 0.4, d: 0.5 })), ...tri.map((n) => ({ hz: f0 * n, t: 1.3, d: 1.6 }))]);
    tri.forEach((n, i) => flash(n, i * 0.4, 0.4));
    const ps = tri.map((n) => keyOf(series[n - 1]));
    playNotes([...ps.map((s) => ({ s, t: 3.2, d: 1.8, v: 0.55 }))], 'harm');
  };
  const playBuild = () => {
    const ev = [];
    // real strings get quieter higher up: harmonic n at about 1/n keeps the sum from clipping
    for (let n = 1; n <= build; n++) ev.push({ hz: f0 * n, t: (n - 1) * 0.12, d: 2.6 - (n - 1) * 0.12, v: 0.6 / n });
    playHz(ev);
  };
  const playView = () => {
    if (view === 'all') return playSeries();
    if (view === 'triad') return play456();
    const [a, b] = focus;
    playHz([{ hz: f0 * a, t: 0, d: 0.7 }, { hz: f0 * b, t: 0.6, d: 0.7 }, { hz: f0 * a, t: 1.3, d: 1.6 }, { hz: f0 * b, t: 1.3, d: 1.6 }]);
    flash(a, 0, 0.6);
    flash(b, 0.6, 0.6);
  };

  const selH = sel ? series[sel - 1] : null;
  const now = selH ? t.now(selH.n, nm(selH.note), ratioOf(selH), t.offText(selH.off)) : t.nowIdle;

  const ann = (l: typeof lay) => {
    if (view === 'all') return null;
    const k = (n: number) => keyOf(series[n - 1]);
    if (view === 'triad')
      return (
        <>
          <Bracket lay={l} a={k(4)} b={k(5)} y={30} label={`${t.ivShort.M3} · 5:4`} />
          <Bracket lay={l} a={k(5)} b={k(6)} y={30} label="" />
          <text className="ann" x={((l.c(k(5)) + l.c(k(6))) / 2 + 14).toFixed(1)} y={14} textAnchor="start">{`${t.ivShort.m3} · 6:5`}</text>
        </>
      );
    const [a, b] = focus;
    const name = t.ivShort[view as 'oct' | 'fifth' | 'fourth'];
    return <Bracket lay={l} a={k(a)} b={k(b)} y={30} label={t.bracket(name, `${b}:${a}`, k(b) - k(a))} />;
  };

  const viewPlayLabel = view === 'triad' ? t.play456 : view === 'all' ? t.playSeries : t.views[view];

  return (
    <>
      <p className="desc">{t.desc}</p>

      <h3 className="sub-h">{t.stringTitle}</h3>
      <p className="hint">{t.stringHint}</p>
      <Board>
        <StringModes labels={t.modes} aria={t.stringAria} onPick={(n) => playOne(series[n - 1])} />
      </Board>

      <h3 className="sub-h">{t.seriesTitle}</h3>
      <Predict mode="key" prompt={t.pH3(fName)} lay={rangeAround(F, F + 24)} answer={[F + 19]} anyOctave resetOn={reset}
        marks={{ [F]: roleMark(F, 'tonic', 1, nm(series[0].note)), [F + 12]: roleMark(F + 12, 'tonic', 2, nm(series[1].note)) }}
        reveal={t.pH3Rev(nm(series[2].note))} />
      <p className="hint">{t.seriesHint(fName)}</p>
      <p className="rowlab">{t.viewPick}</p>
      <div className="chips" role="group" aria-label={t.viewPick}>
        {VIEWS.map((v) => (
          <button key={v} type="button" className="chip neutral" aria-pressed={v === view} onClick={() => setView(v)}>{t.views[v]}</button>
        ))}
      </div>
      <Bar now={now}>
        <PlayButton label={viewPlayLabel} seconds={view === 'all' ? 7 : view === 'triad' ? 5 : 3} onPlay={playView} />
        {view !== 'triad' && <PlayButton label={t.play456} seconds={5} onPlay={play456} />}
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} top={56} channel="harm" minWidth={lay.width} label={t.kbdAria(fName)} ann={ann}
          onKey={(s) => {
            const h = series.find((x) => keyOf(x) === s);
            if (h) playOne(h);
            else playNotes([{ s, t: 0, d: 1.1 }], 'harm');
          }} />
      </Board>
      <Legend items={[
        ...(view === 'triad'
          ? [{ color: 'var(--k-tonic)', label: t.lgTriad }]
          : [
              { color: 'var(--k-tonic)', label: t.lgOct },
              { color: 'var(--k-scale)', label: t.lgIn },
              { color: 'var(--k-chg)', label: t.lgOff },
            ]),
        { color: 'var(--glow)', label: t.lgNow },
        ...(view !== 'all' ? [{ color: 'var(--k-start)', label: t.lgOther }] : []),
      ]} />
      <p className="readout">{t.viewRead[view]}</p>

      <h3 className="sub-h">{t.tableTitle}</h3>
      <p className="hint">{t.tableHint}</p>
      <div className="phys-grid">
        {series.map((h) => {
          const off = isOff(h.n);
          const oct = h.semis % 12 === 0;
          return (
            <button key={h.n} type="button" className={'phys-cell' + (off ? ' off' : oct ? ' oct' : '')} aria-pressed={sel === h.n}
              onClick={() => playOne(h)}>
              <span className="phys-n">{h.n}</span>
              <span className="phys-name">{nm(h.note)}</span>
              <span className="phys-ratio">{ratioOf(h)}</span>
              <span className="phys-c">{t.cents(h.off)}</span>
            </button>
          );
        })}
      </div>
      <p className="hint mt">{t.offNote}</p>

      <h3 className="sub-h">{t.buildTitle}</h3>
      <p className="hint">{t.buildHint}</p>
      <label className="phys-range">
        <span>{t.buildLabel(build)}</span>
        <input type="range" min={1} max={N} value={build} onChange={(e) => setBuild(Number(e.target.value))} />
      </label>
      <Board>
        <svg className="phys-spec" viewBox="0 0 340 92" role="img" aria-label={t.buildAria(build)}>
          <line x1={10} y1={70} x2={330} y2={70} stroke="var(--line)" strokeWidth={1.2} />
          {series.map((h) => {
            const x = 10 + h.n * 19;
            const on = h.n <= build;
            const fill = !on ? 'var(--line)' : h.semis % 12 === 0 ? 'var(--accent)' : isOff(h.n) ? 'var(--change)' : 'var(--k-scaleb)';
            return (
              <g key={h.n}>
                <rect x={x - 5} y={on ? 14 : 52} width={10} height={on ? 56 : 18} rx={2} fill={fill} />
                <text className="phys-tick" x={x} y={84} textAnchor="middle">{h.n}</text>
              </g>
            );
          })}
          <text className="phys-tick" x={330} y={10} textAnchor="end">{t.buildAxis}</text>
        </svg>
      </Board>
      <div className="row mt"><PlayButton label={t.buildPlay(build)} seconds={2.6} onPlay={playBuild} /></div>

      <h3 className="sub-h">{t.consTitle}</h3>
      <Predict mode="choice" prompt={t.pCons} options={t.pConsOpts} answer={t.pConsOpts[1]} reveal={t.pConsRev} resetOn={s.lang} />
      <p className="hint">{t.consHint(fName)}</p>
      <div className="census">
        {JUST_INTERVALS.map((iv) => {
          const sh = sharedHarmonics(iv.p, iv.q, N);
          const cls = MINOR.has(iv.id) ? 'q-b' : 'q-a';
          return (
            <button key={iv.id} type="button" className="crow phys-crow" onClick={() => {
              const lo = keyHz(p0);
              const hi = (lo * iv.p) / iv.q;
              playHz([{ hz: lo, t: 0, d: 0.7 }, { hz: hi, t: 0.6, d: 0.7 }, { hz: lo, t: 1.3, d: 1.6 }, { hz: hi, t: 1.3, d: 1.6 }]);
            }}>
              <span>{t.ivNames[iv.id]} <small className="phys-r">{iv.p}:{iv.q}</small></span>
              <span className="phys-cbar" aria-hidden="true">
                {Array.from({ length: N }, (_, i) => <i key={i} className={sh.includes(i + 1) ? cls : ''} />)}
              </span>
              <span className={'cq ' + cls + 't'}>{t.shared(sh.length)}</span>
            </button>
          );
        })}
      </div>

      <h3 className="sub-h">{t.whyTitle}</h3>
      <Notes items={t.why.map((html) => ({ html }))} more={t.more} />
      <Transfer question={t.transfer} />
      <Recap {...t.recap} />
    </>
  );
}
