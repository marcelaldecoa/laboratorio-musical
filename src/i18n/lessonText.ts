import { useStore } from '../state/store';
import type { GlossEntry } from './glossary';

/** Title data every lesson needs for menus, cards and the page header. */
export interface LessonMeta {
  /** short label for the side menu */
  nav: string;
  title: string;
  sub: string;
  /** one line for the lesson card */
  teaser: string;
}

/**
 * Texts for one lesson, in both languages. The English object must have the same
 * shape as the Portuguese one (use `satisfies LessonText<typeof pt>` or type `en` as `typeof pt`).
 */
export interface LessonText<T extends { meta: LessonMeta }> {
  pt: T;
  en: T;
  /** glossary entries this lesson introduces: [EN term, EN alt, PT term, PT definition, EN definition] */
  glossary?: GlossEntry[];
}

/** Picks the lesson text for the current language. */
export function useLessonText<T extends { meta: LessonMeta }>(text: LessonText<T>): T {
  const lang = useStore((s) => s.lang);
  return text[lang];
}
