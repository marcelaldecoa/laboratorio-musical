import { describe, expect, it } from 'vitest';
import {
  METERS, RHYTHMS, VALUES, bar16, barFraction, compareCounts, count16, fit, len16, meter, onsets, onsetsPerCount, perWhole,
  rhythm16, secondsPerCount, strength, tapsPerCount,
  REXAMPLES, TQ, attacks, attacksPerBeat, nt, rest, startsT, syncopatedBeats, syncopatedStarts, ticks, totalTicks, trip, tripletTicks,
} from './rhythm';

describe('note values', () => {
  it('each value is half of the previous one', () => {
    expect(VALUES.map(len16)).toEqual([16, 8, 4, 2, 1]);
    expect(VALUES.map(perWhole)).toEqual([1, 2, 4, 8, 16]);
  });
});

describe('meters', () => {
  it('bar lengths', () => {
    expect(METERS.map((m) => bar16(meter(m)))).toEqual([8, 12, 16, 12]);
    expect(METERS.map((m) => count16(meter(m)))).toEqual([4, 4, 4, 2]);
    expect(barFraction(meter('4/4'))).toEqual([1, 1]);
    expect(barFraction(meter('3/4'))).toEqual([3, 4]);
    expect(barFraction(meter('6/8'))).toEqual([3, 4]);
    expect(barFraction(meter('2/4'))).toEqual([1, 2]);
  });
  it('how many of each value fit in a bar', () => {
    expect(VALUES.map((v) => fit(meter('4/4'), v).count)).toEqual([1, 2, 4, 8, 16]);
    expect(VALUES.map((v) => fit(meter('3/4'), v))).toEqual([
      { count: 0, rest16: 12 }, { count: 1, rest16: 4 }, { count: 3, rest16: 0 }, { count: 6, rest16: 0 }, { count: 12, rest16: 0 },
    ]);
    expect(VALUES.map((v) => fit(meter('2/4'), v).count)).toEqual([0, 1, 2, 4, 8]);
    expect(VALUES.map((v) => fit(meter('6/8'), v).count)).toEqual([0, 1, 3, 6, 12]);
  });
  it('strong and weak counts', () => {
    expect([0, 1, 2, 3].map((i) => strength(meter('4/4'), i))).toEqual(['strong', 'weak', 'medium', 'weak']);
    expect([0, 1, 2].map((i) => strength(meter('3/4'), i))).toEqual(['strong', 'weak', 'weak']);
    expect([0, 1].map((i) => strength(meter('2/4'), i))).toEqual(['strong', 'weak']);
    expect([0, 1, 2, 3, 4, 5].map((i) => strength(meter('6/8'), i))).toEqual(['strong', 'weak', 'weak', 'medium', 'weak', 'weak']);
  });
});

describe('rhythms', () => {
  it('every practice rhythm fills exactly one bar', () => {
    for (const m of METERS) for (const r of RHYTHMS[m]) expect(rhythm16(r)).toBe(bar16(meter(m)));
  });
  it('onsets and notes per count', () => {
    expect(onsets([4, 8, 8, 4, 4])).toEqual([0, 4, 6, 8, 12]);
    expect(onsetsPerCount([4, 8, 8, 4, 4], meter('4/4'))).toEqual([1, 2, 1, 1]);
    expect(onsetsPerCount([2, 8, 8, 4], meter('4/4'))).toEqual([1, 0, 2, 1]);
    expect(onsetsPerCount([2, 4], meter('3/4'))).toEqual([1, 0, 1]);
    expect(onsetsPerCount([4, 8, 4, 8], meter('6/8'))).toEqual([1, 0, 1, 1, 0, 1]);
  });
  it('sorts taps into counts, allowing slightly early taps', () => {
    const d = secondsPerCount(120);
    expect(d).toBe(0.5);
    const taps = [10.0, 10.5, 10.74, 10.95, 11.5, 12.2];
    expect(tapsPerCount(taps, 10, d, 4)).toEqual([1, 2, 1, 1]);
    expect(tapsPerCount([9.95], 10, d, 4)).toEqual([1, 0, 0, 0]);
    expect(tapsPerCount([9.5], 10, d, 4)).toEqual([0, 0, 0, 0]);
    expect(compareCounts([1, 2, 1, 1], [1, 2, 0, 1])).toEqual([true, true, false, true]);
  });
});


describe('reading rhythm (ticks: quarter = 12)', () => {
  it('the dot adds half of the value', () => {
    expect(ticks(4)).toBe(TQ);
    expect(ticks(4, true)).toBe(18);
    expect(ticks(2, true)).toBe(36);
    expect(ticks(8, true)).toBe(9);
    expect(ticks(1)).toBe(48);
  });
  it('a triplet puts 3 in the time of 2', () => {
    expect(tripletTicks(8) * 3).toBe(ticks(8) * 2);
    expect(tripletTicks(4) * 3).toBe(ticks(2));
  });
  it('a dotted quarter sounds like a quarter tied to an eighth', () => {
    const a = attacks([nt(4, { tie: true }), nt(8)]);
    const b = attacks([nt(4, { dot: true })]);
    expect(a).toEqual(b);
  });
  it('ties merge, rests are silent', () => {
    const r = [nt(4), nt(4, { tie: true }), nt(4), rest(4)];
    expect(startsT(r)).toEqual([0, 12, 24, 36]);
    expect(attacks(r).map((a) => [a.t, a.dur])).toEqual([[0, 12], [12, 24]]);
    expect(attacksPerBeat(r)).toEqual([1, 1, 0, 0]);
  });
  it('syncopation: a note starting off the beat and held across the next one', () => {
    expect(syncopatedBeats([nt(8), nt(4), nt(8), nt(4), nt(4)])).toEqual([1]);
    expect(syncopatedBeats([nt(8), nt(8), nt(4), nt(4), nt(4)])).toEqual([]);
    expect(syncopatedBeats([nt(4), nt(4, { tie: true }), nt(4), nt(4)])).toEqual([]);
  });
  it('triplets: 3 attacks in a beat', () => {
    expect(attacksPerBeat([trip(8), trip(8), trip(8), nt(4)])).toEqual([3, 1]);
  });
  it('every example fills whole bars after its pickup, rows compare the same length', () => {
    for (const ex of REXAMPLES) {
      const bar = ex.beats * TQ;
      for (const row of ex.rows) {
        expect(totalTicks(row), ex.id).toBe(totalTicks(ex.rows[0]));
        expect((totalTicks(row) - ex.pickup) % bar, ex.id).toBe(0);
        expect(ex.pickup % TQ).toBe(0);
      }
    }
  });
  it('the examples show their concept', () => {
    const ex = (id: string) => REXAMPLES.find((e) => e.id === id)!;
    const [plain, dot] = ex('dot').rows;
    expect(attacks(plain)).toEqual(attacks(dot));
    expect(ex('tie').rows[1].some((n) => n.tie)).toBe(true);
    expect(attacks(ex('tie').rows[1]).length).toBe(attacks(ex('tie').rows[0]).length - 1);
    expect(ex('rest').rows[1].some((n) => n.rest)).toBe(true);
    expect(syncopatedBeats(ex('sync').rows[1])).toEqual([1]);
    expect(syncopatedBeats(ex('sync').rows[0])).toEqual([]);
    expect(ex('pickup').pickup).toBe(TQ);
    expect(attacksPerBeat(ex('tri').rows[1])).toEqual([2, 3, 2, 3]);
  });
});

describe('syncopatedStarts', () => {
  it('marks the attack that starts the syncopation', () => {
    expect([...syncopatedStarts([nt(8), nt(4), nt(8), nt(4), nt(4)])]).toEqual([6]);
    expect([...syncopatedStarts([nt(4), nt(8), nt(8), nt(2)])]).toEqual([]);
  });
});
