import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

type S = string;
type ModeNames = Record<'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian', string>;

const names: ModeNames = {
  lydian: 'lídio', ionian: 'jônio', mixolydian: 'mixolídio', dorian: 'dórico', aeolian: 'eólio', phrygian: 'frígio', locrian: 'lócrio',
};

const pt = {
  meta: {
    nav: 'Modos gregos',
    title: 'Os modos gregos',
    sub: 'sete pontos de partida da mesma janela',
    teaser: 'Do lídio ao lócrio: a janela de quintas, do mais claro ao mais escuro.',
  },
  names,
  cap: (s: S) => s.charAt(0).toUpperCase() + s.slice(1),
  modeOn: (note: S, mode: S) => `${note} ${mode}`,
  desc: 'A tonalidade tem sete notas. Se você toca essas mesmas sete notas, mas trata outra delas como tônica (começa e termina nela, insiste nela no baixo), a música muda de cor. Cada ponto de partida é um modo. São sete, e dá para ordená-los do mais brilhante ao mais escuro.',
  pick: 'Escolha o modo (do mais brilhante ao mais escuro)',
  charMaj: 'maior',
  charMin: 'menor',
  charSmall: (ref: S, alt: S) => (alt ? `${ref} ${alt}` : `= ${ref}`),
  view: 'Ver',
  viewRel: 'Mesmas teclas',
  viewPar: 'Mesma tônica',
  relNow: (mode: S, notes: S) => `${mode}: ${notes}`,
  parNow: (mode: S, notes: S) => `${mode}: ${notes}`,
  lgTonic: 'tônica do modo (1)',
  lgChar: 'nota característica',
  lgScale: 'notas da escala',
  lgAlt: 'grau alterado em relação à maior',
  lgGhost: 'tracejado: onde a nota estava na escala maior',
  lineTitle: 'Na linha de quintas',
  lineKey: (key: S) => `janela de ${key}`,
  lineMode: (mode: S) => `janela de ${mode}`,
  lgLineIn: 'notas do modo',
  lgLineOut: 'tracejado: notas da maior que saíram da janela',
  play: 'Ouvir com bordão',
  dronesHint: 'O bordão (tônica e quinta graves, segurados) é o que faz o ouvido aceitar a nova tônica. Sem ele, as notas soam como a tonalidade maior de sempre.',
  relRead: (mode: S, key: S, deg: number) => `${mode} usa as teclas de ${key}, começando no ${deg}º grau.`,
  parRead: (mode: S, alts: S, n: number) =>
    n === 0 ? `${mode} é a própria escala maior.` : `${mode}: em relação à escala maior, muda${n > 1 ? 'm' : ''} ${alts}.`,
  and: ' e ',
  predict: (key: S, t: S) => `Toque só as teclas de ${key}, mas começando e terminando em ${t} (o 2º grau). Comparada com ${t} menor natural, uma única nota fica diferente. Qual? Toque-a.`,
  predictReveal: (n6: S, t: S, b6: S) => `${n6}: em ${t} menor natural o 6º grau seria ${b6}. Nas teclas da tonalidade ele fica meio tom acima. Esse 6º grau elevado é a nota característica do modo dórico: mesmas teclas, outra tônica, outra ordem de tons e semitons.`,
  transfer: (k: S) => `Em ${k}: comece no 2º grau e toque só as teclas da tonalidade. Qual nota separa esse dórico da menor natural na mesma tônica?`,
  recap: {
    oneLine: 'Você toca outro modo: as mesmas sete notas com outra tônica mudam a ordem de tons e semitons a partir dela (de Ré a Ré nas teclas brancas é o dórico), e por isso a cor da escala muda.',
    confusions: [
      '<b>Mesmas teclas × mesma tônica:</b> Ré dórico usa as teclas de Dó maior; Dó dórico usa outra armadura (Mi♭ e Si♭). Os dois são dórico, vistos de lados diferentes.',
      '<b>Modo × só “começar em outra nota”:</b> sem um bordão ou uma cadência na nova tônica, o ouvido volta para a tonalidade maior de sempre.',
      '<b>Dórico × eólio:</b> os dois são menores; só o 6º grau muda (6 natural no dórico, ♭6 no eólio).',
    ],
    show: 'Segure Ré e Lá graves com a mão esquerda e toque só teclas brancas de Ré a Ré. Depois troque o bordão por Mi e Si e toque de Mi a Mi: é o frígio, mais escuro.',
  } satisfies RecapText,
  whyTitle: 'A lógica por trás',
  why: (lyd: S, loc: S) => [
    `<b>Mesmas teclas, outro ponto de partida:</b> os modos usam a fórmula T T S T T T S girada. Começar no 2º grau dá o dórico (T S T T T S T), no 6º dá o eólio, que é a menor natural da aula anterior.`,
    `<b>Do brilhante ao escuro:</b> na linha de quintas, cada modo é a mesma janela de 7 quintas com a tônica em outra posição. No ${lyd} a tônica está na ponta esquerda da janela: todas as outras notas ficam à sua direita, do lado dos sustenidos. No ${loc} ela está na ponta direita. Deslizar a janela uma casa para a esquerda troca uma nota por outra meio tom abaixo (a mesma regra do círculo), e o modo fica um pouco mais escuro.`,
    `<b>A nota característica:</b> cada modo difere da maior ou da menor em uma nota só. Lídio: 4 elevado. Mixolídio: 7 abaixado. Dórico: 6 elevado (comparado à menor). Frígio: 2 abaixado. Lócrio: 2 e 5 abaixados. Ouça e toque essa nota para sentir o modo.`,
    `<b>Por que o lócrio é raro:</b> sua 5ª é diminuta (6 semitons, o trítono). Sem quinta justa, o acorde de tônica é diminuto e não soa como “casa”.`,
    `<b>De onde vêm os nomes:</b> vêm de povos e regiões da Grécia antiga (dórios, frígios, lídios, jônios, eólios). Os teóricos medievais reaproveitaram os nomes para os modos da Igreja, e no caminho eles passaram a designar escalas diferentes das gregas. Glarean, no <i>Dodecachordon</i> (1547), acrescentou o jônio e o eólio, que viraram a maior e a menor.`,
    `<b>Onde ouvir:</b> dórico em “Scarborough Fair” e em “So What” (Miles Davis); mixolídio em “Norwegian Wood” (Beatles); lídio no tema dos Simpsons; frígio no flamenco (muitas vezes com a 3ª maior).`,
  ],
};

const en: typeof pt = {
  meta: {
    nav: 'Greek modes',
    title: 'The Greek modes',
    sub: 'seven starting points of the same window',
    teaser: 'From Lydian to Locrian: the window of fifths, from brightest to darkest.',
  },
  names: {
    lydian: 'Lydian', ionian: 'Ionian', mixolydian: 'Mixolydian', dorian: 'Dorian', aeolian: 'Aeolian', phrygian: 'Phrygian', locrian: 'Locrian',
  },
  cap: (s: S) => s.charAt(0).toUpperCase() + s.slice(1),
  modeOn: (note: S, mode: S) => `${note} ${mode}`,
  desc: 'A key has seven notes. If you play those same seven notes but treat another one as the tonic (start and end on it, stress it in the bass), the music changes color. Each starting point is a mode. There are seven, and they can be ordered from brightest to darkest.',
  pick: 'Choose the mode (brightest to darkest)',
  charMaj: 'major',
  charMin: 'minor',
  charSmall: (ref: S, alt: S) => (alt ? `${ref} ${alt}` : `= ${ref}`),
  view: 'View',
  viewRel: 'Same keys',
  viewPar: 'Same tonic',
  relNow: (mode: S, notes: S) => `${mode}: ${notes}`,
  parNow: (mode: S, notes: S) => `${mode}: ${notes}`,
  lgTonic: 'tonic of the mode (1)',
  lgChar: 'characteristic note',
  lgScale: 'scale notes',
  lgAlt: 'degree changed compared with major',
  lgGhost: 'dashed: where the note was in the major scale',
  lineTitle: 'On the line of fifths',
  lineKey: (key: S) => `window of ${key}`,
  lineMode: (mode: S) => `window of ${mode}`,
  lgLineIn: 'notes of the mode',
  lgLineOut: 'dashed: major-scale notes that left the window',
  play: 'Hear it over a drone',
  dronesHint: 'The drone (low tonic and fifth, held) is what makes the ear accept the new tonic. Without it, the notes sound like the usual major key.',
  relRead: (mode: S, key: S, deg: number) => `${mode} uses the keys of ${key}, starting on degree ${deg}.`,
  parRead: (mode: S, alts: S, n: number) =>
    n === 0 ? `${mode} is the major scale itself.` : `${mode}: compared with the major scale, ${alts} ${n > 1 ? 'change' : 'changes'}.`,
  and: ' and ',
  predict: (key: S, t: S) => `Play only the keys of ${key}, but start and end on ${t} (degree 2). Compared with ${t} natural minor, exactly one note is different. Which one? Tap it.`,
  predictReveal: (n6: S, t: S, b6: S) => `${n6}: in ${t} natural minor degree 6 would be ${b6}. On the keys of the key it is a half step higher. That raised degree 6 is the characteristic note of the Dorian mode: same keys, another tonic, another order of whole and half steps.`,
  transfer: (k: S) => `In ${k}: start on degree 2 and play only the keys of the key. Which note sets this Dorian apart from the natural minor on the same tonic?`,
  recap: {
    oneLine: 'You play another mode: the same seven notes with another tonic change the order of whole and half steps above it (D to D on the white keys is Dorian), and that is why the color of the scale changes.',
    confusions: [
      '<b>Same keys vs same tonic:</b> D Dorian uses the keys of C major; C Dorian uses another key signature (E♭ and B♭). Both are Dorian, seen from different sides.',
      '<b>Mode vs just “starting on another note”:</b> without a drone or a cadence on the new tonic, the ear falls back to the usual major key.',
      '<b>Dorian vs Aeolian:</b> both are minor; only degree 6 changes (natural 6 in Dorian, ♭6 in Aeolian).',
    ],
    show: 'Hold a low D and A with the left hand and play only white keys from D to D. Then switch the drone to E and B and play from E to E: that is Phrygian, darker.',
  } satisfies RecapText,
  whyTitle: 'The logic underneath',
  why: (lyd: S, loc: S) => [
    `<b>Same keys, another starting point:</b> the modes use the W W H W W W H formula rotated. Starting on degree 2 gives Dorian (W H W W W H W); on degree 6 it gives Aeolian, the natural minor from the previous lesson.`,
    `<b>From bright to dark:</b> on the line of fifths, each mode is the same window of 7 fifths with the tonic in a different position. In ${lyd} the tonic is at the left end of the window: every other note lies to its right, on the sharp side. In ${loc} it is at the right end. Sliding the window one slot to the left swaps one note for another a half step lower (the same rule as the circle), and the mode gets a little darker.`,
    `<b>The characteristic note:</b> each mode differs from major or minor in just one note. Lydian: raised 4. Mixolydian: lowered 7. Dorian: raised 6 (compared with minor). Phrygian: lowered 2. Locrian: lowered 2 and 5. Listen for that note to feel the mode.`,
    `<b>Why Locrian is rare:</b> its 5th is diminished (6 half steps, the tritone). With no perfect fifth, the tonic chord is diminished and does not sound like “home”.`,
    `<b>Where the names come from:</b> they come from peoples and regions of ancient Greece (Dorians, Phrygians, Lydians, Ionians, Aeolians). Medieval theorists reused the names for the church modes, and along the way they came to mean scales different from the Greek ones. Glarean, in the <i>Dodecachordon</i> (1547), added Ionian and Aeolian, which became major and minor.`,
    `<b>Where to hear them:</b> Dorian in “Scarborough Fair” and “So What” (Miles Davis); Mixolydian in “Norwegian Wood” (Beatles); Lydian in The Simpsons theme; Phrygian in flamenco (often with a major 3rd).`,
  ],
};

export const text = {
  pt,
  en,
  glossary: [
    ['Mode', 'church mode', 'Modo', 'Uma escala formada pelas notas de uma tonalidade maior, começando em outro grau. Os sete modos são jônio, dórico, frígio, lídio, mixolídio, eólio e lócrio.', 'A scale made of the notes of a major key, starting on another degree. The seven modes are Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian and Locrian.'],
    ['Characteristic note', '', 'Nota característica', 'A nota que distingue um modo da escala maior ou menor mais parecida (o 4 elevado do lídio, o 6 elevado do dórico).', 'The note that sets a mode apart from the most similar major or minor scale (Lydian’s raised 4, Dorian’s raised 6).'],
    ['Drone', 'pedal', 'Bordão', 'Uma nota (ou quinta) grave sustentada por baixo da melodia. Fixa a tônica para o ouvido.', 'A low note (or fifth) held under the melody. It fixes the tonic for the ear.'],
  ],
} satisfies LessonText<typeof pt>;
