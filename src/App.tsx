import { useEffect, useState } from 'react';
import { stopAll, useSoundStatus } from './audio/audio';
import { CircleOfFifths } from './components/CircleOfFifths';
import { KeyCard } from './components/KeyCard';
import { KeyControls } from './components/KeyControls';
import { Sheet } from './components/Sheet';
import { Seg } from './components/ui';
import { DICTS } from './i18n';
import { LESSONS } from './lessons';
import { Piano } from './pages/Piano';
import { Practice } from './pages/Practice';
import { href, useRoute, type Route } from './router';
import { setLang, setState } from './state/store';
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
      <rect width="64" height="64" rx="14" fill="var(--accent)" />
      <circle cx="32" cy="32" r="19" fill="none" stroke="var(--on-accent)" strokeWidth="2.5" opacity=".55" />
      {Array.from({ length: 12 }, (_, k) => {
        const a = ((-90 + 30 * k) * Math.PI) / 180;
        return <circle key={k} cx={32 + 19 * Math.cos(a)} cy={32 + 19 * Math.sin(a)} r={k === 0 ? 5 : 2.6} fill="var(--on-accent)" />;
      })}
      <text x="32" y="38" textAnchor="middle" style={{ font: '400 17px var(--f-music)', fill: 'var(--on-accent)' }}>♪</text>
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
  const { t } = useLab();
  const L = LESSONS[i];
  const m = t.lessons[L.id];
  return (
    <a className={'lcard tone-' + L.tone + (active ? ' active' : '')} href={href({ page: 'lesson', id: L.id })}>
      <span className="lnum">{i + 1}</span>
      <span className="licon" aria-hidden="true">{L.icon}</span>
      <span className="ltitle">{m.title}</span>
      <span className="lteaser">{m.teaser}</span>
    </a>
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
      <section className="top" aria-label={t.secAria}>
        <div className="circle-wrap"><KeyPanel /></div>
        <KeyCard />
      </section>
      <div className="cta">
        <a className="btn primary" href={href({ page: 'lesson', id: LESSONS[s.last ? lastIdx : 0].id })}>
          {s.last ? `${t.nav.continue}: ${t.lessons[LESSONS[lastIdx].id].title}` : t.nav.start} →
        </a>
        <a className="btn" href={href({ page: 'piano' })}>🎹 {t.nav.piano}</a>
        <a className="btn" href={href({ page: 'practice' })}>✓ {t.nav.practice}</a>
      </div>
      <section>
        <h2 className="sec-title">{t.nav.allLessons}</h2>
        <p className="desc">{t.nav.chain}</p>
        <div className="lgrid">{LESSONS.map((_, i) => <LessonCard key={i} i={i} />)}</div>
      </section>
    </div>
  );
}

function LessonsPage() {
  const { s, t } = useLab();
  return (
    <div className="page">
      <h1 className="page-title">{t.nav.lessons}</h1>
      <p className="desc">{t.nav.chain}</p>
      <div className="lgrid">{LESSONS.map((L, i) => <LessonCard key={i} i={i} active={L.id === s.last} />)}</div>
    </div>
  );
}

function LessonPage({ id }: { id: string }) {
  const { t } = useLab();
  const i = Math.max(0, LESSONS.findIndex((l) => l.id === id));
  const L = LESSONS[i];
  const m = t.lessons[L.id];
  useEffect(() => {
    setState({ last: L.id });
    window.scrollTo({ top: 0 });
    return () => stopAll();
  }, [L.id]);
  const prev = LESSONS[i - 1];
  const next = LESSONS[i + 1];
  return (
    <article className={'page lesson tone-' + L.tone} key={L.id}>
      <header className="sec-head">
        <p className="eyebrow">{t.nav.lessonN(i + 1)} · {LESSONS.length}</p>
        <h1>{m.title} <span className="sub">· {m.sub}</span></h1>
      </header>
      <div className="lesson-body"><L.Comp /></div>
      <nav className="pager" aria-label={t.nav.lessons}>
        {prev ? (
          <a className="pg prev" href={href({ page: 'lesson', id: prev.id })}><small>← {t.nav.prev}</small><span>{t.lessons[prev.id].title}</span></a>
        ) : <span />}
        {next ? (
          <a className="pg next" href={href({ page: 'lesson', id: next.id })}><small>{t.nav.next} →</small><span>{t.lessons[next.id].title}</span></a>
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

const TABS: { r: Route; key: 'home' | 'lessons' | 'piano' | 'practice' | 'glossary'; ic: string }[] = [
  { r: { page: 'home' }, key: 'home', ic: '◉' },
  { r: { page: 'lessons' }, key: 'lessons', ic: '☰' },
  { r: { page: 'piano' }, key: 'piano', ic: '🎹' },
  { r: { page: 'practice' }, key: 'practice', ic: '✓' },
  { r: { page: 'lesson', id: 'gloss' }, key: 'glossary', ic: 'Aa' },
];

function isActive(tab: Route, r: Route) {
  if (tab.page === 'lesson') return r.page === 'lesson' && r.id === 'gloss';
  if (tab.page === 'lessons') return r.page === 'lessons' || (r.page === 'lesson' && r.id !== 'gloss');
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
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111513' : '#F4F5F2');
  }, [s.lang, s.theme]);

  useEffect(() => {
    const title = route.page === 'lesson' ? t.lessons[route.id as keyof typeof t.lessons]?.title : null;
    document.title = title ? `${title} · ${t.appName}` : t.appName;
  }, [route, t]);

  let content;
  if (route.page === 'lesson') content = <LessonPage id={route.id} />;
  else if (route.page === 'lessons') content = <LessonsPage />;
  else if (route.page === 'piano') content = <SimplePage title={t.piano.title} sub={t.piano.sub}><Piano /></SimplePage>;
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
          <p className="rowlab">{t.nav.lessons}</p>
          <ol>
            {LESSONS.map((L) => (
              <li key={L.id}>
                <a href={href({ page: 'lesson', id: L.id })} aria-current={curLesson === L.id ? 'page' : undefined}>
                  <span className={'dotl tone-' + L.tone} />{t.lessons[L.id].nav}
                </a>
              </li>
            ))}
          </ol>
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
            <span className="tab-lb">{t.nav[tab.key]}</span>
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
