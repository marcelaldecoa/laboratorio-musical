import { useEffect, useRef, useState } from 'react';
import { later, playNotes, stopAll } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { Predict, Recap, Transfer } from '../components/Learn';
import { FUNCTION_ROLE, chordWithBass, triadSemis } from '../components/MinorKit';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { Board, Html, Legend, Notes } from '../components/ui';
import { useLessonText } from '../i18n/lessonText';
import { text } from '../i18n/lessons/minorcad';
import { useLab } from '../state/useLab';
import { type Note, mod, pcOf, sameNote } from '../theory';
import {
  MINOR_PROGS, MINOR_PROG_IDS, type MinorChordId, type MinorFunction, type MinorProgId, type MinorTriadQuality, minorChord,
  minorLeadingTone, sharedNotes, subtonic, voiceMinorProg,
} from '../theory/minorHarmony';
import { relativeMinor } from '../theory/scales';
import '../styles/scales.css';

const SUF: Record<MinorTriadQuality, string> = { maj: '', min: 'm', dim: '°', aug: '+' };
const GROUPS: [MinorFunction, MinorChordId[]][] = [['T', ['i', 'VI']], ['SD', ['iv', 'iio']], ['D', ['V', 'viio', 'VII']]];
const FSW: Record<MinorFunction, string> = { T: 'var(--k-tonic)', SD: 'var(--k-sub)', D: 'var(--k-dom)' };

export function MinorCad() {
  const { s, nm, cur } = useLab();
  const tx = useLessonText(text);
  const [pid, setPid] = useState<MinorProgId>('basic');
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tok = useRef(0);
  useEffect(() => () => { tok.current++; stopAll(); }, []);

  const mt = relativeMinor(cur);
  const base = pcOf(mt);
  const lt = minorLeadingTone(mt);
  const s7 = subtonic(mt);
  const keyLabel = `${nm(mt)} ${tx.minor}`;
  const ch = (id: MinorChordId) => minorChord(mt, id);
  const cname = (id: MinorChordId) => nm(ch(id).notes[0]) + SUF[ch(id).quality];
  const lab = (id: MinorChordId) => `${ch(id).roman} (${cname(id)})`;

  const ids = MINOR_PROGS[pid];
  const steps = voiceMinorProg(mt, ids);
  const i = Math.min(idx, ids.length - 1);
  const st = steps[i];
  const c = st.chord;
  const isPic = c.id === 'I';
  const third = c.notes[1];
  const minorThird = ch('i').notes[1];

  // keyboard marks: bass + close voicing, colored by function; leading tone and Picardy third in coral
  const marks: Record<number, Mark> = {};
  if (i > 0) steps[i - 1].upper.forEach((x) => { if (!st.upper.includes(x)) marks[x] = { ghost: 'var(--muted)' }; });
  const toneOf = (x: number) => c.notes.findIndex((n) => pcOf(n) === mod(x, 12));
  st.upper.forEach((x) => {
    const k = toneOf(x);
    const n = c.notes[k];
    const role = sameNote(n, lt) ? 'lt' : isPic && k === 1 ? 'chg' : FUNCTION_ROLE[c.fn];
    marks[x] = roleMark(x, role, ['1', '3', '5'][k], nm(n));
  });
  marks[st.bass] = roleMark(st.bass, FUNCTION_ROLE[c.fn], '1', nm(c.notes[0]));

  let read: string;
  if (i === 0) read = tx.readStart(lab(c.id), tx.fnName[c.fn]);
  else {
    const p = steps[i - 1].chord;
    const cm = sharedNotes(p.notes, c.notes);
    read = tx.readMove(lab(p.id), lab(c.id), tx.fnName[c.fn], tx.common(cm.length, cm.map(nm).join(', ')));
    if (p.notes.some((n) => sameNote(n, lt)) && (c.id === 'i' || c.id === 'I')) read += tx.readResolve(nm(lt), nm(mt));
  }
  if (c.notes.some((n) => sameNote(n, lt))) read += tx.readLt(nm(lt), nm(mt));
  if (c.id === 'VII') read += tx.readVII(nm(s7), nm(mt));
  if (isPic) read += tx.readPicardy(nm(minorThird), nm(third));
  if (pid === 'half' && i === ids.length - 1) read += tx.readHalf;

  // keyboard range: just what the whole progression uses (bass to top voice), readable on a phone
  const all = steps.flatMap((x) => [x.bass, ...x.upper]);
  const lay = rangeAround(Math.min(...all), Math.max(...all));
  const ev = (k: number, t: number, d: number) => [
    { s: steps[k].bass, t, d, v: 0.45 },
    ...steps[k].upper.map((x) => ({ s: x, t, d, v: 0.5 })),
  ];
  const go = (k: number) => {
    tok.current++;
    setPlaying(false);
    stopAll();
    setIdx(k);
    playNotes(ev(k, 0, 1.2), 'mcad');
  };
  const playAll = () => {
    if (playing) { tok.current++; stopAll(); setPlaying(false); return; }
    const my = ++tok.current;
    setPlaying(true);
    const D = 1.1;
    steps.forEach((_, k) => {
      playNotes(ev(k, k * D, k === steps.length - 1 ? D * 1.6 : D * 0.95), 'mcad');
      later(() => { if (tok.current === my) setIdx(k); }, k * D + 0.08);
    });
    later(() => { if (tok.current === my) setPlaying(false); }, steps.length * D + 0.8);
  };
  const pickProg = (p: MinorProgId) => {
    tok.current++;
    stopAll();
    setPlaying(false);
    setPid(p);
    setIdx(0);
  };

  // predict: which note of V is the leading tone?
  const V = ch('V');
  const vS = triadSemis(base, V.notes);
  const pMarks: Record<number, Mark> = { [base]: roleMark(base, 'tonic', 1, nm(mt)), [base + 12]: roleMark(base + 12, 'tonic', 1, nm(mt)) };
  vS.forEach((x, k) => (pMarks[x] = roleMark(x, 'dom', undefined, nm(V.notes[k]))));

  const legend = [
    { color: 'var(--k-tonic)', label: tx.lgT },
    { color: 'var(--k-sub)', label: tx.lgSD },
    { color: 'var(--k-dom)', label: tx.lgD },
    { color: 'var(--k-lt)', label: tx.lgLt },
    ...(pid === 'picardy' ? [{ color: 'var(--k-chg)', label: tx.lgPic }] : []),
    { dash: 'var(--muted)', label: tx.lgWas },
  ];
  const fnText: Record<MinorFunction, string> = {
    T: tx.fTd(lab('i'), lab('VI')),
    SD: tx.fSDd(lab('iv')),
    D: tx.fDd(lab('V'), nm(lt)),
  };
  const fnHead: Record<MinorFunction, string> = { T: tx.fT, SD: tx.fSD, D: tx.fD };
  const bassNotes: Note[] = steps.map((x) => x.chord.notes[0]);

  return (
    <>
      <p className="desc">{tx.desc}</p>

      <h3 className="sub-h">{tx.fnTitle}</h3>
      <div className="fgrid">
        {GROUPS.map(([f, list]) => (
          <div key={f} className={'fcard f-' + f}>
            <h3><i className="sw" style={{ background: FSW[f] }} />{f} · {fnHead[f]}</h3>
            <div className="chips">
              {list.map((id) => (
                <button key={id} type="button" className={'chip f' + f}
                  onClick={() => playNotes(chordWithBass(triadSemis(base, ch(id).notes)), 'mcad')}>
                  {ch(id).roman}<small>{cname(id)}</small>
                </button>
              ))}
            </div>
            <p>{fnText[f]}</p>
          </div>
        ))}
      </div>

      <Predict mode="key" prompt={tx.predict(lab('V'), V.notes.map(nm).join(' '))} reveal={tx.predictReveal(nm(lt), nm(mt))}
        lay={rangeAround(base, base + 19)} marks={pMarks} answer={[vS[1]]} anyOctave top={30} resetOn={s.k + s.enh} />

      <h3 className="sub-h">{tx.progTitle}</h3>
      <p className="rowlab">{tx.progLabel}</p>
      <div className="chips" role="group" aria-label={tx.progLabel}>
        {MINOR_PROG_IDS.map((p) => (
          <button key={p} type="button" className="chip neutral" aria-pressed={p === pid} onClick={() => pickProg(p)}>
            {tx.progName[p]}<small>{tx.progTag[p]}</small>
          </button>
        ))}
      </div>
      <Html as="p" className="desc" html={tx.progDesc[pid]} />
      <p className="rowlab mt">{tx.chordsLabel}</p>
      <div className="chips timeline" role="group" aria-label={tx.chordsLabel}>
        {steps.map((x, k) => (
          <button key={k} type="button" className={'chip f' + x.chord.fn + (k === i && playing ? ' beat' : '')} aria-pressed={k === i} onClick={() => go(k)}>
            {x.chord.roman}<small>{cname(x.chord.id)} · {x.chord.fn}</small>
          </button>
        ))}
      </div>
      <div className="bar">
        <span className="now">{tx.pos(keyLabel, i + 1, ids.length)}</span>
        <div className="row">
          <div className="nav">
            <button type="button" aria-label={tx.prev} title={tx.prev} onClick={() => go((i - 1 + ids.length) % ids.length)}>◀</button>
            <button type="button" aria-label={tx.next} title={tx.next} onClick={() => go((i + 1) % ids.length)}>▶</button>
          </div>
          <button type="button" className={'play' + (playing ? ' on' : '')} onClick={playAll}>
            <span className="play-ic" aria-hidden="true">{playing ? '■' : '▶'}</span> {playing ? tx.stop : tx.playProg}
          </button>
        </div>
      </div>
      <Board><Keyboard lay={lay} marks={marks} channel="mcad" label={read} minWidth={lay.whites.length * 24} /></Board>
      <Legend items={legend} />
      <p className="readout">{read}</p>
      <p className="hint">{tx.bass(bassNotes.map(nm).join(' → '))}</p>

      <h3 className="sub-h">{tx.whyTitle}</h3>
      <Notes items={tx.why(nm(lt), nm(mt), nm(s7)).map((html) => ({ html }))} more={[4, 5]} />
      <Transfer question={tx.transfer} />
      <Recap {...tx.recap} />
    </>
  );
}
