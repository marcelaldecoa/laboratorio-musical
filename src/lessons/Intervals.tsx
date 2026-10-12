import { useState } from 'react';
import { playNotes, seq } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Bar, Board, Html, Legend, Notes, PlayButton } from '../components/ui';
import { text } from '../i18n/lessons/int';
import { useLessonText } from '../i18n/lessonText';
import { ACC_SYMBOL, NAT, type Note, pcOf } from '../theory';
import { degreeSemis } from '../theory/physics';
import { useLab } from '../state/useLab';

/** Treble staff with consecutive letter names from a tonic: one position per name. */
function StaffCount({ notes, onNote, label }: { notes: { n: Note; name: string; s: number }[]; onNote: (s: number) => void; label: string }) {
  const p0 = notes[0].n.letter;
  const xs = notes.map((_, i) => 100 + i * 40);
  const y = (p: number) => 96 - p * 5;
  return (
    <svg className="sm staffint" viewBox="0 0 300 132" role="img" aria-label={label}>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="40" x2="290" y1={46 + i * 10} y2={46 + i * 10} stroke="var(--fg)" strokeWidth="1" opacity=".7" />
      ))}
      <text x="44" y="76" className="mus" style={{ fontSize: 48, fill: 'var(--fg)' }}>𝄞</text>
      {notes.map(({ n, name, s }, i) => {
        const p = p0 + i;
        const x = xs[i];
        const end = i === 0 || i === notes.length - 1;
        const col = end ? 'var(--accent)' : 'var(--fg)';
        return (
          <g key={i} onClick={() => onNote(s)} style={{ cursor: 'pointer' }}>
            {p === 0 && <line x1={x - 12} x2={x + 12} y1="96" y2="96" stroke="var(--fg)" strokeWidth="1" opacity=".7" />}
            {p >= 12 && <line x1={x - 12} x2={x + 12} y1="36" y2="36" stroke="var(--fg)" strokeWidth="1" opacity=".7" />}
            {n.acc !== 0 && <text x={x - 15} y={y(p) + 5} textAnchor="middle" style={{ font: '400 15px var(--f-music)', fill: col }}>{ACC_SYMBOL[n.acc]}</text>}
            <ellipse cx={x} cy={y(p)} rx="6.5" ry="4.6" transform={`rotate(-20 ${x} ${y(p)})`} fill={col} />
            <text x={x} y="122" textAnchor="middle" style={{ font: '500 12px var(--f-mono)', fill: col }}>{i + 1}</text>
            <text x={x} y="20" textAnchor="middle" style={{ font: '400 12px var(--f-mono)', fill: 'var(--muted)' }}>{name}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Intervals() {
  const { s, nm, sc, cur } = useLab();
  const x = useLessonText(text);
  const [g, setG] = useState(5);
  const [r, setR] = useState(0);
  const [inv, setInv] = useState(3);
  const reset = s.k + s.enh + s.lang + s.nt;
  const base = pcOf(cur);
  const at = (d: number) => base + degreeSemis(d);
  const nd = (d: number) => nm(sc[d % 7]);
  const marksFor = (from: number, to: number, label: (d: number) => string | number, mid: 'scale' | 'chg' = 'scale', twice?: number) => {
    const m: Record<number, Mark> = {};
    for (let d = from; d <= to; d++) {
      const k = at(d);
      m[k] = roleMark(k, d === from || d === to ? 'tonic' : d === twice ? 'chg' : mid, label(d), nd(d));
    }
    return m;
  };

  // 1 · staff: tonic to the 5th
  const staffBase = NAT[sc[0].letter] + sc[0].acc;
  const staffNotes = [0, 1, 2, 3, 4].map((d) => ({ n: sc[d], name: nd(d), s: staffBase + degreeSemis(d) }));
  const cap = x.staffCap(nd(0), nd(4));

  // 2 · the number on the keyboard
  const stp = g - 1;
  const lay2 = rangeAround(at(r), at(r) + 12);
  const m2 = marksFor(r, r + stp, (d) => d - r + 1);
  const names2 = Array.from({ length: g }, (_, i) => nd(r + i)).join(' ');
  const read2 = x.read(nd(r), nd(r + stp), g, names2);

  // 3 · 4th + 5th
  const lay3 = rangeAround(at(0), at(7));
  const m3 = marksFor(0, 7, (d) => (d === 0 || d === 3 || d === 7 ? (d === 7 ? 8 : d + 1) : ''), 'scale', 3);
  [1, 2, 4, 5, 6].forEach((d) => delete m3[at(d)]);

  // 4 · compound: the 9th
  const lay4 = rangeAround(at(0), at(8));
  const m4 = marksFor(0, 8, (d) => d + 1, 'scale', 7);

  // 5 · inversion
  const n5 = inv;
  const lay5 = rangeAround(at(0), at(7));
  const m5: Record<number, Mark> = {
    [at(0)]: roleMark(at(0), 'tonic', 1, nd(0)),
    [at(n5 - 1)]: roleMark(at(n5 - 1), 'chg', n5, nd(n5 - 1)),
    [at(7)]: roleMark(at(7), 'tonic', 8, nd(0)),
  };

  return (
    <>
      <p className="desc">{x.desc}</p>

      <h3 className="sub-h">{x.s1}</h3>
      <Predict mode="choice" prompt={x.p1(nd(0), nd(4))} options={[x.ord(4), x.ord(5), x.ord(7)]} answer={x.ord(5)}
        reveal={x.p1Rev([0, 1, 2, 3, 4].map(nd).join(' '))} resetOn={reset} />
      <p className="desc">{x.s1d}</p>
      <Board><StaffCount notes={staffNotes} label={cap} onNote={(k) => playNotes([{ s: k, t: 0, d: 0.8 }])} /></Board>
      <div className="bar"><Html as="p" className="readout" html={cap} />
        <PlayButton label={x.playStaff} seconds={3} onPlay={() => playNotes([...seq(staffNotes.map((n) => n.s), 0.3, 0.45),
          { s: staffNotes[0].s, t: 1.8, d: 1.2 }, { s: staffNotes[4].s, t: 1.8, d: 1.2 }])} />
      </div>

      <h3 className="sub-h">{x.s2}</h3>
      <p className="desc">{x.s2d}</p>
      <p className="rowlab">{x.from}</p>
      <div className="chips" role="group" aria-label={x.from}>
        {[0, 1, 2, 3, 4, 5, 6].map((d) => (
          <button key={d} type="button" className="chip neutral" aria-pressed={d === r} onClick={() => setR(d)}>{nd(d)}</button>
        ))}
      </div>
      <p className="rowlab">{x.pick}</p>
      <div className="chips" role="group" aria-label={x.pick}>
        {[2, 3, 4, 5, 6, 7, 8].map((n) => (
          <button key={n} type="button" className="chip neutral" aria-pressed={n === g} onClick={() => setG(n)}>{x.ord(n)}</button>
        ))}
      </div>
      <Bar now={read2}>
        <PlayButton label={x.playInt} seconds={2.5} onPlay={() => playNotes([{ s: at(r), t: 0, d: 0.6 }, { s: at(r + stp), t: 0.55, d: 0.6 },
          { s: at(r), t: 1.2, d: 1.3, v: 0.55 }, { s: at(r + stp), t: 1.2, d: 1.3, v: 0.55 }], 'int2')} />
      </Bar>
      <Board>
        <Keyboard lay={lay2} marks={m2} top={50} channel="int2" label={read2}
          ann={(l) => <Bracket lay={l} a={at(r)} b={at(r + stp)} y={22} label={x.bracket(g)} />} />
      </Board>
      <Legend items={[{ color: 'var(--k-tonic)', label: x.lgEnds }, { color: 'var(--k-scale)', label: x.lgMid }]} />

      <h3 className="sub-h">{x.s3}</h3>
      <Predict mode="choice" prompt={x.p3} options={x.p3Opts} answer={x.p3Ans} reveal={x.p3Rev(nd(0), nd(3))} resetOn={reset} />
      <p className="desc">{x.s3d(nd(3))}</p>
      <Bar>
        <PlayButton label={x.playSum} seconds={3} onPlay={() => playNotes([...seq([at(0), at(3), at(7)], 0.5, 0.6), { s: at(0), t: 1.7, d: 1.3, v: 0.5 }, { s: at(7), t: 1.7, d: 1.3, v: 0.5 }], 'int3')} />
      </Bar>
      <Board>
        <Keyboard lay={lay3} marks={m3} top={76} channel="int3" label={x.sumTop}
          ann={(l) => (<>
            <Bracket lay={l} a={at(0)} b={at(7)} y={20} label={x.sumTop} />
            <Bracket lay={l} a={at(0)} b={at(3)} y={50} label={x.ord(4)} />
            <Bracket lay={l} a={at(3)} b={at(7)} y={50} label={x.ord(5)} />
          </>)} />
      </Board>
      <Legend items={[{ color: 'var(--k-tonic)', label: x.lgEnds }, { color: 'var(--k-chg)', label: x.lgTwice }]} />

      <h3 className="sub-h">{x.s4}</h3>
      <p className="desc">{x.s4d}</p>
      <Bar>
        <PlayButton label={x.playComp} seconds={3} onPlay={() => playNotes([{ s: at(0), t: 0, d: 0.6 }, { s: at(8), t: 0.55, d: 0.6 }, { s: at(0), t: 1.2, d: 1.5, v: 0.5 }, { s: at(8), t: 1.2, d: 1.5, v: 0.5 }], 'int4')} />
      </Bar>
      <Board>
        <Keyboard lay={lay4} marks={m4} top={76} channel="int4" label={x.compTop}
          ann={(l) => (<>
            <Bracket lay={l} a={at(0)} b={at(8)} y={20} label={x.compTop} />
            <Bracket lay={l} a={at(0)} b={at(7)} y={50} label={x.ord(8)} />
            <Bracket lay={l} a={at(7)} b={at(8)} y={50} label={x.ord(2)} />
          </>)} />
      </Board>
      <Legend items={[{ color: 'var(--k-tonic)', label: x.lgEnds }, { color: 'var(--k-chg)', label: x.lgTwice }, { color: 'var(--k-scale)', label: x.lgMid }]} />

      <h3 className="sub-h">{x.s5}</h3>
      <Predict mode="choice" prompt={x.p5(nd(0), nd(2))} options={x.p5Opts} answer={x.p5Ans} reveal={x.p5Rev(nd(2))} resetOn={reset} />
      <p className="desc">{x.s5d}</p>
      <div className="chips" role="group" aria-label={x.pick}>
        {[2, 3, 4, 5, 6, 7].map((n) => (
          <button key={n} type="button" className="chip neutral" aria-pressed={n === inv} onClick={() => setInv(n)}>{x.ord(n)}</button>
        ))}
      </div>
      <Bar now={x.invRead(nd(0), nd(n5 - 1), n5, 9 - n5)}>
        <PlayButton label={x.playInv} seconds={3} onPlay={() => playNotes([
          { s: at(0), t: 0, d: 0.9, v: 0.5 }, { s: at(n5 - 1), t: 0, d: 0.9, v: 0.5 },
          { s: at(n5 - 1), t: 1.1, d: 1.1, v: 0.5 }, { s: at(7), t: 1.1, d: 1.1, v: 0.5 }], 'int5')} />
      </Bar>
      <Board>
        <Keyboard lay={lay5} marks={m5} top={76} channel="int5" label={x.invRead(nd(0), nd(n5 - 1), n5, 9 - n5)}
          ann={(l) => (<>
            <Bracket lay={l} a={at(0)} b={at(n5 - 1)} y={50} label={x.ord(n5)} />
            <Bracket lay={l} a={at(n5 - 1)} b={at(7)} y={20} label={x.ord(9 - n5)} />
          </>)} />
      </Board>
      <Legend items={[{ color: 'var(--k-tonic)', label: x.lgEnds }, { color: 'var(--k-chg)', label: x.lgTwice }]} />

      <h3 className="sub-h">{x.why}</h3>
      <Notes items={x.notes.map((html) => ({ html }))} more={x.more} />
      <Transfer question={x.transfer} />
      <Recap {...x.recap} />
    </>
  );
}
