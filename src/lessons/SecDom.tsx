import { useState } from 'react';
import { MotionFifthsLine, type FifthsCell } from '../components/MotionFifthsLine';
import { MotionProgression, type ProgChord, type ProgTone } from '../components/MotionProgression';
import { Board, Html, Notes } from '../components/ui';
import { FUNCTION_OF, type Note, chordInfo, fifthIndex, fromFifthIndex } from '../theory';
import { SECDOM_TARGETS, SUFFIX, diatonicTriad, qualityOf, secondaryDominant } from '../theory/harmony';
import { text } from '../i18n/lessons/secdom';
import { useLessonText } from '../i18n/lessonText';
import { useLab } from '../state/useLab';
import '../styles/motion.css';

export function SecDom() {
  const { nm, keyName, cur, sc } = useLab();
  const t = useLessonText(text);
  const [target, setTarget] = useState(4);
  const sym = (ns: Note[]) => nm(ns[0]) + SUFFIX[qualityOf(ns)];
  const roman = (d: number) => chordInfo(sc, d).roman;
  const sd = secondaryDominant(cur, target);
  const vName = sym(sd.notes);
  const xName = sym(sd.targetChord);
  const xRoman = roman(target);
  const vRoman = t.of(xRoman);
  const borrowedNotes = sd.notes.filter((_, i) => sd.borrowed[i]);
  const lt = sd.notes[1];
  const isIV = target === 3;

  /* line of fifths: our window and the target's window */
  const f0 = fifthIndex(sc[3]);
  const ts = fifthIndex(sc[target]) - 1;
  const from = Math.min(f0, ts);
  const to = Math.max(f0, ts) + 6;
  const cells: Record<number, FifthsCell> = {};
  cells[fifthIndex(sc[target])] = { stroke: 'var(--accent)', sub: '→' };
  sd.notes.forEach((n, i) => {
    const hot = sd.borrowed[i];
    cells[fifthIndex(n)] = {
      fill: hot ? 'var(--k-lt)' : 'var(--k-dom)',
      ink: hot ? 'var(--k-lt-ink)' : 'var(--k-dom-ink)',
      sub: ['1', '3', '5', '7'][i],
    };
  });

  /* V/x → x, then the same move inside a phrase */
  const fnTone = (d: number): ProgTone => FUNCTION_OF[d] as ProgTone;
  const vChord: ProgChord = { notes: sd.notes, roman: vRoman, name: vName, tone: 'D', hot: sd.borrowed };
  const xChord: ProgChord = { notes: sd.targetChord, roman: xRoman, name: xName, tone: 'T' };
  const dia = (d: number, tone = fnTone(d)): ProgChord => {
    const ns = diatonicTriad(sc, d);
    return { notes: ns, roman: roman(d), name: sym(ns), tone };
  };
  const prog: ProgChord[] = target === 4
    ? [dia(0), vChord, { ...xChord, tone: 'D' }, dia(0)]
    : [dia(0), vChord, { ...xChord, tone: fnTone(target) }, dia(4), dia(0)];
  const fnLabel = (c: ProgChord) => (c === vChord ? t.fnSec : c.tone === 'T' ? t.fnT : c.tone === 'SD' ? t.fnSD : t.fnD);

  const steps = [
    t.step1(xRoman, xName),
    t.step2(nm(sc[target]), nm(sd.root)),
    t.step3(vName, sd.notes.map(nm).join(' ')),
    isIV
      ? t.step4iv(keyName(cur), nm(lt), nm(sd.notes[3]), nm(sd.targetChord[1]))
      : t.step4lt(borrowedNotes.map(nm).join(' · '), keyName(cur), nm(lt), nm(sc[target])),
  ];
  const vv = secondaryDominant(cur, 4);
  const labels = { play: t.play, stop: t.stop, prev: t.prev, next: t.next, now: t.now };

  return (
    <>
      <Html as="p" className="desc" html={t.desc} />
      <p className="rowlab">{t.targetLab}</p>
      <div className="chips" role="group">
        {SECDOM_TARGETS.map((d) => {
          const s2 = secondaryDominant(cur, d);
          return (
            <button key={d} type="button" className="chip fD" aria-pressed={d === target} onClick={() => setTarget(d)}>
              {t.of(roman(d))}<small>{t.chipSub(sym(s2.notes), sym(s2.targetChord))}</small>
            </button>
          );
        })}
      </div>

      <h3 className="sub-h">{t.stepsTitle}</h3>
      <ol className="recipe">{steps.map((h, i) => <Html key={i} as="li" html={h} />)}</ol>

      <h3 className="sub-h">{t.windowsTitle}</h3>
      <p className="desc">{t.windowsDesc(xName, ts - f0)}</p>
      <Board>
        <MotionFifthsLine from={from} to={to} name={(f) => nm(fromFifthIndex(f))} label={t.lineAria(vName, nm(sc[target]))}
          wins={[
            { start: f0, end: f0 + 6, label: t.winCur(keyName(cur)), color: 'var(--accent)' },
            { start: ts, end: ts + 6, label: t.winOf(nm(sc[target])), color: 'var(--dom)', dash: true, below: true },
          ]}
          cells={cells} />
      </Board>
      <div className="legend">
        <span><i className="sw" style={{ background: 'transparent', border: '2px solid var(--accent)' }} />{t.lgLineCur}</span>
        <span><i className="sw" style={{ background: 'var(--k-dom)' }} />{t.lgLineV}</span>
        <span><i className="sw" style={{ background: 'var(--k-lt)' }} />{t.lgLineB}</span>
        <span><i className="sw" style={{ background: 'transparent', border: '2px solid var(--accent)' }} />→ {t.lgLineT}</span>
      </div>

      <h3 className="sub-h">{t.pairTitle}</h3>
      <p className="desc">{t.pairDesc}</p>
      <MotionProgression chords={[vChord, xChord]} channel="secdom-pair" nm={nm} labels={labels} beat={1.3}
        read={(i) => (i === 0 ? t.readPair0(vName, xName, nm(lt)) : isIV ? t.readPair1iv(xName, nm(sd.notes[3]), nm(sd.targetChord[1])) : t.readPair1(xName, nm(lt), nm(sc[target])))}
        legend={[
          { color: 'var(--k-dom)', label: t.lgV7 },
          { color: 'var(--k-lt)', label: t.lgLt },
          { color: 'var(--k-tonic)', label: t.lgTarget },
          { dash: 'var(--muted)', label: t.lgWas },
        ]} />

      <h3 className="sub-h">{t.progTitle}</h3>
      <p className="desc">{t.progDesc(xRoman)}</p>
      <MotionProgression chords={prog} channel="secdom-prog" nm={nm} labels={labels}
        read={(i) => t.readProg(prog[i].roman, prog[i].name, fnLabel(prog[i]))}
        legend={[
          { color: 'var(--k-tonic)', label: t.fnT },
          { color: 'var(--k-sub)', label: t.lgSD },
          { color: 'var(--k-dom)', label: t.fnD },
          { color: 'var(--k-lt)', label: t.lgLt },
          { dash: 'var(--muted)', label: t.lgWas },
        ]} />

      <h3 className="sub-h">{t.logicTitle}</h3>
      <Notes items={t.logic(keyName(cur), sym(vv.notes), nm(vv.notes[1]), nm(sc[3])).map((html) => ({ html }))} />
    </>
  );
}
