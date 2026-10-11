import type { LessonText } from '../lessonText';

type S = string;
type Role = 'root' | 'third' | 'fifth' | 'passing' | 'neighbor' | 'appoggiatura' | 'other';

const pt = {
  meta: {
    nav: 'Notas do acorde',
    title: 'Notas do acorde e notas de passagem',
    sub: 'Por que a melodia “cabe” no acorde',
    teaser: 'Cada nota da melodia tem um papel: pertence ao acorde ou passa por ele.',
  },
  desc:
    'Uma melodia anda por cima de acordes. Algumas notas pertencem ao acorde do compasso (fundamental, terça ou quinta); outras não pertencem e servem de caminho entre elas. Toque a melodia e ande nota por nota para ver o papel de cada uma.',
  stepsTitle: 'A ideia em quatro passos',
  steps: [
    'Cada compasso tem um acorde: três notas empilhadas em terças (1, 3 e 5), tiradas da escala da tonalidade.',
    'Uma nota da melodia que é 1, 3 ou 5 desse acorde é uma nota do acorde: soa estável, “encaixada”.',
    'As outras notas são da escala, mas não do acorde. Elas quase sempre andam por grau conjunto (a tecla vizinha da escala) até uma nota do acorde.',
    'Nos tempos fortes (1 e 3 do compasso de 4) o ouvido confere o acorde. Por isso ali ficam, quase sempre, as notas do acorde.',
  ],
  rollLabel: 'Melodia por cima dos acordes · toque numa nota',
  beat: 'tempo',
  strongMark: 'forte',
  full: 'Melodia completa',
  skel: 'Só tempos fortes',
  play: 'Tocar com acordes',
  stop: 'Parar',
  prev: '◀',
  next: '▶',
  now: (k: number, n: number, name: S) => `Nota ${k}/${n} · ${name}`,
  keyLabel: (name: S, role: S) => `${name}: ${role}`,
  roleName: {
    root: 'fundamental do acorde', third: 'terça do acorde', fifth: 'quinta do acorde',
    passing: 'nota de passagem', neighbor: 'bordadura', appoggiatura: 'apojatura', other: 'nota livre',
  } as Record<Role, S>,
  /** short label inside the key */
  roleTag: { root: '1', third: '3', fifth: '5', passing: 'P', neighbor: 'B', appoggiatura: 'A', other: '·' } as Record<Role, S>,
  read: (name: S, chord: S, bar: number, beat: number, strong: boolean, role: Role, prev: S, next: S) => {
    const where = `Compasso ${bar}, tempo ${beat} (${strong ? 'forte' : 'fraco'}). Acorde: ${chord}.`;
    const why: Record<Role, S> = {
      root: `${name} é a fundamental do acorde: a nota mais estável possível.`,
      third: `${name} é a terça do acorde: estável, e é ela que diz se o acorde é maior ou menor.`,
      fifth: `${name} é a quinta do acorde: estável, reforça a fundamental.`,
      passing: `${name} não está no acorde. Ela liga ${prev} a ${next} andando sempre no mesmo sentido, uma tecla da escala por vez: nota de passagem.`,
      neighbor: `${name} não está no acorde. A melodia sai de ${prev}, pisa na vizinha e volta para ${next}: bordadura.`,
      appoggiatura: `${name} não está no acorde e cai num tempo forte, chegando por salto. A tensão se resolve um grau abaixo, em ${next}: apojatura.`,
      other: `${name} não está no acorde.`,
    };
    return `${where} ${why[role]}`;
  },
  census: (strongChord: number, strongAll: number, weakChord: number, weakAll: number) =>
    `Tempos fortes: ${strongChord} de ${strongAll} notas são do acorde. Tempos fracos: ${weakChord} de ${weakAll}.`,
  lgChordTone: 'nota do acorde (1, 3, 5)',
  lgPassing: 'nota de passagem (P)',
  lgNeighbor: 'bordadura (B)',
  lgApp: 'apojatura (A)',
  lgChord: 'acorde do compasso (mão esquerda)',
  lgWas: 'nota anterior da melodia',
  skelHint:
    'Ouça só os tempos fortes: a melodia fica mais simples, mas continua reconhecível. As notas de passagem e as bordaduras são o enfeite; o esqueleto são as notas do acorde.',
  logicTitle: 'A lógica por baixo',
  logic: [
    '<b>Vem das tríades</b>: cada acorde da tonalidade são as notas 1, 3 e 5 empilhadas sobre um grau da escala. Uma nota da melodia ou é uma dessas três, ou é uma das outras quatro notas da escala.',
    '<b>Grau conjunto é o caminho natural</b>: entre duas notas do acorde que ficam a uma terça (Mi e Sol em Dó maior) sobra exatamente uma tecla da escala (Fá). Ela vira nota de passagem quase sozinha.',
    '<b>Bordadura</b>: o nome vem do bordado, que sai do tecido e volta para o mesmo ponto. A melodia sai da nota do acorde, toca a vizinha (de cima ou de baixo) e volta.',
    '<b>Apojatura</b>: do italiano <i>appoggiare</i>, apoiar. É a exceção que confirma a regra: uma nota fora do acorde de propósito no tempo forte, que cria tensão e resolve por grau conjunto. Por isso aparece em coral, a cor da tensão.',
    '<b>Origem histórica</b>: no contraponto dos séculos XV e XVI as dissonâncias só eram permitidas em tempo fraco e por grau conjunto. A música tonal herdou essa regra, e ela ainda funciona como guia para compor e improvisar.',
  ],
};

const en: typeof pt = {
  meta: {
    nav: 'Chord tones',
    title: 'Chord tones and passing tones',
    sub: 'Why a melody “fits” the chord',
    teaser: 'Each melody note has a job: it belongs to the chord or passes through it.',
  },
  desc:
    'A melody moves on top of chords. Some notes belong to the chord of the bar (root, third or fifth); others do not, and they are the path between them. Play the melody and step through it note by note to see each note’s job.',
  stepsTitle: 'The idea in four steps',
  steps: [
    'Each bar has a chord: three notes stacked in thirds (1, 3 and 5), taken from the key’s scale.',
    'A melody note that is the 1, 3 or 5 of that chord is a chord tone: it sounds stable, “at home”.',
    'The other notes belong to the scale but not to the chord. They almost always move by step (the next key of the scale) to a chord tone.',
    'On strong beats (1 and 3 in a bar of 4) the ear checks the chord. That is why chord tones almost always sit there.',
  ],
  rollLabel: 'Melody over the chords · tap a note',
  beat: 'beat',
  strongMark: 'strong',
  full: 'Full melody',
  skel: 'Strong beats only',
  play: 'Play with chords',
  stop: 'Stop',
  prev: '◀',
  next: '▶',
  now: (k: number, n: number, name: S) => `Note ${k}/${n} · ${name}`,
  keyLabel: (name: S, role: S) => `${name}: ${role}`,
  roleName: {
    root: 'chord root', third: 'chord third', fifth: 'chord fifth',
    passing: 'passing tone', neighbor: 'neighbor tone', appoggiatura: 'appoggiatura', other: 'free tone',
  } as Record<Role, S>,
  roleTag: { root: '1', third: '3', fifth: '5', passing: 'P', neighbor: 'N', appoggiatura: 'A', other: '·' } as Record<Role, S>,
  read: (name: S, chord: S, bar: number, beat: number, strong: boolean, role: Role, prev: S, next: S) => {
    const where = `Bar ${bar}, beat ${beat} (${strong ? 'strong' : 'weak'}). Chord: ${chord}.`;
    const why: Record<Role, S> = {
      root: `${name} is the chord’s root: the most stable note there is.`,
      third: `${name} is the chord’s third: stable, and it decides whether the chord is major or minor.`,
      fifth: `${name} is the chord’s fifth: stable, it supports the root.`,
      passing: `${name} is not in the chord. It links ${prev} to ${next}, moving in one direction one scale key at a time: a passing tone.`,
      neighbor: `${name} is not in the chord. The melody leaves ${prev}, steps onto the neighbor and returns to ${next}: a neighbor tone.`,
      appoggiatura: `${name} is not in the chord and lands on a strong beat, reached by a leap. The tension resolves one step down, on ${next}: an appoggiatura.`,
      other: `${name} is not in the chord.`,
    };
    return `${where} ${why[role]}`;
  },
  census: (strongChord: number, strongAll: number, weakChord: number, weakAll: number) =>
    `Strong beats: ${strongChord} of ${strongAll} notes are chord tones. Weak beats: ${weakChord} of ${weakAll}.`,
  lgChordTone: 'chord tone (1, 3, 5)',
  lgPassing: 'passing tone (P)',
  lgNeighbor: 'neighbor tone (N)',
  lgApp: 'appoggiatura (A)',
  lgChord: 'chord of the bar (left hand)',
  lgWas: 'previous melody note',
  skelHint:
    'Listen to the strong beats only: the melody gets simpler, but you still recognize it. Passing and neighbor tones are the ornament; chord tones are the skeleton.',
  logicTitle: 'The logic underneath',
  logic: [
    '<b>It comes from triads</b>: each chord of the key is notes 1, 3 and 5 stacked on a scale degree. A melody note is either one of those three or one of the other four scale notes.',
    '<b>Steps are the natural path</b>: between two chord tones a third apart (E and G in C major) there is exactly one scale key left (F). It becomes a passing tone almost by itself.',
    '<b>Neighbor tone</b>: the melody leaves a chord tone, touches the key next to it (above or below) and comes back to the same note.',
    '<b>Appoggiatura</b>: from Italian <i>appoggiare</i>, to lean. It is the exception that proves the rule: a note outside the chord on purpose on a strong beat, which creates tension and resolves by step. That is why it is coral, the color of tension.',
    '<b>Historical origin</b>: in 15th- and 16th-century counterpoint, dissonances were allowed only on weak beats and by step. Tonal music inherited that rule, and it still works as a guide for composing and improvising.',
  ],
};

export const text = {
  pt,
  en,
  glossary: [
    ['Chord tone', '', 'Nota do acorde', 'Nota da melodia que é a fundamental, a terça ou a quinta do acorde que soa naquele momento. Soa estável e costuma cair nos tempos fortes.', 'A melody note that is the root, third or fifth of the chord sounding at that moment. It sounds stable and usually falls on strong beats.'],
    ['Passing tone', 'passing note', 'Nota de passagem', 'Nota fora do acorde que liga duas notas por grau conjunto, sempre no mesmo sentido (Mi–Fá–Sol sobre Dó maior). Costuma cair em tempo fraco.', 'A non-chord tone that links two notes by step in one direction (E–F–G over C major). It usually falls on a weak beat.'],
    ['Neighbor tone', 'auxiliary note', 'Bordadura', 'Nota fora do acorde que sai de uma nota por grau conjunto e volta para ela (Mi–Ré–Mi sobre Dó maior).', 'A non-chord tone that steps away from a note and comes back to it (E–D–E over C major).'],
    ['Appoggiatura', '', 'Apojatura', 'Nota fora do acorde num tempo forte, alcançada por salto e resolvida por grau conjunto. Cria tensão de propósito.', 'A non-chord tone on a strong beat, reached by a leap and resolved by step. It creates tension on purpose.'],
    ['Strong beat', 'downbeat', 'Tempo forte', 'O tempo acentuado do compasso: no compasso de 4, os tempos 1 e 3 (o 1 é o mais forte).', 'The accented beat of a bar: in 4/4, beats 1 and 3 (beat 1 is the strongest).'],
  ],
} satisfies LessonText<typeof pt>;
