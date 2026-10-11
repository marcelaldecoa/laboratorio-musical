import { useRef } from 'react';
import { FS, GB, displayed, predSlot, sigShort } from '../theory';
import { goToKey, stepKey } from '../state/store';
import { useLab } from '../state/useLab';

const CX = 180;
const CY = 180;
const R = 124;
const RO = 163;
const pos = (k: number, r: number): [number, number] => {
  const a = ((-90 + 30 * k) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};

/** Interactive circle of fifths. Tap a key, or drag around the ring to turn it. */
export function CircleOfFifths({ compact = false, onPick }: { compact?: boolean; onPick?: () => void }) {
  const { s, t, nm, keyName, cur } = useLab();
  const p = predSlot(s.k, s.dir);
  const [px, py] = pos(p, R);
  const [qx, qy] = pos(s.k, R);
  const a1 = s.dir === 'cw' ? -122 : -58;
  const a2 = s.dir === 'cw' ? -58 : -122;
  const rr = 88;
  const ap = (a: number) => [CX + rr * Math.cos((a * Math.PI) / 180), CY + rr * Math.sin((a * Math.PI) / 180)];
  const [sx, sy] = ap(a1);
  const [ex, ey] = ap(a2);

  // drag to rotate: every 30° of finger travel around the center = one step
  const drag = useRef<{ a: number; moved: boolean } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const angle = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 360 - CX;
    const y = ((e.clientY - r.top) / r.height) * 360 - CY;
    return { a: (Math.atan2(y, x) * 180) / Math.PI, d: Math.hypot(x, y) };
  };

  return (
    <svg
      ref={svgRef}
      className={'circle' + (compact ? ' compact' : '')}
      viewBox="0 0 360 360"
      role="group"
      aria-label={t.circleAria}
      onPointerDown={(e) => {
        const { a, d } = angle(e);
        if (d > 95 && d < 150) drag.current = { a, moved: false };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const { a } = angle(e);
        let delta = a - drag.current.a;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        if (Math.abs(delta) >= 30) {
          drag.current = { a, moved: true };
          goToKey(s.k + (delta > 0 ? 1 : -1));
        }
      }}
      onPointerUp={() => {
        setTimeout(() => (drag.current = null), 0);
      }}
      onPointerCancel={() => (drag.current = null)}
    >
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1 1L8 5L1 9" fill="none" stroke="var(--muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <radialGradient id="cglow">
          <stop offset="0%" stopColor="var(--accent-soft)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent-soft)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={CX} cy={CY} r={70} fill="url(#cglow)" />
      {/* the ring is draggable; the center and outside still scroll the page */}
      <circle className="ring" cx={CX} cy={CY} r={R} fill="none" stroke="transparent" strokeWidth="54" style={{ touchAction: 'none' }} />
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth="1" />
      <path
        d={`M${sx.toFixed(1)} ${sy.toFixed(1)} A${rr} ${rr} 0 0 ${s.dir === 'cw' ? 1 : 0} ${ex.toFixed(1)} ${ey.toFixed(1)}`}
        fill="none" stroke="var(--muted)" strokeWidth="1.4" markerEnd="url(#ah)"
      />
      <line x1={px.toFixed(1)} y1={py.toFixed(1)} x2={qx.toFixed(1)} y2={qy.toFixed(1)} stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4" />
      {Array.from({ length: 12 }, (_, k) => {
        const [x, y] = pos(k, R);
        const [ox, oy] = pos(k, RO);
        const tn = displayed(k, s.enh);
        const side = k === 0 || k === 6 ? 'n' : k < 6 ? 's' : 'f';
        let fill = 'var(--surface)';
        let stroke = 'var(--line)';
        let ink = 'var(--fg)';
        let dash: string | undefined;
        if (side === 's') { fill = 'var(--accent-soft)'; stroke = 'var(--accent-soft)'; ink = 'var(--accent-ink)'; }
        if (side === 'f') { fill = 'var(--flat-soft)'; stroke = 'var(--flat-soft)'; ink = 'var(--flat-ink)'; }
        if (k === p) { stroke = 'var(--accent)'; dash = '3 3'; }
        const active = k === s.k;
        if (active) { fill = 'var(--accent)'; stroke = 'var(--accent)'; ink = 'var(--on-accent)'; dash = undefined; }
        const lab = k === 6 ? '6♯ / 6♭' : k === 0 ? '0' : k < 6 ? k + '♯' : 12 - k + '♭';
        const label = nm(tn);
        const go = () => {
          if (drag.current?.moved) return;
          goToKey(k);
          onPick?.();
        };
        return (
          <g key={k}>
            <g
              className={'node' + (active ? ' active' : '')}
              style={{ touchAction: 'none' }}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={`${keyName(tn)}, ${lab}`}
              onClick={go}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); stepKey(1); }
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); stepKey(-1); }
              }}
            >
              <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={active ? 26 : 23} fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray={dash} />
              <text x={x.toFixed(1)} y={y.toFixed(1)} textAnchor="middle" dominantBaseline="central"
                style={{ font: `500 ${label.length > 3 ? 12 : 15}px var(--f-body)`, fill: ink }}>{label}</text>
            </g>
            <text x={ox.toFixed(1)} y={oy.toFixed(1)} textAnchor="middle" dominantBaseline="central"
              style={{ font: '400 12px var(--f-mono)', fill: 'var(--muted)' }}>{lab}</text>
          </g>
        );
      })}
      <text x={CX} y={CY + 4} textAnchor="middle" dominantBaseline="central" style={{ font: '400 30px var(--f-display)', fill: 'var(--fg)' }}>{nm(cur)}</text>
      <text x={CX} y={CY + 34} textAnchor="middle" style={{ font: '400 12px var(--f-mono)', fill: 'var(--muted)' }}>{t.major} · {sigShort(cur)}</text>
      {s.k === 6 && (
        <text x={CX} y={CY + 52} textAnchor="middle" style={{ font: '400 11px var(--f-body)', fill: 'var(--muted)' }}>
          {t.tapAgain}: {nm(FS)} ↔ {nm(GB)}
        </text>
      )}
    </svg>
  );
}
