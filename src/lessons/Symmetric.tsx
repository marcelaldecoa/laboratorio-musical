import { useState } from 'react';
import { playNotes, seq } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark, stepsFor } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Bar, Board, Legend, Notes, PlayButton, Seg } from '../components/ui';
import { useLessonText } from '../i18n/lessonText';
import { text } from '../i18n/lessons/sym';
import { useLab } from '../state/useLab';
import { type Note, mod, pcOf } from '../theory';
import { SYM_OFFSETS, type SymId, spellCycle, stepsOf, transpositions } from '../theory/scales';
import '../styles/scales.css';

const CX = 150;
const CY = 150;
const pt = (k: number, r: number): [number, number] => {
  const a = ((-90 + 30 * k) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const poly = (ks: number[]) => ks.map((k) => pt(k, 96).map((v) => v.toFixed(1)).join(',')).join(' ');

export function Symmetric() {
  const { t, nm, cur } = useLab();
  const tx = useLessonText(text);
  const [kind, setKindRaw] = useState<SymId>('whole');
  const [rot, setRot] = useState(0);
  const setKind = (k: SymId) => {
    setKindRaw(k);
    setRot(0);
  };
  const offs = SYM_OFFSETS[kind];
  const n = offs.length;
  const r = rot % n;
  const base = pcOf(cur);
  const scale = spellCycle(cur, offs);
  const chrom = spellCycle(cur, SYM_OFFSETS.chromatic);
  // spelled name of each offset from the tonic (0–11)
  const names: Note[] = [...chrom];
  if (kind === 'whole') spellCycle(chrom[1], SYM_OFFSETS.whole).forEach((x, i) => (names[(1 + 2 * i) % 12] = x));
  offs.forEach((o, i) => (names[o] = scale[i]));
  const inA = (o: number) =>
    kind === 'chromatic' ? true : kind === 'whole' ? o % 2 === 0 : o % 3 === 0;
  const inScale = (o: number) => offs.includes(o);

  const startOff = offs[r];
  const startPc = base + startOff;
  const semis = [...Array.from({ length: n }, (_, i) => startPc + mod(offs[(r + i) % n] - startOff, 12)), startPc + 12];
  const lay = rangeAround(startPc, startPc + 12);
  const marks: Record<number, Mark> = {};
  for (let x = lay.from; x <= lay.to; x++) {
    const o = mod(x - base, 12);
    const nmx = nm(names[o]);
    const idx = semis.indexOf(x);
    const count = idx >= 0 ? (idx % n) + 1 : undefined;
    if (o === startOff) marks[x] = roleMark(x, 'tonic', 1, nmx);
    else if (kind === 'whole' && !inScale(o)) marks[x] = roleMark(x, 'acc', undefined, nmx);
    else if (inScale(o)) marks[x] = roleMark(x, inA(o) || kind === 'chromatic' ? 'scale' : 'acc', count, nmx);
  }
  const pattern = stepsOf(offs).map((s) => (s === 1 ? t.H : t.W));
  const rotPattern = [...pattern.slice(r), ...pattern.slice(0, r)].join(' ');
  const now = tx.now(nm(scale[r]), [...scale.slice(r), ...scale.slice(0, r)].map(nm).join(' '));

  const evens = [0, 2, 4, 6, 8, 10];
  const odds = [1, 3, 5, 7, 9, 11];
  const polys: { ks: number[]; stroke: string; dash?: boolean }[] =
    kind === 'chromatic'
      ? [{ ks: Array.from({ length: 12 }, (_, i) => i), stroke: 'var(--accent)' }]
      : kind === 'whole'
        ? [{ ks: evens, stroke: 'var(--accent)' }, { ks: odds, stroke: 'var(--flat)' }]
        : [{ ks: [...offs], stroke: 'var(--muted)', dash: true }, { ks: [0, 3, 6, 9], stroke: 'var(--accent)' }, { ks: [1, 4, 7, 10], stroke: 'var(--flat)' }];

  const legend = [
    { color: 'var(--k-tonic)', label: tx.lgStart },
    { color: 'var(--k-scale)', label: tx.lgA[kind] },
    ...(kind === 'chromatic' ? [] : [{ color: 'var(--k-acc)', label: tx.lgB[kind] }]),
  ];

  return (
    <>
      <p className="desc">{tx.desc}</p>
      <Predict mode="choice" prompt={tx.predict(nm(cur))} options={tx.predictOptions} answer={tx.predictAnswer} reveal={tx.predictReveal} />
      <p className="rowlab">{tx.kind}</p>
      <Seg value={kind} label={tx.kind} onChange={setKind}
        options={(['chromatic', 'whole', 'octatonic'] as const).map((v) => ({ v, label: tx[v] }))} />
      <Bar now={now}>
        <PlayButton label={tx.play} seconds={n * 0.26 + 0.6} onPlay={() => playNotes(seq(semis, 0.26, 0.4), 'sym')} />
      </Bar>
      <div className="nav mt">
        <button type="button" onClick={() => setRot((x) => (x + 1) % n)}>{tx.shift}</button>
        <button type="button" disabled={r === 0} onClick={() => setRot(0)}>{tx.reset}</button>
      </div>
      <Board className="mt">
        <Keyboard lay={lay} marks={marks} steps={stepsFor(semis, t.W, t.H)} top={30} channel="sym" label={now} />
      </Board>
      <Legend items={legend} />
      <p className="readout">{tx.same(rotPattern)}</p>

      <h3 className="sub-h">{tx.circleTitle}</h3>
      <Board>
        <svg className="scales-circle" viewBox="0 0 300 300" role="img" aria-label={tx.circleLabel(tx.shape[kind])}>
          <circle cx={CX} cy={CY} r={96} fill="none" stroke="var(--line)" />
          {polys.map((p, i) => (
            <polygon key={i} points={poly(p.ks)} fill={p.dash ? 'none' : p.stroke} fillOpacity={p.dash ? 0 : 0.1}
              stroke={p.stroke} strokeWidth={p.dash ? 1.2 : 2} strokeDasharray={p.dash ? '4 4' : undefined} strokeLinejoin="round" />
          ))}
          {Array.from({ length: 12 }, (_, o) => {
            const [x, y] = pt(o, 96);
            const [lx, ly] = pt(o, 124);
            const on = kind === 'whole' || inScale(o);
            const col = !on ? 'var(--line)' : kind === 'chromatic' || inA(o) ? 'var(--accent)' : 'var(--flat)';
            const isS = o === startOff;
            return (
              <g key={o}>
                <circle cx={x} cy={y} r={isS ? 9 : 5} style={{ fill: isS ? 'var(--k-tonic)' : col, stroke: isS ? 'var(--fg)' : 'none', strokeWidth: 1.5 }} />
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
                  style={{ font: `${on ? 500 : 400} 13px var(--f-mono)`, fill: on ? 'var(--fg)' : 'var(--muted)' }}>{nm(names[o])}</text>
              </g>
            );
          })}
        </svg>
      </Board>
      <p className="readout">{tx.circleRead[kind]} {tx.count(transpositions(offs))}</p>
      <h3 className="sub-h">{tx.whyTitle}</h3>
      <Notes items={tx.why.map((html) => ({ html }))} more={[4, 5]} />
      <Transfer question={tx.transfer} />
      <Recap {...tx.recap} />
    </>
  );
}
