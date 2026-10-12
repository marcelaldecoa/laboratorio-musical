import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

const pt = {
  meta: {
    nav: 'Mão esquerda',
    title: 'Padrões de mão esquerda',
    sub: 'Baixo + acorde, acorde quebrado e baixo de Alberti',
    teaser: 'A mão esquerda transforma um acorde parado em movimento: três padrões sobre I–IV–V–I.',
  },
  desc:
    'Na maior parte das músicas para piano, a mão direita canta a melodia e a mão esquerda toca a harmonia. Mas um acorde parado soa duro. Então a mão esquerda “desmancha” o acorde num padrão que se repete a cada compasso. O padrão fica igual; só o acorde muda. Aqui a progressão é I–IV–V–I da tonalidade escolhida.',
  patLabel: 'Padrão',
  pats: { oompah: 'Baixo + acorde', broken: 'Acorde quebrado', alberti: 'Baixo de Alberti' },
  patDesc: {
    oompah:
      'No tempo 1 o baixo toca a fundamental; nos tempos 2 e 4 entra o acorde; no tempo 3 o baixo vai para a 5ª do acorde. É o “um-pá” das marchas e do ragtime; na valsa, em 3 tempos, vira “um-pá-pá”.',
    broken:
      'Uma nota por vez: fundamental, 5ª, oitava, 5ª (1-5-8-5). A mão fica aberta numa oitava e as notas se somam no ar, como se o acorde fosse tocado devagar.',
    alberti:
      'Grave, agudo, meio, agudo: 1-5-3-5. O acorde inteiro soa em quatro notas, sem pular. É o acompanhamento típico do período clássico.',
  },
  tempoLabel: 'Andamento',
  tempos: { slow: 'Lento', mid: 'Médio', fast: 'Rápido' },
  handsLabel: 'Ouvir',
  handsOpts: { lh: 'Só a esquerda', both: 'As duas mãos' },
  chordsLabel: 'Compassos',
  beatsLabel: 'Um compasso, em colcheias (número = nota do acorde)',
  playAll: 'Tocar I–IV–V–I',
  stop: 'Parar',
  lhTag: 'mão esquerda',
  rhTag: 'mão direita',
  kbdAria: (key: string, pat: string) => `${pat} em ${key}: mão esquerda e mão direita`,
  read: (bar: number, roman: string, chord: string, bass: string) =>
    `Compasso ${bar}/4 · ${roman} (${chord}) · baixo ${bass}`,
  lgT: 'mão esquerda no acorde de tônica (I)',
  lgSD: 'mão esquerda no acorde de subdominante (IV)',
  lgD: 'mão esquerda no acorde de dominante (V)',
  lgRh: 'mão direita: a melodia (número = grau da escala)',
  lgNum: 'número na mão esquerda = nota do acorde (1, 3, 5, 8)',

  logicTitle: 'A lógica por baixo',
  logic: [
    '<b>O baixo no tempo forte</b>: o ouvido toma a nota mais grave como a base do acorde. Por isso todos os padrões começam com a fundamental no tempo 1: ela diz ao ouvido qual acorde está soando, e o resto do compasso só preenche.',
    '<b>Intervalos abertos no grave</b>: no grave, notas muito próximas (como uma 3ª) soam emboladas, porque os harmônicos delas ficam perto demais e se esbarram. Por isso o baixo bem grave prefere a 5ª e a 8ª, os intervalos mais consonantes da série harmônica (3:2 e 2:1). Quando o padrão usa a 3ª, como o baixo de Alberti, a mão costuma tocar mais perto do Dó central.',
    '<b>O mesmo desenho em outro acorde</b>: os números 1, 3, 5 e 8 nas teclas não mudam de um compasso para outro. Você aprende o formato da mão uma vez e só o desloca: do I para o IV, do IV para o V.',
    '<b>Dó central como fronteira</b>: a mão esquerda fica na metade grave, abaixo do Dó central, e a direita na metade aguda. Assim as mãos não se esbarram. É a mesma divisão da pauta dupla: a pauta de baixo (clave de fá) costuma ser da mão esquerda.',
    '<b>Origem do baixo de Alberti</b>: leva o nome de Domenico Alberti, compositor veneziano da primeira metade do século XVIII. Ele não inventou o desenho, mas o usou tanto que o nome ficou. No cravo e no pianoforte da época o som morria rápido; repetir as notas do acorde mantinha a harmonia viva. Mozart abre a Sonata em Dó maior, K. 545, com esse padrão.',
  ],

  p1: (key: string) =>
    `Em <b>${key}</b>, a progressão é I–IV–V–I. Qual nota a mão esquerda toca no tempo 1 do compasso do IV? Toque-a no teclado.`,
  p1Reveal: (name: string) =>
    `${name}, a fundamental do IV (o acorde construído sobre o 4º grau). Todo padrão começa com a fundamental no tempo 1, porque o ouvido toma a nota mais grave como base: é ela que diz qual acorde está soando.`,
  p2: (chord: string) =>
    `No padrão “baixo + acorde”, o baixo toca a fundamental no tempo 1 e, no tempo 3, outra letra do acorde: a que soa mais consonante com a fundamental. No compasso do V (${chord}), qual é essa nota?`,
  p2Reveal: (fifth: string) =>
    `${fifth}, a 5ª do acorde. O baixo alterna fundamental (tempo 1) e 5ª (tempo 3): a 5ª é o intervalo mais consonante depois da oitava, então o baixo anda sem embolar e sem sair do acorde.`,
  transfer: (key: string) =>
    `Vá para <b>${key}</b> e preveja antes de tocar: qual é o baixo do tempo 1 no compasso do V? E qual nota o baixo toca no tempo 3 do “baixo + acorde” nesse compasso?`,
  recap: (key: string, i: string[], iv: string, tonic: string): RecapText => ({
    oneLine: 'A mão esquerda desmancha o acorde num desenho que se repete a cada compasso: a fundamental no tempo 1 diz ao ouvido qual acorde soa, e as outras notas do acorde preenchem o resto do compasso para a harmonia não parar.',
    confusions: [
      '<b>Baixo de Alberti × acorde quebrado</b>: o Alberti é 1-5-3-5 (grave, agudo, meio, agudo), com a mão fechada sobre o acorde; o acorde quebrado daqui é 1-5-8-5, aberto na oitava e sem a 3ª.',
      `<b>Número do acorde × grau da escala</b>: o 1, 3, 5 e 8 nas teclas da esquerda contam a partir da fundamental do acorde, não da tônica. No IV de ${key}, o “1” é ${iv}, não ${tonic}.`,
      '<b>Padrão × acorde</b>: o padrão (o desenho da mão) fica igual o tempo todo; o que muda de um compasso para outro é o acorde.',
    ],
    show: `Em ${key}, toque com a mão esquerda ${i[0]}, ${i[2]}, ${i[1]}, ${i[2]} (Alberti no I). Sem mudar o formato da mão, leve-a até ${iv} e repita: é o IV. Mostre que o formato é o mesmo e só o acorde mudou.`,
  }),
};

const en: typeof pt = {
  meta: {
    nav: 'Left hand',
    title: 'Left-hand patterns',
    sub: 'Bass + chord, broken chord and Alberti bass',
    teaser: 'The left hand turns a still chord into motion: three patterns over I–IV–V–I.',
  },
  desc:
    'In most piano music the right hand sings the melody and the left hand plays the harmony. But a still, blocked chord sounds stiff. So the left hand “breaks” the chord into a pattern that repeats every bar. The pattern stays the same; only the chord changes. Here the progression is I–IV–V–I in the chosen key.',
  patLabel: 'Pattern',
  pats: { oompah: 'Bass + chord', broken: 'Broken chord', alberti: 'Alberti bass' },
  patDesc: {
    oompah:
      'On beat 1 the bass plays the root; on beats 2 and 4 the chord comes in; on beat 3 the bass moves to the fifth of the chord. It is the “oom-pah” of marches and ragtime; in a waltz, in 3 beats, it becomes “oom-pah-pah”.',
    broken:
      'One note at a time: root, fifth, octave, fifth (1-5-8-5). The hand stays open across an octave and the notes add up in the air, as if the chord were played slowly.',
    alberti:
      'Low, high, middle, high: 1-5-3-5. The whole chord sounds in four notes, with no jumps. It is the typical accompaniment of the Classical period.',
  },
  tempoLabel: 'Tempo',
  tempos: { slow: 'Slow', mid: 'Medium', fast: 'Fast' },
  handsLabel: 'Hear',
  handsOpts: { lh: 'Left hand only', both: 'Both hands' },
  chordsLabel: 'Bars',
  beatsLabel: 'One bar, in eighth notes (number = chord tone)',
  playAll: 'Play I–IV–V–I',
  stop: 'Stop',
  lhTag: 'left hand',
  rhTag: 'right hand',
  kbdAria: (key: string, pat: string) => `${pat} in ${key}: left hand and right hand`,
  read: (bar: number, roman: string, chord: string, bass: string) =>
    `Bar ${bar}/4 · ${roman} (${chord}) · bass ${bass}`,
  lgT: 'left hand on the tonic chord (I)',
  lgSD: 'left hand on the subdominant chord (IV)',
  lgD: 'left hand on the dominant chord (V)',
  lgRh: 'right hand: the melody (number = scale degree)',
  lgNum: 'number in the left hand = chord tone (1, 3, 5, 8)',

  logicTitle: 'The logic underneath',
  logic: [
    '<b>Bass on the strong beat</b>: the ear takes the lowest note as the foundation of the chord. That is why every pattern starts with the root on beat 1: it tells the ear which chord is sounding, and the rest of the bar just fills in.',
    '<b>Open intervals in the bass</b>: low down, close notes (like a 3rd) sound muddy, because their harmonics sit too close and bump into each other. So a very low bass prefers the fifth and the octave, the most consonant intervals of the harmonic series (3:2 and 2:1). When a pattern uses the 3rd, like the Alberti bass, the hand usually plays closer to middle C.',
    '<b>The same shape on another chord</b>: the numbers 1, 3, 5 and 8 on the keys do not change from bar to bar. You learn the hand shape once and just move it: from I to IV, from IV to V.',
    '<b>Middle C as the border</b>: the left hand stays in the low half, below middle C, and the right hand in the high half. That way the hands do not collide. It is the same split as the grand staff: the lower staff (bass clef) usually belongs to the left hand.',
    '<b>Where the Alberti bass comes from</b>: it is named after Domenico Alberti, a Venetian composer of the first half of the 18th century. He did not invent the figure, but used it so much that the name stuck. On the harpsichord and early fortepiano the sound died away quickly; repeating the chord tones kept the harmony alive. Mozart opens his Sonata in C major, K. 545, with this pattern.',
  ],

  p1: (key: string) =>
    `In <b>${key}</b> the progression is I–IV–V–I. Which note does the left hand play on beat 1 of the IV bar? Tap it on the keyboard.`,
  p1Reveal: (name: string) =>
    `${name}, the root of IV (the chord built on the 4th degree). Every pattern starts with the root on beat 1, because the ear takes the lowest note as the foundation: it tells which chord is sounding.`,
  p2: (chord: string) =>
    `In the “bass + chord” pattern, the bass plays the root on beat 1 and, on beat 3, another letter of the chord: the one that sounds most consonant with the root. In the V bar (${chord}), which note is that?`,
  p2Reveal: (fifth: string) =>
    `${fifth}, the fifth of the chord. The bass alternates root (beat 1) and fifth (beat 3): the fifth is the most consonant interval after the octave, so the bass moves without getting muddy and without leaving the chord.`,
  transfer: (key: string) =>
    `Go to <b>${key}</b> and predict before playing: what is the bass on beat 1 of the V bar? And which note does the bass play on beat 3 of “bass + chord” in that bar?`,
  recap: (key: string, i: string[], iv: string, tonic: string): RecapText => ({
    oneLine: 'The left hand breaks the chord into a shape that repeats every bar: the root on beat 1 tells the ear which chord is sounding, and the other chord tones fill the rest of the bar so the harmony keeps going.',
    confusions: [
      '<b>Alberti bass × broken chord</b>: Alberti is 1-5-3-5 (low, high, middle, high), with the hand closed over the chord; the broken chord here is 1-5-8-5, open across the octave and without the 3rd.',
      `<b>Chord number × scale degree</b>: the 1, 3, 5 and 8 on the left-hand keys count from the root of the chord, not from the tonic. On IV in ${key}, “1” is ${iv}, not ${tonic}.`,
      '<b>Pattern × chord</b>: the pattern (the hand shape) stays the same all the time; what changes from bar to bar is the chord.',
    ],
    show: `In ${key}, play with the left hand ${i[0]}, ${i[2]}, ${i[1]}, ${i[2]} (Alberti on I). Without changing the hand shape, move it to ${iv} and repeat: that is IV. Show that the shape is the same and only the chord changed.`,
  }),
};

export const text = {
  pt,
  en,
  glossary: [
    ['Alberti bass', '', 'Baixo de Alberti', 'Acompanhamento de mão esquerda que toca as notas do acorde na ordem grave, agudo, meio, agudo (1-5-3-5). Leva o nome de Domenico Alberti (século XVIII).', 'A left-hand accompaniment that plays the chord tones in the order low, high, middle, high (1-5-3-5). Named after Domenico Alberti (18th century).'],
    ['Broken chord', 'arpeggio', 'Acorde quebrado, arpejo', 'As notas de um acorde tocadas uma de cada vez, em vez de juntas.', 'The notes of a chord played one at a time instead of together.'],
    ['Oom-pah', 'boom-chick', 'Baixo + acorde (um-pá)', 'Padrão de mão esquerda em que o baixo toca nos tempos fortes e o acorde nos fracos. Base das marchas, do ragtime e, em 3 tempos, das valsas.', 'A left-hand pattern where the bass plays on the strong beats and the chord on the weak ones. The basis of marches, ragtime and, in 3 beats, waltzes.'],
  ],
} satisfies LessonText<typeof pt>;
