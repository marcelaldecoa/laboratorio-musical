import { useEffect, useRef, useState } from 'react';
import type { NoteEvent } from '../audio/audio';
import { playNotes, unlock } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, roleMark } from '../components/layout';
import { Board, Seg } from '../components/ui';
import { FUNCTION_OF, chordInfo, mod, pcOf, triad } from '../theory';
import { useLab } from '../state/useLab';

type Mode = 'notes' | 'chords';
type Lbl = 'names' | 'degrees' | 'none';

export function Piano() {
  const { t, nm, keyName, cur, sc } = useLab();
  const p = t.piano;
  const wide = typeof window !== 'undefined' && window.innerWidth >= 900;
  const [oct, setOct] = useState<number>(wide ? 3 : 2);
  const [mode, setMode] = useState<Mode>('notes');
  const [lbl, setLbl] = useState<Lbl>('names');
  const [show, setShow] = useState(true);
  const [last, setLast] = useState<string>('');
  const [midi, setMidi] = useState<'off' | 'on' | 'none'>('off');
  const [recording, setRecording] = useState(false);
  const [take, setTake] = useState<NoteEvent[]>([]);
  const recStart = useRef(0);
  /** plays and, while recording, remembers the notes with their time */
  const sound = (evs: NoteEvent[]) => {
    playNotes(evs, 'piano');
    if (recording) {
      const at = (performance.now() - recStart.current) / 1000;
      setTake((tk) => [...tk, ...evs.map((e) => ({ ...e, t: e.t + at }))]);
    }
  };

  const from = oct === 3 ? -12 : 0;
  const to = from + oct * 12;
  const lay = layout(from, to);
  const tonic = pcOf(cur);
  const degreeOf = (s: number) => sc.findIndex((n) => pcOf(n) === mod(s, 12));

  const marks: Record<number, Mark> = {};
  if (show)
    for (let s = from; s <= to; s++) {
      const d = degreeOf(s);
      if (d < 0) continue;
      const label = lbl === 'names' ? nm(sc[d]) : lbl === 'degrees' ? d + 1 : undefined;
      marks[s] = roleMark(s, mod(s, 12) === tonic ? 'tonic' : sc[d].acc !== 0 ? 'acc' : 'scale', label);
    }

  const onKey = (s: number) => {
    const d = degreeOf(s);
    if (mode === 'chords' && d >= 0) {
      const tri = triad(sc, d).map(pcOf);
      const notes = [s];
      let x = s;
      for (const pc of tri.slice(1)) {
        while (mod(x, 12) !== pc) x++;
        notes.push(x);
      }
      sound([{ s: s - 12, t: 0, d: 1.4, v: 0.45 }, ...notes.map((n) => ({ s: n, t: 0, d: 1.4, v: 0.55 }))]);
      const c = chordInfo(sc, d);
      setLast(`${nm(c.root)}${c.suffix} · ${c.roman} · ${FUNCTION_OF[d]} (${t.fnName[FUNCTION_OF[d]]}) · ${triad(sc, d).map(nm).join(' ')}`);
    } else {
      sound([{ s, t: 0, d: 1.2 }]);
      setLast(d >= 0 ? `${nm(sc[d])} · ${p.degree(d + 1)} · ${t.degreeNames[d]}` : `${p.outside}`);
    }
  };

  // Web MIDI (Chrome/Edge): light keys from a real piano
  useEffect(() => {
    if (midi !== 'on') return;
    let access: MIDIAccess | null = null;
    const handler = (e: MIDIMessageEvent) => {
      const [st, n, v] = e.data ?? [];
      if ((st & 0xf0) === 0x90 && v > 0) playNotes([{ s: n - 60, t: 0, d: 1.2, v: v / 127 }], 'piano');
    };
    navigator.requestMIDIAccess?.().then((a) => {
      access = a;
      a.inputs.forEach((i) => (i.onmidimessage = handler));
      if (!a.inputs.size) setMidi('none');
    }).catch(() => setMidi('none'));
    return () => access?.inputs.forEach((i) => (i.onmidimessage = null));
  }, [midi]);
  const hasMidi = typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator;

  return (
    <>
      <p className="desc">{p.desc}</p>
      <div className="piano-tools">
        <Seg value={mode} onChange={setMode} options={[{ v: 'notes', label: p.modeNotes }, { v: 'chords', label: p.modeChords }]} />
        <Seg label={p.labels} value={lbl} onChange={setLbl} options={[{ v: 'names', label: p.lblNames }, { v: 'degrees', label: p.lblDegrees }, { v: 'none', label: p.lblNone }]} />
        <Seg label={p.octaves} value={oct} onChange={setOct} options={[{ v: 1, label: '1' }, { v: 2, label: '2' }, { v: 3, label: '3' }]} />
        <label className="toggle">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
          <span>{p.highlight}</span>
        </label>
      </div>
      <div className="bar">
        <span className="now big">{last || p.nothing}</span>
        <span className="now">{keyName(cur)}</span>
      </div>
      <Board className="piano-board">
        <Keyboard lay={lay} marks={marks} channel="piano" onKey={onKey} minWidth={lay.whites.length * 38} maxScale={4} className="big" />
      </Board>
      <div className="rec-bar">
        <button type="button" className={'rec' + (recording ? ' on' : '')} onClick={() => {
          unlock();
          if (recording) setRecording(false);
          else { setTake([]); recStart.current = performance.now(); setRecording(true); }
        }}>{recording ? t.rec.stop : t.rec.record}</button>
        <button type="button" className="play" disabled={!take.length || recording} onClick={() => playNotes(take, 'piano')}>{t.rec.play}</button>
        <button type="button" className="ghost" disabled={!take.length || recording} onClick={() => setTake([])}>{t.rec.clear}</button>
        <span className="hint">{recording ? t.rec.recording : take.length ? t.rec.notes(take.length) : ''}</span>
      </div>
      {hasMidi ? (
        <p className="hint">
          <button type="button" onClick={() => { unlock(); setMidi('on'); }} disabled={midi === 'on'}>
            {midi === 'on' ? p.midiOn : p.midi}
          </button>{' '}
          {midi === 'none' && p.midiNone}
        </p>
      ) : (
        <p className="hint">{p.midiUnsupported}</p>
      )}
    </>
  );
}
