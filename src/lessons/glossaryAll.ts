import { GLOSSARY as BASE, type GlossEntry } from '../i18n/glossary';
import { EXTRA } from './extra';
import { BASICS } from './track-basics';

// lessons may introduce the same term; keep the first definition of each (compared per language)
const seenEn = new Set<string>();
const seenPt = new Set<string>();
/** Every glossary entry: the prototype's list plus the terms each later lesson brings. */
export const GLOSSARY: GlossEntry[] = [...BASE, ...[...BASICS, ...EXTRA].flatMap((L) => L.text?.glossary ?? [])].filter(([en, , pt]) => {
  const e = en.toLowerCase();
  const p = pt.toLowerCase();
  if (seenEn.has(e) || seenPt.has(p)) return false;
  seenEn.add(e);
  seenPt.add(p);
  return true;
});

export const glossaryEntry = (en: string) => GLOSSARY.find((g) => g[0] === en);
