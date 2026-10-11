/** Line of fifths with one or two key windows drawn as brackets (above and below). Used by the "motion" track. */

export interface FifthsWindow {
  /** first and last fifth index inside the window (inclusive) */
  start: number;
  end: number;
  label: string;
  color: string;
  dash?: boolean;
  below?: boolean;
}

export interface FifthsCell {
  fill?: string;
  ink?: string;
  stroke?: string;
  dash?: boolean;
  /** small text under the note name (a degree, a chord tone) */
  sub?: string;
}

interface Props {
  from: number;
  to: number;
  name: (f: number) => string;
  wins: FifthsWindow[];
  cells?: Record<number, FifthsCell>;
  label: string;
}

const W = 36;
const G = 4;

export function MotionFifthsLine({ from, to, name, wins, cells = {}, label }: Props) {
  const X = (f: number) => 2 + (f - from) * (W + G);
  const above = wins.some((w) => !w.below);
  const below = wins.some((w) => w.below);
  const y0 = above ? 36 : 6;
  const H = y0 + 54 + (below ? 40 : 6);
  const width = X(to) + W + 2;
  return (
    <svg className="motion-line" viewBox={`0 0 ${width} ${H}`} role="img" aria-label={label}>
      {wins.map((w, i) => {
        const x1 = X(w.start);
        const x2 = X(w.end) + W;
        const y = w.below ? y0 + 54 + 14 : y0 - 14;
        const tick = w.below ? -8 : 8;
        return (
          <g key={i}>
            <path d={`M${x1} ${y + tick} V${y} H${x2} V${y + tick}`} fill="none"
              style={{ stroke: w.color, strokeWidth: 2, strokeDasharray: w.dash ? '5 3' : undefined }} />
            <text className="ann" x={(x1 + x2) / 2} y={w.below ? y + 18 : y - 7} textAnchor="middle">{w.label}</text>
          </g>
        );
      })}
      {Array.from({ length: to - from + 1 }, (_, n) => {
        const f = from + n;
        const c = cells[f];
        const x = X(f);
        const inside = wins.some((w) => f >= w.start && f <= w.end);
        return (
          <g key={f}>
            <rect x={x} y={y0} width={W} height={54} rx={5}
              style={{
                fill: c?.fill ?? (inside ? 'var(--surface)' : 'transparent'),
                stroke: c?.stroke ?? (c?.fill ? c.fill : 'var(--line)'),
                strokeWidth: 1.4,
                strokeDasharray: c?.dash || (!c && !inside) ? '4 3' : undefined,
              }} />
            <text x={x + W / 2} y={y0 + (c?.sub ? 20 : 27)} textAnchor="middle" dominantBaseline="central"
              style={{ font: `${c?.fill ? 500 : 400} 13px var(--f-mono)`, fill: c?.ink ?? (inside ? 'var(--fg)' : 'var(--muted)') }}>
              {name(f)}
            </text>
            {c?.sub && (
              <text x={x + W / 2} y={y0 + 39} textAnchor="middle" dominantBaseline="central"
                style={{ font: '500 11px var(--f-mono)', fill: c.ink ?? 'var(--muted)' }}>{c.sub}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
