import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

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
  stepsTitle: 'A ideia em três passos',
  steps: [
    'Cada compasso tem um acorde: três notas empilhadas em terças (1, 3 e 5), tiradas da escala da tonalidade.',
    'Uma nota da melodia que é 1, 3 ou 5 desse acorde é uma nota do acorde: soa estável, “encaixada”.',
    'As outras notas são da escala, mas não do acorde. Elas quase sempre andam por grau conjunto (a tecla vizinha da escala) até uma nota do acorde.',
  ],
  predOut: (chord: S, tri: S, mel: S) =>
    `No compasso 2 o acorde é ${chord}, com as notas <b>${tri}</b>. A melodia toca <b>${mel}</b>. Qual dessas notas <b>não</b> pertence ao acorde? Toque-a.`,
  predOutReveal: (out: S, tri: S, prev: S, next: S) =>
    `${out} não é 1, 3 nem 5 do acorde (${tri}). Ela é a tecla da escala que fica entre ${prev} e ${next}: liga duas notas do acorde por grau conjunto. É uma nota de passagem.`,
  predBeat: 'Agora o ritmo. Em quais tempos do compasso você espera encontrar as notas do acorde?',
  predBeatOpts: ['Nos tempos fortes (1 e 3)', 'Nos tempos fracos (2 e 4)', 'Em qualquer tempo, tanto faz'],
  predBeatReveal:
    'Nos tempos fortes. É ali que o ouvido confere o acorde; as notas de fora costumam cair nos fracos, só de passagem. Confira a contagem embaixo da melodia. A exceção, de propósito, é a apojatura.',
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
    '<b>Bordadura</b>: a melodia sai da nota do acorde, toca a vizinha (de cima ou de baixo) e volta para a mesma nota: Mi–Ré–Mi sobre Dó maior.',
    '<b>Apojatura</b>: a exceção que confirma a regra. É uma nota fora do acorde colocada de propósito no tempo forte, chegando por salto; ela cria tensão e resolve por grau conjunto. Por isso aparece em coral, a cor da tensão.',
    '<b>Os nomes</b>: bordadura lembra o bordado, em que a agulha sai do tecido e volta ao mesmo ponto. Apojatura vem do italiano <i>appoggiatura</i>, de <i>appoggiare</i>, apoiar: a nota se apoia no tempo forte antes de resolver.',
    '<b>Origem histórica</b>: no contraponto da Renascença (séculos XV e XVI) a dissonância era controlada. Nos tempos fracos ela aparecia de passagem, por grau conjunto; no tempo forte, só preparada e resolvida logo em seguida. A música tonal herdou esse cuidado, e ele ainda serve de guia para compor e improvisar.',
  ],
  transfer: (k: S) => `Em ${k}, toque a melodia e ache a nota de passagem do compasso 2. Qual é o nome dela, e quais são as três notas do IV que ela liga?`,
  recap: {
    oneLine:
      'Uma nota soa “encaixada” quando é 1, 3 ou 5 do acorde que está soando, e soa “de passagem” quando é uma vizinha da escala, fora do acorde, que só liga uma nota do acorde a outra; por isso as encaixadas ficam nos tempos fortes, onde o ouvido confere o acorde.',
    confusions: [
      '<b>Nota de passagem × bordadura</b>: a de passagem segue em frente (Mi–Fá–Sol); a bordadura volta para a nota de onde saiu (Mi–Fá–Mi).',
      '<b>Apojatura × nota de passagem</b>: a apojatura cai no tempo forte e chega por salto; a de passagem cai no tempo fraco e chega por grau conjunto.',
      '<b>Fundamental do acorde × tônica da tonalidade</b>: no IV de Dó maior a fundamental é Fá, não Dó. O “1” do acorde muda a cada compasso.',
    ],
    show:
      'Segure Dó-Mi-Sol na mão esquerda. Com a direita toque Mi–Fá–Sol (passagem) e depois Mi–Ré–Mi (bordadura). Pare em cima do Fá e do Ré: as duas notas soam “pedindo” a próxima.',
  } as RecapText,
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
  stepsTitle: 'The idea in three steps',
  steps: [
    'Each bar has a chord: three notes stacked in thirds (1, 3 and 5), taken from the key’s scale.',
    'A melody note that is the 1, 3 or 5 of that chord is a chord tone: it sounds stable, “at home”.',
    'The other notes belong to the scale but not to the chord. They almost always move by step (the next key of the scale) to a chord tone.',
  ],
  predOut: (chord: S, tri: S, mel: S) =>
    `In bar 2 the chord is ${chord}, with the notes <b>${tri}</b>. The melody plays <b>${mel}</b>. Which of these notes does <b>not</b> belong to the chord? Tap it.`,
  predOutReveal: (out: S, tri: S, prev: S, next: S) =>
    `${out} is not the 1, 3 or 5 of the chord (${tri}). It is the scale key between ${prev} and ${next}: it links two chord tones by step. It is a passing tone.`,
  predBeat: 'Now the rhythm. On which beats of the bar do you expect to find the chord tones?',
  predBeatOpts: ['On strong beats (1 and 3)', 'On weak beats (2 and 4)', 'On any beat, it does not matter'],
  predBeatReveal:
    'On strong beats. That is where the ear checks the chord; the outside notes usually fall on weak beats, just passing through. Check the count under the melody. The deliberate exception is the appoggiatura.',
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
    '<b>Neighbor tone</b>: the melody leaves a chord tone, touches the key next to it (above or below) and comes back to the same note: E–D–E over C major.',
    '<b>Appoggiatura</b>: the exception that proves the rule. It is a note outside the chord placed on purpose on a strong beat, reached by a leap; it creates tension and resolves by step. That is why it is coral, the color of tension.',
    '<b>The names</b>: the Portuguese word for neighbor tone, <i>bordadura</i>, evokes embroidery, where the needle leaves the cloth and comes back to the same spot. Appoggiatura comes from Italian <i>appoggiare</i>, to lean: the note leans on the strong beat before resolving.',
    '<b>Historical origin</b>: in Renaissance counterpoint (15th and 16th centuries) dissonance was controlled. On weak beats it appeared in passing, by step; on a strong beat, only when prepared and resolved right away. Tonal music inherited that care, and it still guides composing and improvising.',
  ],
  transfer: (k: S) => `In ${k}, play the melody and find the passing tone in bar 2. What is its name, and which three notes of IV does it link?`,
  recap: {
    oneLine:
      'A note sounds “locked in” when it is the 1, 3 or 5 of the chord that is sounding, and “passing” when it is a scale neighbor outside the chord that just links one chord tone to another; that is why locked-in notes sit on strong beats, where the ear checks the chord.',
    confusions: [
      '<b>Passing tone × neighbor tone</b>: a passing tone keeps going (E–F–G); a neighbor tone returns to where it came from (E–F–E).',
      '<b>Appoggiatura × passing tone</b>: an appoggiatura falls on a strong beat and arrives by leap; a passing tone falls on a weak beat and arrives by step.',
      '<b>Chord root × key tonic</b>: in C major the root of IV is F, not C. The chord’s “1” changes every bar.',
    ],
    show:
      'Hold C-E-G in the left hand. With the right, play E–F–G (passing) and then E–D–E (neighbor). Stop on the F and on the D: both sound like they are “asking” for the next note.',
  } as RecapText,
};

export const text = {
  pt,
  en,
  glossary: [
    ['Chord tone', '', 'Nota do acorde', 'Nota da melodia que é a fundamental, a terça ou a quinta do acorde que soa naquele momento. Soa estável e costuma cair nos tempos fortes.', 'A melody note that is the root, third or fifth of the chord sounding at that moment. It sounds stable and usually falls on strong beats.'],
    ['Passing tone', 'passing note', 'Nota de passagem', 'Nota fora do acorde que liga duas notas por grau conjunto, sempre no mesmo sentido (Mi–Fá–Sol sobre Dó maior). Costuma cair em tempo fraco.', 'A non-chord tone that links two notes by step in one direction (E–F–G over C major). It usually falls on a weak beat.'],
    ['Neighbor tone', 'auxiliary note', 'Bordadura', 'Nota fora do acorde que sai de uma nota por grau conjunto e volta para ela (Mi–Ré–Mi sobre Dó maior).', 'A non-chord tone that steps away from a note and comes back to it (E–D–E over C major).'],
    ['Appoggiatura', '', 'Apojatura', 'Nota fora do acorde num tempo forte, alcançada por salto e resolvida por grau conjunto. Cria tensão de propósito.', 'A non-chord tone on a strong beat, reached by a leap and resolved by step. It creates tension on purpose.'],
  ],
} satisfies LessonText<typeof pt>;
