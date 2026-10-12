import { useState } from 'react';
import { playNotes, seq } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type Mark, layout, roleMark, stepsFor } from '../components/layout';
import { Bar, Board, Legend, Notes, PlayButton, Seg } from '../components/ui';
import { text } from '../i18n/lessons/keys';
import { useLessonText } from '../i18n/lessonText';
import { NAT, type Note, isBlackKey, mod, note } from '../theory';
import { useLab } from '../state/useLab';

/** The other common spelling of the same key (C♯ ↔ D♭, E♯ ↔ F, C♭ ↔ B). */
function respell(n: Note): Note {
  const pc = mod(NAT[n.letter] + n.acc, 12);
  for (const d of n.acc > 0 ? [1, -1] : [-1, 1]) {
    const l = mod(n.letter + d, 7);
    const acc = ((pc - NAT[l] + 18) % 12) - 6;
    if (Math.abs(acc) <= 1) return note(l, acc);
  }
  return n;
}

export function Keys() {
  const { t, nm } = useLab();
  const x = useLessonText(text);
  const [letter, setLetter] = useState(0);
  const [acc, setAcc] = useState(1);

  // 1 · names of the white keys
  const lay1 = layout(0, 23);
  const m1: Record<number, Mark> = {};
  lay1.whites.forEach((s) => {
    const l = NAT.indexOf(mod(s, 12) as (typeof NAT)[number]);
    m1[s] = roleMark(s, l === 0 ? 'tonic' : 'path', undefined, nm(note(l)));
  });

  // 2 · half steps from C to C
  const lay2 = layout(0, 12);
  const m2: Record<number, Mark> = {};
  for (let s = 0; s <= 12; s++) m2[s] = roleMark(s, [4, 5, 11, 12].includes(s) ? 'chg' : s === 0 ? 'tonic' : 'path', s);
  const whites = [0, 2, 4, 5, 7, 9, 11, 12];

  // 3 · letter + sign → key
  const picked = note(letter, acc);
  const key = NAT[letter] + acc;
  const lay3 = layout(-1, 14);
  const m3: Record<number, Mark> = {};
  if (acc !== 0) m3[NAT[letter]] = { ghost: 'var(--k-sub-line)', name: nm(note(letter)) };
  m3[key] = { ...roleMark(key, 'tonic', undefined, nm(picked)) };
  const other = respell(picked);
  let read = x.plain(nm(picked));
  if (acc !== 0) read = isBlackKey(key) ? x.same(nm(picked), nm(other)) : `${x.is(nm(picked), nm(other))} · ${x.white(nm(picked))}`;

  // 4 · octave
  const m4: Record<number, Mark> = { 0: roleMark(0, 'tonic', 1, nm(note(0))), 12: roleMark(12, 'tonic', 8, nm(note(0))) };

  return (
    <>
      <p className="desc">{x.desc}</p>

      <h3 className="sub-h">{x.s1}</h3>
      <p className="desc">{x.s1d}</p>
      <Board><Keyboard lay={lay1} marks={m1} channel="keys1" label={x.s1} /></Board>
      <Legend items={[{ color: 'var(--k-tonic)', label: x.lgC }, { color: 'var(--k-path)', label: x.lgWhite }]} />
      <p className="hint">{x.s1hint}</p>

      <h3 className="sub-h">{x.s2}</h3>
      <p className="desc">{x.s2d}</p>
      <Bar now={x.oct}>
        <PlayButton label={x.s2play} seconds={4} onPlay={() => playNotes(seq([...Array(13).keys()], 0.26, 0.4), 'keys2')} />
      </Bar>
      <Board>
        <Keyboard lay={lay2} marks={m2} top={50} channel="keys2" label={x.oct} steps={stepsFor(whites, t.W, t.H)}
          ann={(l) => <Bracket lay={l} a={0} b={12} y={22} label={x.oct} />} />
      </Board>
      <Legend items={[{ color: 'var(--k-path)', label: x.lgCount }, { color: 'var(--k-chg)', label: x.lgShort }]} />
      <p className="readout">{x.s2note(nm(note(2)), nm(note(3)), nm(note(6)), nm(note(0)))}</p>

      <h3 className="sub-h">{x.s3}</h3>
      <p className="desc">{x.s3d}</p>
      <p className="rowlab">{x.letter}</p>
      <div className="chips" role="group" aria-label={x.letter}>
        {[0, 1, 2, 3, 4, 5, 6].map((l) => (
          <button key={l} type="button" className="chip neutral" aria-pressed={l === letter}
            onClick={() => { setLetter(l); playNotes([{ s: NAT[l] + acc, t: 0, d: 0.8 }], 'keys3'); }}>
            {nm(note(l))}
          </button>
        ))}
      </div>
      <p className="rowlab">{x.sign}</p>
      <Seg label={x.sign} value={acc} onChange={(a) => { setAcc(a); playNotes([{ s: NAT[letter] + a, t: 0, d: 0.8 }], 'keys3'); }}
        options={[{ v: -1, label: x.flat }, { v: 0, label: x.natural }, { v: 1, label: x.sharp }]} />
      <Board className="mt"><Keyboard lay={lay3} marks={m3} channel="keys3" label={read} /></Board>
      <Legend items={[{ color: 'var(--k-tonic)', label: x.lgPicked }, { dash: 'var(--k-sub-line)', label: x.lgFrom }]} />
      <p className="readout">{read}</p>

      <h3 className="sub-h">{x.s4}</h3>
      <p className="desc">{x.s4d}</p>
      <Bar>
        <PlayButton label={x.s4play} seconds={3} onPlay={() => playNotes([{ s: 0, t: 0, d: 0.8 }, { s: 12, t: 0.7, d: 0.8 }, { s: 0, t: 1.5, d: 1.5, v: 0.5 }, { s: 12, t: 1.5, d: 1.5, v: 0.5 }], 'keys4')} />
      </Bar>
      <Board>
        <Keyboard lay={layout(0, 12)} marks={m4} top={50} channel="keys4" label={x.s4}
          ann={(l) => <Bracket lay={l} a={0} b={12} y={22} label={x.oct} />} />
      </Board>

      <h3 className="sub-h">{x.why}</h3>
      <Notes items={x.notes.map((html) => ({ html }))} />
    </>
  );
}
