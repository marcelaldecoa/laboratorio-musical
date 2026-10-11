import { useSyncExternalStore } from 'react';

export type Route =
  | { page: 'home' }
  | { page: 'lessons' }
  | { page: 'lesson'; id: string }
  | { page: 'piano' }
  | { page: 'practice' };

function parse(hash: string): Route {
  const h = hash.replace(/^#\/?/, '');
  const [a, b] = h.split('/');
  if (a === 'aula' && b) return { page: 'lesson', id: b };
  if (a === 'aulas') return { page: 'lessons' };
  if (a === 'piano') return { page: 'piano' };
  if (a === 'praticar') return { page: 'practice' };
  return { page: 'home' };
}

export const href = (r: Route) =>
  r.page === 'lesson' ? `#/aula/${r.id}` : r.page === 'lessons' ? '#/aulas' : r.page === 'piano' ? '#/piano' : r.page === 'practice' ? '#/praticar' : '#/';

let current = typeof window === 'undefined' ? ({ page: 'home' } as Route) : parse(window.location.hash);
const ls = new Set<() => void>();
if (typeof window !== 'undefined')
  window.addEventListener('hashchange', () => {
    current = parse(window.location.hash);
    ls.forEach((l) => l());
  });

export function useRoute() {
  return useSyncExternalStore(
    (l) => {
      ls.add(l);
      return () => ls.delete(l);
    },
    () => current,
    () => current,
  );
}
