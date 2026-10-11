import { useCallback, useEffect, useState } from 'react';
import { playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, rangeAround, roleMark } from '../components/layout';
import { KeySigStaff } from '../components/Staff';
import { Board, Html } from '../components/ui';
import {
  FUNCTION_OF, type Enharmonic, type Note, chordInfo, diatonicSize, displayed, keySignature, pcOf, quality, triad,
} from '../theory';
import { getState, setState } from '../state/store';
import { useLab, type Lab } from '../state/useLab';

type Mode = 'sig' | 'int' | 'fn' | 'ear';
const MODES: Mode[] = ['sig', 'int', 'fn', 'ear'];
const rnd = (n: number) => Math.floor(Math.random() * n);
const shuffle = <T,>(a: T[]) => a.map((x) => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map((p) => p[1]);

interface Q {
  options: string[];
  answer: string;
  why: string;
  tonic?: Note;
  ivl?: [number, number];
  chord?: number[];
  prompt: string;
}

function makeQuestion(mode: Mode, lab: Lab): Q {
  const { t, nm, keyName, sc, cur } = lab;
  if (mode === 'sig') {
    const k = rnd(12);
    const enh: Enharmonic = Math.random() < 0.5 ? 'Fs' : 'Gb';
    const tonic = displayed(k, enh);
    const answer = keyName(tonic);
    const others = new Set<string>();
    while (others.size < 3) {
      const o = rnd(12);
      if (o !== k) others.add(keyName(displayed(o, enh)));
    }
    const sig = keySignature(tonic);
    let why: string;
    if (sig.type > 0) why = t.chkSharp(nm(sig.list[sig.list.length - 1]), nm(tonic));
    else if (sig.type < 0 && sig.list.length > 1) why = t.chkFlats(nm(sig.list[sig.list.length - 2]), nm(tonic));
    else if (sig.type < 0) why = t.chkFlat1(nm(sig.list[0]), nm(tonic));
    else why = t.chkNone(nm(tonic));
    return { options: shuffle([answer, ...others]), answer, why, tonic, prompt: t.practice.question.sig };
  }
  if (mode === 'int' || mode === 'ear') {
    const num = 2 + rnd(7);
    const from = rnd(7);
    const semis = diatonicSize(from, num);
    const name = (g: number, s: number) => t.ivName(g, t.q[quality(g, s)]);
    const answer = name(num, semis);
    const pool = new Set<string>();
    for (let g = 2; g <= 8; g++) for (let f = 0; f < 7; f++) pool.add(name(g, diatonicSize(f, g)));
    pool.delete(answer);
    const others = shuffle([...pool]).slice(0, 3);
    const a = pcOf(sc[from]);
    const b = a + semis;
    return {
      options: shuffle([answer, ...others]), answer, ivl: [a, b],
      why: t.practice.whyInt(nm(sc[from]), nm(sc[(from + num - 1) % 7]), semis, answer),
      prompt: mode === 'int' ? t.practice.question.int : t.practice.question.ear,
    };
  }
  const d = rnd(7);
  const c = chordInfo(sc, d);
  const lab2 = nm(c.root) + c.suffix;
  const fnOpt = (f: string) => `${f} · ${t.fnName[f]}`;
  const answer = fnOpt(FUNCTION_OF[d]);
  const notes = triad(sc, d);
  const p0 = pcOf(notes[0]);
  const chord = [p0, ...notes.slice(1).map((n) => { let x = pcOf(n); while (x <= p0) x += 12; return x; })].sort((x, y) => x - y);
  return {
    options: ['T', 'SD', 'D'].map(fnOpt), answer, chord,
    why: t.practice.whyFn(`${c.roman} (${lab2})`, t.fnName[FUNCTION_OF[d]], notes.map(nm).join(' ')),
    prompt: t.practice.question.fn(`${c.roman} (${lab2})`, keyName(cur)),
  };
}

export function Practice() {
  const lab = useLab();
  const { t, s } = lab;
  const P = t.practice;
  const [mode, setMode] = useState<Mode | null>(null);
  const [q, setQ] = useState<Q | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0, streak: 0 });

  const playQ = useCallback((qq: Q | null) => {
    if (!qq) return;
    if (qq.ivl) playNotes([{ s: qq.ivl[0], t: 0, d: 0.7 }, { s: qq.ivl[1], t: 0.6, d: 0.7 }, { s: qq.ivl[0], t: 1.3, d: 1.2, v: 0.5 }, { s: qq.ivl[1], t: 1.3, d: 1.2, v: 0.5 }], 'quiz');
    if (qq.chord) playNotes(qq.chord.map((x) => ({ s: x, t: 0, d: 1.4, v: 0.55 })), 'quiz');
  }, []);

  const next = useCallback((m: Mode) => {
    const qq = makeQuestion(m, lab);
    setQ(qq);
    setPicked(null);
    if (m === 'ear' || m === 'fn') playQ(qq);
  }, [lab, playQ]);

  // regenerate if language/notation/key changes mid-question
  useEffect(() => {
    if (mode && !picked) next(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.lang, s.nt, s.k, s.enh]);

  if (!mode || !q) {
    return (
      <>
        <p className="desc">{P.desc}</p>
        <div className="mode-grid">
          {MODES.map((m) => (
            <button key={m} type="button" className={'mode-card m-' + m} onClick={() => { setMode(m); setScore({ ok: 0, total: 0, streak: 0 }); next(m); }}>
              <span className="mode-title">{P.modes[m]}</span>
              <span className="mode-desc">{P.modeDesc[m]}</span>
              <span className="mode-best">{P.best}: {s.best[m] ?? 0}</span>
            </button>
          ))}
        </div>
      </>
    );
  }

  const answered = picked != null;
  const correct = picked === q.answer;
  const choose = (o: string) => {
    if (answered) return;
    setPicked(o);
    const ok = o === q.answer;
    setScore((sc) => {
      const streak = ok ? sc.streak + 1 : 0;
      const best = getState().best;
      if (streak > (best[mode] ?? 0)) setState({ best: { ...best, [mode]: streak } });
      return { ok: sc.ok + (ok ? 1 : 0), total: sc.total + 1, streak };
    });
    if (mode === 'int' && q.ivl) playQ(q);
  };

  let visual = null;
  if (mode === 'sig' && q.tonic) {
    visual = <Board><KeySigStaff className="quiz-staff" tonic={q.tonic} noneLabel={t.staffNone} label={t.staffAria} /></Board>;
  } else if ((mode === 'int' || (mode === 'ear' && answered)) && q.ivl) {
    const [a, b] = q.ivl;
    const marks: Record<number, Mark> = { [a]: roleMark(a, 'tonic', 1), [b]: roleMark(b, 'tonic') };
    visual = <Board><Keyboard lay={rangeAround(Math.min(a, 0), Math.max(b, 12))} marks={marks} channel="quiz" /></Board>;
  } else if (mode === 'ear') {
    visual = <div className="ear-big"><button type="button" className="play huge" onClick={() => playQ(q)}>▶ {P.replay}</button></div>;
  } else if (mode === 'fn' && q.chord) {
    const marks: Record<number, Mark> = {};
    q.chord.forEach((x, i) => (marks[x] = { ...roleMark(x, 'path', ['1', '3', '5'][i]), name: undefined }));
    visual = <Board><Keyboard lay={rangeAround(0, 23)} marks={marks} channel="quiz" /></Board>;
  }

  return (
    <>
      <div className="quiz-top">
        <button type="button" className="ghost" onClick={() => { setMode(null); setQ(null); }}>{P.back}</button>
        <div className="scores">
          <span>{P.score} <b>{score.ok}/{score.total}</b></span>
          <span>{P.streak} <b>{score.streak}</b></span>
          <span>{P.best} <b>{s.best[mode] ?? 0}</b></span>
        </div>
      </div>
      <h3 className="quiz-q">{q.prompt}</h3>
      {visual}
      <div className={'answers' + (q.options.length === 3 ? ' three' : '')}>
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
            {(mode === 'ear' || mode === 'int' || mode === 'fn') && <button type="button" onClick={() => playQ(q)}>▶ {P.replay}</button>}
            <button type="button" className="primary" onClick={() => next(mode)}>{P.next}</button>
          </div>
        </div>
      )}
    </>
  );
}
