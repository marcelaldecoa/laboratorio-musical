import { useState } from 'react';
import { Predict, Recap } from '../components/Learn';
import { RepFindings, RepPiece, playBars, useNoteFill } from '../components/RepPiece';
import { Html, Notes, PlayButton } from '../components/ui';
import { repShared } from '../i18n/lessons/repShared';
import { text } from '../i18n/lessons/repode';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import { ODE, odePiece } from '../theory/repertoire';
import '../styles/repertoire.css';

const CH = 'repode';
const PLAIN = odePiece(false);
const FINDS: [string, number][] = [['chordtones', 0], ['int', 2], ['form', 3], ['form', 8], ['rhythm', 11], ['prog', 1]];

export function RepOde() {
  const T = useLessonText(text);
  const { s } = useLab();
  const S = repShared[s.lang];
  const fill = useNoteFill();
  const [bar, setBar] = useState(0);

  return (
    <>
      <Html as="p" className="desc" html={T.desc} />
      <p className="hint rep-src"><span className="rep-badge">{S.simplified}</span> {T.source}</p>

      <Predict mode="choice" options={T.p1.options} answer={T.p1.answer}
        prompt={fill(T.p1.prompt)} reveal={fill(T.p1.reveal)} resetOn={s.lang + s.nt} />

      <RepPiece piece={ODE} name={T.name} bar={bar} onBar={setBar} beatW={22} channel={CH} />

      <Predict mode="choice" options={T.p2.options} answer={T.p2.answer}
        prompt={fill(T.p2.prompt)} reveal={fill(T.p2.reveal)} resetOn={s.lang + s.nt} />

      <p className="rowlab mt">{T.syncTitle}</p>
      <div className="rep-compare">
        <PlayButton label={T.syncOrig} seconds={6} onPlay={() => { setBar(11); playBars(ODE, 10, 12, CH); }} />
        <PlayButton label={T.syncPlain} seconds={6} onPlay={() => { setBar(11); playBars(PLAIN, 10, 12, CH); }} />
      </div>
      <Html as="p" className="desc" html={fill(T.syncNote)} />

      <h3 className="sub-h">{S.findingsTitle}</h3>
      <RepFindings piece={ODE} onBar={setBar} items={T.findings.map((html, i) => ({ html, lesson: FINDS[i][0], bar: FINDS[i][1] }))} />

      <h3 className="sub-h">{S.logicTitle}</h3>
      <Notes items={T.logic.map((html) => ({ html: fill(html) }))} more={T.more} />
      <Recap oneLine={fill(T.recap.oneLine)} confusions={T.recap.confusions.map(fill)} show={fill(T.recap.show)} />
    </>
  );
}
