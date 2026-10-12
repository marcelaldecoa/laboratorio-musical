import { useEffect } from 'react';
import { playNotes, stopAll } from '../audio/audio';
import { Keyboard } from '../components/Keyboard';
import { type Mark, layout } from '../components/layout';
import { Html } from '../components/ui';
import { COMPOSERS } from '../history/composers';
import { PERIODS } from '../history/periods';
import { type Composer, PERIOD_ORDER, type Period, type PeriodId } from '../history/types';
import { LESSONS } from '../lessons';
import { lessonMeta } from '../lessons/meta';
import { href } from '../router';
import { useLab } from '../state/useLab';

const periodOf = (id: string) => PERIODS.find((p) => p.id === id);
const keyCount = (r: [number, number]) => r[1] - r[0] + 1;

/** "The keyboard grows": one bar per period, aligned on the same semitone scale (A0 … C8). */
function KeyboardGrowth() {
  const { s, t } = useLab();
  const H = t.history;
  const LO = -39;
  const HI = 48;
  const W = 300;
  const x = (st: number) => ((st - LO) / (HI - LO)) * W;
  const rows = PERIODS;
  return (
    <section className="hist-grow">
      <h2>{H.growTitle}</h2>
      <p className="desc">{H.growDesc}</p>
      <svg viewBox={`0 0 ${W + 120} ${rows.length * 26 + 20}`} role="img" aria-label={H.growTitle}>
        <line x1={x(0)} x2={x(0)} y1={0} y2={rows.length * 26 + 4} className="hist-c" />
        <text x={x(0)} y={rows.length * 26 + 16} textAnchor="middle" className="hist-axis">{H.middleC}</text>
        {rows.map((p, i) => {
          const y = i * 26 + 4;
          const txt = p[s.lang];
          return (
            <g key={p.id}>
              {p.range ? (
                <rect x={x(p.range[0])} y={y} width={x(p.range[1]) - x(p.range[0])} height={16} rx={3} className={'hist-bar p-' + p.id} />
              ) : (
                <rect x={x(-12)} y={y} width={x(12) - x(-12)} height={16} rx={3} className="hist-bar none" />
              )}
              <text x={W + 6} y={y + 12} className="hist-axis">{txt.name.split(' ')[0]} · {p.range ? H.keys(keyCount(p.range)) : '—'}</text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

function ComposerCard({ c }: { c: Composer }) {
  const { s, t } = useLab();
  const H = t.history;
  const x = c[s.lang];
  const lessons = (c.lessons ?? []).map((id) => LESSONS.find((L) => L.id === id)).filter((L): L is (typeof LESSONS)[number] => !!L);
  return (
    <article className={'composer' + (c.brazil ? ' br' : '')}>
      <header>
        <h3>{c.name}</h3>
        <span className="years">{c.born}–{c.died ?? H.living}{c.brazil && <span className="br-tag">{H.brazil}</span>}</span>
      </header>
      <Html as="p" html={x.why} />
      {!!x.listen.length && <p className="c-row"><b>{H.listen}:</b> {x.listen.join(' · ')}</p>}
      {x.play && <p className="c-row"><b>{H.play}:</b> {x.play}</p>}
      {x.fact && (
        <details className="more"><summary>{H.fact}</summary><Html as="p" html={x.fact} /></details>
      )}
      {!!lessons.length && (
        <p className="c-lessons">{lessons.map((L) => <a key={L.id} className="need" href={href({ page: 'lesson', id: L.id })}>{lessonMeta(L, t, s.lang).title}</a>)}</p>
      )}
    </article>
  );
}

function PeriodPage({ p }: { p: Period }) {
  const { s, t } = useLab();
  const H = t.history;
  const x = p[s.lang];
  const i = PERIOD_ORDER.indexOf(p.id);
  const prev = periodOf(PERIOD_ORDER[i - 1]);
  const next = periodOf(PERIOD_ORDER[i + 1]);
  useEffect(() => { window.scrollTo({ top: 0 }); return () => stopAll(); }, [p.id]);
  const lay = p.range ? layout(p.range[0], p.range[1]) : null;
  const marks: Record<number, Mark> = { 0: { fill: 'var(--k-scale)', ink: 'var(--k-scale-ink)', name: H.middleC } };
  const sketchLay = lay ?? layout(-24, 24);
  const lessons = p.lessons.map((id) => LESSONS.find((L) => L.id === id)).filter((L): L is (typeof LESSONS)[number] => !!L);
  const composers = COMPOSERS.filter((c) => c.period === p.id).sort((a, b) => a.born - b.born);
  return (
    <article className={'page period p-' + p.id}>
      <a className="back" href={href({ page: 'history' })}>{H.back}</a>
      <header className="sec-head period-head">
        <p className="eyebrow">{x.years}</p>
        <h1>{x.name}</h1>
      </header>
      <p className="hook"><span className="rowlab">{H.question}</span><span className="hook-q">{x.question}</span></p>
      <Html as="p" className="desc" html={x.intro} />
      <ol className="steps-list">{x.steps.map((st, k) => <Html as="li" key={k} html={st} />)}</ol>

      <h2 className="sub-h">{H.sketch}</h2>
      <p className="hint">{x.sketch.title}. {H.sketchHint}</p>
      <div className="bar">
        <span className="now">{x.sketch.caption}</span>
        <button type="button" className="play" onClick={() => playNotes(p.sketch, 'hist')}>▶ {H.sketch}</button>
      </div>
      <div className="board"><Keyboard lay={sketchLay} marks={marks} channel="hist" minWidth={sketchLay.whites.length * 14} maxScale={6} label={x.sketch.title} /></div>

      <h2 className="sub-h">{H.instrument}: {x.instrument.name}</h2>
      <Html as="p" className="desc" html={x.instrument.text} />
      <p className="readout">{p.range ? H.keys(keyCount(p.range)) : H.noKeyboard}</p>

      {!!lessons.length && (
        <>
          <h2 className="sub-h">{H.theory}</h2>
          <div className="needs">{lessons.map((L) => <a key={L.id} className="need" href={href({ page: 'lesson', id: L.id })}>{lessonMeta(L, t, s.lang).title}</a>)}</div>
        </>
      )}

      {!!composers.length && (
        <>
          <h2 className="sub-h">{H.composers}</h2>
          <div className="composers">{composers.map((c) => <ComposerCard key={c.id} c={c} />)}</div>
        </>
      )}

      <section className="recap">
        <p className="recap-k">{H.oneLine}</p>
        <Html as="p" className="recap-one" html={x.oneLine} />
      </section>
      {!!x.more.length && (
        <details className="more"><summary>{H.more}</summary><ul className="notes">{x.more.map((m, k) => <Html as="li" key={k} html={m} />)}</ul></details>
      )}
      <nav className="pager">
        {prev ? <a className="pg prev" href={href({ page: 'history', id: prev.id })}><small>← {H.prev}</small><span>{prev[s.lang].name}</span></a> : <span />}
        {next ? <a className="pg next" href={href({ page: 'history', id: next.id })}><small>{H.next} →</small><span>{next[s.lang].name}</span></a> : <span />}
      </nav>
    </article>
  );
}

function BrazilPage() {
  const { s, t } = useLab();
  const H = t.history;
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  const list = COMPOSERS.filter((c) => c.brazil).sort((a, b) => a.born - b.born);
  return (
    <div className="page">
      <a className="back" href={href({ page: 'history' })}>{H.back}</a>
      <header className="sec-head"><h1>{H.brazilTitle} <span className="sub">· {H.brazilSub}</span></h1></header>
      <p className="desc">{H.brazilIntro}</p>
      {PERIOD_ORDER.map((pid) => {
        const cs = list.filter((c) => c.period === pid);
        const p = periodOf(pid);
        if (!cs.length || !p) return null;
        return (
          <section key={pid} className="br-section">
            <h2 className="sub-h"><a href={href({ page: 'history', id: pid })}>{p[s.lang].name}</a> <span className="years">{p[s.lang].years}</span></h2>
            <div className="composers">{cs.map((c) => <ComposerCard key={c.id} c={c} />)}</div>
          </section>
        );
      })}
    </div>
  );
}

export function History({ id }: { id?: string }) {
  const { s, t } = useLab();
  const H = t.history;
  if (id === 'brasil') return <BrazilPage />;
  const p = id ? periodOf(id) : undefined;
  if (p) return <PeriodPage p={p} />;
  return (
    <div className="page">
      <header className="sec-head"><h1>{H.title} <span className="sub">· {H.sub}</span></h1></header>
      <p className="desc">{H.intro}</p>
      {!PERIODS.length && <p className="hint">{H.empty}</p>}
      <h2 className="sub-h">{H.timeline}</h2>
      <ol className="timeline">
        {PERIODS.map((pp) => {
          const x = pp[s.lang];
          const n = COMPOSERS.filter((c) => c.period === pp.id).length;
          return (
            <li key={pp.id} className={'tl-item p-' + pp.id}>
              <a href={href({ page: 'history', id: pp.id })}>
                <span className="tl-years">{x.years}</span>
                <span className="tl-name">{x.name}</span>
                <span className="tl-q">{x.question}</span>
                {n > 0 && <span className="tl-n">{H.composers}: {n}</span>}
              </a>
            </li>
          );
        })}
      </ol>
      {COMPOSERS.some((c) => c.brazil) && (
        <a className="br-card" href={href({ page: 'history', id: 'brasil' })}>
          <span className="tl-name">{H.brazilTitle}</span>
          <span className="tl-q">{H.brazilIntro}</span>
        </a>
      )}
      {!!PERIODS.length && <KeyboardGrowth />}
    </div>
  );
}

/** Periods whose theory relates to a lesson, for the "born in" badge on lesson pages. */
export function periodsForLesson(id: string): { id: PeriodId; name: { pt: string; en: string } }[] {
  return PERIODS.filter((p) => p.lessons.includes(id)).map((p) => ({ id: p.id, name: { pt: p.pt.name, en: p.en.name } }));
}
