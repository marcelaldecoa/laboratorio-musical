import { useState } from 'react';
import { chord, playNotes, seq } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { ScalesBracket, scaleSemis, stepsAny, upDown } from '../components/ScalesKit';
import { Bar, Board, Html, Legend, Notes, PlayButton, Seg } from '../components/ui';
import { useLessonText } from '../i18n/lessonText';
import { text } from '../i18n/lessons/minorvar';
import { useLab } from '../state/useLab';
import { pcOf } from '../theory';
import {
  MINOR_FORMS, type MinorForm, NATURAL_MINOR, harmonicMinor, melodicMinor, minorScale, naturalMinor, relativeMinor,
} from '../theory/scales';
import '../styles/scales.css';

export function MinorVar() {
  const { t, nm, cur } = useLab();
  const tx = useLessonText(text);
  const [form, setForm] = useState<MinorForm>('harmonic');
  const [dir, setDir] = useState<'up' | 'down'>('up');
  const m = relativeMinor(cur);
  const nat = naturalMinor(m);
  const down = form === 'melodic' && dir === 'down';
  const shownForm: MinorForm = down ? 'natural' : form;
  const shown = minorScale(m, shownForm);
  const base = pcOf(m);
  const semis = scaleSemis(base, MINOR_FORMS[shownForm]);
  const lay = rangeAround(base, base + 12);
  const marks: Record<number, Mark> = {};
  semis.forEach((x, i) => {
    const d = (i % 7) + 1;
    const n = shown[i % 7];
    const changed = n.acc !== nat[i % 7].acc;
    if (d === 1) marks[x] = roleMark(x, 'tonic', d, nm(n));
    else if (changed) {
      marks[x] = roleMark(x, d === 7 ? 'lt' : 'chg', tx.raised(d), nm(n));
      const was = base + NATURAL_MINOR[d - 1];
      marks[was] = { ghost: 'var(--k-lt-line)', name: nm(nat[d - 1]) };
    } else marks[x] = roleMark(x, 'scale', d, nm(n));
  });
  const br: Record<MinorForm, [number, number, string]> = {
    natural: [6, 7, tx.bNatural],
    harmonic: [5, 6, tx.bHarmonic],
    melodic: [4, 7, down ? tx.bMelodicDown : tx.bMelodic],
  };
  const [ba, bb, bl] = br[form];
  const minName = `${nm(m)} ${tx.minor}`;
  const now = tx.now(`${minName} · ${tx[form].toLowerCase()}`, shown.map(nm).join(' '));
  const playUpDown = () => {
    const up = scaleSemis(base, MINOR_FORMS[form]);
    const dn = scaleSemis(base, MINOR_FORMS[form === 'melodic' ? 'natural' : form]);
    playNotes(seq(upDown(up, dn), 0.28, 0.42), 'minorvar');
  };
  const seventh = semis[6];
  const vName = nm(shown[4]) + (seventh - base === 10 ? tx.m : '');
  const playCad = () =>
    playNotes([...chord([base + 2, base + 7, seventh], 0, 1.1), ...chord([base + 3, base + 7, base + 12], 1.05, 1.8)], 'minorvar');
  const items = [
    { color: 'var(--k-tonic)', label: tx.lgTonic },
    { color: 'var(--k-scale)', label: tx.lgScale },
    ...(shownForm !== 'natural' ? [{ color: 'var(--k-lt)', label: tx.lgLt }] : []),
    ...(shownForm === 'melodic' ? [{ color: 'var(--k-chg)', label: tx.lgChg }] : []),
    ...(shownForm !== 'natural' ? [{ dash: 'var(--k-lt-line)', label: tx.lgGhost }] : []),
  ];
  const h = harmonicMinor(m);
  const mel = melodicMinor(m);
  return (
    <>
      <p className="desc">{tx.desc}</p>
      <p className="rowlab">{tx.form}</p>
      <Seg value={form} label={tx.form} onChange={setForm}
        options={(['natural', 'harmonic', 'melodic'] as const).map((v) => ({ v, label: tx[v] }))} />
      {form === 'melodic' && (
        <>
          <p className="rowlab">{tx.dir}</p>
          <Seg value={dir} label={tx.dir} onChange={setDir} options={[{ v: 'up', label: tx.up }, { v: 'down', label: tx.down }]} />
        </>
      )}
      <Bar now={now}>
        <PlayButton label={tx.playUpDown} seconds={4.4} onPlay={playUpDown} />
        <PlayButton label={tx.playCad} seconds={2.8} onPlay={playCad} />
      </Bar>
      <Board>
        <Keyboard lay={lay} marks={marks} steps={stepsAny(semis, t.W, t.H, tx.wide, true)} top={50} channel="minorvar" label={now}
          ann={(l) => <ScalesBracket lay={l} a={semis[ba]} b={semis[bb]} y={22} label={bl} />} />
      </Board>
      <Legend items={items} />
      <Html as="p" className="readout" html={tx.read[shownForm](nm(shown[6]), nm(m), nm(shown[5]))} />
      <p className="hint">{tx.cadNote(vName, nm(m) + tx.m)}</p>
      <h3 className="sub-h">{tx.whyTitle}</h3>
      <Notes items={tx.why(minName, nm(nat[6]), nm(h[6]), nm(nat[5]), nm(mel[5]), nm(m), `${nm(m)} ${t.major}`).map((html) => ({ html }))} />
    </>
  );
}
