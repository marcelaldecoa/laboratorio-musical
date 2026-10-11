import type { KeyLayout } from './layout';

/** Bracket above the keys drawn in a meaning color (green = major/perfect, purple = minor, coral = tension). */
export function ColorBracket({ lay, a, b, y, label, color = 'var(--muted)' }: {
  lay: KeyLayout; a: number; b: number; y: number; label: string; color?: string;
}) {
  const x1 = lay.c(a);
  const x2 = lay.c(b);
  return (
    <g>
      <path d={`M${x1.toFixed(1)} ${y + 9} V${y} H${x2.toFixed(1)} V${y + 9}`} fill="none" stroke={color} strokeWidth={1.6} />
      <text className="ann" x={((x1 + x2) / 2).toFixed(1)} y={y - 6} textAnchor="middle" style={{ fill: color, fontWeight: 500 }}>{label}</text>
    </g>
  );
}

/** Curved arrow above the keys from one key to another (a voice moving). */
export function VoiceArrow({ lay, a, b, y, color = 'var(--muted)', below = false }: {
  lay: KeyLayout; a: number; b: number; y: number; color?: string; below?: boolean;
}) {
  const x1 = lay.c(a);
  const x2 = lay.c(b);
  if (Math.abs(x2 - x1) < 1) return null;
  const mid = (x1 + x2) / 2;
  const h = Math.min(26, 10 + Math.abs(x2 - x1) / 5) * (below ? -1 : 1);
  // arrow head follows the tangent at the end of the curve
  const ang = Math.atan2(h * 2, (x2 - x1) / 2);
  const hx = (k: number) => (x2 - 7 * Math.cos(ang + k)).toFixed(1);
  const hy = (k: number) => (y - 7 * Math.sin(ang + k)).toFixed(1);
  return (
    <g>
      <path d={`M${x1.toFixed(1)} ${y} Q${mid.toFixed(1)} ${y - h * 2} ${x2.toFixed(1)} ${y}`} fill="none" stroke={color} strokeWidth={1.6} />
      <path d={`M${hx(0.45)} ${hy(0.45)} L${x2.toFixed(1)} ${y} L${hx(-0.45)} ${hy(-0.45)}`} fill="none" stroke={color} strokeWidth={1.6} />
    </g>
  );
}

export interface FifthCell {
  /** note name */
  name: string;
  fill?: string;
  ink?: string;
  /** small text under the name (degree or chord-tone number) */
  tag?: string;
  /** outside the key: dashed outline */
  out?: boolean;
  /** outline color for highlighted dashed cells */
  stroke?: string;
}

/** A strip of the line of fifths with an optional bracket over the 7-note window. */
export function FifthsStrip({ cells, win, winLabel, label }: {
  cells: FifthCell[]; win?: [number, number]; winLabel?: string; label: string;
}) {
  const W = 36;
  const G = 4;
  const X = (j: number) => 2 + j * (W + G);
  const width = X(cells.length - 1) + W + 2;
  const top = win ? 34 : 4;
  return (
    <svg viewBox={`0 0 ${width} ${top + 58}`} role="img" aria-label={label} style={{ maxWidth: width * 1.6, marginInline: 'auto' }}>
      {win && (
        <g>
          <path d={`M${X(win[0])} ${top - 6} V${top - 13} H${X(win[1]) + W} V${top - 6}`} fill="none" stroke="var(--muted)" strokeWidth="1.2" />
          <text className="ann" x={(X(win[0]) + X(win[1]) + W) / 2} y={top - 19} textAnchor="middle">{winLabel}</text>
        </g>
      )}
      {cells.map((c, j) => (
        <g key={j}>
          <rect x={X(j)} y={top} width={W} height={52} rx={5}
            style={{
              fill: c.fill ?? (c.out ? 'transparent' : 'var(--surface)'),
              stroke: c.stroke ?? (c.fill ? c.fill : c.out ? 'var(--line)' : 'var(--accent)'),
              strokeWidth: 1.2,
              strokeDasharray: c.out ? '4 3' : undefined,
            }} />
          <text x={X(j) + W / 2} y={top + (c.tag ? 19 : 26)} textAnchor="middle" dominantBaseline="central"
            style={{ font: '500 12px var(--f-mono)', fill: c.ink ?? 'var(--muted)' }}>{c.name}</text>
          {c.tag && (
            <text x={X(j) + W / 2} y={top + 38} textAnchor="middle" dominantBaseline="central"
              style={{ font: '500 12px var(--f-mono)', fill: c.ink ?? 'var(--muted)' }}>{c.tag}</text>
          )}
        </g>
      ))}
    </svg>
  );
}
