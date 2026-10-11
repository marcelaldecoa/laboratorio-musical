import { useEffect, useRef, useState } from 'react';
import { later, playNotes, stopAll } from '../audio/audio';
import { Keyboard } from './Keyboard';
import { type Mark, layout } from './layout';
import { Board, Html, Legend, type LegendItem } from './ui';
import { type Note, pcOf } from '../theory';
import { closeVoicing } from '../theory/harmony';

export type ProgTone = 'T' | 'SD' | 'D' | 'B';

export interface ProgChord {
  /** chord notes, root first */
  notes: Note[];
  roman: string;
  /** localized chord symbol */
  name: string;
  tone: ProgTone;
  /** notes drawn in coral (borrowed accidental, changed note, tritone) */
  hot?: boolean[];
}

const COL: Record<ProgTone, [string, string]> = {
  T: ['var(--k-tonic)', 'var(--k-tonic-ink)'],
  SD: ['var(--k-sub)', 'var(--k-sub-ink)'],
  D: ['var(--k-dom)', 'var(--k-dom-ink)'],
  B: ['var(--k-sub)', 'var(--k-sub-ink)'],
};
const CHIP: Record<ProgTone, string> = { T: 'fT', SD: 'fSD', D: 'fD', B: 'min' };
const HOT: [string, string] = ['var(--k-lt)', 'var(--k-lt-ink)'];
const TONES = ['1', '3', '5', '7'];

interface Props {
  chords: ProgChord[];
  channel: string;
  nm: (n: Note) => string;
  labels: { play: string; stop: string; prev: string; next: string; now: (i: number, n: number) => string };
  legend: LegendItem[];
  /** readout under the keyboard for chord i (may hold <b>) */
  read: (i: number) => string;
  /** chord length in seconds when playing the whole progression */
  beat?: number;
}

/** A chord progression: tappable timeline, play-all, and a keyboard with bass and voice leading (dashed = where a voice was). */
export function MotionProgression({ chords, channel, nm, labels, legend, read, beat = 1.1 }: Props) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tok = useRef(0);
  useEffect(() => () => { tok.current++; stopAll(); }, []);
  const i = Math.min(idx, chords.length - 1);

  const voices: number[][] = [];
  let prev: number[] | null = null;
  for (const c of chords) {
    const v = closeVoicing(c.notes.map(pcOf), prev, 0, 19, 7);
    voices.push(v);
    prev = v;
  }
  const bass = chords.map((c) => pcOf(c.notes[0]) - 12);

  const events = (k: number, t: number, d: number) => [
    { s: bass[k], t, d, v: 0.55 },
    ...voices[k].map((s) => ({ s, t, d, v: 0.5 })),
  ];
  const go = (k: number) => {
    tok.current++;
    setPlaying(false);
    stopAll();
    setIdx(k);
    playNotes(events(k, 0, 1.2), channel);
  };
  const playAll = () => {
    if (playing) { tok.current++; stopAll(); setPlaying(false); return; }
    stopAll();
    const my = ++tok.current;
    setPlaying(true);
    chords.forEach((_, k) => {
      playNotes(events(k, k * beat, beat * 0.95), channel);
      later(() => { if (tok.current === my) setIdx(k); }, k * beat + 0.06);
    });
    later(() => { if (tok.current === my) setPlaying(false); }, chords.length * beat + 0.3);
  };

  const c = chords[i];
  const marks: Record<number, Mark> = {};
  if (i > 0) {
    const was = [...voices[i - 1], bass[i - 1]];
    const now = [...voices[i], bass[i]];
    was.forEach((s) => { if (!now.includes(s)) marks[s] = { ghost: 'var(--muted)' }; });
  }
  const put = (s: number) => {
    const k = c.notes.findIndex((n) => ((pcOf(n) - s) % 12 + 12) % 12 === 0);
    const [fill, ink] = c.hot?.[k] ? HOT : COL[c.tone];
    marks[s] = { fill, ink, label: TONES[k], name: nm(c.notes[k]) };
  };
  voices[i].forEach(put);
  put(bass[i]);
  const text = read(i);

  return (
    <>
      <div className="chips timeline" role="group">
        {chords.map((ch, k) => (
          <button key={k} type="button" className={'chip ' + CHIP[ch.tone] + (k === i && playing ? ' beat' : '')}
            aria-pressed={k === i} onClick={() => go(k)}>
            {ch.roman}<small>{ch.name}</small>
          </button>
        ))}
      </div>
      <div className="bar">
        <span className="now">{labels.now(i, chords.length)}</span>
        <div className="row">
          <div className="nav">
            <button type="button" aria-label="◀" onClick={() => go((i - 1 + chords.length) % chords.length)}>{labels.prev}</button>
            <button type="button" aria-label="▶" onClick={() => go((i + 1) % chords.length)}>{labels.next}</button>
          </div>
          <button type="button" className={'play' + (playing ? ' on' : '')} onClick={playAll}>
            <span className="play-ic" aria-hidden="true">{playing ? '■' : '▶'}</span> {playing ? labels.stop : labels.play}
          </button>
        </div>
      </div>
      <Board>
        <Keyboard lay={layout(-12, 19)} marks={marks} channel={channel} label={text.replace(/<[^>]+>/g, '')} />
      </Board>
      <Legend items={legend} />
      <Html as="p" className="readout" html={text} />
    </>
  );
}
