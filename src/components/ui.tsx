import { type ReactNode, useEffect, useRef, useState } from 'react';

/** Renders trusted dictionary strings that carry simple markup (<b>, <span class="pill">). */
export function Html({ html, as: Tag = 'span', className }: { html: string; as?: 'span' | 'p' | 'li' | 'div'; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export interface LegendItem {
  color?: string;
  colors?: string[];
  dash?: string | string[];
  label: string;
}

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className="legend">
      {items.map((it, i) => (
        <span key={i}>
          {(it.colors ?? (it.color ? [it.color] : [])).map((c, j) => (
            <i key={j} className="sw" style={{ background: c }} />
          ))}
          {(typeof it.dash === 'string' ? [it.dash] : it.dash ?? []).map((d, j) => (
            <i key={'d' + j} className="sw" style={{ background: 'transparent', border: `2px dashed ${d}` }} />
          ))}
          <span>{it.label}</span>
        </span>
      ))}
    </div>
  );
}

export interface NoteItem {
  color?: string;
  dash?: string;
  html: string;
}

export function Notes({ items }: { items: NoteItem[] }) {
  return (
    <ul className="notes">
      {items.map((it, i) => (
        <li key={i}>
          {it.color && <i className="sw" style={{ background: it.color }} />}
          {it.dash && <i className="sw" style={{ background: 'transparent', border: `2px dashed ${it.dash}` }} />}
          <Html html={it.html} />
        </li>
      ))}
    </ul>
  );
}

/** Play button that pulses briefly while its sound runs. */
export function PlayButton({ label, onPlay, seconds = 2 }: { label: string; onPlay: () => void; seconds?: number }) {
  const [on, setOn] = useState(false);
  const tm = useRef<number>(0);
  useEffect(() => () => clearTimeout(tm.current), []);
  return (
    <button
      type="button"
      className={'play' + (on ? ' on' : '')}
      onClick={() => {
        onPlay();
        setOn(true);
        clearTimeout(tm.current);
        tm.current = window.setTimeout(() => setOn(false), seconds * 1000);
      }}
    >
      <span className="play-ic" aria-hidden="true">{on ? '♪' : '▶'}</span>
      <span>{label}</span>
    </button>
  );
}

export function Bar({ now, children }: { now?: ReactNode; children?: ReactNode }) {
  return (
    <div className="bar">
      <span className="now">{now}</span>
      <div className="row">{children}</div>
    </div>
  );
}

export function Board({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={'board ' + (className ?? '')}>{children}</div>;
}

export function Seg<T extends string | number>({
  value, options, onChange, label,
}: { value: T; options: { v: T; label: ReactNode }[]; onChange: (v: T) => void; label?: string }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.v)} type="button" aria-pressed={o.v === value} onClick={() => onChange(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
