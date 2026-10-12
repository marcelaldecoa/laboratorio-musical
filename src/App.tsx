import { useEffect, useState } from 'react';
import { stopAll, useSoundStatus } from './audio/audio';
import { CircleOfFifths } from './components/CircleOfFifths';
import { KeyCard } from './components/KeyCard';
import { KeyControls } from './components/KeyControls';
import { Sheet } from './components/Sheet';
import { Seg } from './components/ui';
import { DICTS } from './i18n';
import { LESSONS, TRACKS } from './lessons';
import { HOOKS } from './i18n/hooks';
import { glossaryEntry } from './lessons/glossaryAll';
import { lessonMeta } from './lessons/meta';
import { Piano } from './pages/Piano';
import { History, periodsForLesson } from './pages/History';
import { Practice } from './pages/Practice';
import { href, useRoute, type Route } from './router';
import { dueReviews, goToKey, markStudied, setLang, setState, streak, today, toggleDone } from './state/store';
import { useLab } from './state/useLab';
import { sigShort } from './theory';

function Flag({ lang }: { lang: 'pt' | 'en' }) {
  return lang === 'pt' ? (
    <svg className="flag" viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#009C3B" /><path d="M10 1.5 18.4 7 10 12.5 1.6 7z" fill="#FFDF00" /><circle cx="10" cy="7" r="3.2" fill="#002776" /><path d="M6.9 6.4q3-1 6.2.8" stroke="#FFFFFF" strokeWidth=".6" fill="none" /></svg>
  ) : (
    <svg className="flag" viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#FFFFFF" /><g fill="#B22234">{[0, 2.15, 4.31, 6.46, 8.62, 10.77, 12.92].map((y) => <rect key={y} y={y} width="20" height="1.08" />)}</g><rect width="8.6" height="7.54" fill="#3C3B6E" /></svg>
  );
}

function Logo() {
  return (
    <svg className="logo" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="2" y="2" width="60" height="60" rx="16" fill="var(--on-cover)" />
      <g fill="var(--cover)">
        {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={13 + k * 7.6} y="38" width="6.4" height="14" rx="1.5" />)}
      </g>
      <g fill="var(--on-cover)">{[1, 2, 4].map((k) => <rect key={k} x={11.2 + k * 7.6} y="38" width="3.6" height="8" />)}</g>
      <circle cx="49" cy="15" r="4" fill="var(--spark)" />
      <text x="31" y="39" textAnchor="middle" style={{ font: '30px var(--f-music)', fill: 'var(--cover)' }}>𝄞</text>
    </svg>
  );
}

function Settings() {
  const { s, t } = useLab();
  const snd = useSoundStatus();
  const k = t.keyBar;
  return (
    <div className="settings">
      <p className="rowlab">{k.language}</p>
      <div className="lang" role="group" aria-label={k.language}>
        {(['pt', 'en'] as const).map((l) => (
          <button key={l} type="button" aria-pressed={s.lang === l} onClick={() => setLang(l)} lang={l === 'pt' ? 'pt-BR' : 'en'}>
            <Flag lang={l} /><span>{DICTS[l].langName}</span>
          </button>
        ))}
      </div>
      <p className="rowlab">{k.notation}</p>
      <Seg value={s.nt} onChange={(nt) => setState({ nt })} options={[{ v: 'en', label: 'C D E' }, { v: 'pt', label: 'Dó Ré Mi' }]} />
      <p className="rowlab">{k.theme}</p>
      <Seg value={s.theme} onChange={(theme) => setState({ theme })} options={[{ v: 'auto', label: k.themeAuto }, { v: 'light', label: k.themeLight }, { v: 'dark', label: k.themeDark }]} />
      <p className="rowlab">{t.stepper.mode}</p>
      <label className="toggle">
        <input type="checkbox" checked={s.stepMode} onChange={(e) => setState({ stepMode: e.target.checked })} />
        <span>{t.stepper.modeHint}</span>
      </label>
      <p className="rowlab">{k.sound}</p>
      <p className="sound-status">
        <span className={'dot ' + snd} />
        {snd === 'piano' ? k.soundReady : snd === 'loading' ? k.soundLoading : snd === 'synth' ? k.soundSynth : k.soundPiano}
      </p>
      <p className="hint">{k.tip}</p>
      <p className="hint">{k.install}</p>
    </div>
  );
}

function KeyPanel({ onPick }: { onPick?: () => void }) {
  return (
    <div className="keypanel">
      <CircleOfFifths onPick={onPick} />
      <KeyControls />
    </div>
  );
}

function LessonCard({ i, active }: { i: number; active?: boolean }) {
  const { s, t } = useLab();
  const L = LESSONS[i];
  const m = lessonMeta(L, t, s.lang);
  return (
    <a className={'lcard tone-' + L.tone + (active ? ' active' : '') + (s.done.includes(L.id) ? ' done' : '')} href={href({ page: 'lesson', id: L.id })}>
      <span className="lnum">{i + 1}{s.done.includes(L.id) && <span className="ldone"> ✓</span>}</span>
      <span className="licon" aria-hidden="true">{L.icon}</span>
      <span className="ltitle">{m.title}</span>
      <span className="lteaser">{m.teaser}</span>
    </a>
  );
}

function LessonGrid({ activeId }: { activeId?: string }) {
  const { t } = useLab();
  return (
    <div className="tracks">
      {TRACKS.map((tr) => {
        const items = LESSONS.map((L, i) => ({ L, i })).filter(({ L }) => L.track === tr);
        if (!items.length) return null;
        return (
          <section key={tr} className="track">
            <h3 className="track-title">{t.tracks[tr]} <span className="track-n">{items.length}</span></h3>
            <div className="lgrid">{items.map(({ L, i }) => <LessonCard key={L.id} i={i} active={L.id === activeId} />)}</div>
          </section>
        );
      })}
    </div>
  );
}

function ProgressCard() {
  const { s, t } = useLab();
  const P = t.progress;
  const n = streak(s.days);
  const due = dueReviews(s.review).length;
  const counted = LESSONS.filter((L) => L.track !== 'ref');
  const done = counted.filter((L) => s.done.includes(L.id)).length;
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return s.days.includes(today(d));
  });
  return (
    <section className="card progress" aria-label={P.title}>
      <div className="prog-row">
        <div className="prog-streak">
          <span className="prog-big">{n}</span>
          <span>{n ? P.streak(n) : P.noStreak}</span>
        </div>
        <div className="prog-week" aria-label={P.week}>
          {week.map((on, i) => <i key={i} className={on ? 'on' : ''} />)}
        </div>
      </div>
      <div className="prog-bar" aria-hidden="true"><i style={{ width: `${(100 * done) / counted.length}%` }} /></div>
      <div className="prog-row small">
        <span>{P.lessons(done, counted.length)}</span>
        <a href={href({ page: 'practice' })} className={due ? 'due' : ''}>{P.review(due)}</a>
      </div>
      <div className="prog-tracks">
        {TRACKS.filter((tr) => tr !== 'ref').map((tr) => {
          const items = LESSONS.filter((L) => L.track === tr);
          if (!items.length) return null;
          const d = items.filter((L) => s.done.includes(L.id)).length;
          return (
            <span key={tr} className="prog-track" title={t.tracks[tr]}>
              <span className="pt-name">{t.tracks[tr]}</span>
              <span className="pt-dots">{items.map((L) => <i key={L.id} className={s.done.includes(L.id) ? 'on tone-' + L.tone : ''} />)}</span>
              <span className="pt-n">{d}/{items.length}</span>
            </span>
          );
        })}
      </div>
    </section>
  );
}

function Home() {
  const { s, t } = useLab();
  const lastIdx = Math.max(0, LESSONS.findIndex((l) => l.id === s.last));
  return (
    <div className="page home">
      <header className="hero">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="lede">{t.lede}</p>
      </header>
      <ProgressCard />
      <section className="top" aria-label={t.secAria}>
        <div className="circle-wrap"><KeyPanel /></div>
        <KeyCard />
      </section>
      <div className="cta">
        <a className="btn primary" href={href({ page: 'lesson', id: LESSONS[s.last ? lastIdx : 0].id })}>
          {s.last ? `${t.nav.continue}: ${lessonMeta(LESSONS[lastIdx], t, s.lang).title}` : t.nav.start} →
        </a>
        <a className="btn" href={href({ page: 'piano' })}>🎹 {t.nav.piano}</a>
        <a className="btn" href={href({ page: 'practice' })}>✓ {t.nav.practice}</a>
        <a className="btn" href={href({ page: 'history' })}>⌛ {t.history.tab}</a>
      </div>
      <section>
        <h2 className="sec-title">{t.nav.allLessons}</h2>
        <p className="desc">{t.nav.chain}</p>
        <LessonGrid />
      </section>
    </div>
  );
}

function LessonsPage() {
  const { s, t } = useLab();
  let n = 0;
  return (
    <div className="page">
      <h1 className="page-title">{t.nav.journey}</h1>
      <p className="desc">{t.nav.journeyIntro}</p>
      <div className="journey">
        {TRACKS.map((tr) => {
          const items = LESSONS.filter((L) => L.track === tr);
          if (!items.length) return null;
          return (
            <section key={tr} className="j-track">
              <h2 className="j-track-title">{t.tracks[tr]}</h2>
              <ol className="j-path">
                {items.map((L) => {
                  n++;
                  const m = lessonMeta(L, t, s.lang);
                  const done = s.done.includes(L.id);
                  const needs = (L.needs ?? []).map((id) => LESSONS.find((x) => x.id === id)).filter((x): x is (typeof LESSONS)[number] => !!x);
                  return (
                    <li key={L.id} className={'j-stop tone-' + L.tone + (done ? ' done' : '') + (L.id === s.last ? ' current' : '')}>
                      <span className="j-dot" aria-hidden="true">{done ? '✓' : n}</span>
                      <a className="j-card" href={href({ page: 'lesson', id: L.id })}>
                        <span className="j-title">{m.title}</span>
                        <span className="j-hook">{HOOKS[L.id]?.[s.lang] ?? m.teaser}</span>
                        {!!needs.length && (
                          <span className="j-needs">{t.nav.builds}: {needs.map((x) => lessonMeta(x, t, s.lang).nav).join(' · ')}</span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function LessonPage({ id }: { id: string }) {
  const { s, t } = useLab();
  const i = Math.max(0, LESSONS.findIndex((l) => l.id === id));
  const L = LESSONS[i];
  const m = lessonMeta(L, t, s.lang);
  useEffect(() => {
    setState({ last: L.id });
    markStudied();
    window.scrollTo({ top: 0 });
    return () => stopAll();
  }, [L.id]);
  const prev = LESSONS[i - 1];
  const next = LESSONS[i + 1];
  return (
    <article className={'page lesson tone-' + L.tone} key={L.id}>
      <header className="sec-head">
        <p className="eyebrow">{t.nav.lessonN(i + 1)} · {t.tracks[L.track]}</p>
        <h1>{m.title} <span className="sub">· {m.sub}</span></h1>
      </header>
      {periodsForLesson(L.id).length > 0 && (
        <p className="born-in">{t.history.bornIn}: {periodsForLesson(L.id).map((pp) => (
          <a key={pp.id} className="need" href={href({ page: 'history', id: pp.id })}>{pp.name[s.lang]}</a>
        ))}</p>
      )}
      {HOOKS[L.id] && (
        <p className="hook"><span className="rowlab">{t.nav.question}</span><span className="hook-q">{HOOKS[L.id][s.lang]}</span></p>
      )}
      {(!!L.needs?.length || !!L.terms?.length) && (
        <aside className="lesson-intro">
          {!!L.needs?.length && (
            <div className="needs">
              <span className="rowlab">{t.nav.before}</span>
              {L.needs.map((n) => {
                const N = LESSONS.find((x) => x.id === n);
                return N ? <a key={n} className="need" href={href({ page: 'lesson', id: n })}>{lessonMeta(N, t, s.lang).title}</a> : null;
              })}
            </div>
          )}
          {!!L.terms?.length && (
            <details className="terms">
              <summary>{t.nav.terms(L.terms.length)}: {L.terms.map((en) => {
                const g = glossaryEntry(en);
                return g ? (s.lang === 'pt' ? g[2] : g[0]) : en;
              }).join(' · ')}</summary>
              <dl>
                {L.terms.map((en) => {
                  const g = glossaryEntry(en);
                  if (!g) return null;
                  return (
                    <div key={en}>
                      <dt>{s.lang === 'pt' ? g[2] : g[0]} <span className="alt">{s.lang === 'pt' ? g[0] : g[2]}</span></dt>
                      <dd>{s.lang === 'pt' ? g[3] : g[4]}</dd>
                    </div>
                  );
                })}
              </dl>
            </details>
          )}
        </aside>
      )}
      {s.k !== 0 && !s.done.includes(L.id) && !L.keyFree && (
        <p className="start-c">{t.learn.startInC} <button type="button" onClick={() => goToKey(0)}>{t.learn.goC}</button></p>
      )}
      <div className="lesson-body"><L.Comp /></div>
      {L.track !== 'ref' && (
        <button type="button" className={'done-btn' + (s.done.includes(L.id) ? ' on' : '')} aria-pressed={s.done.includes(L.id)} onClick={() => toggleDone(L.id)}>
          {s.done.includes(L.id) ? t.progress.isDone : t.progress.markDone}
        </button>
      )}
      <nav className="pager" aria-label={t.nav.lessons}>
        {prev ? (
          <a className="pg prev" href={href({ page: 'lesson', id: prev.id })}><small>← {t.nav.prev}</small><span>{lessonMeta(prev, t, s.lang).title}</span></a>
        ) : <span />}
        {next ? (
          <a className="pg next" href={href({ page: 'lesson', id: next.id })}><small>{t.nav.next} →</small><span>{lessonMeta(next, t, s.lang).title}</span></a>
        ) : <span />}
      </nav>
    </article>
  );
}

function SimplePage({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  useEffect(() => () => stopAll(), []);
  return (
    <div className="page">
      <header className="sec-head"><h1>{title} <span className="sub">· {sub}</span></h1></header>
      {children}
    </div>
  );
}

const TABS: { r: Route; key: 'home' | 'lessons' | 'piano' | 'practice' | 'history'; ic: string }[] = [
  { r: { page: 'home' }, key: 'home', ic: '◉' },
  { r: { page: 'lessons' }, key: 'lessons', ic: '☰' },
  { r: { page: 'history' }, key: 'history', ic: '⌛' },
  { r: { page: 'piano' }, key: 'piano', ic: '🎹' },
  { r: { page: 'practice' }, key: 'practice', ic: '✓' },
];

function isActive(tab: Route, r: Route) {
  if (tab.page === 'lessons') return r.page === 'lessons' || r.page === 'lesson';
  return tab.page === r.page;
}

export function App() {
  const lab = useLab();
  const { s, t, nm, cur } = lab;
  const route = useRoute();
  const [keyOpen, setKeyOpen] = useState(false);
  const [setOpen, setSetOpen] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = s.lang === 'pt' ? 'pt-BR' : 'en';
    if (s.theme === 'auto') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', s.theme);
    const dark = s.theme === 'dark' || (s.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#2A2580' : '#4F46E5');
  }, [s.lang, s.theme]);

  useEffect(() => {
    const L = route.page === 'lesson' ? LESSONS.find((l) => l.id === route.id) : undefined;
    const title = L ? lessonMeta(L, t, s.lang).title : null;
    document.title = title ? `${title} · ${t.appName}` : t.appName;
  }, [route, t, s.lang]);

  let content;
  if (route.page === 'lesson') content = <LessonPage id={route.id} />;
  else if (route.page === 'lessons') content = <LessonsPage />;
  else if (route.page === 'piano') content = <SimplePage title={t.piano.title} sub={t.piano.sub}><Piano /></SimplePage>;
  else if (route.page === 'history') content = <History id={route.id} />;
  else if (route.page === 'practice') content = <SimplePage title={t.practice.title} sub={t.practice.sub}><Practice /></SimplePage>;
  else content = <Home />;

  const curLesson = route.page === 'lesson' ? route.id : null;

  return (
    <div className="shell">
      <aside className="side" aria-label={t.nav.menu}>
        <a className="brand" href="#/"><Logo /><span>{t.appName}</span></a>
        <nav className="side-nav">
          <a href="#/" aria-current={route.page === 'home' ? 'page' : undefined}>◉ {t.nav.home}</a>
          <a href="#/piano" aria-current={route.page === 'piano' ? 'page' : undefined}>🎹 {t.nav.piano}</a>
          <a href="#/praticar" aria-current={route.page === 'practice' ? 'page' : undefined}>✓ {t.nav.practice}</a>
          <a href="#/historia" aria-current={route.page === 'history' ? 'page' : undefined}>⌛ {t.history.tab}</a>
          {TRACKS.map((tr) => (
            <div key={tr} className="side-track">
              <p className="rowlab">{t.tracks[tr]}</p>
              <ol>
                {LESSONS.map((L, i) => ({ L, i })).filter(({ L }) => L.track === tr).map(({ L, i }) => (
                  <li key={L.id}>
                    <a href={href({ page: 'lesson', id: L.id })} aria-current={curLesson === L.id ? 'page' : undefined}>
                      <span className="side-n">{i + 1}</span>
                      <span className={'dotl tone-' + L.tone} />{lessonMeta(L, t, s.lang).nav}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </nav>
      </aside>

      <div className="main-col">
        <header className="appbar">
          <a className="brand compact" href="#/"><Logo /><span>{t.appName}</span></a>
          <button type="button" className="keychip" onClick={() => setKeyOpen(true)} aria-label={t.keyBar.change}>
            <span className="kc-label">{t.keyBar.key}</span>
            <span className="kc-name">{nm(cur)} {t.major}</span>
            <span className="kc-sig">{sigShort(cur)}</span>
            <span aria-hidden="true">▾</span>
          </button>
          <button type="button" className="icon-btn" onClick={() => setSetOpen(true)} aria-label={t.keyBar.settings}>
            <Flag lang={s.lang} />
            <span className="gear" aria-hidden="true">⚙︎</span>
          </button>
        </header>
        <main className="content">{content}</main>
      </div>

      <nav className="tabs" aria-label={t.nav.menu}>
        {TABS.map((tab) => (
          <a key={tab.key} href={href(tab.r)} aria-current={isActive(tab.r, route) ? 'page' : undefined}>
            <span className="tab-ic" aria-hidden="true">{tab.ic}</span>
            <span className="tab-lb">{tab.key === 'history' ? t.history.tab : t.nav[tab.key]}</span>
          </a>
        ))}
      </nav>

      <Sheet open={keyOpen} onClose={() => setKeyOpen(false)} title={t.keyBar.change} closeLabel={t.keyBar.close}>
        <KeyPanel />
        <div className="sheet-card"><KeyCard /></div>
      </Sheet>
      <Sheet open={setOpen} onClose={() => setSetOpen(false)} title={t.keyBar.settings} closeLabel={t.keyBar.close}>
        <Settings />
      </Sheet>
    </div>
  );
}
