import { type ReactNode, useEffect, useId, useState } from 'react';
import { playNotes, subscribeNotes } from '../audio/audio';
import { BH, BW, KW, type KeyLayout, type Mark, type Step, WHH, layout } from './layout';

interface Props {
  lay?: KeyLayout;
  marks?: Record<number, Mark>;
  steps?: Step[] | null;
  /** room above the keys for brackets */
  top?: number;
  ann?: (lay: KeyLayout) => ReactNode;
  /** audio channel whose notes light up this keyboard */
  channel?: string;
  /** tap a key to hear it (default true) */
  playable?: boolean;
  onKey?: (s: number) => void;
  label?: string;
  className?: string;
  minWidth?: number;
  /** max scale factor over the natural size (keeps short keyboards readable on iPad) */
  maxScale?: number;
}

/** The piano: the app's main teaching surface (same capabilities as the prototype's drawKeys). */
export function Keyboard({
  lay = layout(0, 23), marks = {}, steps, top = 24, ann, channel, playable = true, onKey, label, className, minWidth, maxScale = 2.3,
}: Props) {
  const own = useId();
  const ch = channel ?? own;
  const [lit, setLit] = useState<Set<number>>(() => new Set());

  useEffect(
    () =>
      subscribeNotes(ch, (s, on) =>
        setLit((prev) => {
          if (Number.isNaN(s)) return prev.size ? new Set() : prev;
          const n = new Set(prev);
          if (on) n.add(s);
          else n.delete(s);
          return n;
        }),
      ),
    [ch],
  );

  const H = top + WHH + (steps ? 54 : 32);
  const press = (s: number) => {
    if (onKey) onKey(s);
    else if (playable) playNotes([{ s, t: 0, d: 1.1 }], ch);
  };
  const interactive = playable || !!onKey;
  const keyProps = (s: number) =>
    interactive
      ? {
          onPointerDown: (e: React.PointerEvent) => {
            if (e.button !== 0) return;
            press(s);
          },
          style: { cursor: 'pointer' },
        }
      : {};

  return (
    <svg
      className={'kbd ' + (className ?? '')}
      viewBox={`0 0 ${lay.width} ${H}`}
      role="img"
      aria-label={label}
      style={{ minWidth, maxWidth: lay.width * maxScale, marginInline: 'auto' }}
    >
      {lay.whites.map((s) => {
        const m = marks[s];
        const x = lay.x(s);
        return (
          <g key={'w' + s} className={'key white' + (lit.has(s) ? ' lit' : '')} {...keyProps(s)}>
            <rect className="kk" x={x} y={top} width={KW} height={WHH} rx={3}
              style={{ fill: m?.fill ?? 'var(--k-ivory)', stroke: 'var(--k-edge)', strokeWidth: 1 }} />
            <rect className="glow" x={x + 1.5} y={top + 1.5} width={KW - 3} height={WHH - 3} rx={3} />
            {m?.label != null && (
              <text className="klab" x={x + KW / 2} y={top + WHH - 14} textAnchor="middle" style={{ fill: m.ink }}>{m.label}</text>
            )}
            {m?.name && <text className="kname" x={x + KW / 2} y={top + WHH + 18} textAnchor="middle">{m.name}</text>}
          </g>
        );
      })}
      {lay.blacks.map((s) => {
        const m = marks[s];
        const x = lay.x(s);
        return (
          <g key={'b' + s} className={'key black' + (lit.has(s) ? ' lit' : '')} {...keyProps(s)}>
            <rect className="kk" x={x} y={top} width={BW} height={BH} rx={2}
              style={{ fill: m?.fill ?? 'var(--k-ebony)', stroke: 'var(--k-ebony)', strokeWidth: 1 }} />
            <rect className="glow" x={x + 1} y={top + 1} width={BW - 2} height={BH - 2} rx={2} />
            {m?.label != null && (
              <text className="klab" x={x + BW / 2} y={top + BH - 11} textAnchor="middle" style={{ fill: m.ink }}>{m.label}</text>
            )}
            {m?.name && <text className="kname" x={x + BW / 2} y={top - 9} textAnchor="middle">{m.name}</text>}
          </g>
        );
      })}
      <g pointerEvents="none">
        {lay.whites.map((s) => marks[s]?.ghost && (
          <rect key={'gw' + s} x={lay.x(s) + 2} y={top + 2} width={KW - 4} height={WHH - 4} rx={3} fill="none"
            style={{ stroke: marks[s].ghost, strokeWidth: 2.2, strokeDasharray: '5 3' }} />
        ))}
        {lay.blacks.map((s) => marks[s]?.ghost && (
          <rect key={'gb' + s} x={lay.x(s) + 1.5} y={top + 1.5} width={BW - 3} height={BH - 3} rx={2} fill="none"
            style={{ stroke: marks[s].ghost, strokeWidth: 2.2, strokeDasharray: '5 3' }} />
        ))}
        {steps?.map((st, i) => (
          <text key={'st' + i} className={'kstep' + (st.h ? ' h' : '')} x={((lay.c(st.a) + lay.c(st.b)) / 2).toFixed(1)}
            y={top + WHH + 42} textAnchor="middle">{st.t}</text>
        ))}
        {ann?.(lay)}
      </g>
    </svg>
  );
}

/** Bracket above the keyboard with a label (a distance). */
export function Bracket({ lay, a, b, y, label }: { lay: KeyLayout; a: number; b: number; y: number; label: string }) {
  const x1 = lay.c(a);
  const x2 = lay.c(b);
  return (
    <g>
      <path d={`M${x1.toFixed(1)} ${y + 10} V${y} H${x2.toFixed(1)} V${y + 10}`} fill="none" stroke="var(--muted)" strokeWidth={1.2} />
      <text className="ann" x={((x1 + x2) / 2).toFixed(1)} y={y - 7} textAnchor="middle">{label}</text>
    </g>
  );
}
