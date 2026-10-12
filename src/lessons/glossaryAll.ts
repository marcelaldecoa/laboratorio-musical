import { GLOSSARY as BASE, type GlossEntry } from '../i18n/glossary';
import { EXTRA } from './extra';
import { BASICS } from './track-basics';

// lessons may introduce the same term; keep the first definition of each
const seen = new Set<string>();
/** Every glossary entry: the prototype's list plus the terms each later lesson brings. */
export const GLOSSARY: GlossEntry[] = [...BASE, ...[...BASICS, ...EXTRA].flatMap((L) => L.text?.glossary ?? [])].filter(([en, , pt]) => {
  const k = (en + '|' + pt).toLowerCase();
  if (seen.has(k) || seen.has(en.toLowerCase()) || seen.has(pt.toLowerCase())) return false;
  seen.add(k).add(en.toLowerCase()).add(pt.toLowerCase());
  return true;
});

export const glossaryEntry = (en: string) => GLOSSARY.find((g) => g[0] === en);
