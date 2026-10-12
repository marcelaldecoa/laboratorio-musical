import { useEffect, useRef, useState } from 'react';
import { type NoteEvent, playNotes, stopAll } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, roleMark } from '../components/layout';
import { Predict, Recap } from '../components/Learn';
import { Board, Html, Legend, Notes, PlayButton } from '../components/ui';
import { type R2Id, text } from '../i18n/lessons/rhythm2';
import { useLessonText } from '../i18n/lessonText';
import { note } from '../theory';
import {
  type RExample, type RNote, REXAMPLES, TQ, VALUE_GLYPH, attacks, attacksPerBeat, compareCounts, startsT, syncopatedStarts,
  tapsPerCount, totalTicks,
} from '../theory/rhythm';
import { useLab } from '../state/useLab';
import '../styles/rhythm.css';

const CH = 'rhy2';
const BPM = 76;
const QS = 60 / BPM; // seconds per beat
const REST_GLYPH: Record<number, string> = { 1: '\u{1D13B}', 2: '\u{1D13C}', 4: '\u{1D13D}', 8: '\u{1D13E}', 16: '\u{1D13F}' };
/** degree inside C major of each semitone the examples use */
const DEG: Record<number, number> = { [-12]: 1, 0: 1, 2: 2, 4: 3, 5: 4, 7: 5, 9: 6, 11: 7, 12: 1 };
const LETTER: Record<number, number> = { [-12]: 0, 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6, 12: 0 };
const UPPER = [4, 7, 12, 7];
const CLICK = 24;

/** Beat numbers along the example: the pickup counts back from the end of a bar. */
const beatNumbers = (ex: RExample, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const pb = ex.pickup / TQ;
    return (((i - pb) % ex.beats) + ex.beats) % ex.beats + 1;
  });

const LW = 84;
const W = 380;

function Strip({ ex, rows, labels, pos, aria, foot, lbl }: {
  ex: RExample; rows: RNote[][]; labels: string[]; pos: number; aria: string;
  foot?: { label: string; cells: { text: string; ok: boolean }[] };
  lbl: { and: string };
}) {
  const total = totalTicks(rows[0]);
  const nBeats = total / TQ;
  const cw = (W - LW - 4) / total;
  const X = (t: number) => LW + t * cw;
  const HH = 26;
  const RH = 44;
  const CT = 18;
  const top = HH + 6;
  const H = top + rows.length * RH + CT + (foot ? RH - 6 : 0) + 4;
  const nums = beatNumbers(ex, nBeats);
  return (
    <svg className="rhy-roll rhy2-strip" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={aria}>
      {nums.map((b, i) => {
        const pick = i * TQ < ex.pickup;
        const strong = b === 1 && !pick;
        return (
          <g key={i}>
            <rect x={X(i * TQ) + 1} y={1} width={TQ * cw - 2} height={HH - 2} rx={5}
              fill={pick ? 'var(--surface-2)' : strong ? 'var(--k-tonic)' : 'var(--k-path)'}
              stroke={pos === i ? 'var(--glow)' : pick ? 'var(--line)' : 'none'} strokeWidth={pos === i ? 3 : 1}
              strokeDasharray={pick && pos !== i ? '4 3' : undefined} />
            <text className="rhy-count" x={X(i * TQ) + (TQ * cw) / 2} y={HH / 2 + 1} textAnchor="middle" dominantBaseline="central"
              style={{ fill: pick ? 'var(--fg)' : strong ? 'var(--k-tonic-ink)' : 'var(--k-path-ink)' }}>{b}</text>
          </g>
        );
      })}
      {Array.from({ length: nBeats * 2 + 1 }, (_, h) => {
        const t = (h * TQ) / 2;
        const bar = (t - ex.pickup) % (ex.beats * TQ) === 0 && t >= ex.pickup;
        const beat = h % 2 === 0;
        return (
          <line key={h} x1={X(t)} x2={X(t)} y1={top - 2} y2={top + rows.length * RH}
            stroke={bar ? 'var(--fg)' : beat ? 'var(--muted)' : 'var(--line)'} strokeWidth={bar ? 2.2 : beat ? 1 : 0.6}
            strokeDasharray={bar || beat ? undefined : '2 3'} />
        );
      })}
      {rows.map((r, ri) => {
        const y = top + ri * RH;
        const st = startsT(r);
        const syncStarts = syncopatedStarts(r);
        const triGroups: number[][] = [];
        r.forEach((n, i) => {
          if (!n.tri) return;
          const last = triGroups[triGroups.length - 1];
          if (last && last.length < 3 && last[last.length - 1] === i - 1) last.push(i);
          else triGroups.push([i]);
        });
        return (
          <g key={ri}>
            <text className="rhy-frac rhy2-lab" x={4} y={y + RH / 2 + 2} dominantBaseline="central" style={{ fill: 'var(--fg)' }}>{labels[ri]}</text>
            {r.map((n, i) => {
              const bx = X(st[i]) + 1.2;
              const bw = n.dur * cw - 2.4;
              const by = y + 12;
              const bh = RH - 18;
              const hot = !n.rest && (n.accent || syncStarts.has(st[i]));
              const glyph = n.rest ? REST_GLYPH[n.v] : VALUE_GLYPH[n.v] + (n.dot ? '.' : '');
              const main = n.dot ? (bw * 2) / 3 : bw;
              return (
                <g key={i}>
                  {n.rest ? (
                    <rect x={bx} y={by} width={bw} height={bh} rx={4} fill="none" stroke="var(--muted)" strokeWidth={1.3} strokeDasharray="4 3" />
                  ) : (
                    <>
                      <rect x={bx} y={by} width={main} height={bh} rx={4} fill={hot ? 'var(--k-chg)' : 'var(--k-scale)'}
                        stroke={hot ? 'var(--change)' : 'none'} strokeWidth={hot ? 1.6 : 0} />
                      {n.dot && <rect x={bx + main} y={by} width={bw - main} height={bh} rx={4} fill="var(--k-chg)" stroke="var(--change)" strokeWidth={1.2} strokeDasharray="3 2" />}
                    </>
                  )}
                  {bw >= 12 && (
                    <text className="mus rhy-glyph" x={bx + Math.min(main / 2, 12)} y={by + bh / 2 - 3} textAnchor="middle" dominantBaseline="central"
                      style={{ fill: n.rest ? 'var(--muted)' : hot ? 'var(--k-chg-ink)' : 'var(--k-scale-ink)' }}>{glyph}</text>
                  )}
                  {n.tie && (
                    <path d={`M${bx + main / 2} ${by + bh + 1} Q${X(st[i] + n.dur)} ${by + bh + 12} ${X(st[i] + n.dur) + (r[i + 1]?.dur ?? 0) * cw / 2} ${by + bh + 1}`}
                      fill="none" stroke="var(--fg)" strokeWidth={1.8} strokeLinecap="round" />
                  )}
                  {hot && <text className="rhy2-acc" x={bx + 6} y={by - 3} style={{ fill: 'var(--change-ink)' }}>&gt;</text>}
                </g>
              );
            })}
            {triGroups.map((gq, gi) => {
              const x1 = X(st[gq[0]]) + 2;
              const x2 = X(st[gq[gq.length - 1]] + r[gq[gq.length - 1]].dur) - 2;
              return (
                <g key={'t' + gi}>
                  <path d={`M${x1} ${y + 9} V${y + 4} H${x2} V${y + 9}`} fill="none" stroke="var(--muted)" strokeWidth={1} />
                  <rect x={(x1 + x2) / 2 - 6} y={y - 2} width={12} height={11} fill="var(--surface)" />
                  <text className="rhy2-tri" x={(x1 + x2) / 2} y={y + 4} textAnchor="middle" dominantBaseline="central" style={{ fill: 'var(--fg)' }}>3</text>
                </g>
              );
            })}
          </g>
        );
      })}
      {Array.from({ length: nBeats * 2 }, (_, h) => (
        <text key={'c' + h} className="rhy2-cnt" x={X((h * TQ) / 2) + 2} y={top + rows.length * RH + 11}
          style={{ fill: h % 2 ? 'var(--muted)' : 'var(--fg)' }}>{h % 2 ? lbl.and : nums[h / 2]}</text>
      ))}
      {foot && (() => {
        const y = top + rows.length * RH + CT;
        return (
          <g>
            <text className="rhy-frac rhy2-lab" x={4} y={y + (RH - 6) / 2} dominantBaseline="central" style={{ fill: 'var(--fg)' }}>{foot.label}</text>
            {foot.cells.map((c, i) => (
              <g key={i}>
                <rect x={X(i * TQ) + 1.5} y={y + 2} width={TQ * cw - 3} height={RH - 14} rx={4}
                  fill={c.ok ? 'var(--accent-soft)' : 'var(--change-soft)'} stroke={c.ok ? 'var(--accent)' : 'var(--change)'} strokeWidth={1.4} />
                <text className="rhy-res" x={X(i * TQ) + (TQ * cw) / 2} y={y + (RH - 10) / 2} textAnchor="middle" dominantBaseline="central"
                  style={{ fill: c.ok ? 'var(--accent-ink)' : 'var(--change-ink)' }}>{c.text}</text>
              </g>
            ))}
          </g>
        );
      })()}
    </svg>
  );
}

export function Rhythm2() {
  const { nm } = useLab();
  const t = useLessonText(text);
  const [id, setId] = useState<R2Id>('dot');
  const [pos, setPos] = useState(-1);
  const [phase, setPhase] = useState<'idle' | 'count' | 'tap' | 'done'>('idle');
  const [countIn, setCountIn] = useState(0);
  const [result, setResult] = useState<{ got: number[]; want: number[] } | null>(null);
  const timers = useRef<number[]>([]);
  const taps = useRef<number[]>([]);
  const tapStart = useRef(0);

  const ex = REXAMPLES.find((e) => e.id === id)!;
  const c = t.concepts[id];
  const last = ex.rows[ex.rows.length - 1];
  const nBeats = totalTicks(last) / TQ;
  const tick = QS / TQ;

  const clear = () => {
    timers.current.forEach((x) => clearTimeout(x));
    timers.current = [];
  };
  const at = (fn: () => void, sec: number) => timers.current.push(window.setTimeout(fn, sec * 1000));
  useEffect(() => () => clear(), []);

  const stopHere = () => {
    clear();
    stopAll();
    setPhase('idle');
    setPos(-1);
  };

  const events = (r: RNote[], start: number): NoteEvent[] => {
    const ev: NoteEvent[] = [];
    let k = 0;
    const sync = syncopatedStarts(r);
    for (const a of attacks(r)) {
      const tt = start + a.t * tick;
      const d = Math.max(0.12, a.dur * tick * 0.92);
      const hot = a.accent || sync.has(a.t);
      if (a.s != null) ev.push({ s: a.s, t: tt, d, v: hot ? 0.85 : 0.6 });
      else if ((a.t - ex.pickup) % (ex.beats * TQ) === 0 && a.t >= ex.pickup) ev.push({ s: -12, t: tt, d, v: 0.7 }, { s: 0, t: tt, d, v: 0.6 });
      else ev.push({ s: UPPER[k++ % UPPER.length], t: tt, d, v: hot ? 0.85 : 0.5 });
    }
    return ev;
  };
  const clicks = (n: number, start: number): NoteEvent[] =>
    Array.from({ length: n }, (_, i) => ({ s: CLICK, t: start + i * QS, d: 0.06, v: 0.18 }));
  const showPos = (start: number, n: number) => {
    for (let i = 0; i < n; i++) at(() => setPos(i), start + i * QS);
    at(() => setPos(-1), start + n * QS);
  };
  const playRow = (r: RNote[]) => {
    stopHere();
    const lead = 0.05;
    playNotes([...events(r, lead), ...clicks(nBeats, lead)], CH);
    showPos(lead, nBeats);
  };

  const start = () => {
    stopHere();
    setResult(null);
    taps.current = [];
    const lead = 0.1;
    const countBeats = ex.beats - ex.pickup / TQ; // the pickup overlaps the end of the count-in bar
    const exStart = lead + countBeats * QS;
    playNotes([...clicks(countBeats + nBeats, lead)], CH);
    tapStart.current = performance.now() / 1000 + exStart;
    setPhase('count');
    for (let i = 0; i < countBeats; i++) at(() => setCountIn(countBeats - i), lead + i * QS);
    at(() => setPhase('tap'), exStart - 0.3 * QS);
    showPos(exStart, nBeats);
    at(() => {
      const got = tapsPerCount(taps.current, tapStart.current, QS, nBeats, 0.3);
      setResult({ got, want: attacksPerBeat(last) });
      setPhase('done');
    }, exStart + (nBeats + 0.4) * QS);
  };
  const tap = () => {
    playNotes([{ s: 4, t: 0, d: 0.2, v: 0.55 }], CH);
    if (phase === 'tap' || phase === 'count') taps.current.push(performance.now() / 1000);
  };

  const ok = result ? compareCounts(result.want, result.got) : [];
  const foot = result ? { label: t.rowGot, cells: result.want.map((w, i) => ({ text: t.perBeat(result.got[i], w), ok: ok[i] })) } : undefined;

  // keyboard: the C major chord plus any melody notes of the example
  const used = new Set<number>([-12, 0, 4, 7, 12, ...ex.rows.flat().map((n) => n.s).filter((s): s is number => s != null)]);
  const marks: Record<number, Mark> = {};
  used.forEach((s) => (marks[s] = roleMark(s, DEG[s] === 1 ? 'tonic' : 'scale', DEG[s], nm(note(LETTER[s])))));

  const padText = phase === 'count' ? t.padCount(countIn) : phase === 'tap' ? t.padGo : phase === 'idle' ? t.padIdle : t.pad;
  const legend = [
    { color: 'var(--k-tonic)', label: t.lgStrong },
    { color: 'var(--k-path)', label: t.lgWeak },
    { color: 'var(--k-scale)', label: t.lgNote },
    { color: 'var(--k-chg)', dash: 'var(--change)', label: t.lgTension },
    { dash: 'var(--muted)', label: t.lgRest },
    ...(ex.pickup ? [{ color: 'var(--surface-2)', dash: 'var(--line)', label: t.lgPickup }] : []),
  ];

  return (
    <>
      <p className="desc">{t.desc}</p>
      <p className="rowlab">{t.pick}</p>
      <div className="chips" role="group" aria-label={t.pick}>
        {REXAMPLES.map((e) => (
          <button key={e.id} type="button" className="chip neutral" aria-pressed={e.id === id}
            onClick={() => { stopHere(); setId(e.id); setResult(null); }}>{t.concepts[e.id].chip}</button>
        ))}
      </div>

      <h3 className="sub-h">{c.title}</h3>
      <Predict mode="choice" resetOn={id} prompt={c.q} options={c.opts} answer={c.answer} reveal={c.reveal} />
      <ol className="rhy2-steps">{c.steps.map((h, i) => <Html as="li" key={i} html={h} />)}</ol>
      <Board className="rhy-board">
        <Strip ex={ex} rows={ex.rows} labels={c.rows} pos={phase === 'idle' || phase === 'done' ? pos : -1} aria={t.gridAria(c.title)} lbl={t} />
      </Board>
      <Legend items={legend} />
      <div className="row mt">
        {ex.rows.map((r, i) => (
          <PlayButton key={i} label={t.play(c.rows[i])} seconds={nBeats * QS} onPlay={() => playRow(r)} />
        ))}
      </div>

      <h3 className="sub-h">{t.kbdTitle}</h3>
      <p className="hint">{t.kbdHint}</p>
      <Board><Keyboard lay={layout(-12, 12)} marks={marks} channel={CH} label={t.kbdAria} /></Board>
      <Legend items={[{ color: 'var(--k-tonic)', label: t.lgRoot }, { colors: ['var(--k-scale)'], label: t.lgChord }]} />

      <h3 className="sub-h">{t.tapTitle}</h3>
      <p className="hint">{t.tapHint}</p>
      <Board className="rhy-board">
        <Strip ex={ex} rows={[last]} labels={[c.rows[c.rows.length - 1]]} pos={phase === 'tap' || phase === 'count' ? pos : -1}
          aria={t.gridAria(c.title)} foot={foot} lbl={t} />
      </Board>
      <div className="row mt">
        <PlayButton label={t.play(c.rows[c.rows.length - 1])} seconds={nBeats * QS} onPlay={() => playRow(last)} />
        <button type="button" className="btn primary" onClick={start} disabled={phase === 'count' || phase === 'tap'}>{t.start}</button>
      </div>
      <button type="button" className={'rhy-pad' + (phase === 'tap' ? ' go' : phase === 'count' ? ' ready' : '')}
        onPointerDown={(e) => { e.preventDefault(); tap(); }}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) tap(); } }}>
        {padText}
      </button>
      {result && (
        <div className={'feedback mt ' + (ok.every(Boolean) ? 'ok' : 'no')} role="status">{t.result(ok.filter(Boolean).length, ok.length)}</div>
      )}

      <h3 className="sub-h">{t.whyTitle}</h3>
      <Notes items={t.why.map((html) => ({ html }))} more={[4, 5, 6]} />
      <Recap {...t.recap} />
    </>
  );
}
