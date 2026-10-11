import { playNotes, seq } from '../audio/audio';
import { keySignature, pcOf, scaleSemitones, sigShort } from '../theory';
import { useLab } from '../state/useLab';
import { KeySigStaff } from './Staff';
import { Html, PlayButton } from './ui';

/** The current key: name, signature on the staff, what changed and the self-check. */
export function KeyCard() {
  const { s, t, nm, keyName, cur, lcur, pred, consistent, diff } = useLab();
  const sig = keySignature(cur);
  const newL = consistent && diff && diff.to !== 0 ? diff.letter : -1;
  let chk: string;
  if (sig.type > 0) chk = t.chkSharp(nm(sig.list[sig.list.length - 1]), nm(cur));
  else if (sig.type < 0 && sig.list.length > 1) chk = t.chkFlats(nm(sig.list[sig.list.length - 2]), nm(cur));
  else if (sig.type < 0) chk = t.chkFlat1(nm(sig.list[0]), nm(cur));
  else chk = t.chkNone(nm(cur));
  const short = sigShort(cur);
  return (
    <article className="card keycard" aria-live="polite">
      <p className="eyebrow">{t.current}</p>
      <h2 className="keyname">
        {keyName(cur)}
        <small>{short === '0' ? t.none : t.inSig(short)}</small>
      </h2>
      <KeySigStaff tonic={cur} newLetter={newL} noneLabel={t.staffNone} label={t.staffAria} />
      <p className="sig">
        {sig.list.length ? (
          <>
            {t.sig}
            {sig.list.map((n, i) => (
              <span key={i} className={n.letter === newL ? 'new' : undefined}>{nm(n)}{i < sig.list.length - 1 ? ' ' : ''}</span>
            ))}
          </>
        ) : t.sigEmpty}
      </p>
      <div className="change">
        <p className="move">{keyName(pred)}<span className="arrow">→</span>{keyName(lcur)}</p>
        <p><span className="pill">{s.dir === 'cw' ? t.up5 : t.up4}</span></p>
        {diff && (
          <>
            <Html as="p" html={t.change(nm({ letter: diff.letter, acc: diff.from }), nm({ letter: diff.letter, acc: diff.to }), diff.deg, diff.deg === 7 ? t.role7 : t.role4, keyName(lcur))} />
            <p className="rule">{s.dir === 'cw' ? t.ruleCw : t.ruleCcw}</p>
          </>
        )}
        {!consistent && <p className="rule">{t.enh(keyName(cur), keyName(lcur), nm(lcur))}</p>}
      </div>
      <p className="check">{chk}</p>
      <PlayButton label={t.playScale} seconds={3} onPlay={() => playNotes(seq(scaleSemitones(pcOf(cur))))} />
    </article>
  );
}
