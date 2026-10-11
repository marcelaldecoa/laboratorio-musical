import type { Dict, Lang } from '../i18n';
import type { LessonMeta } from '../i18n/lessonText';
import type { LessonDef } from './index';

export function lessonMeta(L: LessonDef, t: Dict, lang: Lang): LessonMeta {
  return L.text ? L.text[lang].meta : (t.lessons as Record<string, LessonMeta>)[L.id];
}
