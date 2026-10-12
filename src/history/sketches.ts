import type { NoteEvent } from '../audio/audio';

/**
 * Short sound sketches for the history timeline, one per period. All material is original or a generic textbook pattern
 * (organum, imitation, running bass, Alberti bass, planing, ostinato, ii–V–I, minimalist loop). Semitones from middle C
 * (C4 = 0), times in seconds.
 */

/** A list of [semitone, beats] played one after another from `start`, with `beat` seconds per beat. */
function line(notes: [number, number][], beat: number, start = 0, v = 0.6, legato = 0.95): NoteEvent[] {
  const out: NoteEvent[] = [];
  let t = start;
  for (const [s, b] of notes) {
    out.push({ s, t: +t.toFixed(3), d: +(b * beat * legato).toFixed(3), v });
    t += b * beat;
  }
  return out;
}

/** Several notes struck together. */
function block(notes: number[], t: number, d: number, v = 0.5): NoteEvent[] {
  return notes.map((s) => ({ s, t: +t.toFixed(3), d, v }));
}

/** Medieval: a chant-like line doubled a fourth below and an octave below (parallel organum). */
function medieval(): NoteEvent[] {
  // D F E G F E D D (dorian-like)
  const chant: [number, number][] = [[2, 1], [5, 1], [4, 1], [7, 1.5], [5, 0.5], [4, 1], [2, 1], [2, 2]];
  const beat = 0.7;
  return [
    ...line(chant, beat, 0, 0.6),
    ...line(chant.map(([s, b]) => [s - 5, b] as [number, number]), beat, 0, 0.45),
    ...line(chant.map(([s, b]) => [s - 12, b] as [number, number]), beat, 0, 0.4),
  ];
}

/** Renaissance: one line enters in three voices, a bar apart (imitation), ending on a full chord. */
function renaissance(): NoteEvent[] {
  const q = 0.45;
  // motif in three segments; each segment fits the harmony of its bar (C for 2 beats, G for 2 beats)
  const a: [number, number][] = [[0, 2], [-1, 2]]; // C | B
  const b: [number, number][] = [[-5, 1], [-3, 1], [-5, 2]]; // G A | G
  const c: [number, number][] = [[-8, 1], [-12, 1], [-10, 2]]; // E C | D
  const up = (seg: [number, number][], k: number) => seg.map(([s, d]) => [s + k, d] as [number, number]);
  const bar = 4 * q;
  return [
    ...line([...up(a, 12), ...up(b, 12), ...up(c, 12)], q, 0, 0.6), // soprano: C5 B4 | G4 A4 G4 | E4 C4 D4
    ...line([...up(a, 0), ...up(b, 0)], q, bar, 0.5), // alto: C4 B3 | G3 A3 G3
    ...line(up(a, -12), q, 2 * bar, 0.5), // bass: C3 B2
    ...block([4, -5, -12], 3 * bar, 2.2, 0.5), // final C chord
  ];
}

/** Baroque: a running bass in eighth notes with continuo chords above, C – Am – F – Dm – G – G7 – C. */
function baroque(): NoteEvent[] {
  const e = 0.25;
  const bass = [
    -12, -10, -8, -12, /* C */ -15, -13, -12, -15, /* Am */
    -19, -17, -15, -19, /* F */ -22, -20, -19, -22, /* Dm */
    -17, -15, -13, -17, /* G */ -17, -13, -10, -7, /* G7 */
  ];
  const chords = [[4, 7, 12], [4, 9, 12], [5, 9, 12], [5, 9, 14], [2, 7, 11], [2, 5, 11]];
  const out: NoteEvent[] = bass.map((s, i) => ({ s, t: +(i * e).toFixed(3), d: e * 0.9, v: i % 4 === 0 ? 0.6 : 0.5 }));
  chords.forEach((ch, i) => out.push(...block(ch, i * 4 * e, 4 * e * 0.95, 0.4)));
  const end = bass.length * e;
  out.push(...block([-24, -12], end, 2, 0.55), ...block([0, 4, 12], end, 2, 0.45));
  return out;
}

/** Classical: Alberti bass under a 4-bar period, I – V (question) | V7 – I (answer). */
function classical(): NoteEvent[] {
  const e = 0.25;
  const alberti = (pat: number[], bar: number) =>
    [...pat, ...pat].map((s, i) => ({ s, t: +(bar * 8 * e + i * e).toFixed(3), d: e * 0.9, v: i % 2 === 0 ? 0.42 : 0.34 }));
  const C = [-12, -5, -8, -5];
  const G = [-13, -5, -10, -5];
  const G7 = [-13, -5, -7, -5];
  const melody: [number, number][] = [
    [7, 1], [12, 1], [16, 1], [12, 1], // bar 1, I
    [14, 1], [11, 1], [14, 2], // bar 2, V (half cadence: the question)
    [17, 1], [14, 1], [11, 1], [14, 1], // bar 3, V7
    [12, 3], // bar 4, I (the answer)
  ];
  return [
    ...alberti(C, 0), ...alberti(G, 1), ...alberti(G7, 2),
    ...[-12, -5, -8, -5].map((s, i) => ({ s, t: +(24 * e + i * e).toFixed(3), d: e * 0.9, v: 0.38 })),
    ...block([-12, -24], 28 * e, 1.4, 0.45),
    ...line(melody, 2 * e, 0, 0.65),
  ];
}

/** Romantic: a singing melody over wide, pedalled arpeggios; C – Fm (borrowed iv) – B°7 – C. */
function romantic(): NoteEvent[] {
  const e = 0.3;
  const arps = [
    [-24, -17, -8, -5, -8, -17], // C
    [-19, -12, -4, 0, -4, -12], // Fm: the A♭ is the borrowed note
    [-25, -16, -10, -7, -10, -16], // B°7 = B D F A♭
  ];
  const out: NoteEvent[] = [];
  arps.forEach((arp, bar) =>
    arp.forEach((s, i) => out.push({ s, t: +((bar * 6 + i) * e).toFixed(3), d: +((6 - i) * e + 0.2).toFixed(3), v: i === 0 ? 0.5 : 0.36 })),
  );
  const melody: [number, number][] = [
    [7, 3], [16, 2], [14, 1], // G4 → E5 D5
    [12, 3], [8, 3], // C5 A♭4
    [17, 3], [14, 1], [11, 2], // F5 D5 B4
    [12, 7], // C5
  ];
  out.push(...line(melody, e, 0, 0.66, 0.98));
  out.push(...block([-24, -12, -5, 4], 18 * e, 2.2, 0.42));
  return out;
}

/** Impressionism: parallel major triads gliding over a held low pedal, then a whole-tone run and a whole-tone chord. */
function impressionism(): NoteEvent[] {
  const roots = [0, 2, 4, 2, 0, -2, 0];
  const g = 0.6;
  const out: NoteEvent[] = [...block([-24, -12], 0, 7.4, 0.38)];
  roots.forEach((r, i) => out.push(...block([r + 4, r + 7, r + 12], i * g, 0.95, 0.4)));
  const runStart = roots.length * g;
  [24, 26, 28, 30, 32, 34].forEach((s, i) => out.push({ s, t: +(runStart + i * 0.17).toFixed(3), d: 0.6, v: 0.32 }));
  out.push(...block([4, 8, 12, 14], runStart + 6 * 0.17, 2.2, 0.36));
  return out;
}

/** 20th century: a driving ostinato with 3+3+2 accents; quartal chords, then C against F♯ major (bitonality). */
function modern(): NoteEvent[] {
  const e = 0.2;
  const out: NoteEvent[] = [];
  const accents = [0, 3, 6];
  for (let i = 0; i < 32; i++) {
    out.push({ s: i % 2 === 0 ? -24 : -17, t: +(i * e).toFixed(3), d: e * 0.8, v: accents.includes(i % 8) ? 0.7 : 0.4 });
  }
  const rh = [[4, 9, 14], [5, 10, 15], [6, 10, 13], [6, 10, 13]];
  rh.forEach((ch, bar) => accents.forEach((a) => out.push(...block(ch, (bar * 8 + a) * e, 0.3, 0.55))));
  out.push(...block([-24, -12, -8], 32 * e, 1.6, 0.55), ...block([6, 10, 13], 32 * e, 1.6, 0.5));
  return out;
}

/** Jazz: ii–V–I in C with walking bass, rootless voicings on swung off-beats and a swung line. */
function jazz(): NoteEvent[] {
  const beat = 0.6;
  const long = 0.4;
  const out: NoteEvent[] = [];
  // walking bass, one note per beat; chromatic approach notes into each new chord
  const bass = [-22, -19, -15, -16, /* Dm9 */ -17, -13, -10, -11 /* G13 */];
  bass.forEach((s, i) => out.push({ s, t: +(i * beat).toFixed(3), d: beat * 0.9, v: 0.55 }));
  out.push({ s: -12, t: 8 * beat, d: 2.2, v: 0.55 });
  // rootless voicings, Charleston rhythm: beat 1 and the swung "and" of 2
  const voicings = [[-7, -3, 0, 4], [-7, -3, -1, 4], [-8, -5, -1, 2]];
  voicings.forEach((v, bar) => {
    const t0 = bar * 4 * beat;
    out.push(...block(v, t0, 0.45, 0.42));
    if (bar < 2) out.push(...block(v, t0 + beat + long, 0.3, 0.5));
  });
  out[out.length - 1].d = 2.2;
  out[out.length - 2].d = 2.2;
  out[out.length - 3].d = 2.2;
  out[out.length - 4].d = 2.2;
  // swung eighths: long–short pairs
  const melody = [9, 12, 16, 17, 16, 12, 9, 12, /* Dm9 */ 11, 14, 17, 21, 20, 17, 16, 15 /* G13 with b9 and b13 */];
  melody.forEach((s, i) => {
    const t = Math.floor(i / 2) * beat + (i % 2 ? long : 0);
    out.push({ s, t: +t.toFixed(3), d: i % 2 ? 0.18 : 0.36, v: i % 2 ? 0.62 : 0.52 });
  });
  out.push({ s: 14, t: 8 * beat, d: 2, v: 0.6 }); // the 9th of Cmaj9
  return out;
}

/** Contemporary: a minimalist loop that changes one note at a time over slowly moving bass notes. */
function contemporary(): NoteEvent[] {
  const n = 0.15;
  const patterns = [
    [2, 9, 7, 14, 9, 7],
    [2, 9, 7, 16, 9, 7],
    [2, 11, 7, 16, 11, 7],
    [2, 11, 7, 16, 11, 9],
  ];
  const bassNotes = [[-17, -10], [-20, -13], [-12, -5], [-10, -3]];
  const out: NoteEvent[] = [];
  let t = 0;
  patterns.forEach((p, k) => {
    out.push(...block(bassNotes[k], t, 1.75, 0.34));
    for (let rep = 0; rep < 2; rep++) {
      p.forEach((s, i) => out.push({ s, t: +t.toFixed(3), d: n * 0.9, v: i === 0 ? 0.5 : 0.4 }));
      t = +(t + p.length * n).toFixed(3);
    }
  });
  out.push(...block([-17, -10, 2], t, 1.6, 0.36));
  return out;
}

export const SKETCHES = {
  medieval: medieval(),
  renaissance: renaissance(),
  baroque: baroque(),
  classical: classical(),
  romantic: romantic(),
  impressionism: impressionism(),
  modern: modern(),
  jazz: jazz(),
  contemporary: contemporary(),
};
