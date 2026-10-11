import { useEffect, useRef, useState } from 'react';
import { type NoteEvent, later, playNotes, stopAll } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { MelodyRoll, type RollBar, type RollNote } from '../components/MelodyRoll';
import { type Mark, layout, roleMark } from '../components/layout';
import { Board, Legend, Notes, Seg } from '../components/ui';
import { text } from '../i18n/lessons/chordtones';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import { FUNCTION_OF, chordInfo, mod, pcOf, triad } from '../theory';
import { FN_SOFT, chordBelow } from './melodyShared';
import {
  type NoteRole, type ToneRole, type Tune, ROLE_TUNE, classify, fitBase, groupRange, melodyNotes, melodySemis, skeleton,
} from '../theory/melody';
import '../styles/melody.css';

const ROLE_KEY: Record<ToneRole, 'tonic' | 'scale' | 'chg' | 'lt' | 'start'> = {
  root: 'tonic', third: 'tonic', fifth: 'tonic', passing: 'scale', neighbor: 'chg', appoggiatura: 'lt', other: 'start',
};
const ROLE_FILL: Record<ToneRole, [string, string]> = {
  root: ['var(--k-tonic)', 'var(--k-tonic-ink)'],
  third: ['var(--k-tonic)', 'var(--k-tonic-ink)'],
  fifth: ['var(--k-tonic)', 'var(--k-tonic-ink)'],
  passing: ['var(--k-scale)', 'var(--k-scale-ink)'],
  neighbor: ['var(--k-chg)', 'var(--k-chg-ink)'],
  appoggiatura: ['var(--k-lt)', 'var(--k-lt-ink)'],
  other: ['var(--k-start)', 'var(--k-start-ink)'],
};

const Q = 0.42;

export function ChordTones() {
  const { nm, sc, cur } = useLab();
  const L = useLessonText(text);
  const [mode, setMode] = useState<'full' | 'skel'>('full');
  const [sel, setSel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tok = useRef(0);
  useEffect(() => () => { tok.current++; stopAll(); }, []);

  const full = classify(ROLE_TUNE);
  const tune: Tune = mode === 'full' ? ROLE_TUNE : skeleton(ROLE_TUNE);
  // in the skeleton each note keeps the role it had in the full melody
  const roles: NoteRole[] =
    mode === 'full' ? full : classify(tune).map((r) => ({ ...full.find((f) => f.start === r.start)!, start: r.start, beat: r.beat }));
  const k = Math.min(sel, tune.notes.length - 1);
  const base = fitBase(cur, 0, 7);
  const semis = melodySemis(base, tune.notes);
  const names = melodyNotes(sc, tune.notes).map(nm);
  const chords = tune.chords.map((d) => chordBelow(sc, d, base));
  const chordLab = (d: number) => {
    const c = chordInfo(sc, d);
    return `${c.roman} · ${nm(c.root)}${c.suffix}`;
  };

  const stop = () => { tok.current++; stopAll(); setPlaying(false); };
  const noteEvents = (j: number): NoteEvent[] => {
    const r = roles[j];
    return [
      { s: semis[j], t: 0, d: 0.9, v: 0.8 },
      ...chords[r.bar].map((s) => ({ s, t: 0, d: 0.9, v: 0.35 })),
    ];
  };
  const go = (j: number) => {
    stop();
    const n = tune.notes.length;
    const jj = (j + n) % n;
    setSel(jj);
    playNotes(noteEvents(jj), 'ct');
  };
  const playAll = () => {
    if (playing) { stop(); return; }
    stopAll();
    const my = ++tok.current;
    setPlaying(true);
    const ev: NoteEvent[] = [];
    tune.chords.forEach((_, b) => chords[b].forEach((s) => ev.push({ s, t: b * 4 * Q, d: 4 * Q * 0.95, v: 0.32 })));
    tune.notes.forEach((n, j) => {
      ev.push({ s: semis[j], t: roles[j].start * Q, d: n.dur * Q * 0.92, v: 0.8 });
      later(() => { if (tok.current === my) setSel(j); }, roles[j].start * Q + 0.05);
    });
    playNotes(ev, 'ct');
    later(() => { if (tok.current === my) setPlaying(false); }, tune.chords.length * 4 * Q + 0.4);
  };

  const r = roles[k];
  const bars: RollBar[] = tune.chords.map((d) => {
    const f = FN_SOFT[FUNCTION_OF[d]];
    return { label: chordLab(d), fill: f[0], ink: f[1] };
  });
  const rollNotes: RollNote[] = tune.notes.map((n, j) => {
    const f = ROLE_FILL[roles[j].role];
    return { i: n.i, start: roles[j].start, dur: n.dur, fill: f[0], ink: f[1], label: L.roleTag[roles[j].role] };
  });

  const marks: Record<number, Mark> = {};
  const tri = triad(sc, tune.chords[r.bar]);
  chords[r.bar].forEach((s) => {
    const m = tri.findIndex((x) => pcOf(x) === mod(s, 12));
    marks[s] = roleMark(s, 'start', ['1', '3', '5'][m], nm(tri[m]));
  });
  if (k > 0 && semis[k - 1] !== semis[k]) marks[semis[k - 1]] = { ...marks[semis[k - 1]], ghost: 'var(--muted)' };
  marks[semis[k]] = { ...roleMark(semis[k], ROLE_KEY[r.role], L.roleTag[r.role], names[k]), ghost: marks[semis[k]]?.ghost };
  const [from, to] = groupRange([...semis, ...chords.flat()]);

  const prevName = k > 0 ? names[k - 1] : '';
  const nextName = k < names.length - 1 ? names[k + 1] : '';
  const read = L.read(names[k], chordLab(tune.chords[r.bar]), r.bar + 1, r.beat + 1, r.strong, r.role, prevName, nextName);
  const strongs = roles.filter((x) => x.strong);
  const weaks = roles.filter((x) => !x.strong);
  const present = new Set(roles.map((x) => x.role));

  return (
    <>
      <p className="desc">{L.desc}</p>
      <h3 className="sub-h">{L.stepsTitle}</h3>
      <ol className="mel-steps">{L.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>

      <div className="mel-tools">
        <Seg value={mode} label={L.full} onChange={(v) => { stop(); setMode(v); setSel(0); }}
          options={[{ v: 'full', label: L.full }, { v: 'skel', label: L.skel }]} />
      </div>
      <p className="rowlab">{L.rollLabel}</p>
      <Board>
        <MelodyRoll notes={rollNotes} bars={bars} selected={k} onSelect={go} strong beatNumbers
          label={tune.notes.map((_, j) => `${names[j]} ${L.roleName[roles[j].role]}`).join(', ')} />
      </Board>
      <div className="bar">
        <span className="now">{L.now(k + 1, tune.notes.length, names[k])}</span>
        <div className="row">
          <div className="nav">
            <button type="button" aria-label="◀" onClick={() => go(k - 1)}>{L.prev}</button>
            <button type="button" aria-label="▶" onClick={() => go(k + 1)}>{L.next}</button>
          </div>
          <button type="button" className={'play' + (playing ? ' on' : '')} onClick={playAll}>
            <span className="play-ic" aria-hidden="true">{playing ? '■' : '▶'}</span> {playing ? L.stop : L.play}
          </button>
        </div>
      </div>
      <Board>
        <Keyboard lay={layout(from, to)} marks={marks} channel="ct" label={L.keyLabel(names[k], L.roleName[r.role])} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: L.lgChordTone },
        ...(present.has('passing') ? [{ color: 'var(--k-scale)', label: L.lgPassing }] : []),
        ...(present.has('neighbor') ? [{ color: 'var(--k-chg)', label: L.lgNeighbor }] : []),
        ...(present.has('appoggiatura') ? [{ color: 'var(--k-lt)', label: L.lgApp }] : []),
        { color: 'var(--k-start)', label: L.lgChord },
        { dash: 'var(--muted)', label: L.lgWas },
      ]} />
      <p className="readout">{read}</p>
      {mode === 'full' && <p className="readout">
        {L.census(strongs.filter((x) => x.chordTone).length, strongs.length, weaks.filter((x) => x.chordTone).length, weaks.length)}
      </p>}
      {mode === 'skel' && <p className="hint mt">{L.skelHint}</p>}
      <h3 className="sub-h">{L.logicTitle}</h3>
      <Notes items={L.logic.map((html) => ({ html }))} />
    </>
  );
}
