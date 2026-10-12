import { useState } from 'react';
import { Predict, Recap } from '../components/Learn';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { RepFindings, RepPiece, playBars, useNoteFill } from '../components/RepPiece';
import { Html, Notes, PlayButton } from '../components/ui';
import { repShared } from '../i18n/lessons/repShared';
import { text } from '../i18n/lessons/repminuet';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import { MINUET, nt } from '../theory/repertoire';
import '../styles/repertoire.css';

const CH = 'repminuet';
const FINDS: [string, number][] = [['chordtones', 0], ['field', 2], ['lefthand', 1], ['prog', 7], ['form', 8], ['form', 15]];

export function RepMinuet() {
  const T = useLessonText(text);
  const { s, nm } = useLab();
  const S = repShared[s.lang];
  const fill = useNoteFill();
  const [bar, setBar] = useState(0);

  // bar 1 context: the G chord (G4 B4 D5) marked as tonic
  const lay = rangeAround(7, 14);
  const ctx: Record<number, Mark> = {
    7: roleMark(7, 'tonic', 1, nm(nt('G'))),
    11: roleMark(11, 'tonic', 3, nm(nt('B'))),
    14: roleMark(14, 'tonic', 5, nm(nt('D'))),
  };

  return (
    <>
      <Html as="p" className="desc" html={T.desc} />
      <p className="hint rep-src"><span className="rep-badge">{S.simplified}</span> {T.source}</p>

      <Predict mode="key" lay={lay} marks={ctx} answer={[9, 12]} anyOctave
        prompt={fill(T.p1.prompt)} reveal={fill(T.p1.reveal)} resetOn={s.lang + s.nt} />

      <RepPiece piece={MINUET} name={T.name} bar={bar} onBar={setBar} beatW={26} channel={CH} />

      <Predict mode="choice" options={T.p2.options} answer={T.p2.answer}
        prompt={fill(T.p2.prompt)} reveal={fill(T.p2.reveal)} resetOn={s.lang + s.nt} />

      <p className="rowlab mt">{T.cadTitle}</p>
      <div className="rep-compare">
        <PlayButton label={T.cad1} seconds={4} onPlay={() => { setBar(7); playBars(MINUET, 6, 7, CH); }} />
        <PlayButton label={T.cad2} seconds={4} onPlay={() => { setBar(15); playBars(MINUET, 14, 15, CH); }} />
      </div>
      <Html as="p" className="desc" html={fill(T.cadNote)} />

      <h3 className="sub-h">{S.findingsTitle}</h3>
      <RepFindings piece={MINUET} onBar={setBar} items={T.findings.map((html, i) => ({ html, lesson: FINDS[i][0], bar: FINDS[i][1] }))} />

      <h3 className="sub-h">{S.logicTitle}</h3>
      <Notes items={T.logic.map((html) => ({ html: fill(html) }))} more={T.more} />
      <Recap oneLine={fill(T.recap.oneLine)} confusions={T.recap.confusions.map(fill)} show={fill(T.recap.show)} />
    </>
  );
}
