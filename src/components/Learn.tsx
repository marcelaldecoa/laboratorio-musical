import { type ReactNode, useEffect, useState } from 'react';
import { playNotes } from '../audio/audio';
import { goToKey } from '../state/store';
import { useLab } from '../state/useLab';
import { displayed, mod } from '../theory';
import { Keyboard } from './Keyboard';
import { type KeyLayout, type Mark, roleMark } from './layout';
import { Board, Html } from './ui';

interface PredictBase {
  /** the question, as trusted dictionary html */
  prompt: string;
  /** explanation shown once the user answered (or gave up) */
  reveal: string;
  /** reset the exercise when this value changes (e.g. the current key) */
  resetOn?: string | number;
}
interface PredictKeys extends PredictBase {
  mode: 'key';
  lay: KeyLayout;
  /** context drawn before answering (e.g. the tonic) */
  marks?: Record<number, Mark>;
  /** accepted keys (semitones) */
  answer: number[];
  /** accept the same note in any octave */
  anyOctave?: boolean;
  top?: number;
  ann?: (lay: KeyLayout) => ReactNode;
}
interface PredictChoice extends PredictBase {
  mode: 'choice';
  options: string[];
  answer: string;
}
export type PredictProps = PredictKeys | PredictChoice;

/**
 * "Before you look: predict". The user commits to an answer (a key or an option) before the
 * explanation appears. Two tries, then the answer can be revealed.
 */
export function Predict(p: PredictProps) {
  const { t } = useLab();
  const L = t.learn;
  const [tries, setTries] = useState<(number | string)[]>([]);
  const [state, setState] = useState<'open' | 'right' | 'shown'>('open');
  useEffect(() => { setTries([]); setState('open'); }, [p.resetOn, p.prompt]);

  const isRight = (g: number | string) =>
    p.mode === 'choice' ? g === p.answer : p.answer.some((a) => (p.anyOctave ? mod(a, 12) === mod(g as number, 12) : a === g));
  const guess = (g: number | string) => {
    if (state !== 'open') return;
    if (typeof g === 'number') playNotes([{ s: g, t: 0, d: 0.9 }], 'predict');
    setTries((tr) => [...tr, g]);
    if (isRight(g)) setState('right');
  };
  const wrong = state === 'open' && tries.length > 0 && !isRight(tries[tries.length - 1]);
  const done = state !== 'open';

  let body: ReactNode;
  if (p.mode === 'key') {
    const marks: Record<number, Mark> = { ...(p.marks ?? {}) };
    tries.forEach((g) => { if (typeof g === 'number' && !isRight(g)) marks[g] = { ...roleMark(g, 'chg', '✗'), name: marks[g]?.name }; });
    if (done) p.answer.forEach((a) => (marks[a] = { ...roleMark(a, 'tonic', '✓'), name: p.marks?.[a]?.name }));
    body = (
      <>
        {!done && <p className="hint">{L.tapKey}</p>}
        <Board><Keyboard lay={p.lay} marks={marks} top={p.top} ann={p.ann} channel="predict" onKey={done ? undefined : (s) => guess(s)} playable={done} /></Board>
      </>
    );
  } else {
    body = (
      <div className="predict-options">
        {p.options.map((o) => (
          <button key={o} type="button" disabled={done && o !== p.answer}
            className={'answer' + (done && o === p.answer ? ' right' : '') + (tries.includes(o) && o !== p.answer ? ' wrong' : '')}
            onClick={() => guess(o)}>{o}</button>
        ))}
      </div>
    );
  }
  return (
    <section className={'predict' + (done ? ' done' : '')}>
      <p className="predict-label">{L.predict}</p>
      <Html as="p" className="predict-q" html={p.prompt} />
      {body}
      {wrong && (
        <div className="row">
          <span className="predict-wrong">{L.tryAgain}</span>
          {tries.length >= 2 && <button type="button" className="ghost" onClick={() => setState('shown')}>{L.showAnswer}</button>}
        </div>
      )}
      {done && (
        <div className={'feedback ' + (state === 'right' ? 'ok' : 'no')} role="status">
          <b>{state === 'right' ? L.right : L.answerWas}</b> <Html html={p.reveal} />
          <div className="row"><button type="button" className="ghost" onClick={() => { setTries([]); setState('open'); }}>{L.again}</button></div>
        </div>
      )}
    </section>
  );
}

/** End-of-lesson card: what to say, what people mix up, and how to demonstrate it at the keyboard. */
export function Recap({ oneLine, confusions, show }: { oneLine: string; confusions: string[]; show: string }) {
  const { t } = useLab();
  const L = t.learn;
  return (
    <section className="recap" aria-label={L.recap}>
      <h3>{L.recap}</h3>
      <p className="recap-k">{L.oneLine}</p>
      <Html as="p" className="recap-one" html={oneLine} />
      {!!confusions.length && (
        <>
          <p className="recap-k">{L.confusions}</p>
          <ul>{confusions.map((c, i) => <Html as="li" key={i} html={c} />)}</ul>
        </>
      )}
      <p className="recap-k">{L.show}</p>
      <Html as="p" html={show} />
    </section>
  );
}

/** Collapsible "want to know more" block for history and side notes. */
export function More({ children }: { children: ReactNode }) {
  const { t } = useLab();
  return (
    <details className="more">
      <summary>{t.learn.more}</summary>
      <div className="more-body">{children}</div>
    </details>
  );
}

/**
 * Transfer challenge: send the learner to another key with a question to answer there.
 * `slots` are circle positions to suggest, first one different from the current key wins.
 */
export function Transfer({ question, slots = [3, 10, 4, 9, 2, 11] }: { question: (keyName: string) => string; slots?: number[] }) {
  const { s, t, keyName } = useLab();
  const k = slots.find((x) => x !== s.k) ?? 3;
  const target = keyName(displayed(k, k === 6 ? 'Fs' : s.enh));
  return (
    <section className="transfer">
      <p className="predict-label">{t.learn.transfer}</p>
      <Html as="p" html={question(target)} />
      <button type="button" className="primary" onClick={() => { goToKey(k); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        {t.learn.goKey(target)}
      </button>
    </section>
  );
}
