import { useState } from 'react';
import { Predict, Recap } from '../components/Learn';
import { type Mark, rangeAround } from '../components/layout';
import { RepFindings, RepPiece, useNoteFill } from '../components/RepPiece';
import { Html, Legend, Notes } from '../components/ui';
import { text } from '../i18n/lessons/repbach';
import { repShared } from '../i18n/lessons/repShared';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import { BACH, type RepFunc, semi } from '../theory/repertoire';
import '../styles/repertoire.css';

const CH = 'repbach';
const FN_FILL: Record<RepFunc, [string, string]> = {
  T: ['var(--k-tonic)', 'var(--k-tonic-ink)'], SD: ['var(--k-sub)', 'var(--k-sub-ink)'], D: ['var(--k-dom)', 'var(--k-dom-ink)'], secD: ['var(--k-dom)', 'var(--k-dom-ink)'],
};
const FINDS: [string, number][] = [['lefthand', 0], ['inversions', 1], ['prog', 1], ['secdom', 5], ['v7', 5], ['jump', 8]];

/** The lowest note of each bar, drawn as a line: the bass stays near middle C, then falls by fifths. */
function BassLine({ fill, aria, fifthDown, fourthUp }: { fill: (s: string) => string; aria: string; fifthDown: string; fourthUp: string }) {
  const { nm } = useLab();
  const bass = BACH.bars.map((b) => {
    const p = b.ev.filter((e) => e.p).map((e) => e.p!).sort((x, y) => semi(x) - semi(y))[0];
    return { p, s: semi(p), fn: b.harm[0].fn };
  });
  const lo = -11;
  const hi = 1;
  const W = 520;
  const X = (i: number) => 30 + i * 44;
  const Y = (sm: number) => 20 + (hi - sm) * 13;
  return (
    <svg className="rep-diag" viewBox={`0 0 ${W} ${Y(lo) + 34}`} role="img" aria-label={aria}>
      <line x1={20} x2={W - 10} y1={Y(0)} y2={Y(0)} stroke="var(--line)" strokeWidth={1.2} />
      <text className="rep-dm" x={W - 10} y={Y(0) - 5} textAnchor="end">{fill('{C}')}4</text>
      <polyline points={bass.map((b, i) => `${X(i)},${Y(b.s)}`).join(' ')} fill="none" stroke="var(--muted)" strokeWidth={1.4} />
      {[[8, fifthDown], [9, fourthUp]].map(([i, l]) => (
        <text key={String(i)} className="rep-dm" x={(X(i as number) + X((i as number) + 1)) / 2 + 4} y={(Y(bass[i as number].s) + Y(bass[(i as number) + 1].s)) / 2} style={{ fill: 'var(--change-ink)' }}>{l}</text>
      ))}
      {bass.map((b, i) => (
        <g key={i}>
          <circle cx={X(i)} cy={Y(b.s)} r={12} fill={FN_FILL[b.fn][0]} />
          <text className="rep-dl" x={X(i)} y={Y(b.s) + 4} textAnchor="middle" style={{ fill: FN_FILL[b.fn][1], fontSize: 9 }}>{nm(b.p)}</text>
          <text className="rep-dm" x={X(i)} y={Y(lo) + 26} textAnchor="middle">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

export function RepBach() {
  const T = useLessonText(text);
  const { s, nm } = useLab();
  const S = repShared[s.lang];
  const fill = useNoteFill();
  const [bar, setBar] = useState(0);
  const lay = rangeAround(0, 12);
  const g: Mark = { ghost: 'var(--k-tonic)', name: nm({ letter: 4, acc: 0 }) };

  return (
    <>
      <Html as="p" className="desc" html={T.desc} />
      <p className="hint rep-src">{T.source}</p>

      <Predict mode="key" lay={lay} marks={{ 7: g, 19: g }} answer={[6]} anyOctave
        prompt={fill(T.p1.prompt)} reveal={fill(T.p1.reveal)} resetOn={s.lang + s.nt} />

      <RepPiece piece={BACH} name={T.name} bar={bar} onBar={setBar} beatW={34} channel={CH} />

      <Predict mode="choice" options={T.p2.options} answer={T.p2.answer}
        prompt={fill(T.p2.prompt)} reveal={fill(T.p2.reveal)} resetOn={s.lang + s.nt} />

      <h3 className="sub-h">{S.findingsTitle}</h3>
      <RepFindings piece={BACH} onBar={setBar} items={T.findings.map((html, i) => ({ html, lesson: FINDS[i][0], bar: FINDS[i][1] }))} />

      <p className="rowlab mt">{T.bassTitle}</p>
      <div className="board">
        <BassLine fill={fill} aria={T.bassAria} fifthDown={T.fifthDown} fourthUp={T.fourthUp} />
      </div>
      <Legend items={[
        { colors: ['var(--k-tonic)', 'var(--k-sub)', 'var(--k-dom)'], label: T.lgBass },
        { color: 'var(--change)', label: T.lgFifth },
      ]} />
      <Html as="p" className="desc" html={fill(T.bassNote)} />

      <h3 className="sub-h">{S.logicTitle}</h3>
      <Notes items={T.logic.map((html) => ({ html: fill(html) }))} more={T.more} />
      <Recap oneLine={fill(T.recap.oneLine)} confusions={T.recap.confusions.map(fill)} show={fill(T.recap.show)} />
    </>
  );
}
