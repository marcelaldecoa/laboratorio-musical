import { describe, expect, it } from 'vitest';
import { SEVENTH_QUALITIES, SEVENTH_SEMIS, diatonicSeventhInfo, letterName, seventhSuffix } from './chords7';
import { FS, GB, SLOTS } from './fifths';
import type { Note } from './note';
import { majorScale } from './scale';
import { chordNotes, formatChord, parseChord, sameChord } from './symbol';

const KEYS: Note[] = [...SLOTS.filter((n): n is Note => !!n), FS, GB];
const spell = (sym: string) => {
  const c = parseChord(sym);
  if (!c) throw new Error('no parse: ' + sym);
  return chordNotes(c).map(letterName).join(' ');
};
const tones = (sym: string) => parseChord(sym)!.tones.map((t) => t.num + ':' + t.semis).join(' ');

describe('parseChord: spelling', () => {
  it.each([
    ['C', 'C E G'],
    ['Cm', 'C E♭ G'],
    ['F#m7', 'F♯ A C♯ E'],
    ['F♯7', 'F♯ A♯ C♯ E'],
    ['Bb7M', 'B♭ D F A'],
    ['Gb7M', 'G♭ B♭ D♭ F'],
    ['Gbmaj7', 'G♭ B♭ D♭ F'],
    ['GbΔ', 'G♭ B♭ D♭ F'],
    ['Am7(b5)', 'A C E♭ G'],
    ['Bø', 'B D F A'],
    ['Bm7♭5', 'B D F A'],
    ['G#°7', 'G♯ B D F'],
    ['G#dim7', 'G♯ B D F'],
    ['Bº', 'B D F'],
    ['C+', 'C E G♯'],
    ['Caug', 'C E G♯'],
    ['Dsus4', 'D G A'],
    ['Dsus2', 'D E A'],
    ['C6', 'C E G A'],
    ['Am6', 'A C E F♯'],
    ['C9', 'C E G B♭ D'],
    ['Cadd9', 'C E G D'],
    ['C(9)', 'C E G D'],
    ['C7M(9)', 'C E G B D'],
    ['Cmaj9', 'C E G B D'],
    ['Dm11', 'D F A C E G'],
    ['G13', 'G B D F A E'],
    ['G7(b9)', 'G B D F A♭'],
    ['G7#9', 'G B D F A♯'],
    ['C7M(#11)', 'C E G B F♯'],
    ['C6/9', 'C E G A D'],
    ['Cm(7M)', 'C E♭ G B'],
    ['CmM7', 'C E♭ G B'],
    ['C-7', 'C E♭ G B♭'],
    ['Cmin7', 'C E♭ G B♭'],
    ['C7sus4', 'C F G B♭'],
    ['C5', 'C G'],
    ['E#7', 'E♯ G𝄪 B♯ D♯'],
    ['Dó7M', 'C E G B'],
    ['Sib7', 'B♭ D F A♭'],
    ['Ré#m', 'D♯ F♯ A♯'],
    ['Do7', 'C E G B♭'],
    ['Fa', 'F A C'],
    ['Fadd9', 'F A C G'],
  ])('%s = %s', (sym, notes) => expect(spell(sym)).toBe(notes));

  it('slash chords keep the bass', () => {
    const c = parseChord('G/B')!;
    expect(letterName(c.bass!)).toBe('B');
    expect(spell('G/B')).toBe('G B D');
    expect(letterName(parseChord('C/E')!.bass!)).toBe('E');
    expect(letterName(parseChord('Am7/G')!.bass!)).toBe('G');
    expect(letterName(parseChord('D/F#')!.bass!)).toBe('F♯');
    expect(letterName(parseChord('Dó/Mi')!.bass!)).toBe('E');
    expect(parseChord('C6/9')!.bass).toBeNull();
  });

  it('rejects nonsense', () => {
    for (const s of ['', 'H7', 'Cxyz', 'C7(', 'C/', 'C/Q', '7', 'Cmm'])
      expect(parseChord(s)).toBeNull();
  });

  it('equivalent spellings mean the same chord', () => {
    expect(tones('C7M')).toBe(tones('Cmaj7'));
    expect(tones('C7M')).toBe(tones('CΔ'));
    expect(tones('CM7')).toBe(tones('CΔ7'));
    expect(tones('Cm7(b5)')).toBe(tones('Cø'));
    expect(tones('Cm7(b5)')).toBe(tones('Cø7'));
    expect(tones('C°7')).toBe(tones('Cdim7'));
    expect(tones('Cm7')).toBe(tones('C-7'));
    expect(tones('Cm7')).toBe(tones('Cmin7'));
    expect(tones('Cadd9')).toBe(tones('C(9)'));
    expect(tones('C7(9)')).toBe(tones('C9'));
    expect(tones('Cm7(9)')).toBe(tones('Cm9'));
  });
});

describe('formatChord', () => {
  it('Brazilian and English styles', () => {
    const f = (s: string, st: 'pt' | 'en') => formatChord(parseChord(s)!, st);
    expect(f('Cmaj7', 'pt')).toBe('C7M');
    expect(f('C7M', 'en')).toBe('Cmaj7');
    expect(f('Bø', 'pt')).toBe('Bm7(♭5)');
    expect(f('Bø', 'en')).toBe('Bm7♭5');
    expect(f('F#m7', 'pt')).toBe('F♯m7');
    expect(f('Bbdim7', 'en')).toBe('B♭°7');
    expect(f('C9', 'pt')).toBe('C7(9)');
    expect(f('C7(9)', 'en')).toBe('C9');
    expect(f('C7M(9)', 'en')).toBe('Cmaj9');
    expect(f('Dm11', 'pt')).toBe('Dm7(9,11)');
    expect(f('G13', 'en')).toBe('G13');
    expect(f('G7(b9)', 'en')).toBe('G7♭9');
    expect(f('G7(b9)', 'pt')).toBe('G7(♭9)');
    expect(f('C9#11', 'en')).toBe('C9♯11');
    expect(f('C6/9', 'pt')).toBe('C6(9)');
    expect(f('C6(9)', 'en')).toBe('C6/9');
    expect(f('Cadd9', 'pt')).toBe('Cadd9');
    expect(f('G/B', 'pt')).toBe('G/B');
    expect(f('Am7/G', 'en')).toBe('Am7/G');
    expect(f('Cm(maj7)', 'pt')).toBe('Cm(7M)');
    expect(f('C7sus4', 'en')).toBe('C7sus4');
    expect(f('C+', 'en')).toBe('C+');
    expect(f('C7(#5)', 'en')).toBe('C7♯5');
    expect(f('C(b5)', 'en')).toBe('C(♭5)');
  });

  const SUFFIXES = [
    '', 'm', '°', '+', 'sus2', 'sus4', '5', '6', 'm6', '6/9', '7', '7M', 'maj7', 'm7', 'm7(b5)', '°7', 'm(7M)', '7sus4',
    'add9', 'madd9', '9', 'maj9', 'm9', '11', 'm11', '13', 'maj13', 'm13', '7(b9)', '7(#9)', '7(#11)', '7(b13)',
    '7M(#11)', '7(9,13)', '7(b9,b13)', '7(#5)', '7(b5)', '9(#11)', '7M(9,#11)', 'm7(9,11)', 'add11', '(b5)',
  ];
  it('round-trips every suffix on all 12 roots (×2 for F♯/G♭), in both styles', () => {
    let n = 0;
    for (const k of KEYS)
      for (const suf of SUFFIXES)
        for (const bass of ['', '/' + letterName(majorScale(k)[2])]) {
          const sym = letterName(k) + suf + bass;
          const c = parseChord(sym);
          expect(c, sym).not.toBeNull();
          for (const st of ['pt', 'en'] as const) {
            const out = formatChord(c!, st);
            const back = parseChord(out);
            expect(back, `${sym} → ${out}`).not.toBeNull();
            expect(sameChord(c!, back!), `${sym} → ${out}`).toBe(true);
            // canonical form is stable
            expect(formatChord(back!, st)).toBe(out);
            n++;
          }
        }
    expect(n).toBeGreaterThan(1000);
  });

  it('the diatonic seventh chords of every key read back with the same notes', () => {
    for (const k of KEYS) {
      const sc = majorScale(k);
      for (let d = 0; d < 7; d++) {
        const info = diatonicSeventhInfo(sc, d);
        for (const st of ['pt', 'en'] as const) {
          const sym = letterName(info.notes[0]) + seventhSuffix(info.quality, st);
          expect(chordNotes(parseChord(sym)!)).toEqual(info.notes);
          expect(formatChord(parseChord(sym)!, st)).toBe(sym);
        }
      }
    }
  });

  it('every seventh quality suffix parses to its half steps', () => {
    for (const q of SEVENTH_QUALITIES)
      for (const st of ['pt', 'en'] as const)
        expect(parseChord('C' + seventhSuffix(q, st))!.tones.map((t) => t.semis)).toEqual(SEVENTH_SEMIS[q]);
  });
});
