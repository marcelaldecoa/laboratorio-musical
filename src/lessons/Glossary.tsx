import { useState } from 'react';
import { GLOSSARY as BASE } from '../i18n/glossary';
import { EXTRA } from './extra';

const GLOSSARY = [...BASE, ...EXTRA.flatMap((L) => L.text?.glossary ?? [])];
import { useLab } from '../state/useLab';

export function Glossary() {
  const { s, t } = useLab();
  const [q, setQ] = useState('');
  const norm = (x: string) => x.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const nq = norm(q.trim());
  const items = GLOSSARY.filter((g) => !nq || norm((s.lang === 'pt' ? [g[2], g[3], g[0]] : [g[0], g[1], g[4], g[2]]).join(' ')).includes(nq));
  return (
    <>
      <div className="gloss-tools">
        <input type="search" value={q} placeholder={t.search} onChange={(e) => setQ(e.target.value)} aria-label={t.search} />
        <span className="gcount">{t.count(items.length, GLOSSARY.length)}</span>
      </div>
      {items.length ? (
        <dl className="gloss">
          {items.map(([en, alt, pt, dpt, den]) => {
            const sym = /^[♯♭♮]$/.test(alt) ? alt : '';
            return (
              <div className="gi" key={en}>
                <dt>
                  {s.lang === 'pt' ? pt : en}
                  {s.lang === 'pt' ? sym && <span className="alt">{sym}</span> : alt && <span className="alt">{alt}</span>}
                  <span className="alt other">{s.lang === 'pt' ? en : pt}</span>
                </dt>
                <dd>{s.lang === 'pt' ? dpt : den}</dd>
              </div>
            );
          })}
        </dl>
      ) : (
        <p className="empty">{t.empty}</p>
      )}
      <p className="foot">{t.footer}</p>
    </>
  );
}
