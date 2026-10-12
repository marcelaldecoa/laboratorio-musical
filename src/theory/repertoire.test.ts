import { describe, expect, it } from 'vitest';
import {
  BACH, ELISE, MINUET, ODE, type Piece, chordNotes, chordSymbol, classify, harmAt, nt, odePiece, pn, semi, timeline, toneNumber, voice,
} from './repertoire';

const PIECES: Piece[] = [BACH, MINUET, ODE, odePiece(false), ELISE];
const names = (p: Piece) => p.id;

describe('parsing', () => {
  it('reads pitches with accidentals and octaves', () => {
    expect(pn('F#4')).toEqual({ letter: 3, acc: 1, oct: 4 });
    expect(semi(pn('C4'))).toBe(0);
    expect(semi(pn('A2'))).toBe(-15);
    expect(semi(pn('D#5'))).toBe(15);
  });
  it('lays out a voice in time', () => {
    const v = voice('E4q. D4e D4h', 'R');
    expect(v.map((e) => [e.at, e.d])).toEqual([[0, 1.5], [1.5, 0.5], [2, 2]]);
    expect(voice('F#4q~', 'R')[0].tie).toBe(true);
  });
});

describe.each(PIECES.map((p) => [names(p), p] as const))('%s: durations', (_, p) => {
  it('every hand fills each bar exactly (notes + rests), nothing spills over', () => {
    p.bars.forEach((b, bi) => {
      for (const h of ['R', 'L'] as const) {
        const ev = b.ev.filter((e) => e.h === h);
        expect(ev.length, `bar ${bi} ${h}`).toBeGreaterThan(0);
        // union of intervals covers [0, beats]
        const iv = ev.map((e) => [e.at, e.at + e.d]).sort((x, y) => x[0] - y[0]);
        let reach = 0;
        for (const [a, z] of iv) {
          expect(a, `gap in bar ${bi} ${h}`).toBeLessThanOrEqual(reach + 1e-9);
          reach = Math.max(reach, z);
        }
        expect(reach, `bar ${bi} ${h}`).toBeCloseTo(b.beats, 9);
      }
    });
  });
  it('harmony spans tile the bar (or the bar has none)', () => {
    p.bars.forEach((b) => {
      if (!b.harm.length) return;
      expect(b.harm.reduce((t, h) => t + h.d, 0)).toBeCloseTo(b.beats, 9);
    });
  });
  it('only the first bar may be a pickup; full bars share one length', () => {
    const full = p.bars.filter((b) => !b.pickup).map((b) => b.beats);
    expect(new Set(full).size).toBe(1);
    p.bars.slice(1).forEach((b) => expect(b.pickup).toBeFalsy());
  });
});

describe.each(PIECES.map((p) => [names(p), p] as const))('%s: harmony', (_, p) => {
  it('every left-hand note belongs to the chord stated for it', () => {
    p.bars.forEach((b, bi) =>
      b.ev.filter((e) => e.h === 'L' && e.p).forEach((e) => {
        const h = harmAt(b, e.at);
        expect(h, `bar ${bi}`).not.toBeNull();
        expect(toneNumber(h!, e.p!), `bar ${bi} LH ${JSON.stringify(e.p)}`).not.toBeNull();
      }),
    );
  });
  it('an inverted chord has its stated bass as the lowest note', () => {
    p.bars.forEach((b, bi) =>
      b.harm.filter((h) => h.bass).forEach((h) => {
        const low = b.ev.filter((e) => e.p && e.at >= h.at && e.at < h.at + h.d).map((e) => e.p!).sort((x, y) => semi(x) - semi(y))[0];
        expect([low.letter, low.acc], `bar ${bi}`).toEqual([h.bass!.letter, h.bass!.acc]);
      }),
    );
  });
  it('right-hand notes on the downbeat are chord tones; the others are explained (passing, neighbor, …)', () => {
    const roles = classify(p, 'R');
    p.bars.forEach((b, bi) =>
      b.ev.forEach((e, i) => {
        const r = roles.get(bi + ':' + i);
        if (!r) return;
        expect(r, `bar ${bi} note ${i}`).not.toBe('other');
        if (!b.pickup && e.at === 0) expect(r, `bar ${bi} downbeat`).toBe('ct');
      }),
    );
  });
});

describe('Bach, Prelude in C: the facts the lesson states', () => {
  it('every note of bars 1–11 is a chord tone (pure arpeggios)', () => {
    const roles = classify(BACH, 'R');
    expect([...roles.values()].every((r) => r === 'ct')).toBe(true);
  });
  it('one chord per bar, the same 5-note pattern twice per bar', () => {
    BACH.bars.forEach((b) => {
      expect(b.harm).toHaveLength(1);
      expect(b.ev.filter((e) => e.p).length).toBe(2 * 2 + 2 * 6 /* bass ×2, tenor ×2, 6 sixteenths ×2 */);
    });
  });
  it('chord symbols and the bass line', () => {
    expect(BACH.bars.map((b) => chordSymbol(b.harm[0], 'pt'))).toEqual([
      'C', 'Dm7/C', 'G7/B', 'C', 'Am/C', 'D7/C', 'G/B', 'C7M/B', 'Am7', 'D7', 'G',
    ]);
    const bass = BACH.bars.map((b) => b.ev.filter((e) => e.p).sort((x, y) => semi(x.p!) - semi(y.p!))[0].p!);
    expect(bass.map((n) => 'CDEFGAB'[n.letter] + n.oct).join(' ')).toBe('C4 C4 B3 C4 C4 C4 B3 B3 A3 D3 G3');
  });
  it('D7 is V of V: its F♯ is the leading tone of G and rises to G in the next bar; the C falls to B', () => {
    const d7 = BACH.bars[5].harm[0];
    expect(chordNotes(d7)).toEqual([nt('D'), nt('F#'), nt('A'), nt('C')]);
    const tl = timeline(BACH);
    const at = (bar: number, sm: number) => tl.some((n) => n.bar === bar && n.s === sm);
    expect(at(5, 6) && at(6, 7)).toBe(true); // F♯4 → G4
    expect(at(5, 0) && at(6, -1)).toBe(true); // C4 → B3
  });
  it('bars 9–11: roots A → D → G fall by fifths', () => {
    const r = BACH.bars.slice(8, 11).map((b) => b.harm[0].root.letter);
    expect(r).toEqual([5, 1, 4]);
  });
});

describe('Minuet in G', () => {
  it('bar 8 ends on V (half cadence), bar 16 on I after V (authentic cadence)', () => {
    expect(MINUET.bars[7].harm.at(-1)!.roman).toBe('V');
    expect(MINUET.bars[14].harm.at(-1)!.roman).toBe('V');
    expect(MINUET.bars[15].harm[0].roman).toBe('I');
  });
  it('bars 9–14 repeat bars 1–6', () => {
    for (let i = 0; i < 6; i++) expect(MINUET.bars[8 + i]).toEqual(MINUET.bars[i]);
  });
  it('bar 1: A and C are passing tones', () => {
    const roles = classify(MINUET, 'R');
    expect([0, 1, 2, 3, 4].map((i) => roles.get('0:' + i))).toEqual(['ct', 'ct', 'pass', 'ct', 'pass']);
  });
});

describe('Ode to Joy', () => {
  it('bars 1–8 move only by step or repeated note', () => {
    const rh = timeline(ODE).filter((n) => n.h === 'R' && n.bar < 8);
    for (let k = 1; k < rh.length; k++) expect(Math.abs((rh[k].p.letter + 7 * rh[k].p.oct) - (rh[k - 1].p.letter + 7 * rh[k - 1].p.oct))).toBeLessThanOrEqual(1);
  });
  it('the range is one octave, A3 to A4', () => {
    const s = timeline(ODE).filter((n) => n.h === 'R').map((n) => n.s);
    expect([Math.min(...s), Math.max(...s)]).toEqual([-3, 9]);
  });
  it('phrase 1 ends on E over V (question), phrase 2 on D over I (answer)', () => {
    const last = (b: number) => ODE.bars[b].ev.filter((e) => e.h === 'R').at(-1)!;
    expect(last(3).p).toEqual(pn('E4'));
    expect(ODE.bars[3].harm.at(-1)!.roman).toBe('V');
    expect(last(7).p).toEqual(pn('D4'));
    expect(ODE.bars[7].harm.at(-1)!.roman).toBe('I');
  });
  it('the syncopation: F♯ is attacked on beat 4 of bar 12 and tied over the bar line (an anticipation)', () => {
    const tl = timeline(ODE);
    const f = tl.find((n) => n.bar === 11 && n.h === 'R' && n.s === 6)!;
    expect(f.at - 11 * 4).toBe(3);
    expect(f.d).toBe(2);
    expect(classify(ODE, 'R').get('11:3')).toBe('ant');
    // the plain version attacks F♯ on the downbeat of bar 13
    const plain = timeline(odePiece(false)).find((n) => n.bar === 12 && n.h === 'R')!;
    expect(plain.at).toBe(12 * 4);
    expect(tl.filter((n) => n.h === 'R').length).toBe(timeline(odePiece(false)).filter((n) => n.h === 'R').length);
  });
});

describe('Für Elise', () => {
  it('starts with a two-note pickup', () => {
    expect(ELISE.bars[0].pickup).toBe(true);
    expect(ELISE.bars[0].beats).toBe(0.5);
  });
  it('D♯ is not in A minor (natural or harmonic) and is a lower neighbor of E', () => {
    const natural = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(nt);
    const harmonic = [...natural.slice(0, 6), nt('G#')];
    const ds = nt('D#');
    expect(natural.some((n) => n.letter === ds.letter && n.acc === ds.acc)).toBe(false);
    expect(harmonic.some((n) => n.letter === ds.letter && n.acc === ds.acc)).toBe(false);
    const rh = timeline(ELISE).filter((n) => n.h === 'R');
    rh.forEach((n, k) => {
      if (n.p.letter === 1 && n.p.acc === 1 && k > 0 && k < rh.length - 1) {
        expect(rh[k - 1].s).toBe(n.s + 1);
        expect(rh[k + 1].s).toBe(n.s + 1);
      }
    });
    expect(classify(ELISE, 'R').get('4:4')).toBe('nb');
  });
  it('the harmony alternates i (Am) and V (E), and V carries the G♯ of harmonic minor', () => {
    const syms = ELISE.bars.filter((b) => b.harm.length).map((b) => chordSymbol(b.harm[0], 'en'));
    expect(syms).toEqual(['Am', 'E', 'Am', 'Am', 'E', 'Am']);
    expect(chordNotes(ELISE.bars[3].harm[0])).toContainEqual(nt('G#'));
  });
});
