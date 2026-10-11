import { type ChordTone, type SymbolStyle, letterName, majorSize, noteAt } from './chords7';
import { type Note, pcOf, sameNote } from './note';

/** A chord read from a symbol: root, tones (interval number + half steps) and an optional slash bass. */
export interface ParsedChord {
  root: Note;
  tones: ChordTone[];
  bass: Note | null;
}

/* ---------- notes ---------- */

const SOLFEGE: [RegExp, number][] = [
  [/^sol/i, 4], [/^d[oó]/i, 0], [/^r[eé]/i, 1], [/^mi/i, 2], [/^f[aá]/i, 3], [/^l[aá]/i, 5], [/^si/i, 6],
];
const LETTER = 'CDEFGAB';

/** Reads a note name (letter A–G, or Dó Ré Mi … when `solfege`) plus accidentals at the start of `s`. */
function readNote(s: string, solfege: boolean): { note: Note; len: number } | null {
  let letter = -1;
  let len = 0;
  if (solfege) {
    for (const [re, l] of SOLFEGE) {
      const m = re.exec(s);
      if (m) { letter = l; len = m[0].length; break; }
    }
  } else {
    const i = LETTER.indexOf(s.charAt(0).toUpperCase());
    if (i >= 0) { letter = i; len = 1; }
  }
  if (letter < 0) return null;
  const am = /^(##|#|bb|b)/.exec(s.slice(len));
  let acc = 0;
  if (am) {
    acc = am[1] === '##' ? 2 : am[1] === '#' ? 1 : am[1] === 'bb' ? -2 : -1;
    len += am[1].length;
  }
  return { note: { letter, acc }, len };
}

/** Unicode and keyboard variants mapped to plain ASCII tokens. */
function normalize(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, '')
    .replace(/♯/g, '#')
    .replace(/♭/g, 'b')
    .replace(/𝄪/g, '##')
    .replace(/𝄫/g, 'bb')
    .replace(/Δ|∆/g, '^')
    .replace(/[º˚]/g, '°')
    .replace(/[Øø]/g, 'ø')
    .replace(/[–−]/g, '-');
}

/* ---------- quality ---------- */

interface Q {
  third: 'M' | 'm' | 'sus2' | 'sus4' | 'none';
  fifth: number;
  seventh: number | null;
  six: boolean;
  tens: Map<number, number>;
}

/** Natural extensions implied by a plain 9, 11 or 13 after a seventh (13 skips the 11 over a major 3rd). */
function implied(q: Q, n: number) {
  if (n >= 9) q.tens.set(9, 14);
  if (n === 11 || (n === 13 && q.third === 'm')) q.tens.set(11, 17);
  if (n === 13) q.tens.set(13, 21);
}

function alter(q: Q, sign: string, num: number) {
  const d = sign === '#' ? 1 : sign === 'b' ? -1 : 0;
  if (num === 5) q.fifth = 7 + d;
  else q.tens.set(num, majorSize(num) + d);
}

/** One item inside parentheses: C7(9), Am7(b5), Cm(7M), C(add9), F7(b9,13). */
function groupItem(q: Q, it: string): boolean {
  let m: RegExpExecArray | null;
  if ((m = /^([b#]?)(5|9|11|13)$/.exec(it))) { alter(q, m[1], Number(m[2])); return true; }
  if (/^(7M|maj7|M7|\^7?)$/.test(it)) { q.seventh = 11; return true; }
  if (it === '7') { q.seventh = 10; return true; }
  if ((m = /^add(2|9|4|11|13)$/.exec(it))) { addTone(q, Number(m[1])); return true; }
  if ((m = /^sus([24])?$/.exec(it))) { q.third = m[1] === '2' ? 'sus2' : 'sus4'; return true; }
  if (it === '6') { q.six = true; return true; }
  return false;
}

function addTone(q: Q, n: number) {
  const num = n === 2 ? 9 : n === 4 ? 11 : n;
  q.tens.set(num, majorSize(num));
}

function parseQuality(s: string): Q | null {
  const q: Q = { third: 'M', fifth: 7, seventh: null, six: false, tens: new Map() };
  let i = 0;
  let m: RegExpExecArray | null;
  const at = (re: RegExp) => {
    const r = re.exec(s.slice(i));
    if (r) i += r[0].length;
    return r;
  };
  while (i < s.length) {
    const start = i === 0;
    if (s[i] === '(') {
      const close = s.indexOf(')', i);
      if (close < 0) return null;
      const items = s.slice(i + 1, close).split(/[,/]/).filter(Boolean);
      if (!items.length || !items.every((it) => groupItem(q, it))) return null;
      i = close + 1;
    } else if ((m = at(/^(maj|M|\^)(7|9|11|13)?/))) {
      if (m[2]) { q.seventh = 11; implied(q, Number(m[2])); }
      else if (m[1] === '^') q.seventh = 11;
    } else if (at(/^7M/)) q.seventh = 11;
    else if (start && at(/^(min|mi|m|-)/)) q.third = 'm';
    else if ((m = at(/^(dim|°|o)(7)?/))) { q.third = 'm'; q.fifth = 6; if (m[2]) q.seventh = 9; }
    else if ((m = at(/^ø(7)?/))) { q.third = 'm'; q.fifth = 6; q.seventh = 10; }
    else if (at(/^(aug|\+)/)) q.fifth = 8;
    else if ((m = at(/^sus([24])?/))) q.third = m[1] === '2' ? 'sus2' : 'sus4';
    else if ((m = at(/^add(2|9|4|11|13)/))) addTone(q, Number(m[1]));
    else if ((m = at(/^([b#])(5|9|11|13)/))) alter(q, m[1], Number(m[2]));
    else if (at(/^(6\/9|69)/)) { q.six = true; q.tens.set(9, 14); }
    else if (at(/^6/)) q.six = true;
    else if (at(/^7/)) q.seventh = q.seventh ?? 10;
    else if ((m = at(/^(13|11|9)/))) {
      if (q.seventh == null && !q.six) q.seventh = 10;
      implied(q, Number(m[1]));
    } else if (start && s === '5') { q.third = 'none'; i = 1; }
    else return null;
  }
  return q;
}

function tonesOf(q: Q): ChordTone[] {
  const out: ChordTone[] = [{ num: 1, semis: 0 }];
  if (q.third === 'M') out.push({ num: 3, semis: 4 });
  else if (q.third === 'm') out.push({ num: 3, semis: 3 });
  else if (q.third === 'sus2') out.push({ num: 2, semis: 2 });
  else if (q.third === 'sus4') out.push({ num: 4, semis: 5 });
  out.push({ num: 5, semis: q.fifth });
  if (q.six) out.push({ num: 6, semis: 9 });
  if (q.seventh != null) out.push({ num: 7, semis: q.seventh });
  [...q.tens.entries()].sort((a, b) => a[0] - b[0]).forEach(([num, semis]) => out.push({ num, semis }));
  return out.sort((a, b) => a.num - b.num);
}

const sane = (n: Note) => Math.abs(n.acc) <= 2;

/** Splits off a slash bass at the top level (not inside parentheses, not 6/9). */
function splitBass(s: string, solfege: boolean): { body: string; bass: Note | null } | null {
  let depth = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const c = s[i];
    if (c === ')') depth++;
    else if (c === '(') depth--;
    else if (c === '/' && depth === 0) {
      const tail = s.slice(i + 1);
      const r = readNote(tail, solfege) ?? readNote(tail, !solfege);
      if (r && r.len === tail.length) return { body: s.slice(0, i), bass: r.note };
      if (/^\d/.test(tail)) return { body: s, bass: null };
      return null;
    }
  }
  return { body: s, bass: null };
}

/**
 * Reads a chord symbol: C, Cm, C7, C7M / Cmaj7 / CΔ, Cm7, Cm7(b5) / Cø, C°7 / Cdim7, Csus4, C6, C6/9,
 * C9, Cadd9, C7(b9,13), F#m7, Bb7M, G/B … Note names may be letters (A–G) or Dó Ré Mi; ♯/#, ♭/b both work.
 */
export function parseChord(input: string): ParsedChord | null {
  const s = normalize(input);
  if (!s) return null;
  for (const solfege of [true, false]) {
    const r = readNote(s, solfege);
    if (!r) continue;
    const sp = splitBass(s.slice(r.len), solfege);
    if (!sp) continue;
    const q = parseQuality(sp.body);
    if (!q) continue;
    const c: ParsedChord = { root: r.note, tones: tonesOf(q), bass: sp.bass };
    if (!sane(c.root) || (c.bass && !sane(c.bass)) || !chordNotes(c).every(sane)) return null;
    return c;
  }
  return null;
}

/** The chord's notes spelled by letter, in stacking order (root, 3rd, 5th, 7th, 9th …). */
export const chordNotes = (c: ParsedChord): Note[] => c.tones.map((t) => noteAt(c.root, t.num, t.semis));

/** Same root, bass and tones. */
export function sameChord(a: ParsedChord, b: ParsedChord): boolean {
  if (!sameNote(a.root, b.root)) return false;
  if (!!a.bass !== !!b.bass || (a.bass && b.bass && !sameNote(a.bass, b.bass))) return false;
  const k = (c: ParsedChord) => c.tones.map((t) => t.num + ':' + t.semis).join(' ');
  return k(a) === k(b);
}

/* ---------- writing symbols ---------- */

const accLabel = (t: ChordTone) => {
  const d = t.semis - majorSize(t.num);
  return (d < 0 ? '♭' : d > 0 ? '♯' : '') + t.num;
};

/** Writes a chord symbol in Brazilian style (C7M, Bm7(♭5), C7(9)) or English style (Cmaj7, Bm7♭5, C9). */
export function formatChord(c: ParsedChord, style: SymbolStyle): string {
  const get = (n: number) => c.tones.find((t) => t.num === n)?.semis;
  const t3 = get(3), t2 = get(2), t4 = get(4), t5 = get(5), t6 = get(6), t7 = get(7);
  const tens = c.tones.filter((t) => t.num >= 9);
  const minor = t3 === 3;
  let body = '';
  const alts: ChordTone[] = [];
  let fifthDone = false;

  if (t3 == null && t2 == null && t4 == null) {
    body = '5';
    fifthDone = true;
  } else if (minor && t5 === 6 && t7 === 9 && t6 == null) {
    body = '°7';
    fifthDone = true;
  } else if (minor && t5 === 6 && t7 == null && t6 == null) {
    body = '°';
    fifthDone = true;
  } else if (t3 === 4 && t5 === 8 && t7 == null && t6 == null) {
    body = '+';
    fifthDone = true;
  } else {
    if (minor) body = 'm';
    if (t6 != null) body += '6';
    if (t7 === 10) body += '7';
    if (t7 === 11) {
      if (minor) body += style === 'pt' ? '(7M)' : '(maj7)';
      else body += style === 'pt' ? '7M' : 'maj7';
    }
  }
  if (!fifthDone && t5 != null && t5 !== 7) alts.push({ num: 5, semis: t5 });

  // natural extensions collapse into the number in English (C9, Cmaj9, Cm11, C13)
  const nat = tens.filter((t) => t.semis === majorSize(t.num)).map((t) => t.num).join(',');
  const canCollapse = style === 'en' && (t7 === 10 || (t7 === 11 && !minor)) && t6 == null && body !== '°7' &&
    (nat === '9' || nat === '9,11' || (nat === '9,13' && !minor) || (nat === '9,11,13' && minor));
  if (canCollapse) {
    const top = nat.split(',').pop()!;
    body = body.replace(/7$/, top).replace(/maj7$/, 'maj' + top);
    tens.filter((t) => t.semis !== majorSize(t.num)).forEach((t) => alts.push(t));
  } else if (t7 == null && t6 == null) {
    tens.forEach((t) => (t.semis === majorSize(t.num) ? (body += 'add' + t.num) : alts.push(t)));
  } else if (style === 'en' && t6 != null && t7 == null && nat === '9' && tens.length === 1) {
    body += '/9';
  } else tens.forEach((t) => alts.push(t));

  let sus = '';
  if (t2 != null) sus = 'sus2';
  if (t4 != null) sus = 'sus4';

  let out = letterName(c.root) + body;
  // sus goes after the seventh, before the extensions in parentheses
  out += sus;
  if (alts.length) {
    const list = alts.map(accLabel);
    if (style === 'en' && /\d$/.test(out) && alts.every((a) => a.semis !== majorSize(a.num))) out += list.join('');
    else out += '(' + list.join(',') + ')';
  }
  if (c.bass) out += '/' + letterName(c.bass);
  return out;
}

/** Chord built from a root and a spelled bass, e.g. the V with its 3rd in the bass (G/B). */
export const withBass = (c: ParsedChord, bass: Note | null): ParsedChord => ({ ...c, bass });

/** Pitch-class helper for sound. */
export const chordPcs = (c: ParsedChord) => c.tones.map((t) => pcOf(c.root) + t.semis);
