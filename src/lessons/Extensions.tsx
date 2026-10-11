import { useState } from 'react';
import { playNotes } from '../audio/audio';
import { ColorBracket } from '../components/ChordsKit';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, roleMark } from '../components/layout';
import { Bar, Board, Legend, Notes, PlayButton, Seg } from '../components/ui';
import { text } from '../i18n/lessons/extensions';
import { useLessonText } from '../i18n/lessonText';
import { isBlackKey, pcOf } from '../theory';
import {
  type ChordTone, SEVENTH_SEMIS, diatonicSeventhInfo, extensionsOf, letterName, seventhRoman, seventhSuffix, semisUp, simpleNumber, toneLabel,
} from '../theory/chords7';
import { formatChord } from '../theory/symbol';
import { setState } from '../state/store';
import { useLab } from '../state/useLab';
import '../styles/chords.css';

const Q_CHIP = { maj7: 'maj', dom7: 'fD', min7: 'min', hdim7: 'dim', dim7: 'dim' } as const;

export function Extensions() {
  const { s, nm, keyName, cur, sc } = useLab();
  const t = useLessonText(text);
  const st = s.lang;
  const d = s.deg || 0;
  const info = diatonicSeventhInfo(sc, d);
  const exts = extensionsOf(sc, d);
  const [off, setOff] = useState<Record<string, boolean>>({});
  const [fold, setFold] = useState<'stack' | 'fold'>('stack');
  // default: available extensions on, avoid notes off; the user can flip each one
  const isOn = (num: number) => {
    const key = `${d}:${num}`;
    const e = exts.find((x) => x.num === num)!;
    return key in off ? !off[key] : !e.avoid;
  };
  const toggle = (num: number) => setOff((o) => ({ ...o, [`${d}:${num}`]: isOn(num) }));

  const R = pcOf(info.notes[0]) - 12;
  const cs = SEVENTH_SEMIS[info.quality];
  const tones: ChordTone[] = cs.map((x, i) => ({ num: 1 + 2 * i, semis: x }));
  const active = exts.filter((e) => isOn(e.num));
  const sym = formatChord({ root: info.notes[0], tones: [...tones, ...active.map((e) => ({ num: e.num, semis: e.semis }))], bass: null }, st);
  const all = [...cs.map((x) => R + x), ...exts.map((e) => R + e.semis)];
  const pos = (e: (typeof exts)[number]) => R + e.semis - (fold === 'fold' ? 12 : 0);

  const marks: Record<number, Mark> = {};
  cs.forEach((x, i) => (marks[R + x] = roleMark(R + x, i === 0 ? 'tonic' : 'scale', String(1 + 2 * i), nm(info.notes[i]))));
  exts.forEach((e) => {
    const p = pos(e);
    const lab = fold === 'fold' ? String(simpleNumber(e.num)) : toneLabel(e);
    if (fold === 'fold' && isOn(e.num)) marks[R + e.semis] = { ghost: 'var(--muted)' };
    if (isOn(e.num)) marks[p] = roleMark(p, e.avoid ? 'lt' : 'chg', lab, nm(e.note));
    else if (e.avoid) marks[p] = { ghost: 'var(--change)', label: lab, ink: isBlackKey(p) ? 'var(--k-ivory)' : 'var(--k-lt-ink)' };
  });
  const sounding = [...cs.map((x) => R + x), ...active.map(pos)].sort((a, b) => a - b);
  const names = [...info.notes, ...active.map((e) => e.note)].map(nm).join(' ');
  const read = t.read(sym, names);
  const okList = exts.filter((e) => !e.avoid).map(toneLabel).join(', ') || t.none;

  const ch = 'ext';
  const playStack = () =>
    playNotes([...sounding.map((p, i) => ({ s: p, t: i * 0.28, d: 0.7 })), ...sounding.map((p) => ({ s: p, t: sounding.length * 0.28 + 0.15, d: 2, v: 0.42 }))], ch);

  // brackets: root → extension (9 = 2 + 8 − 1); an avoid note gets a coral bracket from the tone it clashes with
  const brackets: { a: number; b: number; label: string; color: string }[] = [];
  active.forEach((e) => {
    const p = pos(e);
    const simple = simpleNumber(e.num);
    if (fold === 'fold') brackets.push({ a: R, b: p, label: `${t.ord(simple)} · ${e.semis - 12}`, color: 'var(--muted)' });
    else if (e.avoid && e.clash) brackets.push({ a: R + semisUp(info.notes[0], e.clash), b: p, label: t.minor9, color: 'var(--change)' });
    else brackets.push({ a: R, b: p, label: `${t.sum(e.num, simple)} · ${e.semis}`, color: 'var(--muted)' });
  });

  return (
    <>
      <p className="desc">{t.desc}</p>
      <p className="rowlab">{t.pick(keyName(cur))}</p>
      <div className="chips" role="group">
        {[0, 1, 2, 3, 4, 5, 6].map((k) => {
          const c = diatonicSeventhInfo(sc, k);
          return (
            <button key={k} type="button" className={'chip ' + Q_CHIP[c.quality]} aria-pressed={k === d} onClick={() => setState({ deg: k })}>
              {seventhRoman(k, c.quality, st)}<small>{letterName(c.notes[0]) + seventhSuffix(c.quality, st)}</small>
            </button>
          );
        })}
      </div>
      <p className="rowlab">{t.exts}</p>
      <div className="chords-ext" role="group">
        {exts.map((e) => (
          <button key={e.num} type="button" className={'chip ' + (e.avoid ? 'avoid' : 'dim')} aria-pressed={isOn(e.num)} onClick={() => toggle(e.num)}>
            {toneLabel(e)}<small>{nm(e.note)} · {e.avoid ? t.avoid : t.avail}</small>
          </button>
        ))}
      </div>
      <div className="bar">
        <Seg label={t.view} value={fold} onChange={setFold} options={[{ v: 'stack', label: t.stacked }, { v: 'fold', label: t.folded }]} />
      </div>
      <Bar now={<span className="chords-sym">{sym}</span>}>
        <PlayButton label={t.playStack} seconds={3.5} onPlay={playStack} />
      </Bar>
      <Board>
        <Keyboard lay={layout(-12, 23)} marks={marks} channel={ch} label={read} minWidth={560} top={36 + 22 * Math.max(1, brackets.length)}
          steps={fold === 'stack' ? all.slice(0, -1).map((p, i) => ({ a: p, b: all[i + 1], t: all[i + 1] - p, h: false })) : null}
          ann={(l) => (
            <>
              {brackets.map((b, j) => (
                <ColorBracket key={j} lay={l} a={b.a} b={b.b} y={10 + 22 * (brackets.length - j)} color={b.color} label={b.label} />
              ))}
            </>
          )} />
      </Board>
      <Legend items={[
        { color: 'var(--k-tonic)', label: t.lgRoot },
        { colors: ['var(--k-scale)', 'var(--k-scaleb)'], label: t.lgTones },
        { colors: ['var(--k-chg)', 'var(--k-chgb)'], label: t.lgExt },
        { dash: 'var(--change)', label: t.lgAvoid },
        ...(fold === 'fold' ? [{ dash: 'var(--muted)', label: t.lgFold }] : []),
      ]} />
      <p className="readout">{read}</p>
      {fold === 'stack' && <p className="hint">{t.stepsNote}</p>}
      <p className="hint">{t.okRead(okList)}</p>
      {exts.filter((e) => e.avoid).map((e) => (
        <p key={e.num} className="hint">{t.clashRead(toneLabel(e), nm(e.note), nm(e.clash!))}</p>
      ))}
      <h3 className="sub-h">{t.logicTitle}</h3>
      <Notes items={t.logic.map((html) => ({ html }))} />
    </>
  );
}
