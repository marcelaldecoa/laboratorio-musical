import * as Tone from 'tone';
import { useSyncExternalStore } from 'react';

/** A note event: semitone relative to C4 (0 = middle C), start offset and duration in seconds. */
export interface NoteEvent {
  s: number;
  t: number;
  d: number;
  v?: number;
}

export type SoundStatus = 'off' | 'loading' | 'piano' | 'synth';

const SAMPLE_BASE = 'https://tonejs.github.io/audio/salamander/';
const SAMPLE_NOTES = ['A0', 'C1', 'D#1', 'F#1', 'A1', 'C2', 'D#2', 'F#2', 'A2', 'C3', 'D#3', 'F#3', 'A3', 'C4', 'D#4', 'F#4', 'A4', 'C5', 'D#5', 'F#5', 'A5', 'C6', 'D#6', 'F#6', 'A6', 'C7', 'D#7', 'F#7', 'A7', 'C8'];

let sampler: Tone.Sampler | null = null;
let synth: Tone.PolySynth | null = null;
let pure: Tone.PolySynth | null = null;
let status: SoundStatus = 'off';
const statusListeners = new Set<() => void>();
function setStatus(s: SoundStatus) {
  status = s;
  statusListeners.forEach((l) => l());
}

export function useSoundStatus() {
  return useSyncExternalStore(
    (l) => {
      statusListeners.add(l);
      return () => statusListeners.delete(l);
    },
    () => status,
    () => status,
  );
}

function build() {
  if (synth) return;
  const out = new Tone.Gain(0.9).toDestination();
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.35, release: 0.8 },
  }).connect(out);
  synth.volume.value = -8;
  pure = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.8, release: 0.4 },
  }).connect(out);
  pure.volume.value = -10;
  setStatus('loading');
  const urls: Record<string, string> = {};
  SAMPLE_NOTES.forEach((n) => (urls[n] = n.replace('#', 's') + '.mp3'));
  sampler = new Tone.Sampler({
    urls,
    baseUrl: SAMPLE_BASE,
    release: 1.2,
    onload: () => setStatus('piano'),
    onerror: () => setStatus('synth'),
  }).connect(out);
}

/** Must run inside a user gesture (iOS). Safe to call many times. */
export function unlock() {
  try {
    const nav = navigator as Navigator & { audioSession?: { type: string } };
    // iOS 17+: play even with the silent switch on
    if (nav.audioSession) nav.audioSession.type = 'playback';
  } catch {
    /* ignore */
  }
  if (Tone.getContext().state !== 'running') void Tone.start();
  build();
}

if (typeof window !== 'undefined') {
  const first = () => {
    unlock();
    window.removeEventListener('pointerdown', first);
    window.removeEventListener('keydown', first);
  };
  window.addEventListener('pointerdown', first);
  window.addEventListener('keydown', first);
}

/* ---------- visual sync: keyboards light up while notes sound ---------- */
type NoteListener = (s: number, on: boolean) => void;
const noteListeners = new Map<string, Set<NoteListener>>();
let timers: number[] = [];

export function subscribeNotes(channel: string, fn: NoteListener) {
  if (!noteListeners.has(channel)) noteListeners.set(channel, new Set());
  noteListeners.get(channel)!.add(fn);
  return () => {
    noteListeners.get(channel)?.delete(fn);
  };
}

function emit(channel: string | undefined, s: number, on: boolean) {
  if (!channel) return;
  noteListeners.get(channel)?.forEach((f) => f(s, on));
}

/** Run `fn` after `t` seconds; cancelled by stopAll(). */
export function later(fn: () => void, t: number) {
  timers.push(window.setTimeout(fn, Math.max(0, t * 1000)));
}

const midiName = (s: number) => Tone.Frequency(60 + s, 'midi').toNote();

/** Play note events on the piano (synth until the samples load). */
export function playNotes(events: NoteEvent[], channel?: string) {
  unlock();
  const now = Tone.now() + 0.05;
  const inst = sampler && sampler.loaded ? sampler : synth;
  if (!inst) return;
  for (const e of events) {
    const v = Math.min(1, (e.v ?? 0.7) * (inst === sampler ? 1 : 0.8));
    inst.triggerAttackRelease(midiName(e.s), e.d, now + e.t, v);
    later(() => emit(channel, e.s, true), e.t + 0.05);
    later(() => emit(channel, e.s, false), e.t + Math.min(e.d, 1.2) + 0.05);
  }
}

/** Play raw frequencies with a clean synth (used for tuning demos). */
export function playHz(events: { hz: number; t: number; d: number }[]) {
  unlock();
  const now = Tone.now() + 0.05;
  for (const e of events) pure?.triggerAttackRelease(e.hz, e.d, now + e.t, 0.6);
}

export function stopAll() {
  timers.forEach((id) => clearTimeout(id));
  timers = [];
  noteListeners.forEach((set) => set.forEach((f) => f(NaN, false)));
  sampler?.releaseAll();
  synth?.releaseAll();
  pure?.releaseAll();
}

/* ---------- convenience patterns ---------- */
export const seq = (notes: number[], gap = 0.32, d = 0.5): NoteEvent[] => notes.map((s, i) => ({ s, t: i * gap, d }));
export const chord = (notes: number[], t = 0, d = 1.4, v = 0.55): NoteEvent[] => notes.map((s) => ({ s, t, d, v }));
