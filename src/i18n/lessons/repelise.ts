import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

/* Note names in braces ({D#}) are replaced by the chosen notation; chord symbols always use letters. */
const pt = {
  meta: {
    nav: 'Für Elise',
    title: 'Für Elise',
    sub: 'Beethoven, WoO 59: o Mi–Ré♯–Mi em Lá menor',
    teaser: 'De onde vem o famoso “Mi–Ré♯–Mi”: bordadura cromática, i–V e a sensível da menor harmônica.',
  },
  name: 'Beethoven, Für Elise (WoO 59), começo',
  desc:
    'O começo de <i>Für Elise</i>, em Lá menor e compasso 3/8: a anacruse e os 8 primeiros compassos, com as notas e oitavas do original. A mão direita gira em volta de {E}; a esquerda responde com acordes quebrados no grave. O fim do compasso 8 foi <b>simplificado</b>: no original ele traz a casa de repetição, que leva de volta ao início.',
  source: 'Anacruse e compassos 1 a 8, notas do original; o fim do compasso 8 foi simplificado.',

  p1: {
    prompt: 'O motivo é {E}–{D#}–{E}. A peça está em Lá menor. O {D#} faz parte da escala de Lá menor (natural ou harmônica)?',
    options: ['Sim: é a sensível de Lá menor', 'Não: é uma nota cromática, vizinha de {E}'],
    answer: 'Não: é uma nota cromática, vizinha de {E}',
    reveal:
      'A sensível de Lá menor é {G#}, meio tom abaixo de {A}. O {D#} fica meio tom abaixo de {E}: não pertence à tonalidade, só enfeita o {E}, saindo e voltando. É uma bordadura cromática.',
  },
  p2: {
    prompt: 'No compasso 3 o acorde é {E} maior, o V de Lá menor: {E}, a 3ª e {B}. Qual é a 3ª desse acorde? Toque-a.',
    reveal:
      '{G#}: 4 semitons acima de {E}, uma 3ª maior. Em Lá menor natural a nota seria {G}, e o acorde seria Em, sem sensível. Subir o {G} para {G#} (a menor harmônica) dá ao V a nota que puxa meio tom para {A}.',
  },

  mirrorTitle: 'Dois semitons que puxam',
  mirrorNote:
    'Os dois “meio tom abaixo” da peça: {D#} encosta em {E} (enfeite da melodia) e {G#} encosta em {A} (a sensível da tonalidade). A tecla tracejada mostra para onde cada um vai.',
  mirrorAria: 'Teclado com Ré sustenido indo para Mi e Sol sustenido indo para Lá.',
  lgChrom: '{D#}: bordadura cromática, volta para {E}',
  lgLt: '{G#}: sensível de Lá menor (menor harmônica)',
  lgGoal: 'tracejado: a nota para onde cada um puxa',

  findings: [
    '<b>{E}–{D#}–{E} é uma bordadura cromática.</b> A melodia sai do {E}, desce meio tom para {D#} e volta. O {D#} não pertence a Lá menor: é um enfeite que encosta no {E} e o faz brilhar.',
    '<b>{E} é a dominante.</b> Em Lá menor, {E} é o 5º grau. O motivo fica girando na dominante, como uma pergunta, e depois passa por {B}–{D}–{C} até chegar ao {A}, a tônica, no compasso 2.',
    '<b>Só dois acordes: i e V.</b> Am e E se alternam: Am, E, Am (compassos 2 a 4) e de novo nos compassos 6 a 8. Tônica e dominante, nada mais.',
    '<b>O {G#} vem da menor harmônica.</b> O acorde de {E} (compassos 3 e 7) tem {G#}. Na menor natural seria {G}; o {G#} é a sensível que puxa meio tom para {A}.',
    '<b>A mão esquerda abre o acorde no grave.</b> {A}–{E}–{A}: fundamental, 5ª e oitava, em três notas rápidas. No acorde de {E}, {E}–{E}–{G#}: fundamental, oitava e 3ª. Notas afastadas no grave soam limpas.',
    '<b>Começa antes do compasso 1.</b> As duas primeiras notas, {E}–{D#}, são uma anacruse: levam ao {E} do tempo forte do compasso 1, que é onde o ouvido sente o começo.',
  ],

  logic: [
    '<b>Por que meio tom puxa tanto</b>: o semitom é a menor distância do teclado. Uma nota meio tom abaixo de outra soa como “quase chegando”, e o ouvido quer ouvi-la subir. É a mesma força da sensível {B} → {C} em Dó maior; o {D#} empresta essa força para o {E}.',
    '<b>Por que o {D#} não muda a tonalidade</b>: ele dura um instante, volta sempre para {E} e nunca forma um acorde. Por isso é um enfeite da melodia, e não uma nova tônica.',
    '<b>Por que a menor precisa do {G#}</b>: na menor natural, o 7º grau ({G}) fica um tom inteiro abaixo da tônica e não puxa. Subindo-o meio tom, o V vira maior ({E}–{G#}–{B}) e a volta ao i soa como chegada, igual ao V → I do maior.',
    '<b>Por que o motivo prende</b>: ele é curto, repete o mesmo vaivém e só depois chega à tônica. A tensão (dominante + semitom) vem antes do repouso ({A}), e esse caminho é o que o ouvido guarda.',
    '<b>A história</b>: Beethoven escreveu a peça por volta de 1810, mas ela só foi publicada em 1867, quarenta anos depois da morte dele, por Ludwig Nohl, a partir de um manuscrito que depois se perdeu. Até hoje não se sabe ao certo quem era “Elise”.',
  ],
  more: [4],

  recap: {
    oneLine:
      'O {E}–{D#}–{E} é a dominante de Lá menor enfeitada por uma bordadura cromática: o {D#} não é da tonalidade, só encosta meio tom abaixo do {E} e volta, e depois a frase chega ao {A}, a tônica.',
    confusions: [
      '<b>{D#} × {G#}</b>: os dois ficam meio tom abaixo de uma nota importante. {G#} é a sensível da tonalidade (puxa para {A}, a tônica); {D#} é só um enfeite do {E}.',
      '<b>Menor natural × harmônica</b>: a natural tem {G}; a harmônica sobe para {G#}, para o V ter sensível. Em Für Elise o {G#} aparece no acorde de {E}.',
      '<b>Anacruse × compasso 1</b>: as notas antes da primeira barra são a anacruse; o compasso 1 começa no primeiro tempo forte.',
    ],
    show:
      'Toque {E}–{D#}–{E}–{D#}–{E} e pare: soa suspenso. Agora siga com {B}–{D}–{C}–{A}: o {A} soa como chegada. Depois toque {G#}–{A} para mostrar a outra “puxada” de meio tom.',
  } satisfies RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Für Elise',
    title: 'Für Elise',
    sub: 'Beethoven, WoO 59: the E–D♯–E in A minor',
    teaser: 'Where the famous “E–D♯–E” comes from: chromatic neighbor, i–V and the leading tone of harmonic minor.',
  },
  name: 'Beethoven, Für Elise (WoO 59), opening',
  desc:
    'The opening of <i>Für Elise</i>, in A minor and 3/8 time: the pickup and the first 8 bars, with the original notes and octaves. The right hand circles around {E}; the left hand answers with broken chords in the bass. The end of bar 8 is <b>simplified</b>: in the original it carries the repeat ending that leads back to the start.',
  source: 'Pickup and bars 1 to 8, original notes; the end of bar 8 is simplified.',

  p1: {
    prompt: 'The motif is {E}–{D#}–{E}. The piece is in A minor. Is {D#} part of the A minor scale (natural or harmonic)?',
    options: ['Yes: it is the leading tone of A minor', 'No: it is a chromatic note, a neighbor of {E}'],
    answer: 'No: it is a chromatic note, a neighbor of {E}',
    reveal:
      'The leading tone of A minor is {G#}, a half step below {A}. {D#} sits a half step below {E}: it does not belong to the key, it only decorates {E}, leaving and coming back. It is a chromatic neighbor tone.',
  },
  p2: {
    prompt: 'In bar 3 the chord is {E} major, the V of A minor: {E}, the 3rd and {B}. Which note is its 3rd? Tap it.',
    reveal:
      '{G#}: 4 half steps above {E}, a major 3rd. In natural A minor the note would be {G}, and the chord would be Em, with no leading tone. Raising {G} to {G#} (harmonic minor) gives V the note that pulls a half step to {A}.',
  },

  mirrorTitle: 'Two half steps that pull',
  mirrorNote:
    'The two “half step below” notes of the piece: {D#} leans on {E} (a melodic decoration) and {G#} leans on {A} (the key’s leading tone). The dashed key shows where each one goes.',
  mirrorAria: 'Keyboard with D sharp going to E and G sharp going to A.',
  lgChrom: '{D#}: chromatic neighbor, returns to {E}',
  lgLt: '{G#}: leading tone of A minor (harmonic minor)',
  lgGoal: 'dashed: the note each one pulls to',

  findings: [
    '<b>{E}–{D#}–{E} is a chromatic neighbor.</b> The melody leaves {E}, drops a half step to {D#} and comes back. {D#} does not belong to A minor: it is a decoration that leans on {E} and makes it shine.',
    '<b>{E} is the dominant.</b> In A minor, {E} is degree 5. The motif keeps circling the dominant, like a question, and then moves through {B}–{D}–{C} to reach {A}, the tonic, in bar 2.',
    '<b>Only two chords: i and V.</b> Am and E alternate: Am, E, Am (bars 2 to 4) and again in bars 6 to 8. Tonic and dominant, nothing else.',
    '<b>The {G#} comes from harmonic minor.</b> The {E} chord (bars 3 and 7) has {G#}. In natural minor it would be {G}; {G#} is the leading tone pulling a half step to {A}.',
    '<b>The left hand spreads the chord low.</b> {A}–{E}–{A}: root, 5th and octave, in three quick notes. On the {E} chord, {E}–{E}–{G#}: root, octave and 3rd. Notes spaced apart in the bass sound clear.',
    '<b>It starts before bar 1.</b> The first two notes, {E}–{D#}, are a pickup (anacrusis): they lead to the {E} on the downbeat of bar 1, where the ear feels the start.',
  ],

  logic: [
    '<b>Why a half step pulls so much</b>: the half step is the smallest distance on the keyboard. A note a half step below another sounds “almost there”, and the ear wants to hear it rise. It is the same force as the leading tone {B} → {C} in C major; {D#} lends that force to {E}.',
    '<b>Why {D#} does not change the key</b>: it lasts an instant, always returns to {E} and never forms a chord. So it is a melodic decoration, not a new tonic.',
    '<b>Why minor needs {G#}</b>: in natural minor, degree 7 ({G}) sits a whole step below the tonic and does not pull. Raising it a half step makes V major ({E}–{G#}–{B}) and the return to i sounds like an arrival, like V → I in major.',
    '<b>Why the motif sticks</b>: it is short, repeats the same back-and-forth and only then reaches the tonic. Tension (dominant + half step) comes before rest ({A}), and that path is what the ear keeps.',
    '<b>The history</b>: Beethoven wrote the piece around 1810, but it was only published in 1867, forty years after his death, by Ludwig Nohl, from a manuscript that was later lost. To this day nobody knows for sure who “Elise” was.',
  ],
  more: [4],

  recap: {
    oneLine:
      'The {E}–{D#}–{E} is the dominant of A minor decorated by a chromatic neighbor: {D#} is not in the key, it only leans a half step below {E} and comes back, and then the phrase reaches {A}, the tonic.',
    confusions: [
      '<b>{D#} vs {G#}</b>: both sit a half step below an important note. {G#} is the key’s leading tone (it pulls to {A}, the tonic); {D#} is only a decoration of {E}.',
      '<b>Natural vs harmonic minor</b>: natural minor has {G}; harmonic minor raises it to {G#}, so that V has a leading tone. In Für Elise the {G#} appears in the {E} chord.',
      '<b>Pickup vs bar 1</b>: the notes before the first bar line are the pickup; bar 1 starts on the first downbeat.',
    ],
    show:
      'Play {E}–{D#}–{E}–{D#}–{E} and stop: it sounds suspended. Now go on with {B}–{D}–{C}–{A}: the {A} sounds like an arrival. Then play {G#}–{A} to show the other half-step pull.',
  } satisfies RecapText,
};

export const text = {
  pt,
  en,
  glossary: [
    ['Anacrusis', 'pickup, upbeat', 'Anacruse', 'Nota ou notas que vêm antes do primeiro tempo forte, num compasso incompleto, e levam até ele.', 'One or more notes before the first downbeat, in an incomplete bar, leading into it.'],
    ['Motif', 'motive', 'Motivo', 'A menor ideia musical reconhecível (poucas notas com um ritmo próprio) que a peça repete e transforma.', 'The smallest recognizable musical idea (a few notes with their own rhythm) that a piece repeats and transforms.'],
  ],
} satisfies LessonText<typeof pt>;
