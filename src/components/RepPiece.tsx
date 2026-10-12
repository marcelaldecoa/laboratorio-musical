import { useEffect, useMemo, useRef, useState } from 'react';
import { later, playNotes, stopAll } from '../audio/audio';
import { DICTS, type Lang } from '../i18n';
import { text as chordtones } from '../i18n/lessons/chordtones';
import { text as form } from '../i18n/lessons/form';
import { text as inversions } from '../i18n/lessons/inversions';
import { text as lefthand } from '../i18n/lessons/lefthand';
import { text as minor } from '../i18n/lessons/minor';
import { text as minorvar } from '../i18n/lessons/minorvar';
import { text as reading } from '../i18n/lessons/reading';
import { repShared } from '../i18n/lessons/repShared';
import { text as rhythm } from '../i18n/lessons/rhythm';
import { text as secdom } from '../i18n/lessons/secdom';
import { text as v7 } from '../i18n/lessons/v7';
import { useLab } from '../state/useLab';
import type { Note } from '../theory';
import { noteAt } from '../theory/chords7';
import {
  type Harm, type NoteRole, type PNote, type Piece, type RepFunc, barStarts, chordSymbol, classify, harmAt, nt, semi, timeline, toneNumber,
} from '../theory/repertoire';
import { Keyboard } from './Keyboard';
import { type Mark, rangeAround, roleMark } from './layout';
import { Html, Legend, Seg } from './ui';
import '../styles/repertoire.css';

type Hands = 'both' | 'R' | 'L';
type Tempo = 'slow' | 'normal';

const FN_SOFT: Record<RepFunc, [string, string]> = {
  T: ['var(--accent-soft)', 'var(--accent-ink)'],
  SD: ['var(--flat-soft)', 'var(--flat-ink)'],
  D: ['var(--dom-soft)', 'var(--dom-ink)'],
  secD: ['var(--dom-soft)', 'var(--dom-ink)'],
};
const FN_ROLE = { T: 'tonic', SD: 'sub', D: 'dom', secD: 'dom' } as const;

const LATER: Record<string, { pt: { meta: { nav: string } }; en: { meta: { nav: string } } }> = {
  chordtones, form, inversions, lefthand, minor, minorvar, reading, rhythm, secdom, v7,
};
/** Menu name of a lesson the analysis links to. */
export function lessonNav(id: string, lang: Lang): string {
  const later = LATER[id];
  if (later) return later[lang].meta.nav;
  const proto = (DICTS[lang].lessons as Record<string, { nav: string } | undefined>)[id];
  return proto?.nav ?? id;
}

/** Replaces {C}, {F#}, {Bb} … in a text with the note name in the chosen notation. */
export function useNoteFill() {
  const { nm } = useLab();
  return (html: string) => html.replace(/\{([A-G](?:#|b)?)\}/g, (_, x: string) => nm(nt(x)));
}

/** The seven notes of the piece's key (major, or natural minor), spelled by letter. */
export function keyNotes(p: Piece): Note[] {
  const semis = p.minor ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
  return semis.map((s, i) => noteAt(p.tonic, i + 1, s));
}
const inKey = (p: Piece, n: Note) => keyNotes(p).some((k) => k.letter === n.letter && k.acc === n.acc);

/** Color of one note: chord tone by function, note outside the key in coral, other scale notes light green. */
export function repMark(p: Piece, s: number, n: PNote, hm: Harm | null, name?: string): Mark {
  const num = hm ? toneNumber(hm, n) : null;
  if (!inKey(p, n)) return roleMark(s, 'chg', num ?? undefined, name);
  if (hm && num != null) return roleMark(s, FN_ROLE[hm.fn], num, name);
  return roleMark(s, 'scale', undefined, name);
}

/** Play bars from..to of a piece (both hands) on a channel; returns the length in seconds. */
export function playBars(p: Piece, from: number, to: number, channel: string, slow = false): number {
  stopAll();
  const st = barStarts(p);
  const spb = 60 / (p.bpm * (slow ? 0.6 : 1));
  const t0 = st[from];
  const t1 = st[to] + p.bars[to].beats;
  const notes = timeline(p).filter((n) => n.at >= t0 - 1e-9 && n.at < t1 - 1e-9);
  playNotes(notes.map((n) => ({ s: n.s, t: (n.at - t0) * spb, d: Math.min(n.d, t1 - n.at) * spb * 0.95, v: n.h === 'R' ? 0.72 : 0.5 })), channel);
  return (t1 - t0) * spb;
}

/** "Bar 3", or "Pickup" for an anacrusis. */
export function barLabel(p: Piece, i: number, T: { barN: (n: number) => string; pickup: string }) {
  if (p.bars[i].pickup) return T.pickup;
  return T.barN(i + (p.bars[0].pickup ? 0 : 1));
}

interface Props {
  piece: Piece;
  /** piece name for screen readers */
  name: string;
  bar: number;
  onBar: (b: number) => void;
  /** horizontal size of one quarter note on the strip, in px */
  beatW: number;
  channel: string;
}

/** Score excerpt as a playable strip (piano roll) + the selected bar on the keyboard, with step-through. */
export function RepPiece({ piece, name, bar, onBar, beatW, channel }: Props) {
  const { s, nm } = useLab();
  const T = repShared[s.lang];
  const [hands, setHands] = useState<Hands>('both');
  const [tempo, setTempo] = useState<Tempo>('normal');
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState<number | null>(null);
  const tok = useRef(0);
  const raf = useRef(0);
  const box = useRef<HTMLDivElement>(null);
  const follow = useRef(false);
  const kbox = useRef<HTMLDivElement>(null);

  const tl = useMemo(() => timeline(piece), [piece]);
  const st = useMemo(() => barStarts(piece), [piece]);
  const roles = useMemo(() => {
    const m = new Map<string, NoteRole>();
    classify(piece, 'R').forEach((v, k) => m.set('R' + k, v));
    classify(piece, 'L').forEach((v, k) => m.set('L' + k, v));
    return m;
  }, [piece]);

  const halt = () => {
    tok.current++;
    cancelAnimationFrame(raf.current);
    stopAll();
    setPlaying(false);
    setPos(null);
  };
  useEffect(() => () => { tok.current++; cancelAnimationFrame(raf.current); stopAll(); }, []);
  useEffect(halt, [piece, hands, tempo]);

  // keep the selected bar visible on the strip while stepping or playing
  useEffect(() => {
    const el = box.current;
    if (!el || !follow.current) return;
    const x = 6 + st[bar] * beatW;
    const w = piece.bars[bar].beats * beatW;
    if (x < el.scrollLeft || x + w > el.scrollLeft + el.clientWidth) el.scrollLeft = Math.max(0, x - 24);
  }, [bar, st, beatW, piece]);

  const spb = 60 / (piece.bpm * (tempo === 'slow' ? 0.6 : 1));
  const run = (from: number, to: number) => {
    halt();
    const my = tok.current;
    follow.current = true;
    const t0 = st[from];
    const t1 = st[to] + piece.bars[to].beats;
    const notes = tl.filter((n) => n.at >= t0 - 1e-9 && n.at < t1 - 1e-9 && (hands === 'both' || n.h === hands));
    playNotes(notes.map((n) => ({ s: n.s, t: (n.at - t0) * spb, d: Math.min(n.d, t1 - n.at) * spb * 0.95, v: n.h === 'R' ? 0.72 : 0.5 })), channel);
    for (let b = from; b <= to; b++) later(() => { if (tok.current === my) onBar(b); }, (st[b] - t0) * spb);
    setPlaying(true);
    const start = performance.now() + 50;
    const tick = () => {
      if (tok.current !== my) return;
      const beat = t0 + Math.max(0, performance.now() - start) / 1000 / spb;
      if (beat >= t1) { setPlaying(false); setPos(null); return; }
      setPos(beat);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  const step = (d: number) => {
    halt();
    follow.current = true;
    onBar(Math.max(0, Math.min(piece.bars.length - 1, bar + d)));
  };

  /* ---------- the strip ---------- */
  const lo = Math.min(...tl.map((n) => n.s)) - 1;
  const hi = Math.max(...tl.map((n) => n.s)) + 1;
  const ROW = Math.max(6, Math.min(10, Math.floor(260 / (hi - lo + 1))));
  const HEAD = 42;
  const Lx = 6;
  const total = st[st.length - 1] + piece.bars[piece.bars.length - 1].beats;
  const x = (b: number) => Lx + b * beatW;
  const y = (sm: number) => HEAD + (hi - sm) * ROW;
  const bottom = y(lo) + ROW;
  const W = x(total) + 6;
  const Hh = bottom + 20;
  const sym = (h: Harm) => chordSymbol(h, s.lang);

  const pick = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const beat = (((e.clientX - r.left) / r.width) * W - Lx) / beatW;
    let b = 0;
    st.forEach((t, i) => { if (beat >= t) b = i; });
    halt();
    follow.current = false;
    onBar(b);
  };

  /* ---------- the selected bar on the keyboard ---------- */
  const B = piece.bars[bar];
  const lay = rangeAround(lo + 1, hi - 1);
  const marks: Record<number, Mark> = {};
  const nct: string[] = [];
  B.ev.forEach((e, i) => {
    if (!e.p) return;
    const sm = semi(e.p);
    const hm = harmAt(B, e.at);
    if (!marks[sm] || marks[sm].label == null) marks[sm] = repMark(piece, sm, e.p, hm, nm(e.p));
    const r = roles.get(e.h + bar + ':' + i);
    if (r && r !== 'ct') nct.push(`${nm(e.p)} (${T.roles[r]})`);
  });
  const lab = barLabel(piece, bar, T);
  const keysUsed = Object.keys(marks).map(Number);
  const mid = keysUsed.length ? (lay.c(Math.min(...keysUsed)) + lay.c(Math.max(...keysUsed))) / 2 : lay.width / 2;
  // a wide keyboard scrolls inside its box: keep this bar's notes in view
  useEffect(() => {
    const el = kbox.current;
    const svg = el?.querySelector('svg');
    if (!el || !svg) return;
    const k = svg.getBoundingClientRect().width / lay.width;
    el.scrollLeft = Math.max(0, mid * k - el.clientWidth / 2);
  }, [mid, lay.width]);
  const harmText = B.harm.length ? B.harm.map(sym).join(' → ') : T.noHarm;
  const romanText = B.harm.map((h) => h.roman).join(' → ');
  const hasOut = tl.some((n) => !inKey(piece, n.p));

  return (
    <div className="rep-piece" id={'rep-player-' + piece.id}>
      <p className="rowlab">{T.rollTitle}</p>
      <div className="board rep-board" ref={box}>
        <svg className="rep-roll" width={W} height={Hh} viewBox={`0 0 ${W} ${Hh}`} role="img" aria-label={T.rollAria(name)} onPointerDown={pick}>
          <rect x={x(st[bar])} y={0} width={B.beats * beatW} height={Hh} rx={6} fill="var(--surface-2)" />
          {Array.from({ length: hi - lo + 1 }, (_, r) => lo + r).filter((sm) => sm % 12 === 0).map((sm) => (
            <line key={'c' + sm} x1={x(0)} x2={x(total)} y1={y(sm) + ROW} y2={y(sm) + ROW} stroke="var(--line)" strokeWidth={sm === 0 ? 1.4 : 0.8} />
          ))}
          {piece.bars.map((b, bi) => (
            <g key={'b' + bi}>
              {b.harm.map((h, k) => {
                const [bg, ink] = FN_SOFT[h.fn];
                const cx = x(st[bi] + h.at + h.d / 2);
                return (
                  <g key={k}>
                    <rect x={x(st[bi] + h.at) + 1.5} y={2} width={h.d * beatW - 3} height={34} rx={6} fill={bg} />
                    <text className="rep-roman" x={cx} y={16} textAnchor="middle" style={{ fill: ink }}>{h.roman}</text>
                    <text className="rep-sym" x={cx} y={30} textAnchor="middle" style={{ fill: ink }}>{sym(h)}</text>
                  </g>
                );
              })}
              <line x1={x(st[bi])} x2={x(st[bi])} y1={HEAD - 4} y2={bottom} stroke="var(--muted)" strokeWidth={b.pickup ? 0 : 1} />
              <text className={'rep-barn' + (bi === bar ? ' on' : '')} x={x(st[bi] + b.beats / 2)} y={bottom + 14} textAnchor="middle">
                {b.pickup ? '·' : bi + (piece.bars[0].pickup ? 0 : 1)}
              </text>
            </g>
          ))}
          <line x1={x(total)} x2={x(total)} y1={HEAD - 4} y2={bottom} stroke="var(--muted)" strokeWidth={1.6} />
          {tl.map((n, k) => {
            const hm = harmAt(piece.bars[n.bar], n.at - st[n.bar]);
            const m = repMark(piece, 0, n.p, hm);
            return (
              <rect key={k} x={x(n.at) + 1} y={y(n.s) + 0.5} width={Math.max(3, n.d * beatW - 2)} height={ROW - 1} rx={2}
                fill={m.fill} stroke="var(--k-edge)" strokeWidth={0.7} opacity={hands === 'both' || n.h === hands ? 1 : 0.25} />
            );
          })}
          <rect x={x(st[bar]) + 0.5} y={HEAD - 4} width={B.beats * beatW - 1} height={bottom - HEAD + 4} rx={4} fill="none" stroke="var(--accent)" strokeWidth={2} />
          {pos != null && <line x1={x(pos)} x2={x(pos)} y1={HEAD - 6} y2={bottom} stroke="var(--change)" strokeWidth={2} />}
        </svg>
      </div>
      <p className="hint">{T.rollHint}</p>

      <div className="rep-ctrls">
        <div className="row">
          <button type="button" className="ghost rep-step" aria-label={T.prev} disabled={bar === 0} onClick={() => step(-1)}>◀</button>
          <button type="button" className="ghost rep-step" aria-label={T.next} disabled={bar === piece.bars.length - 1} onClick={() => step(1)}>▶</button>
          <button type="button" className="play" onClick={() => run(bar, bar)}>
            <span className="play-ic" aria-hidden="true">▶</span> {T.playBar}
          </button>
          <button type="button" className={'play' + (playing ? ' on' : '')} onClick={() => (playing ? halt() : run(0, piece.bars.length - 1))}>
            <span className="play-ic" aria-hidden="true">{playing ? '■' : '▶'}</span> {playing ? T.stop : T.playAll}
          </button>
        </div>
        <div className="rep-segs">
          <Seg label={T.handsLabel} value={hands} onChange={setHands}
            options={(['both', 'R', 'L'] as Hands[]).map((v) => ({ v, label: T.hands[v] }))} />
          <Seg label={T.tempoLabel} value={tempo} onChange={setTempo}
            options={(['slow', 'normal'] as Tempo[]).map((v) => ({ v, label: T.tempos[v] }))} />
        </div>
      </div>

      <div className="bar">
        <span className="now big">{T.readout(lab, romanText, harmText)}</span>
      </div>
      <div className="board" ref={kbox}>
        <Keyboard lay={lay} marks={marks} channel={channel} minWidth={Math.min(lay.width, 620)} label={T.kbdAria(lab)} />
      </div>
      <Legend items={[
        { color: 'var(--k-tonic)', label: T.lgT },
        ...(piece.bars.some((b) => b.harm.some((h) => h.fn === 'SD')) ? [{ color: 'var(--k-sub)', label: T.lgSD }] : []),
        { color: 'var(--k-dom)', label: T.lgD },
        ...(hasOut ? [{ colors: ['var(--k-chg)', 'var(--k-chgb)'], label: T.lgOut }] : []),
        { colors: ['var(--k-scale)', 'var(--k-scaleb)'], label: T.lgNct },
        { label: T.lgNum },
        { label: T.lgRoll },
      ]} />
      <p className="hint rep-nct">{nct.length ? `${T.nctLine} ${nct.join(', ')}` : B.harm.length ? T.nctNone : ''}</p>
    </div>
  );
}

export interface Finding {
  html: string;
  /** lesson that explains it */
  lesson: string;
  /** bar to show in the player */
  bar?: number;
}

/** Numbered findings, each linked to the lesson that explains it and to the bar where it happens. */
export function RepFindings({ piece, items, onBar }: { piece: Piece; items: Finding[]; onBar: (b: number) => void }) {
  const { s } = useLab();
  const T = repShared[s.lang];
  const fill = useNoteFill();
  return (
    <ol className="rep-findings">
      {items.map((f, i) => (
        <li key={i}>
          <span className="rep-n" aria-hidden="true">{i + 1}</span>
          <div className="rep-fbody">
            <Html as="p" html={fill(f.html)} />
            <div className="row">
              {f.bar != null && (
                <button type="button" className="ghost rep-see" onClick={() => {
                  onBar(f.bar!);
                  document.getElementById('rep-player-' + piece.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}>
                  {T.seeBar(barLabel(piece, f.bar, T))}
                </button>
              )}
              <a className="rep-link" href={'#/aula/' + f.lesson}>{T.lesson}: {lessonNav(f.lesson, s.lang)} →</a>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

