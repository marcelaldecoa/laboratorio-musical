import { type Note, STAFF_FLAT, STAFF_SHARP, keySignature } from '../theory';

/** Treble staff with the key signature; `newLetter` is drawn in the "change" color. */
export function KeySigStaff({ tonic, newLetter = -1, noneLabel, label, className }: {
  tonic: Note; newLetter?: number; noneLabel: string; label: string; className?: string;
}) {
  const s = keySignature(tonic);
  const yb = 62;
  const gap = 9;
  return (
    <svg className={'staff ' + (className ?? '')} viewBox="0 0 240 92" role="img" aria-label={label}>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="4" x2="236" y1={yb - i * gap} y2={yb - i * gap} stroke="var(--fg)" strokeWidth="1" opacity=".75" />
      ))}
      <text x="8" y={yb - gap} className="mus" style={{ fontSize: 44, fill: 'var(--fg)' }}>𝄞</text>
      {s.list.map((n, i) => {
        const idx = (s.type > 0 ? STAFF_SHARP : STAFF_FLAT)[n.letter];
        const y = yb - (idx * gap) / 2;
        const col = n.letter === newLetter ? 'var(--change)' : 'var(--fg)';
        return (
          <text key={i} x={58 + i * 15} y={(s.type > 0 ? y : y - 3).toFixed(1)} textAnchor="middle" dominantBaseline="central"
            className="mus" style={{ fontSize: 22, fill: col }}>
            {s.type > 0 ? '♯' : '♭'}
          </text>
        );
      })}
      {!s.list.length && (
        <text x="70" y={yb - 2 * gap} dominantBaseline="central" style={{ font: '400 12px var(--f-mono)', fill: 'var(--muted)' }}>{noneLabel}</text>
      )}
    </svg>
  );
}
