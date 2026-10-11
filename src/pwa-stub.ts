/** Used by the single-file build (no service worker available). */
export function registerSW(_opts?: unknown) {
  return () => Promise.resolve();
}
