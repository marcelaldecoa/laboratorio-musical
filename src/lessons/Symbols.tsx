import { useState } from 'react';
import { playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, roleMark } from '../components/layout';
import { Bar, Board, Legend, Notes, PlayButton } from '../components/ui';
import { text } from '../i18n/lessons/symbols';
import { useLessonText } from '../i18n/lessonText';
import { type Note, mod, pcOf, sameNote } from '../theory';
import { diatonicSeventhInfo, letterName, seventhSuffix, simpleNumber, toneLabel, toneQuality } from '../theory/chords7';
import { type ParsedChord, chordNotes, formatChord, parseChord, sameChord } from '../theory/symbol';
import { useLab } from '../state/useLab';
import '../styles/chords.css';

/** Quality suffixes offered as buttons (written in plain ASCII, read by the parser). */
const SUFFIXES = ['', 'm', '7', '7M', 'm7', 'm7(b5)', '°7', '°', '+', 'sus4', 'sus2', '6', 'm6', 'add9', '7(9)', '7M(9)', 'm7(9)', '7(b9)', '7(9,13)'];

export function Symbols() {
  const { s, nm, keyName, cur, sc } = useLab();
  const t = useLessonText(text);
  const st = s.lang;
  const [input, setInput] = useState(() => letterName(sc[4]) + '7');
  const parsed = parseChord(input);
  // the last chord that was read, so the keyboard does not go blank while typing
  const [last, setLast] = useState<ParsedChord>(() => parseChord(letterName(sc[4]) + '7')!);
  const c = parsed ?? last;

  const update = (v: string) => {
    setInput(v);
    const p = parseChord(v);
    if (p) setLast(p);
  };
  const noBass = (x: ParsedChord): ParsedChord => ({ ...x, bass: null });
  const suffixOf = (x: ParsedChord) => formatChord(noBass(x), st).slice(letterName(x.root).length);
  const compose = (root: Note, suf: string, bass: Note | null) => {
    const p = parseChord(letterName(root) + suf);
    return p ? formatChord({ ...p, bass }, st) : letterName(root);
  };

  // keyboard: root in the 4th octave (or just below), slash bass under it
  const rp = pcOf(c.root);
  const r = rp >= 7 ? rp - 12 : rp;
  const notes = chordNotes(c);
  const ps = c.tones.map((x) => r + x.semis);
  const bassS = c.bass ? r - (mod(r - pcOf(c.bass), 12) || 12) : null;
  const lo = Math.min(...ps, bassS ?? 99);
  const hi = Math.max(...ps);
  const from = Math.floor(lo / 12) * 12;
  const to = Math.max(from + 23, Math.floor(hi / 12) * 12 + 11);
  const lay = layout(from, to);
  const marks: Record<number, Mark> = {};
  c.tones.forEach((x, i) => {
    const p = ps[i];
    const role = x.num === 1 ? 'tonic' : x.num >= 9 ? 'chg' : 'scale';
    marks[p] = roleMark(p, role, toneLabel(x), nm(notes[i]));
  });
  if (bassS != null && c.bass) marks[bassS] = roleMark(bassS, 'lt', '', nm(c.bass));

  const sym = formatChord(c, st);
  const read = t.read(sym, (c.bass ? nm(c.bass) + ' / ' : '') + notes.map(nm).join(' '));
  const sounding = [...(bassS != null ? [bassS] : []), ...ps];
  const play = (x: number[] = sounding) =>
    playNotes([...x.map((p, i) => ({ s: p, t: i * 0.2, d: 0.5 })), ...x.map((p) => ({ s: p, t: x.length * 0.2 + 0.1, d: 1.8, v: 0.45 }))], 'sym');
  const playChord = (x: ParsedChord) => {
    const rr = pcOf(x.root) >= 7 ? pcOf(x.root) - 12 : pcOf(x.root);
    const pp = x.tones.map((tt) => rr + tt.semis);
    const b = x.bass ? [rr - (mod(rr - pcOf(x.bass), 12) || 12)] : [];
    play([...b, ...pp]);
  };
  const pick = (v: string) => {
    update(v);
    const p = parseChord(v);
    if (p) playChord(p);
  };

  const ivName = (num: number, semis: number) =>
    num === 1 ? t.root : t.ivName(num, t.q[toneQuality({ num, semis })]) + (num > 8 ? ` (${simpleNumber(num)} + 8 − 1)` : '');

  // pickers
  const curSuf = suffixOf(c);
  const rootBtn = (letter: number) => {
    const n = { letter, acc: c.root.letter === letter ? c.root.acc : 0 };
    return (
      <button key={letter} type="button" className="chip neutral" aria-pressed={c.root.letter === letter}
        onClick={() => pick(compose(n, curSuf, null))}>
        {'CDEFGAB'[letter]}{st === 'pt' && <small>{nm({ letter, acc: 0 })}</small>}
      </button>
    );
  };
  const accBtn = (acc: number, lab: string) => (
    <button key={acc} type="button" className="chip neutral" aria-pressed={c.root.acc === acc}
      onClick={() => pick(compose({ letter: c.root.letter, acc }, curSuf, null))}>{lab}</button>
  );
  const sufChip = (suf: string) => {
    const p = parseChord(letterName(c.root) + suf);
    if (!p) return null;
    const on = sameChord(p, noBass(c));
    return (
      <button key={suf} type="button" className="chip neutral" aria-pressed={on} onClick={() => pick(formatChord(p, st))}>
        {formatChord(p, st).slice(letterName(c.root).length) || t.majorChip}
      </button>
    );
  };

  // examples that follow the key: I7M, ii7, V7, viiø7, V with its 3rd in the bass, Iadd9, V7(9)
  const dia = (d: number) => {
    const i = diatonicSeventhInfo(sc, d);
    return letterName(i.notes[0]) + seventhSuffix(i.quality, st);
  };
  const keyEx = [dia(0), dia(1), dia(4), dia(6), `${letterName(sc[4])}/${letterName(sc[6])}`, compose(sc[0], 'add9', null), compose(sc[4], '7(9)', null)];
  const fixedEx = ['F#m7', 'Bb7M', 'G/B', 'Am7(b5)', 'C9', 'Dsus4', 'C6/9', 'E7(#9)'];

  const rootTxt = letterName(c.root);
  const qualTxt = suffixOf(c);

  return (
    <>
      <p className="desc">{t.desc}</p>
      <div className="chords-input">
        <input type="text" value={input} aria-label={t.inputLabel} placeholder={t.placeholder} aria-invalid={!parsed}
          autoCapitalize="off" autoCorrect="off" spellCheck={false} onChange={(e) => update(e.target.value)} />
        <PlayButton label={t.play} seconds={2.4} onPlay={() => play()} />
      </div>
      {!parsed && input.trim() !== '' && <p className="chords-err" role="status">{t.err}</p>}
      <div className="chords-anat" aria-live="polite">
        <span className="root">{rootTxt}<small>{t.anRoot}</small></span>
        {qualTxt && <span className="qual">{qualTxt}<small>{t.anQual}</small></span>}
        {c.bass && <span className="bass">/{letterName(c.bass)}<small>{t.anBass}</small></span>}
      </div>
      <Board>
        <Keyboard lay={lay} marks={marks} channel="sym" label={read} minWidth={lay.whites.length > 14 ? 520 : undefined} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: t.lgRoot },
        { colors: ['var(--k-scale)', 'var(--k-scaleb)'], label: t.lgTones },
        { colors: ['var(--k-chg)', 'var(--k-chgb)'], label: t.lgExt },
        { color: 'var(--k-lt)', label: t.lgBass },
      ]} />
      <Bar now={<span className="chords-sym">{read}</span>} />
      <p className="hint">{t.inKeys}</p>
      <ul className="chords-tones">
        {c.tones.map((x, i) => (
          <li key={x.num}><b>{toneLabel(x)}</b>{nm(notes[i])}<span>{ivName(x.num, x.semis)}</span></li>
        ))}
      </ul>

      <p className="rowlab">{t.rootLab}</p>
      <div className="chips" role="group">{[0, 1, 2, 3, 4, 5, 6].map(rootBtn)}</div>
      <p className="rowlab">{t.accLab}</p>
      <div className="chips" role="group">{accBtn(-1, '♭')}{accBtn(0, '♮')}{accBtn(1, '♯')}</div>
      <p className="rowlab">{t.qualLab}</p>
      <div className="chips" role="group">{SUFFIXES.map(sufChip)}</div>
      <p className="rowlab">{t.bassLab}</p>
      <div className="chips" role="group">
        <button type="button" className="chip neutral" aria-pressed={!c.bass} onClick={() => pick(formatChord(noBass(c), st))}>{t.noBass}</button>
        {notes.slice(1).filter((_, i) => c.tones[i + 1].num <= 7).map((n) => (
          <button key={n.letter} type="button" className="chip neutral" aria-pressed={!!c.bass && sameNote(c.bass, n)}
            onClick={() => pick(formatChord({ ...c, bass: n }, st))}>/{letterName(n)}<small>{nm(n)}</small></button>
        ))}
      </div>

      <p className="rowlab">{t.examples(keyName(cur))}</p>
      <div className="chips" role="group">
        {keyEx.map((e) => (
          <button key={e} type="button" className="chip neutral" aria-pressed={input === e} onClick={() => pick(e)}>{e}</button>
        ))}
      </div>
      <p className="rowlab">{t.examples2}</p>
      <div className="chips" role="group">
        {fixedEx.map((e) => (
          <button key={e} type="button" className="chip neutral" aria-pressed={input === e} onClick={() => pick(e)}>{e}</button>
        ))}
      </div>
      <p className="hint">{t.letters}</p>

      <h3 className="sub-h">{t.logicTitle}</h3>
      <Notes items={t.logic.map((html) => ({ html }))} />
    </>
  );
}
