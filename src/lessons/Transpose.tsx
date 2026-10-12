import { type NoteEvent, playNotes } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout, roleMark } from '../components/layout';
import { Predict, Recap, Transfer } from '../components/Learn';
import { Board, Html, Legend, Notes, PlayButton } from '../components/ui';
import { text } from '../i18n/lessons/transpose';
import { useLessonText } from '../i18n/lessonText';
import { type Note, chordInfo, majorScale, mod, pcOf, triad, voice } from '../theory';
import { TUNE, degreeNote, degreeSemis, enharmonic, keyInterval, naiveName, spellingTrap, transposeNote } from '../theory/transpose';
import { useLab } from '../state/useLab';
import '../styles/harmony.css';

const C: Note = { letter: 0, acc: 0 };
const G: Note = { letter: 4, acc: 0 };
const Q = 0.5; // seconds per quarter note

/** Where the tonic sits (semitones from middle C) so the tune fits two whole octaves. */
const tonicAbs = (n: Note) => (pcOf(n) < 5 ? pcOf(n) + 12 : pcOf(n));
const DEGS = [...new Set(TUNE.flatMap((b) => b.melody))];

function tuneEvents(ton: Note): NoteEvent[] {
  const T = tonicAbs(ton);
  const sc = majorScale(ton);
  const ev: NoteEvent[] = [];
  let prev: number[] | null = null;
  TUNE.forEach((bar, bi) => {
    const t0 = bi * 4 * Q;
    const v = voice(triad(sc, bar.chord).map(pcOf), prev);
    prev = v;
    const len = bar.melody.length === 1 ? 4 * Q : Q;
    bar.melody.forEach((d, i) => ev.push({ s: T + degreeSemis(d), t: t0 + i * len, d: len * 0.95, v: 0.75 }));
    const base = pcOf(sc[bar.chord]);
    ev.push({ s: base - 24, t: t0, d: 4 * Q * 0.95, v: 0.45 });
    v.forEach((p) => ev.push({ s: p - 12, t: t0, d: 4 * Q * 0.95, v: 0.35 }));
  });
  return ev;
}

export function Transpose() {
  const { s, t: g, nm, keyName, cur } = useLab();
  const t = useLessonText(text);
  const isC = pcOf(cur) === 0 && cur.letter === 0;
  const dst = isC ? G : cur;
  const src = C;
  const dstName = keyName(dst);
  const srcName = keyName(src);
  const scS = majorScale(src);
  const scD = majorScale(dst);
  const reset = `${s.k}${s.enh}`;
  const iv = keyInterval(src, dst);
  const intName = t.intName(g.ord(iv.num), g.q[iv.quality]);

  const tuneMarks = (ton: Note): Record<number, Mark> => {
    const T = tonicAbs(ton);
    const m: Record<number, Mark> = {};
    DEGS.forEach((d) => {
      const abs = T + degreeSemis(d);
      const deg = mod(d, 7) + 1;
      m[abs] = roleMark(abs, deg === 1 ? 'tonic' : 'scale', deg, nm(degreeNote(ton, d)));
    });
    return m;
  };
  const layFor = (ton: Note) => {
    const from = 12 * Math.floor((tonicAbs(ton) - 1) / 12);
    return layout(from, from + 23);
  };
  const play = (ton: Note, ch: string) => playNotes(tuneEvents(ton), ch);
  const secs = TUNE.length * 4 * Q;

  const chordChips = (sc: Note[], ch: string) => (
    <div className="chips" role="group" aria-label={t.chordsLabel}>
      {TUNE.map((b, i) => {
        const c = chordInfo(sc, b.chord);
        return (
          <button key={i} type="button" className={'chip ' + c.quality} onClick={() => {
            const v = voice(triad(sc, b.chord).map(pcOf), null);
            playNotes([{ s: pcOf(sc[b.chord]) - 12, t: 0, d: 1.2, v: 0.5 }, ...v.map((p) => ({ s: p, t: 0, d: 1.2, v: 0.5 }))], ch);
          }}>
            {c.roman}<small>{nm(c.root) + c.suffix}</small>
          </button>
        );
      })}
    </div>
  );
  const legend = <Legend items={[{ color: 'var(--k-tonic)', label: t.lgTonic }, { colors: ['var(--k-scale)', 'var(--k-scaleb)'], label: t.lgScale }]} />;

  // predict 1: degree 5 in the new key
  const T = tonicAbs(dst);
  const lay1 = layFor(dst);
  // predict 2: spelling trap
  const trap = spellingTrap(dst) ?? 6;
  const right = scD[trap];
  const wrong = enharmonic(right);
  const opts = [nm(right), nm(wrong)].sort();

  // worked example: degree 4 of C (F) moved to the new key
  const exSrc = scS[3];
  const exLetter: Note = { letter: (exSrc.letter + iv.letters) % 7, acc: 0 };
  const exTo = transposeNote(exSrc, src, dst);
  const naive = scD.map((n) => naiveName(pcOf(n), true));

  return (
    <>
      <p className="desc">{t.desc}</p>
      {isC && <p className="hint">{t.isC}</p>}

      <h3 className="sub-h">{t.srcTitle}</h3>
      <p className="hint">{t.srcHint}</p>
      <p className="rowlab">{t.chordsLabel} · {srcName}</p>
      {chordChips(scS, 'tr-src')}
      <div className="row mt">
        <PlayButton label={t.playIn(srcName)} seconds={secs} onPlay={() => play(src, 'tr-src')} />
      </div>
      <Board><Keyboard lay={layFor(src)} marks={tuneMarks(src)} channel="tr-src" label={t.kbdAria(srcName)} /></Board>
      {legend}

      <Predict mode="key" resetOn={reset} prompt={t.p1(dstName)} lay={lay1} anyOctave
        marks={{ [T]: roleMark(T, 'tonic', 1, nm(dst)) }} answer={[T + 7]}
        reveal={t.p1r(scD.slice(0, 5).map(nm).join(', '), nm(scD[4]))} />
      <Predict mode="choice" resetOn={reset} prompt={t.p2(dstName, trap + 1, opts[0], opts[1])} options={opts} answer={nm(right)}
        reveal={t.p2r(trap + 1, nm(scD[trap - 1]), nm({ letter: right.letter, acc: 0 }), nm(right), nm(wrong))} />

      <h3 className="sub-h">{t.stepsTitle}</h3>
      <ol className="harmony-steps">
        {t.steps(srcName, dstName, intName, iv.semis, iv.letters, nm(exSrc), nm(exLetter), nm(exTo)).map((h, i) => <Html as="li" key={i} html={h} />)}
      </ol>
      <Board>
        <table className="harmony-table" aria-label={t.tableAria}>
          <tbody>
            <tr>
              <th scope="row">{t.rowDeg}</th>
              {scS.map((_, i) => <td key={i} className="harmony-deg">{i + 1}</td>)}
            </tr>
            <tr>
              <th scope="row">{srcName}</th>
              {scS.map((n, i) => <td key={i}>{nm(n)}</td>)}
            </tr>
            <tr>
              <th scope="row">{dstName}</th>
              {scD.map((n, i) => <td key={i}>{nm(n)}</td>)}
            </tr>
            <tr>
              <th scope="row">{t.rowNaive}</th>
              {naive.map((n, i) => {
                const bad = n.letter !== scD[i].letter;
                return <td key={i} className={bad ? 'harmony-acc' : undefined}>{nm(n)}{bad ? ' ✗' : ''}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </Board>
      <p className="hint">{naive.some((n, i) => n.letter !== scD[i].letter) ? t.naiveHint : t.naiveOk}</p>

      <h3 className="sub-h">{t.dstTitle(dstName)}</h3>
      <p className="hint">{t.dstHint}</p>
      <p className="rowlab">{t.chordsLabel} · {dstName}</p>
      {chordChips(scD, 'tr-dst')}
      <div className="row mt">
        <PlayButton label={t.playIn(srcName)} seconds={secs} onPlay={() => play(src, 'tr-src')} />
        <PlayButton label={t.playIn(dstName)} seconds={secs} onPlay={() => play(dst, 'tr-dst')} />
      </div>
      <Board><Keyboard lay={layFor(dst)} marks={tuneMarks(dst)} channel="tr-dst" label={t.kbdAria(dstName)} /></Board>
      {legend}

      <h3 className="sub-h">{t.whyTitle}</h3>
      <Notes items={t.why.map((html) => ({ html }))} more={[4, 5, 6]} />
      <Transfer question={t.transfer} />
      <Recap {...t.recap} />
    </>
  );
}
