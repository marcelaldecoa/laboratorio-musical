import { type ReactNode, useState } from 'react';
import { playNotes } from '../audio/audio';
import { Predict, Recap, Transfer } from '../components/Learn';
import { FUNCTION_ROLE, MinorChordKeys, QUALITY_CHIP, QUALITY_ROLE, chordWithBass, triadSemis } from '../components/MinorKit';
import { Bar, Board, Legend, Notes, PlayButton } from '../components/ui';
import { useLessonText } from '../i18n/lessonText';
import { text } from '../i18n/lessons/minorfield';
import { useLab } from '../state/useLab';
import { type Note, pcOf } from '../theory';
import {
  DEGREES_WITH_SEVENTH, type MinorChordId, type MinorFunction, type MinorTriadQuality, minorChord, minorLeadingTone,
  minorRoman, minorTriads,
} from '../theory/minorHarmony';
import { harmonicMinor, naturalMinor, relativeMinor } from '../theory/scales';
import '../styles/scales.css';

const SUF: Record<MinorTriadQuality, string> = { maj: '', min: 'm', dim: '°', aug: '+' };
const GROUPS: [MinorFunction, MinorChordId[]][] = [['T', ['i', 'VI', 'III']], ['SD', ['iv', 'iio']], ['D', ['V', 'viio', 'VII']]];
const TONES = ['1', '3', '5'];

export function MinorField() {
  const { s, nm, keyName, cur } = useLab();
  const tx = useLessonText(text);
  const [d1, setD1] = useState(0);
  const [pair, setPair] = useState<{ d: number; h: boolean }>({ d: 4, h: true });
  const [id3, setId3] = useState<MinorChordId>('V');

  const mt = relativeMinor(cur);
  const base = pcOf(mt);
  const nat = naturalMinor(mt);
  const har = harmonicMinor(mt);
  const lt = minorLeadingTone(mt);
  const minName = `${nm(mt)} ${tx.minor}`;
  const majName = keyName(cur);
  const cname = (notes: Note[], q: MinorTriadQuality) => nm(notes[0]) + SUF[q];
  const natT = minorTriads(mt, 'natural');
  const harT = minorTriads(mt, 'harmonic');
  const tonic = triadSemis(base, natT[0].notes);
  const toI = (from: number[]) => playNotes([...chordWithBass(from, 0, 1.1), ...chordWithBass(tonic.map((x) => x + (from[0] > tonic[0] + 6 ? 12 : 0)), 1.1, 1.6)], 'mfield2');

  // 1 · natural triads
  const c1 = natT[d1];
  const s1 = triadSemis(base, c1.notes);
  const now1 = tx.now(c1.roman, cname(c1.notes, c1.quality), c1.notes.map(nm).join(' '));
  const playAll = () => playNotes(natT.flatMap((c, i) => chordWithBass(triadSemis(base, c.notes), i * 0.9, 0.85)), 'mfield1');

  // 2 · before and after
  const a2 = natT[pair.d];
  const b2 = harT[pair.d];
  const c2 = pair.h ? b2 : a2;
  const now2 = tx.now(c2.roman, cname(c2.notes, c2.quality), c2.notes.map(nm).join(' '));
  const v = natT[4];
  const V = harT[4];

  // 3 · the usual mixture
  const c3 = minorChord(mt, id3);
  const now3 = tx.now(c3.roman, cname(c3.notes, c3.quality), c3.notes.map(nm).join(' '));

  const qualityLegend = [
    { color: 'var(--k-tonic)', label: tx.lgMaj },
    { color: 'var(--k-sub)', label: tx.lgMin },
    { color: 'var(--k-chg)', label: tx.lgDim },
    { color: 'var(--k-scale)', label: tx.lgScale },
  ];
  const fnHead: Record<MinorFunction, string> = { T: tx.fT, SD: tx.fSD, D: tx.fD };
  const fnText: Record<MinorFunction, string> = { T: tx.fTd, SD: tx.fSDd, D: tx.fDd(nm(lt)) };
  const fnSw: Record<MinorFunction, string> = { T: 'var(--k-tonic)', SD: 'var(--k-sub)', D: 'var(--k-dom)' };

  return (
    <>
      <p className="desc">{tx.desc}</p>

      <h3 className="sub-h">{tx.step1}</h3>
      <p className="desc">{tx.step1Desc(minName, majName)}</p>
      <div className="chips" role="group" aria-label={tx.chordsLabel}>
        {natT.map((c) => (
          <button key={c.degree} type="button" className={'chip ' + QUALITY_CHIP[c.quality]} aria-pressed={c.degree === d1}
            onClick={() => { setD1(c.degree); playNotes(chordWithBass(triadSemis(base, c.notes)), 'mfield1'); }}>
            {c.roman}<small>{cname(c.notes, c.quality)} {tx.inMajor(minorRoman((c.degree + 5) % 7, c.quality))}</small>
          </button>
        ))}
      </div>
      <Bar now={now1}>
        <PlayButton label={tx.play} seconds={1.4} onPlay={() => playNotes(chordWithBass(s1), 'mfield1')} />
        <PlayButton label={tx.playAll} seconds={6.6} onPlay={playAll} />
      </Bar>
      <Board>
        <MinorChordKeys base={base} notes={c1.notes} role={QUALITY_ROLE[c1.quality]} scale={nat} nm={nm} channel="mfield1" label={now1} tones={TONES} />
      </Board>
      <Legend items={qualityLegend} />
      <p className="readout">{tx.read1(majName)}</p>

      <Predict mode="choice" prompt={tx.predict(nm(nat[6]), nm(lt))} options={natT.map((c) => c.roman)} answer={natT[4].roman}
        reveal={tx.predictReveal(`${v.roman} (${cname(v.notes, v.quality)})`, `${V.roman} (${cname(V.notes, V.quality)})`, nm(lt))} resetOn={s.k + s.enh} />

      <h3 className="sub-h">{tx.step2}</h3>
      <p className="desc">{tx.step2Desc}</p>
      <p className="rowlab">{tx.pairLabel}</p>
      {DEGREES_WITH_SEVENTH.map((d) => {
        const a = natT[d];
        const b = harT[d];
        return (
          <div key={d} className="chips minor-pair" role="group" aria-label={`${a.roman} → ${b.roman}`}>
            {[a, b].map((c, i) => (
              <button key={i} type="button" className={'chip ' + QUALITY_CHIP[c.quality]} aria-pressed={pair.d === d && pair.h === (i === 1)}
                onClick={() => { setPair({ d, h: i === 1 }); playNotes(chordWithBass(triadSemis(base, c.notes)), 'mfield2'); }}>
                {c.roman}<small>{cname(c.notes, c.quality)}</small>
              </button>
            )).reduce<ReactNode[]>((acc, el, i) => (i ? [...acc, <span key="ar" className="minor-arrow" aria-hidden="true">→</span>, el] : [el]), [])}
          </div>
        );
      })}
      <Bar now={now2}>
        <PlayButton label={tx.playVi(v.roman)} seconds={2.8} onPlay={() => toI(triadSemis(base, v.notes))} />
        <PlayButton label={tx.playVI(V.roman)} seconds={2.8} onPlay={() => toI(triadSemis(base, V.notes))} />
      </Bar>
      <Board>
        <MinorChordKeys base={base} notes={c2.notes} role={QUALITY_ROLE[c2.quality]} scale={pair.h ? har : nat}
          raised={pair.h ? c2.raised : []} natural7={nat[6]} nm={nm} channel="mfield2" label={now2} tones={TONES} />
      </Board>
      <Legend items={[
        ...qualityLegend.slice(0, 3),
        { color: 'var(--k-lt)', label: tx.lgLt },
        { dash: 'var(--k-lt-line)', label: tx.lgWas },
      ]} />
      <p className="readout">{tx.read2[pair.d](`${a2.roman} (${cname(a2.notes, a2.quality)})`, `${b2.roman} (${cname(b2.notes, b2.quality)})`, nm(lt), nm(mt))}</p>

      <h3 className="sub-h">{tx.step3}</h3>
      <p className="desc">{tx.step3Desc}</p>
      <div className="fgrid">
        {GROUPS.map(([f, ids]) => (
          <div key={f} className={'fcard f-' + f}>
            <h3><i className="sw" style={{ background: fnSw[f] }} />{f} · {fnHead[f]}</h3>
            <div className="chips">
              {ids.map((id) => {
                const c = minorChord(mt, id);
                return (
                  <button key={id} type="button" className={'chip f' + f} aria-pressed={id === id3}
                    onClick={() => { setId3(id); playNotes(chordWithBass(triadSemis(base, c.notes)), 'mfield3'); }}>
                    {c.roman}<small>{cname(c.notes, c.quality)}</small>
                  </button>
                );
              })}
            </div>
            <p>{fnText[f]}</p>
          </div>
        ))}
      </div>
      <Bar now={now3}>
        <PlayButton label={tx.play} seconds={1.4} onPlay={() => playNotes(chordWithBass(triadSemis(base, c3.notes)), 'mfield3')} />
      </Bar>
      <Board>
        <MinorChordKeys base={base} notes={c3.notes} role={FUNCTION_ROLE[c3.fn]} scale={c3.raised.length ? har : nat}
          raised={c3.raised} natural7={nat[6]} nm={nm} channel="mfield3" label={now3} tones={TONES} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: tx.lgT },
        { color: 'var(--k-sub)', label: tx.lgSD },
        { color: 'var(--k-dom)', label: tx.lgD },
        { color: 'var(--k-lt)', label: tx.lgLt },
        { dash: 'var(--k-lt-line)', label: tx.lgWas },
      ]} />

      <h3 className="sub-h">{tx.whyTitle}</h3>
      <Notes items={tx.why(minName, majName, `${v.roman} (${cname(v.notes, v.quality)})`, nm(lt), nm(nat[6]), nm(mt)).map((html) => ({ html }))} more={[4, 5, 6]} />
      <Transfer question={tx.transfer} />
      <Recap {...tx.recap} />
    </>
  );
}
