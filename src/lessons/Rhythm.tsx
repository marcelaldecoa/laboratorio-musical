import { useEffect, useRef, useState } from 'react';
import { type NoteEvent, playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { Predict, Recap } from '../components/Learn';
import { Bar, Board, Legend, Notes, PlayButton } from '../components/ui';
import { text } from '../i18n/lessons/rhythm';
import { useLessonText } from '../i18n/lessonText';
import { mod, pcOf } from '../theory';
import {
  METERS, type Meter, type MeterId, type NoteValue, RHYTHMS, type Rhythm as RhythmT, VALUES, VALUE_GLYPH, bar16, compareCounts,
  count16, fit, len16, meter as getMeter, onsets, onsetsPerCount, secondsPerCount, strength, tapsPerCount,
} from '../theory/rhythm';
import { useLab } from '../state/useLab';
import '../styles/rhythm.css';

const CH = 'rhy';
const ST_FILL = { strong: ['var(--k-tonic)', 'var(--k-tonic-ink)'], medium: ['var(--k-scale)', 'var(--k-scale-ink)'], weak: ['var(--k-path)', 'var(--k-path-ink)'] } as const;

interface Block { at: number; len: number; glyph?: string; over?: boolean; label?: string }
interface Row { label: string; sub?: string; blocks: Block[]; sel?: boolean }

const LW = 62;
const W = 360;

/** Piano-roll grid: count header (strong/weak) and rows of blocks measured in sixteenths. */
function Roll({ m, rows, pos, aria, overLabel, foot }: {
  m: Meter; rows: Row[]; pos: number; aria: string; overLabel: string;
  foot?: { label: string; cells: { text: string; ok: boolean }[] };
}) {
  const B = bar16(m);
  const C = count16(m);
  const cw = (W - LW - 4) / B;
  const X = (s: number) => LW + s * cw;
  const HH = 30;
  const RH = 34;
  const H = HH + 6 + rows.length * RH + (foot ? RH : 0) + 2;
  return (
    <svg className="rhy-roll" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={aria}>
      {Array.from({ length: m.counts }, (_, i) => {
        const st = strength(m, i);
        const [fill, ink] = ST_FILL[st];
        return (
          <g key={i}>
            <rect x={X(i * C) + 1} y={1} width={C * cw - 2} height={HH - 2} rx={5} fill={fill}
              stroke={pos === i ? 'var(--glow)' : 'none'} strokeWidth={pos === i ? 3 : 0} />
            <text className="rhy-count" x={X(i * C) + (C * cw) / 2} y={HH / 2 + 1} textAnchor="middle" dominantBaseline="central" style={{ fill: ink }}>{i + 1}</text>
          </g>
        );
      })}
      {Array.from({ length: B + 1 }, (_, s) => (
        <line key={s} x1={X(s)} x2={X(s)} y1={HH + 4} y2={H - 2} stroke={s % C === 0 ? 'var(--muted)' : 'var(--line)'}
          strokeWidth={s === 0 || s === B ? 2 : s % C === 0 ? 1 : 0.6} strokeDasharray={s === 0 || s === B || s % C === 0 ? undefined : '2 3'} />
      ))}
      {rows.map((r, ri) => {
        const y = HH + 6 + ri * RH;
        return (
          <g key={ri}>
            {r.sel && <rect x={0} y={y} width={LW - 4} height={RH - 4} rx={6} fill="var(--accent-soft)" />}
            {r.sub ? (
              <text className="mus rhy-glyph-l" x={14} y={y + RH / 2 - 4} textAnchor="middle" dominantBaseline="central"
                style={{ fill: r.sel ? 'var(--accent-ink)' : 'var(--fg)' }}>{r.label}</text>
            ) : (
              <text className="rhy-frac" x={LW / 2 - 2} y={y + RH / 2 - 1} textAnchor="middle" dominantBaseline="central"
                style={{ fill: 'var(--fg)' }}>{r.label}</text>
            )}
            {r.sub && <text className="rhy-frac" x={42} y={y + RH / 2 - 1} textAnchor="middle" dominantBaseline="central"
              style={{ fill: r.sel ? 'var(--accent-ink)' : 'var(--muted)' }}>{r.sub}</text>}
            {r.blocks.map((b, bi) => {
              const bx = X(b.at) + 1.5;
              const bw = b.len * cw - 3;
              return (
                <g key={bi}>
                  <rect x={bx} y={y + 2} width={bw} height={RH - 8} rx={4}
                    fill={b.over ? 'var(--k-chg)' : r.sel ? 'var(--k-scaleb)' : 'var(--k-scale)'}
                    stroke={b.over ? 'var(--change)' : 'none'} strokeWidth={b.over ? 1.6 : 0} strokeDasharray={b.over ? '5 3' : undefined} />
                  {b.over ? (
                    bw > 44 && <text className="rhy-over" x={bx + bw / 2} y={y + RH / 2 - 2} textAnchor="middle" dominantBaseline="central">{overLabel}</text>
                  ) : (
                    b.glyph && bw >= 12 && <text className="mus rhy-glyph" x={bx + Math.min(bw / 2, 13)} y={y + RH / 2 - 5} textAnchor="middle" dominantBaseline="central"
                      style={{ fill: r.sel ? 'var(--k-scaleb-ink)' : 'var(--k-scale-ink)' }}>{b.glyph}</text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
      {foot && (() => {
        const y = HH + 6 + rows.length * RH;
        return (
          <g>
            <text className="rhy-frac" x={LW / 2 - 2} y={y + RH / 2 - 1} textAnchor="middle" dominantBaseline="central" style={{ fill: 'var(--fg)' }}>{foot.label}</text>
            {foot.cells.map((c, i) => (
              <g key={i}>
                <rect x={X(i * C) + 1.5} y={y + 2} width={C * cw - 3} height={RH - 8} rx={4}
                  fill={c.ok ? 'var(--accent-soft)' : 'var(--change-soft)'} stroke={c.ok ? 'var(--accent)' : 'var(--change)'} strokeWidth={1.4} />
                <text className="rhy-res" x={X(i * C) + (C * cw) / 2} y={y + RH / 2 - 2} textAnchor="middle" dominantBaseline="central"
                  style={{ fill: c.ok ? 'var(--accent-ink)' : 'var(--change-ink)' }}>{(c.ok ? '✓ ' : '✗ ') + c.text}</text>
              </g>
            ))}
          </g>
        );
      })()}
    </svg>
  );
}

const glyphs = (r: RhythmT) => r.map((v) => VALUE_GLYPH[v]).join(' ');

export function Rhythm() {
  const { nm, keyName, cur, sc } = useLab();
  const t = useLessonText(text);
  const [mid, setMid] = useState<MeterId>('4/4');
  const [val, setVal] = useState<NoteValue>(4);
  const [bpm, setBpm] = useState(80);
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState(-1);
  const [pat, setPat] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'count' | 'tap' | 'done'>('idle');
  const [countIn, setCountIn] = useState(0);
  const [result, setResult] = useState<{ got: number[]; want: number[] } | null>(null);
  const timers = useRef<number[]>([]);
  const taps = useRef<number[]>([]);
  const tapStart = useRef(0);

  const m = getMeter(mid);
  const cd = secondsPerCount(bpm);
  const p0 = pcOf(cur);
  const third = p0 + mod(pcOf(sc[2]) - p0, 12);
  const fifth = p0 + mod(pcOf(sc[4]) - p0, 12);
  const patterns = RHYTHMS[mid];
  const rhythm = patterns[Math.min(pat, patterns.length - 1)];

  const clear = () => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  };
  const at = (fn: () => void, sec: number) => timers.current.push(window.setTimeout(fn, sec * 1000));
  useEffect(() => () => clear(), []);

  /** Metronome click on the keyboard: high tonic on count 1, the fifth on a medium beat, the tonic on weak beats. */
  const clickKey = (i: number) => {
    const st = strength(m, i);
    return st === 'strong' ? p0 + 12 : st === 'medium' ? fifth : p0;
  };

  useEffect(() => {
    if (!running) return;
    let i = 0;
    const tick = () => {
      const k = i % m.counts;
      playNotes([{ s: clickKey(k), t: 0, d: 0.12, v: k === 0 ? 0.85 : 0.45 }], CH);
      setPos(k);
      i++;
    };
    tick();
    const id = window.setInterval(tick, cd * 1000);
    return () => {
      clearInterval(id);
      setPos(-1);
    };
  }, [running, cd, mid, p0]);

  const stopAllHere = () => {
    clear();
    setRunning(false);
    setPhase('idle');
    setPos(-1);
  };

  /** Notes of a rhythm on the tonic chord: bass + root on count 1, chord tones elsewhere. */
  const rhythmEvents = (r: RhythmT, start = 0): NoteEvent[] => {
    const sx = secondsPerCount(bpm) / count16(m);
    const upper = [third, fifth, p0 + 12, fifth];
    const ev: NoteEvent[] = [];
    onsets(r).forEach((o, i) => {
      const tt = start + o * sx;
      const d = Math.max(0.12, len16(r[i]) * sx * 0.92);
      const onCount = o % count16(m) === 0;
      const st = onCount ? strength(m, o / count16(m)) : 'weak';
      if (st === 'strong') ev.push({ s: p0 - 12, t: tt, d, v: 0.7 }, { s: p0, t: tt, d, v: 0.6 });
      else ev.push({ s: upper[i % upper.length], t: tt, d, v: st === 'medium' ? 0.6 : 0.45 });
    });
    return ev;
  };
  const showPos = (start: number, bars = 1) => {
    for (let i = 0; i < m.counts * bars; i++) at(() => setPos(i % m.counts), start + i * cd);
    at(() => setPos(-1), start + m.counts * bars * cd);
  };
  const playRhythm = (r: RhythmT) => {
    stopAllHere();
    playNotes(rhythmEvents(r), CH);
    showPos(0.05);
  };
  const playValue = (v: NoteValue) => {
    playRhythm(Array<NoteValue>(Math.max(1, fit(m, v).count)).fill(v));
  };

  const start = () => {
    stopAllHere();
    setResult(null);
    taps.current = [];
    const clicks: NoteEvent[] = [];
    for (let i = 0; i < m.counts * 2; i++) {
      const k = i % m.counts;
      clicks.push({ s: clickKey(k), t: i * cd, d: 0.12, v: k === 0 ? 0.85 : 0.45 });
    }
    playNotes(clicks, CH);
    const lead = 0.05;
    tapStart.current = performance.now() / 1000 + lead + m.counts * cd;
    setPhase('count');
    for (let i = 0; i < m.counts; i++) at(() => setCountIn(m.counts - i), lead + i * cd);
    at(() => setPhase('tap'), lead + (m.counts - 0.3) * cd);
    showPos(lead, 2);
    at(() => {
      const got = tapsPerCount(taps.current, tapStart.current, cd, m.counts, 0.3);
      setResult({ got, want: onsetsPerCount(rhythm, m) });
      setPhase('done');
    }, lead + (2 * m.counts + 0.4) * cd);
  };
  const tap = () => {
    if (phase !== 'tap' && phase !== 'count') {
      playNotes([{ s: third, t: 0, d: 0.25, v: 0.5 }], CH);
      return;
    }
    taps.current.push(performance.now() / 1000);
    playNotes([{ s: third, t: 0, d: 0.2, v: 0.55 }], CH);
  };

  /* --- grid rows --- */
  const B = bar16(m);
  const treeRows: Row[] = VALUES.map((v) => {
    const { count, rest16 } = fit(m, v);
    const L = len16(v);
    const blocks: Block[] = Array.from({ length: count }, (_, i) => ({ at: i * L, len: L, glyph: VALUE_GLYPH[v] }));
    if (rest16) blocks.push({ at: count * L, len: rest16, over: true });
    return { label: VALUE_GLYPH[v], sub: t.frac(v), blocks, sel: v === val };
  });
  const f = fit(m, val);
  const restCounts = f.rest16 / count16(m);
  const fitText = t.fitRead(f.count, t.values[val], t.plural[val], mid, f.rest16 ? t.restText(restCounts, t.values[m.unit]) : '');

  const patRow: Row = {
    label: t.rowWant,
    blocks: onsets(rhythm).map((o, i) => ({ at: o, len: len16(rhythm[i]), glyph: VALUE_GLYPH[rhythm[i]] })),
  };
  const ok = result ? compareCounts(result.want, result.got) : [];
  const foot = result
    ? { label: t.rowGot, cells: result.want.map((w, i) => ({ text: t.perCount(result.got[i], w), ok: ok[i] })) }
    : undefined;

  /* --- keyboard --- */
  const lay = rangeAround(p0 - 12, p0 + 12);
  const marks: Record<number, Mark> = {
    [p0 - 12]: roleMark(p0 - 12, 'tonic', 1, nm(sc[0])),
    [p0]: roleMark(p0, 'tonic', 1, nm(sc[0])),
    [p0 + 12]: roleMark(p0 + 12, 'tonic', 1, nm(sc[0])),
    [third]: roleMark(third, 'scale', 3, nm(sc[2])),
    [fifth]: roleMark(fifth, 'scale', 5, nm(sc[4])),
  };
  const key = keyName(cur);

  const legendBeats = [
    { color: 'var(--k-tonic)', label: t.lgStrong },
    ...(m.medium.length ? [{ color: 'var(--k-scale)', label: t.lgMedium }] : []),
    { color: 'var(--k-path)', label: t.lgWeak },
    { dash: 'var(--glow)', label: t.lgNow },
  ];

  const eighths = fit(m, 8).count;
  const p1opts = [eighths / 2, eighths, eighths * 2].map(String);

  const padText = phase === 'count' ? t.padCount(countIn) : phase === 'tap' ? t.padGo : t.pad;

  return (
    <>
      <p className="desc">{t.desc}</p>

      <h3 className="sub-h">{t.pulseTitle}</h3>
      <p className="hint">{t.pulseHint}</p>
      <Predict mode="choice" prompt={t.p2} options={t.p2opts} answer={t.p2opts[0]} reveal={t.p2r} />
      <p className="rowlab">{t.meterPick}</p>
      <div className="chips" role="group" aria-label={t.meterPick}>
        {METERS.map((id) => (
          <button key={id} type="button" className="chip neutral rhy-meter" aria-pressed={id === mid}
            onClick={() => { stopAllHere(); setMid(id); setPat(0); setResult(null); }}>{id}</button>
        ))}
      </div>
      <p className="readout">{t.meterRead[mid]}</p>
      <label className="rhy-range">
        <span>{t.bpm(bpm)}</span>
        <input type="range" min={40} max={160} step={4} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
      </label>
      <div className="row">
        <button type="button" className={'play' + (running ? ' on' : '')} aria-pressed={running}
          onClick={() => { const r = !running; stopAllHere(); setRunning(r); }}>
          <span className="play-ic" aria-hidden="true">{running ? '■' : '▶'}</span>
          <span>{running ? t.metroOff : t.metroOn}</span>
        </button>
      </div>

      <h3 className="sub-h">{t.treeTitle}</h3>
      <Predict mode="choice" resetOn={mid} prompt={t.p1(mid)} options={p1opts} answer={String(eighths)}
        reveal={t.p1r(mid, m.counts, m.unit, eighths)} />
      <p className="hint">{t.treeHint}</p>
      <div className="chips" role="group">
        {VALUES.map((v) => (
          <button key={v} type="button" className="chip neutral rhy-val" aria-pressed={v === val}
            onClick={() => { setVal(v); playValue(v); }}>
            <span className="mus rhy-chip-g" aria-hidden="true">{VALUE_GLYPH[v]}</span>
            <small>{t.values[v]}</small>
          </button>
        ))}
      </div>
      <Board className="rhy-board">
        <Roll m={m} rows={treeRows} pos={pos} aria={t.gridAria(mid)} overLabel={t.overLabel} />
      </Board>
      <Legend items={[...legendBeats, { colors: ['var(--k-scale)', 'var(--k-scaleb)'], label: t.values[val] }, { color: 'var(--k-chg)', dash: 'var(--change)', label: t.lgOver }]} />
      <p className="readout">{fitText}</p>
      <div className="row mt">
        <PlayButton label={t.playValue(t.values[val])} seconds={B / count16(m) * cd} onPlay={() => playValue(val)} />
      </div>

      <h3 className="sub-h">{t.kbdTitle}</h3>
      <p className="hint">{t.kbdHint(key)}</p>
      <Bar now={<span className="mus rhy-now">{glyphs(rhythm)}</span>}>
        <PlayButton label={t.listen} seconds={m.counts * cd} onPlay={() => playRhythm(rhythm)} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} channel={CH} label={t.kbdAria(key)} />
      </Board>
      <Legend items={[{ color: 'var(--k-tonic)', label: t.lgRoot }, { color: 'var(--k-scale)', label: t.lgChord }]} />

      <h3 className="sub-h">{t.tapTitle}</h3>
      <p className="hint">{t.tapHint}</p>
      <p className="rowlab">{t.patternPick}</p>
      <div className="chips" role="group" aria-label={t.patternPick}>
        {patterns.map((r, i) => (
          <button key={i} type="button" className="chip neutral rhy-pat" aria-pressed={i === pat}
            onClick={() => { stopAllHere(); setPat(i); setResult(null); playRhythm(r); }}>
            <span className="mus">{glyphs(r)}</span>
          </button>
        ))}
      </div>
      <Board className="rhy-board">
        <Roll m={m} rows={[patRow]} pos={pos} aria={result ? t.feedbackAria : t.gridAria(mid)} overLabel={t.overLabel} foot={foot} />
      </Board>
      <div className="row mt">
        <PlayButton label={t.listen} seconds={m.counts * cd} onPlay={() => playRhythm(rhythm)} />
        <button type="button" className="btn primary" onClick={start} disabled={phase === 'count' || phase === 'tap'}>{t.start}</button>
      </div>
      <button type="button" className={'rhy-pad' + (phase === 'tap' ? ' go' : phase === 'count' ? ' ready' : '')}
        onPointerDown={(e) => { e.preventDefault(); tap(); }}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) tap(); } }}>
        {phase === 'idle' || phase === 'done' ? (phase === 'idle' ? t.padIdle : t.pad) : padText}
      </button>
      {result && (
        <div className={'feedback mt ' + (ok.every(Boolean) ? 'ok' : 'no')} role="status">
          {t.result(ok.filter(Boolean).length, ok.length)}
        </div>
      )}

      <h3 className="sub-h">{t.whyTitle}</h3>
      <Notes items={t.why.map((html) => ({ html }))} more={[4, 5]} />
      <Recap {...t.recap} />
    </>
  );
}
