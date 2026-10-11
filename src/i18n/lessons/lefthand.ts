import type { LessonText } from '../lessonText';

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
      'No tempo 1 o baixo toca a fundamental; nos tempos 2 e 4 entra o acorde; no tempo 3 o baixo vai para a 5ª do acorde. É o “um-pá” das marchas, das valsas e do ragtime.',
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
    '<b>Intervalos abertos no grave</b>: no grave, notas muito próximas embolam, porque os harmônicos delas se esbarram. Por isso a mão esquerda prefere a 5ª e a 8ª, os intervalos mais consonantes da série harmônica (3:2 e 2:1), e deixa a 3ª para o meio do teclado.',
    '<b>O mesmo desenho em outro acorde</b>: os números 1, 3, 5 e 8 nas teclas não mudam de um compasso para outro. Você aprende o formato da mão uma vez e só o desloca: do I para o IV, do IV para o V.',
    '<b>Dó central como fronteira</b>: a mão esquerda fica na metade grave, abaixo do Dó central, e a direita na metade aguda. Assim as mãos não se esbarram, e é por isso que a pauta do piano tem duas partes: a de baixo (clave de fá) é quase sempre da mão esquerda.',
    '<b>Origem do baixo de Alberti</b>: leva o nome de Domenico Alberti, compositor veneziano do início do século XVIII. No cravo e no pianoforte da época o som morria rápido; repetir as notas do acorde mantinha a harmonia viva. Mozart abre a Sonata em Dó maior, K. 545, com esse padrão.',
  ],
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
      'On beat 1 the bass plays the root; on beats 2 and 4 the chord comes in; on beat 3 the bass moves to the fifth of the chord. It is the “oom-pah” of marches, waltzes and ragtime.',
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
    '<b>Open intervals in the bass</b>: low down, close notes get muddy because their harmonics bump into each other. So the left hand prefers the fifth and the octave, the most consonant intervals of the harmonic series (3:2 and 2:1), and leaves the third for the middle of the keyboard.',
    '<b>The same shape on another chord</b>: the numbers 1, 3, 5 and 8 on the keys do not change from bar to bar. You learn the hand shape once and just move it: from I to IV, from IV to V.',
    '<b>Middle C as the border</b>: the left hand stays in the low half, below middle C, and the right hand in the high half. That way the hands do not collide, and it is why piano music has two staves: the lower one (bass clef) is almost always the left hand.',
    '<b>Where the Alberti bass comes from</b>: it is named after Domenico Alberti, a Venetian composer of the early 18th century. On the harpsichord and early fortepiano the sound died away quickly; repeating the chord tones kept the harmony alive. Mozart opens his Sonata in C major, K. 545, with this pattern.',
  ],
};

export const text = {
  pt,
  en,
  glossary: [
    ['Alberti bass', '', 'Baixo de Alberti', 'Acompanhamento de mão esquerda que toca as notas do acorde na ordem grave, agudo, meio, agudo (1-5-3-5). Leva o nome de Domenico Alberti (século XVIII).', 'A left-hand accompaniment that plays the chord tones in the order low, high, middle, high (1-5-3-5). Named after Domenico Alberti (18th century).'],
    ['Broken chord', 'arpeggio', 'Acorde quebrado, arpejo', 'As notas de um acorde tocadas uma de cada vez, em vez de juntas.', 'The notes of a chord played one at a time instead of together.'],
    ['Oom-pah', 'stride bass', 'Baixo + acorde (um-pá)', 'Padrão de mão esquerda em que o baixo toca nos tempos fortes e o acorde nos fracos. Base das marchas, valsas e do ragtime.', 'A left-hand pattern where the bass plays on the strong beats and the chord on the weak ones. The basis of marches, waltzes and ragtime.'],
  ],
} satisfies LessonText<typeof pt>;
