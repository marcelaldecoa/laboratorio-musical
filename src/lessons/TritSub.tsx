import { useState } from 'react';
import { playNotes } from '../audio/audio';
import { Bracket, Keyboard } from '../components/Keyboard';
import { type Mark, layout, rangeAround, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { MotionProgression, type ProgChord } from '../components/MotionProgression';
import { Bar, Board, Html, Legend, Notes, PlayButton, Seg } from '../components/ui';
import { type Note, chordInfo, displayed, fifthIndex, mod, pcOf } from '../theory';
import { SUFFIX, closeVoicing, diatonicTriad, qualityOf, tritoneSub } from '../theory/harmony';
import { text } from '../i18n/lessons/tritsub';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import '../styles/motion.css';

const CX = 150;
const CY = 150;
const R = 112;
const pos = (k: number, r = R): [number, number] => {
  const a = ((-90 + 30 * k) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const slotOfNote = (n: Note) => mod(fifthIndex(n) - 1, 12);

export function TritSub() {
  const { s, t: g, nm, cur, sc } = useLab();
  const t = useLessonText(text);
  const [which, setWhich] = useState<'v' | 'sub'>('sub');
  const [pv, setPv] = useState<'a' | 'b'>('b');
  const { v, sub, practical } = tritoneSub(cur);
  const sym = (ns: Note[]) => nm(ns[0]) + SUFFIX[qualityOf(ns)];
  const vName = sym(v);
  const subName = sym(sub);
  const tonicChord = diatonicTriad(sc, 0);
  const iiChord = diatonicTriad(sc, 1);

  /* keyboard: both chords keep the tritone on the same two keys */
  const vv = closeVoicing(v.map(pcOf), null, 0, 23, 9);
  const sv = closeVoicing(sub.map(pcOf), vv, 0, 23, 9);
  const ch = which === 'v' ? v : sub;
  const voicing = which === 'v' ? vv : sv;
  const marks: Record<number, Mark> = {};
  const triKeys: number[] = [];
  voicing.forEach((x) => {
    const k = ch.findIndex((n) => mod(pcOf(n) - x, 12) === 0);
    const tri = k === 1 || k === 3;
    if (tri) triKeys.push(x);
    const col = tri ? ['var(--k-lt)', 'var(--k-lt-ink)'] : which === 'v' ? ['var(--k-dom)', 'var(--k-dom-ink)'] : ['var(--k-sub)', 'var(--k-sub-ink)'];
    marks[x] = { fill: col[0], ink: col[1], label: ['1', '3', '5', '7'][k], name: nm(ch[k]) };
  });
  triKeys.sort((a, b) => a - b);
  const playRes = (c: Note[], cv: number[]) => playNotes([
    { s: pcOf(c[0]) - 12, t: 0, d: 1.2, v: 0.55 }, ...cv.map((x) => ({ s: x, t: 0, d: 1.2, v: 0.5 })),
    { s: pcOf(cur) - 12, t: 1.3, d: 1.6, v: 0.55 }, ...closeVoicing(tonicChord.map(pcOf), cv, 0, 23, 9).map((x) => ({ s: x, t: 1.3, d: 1.6, v: 0.5 })),
  ], 'tritsub');
  const read = which === 'v' ? t.readV(vName, nm(v[1]), nm(v[3])) : t.readSub(subName, nm(sub[1]), nm(sub[3]));

  /* circle */
  const ks = slotOfNote(cur);
  const kv = slotOfNote(v[0]);
  const ksub = slotOfNote(sub[0]);
  const special: Record<number, [Note, string, string]> = {
    [ks]: [cur, 'var(--k-tonic)', 'var(--k-tonic-ink)'],
    [kv]: [v[0], 'var(--k-dom)', 'var(--k-dom-ink)'],
    [ksub]: [sub[0], 'var(--k-sub)', 'var(--k-sub-ink)'],
  };
  const [x1, y1] = pos(kv, R - 20);
  const [x2, y2] = pos(ksub, R - 20);

  /* bass line ii → ♭II → I */
  const p = pcOf(cur) - 12;
  const bassLay = rangeAround(p, p + 12);
  const bassMarks: Record<number, Mark> = {
    [p + 2]: roleMark(p + 2, 'sub', 1, nm(sc[1])),
    [p + 1]: roleMark(p + 1, 'lt', 2, nm(sub[0])),
    [p]: roleMark(p, 'tonic', 3, nm(cur)),
  };

  /* progressions */
  const prog: ProgChord[] = [
    { notes: iiChord, roman: chordInfo(sc, 1).roman, name: sym(iiChord), tone: 'SD' },
    pv === 'a'
      ? { notes: v, roman: 'V7', name: vName, tone: 'D', hot: [false, true, false, true] }
      : { notes: sub, roman: '♭II7', name: subName, tone: 'D', hot: [false, true, false, true] },
    { notes: tonicChord, roman: 'I', name: sym(tonicChord), tone: 'T' },
  ];
  /* predict: where is the root of the other dominant with the same tritone? */
  const vMarks: Record<number, Mark> = {};
  vv.forEach((x) => {
    const k = v.findIndex((n) => mod(pcOf(n) - x, 12) === 0);
    vMarks[x] = roleMark(x, k === 1 || k === 3 ? 'lt' : 'dom', ['1', '3', '5', '7'][k], nm(v[k]));
  });
  const labels = { play: t.play, stop: t.stop, prev: t.prev, next: t.next, now: t.now };
  const ger = tritoneSub(sc[4]);

  return (
    <>
      <p className="desc">{t.desc}</p>
      <Predict mode="key" resetOn={`${s.k}${s.enh}`} lay={layout(0, 23)} marks={vMarks} answer={[mod(pcOf(sub[0]), 12)]} anyOctave
        prompt={t.predictQ(vName, nm(v[1]), nm(v[3]))}
        reveal={t.predictA(practical ? `${nm(sub[0])} (= ${nm(practical)})` : nm(sub[0]), nm(v[0]), nm(cur))} />
      <h3 className="sub-h">{t.stepsTitle}</h3>
      <ol className="recipe">
        <Html as="li" html={t.step1(vName, v.map(nm).join(' '), nm(v[1]), nm(v[3]))} />
        <Html as="li" html={t.step2} />
        <Html as="li" html={t.step3(nm(sub[1]), nm(sub[3]), subName, sub.map(nm).join(' '))} />
        <Html as="li" html={t.step4(nm(sub[0]), nm(cur))} />
      </ol>

      <p className="rowlab">{t.pickLab}</p>
      <Seg value={which} onChange={setWhich} label={t.pickLab}
        options={[{ v: 'v', label: `${t.vLab} · ${vName}` }, { v: 'sub', label: `${t.subLab} · ${subName}` }]} />
      <Bar now={which === 'v' ? vName : subName}>
        <PlayButton label={t.playRes(vName, sym(tonicChord))} seconds={3} onPlay={() => { setWhich('v'); playRes(v, vv); }} />
        <PlayButton label={t.playRes(subName, sym(tonicChord))} seconds={3} onPlay={() => { setWhich('sub'); playRes(sub, sv); }} />
      </Bar>
      <Board>
        <Keyboard lay={layout(0, 23)} marks={marks} top={60} channel="tritsub" label={read.replace(/<[^>]+>/g, '')}
          ann={(l) => triKeys.length === 2 && <Bracket lay={l} a={triKeys[0]} b={triKeys[1]} y={20} label={t.tritone} />} />
      </Board>
      <Legend items={[
        { color: 'var(--k-dom)', label: t.lgV },
        { color: 'var(--k-sub)', label: t.lgSub },
        { color: 'var(--k-lt)', label: t.lgTri },
      ]} />
      <Html as="p" className="readout" html={read} />
      {practical && <p className="hint">{t.practical(subName, nm(practical) + '7')}</p>}

      <h3 className="sub-h">{t.circleTitle}</h3>
      <p className="desc">{t.circleDesc(nm(v[0]), nm(sub[0]))}</p>
      <Board>
        <svg className="sq motion-circle" viewBox="0 0 300 300" role="img" aria-label={t.circleAria(nm(v[0]), nm(sub[0]))}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth={1.5} />
          <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: 'var(--change)', strokeWidth: 2, strokeDasharray: '6 4' }} />
          <rect x={CX - 48} y={CY - 24} width={96} height={42} rx={8} style={{ fill: 'var(--surface)', stroke: 'var(--line)' }} />
          <text className="ann" x={CX} y={CY - 8} textAnchor="middle">{t.circleMid}</text>
          <text className="ann" x={CX} y={CY + 10} textAnchor="middle">{t.tritone.split('·')[0].trim()}</text>
          {Array.from({ length: 12 }, (_, k) => {
            const [x, y] = pos(k);
            const sp = special[k];
            const label = sp ? nm(sp[0]) : nm(displayed(k, s.enh));
            return (
              <g key={k}>
                <circle cx={x} cy={y} r={sp ? 20 : 15} style={{ fill: sp ? sp[1] : 'var(--surface)', stroke: sp ? sp[1] : 'var(--line)', strokeWidth: 1.4 }} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                  style={{ font: `${sp ? 600 : 400} ${label.length > 3 ? 10 : 12}px var(--f-mono)`, fill: sp ? sp[2] : 'var(--muted)' }}>{label}</text>
              </g>
            );
          })}
        </svg>
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: g.lgTonic },
        { color: 'var(--k-dom)', label: t.vLab },
        { color: 'var(--k-sub)', label: t.subLab },
      ]} />

      <h3 className="sub-h">{t.bassTitle}</h3>
      <p className="desc">{t.bassDesc(nm(sc[1]), nm(sub[0]), nm(cur))}</p>
      <Board>
        <Keyboard lay={bassLay} marks={bassMarks} maxScale={1.3} channel="tritsub-prog" label={t.bassAria(nm(sc[1]), nm(sub[0]), nm(cur))}
          steps={[{ a: p + 2, b: p + 1, t: g.H, h: true }, { a: p + 1, b: p, t: g.H, h: true }]} />
      </Board>
      <Seg value={pv} onChange={setPv} label={t.bassTitle} options={[{ v: 'a', label: t.progA }, { v: 'b', label: t.progB }]} />
      <MotionProgression key={pv} chords={prog} channel="tritsub-prog" nm={nm} labels={labels} beat={1.2}
        read={(i) => t.readProg(prog[i].roman, prog[i].name, nm(prog[i].notes[0]))}
        legend={[
          { color: 'var(--k-sub)', label: t.lgSD },
          { color: 'var(--k-dom)', label: t.lgD },
          { color: 'var(--k-lt)', label: t.lgTri },
          { color: 'var(--k-tonic)', label: t.lgT },
          { dash: 'var(--muted)', label: t.lgWas },
        ]} />

      <h3 className="sub-h">{t.logicTitle}</h3>
      <Notes items={t.logic(vName, subName, sym(ger.sub), sym(diatonicTriad(sc, 4)), nm(v[1]), nm(sub[3])).map((html) => ({ html }))} more={[3]} />
      <Transfer question={t.transfer} />
      <Recap {...t.recap} />
    </>
  );
}
