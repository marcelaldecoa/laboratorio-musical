import { useCallback, useEffect, useState } from 'react';
import { playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { KeySigStaff } from '../components/Staff';
import { Board, Html } from '../components/ui';
import { dueReviews, getState, markStudied, recordAnswer, setState } from '../state/store';
import { useLab } from '../state/useLab';
import { MODES, type Mode, type Question, fromId, newId } from './quiz';

type Session = Mode | 'review';

export function Practice() {
  const lab = useLab();
  const { t, s } = lab;
  const P = t.practice;
  const [session, setSession] = useState<Session | null>(null);
  const [q, setQ] = useState<Question | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0, streak: 0 });
  const [queue, setQueue] = useState<string[]>([]);
  const due = dueReviews(s.review);

  const playQ = useCallback((qq: Question | null) => {
    if (qq?.sound) playNotes(qq.sound, 'quiz');
  }, []);

  const show = useCallback((id: string) => {
    const qq = fromId(id, lab);
    setQ(qq);
    setPicked(null);
    if (qq.auto) playQ(qq);
  }, [lab, playQ]);

  const next = useCallback((sess: Session, rest = queue) => {
    if (sess === 'review') {
      if (!rest.length) { setQ(null); return; }
      setQueue(rest.slice(1));
      show(rest[0]);
    } else show(newId(sess, lab));
  }, [lab, queue, show]);

  // rebuild the current question when the language or notation changes, keeping the same id
  useEffect(() => {
    if (q && !picked) setQ(fromId(q.id, lab));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.lang, s.nt]);

  const start = (sess: Session) => {
    setSession(sess);
    setScore({ ok: 0, total: 0, streak: 0 });
    if (sess === 'review') next('review', due);
    else next(sess);
  };

  if (!session) {
    return (
      <>
        <p className="desc">{P.desc}</p>
        <button type="button" className={'review-card' + (due.length ? ' has' : '')} onClick={() => start('review')} disabled={!due.length}>
          <span className="mode-title">{P.modes.review}</span>
          <span className="mode-desc">{due.length ? P.reviewDue(due.length) : P.reviewEmpty}</span>
        </button>
        <div className="mode-grid">
          {MODES.map((m) => (
            <button key={m} type="button" className={'mode-card m-' + m} onClick={() => start(m)}>
              <span className="mode-title">{P.modes[m]}</span>
              <span className="mode-desc">{P.modeDesc[m]}</span>
              <span className="mode-best">{P.best}: {s.best[m] ?? 0}</span>
            </button>
          ))}
        </div>
      </>
    );
  }

  const back = () => { setSession(null); setQ(null); };
  if (!q) {
    return (
      <>
        <div className="quiz-top"><button type="button" className="ghost" onClick={back}>{P.back}</button></div>
        <div className="feedback ok" role="status"><b>{session === 'review' && score.total ? P.reviewDone : P.reviewEmpty}</b></div>
      </>
    );
  }

  const answered = picked != null;
  const correct = picked === q.answer;
  const choose = (o: string) => {
    if (answered) return;
    setPicked(o);
    const ok = o === q.answer;
    recordAnswer(q.id, ok);
    markStudied();
    setScore((sc) => {
      const streak = ok ? sc.streak + 1 : 0;
      const best = getState().best;
      if (session !== 'review' && streak > (best[session] ?? 0)) setState({ best: { ...best, [session]: streak } });
      return { ok: sc.ok + (ok ? 1 : 0), total: sc.total + 1, streak };
    });
    if (q.mode === 'int') playQ(q);
  };

  let visual = null;
  if (q.mode === 'sig' && q.tonic) {
    visual = <Board><KeySigStaff className="quiz-staff" tonic={q.tonic} noneLabel={t.staffNone} label={t.staffAria} /></Board>;
  } else if (q.keys && (!q.hideKeys || answered)) {
    const marks: Record<number, Mark> = {};
    q.keys.forEach((x, i) => (marks[x] = roleMark(x, i === 0 ? 'tonic' : q.mode === 'mode' ? 'scale' : 'path', q.labels?.[i])));
    const lo = Math.min(...q.keys);
    const hi = Math.max(...q.keys);
    visual = <Board><Keyboard lay={rangeAround(Math.min(lo, lo - (lo % 12 + 12) % 12), Math.max(hi, lo + 12))} marks={marks} channel="quiz" /></Board>;
  } else if (q.sound) {
    visual = <div className="ear-big"><button type="button" className="play huge" onClick={() => playQ(q)}>▶ {P.replay}</button></div>;
  }

  return (
    <>
      <div className="quiz-top">
        <button type="button" className="ghost" onClick={back}>{P.back}</button>
        <div className="scores">
          <span>{P.score} <b>{score.ok}/{score.total}</b></span>
          <span>{P.streak} <b>{score.streak}</b></span>
          {session === 'review' ? <span><b>{queue.length}</b> ⟳</span> : <span>{P.best} <b>{s.best[session] ?? 0}</b></span>}
        </div>
      </div>
      <p className="rowlab">{P.modes[q.mode]}</p>
      <h3 className="quiz-q">{q.prompt}</h3>
      {visual}
      {q.sound && (q.keys || q.mode === 'dict') && !(q.hideKeys && !answered) && (
        <div className="row"><button type="button" className="play" onClick={() => playQ(q)}>▶ {P.replay}</button></div>
      )}
      <div className={'answers' + (q.options.length === 3 ? ' three' : '') + (q.mode === 'dict' || q.mode === 'mode' ? ' one' : '')}>
        {q.options.map((o) => (
          <button key={o} type="button" className={'answer' + (answered && o === q.answer ? ' right' : '') + (answered && o === picked && !correct ? ' wrong' : '')}
            onClick={() => choose(o)} disabled={answered && o !== picked && o !== q.answer}>
            {o}
          </button>
        ))}
      </div>
      {answered && (
        <div className={'feedback ' + (correct ? 'ok' : 'no')} role="status">
          <b>{correct ? P.right : P.wrong}</b> <Html html={q.why} />
          <div className="row">
            {q.sound && <button type="button" onClick={() => playQ(q)}>▶ {P.replay}</button>}
            <button type="button" className="primary" onClick={() => next(session)}>{P.next}</button>
          </div>
        </div>
      )}
    </>
  );
}
