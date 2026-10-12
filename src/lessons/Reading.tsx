import { useEffect, useRef, useState } from 'react';
import { playNotes, stopAll } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, roleMark } from '../components/layout';
import { PianoGrandStaff, STAFF_MAX, STAFF_MIN, type StaffNote } from '../components/PianoGrandStaff';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Html, Legend, Notes, Seg } from '../components/ui';
import { text } from '../i18n/lessons/reading';
import { useLessonText } from '../i18n/lessonText';
import { getState, setState } from '../state/store';
import { useLab } from '../state/useLab';
import { type Note, mod, pcOf, sameNote } from '../theory';
import {
  BOTTOM_LINE, type Clef, accidentalToShow, clefFor, diatonic, ledgerLines, noteAtDiatonic, octaveOf, spellInKey,
  staffLetters,
} from '../theory/piano';
import '../styles/piano.css';

const CH = 'reading';
const LO = -24;
const HI = 24;
const GAME_KEY = 'reading';

interface Shown {
  note: Note;
  oct: number;
  s: number;
}

export function Reading() {
  const T = useLessonText(text);
  const { s, nm, keyName, cur, sc } = useLab();
  const [mode, setMode] = useState<'explore' | 'game'>('explore');
  const [shown, setShown] = useState<Shown[]>([]);
  const [pick, setPick] = useState<number | null>(null);
  const [middle, setMiddle] = useState(true);
  const [target, setTarget] = useState<Shown | null>(null);
  const [answer, setAnswer] = useState<{ kind: 'ok' | 'oct' | 'no'; got: number } | null>(null);
  const [streak, setStreak] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);
  useEffect(() => () => stopAll(), []);
  useEffect(() => { setShown([]); setPick(null); setTarget(null); setAnswer(null); }, [s.k, s.enh]);

  const lay = layout(LO, HI);
  const full = (n: Note, oct: number) => T.noteName(nm(n), oct);
  const play = (x: number) => playNotes([{ s: x, t: 0, d: 1.1 }], CH);

  const focus = (x: number) => {
    const b = boardRef.current;
    const svg = b?.querySelector('svg');
    if (!b || !svg) return;
    const k = svg.clientWidth / lay.width;
    b.scrollTo({ left: Math.max(0, lay.c(x) * k - b.clientWidth / 2), behavior: 'smooth' });
  };

  const add = (n: Shown) => {
    setShown((prev) => [...prev, n].slice(-4));
    play(n.s);
    focus(n.s);
  };

  const fromKey = (x: number) => {
    if (mode === 'game') return answerKey(x);
    const n = spellInKey(cur, x);
    setPick(null);
    add({ note: n, oct: octaveOf(n, x), s: x });
  };
  const fromStaff = (d: number) => {
    if (mode === 'game') return;
    setPick(d);
    add(noteAtDiatonic(sc, d));
  };

  const newTarget = () => {
    let d = 16 + Math.floor(Math.random() * 25);
    if (target && diatonic(target.note, target.oct) === d) d = d === 40 ? 16 : d + 1;
    const n = noteAtDiatonic(sc, d);
    setTarget(n);
    setAnswer(null);
    focus(0);
  };
  const answerKey = (x: number) => {
    if (!target || answer) { play(x); return; }
    play(x);
    const kind = x === target.s ? 'ok' : pcOf(spellInKey(cur, x)) === pcOf(target.note) ? 'oct' : 'no';
    setAnswer({ kind, got: x });
    if (kind === 'ok') {
      const st = streak + 1;
      setStreak(st);
      const best = getState().best[GAME_KEY] ?? 0;
      if (st > best) setState((p) => ({ best: { ...p.best, [GAME_KEY]: st } }));
    } else {
      setStreak(0);
      focus(target.s);
    }
  };

  const colorOf = (n: Note): string =>
    accidentalToShow(n, sc) != null ? 'var(--change)' : sameNote(n, sc[0]) ? 'var(--accent)' : 'var(--fg)';
  const roleOf = (n: Note, x: number): Mark =>
    roleMark(x, accidentalToShow(n, sc) != null ? 'chg' : sameNote(n, sc[0]) ? 'tonic' : 'scale', undefined, nm(n));

  const marks: Record<number, Mark> = {};
  for (let x = LO; x <= HI; x += 12) marks[x] = { name: T.noteName(nm({ letter: 0, acc: 0 }), 4 + x / 12) };
  let staffNotes: StaffNote[] = [];
  if (mode === 'explore') {
    shown.forEach((n, i) => {
      marks[n.s] = { ...roleOf(n.note, n.s), name: full(n.note, n.oct), label: i === shown.length - 1 ? '●' : undefined };
    });
    staffNotes = shown.map((n) => ({ note: n.note, oct: n.oct, color: colorOf(n.note), label: full(n.note, n.oct) }));
  } else if (target) {
    staffNotes = [{ note: target.note, oct: target.oct, color: answer ? colorOf(target.note) : 'var(--fg)', label: answer ? full(target.note, target.oct) : undefined }];
    if (answer) {
      if (answer.kind !== 'ok') {
        const g = spellInKey(cur, answer.got);
        marks[answer.got] = { ...roleMark(answer.got, 'chg', '✕'), name: full(g, octaveOf(g, answer.got)) };
      }
      marks[target.s] = { ...roleOf(target.note, target.s), ghost: 'var(--k-lt-line)', label: answer.kind === 'ok' ? '✓' : undefined, name: full(target.note, target.oct) };
    }
  }

  const where = (d: number) => {
    const c: Clef = clefFor(d);
    const p = d - BOTTOM_LINE[c];
    let w: string;
    if (p >= 0 && p <= 8) w = p % 2 === 0 ? T.line(p / 2 + 1) : T.space((p + 1) / 2);
    else if (p === -1) w = T.spaceBelow;
    else if (p === 9) w = T.spaceAbove;
    else w = p < 0 ? T.ledgerBelow(ledgerLines(p).length) : T.ledgerAbove(ledgerLines(p).length);
    return { c, w };
  };
  const last = shown[shown.length - 1];
  let read = T.idle;
  if (mode === 'explore' && last) {
    const { c, w } = where(diatonic(last.note, last.oct));
    read = T.readNote(full(last.note, last.oct), T.clefs[c], w);
  }

  const best = s.best[GAME_KEY] ?? 0;
  let fb = '';
  if (answer && target) {
    const g = spellInKey(cur, answer.got);
    fb = answer.kind === 'ok' ? T.right(full(target.note, target.oct))
      : answer.kind === 'oct' ? T.octWrong(full(target.note, target.oct))
        : T.wrong(full(g, octaveOf(g, answer.got)), full(target.note, target.oct));
  }

  const nudge = (dd: number) => {
    const base = pick ?? (last ? diatonic(last.note, last.oct) : 28);
    fromStaff(Math.max(STAFF_MIN, Math.min(STAFF_MAX, base + dd)));
  };

  const letters = (c: Clef, k: 'line' | 'space') => staffLetters(c, k).map((l) => nm({ letter: l, acc: 0 })).join(' ');
  const N = (l: number) => nm({ letter: l, acc: 0 });

  // predictions, from the current key: the tonic in the treble clef (where?) and in the bass clef (which key?)
  const span = (a: number, b: number) => {
    const out: string[] = [];
    for (let x = a; ; x += Math.sign(b - a) || 1) { out.push(N(mod(x, 7))); if (x === b) break; }
    return out.join(', ');
  };
  const d1 = 28 + cur.letter < 30 ? 35 + cur.letter : 28 + cur.letter;
  const opts1 = [d1 - 1, d1, d1 + 1, d1 + 2].map((x) => where(x).w);
  const d2 = 21 + cur.letter > 26 ? 14 + cur.letter : 21 + cur.letter;
  const n2 = noteAtDiatonic(sc, d2);
  const p2Marks: Record<number, Mark> = {};
  for (let x = -24; x <= 0; x += 12) p2Marks[x] = { name: T.noteName(N(0), 4 + x / 12) };
  const recap = T.recap(N(0), N(1), N(2));

  return (
    <>
      <p className="desc">{T.desc}</p>
      <Predict mode="choice" resetOn={s.k + s.enh} options={opts1} answer={where(d1).w}
        prompt={T.p1(keyName(cur), nm(cur))} reveal={T.p1Reveal(where(d1).w, span(32, d1))} />
      <div className="board">
        <PianoGrandStaff tonic={cur} notes={[{ note: n2.note, oct: n2.oct }]} label={T.p2Staff(keyName(cur))} className="piano-staff-sm" />
      </div>
      <Predict mode="key" resetOn={s.k + s.enh} lay={layout(-24, 0)} marks={p2Marks} answer={[n2.s]}
        prompt={T.p2} reveal={T.p2Reveal(full(n2.note, n2.oct), span(24, d2))} />
      <div className="piano-ctrls">
        <Seg label={T.modeLabel} value={mode} onChange={(m) => {
          setMode(m);
          setAnswer(null);
          if (m === 'game') newTarget();
        }} options={[{ v: 'explore', label: T.modes.explore }, { v: 'game', label: T.modes.game }]} />
      </div>
      <p className="hint">{mode === 'explore' ? T.exploreHint : T.gameHint}</p>
      <div className="board">
        <PianoGrandStaff tonic={cur} notes={staffNotes} onPick={mode === 'explore' ? fromStaff : undefined} pick={mode === 'explore' ? pick : null}
          showMiddle={middle} middleLabel={T.middleLabel} label={T.staffAria(keyName(cur))} />
      </div>
      {mode === 'explore' ? (
        <div className="bar">
          <span className="now big" aria-live="polite">{read}</span>
          <div className="row">
            <div className="piano-nudge">
              <button type="button" aria-label={T.nudgeUp} onClick={() => nudge(1)}>▲</button>
              <button type="button" aria-label={T.nudgeDown} onClick={() => nudge(-1)}>▼</button>
            </div>
            <button type="button" onClick={() => { setShown([]); setPick(null); }}>{T.clear}</button>
          </div>
        </div>
      ) : (
        <div className="bar">
          <span className={'now big piano-fb' + (answer ? (answer.kind === 'ok' ? ' ok' : ' no') : '')} aria-live="polite">{fb || T.gameHint}</span>
          <div className="row">
            <span className="piano-score">{T.score(streak, best)}</span>
            <button type="button" className="primary" onClick={newTarget}>{target ? T.next : T.start}</button>
          </div>
        </div>
      )}
      <label className="toggle">
        <input type="checkbox" checked={middle} onChange={(e) => setMiddle(e.target.checked)} />
        {T.middleToggle}
      </label>
      <div className="board" ref={boardRef}>
        <Keyboard lay={lay} marks={marks} channel={CH} onKey={fromKey} minWidth={720} label={T.kbdAria} />
      </div>
      <Legend items={mode === 'explore' ? [
        { color: 'var(--k-tonic)', label: T.lgTonic },
        { colors: ['var(--k-scale)', 'var(--k-scaleb)'], label: T.lgScale },
        { colors: ['var(--k-chg)', 'var(--k-chgb)'], label: T.lgChg },
      ] : [
        { dash: 'var(--k-lt-line)', label: T.lgAnswer },
        { colors: ['var(--k-chg)', 'var(--k-chgb)'], label: T.lgWrong },
      ]} />
      <p className="hint">{T.octNote}</p>

      <h3 className="sub-h">{T.derivedTitle}</h3>
      <ul className="notes">
        <li><Html html={T.linesOf(T.clefs.treble, letters('treble', 'line'), letters('treble', 'space'))} /></li>
        <li><Html html={T.linesOf(T.clefs.bass, letters('bass', 'line'), letters('bass', 'space'))} /></li>
      </ul>

      <h3 className="sub-h">{T.logicTitle}</h3>
      <Notes items={T.logic(N(4), N(3), N(0)).map((html, i) => ({ html, color: i === 4 ? 'var(--change)' : undefined }))} more={[3, 5]} />
      <Transfer question={T.transfer} />
      <Recap oneLine={recap.oneLine} confusions={recap.confusions} show={recap.show} />
    </>
  );
}
