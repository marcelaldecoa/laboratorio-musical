import { useState } from 'react';
import { seq, playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { Predict, Recap } from '../components/Learn';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { RepFindings, RepPiece, useNoteFill } from '../components/RepPiece';
import { Board, Html, Legend, Notes, PlayButton } from '../components/ui';
import { repShared } from '../i18n/lessons/repShared';
import { text } from '../i18n/lessons/repelise';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import { ELISE, nt } from '../theory/repertoire';
import '../styles/repertoire.css';

const CH = 'repelise';
const CH2 = 'repelise-pull';
const FINDS: [string, number][] = [['chordtones', 1], ['names', 1], ['minor', 2], ['minorvar', 3], ['lefthand', 2], ['rhythm', 0]];

export function RepElise() {
  const T = useLessonText(text);
  const { s, nm } = useLab();
  const S = repShared[s.lang];
  const fill = useNoteFill();
  const [bar, setBar] = useState(1);

  const n = (x: string) => nm(nt(x));
  const p2lay = rangeAround(4, 16);
  const p2marks: Record<number, Mark> = { 4: roleMark(4, 'dom', 1, n('E')), 11: roleMark(11, 'dom', 5, n('B')), 16: roleMark(16, 'dom', 1, n('E')) };

  const lay = rangeAround(0, 12);
  const pull: Record<number, Mark> = {
    3: roleMark(3, 'chg', undefined, n('D#')),
    4: { ghost: 'var(--change)', name: n('E') },
    8: roleMark(8, 'lt', '7', n('G#')),
    9: { ghost: 'var(--change)', name: n('A') },
  };

  return (
    <>
      <Html as="p" className="desc" html={fill(T.desc)} />
      <p className="hint rep-src"><span className="rep-badge">{S.simplified}</span> {T.source}</p>

      <Predict mode="choice" options={T.p1.options.map(fill)} answer={fill(T.p1.answer)}
        prompt={fill(T.p1.prompt)} reveal={fill(T.p1.reveal)} resetOn={s.lang + s.nt} />
      <Predict mode="key" lay={p2lay} marks={p2marks} answer={[8]} anyOctave
        prompt={fill(T.p2.prompt)} reveal={fill(T.p2.reveal)} resetOn={s.lang + s.nt} />

      <RepPiece piece={ELISE} name={T.name} bar={bar} onBar={setBar} beatW={64} channel={CH} />

      <p className="rowlab mt">{T.mirrorTitle}</p>
      <div className="rep-compare">
        <PlayButton label={`${n('E')} ${n('D#')} ${n('E')}`} onPlay={() => playNotes(seq([16, 15, 16, 15, 16].map((x) => x - 12), 0.22, 0.4), CH2)} />
        <PlayButton label={`${n('G#')} → ${n('A')}`} onPlay={() => playNotes(seq([8, 9], 0.45, 0.8), CH2)} />
      </div>
      <Board><Keyboard lay={lay} marks={pull} channel={CH2} label={T.mirrorAria} /></Board>
      <Legend items={[
        { colors: ['var(--k-chg)', 'var(--k-chgb)'], label: fill(T.lgChrom) },
        { color: 'var(--k-lt)', label: fill(T.lgLt) },
        { dash: 'var(--change)', label: T.lgGoal },
      ]} />
      <Html as="p" className="desc" html={fill(T.mirrorNote)} />

      <h3 className="sub-h">{S.findingsTitle}</h3>
      <RepFindings piece={ELISE} onBar={setBar} items={T.findings.map((html, i) => ({ html, lesson: FINDS[i][0], bar: FINDS[i][1] }))} />

      <h3 className="sub-h">{S.logicTitle}</h3>
      <Notes items={T.logic.map((html) => ({ html: fill(html) }))} more={T.more} />
      <Recap oneLine={fill(T.recap.oneLine)} confusions={T.recap.confusions.map(fill)} show={fill(T.recap.show)} />
    </>
  );
}
