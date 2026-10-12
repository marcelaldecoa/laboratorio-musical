import { useEffect, useState } from 'react';
import { playNotes } from '../audio/audio';
import { useLab } from '../state/useLab';
import { mod } from '../theory';
import { Keyboard } from './Keyboard';
import { type KeyLayout, type Mark, roleMark } from './layout';
import { Board, Html, PlayButton } from './ui';

/**
 * A "predict" card that asks for several keys at once (e.g. "read this symbol: tap its keys").
 * Same look and dictionary strings as `Predict` (components/Learn.tsx); any octave counts.
 * Right taps get ✓, wrong taps ✗; after two wrong taps the answer can be revealed.
 */
export function ChordsTapChord({ prompt, reveal, lay, answer, names, progress, playLabel, resetOn }: {
  /** the question, as trusted dictionary html */
  prompt: string;
  /** explanation shown once every key was found (or the answer was shown) */
  reveal: string;
  lay: KeyLayout;
  /** where the answer is drawn (semitones); any key with the same pitch class is accepted */
  answer: number[];
  /** note names drawn on the answer keys once found */
  names: string[];
  progress: (found: number, total: number) => string;
  /** label of the button that plays the answer */
  playLabel: string;
  resetOn?: string | number;
}) {
  const { t } = useLab();
  const L = t.learn;
  const [taps, setTaps] = useState<number[]>([]);
  const [shown, setShown] = useState(false);
  useEffect(() => { setTaps([]); setShown(false); }, [resetOn, prompt]);

  const pcs = answer.map((a) => mod(a, 12));
  const isRight = (s: number) => pcs.includes(mod(s, 12));
  const found = new Set(taps.filter(isRight).map((s) => mod(s, 12)));
  const wrongs = taps.filter((s) => !isRight(s)).length;
  const done = shown || found.size === pcs.length;
  const right = !shown && found.size === pcs.length;

  const tap = (s: number) => {
    if (done) return;
    playNotes([{ s, t: 0, d: 0.9 }], 'predict-chord');
    setTaps((tr) => [...tr, s]);
  };

  const marks: Record<number, Mark> = {};
  taps.forEach((s) => {
    if (!isRight(s)) marks[s] = roleMark(s, 'chg', '✗');
    else if (!done) marks[s] = roleMark(s, 'tonic', '✓');
  });
  if (done) answer.forEach((a, i) => (marks[a] = roleMark(a, 'tonic', '✓', names[i])));
  const last = taps[taps.length - 1];
  const wrongNow = !done && last != null && !isRight(last);

  return (
    <section className={'predict' + (done ? ' done' : '')}>
      <p className="predict-label">{L.predict}</p>
      <Html as="p" className="predict-q" html={prompt} />
      {!done && <p className="hint">{L.tapKey} {progress(found.size, pcs.length)}</p>}
      <Board>
        <Keyboard lay={lay} marks={marks} channel="predict-chord" onKey={done ? undefined : tap} playable={done} />
      </Board>
      {wrongNow && (
        <div className="row">
          <span className="predict-wrong">{L.tryAgain}</span>
          {wrongs >= 2 && <button type="button" className="ghost" onClick={() => setShown(true)}>{L.showAnswer}</button>}
        </div>
      )}
      {done && (
        <div className={'feedback ' + (right ? 'ok' : 'no')} role="status">
          <b>{right ? L.right : L.answerWas}</b> <Html html={reveal} />
          <div className="row">
            <button type="button" className="ghost" onClick={() => { setTaps([]); setShown(false); }}>{L.again}</button>
            <PlayButton label={playLabel} seconds={1.6} onPlay={() => playNotes(answer.map((s) => ({ s, t: 0, d: 1.6, v: 0.5 })), 'predict-chord')} />
          </div>
        </div>
      )}
    </section>
  );
}
