import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

const pt = {
  meta: {
    nav: 'Pulso e compasso',
    title: 'Pulso, compasso e figuras',
    sub: 'Contar o tempo antes de contar as notas',
    teaser: 'Tempos fortes e fracos, a fórmula de compasso e por que cada figura vale a metade da anterior.',
  },
  desc:
    'Até aqui tudo foi altura: quais notas. O ritmo responde a outra pergunta: quando cada nota começa e quanto dura. Tudo parte de um pulso regular, como um relógio. O compasso agrupa os pulsos, e as figuras dividem o tempo ao meio, de novo e de novo.',

  pulseTitle: '1. O pulso e o compasso',
  pulseHint:
    'Ligue o metrônomo. Cada clique é um tempo. O primeiro de cada grupo é o tempo forte (verde-escuro); os outros são fracos (verde-claro). Troque o compasso e ouça o agrupamento mudar.',
  meterPick: 'Compasso',
  meterRead: {
    '2/4': '2/4: dois tempos, cada um vale uma semínima. Forte–fraco, como uma marcha: ESQUER-da, ESQUER-da.',
    '3/4': '3/4: três tempos de semínima. Forte–fraco–fraco, como uma valsa: UM-dois-três.',
    '4/4': '4/4: quatro tempos de semínima. Forte–fraco–meio forte–fraco. É o compasso mais comum do pop e do rock.',
    '6/8': '6/8: seis colcheias agrupadas em 2 grupos de 3. É um compasso composto: o pulso que se sente é o de cada grupo, e cada pulso se divide em 3, não em 2.',
  } as Record<string, string>,
  metroOn: 'Metrônomo',
  metroOff: 'Parar',
  bpm: (n: number) => `Andamento: ${n} BPM (batidas por minuto)`,
  lgStrong: 'tempo forte',
  lgMedium: 'meio forte',
  lgWeak: 'tempo fraco',
  lgNow: 'tempo atual',
  lgOver: 'não cabe no compasso',

  treeTitle: '2. As figuras: sempre a metade',
  treeHint:
    'Cada figura vale a metade da anterior. Uma semibreve = 2 mínimas = 4 semínimas = 8 colcheias = 16 semicolcheias. A grade mostra quantas de cada cabem num compasso. Escolha uma figura para ouvir o compasso cheio dela.',
  values: { 1: 'semibreve', 2: 'mínima', 4: 'semínima', 8: 'colcheia', 16: 'semicolcheia' } as Record<number, string>,
  frac: (v: number) => (v === 1 ? '1' : `1/${v}`),
  fitRead: (n: number, name: string, names: string, meter: string, rest: string) =>
    n === 0
      ? `A ${name} não cabe inteira em ${meter}: ela é maior que o compasso todo.`
      : `Em ${meter} cabem ${n} ${n === 1 ? name : names}${rest ? `, e sobra ${rest}` : ''}.`,
  plural: { 1: 'semibreves', 2: 'mínimas', 4: 'semínimas', 8: 'colcheias', 16: 'semicolcheias' } as Record<number, string>,
  restText: (counts: number, unitName: string) => (counts === 1 ? `1 tempo (uma ${unitName})` : `${counts} tempos`),
  overLabel: 'não cabe',
  playValue: (name: string) => `Ouvir compasso de ${name}s`,
  gridAria: (meter: string) => `Grade do compasso ${meter} com os tempos fortes e fracos e as figuras de semibreve a semicolcheia.`,

  kbdTitle: '3. O ritmo no teclado',
  kbdHint: (key: string) =>
    `O ritmo não depende da tonalidade: as mesmas durações servem para qualquer nota. Aqui ele toca no acorde de ${key}. No tempo forte soa o baixo; as teclas acendem a cada nota.`,
  kbdAria: (key: string) => `Teclado com o acorde de ${key}: tônica, 3ª e 5ª.`,
  lgRoot: 'tônica (o baixo no tempo forte)',
  lgChord: '3ª e 5ª do acorde',

  tapTitle: '4. Sua vez: toque o ritmo',
  tapHint:
    'Escolha um ritmo e ouça. Depois aperte Começar: o metrônomo conta um compasso inteiro de preparação e, no compasso seguinte, você toca o ritmo no botão grande. No fim, cada tempo mostra se você tocou a quantidade certa de notas nele.',
  patternPick: 'Ritmo',
  listen: 'Ouvir o ritmo',
  start: 'Começar',
  pad: 'Toque aqui',
  padCount: (n: number) => `Preparação: ${n}`,
  padGo: 'Agora!',
  padIdle: 'Aperte Começar',
  result: (ok: number, total: number) =>
    ok === total ? `Perfeito: ${ok} de ${total} tempos certos.` : `${ok} de ${total} tempos certos. Ouça de novo e tente outra vez.`,
  perCount: (got: number, want: number) => `${got}/${want}`,
  rowWant: 'ritmo',
  rowGot: 'você',
  feedbackAria: 'Resultado por tempo: notas tocadas e notas esperadas.',

  whyTitle: 'A lógica por baixo',
  why: [
    '<b>Por que sempre a metade</b>: dividir em dois é a divisão mais simples de sentir (andar é esquerda-direita; o pulso dividido é “um-e”) e de somar. Com uma regra só, cada figura nova é a anterior partida ao meio, então duas iguais sempre completam a de cima, e qualquer figura cabe um número inteiro de vezes nas maiores. Por isso o número de baixo da fórmula de compasso é uma potência de 2: 1, 2, 4, 8, 16.',
    '<b>Os dois números do compasso</b>: o de cima diz quantos tempos; o de baixo diz qual figura vale um tempo (4 = semínima, 8 = colcheia). 3/4 é “3 semínimas por compasso”. Não é uma fração para simplificar: 3/4 e 6/8 têm a mesma duração total, mas outro agrupamento.',
    '<b>E quando precisamos de 3?</b> Em 2/4, 3/4 e 4/4 cada tempo se divide em 2. Em 6/8 os tempos sentidos são 2 grupos de 3 colcheias: é a diferença entre “um-e-dois-e” e “um-e-a-dois-e-a”. A escrita também tem o ponto e a tercina para o 3 (próxima aula).',
    '<b>Tempo forte</b>: é onde a harmonia costuma mudar e onde caem as notas importantes da melodia. A barra de compasso na partitura existe para mostrar onde fica o próximo tempo forte.',
    '<b>Andamento</b>: o BPM só muda a velocidade do pulso. As proporções entre as figuras continuam as mesmas: uma mínima sempre dura duas semínimas, em qualquer andamento.',
    '<b>De onde vêm os nomes</b>: da notação medieval. Breve quer dizer “curta”, semibreve é “meia breve” e mínima, “a menor”: naquela época eram notas curtas. Ali uma figura podia valer 3 ou 2 da seguinte; a divisão sempre por 2 se firmou aos poucos e virou a regra da escrita moderna.',
  ],
  p1: (meter: string) => `Em <b>${meter}</b>, quantas colcheias cabem num compasso?`,
  p1r: (meter: string, counts: number, unit: number, n: number) =>
    unit === 4
      ? `Em ${meter} há ${counts} tempos de semínima, e cada semínima vale 2 colcheias (sempre a metade): ${counts} × 2 = ${n}.`
      : `Em ${meter} o número de baixo, 8, diz que cada unidade contada já é uma colcheia: são ${n}.`,
  p2: '3/4 e 6/8 duram o mesmo: seis colcheias. Então qual é a diferença entre eles?',
  p2opts: ['O agrupamento das colcheias', '6/8 é mais rápido', '6/8 tem mais notas'],
  p2r: 'Em 3/4 as seis colcheias se juntam de 2 em 2 (3 tempos: UM-e-dois-e-três-e); em 6/8, de 3 em 3 (2 tempos: UM-e-a-dois-e-a). Mesma duração, outro balanço. Troque o compasso abaixo e ouça.',
  recap: {
    oneLine: 'Porque dividir em dois é o jeito mais simples de sentir e de somar o tempo: cada figura é a anterior partida ao meio, duas iguais sempre completam a de cima, e para dividir em 3 existem o ponto, a tercina e o compasso composto.',
    confusions: [
      '<b>Andamento × figura</b>: o BPM muda a velocidade de tudo; a figura diz quanto a nota dura em relação ao pulso.',
      '<b>3/4 × 6/8</b>: mesma duração total, agrupamento diferente: 3 tempos que se dividem em 2 contra 2 tempos que se dividem em 3.',
      '<b>Número de baixo</b>: não é “quantas notas”; é qual figura vale um tempo (4 = semínima, 8 = colcheia).',
    ],
    show: 'Toque a tônica em semínimas contando 1-2-3-4 em voz alta, com o 1 mais forte. Sem mudar o pulso, toque colcheias dizendo “um-e-dois-e”, e depois semicolcheias: cada vez, o dobro de notas no mesmo tempo.',
  } as RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Pulse and meter',
    title: 'Pulse, meter and note values',
    sub: 'Counting time before counting notes',
    teaser: 'Strong and weak beats, the time signature and why each note value is half of the one before.',
  },
  desc:
    'So far everything was pitch: which notes. Rhythm answers a different question: when each note starts and how long it lasts. It all starts from a steady pulse, like a clock. The meter groups the pulses, and the note values split time in half, again and again.',

  pulseTitle: '1. Pulse and meter',
  pulseHint:
    'Turn on the metronome. Each click is a beat. The first of each group is the strong beat (dark green); the others are weak (light green). Change the meter and hear the grouping change.',
  meterPick: 'Meter',
  meterRead: {
    '2/4': '2/4: two beats, each worth a quarter note. Strong–weak, like a march: LEFT-right, LEFT-right.',
    '3/4': '3/4: three quarter-note beats. Strong–weak–weak, like a waltz: ONE-two-three.',
    '4/4': '4/4: four quarter-note beats. Strong–weak–medium–weak. The most common meter in pop and rock.',
    '6/8': '6/8: six eighth notes grouped in 2 groups of 3. It is a compound meter: the pulse you feel is each group, and each pulse splits into 3, not 2.',
  },
  metroOn: 'Metronome',
  metroOff: 'Stop',
  bpm: (n: number) => `Tempo: ${n} BPM (beats per minute)`,
  lgStrong: 'strong beat',
  lgMedium: 'medium beat',
  lgWeak: 'weak beat',
  lgNow: 'current beat',
  lgOver: 'does not fit in the bar',

  treeTitle: '2. Note values: always half',
  treeHint:
    'Each value is half of the previous one. One whole note = 2 halves = 4 quarters = 8 eighths = 16 sixteenths. The grid shows how many of each fit in one bar. Pick a value to hear a bar full of it.',
  values: { 1: 'whole note', 2: 'half note', 4: 'quarter note', 8: 'eighth note', 16: 'sixteenth note' },
  frac: (v: number) => (v === 1 ? '1' : `1/${v}`),
  fitRead: (n: number, name: string, names: string, meter: string, rest: string) =>
    n === 0
      ? `A ${name} does not fit whole in ${meter}: it is longer than the entire bar.`
      : `${n} ${n === 1 ? name : names} fit in ${meter}${rest ? `, with ${rest} left over` : ''}.`,
  plural: { 1: 'whole notes', 2: 'half notes', 4: 'quarter notes', 8: 'eighth notes', 16: 'sixteenth notes' },
  restText: (counts: number, unitName: string) => (counts === 1 ? `1 beat (a ${unitName})` : `${counts} beats`),
  overLabel: 'no fit',
  playValue: (name: string) => `Hear a bar of ${name}s`,
  gridAria: (meter: string) => `Grid of a ${meter} bar with strong and weak beats and the note values from whole to sixteenth.`,

  kbdTitle: '3. The rhythm on the keyboard',
  kbdHint: (key: string) =>
    `Rhythm does not depend on the key: the same durations work for any note. Here it plays on the ${key} chord. On the strong beat the bass sounds; the keys light up on every note.`,
  kbdAria: (key: string) => `Keyboard with the ${key} chord: root, third and fifth.`,
  lgRoot: 'root (the bass on the strong beat)',
  lgChord: 'third and fifth of the chord',

  tapTitle: '4. Your turn: tap the rhythm',
  tapHint:
    'Pick a rhythm and listen. Then press Start: the metronome counts one full bar to get ready and, in the next bar, you tap the rhythm on the big button. At the end, each beat shows whether you tapped the right number of notes in it.',
  patternPick: 'Rhythm',
  listen: 'Hear the rhythm',
  start: 'Start',
  pad: 'Tap here',
  padCount: (n: number) => `Get ready: ${n}`,
  padGo: 'Now!',
  padIdle: 'Press Start',
  result: (ok: number, total: number) =>
    ok === total ? `Perfect: ${ok} of ${total} beats right.` : `${ok} of ${total} beats right. Listen again and try once more.`,
  perCount: (got: number, want: number) => `${got}/${want}`,
  rowWant: 'rhythm',
  rowGot: 'you',
  feedbackAria: 'Result per beat: notes tapped and notes expected.',

  whyTitle: 'The logic underneath',
  why: [
    '<b>Why always half</b>: splitting in two is the simplest division to feel (walking is left-right; a split pulse is “one-and”) and to add up. With a single rule, each new value is the previous one cut in half, so two equal values always make the one above, and every value fits a whole number of times into the bigger ones. That is why the bottom number of a time signature is a power of 2: 1, 2, 4, 8, 16.',
    '<b>The two numbers of the meter</b>: the top one says how many beats; the bottom one says which note value gets one beat (4 = quarter, 8 = eighth). 3/4 means “3 quarter notes per bar”. It is not a fraction to simplify: 3/4 and 6/8 last the same in total but group the beats differently.',
    '<b>And when we need 3?</b> In 2/4, 3/4 and 4/4 each beat splits into 2. In 6/8 the felt beats are 2 groups of 3 eighths: the difference between “one-and-two-and” and “one-and-a-two-and-a”. Notation also has the dot and the triplet for 3 (next lesson).',
    '<b>Strong beat</b>: it is where the harmony usually changes and where the important melody notes fall. The bar line in sheet music exists to show where the next strong beat is.',
    '<b>Tempo</b>: BPM only changes the speed of the pulse. The proportions between the values stay the same: a half note always lasts two quarter notes, at any tempo.',
    '<b>Where the names come from</b>: medieval notation. The Portuguese names keep the old ones: breve means “short”, semibreve “half a breve” and mínima “the smallest”; back then they were short notes. In that system a value could be worth 3 or 2 of the next; division always by 2 settled in gradually and became the rule of modern notation.',
  ],
  p1: (meter: string) => `In <b>${meter}</b>, how many eighth notes fit in one bar?`,
  p1r: (meter: string, counts: number, unit: number, n: number) =>
    unit === 4
      ? `${meter} has ${counts} quarter-note beats, and each quarter is worth 2 eighths (always half): ${counts} × 2 = ${n}.`
      : `In ${meter} the bottom number, 8, says each counted unit is already an eighth: there are ${n}.`,
  p2: '3/4 and 6/8 last the same: six eighth notes. So what is the difference between them?',
  p2opts: ['How the eighths are grouped', '6/8 is faster', '6/8 has more notes'],
  p2r: 'In 3/4 the six eighths group in 2s (3 beats: ONE-and-two-and-three-and); in 6/8, in 3s (2 beats: ONE-and-a-two-and-a). Same length, a different swing. Change the meter below and listen.',
  recap: {
    oneLine: 'Because splitting in two is the simplest way to feel and add up time: each value is the previous one cut in half, two equal values always make the one above, and to split in 3 there are the dot, the triplet and compound meter.',
    confusions: [
      '<b>Tempo vs note value</b>: BPM changes the speed of everything; the note value says how long a note lasts relative to the pulse.',
      '<b>3/4 vs 6/8</b>: same total length, different grouping: 3 beats split in 2 versus 2 beats split in 3.',
      '<b>Bottom number</b>: it is not “how many notes”; it is which value gets one beat (4 = quarter, 8 = eighth).',
    ],
    show: 'Play the tonic in quarter notes counting 1-2-3-4 out loud, with 1 the strongest. Without changing the pulse, play eighths saying “one-and-two-and”, then sixteenths: each time, twice the notes in the same beat.',
  },
};

export const text = {
  pt,
  en,
  glossary: [
    ['Beat', 'pulse', 'Pulso, tempo', 'A batida regular que se sente na música, como um relógio. Cada clique do metrônomo é um tempo.', 'The steady beat you feel in music, like a clock. Each metronome click is one beat.'],
    ['Time signature', 'meter', 'Fórmula de compasso', 'Os dois números no início da pauta: o de cima diz quantos tempos há no compasso, o de baixo qual figura vale um tempo.', 'The two numbers at the start of the staff: the top says how many beats are in a bar, the bottom which note value gets one beat.'],
    ['Downbeat', 'strong beat', 'Tempo forte', 'O primeiro tempo do compasso, o mais acentuado. Vem logo depois da barra de compasso.', 'The first beat of the bar, the most accented one. It comes right after the bar line.'],
    ['Note value', 'duration', 'Figura (rítmica)', 'O símbolo que diz quanto uma nota dura: semibreve, mínima, semínima, colcheia, semicolcheia. Cada uma vale a metade da anterior.', 'The symbol that says how long a note lasts: whole, half, quarter, eighth, sixteenth. Each is worth half of the one before.'],
    ['Compound meter', 'simple meter', 'Compasso composto', 'Compasso em que cada tempo sentido se divide em 3 (como 6/8). No compasso simples (2/4, 3/4, 4/4) cada tempo se divide em 2.', 'A meter whose felt beats split into 3 (like 6/8). In simple meter (2/4, 3/4, 4/4) each beat splits into 2.'],
    ['Tempo', 'BPM', 'Andamento', 'A velocidade do pulso, medida em batidas por minuto (BPM).', 'The speed of the pulse, measured in beats per minute (BPM).'],
  ],
} satisfies LessonText<typeof pt>;
