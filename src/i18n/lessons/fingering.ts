import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

const pt = {
  meta: {
    nav: 'Dedilhado de escalas',
    title: 'Dedilhado de escalas',
    sub: 'Por que o polegar passa por baixo onde passa',
    teaser: 'Os números dos dedos nas teclas: grupos de 3 e 4 dedos que encaixam nos grupos de teclas pretas.',
  },
  desc:
    'Os dedos têm números: 1 é o polegar, 2 o indicador, 3 o médio, 4 o anelar e 5 o mínimo, nas duas mãos. A escala tem 7 notas e a mão tem 5 dedos, então em algum momento a mão precisa mudar de lugar sem pular. Isso se faz passando o polegar por baixo dos outros dedos. O dedilhado padrão diz exatamente onde.',
  handLabel: 'Mão',
  hands: { rh: 'Mão direita', lh: 'Mão esquerda' },
  dirLabel: 'Sentido',
  dirs: { up: 'Subindo ↑', down: 'Descendo ↓' },
  kbdAria: (key: string, hand: string) => `Dedilhado de ${key}, ${hand}`,
  prev: '◀ Nota',
  next: 'Nota ▶',
  playScale: 'Tocar com os dedos',
  stop: 'Parar',
  idle: 'Toque em “Nota ▶” para andar nota por nota, ou em “Tocar com os dedos”.',
  stepRead: (i: number, name: string, finger: number) => `${i}/8 · ${name} · dedo ${finger}`,
  under: ' · em seguida o polegar passa por baixo',
  over: (f: number) => ` · em seguida o dedo ${f} cruza por cima do polegar`,
  lgTonic: 'tônica',
  lgScale: 'outras notas da escala',
  lgNum: 'número dentro da tecla = dedo (1 = polegar)',
  lgCross: 'seta = passagem: o polegar por baixo ou um dedo por cima',
  lgNext: 'próxima nota',
  lgGroup: 'colchete = uma posição da mão, sem cruzar',
  formula: (rh: string, lh: string) => `Direita: ${rh}  ·  Esquerda: ${lh}`,

  tableTitle: 'As 12 escalas maiores',
  tableHint: 'Os espaços separam as posições da mão (cada espaço é uma passagem do polegar). Toque numa linha para trocar a tonalidade.',
  colKey: 'Tonalidade',
  colRh: 'Direita ↑',
  colLh: 'Esquerda ↑',

  logicTitle: 'A lógica por baixo',
  thumbs: (hand: string, a: string, b: string) =>
    `<b>Polegar nas teclas brancas</b>: o polegar é o dedo mais curto e fica mais perto do pulso. Numa tecla preta, que é mais alta e mais recuada, ele obrigaria a mão inteira a avançar. Por isso o dedilhado põe o polegar nas brancas. Nesta escala, ${hand}: polegar em ${a} e em ${b}.`,
  groups:
    '<b>3 + 4 = 7</b>: a escala tem 7 notas por oitava. A mão toca uma posição de 3 dedos (1-2-3) e depois uma de 4 (1-2-3-4), e o polegar passa por baixo logo depois do 3 ou do 4. Nunca depois do 5: o mínimo é curto demais para o polegar passar por baixo dele. Na última nota da oitava sobra o 5, só para terminar.',
  blacks:
    '<b>Os grupos copiam as teclas pretas</b>: as pretas vêm em grupos de 2 e de 3. Em Fá♯ maior (ou Sol♭), que usa as 5 pretas, a mão direita põe 2-3 no grupo de duas e 2-3-4 no grupo de três, e o polegar cai nas duas brancas que sobram (Si e Mi♯, ou Dó♭ e Fá em Sol♭). Nas outras tonalidades com bemóis, pelo mesmo motivo, o polegar da mão direita cai em Dó e Fá, as brancas logo depois de cada grupo de pretas.',
  mirror:
    '<b>A mão esquerda é um espelho</b>: o polegar dela fica do lado direito. Por isso a mão esquerda subindo faz o mesmo movimento que a direita descendo: 5-4-3-2-1 e depois um dedo (3 ou 4) cruza por cima do polegar. Descendo, é a esquerda que passa o polegar por baixo.',
  exceptions:
    '<b>As “exceções” saem da mesma regra</b>: em Fá maior, a mão direita faz 1-2-3-4 em vez de 1-2-3, porque com 1-2-3 o polegar cairia em Si♭, uma tecla preta. Em Si maior, a mão esquerda começa com 4 em vez de 5, porque com 5-4-3-2-1 o polegar cairia em Fá♯.',
  history:
    '<b>Origem</b>: em muitos dedilhados antigos o polegar quase não entrava nas escalas; os dedos longos “andavam” cruzando uns sobre os outros (3-4-3-4, por exemplo). Em 1753, Carl Philipp Emanuel Bach, filho de J. S. Bach, publicou o “Ensaio sobre a verdadeira arte de tocar teclado”, que ensina de forma sistemática a passagem do polegar por baixo, e conta que aprendeu essa maneira com o pai. É a base do dedilhado usado até hoje.',

  and: ' e ',
  via: (to: string, f: number, from: string) => `${to} (depois do dedo ${f} no ${from})`,
  p1: (key: string, tonic: string, f: number) =>
    `Mão direita subindo em <b>${key}</b>, começando no ${tonic} com o dedo ${f}. Em qual tecla o polegar entra depois de passar por baixo dos outros dedos? Toque uma delas.`,
  p1Reveal: (names: string) =>
    `O polegar passa por baixo e cai em ${names}. Duas regras bastam: o polegar só toca teclas brancas, e entra logo depois do dedo 3 ou 4 (nunca depois do 5).`,
  p2: (key: string, thumb: string, next: string) =>
    `Agora a mão esquerda subindo em <b>${key}</b>. Ela chega com o polegar no ${thumb}. Qual dedo toca a nota seguinte, ${next}?`,
  p2Reveal: (f: number) =>
    `O dedo ${f}, cruzando por cima do polegar. O polegar da mão esquerda fica do lado direito dela: subindo, os dedos “acabam” no polegar, e um dedo longo (3 ou 4) passa por cima para continuar.`,
  transfer: (key: string) =>
    `Vá para <b>${key}</b> e, antes de olhar a tabela, diga em quais teclas o polegar da mão direita entra subindo. Confira: são brancas? Vêm logo depois do dedo 3 ou 4?`,
  recap: ({ d, a, f, g, la, bb, c }: Record<'d' | 'a' | 'f' | 'g' | 'la' | 'bb' | 'c', string>): RecapText => ({
    oneLine: 'O polegar toca só teclas brancas e passa por baixo logo depois do dedo 3 ou 4; o resto do dedilhado é consequência de onde ficam as teclas pretas.',
    confusions: [
      '<b>Polegar por baixo × dedo por cima</b>: subindo com a mão direita, o polegar passa por baixo; descendo, é o 3 ou o 4 que cruza por cima do polegar. É o mesmo movimento, ao contrário.',
      `<b>Número do dedo × grau da escala</b>: o número pequeno acima da nota na partitura é o dedo (1 = polegar), não o grau. Em ${d} maior, o ${a} é o 5º grau, mas a mão direita o toca com o dedo 2.`,
      '<b>Mão direita × mão esquerda</b>: a esquerda é um espelho da direita. Os números são os mesmos (1 = polegar), mas o polegar fica do outro lado, então a esquerda subindo se move como a direita descendo.',
    ],
    show: `Mão direita em ${f} maior: toque ${f}, ${g} e ${la} com 1-2-3 e pare. Pergunte: “o polegar pode entrar agora?”. A próxima nota é ${bb}, uma tecla preta, então não: o dedo 4 toca o ${bb} e o polegar entra no ${c}, que é branca.`,
  }),
};

const en: typeof pt = {
  meta: {
    nav: 'Scale fingering',
    title: 'Scale fingering',
    sub: 'Why the thumb passes under where it does',
    teaser: 'Finger numbers on the keys: groups of 3 and 4 fingers that fit the groups of black keys.',
  },
  desc:
    'Fingers have numbers: 1 is the thumb, 2 the index, 3 the middle, 4 the ring and 5 the little finger, on both hands. A scale has 7 notes and a hand has 5 fingers, so at some point the hand must move without jumping. You do that by passing the thumb under the other fingers. The standard fingering says exactly where.',
  handLabel: 'Hand',
  hands: { rh: 'Right hand', lh: 'Left hand' },
  dirLabel: 'Direction',
  dirs: { up: 'Going up ↑', down: 'Going down ↓' },
  kbdAria: (key: string, hand: string) => `Fingering of ${key}, ${hand}`,
  prev: '◀ Note',
  next: 'Note ▶',
  playScale: 'Play with fingers',
  stop: 'Stop',
  idle: 'Tap “Note ▶” to walk note by note, or “Play with fingers”.',
  stepRead: (i: number, name: string, finger: number) => `${i}/8 · ${name} · finger ${finger}`,
  under: ' · next, the thumb passes under',
  over: (f: number) => ` · next, finger ${f} crosses over the thumb`,
  lgTonic: 'tonic',
  lgScale: 'other scale notes',
  lgNum: 'number inside the key = finger (1 = thumb)',
  lgCross: 'arrow = crossing: thumb under or a finger over',
  lgNext: 'next note',
  lgGroup: 'bracket = one hand position, no crossing',
  formula: (rh: string, lh: string) => `Right: ${rh}  ·  Left: ${lh}`,

  tableTitle: 'All 12 major scales',
  tableHint: 'Spaces separate hand positions (each space is a thumb crossing). Tap a row to change the key.',
  colKey: 'Key',
  colRh: 'Right ↑',
  colLh: 'Left ↑',

  logicTitle: 'The logic underneath',
  thumbs: (hand: string, a: string, b: string) =>
    `<b>Thumb on white keys</b>: the thumb is the shortest finger and sits closest to the wrist. On a black key, which is higher and further back, it would force the whole hand forward. So fingerings put the thumb on white keys. In this scale, ${hand}: thumb on ${a} and on ${b}.`,
  groups:
    '<b>3 + 4 = 7</b>: the scale has 7 notes per octave. The hand plays a position of 3 fingers (1-2-3) and then one of 4 (1-2-3-4), and the thumb passes under right after 3 or 4. Never after 5: the little finger is too short for the thumb to pass under it. On the last note of the octave, 5 is left over, just to finish.',
  blacks:
    '<b>The groups copy the black keys</b>: black keys come in groups of 2 and 3. In F♯ major (or G♭), which uses all 5 black keys, the right hand puts 2-3 on the group of two and 2-3-4 on the group of three, and the thumb lands on the two white keys left (B and E♯, or C♭ and F in G♭). In the other flat keys, for the same reason, the right-hand thumb lands on C and F, the white keys right after each group of black keys.',
  mirror:
    '<b>The left hand is a mirror</b>: its thumb is on the right side. So the left hand going up makes the same motion as the right hand going down: 5-4-3-2-1, then a finger (3 or 4) crosses over the thumb. Going down, it is the left hand that passes the thumb under.',
  exceptions:
    '<b>The “exceptions” come from the same rule</b>: in F major the right hand plays 1-2-3-4 instead of 1-2-3, because with 1-2-3 the thumb would land on B♭, a black key. In B major the left hand starts on 4 instead of 5, because with 5-4-3-2-1 the thumb would land on F♯.',
  history:
    '<b>Origin</b>: in many early fingerings the thumb hardly took part in scales; the long fingers “walked” by crossing over each other (3-4-3-4, for example). In 1753, Carl Philipp Emanuel Bach, son of J. S. Bach, published his “Essay on the True Art of Playing Keyboard Instruments”, which teaches the thumb passing under systematically, and he says he learned this way of playing from his father. It is the basis of the fingering still used today.',

  and: ' and ',
  via: (to: string, f: number, from: string) => `${to} (after finger ${f} on ${from})`,
  p1: (key: string, tonic: string, f: number) =>
    `Right hand going up in <b>${key}</b>, starting on ${tonic} with finger ${f}. On which key does the thumb land after passing under the other fingers? Tap one.`,
  p1Reveal: (names: string) =>
    `The thumb passes under and lands on ${names}. Two rules are enough: the thumb only plays white keys, and it comes in right after finger 3 or 4 (never after 5).`,
  p2: (key: string, thumb: string, next: string) =>
    `Now the left hand going up in <b>${key}</b>. It arrives with the thumb on ${thumb}. Which finger plays the next note, ${next}?`,
  p2Reveal: (f: number) =>
    `Finger ${f}, crossing over the thumb. The left hand's thumb is on its right side: going up, the fingers “run out” at the thumb, and a long finger (3 or 4) crosses over to continue.`,
  transfer: (key: string) =>
    `Go to <b>${key}</b> and, before looking at the table, say on which keys the right-hand thumb comes in going up. Check: are they white? Do they come right after finger 3 or 4?`,
  recap: ({ d, a, f, g, la, bb, c }: Record<'d' | 'a' | 'f' | 'g' | 'la' | 'bb' | 'c', string>): RecapText => ({
    oneLine: 'The thumb only plays white keys and passes under right after finger 3 or 4; the rest of the fingering follows from where the black keys are.',
    confusions: [
      '<b>Thumb under × finger over</b>: going up with the right hand, the thumb passes under; going down, finger 3 or 4 crosses over the thumb. It is the same motion, reversed.',
      `<b>Finger number × scale degree</b>: the small number above a note in sheet music is the finger (1 = thumb), not the degree. In ${d} major, ${a} is the 5th degree, but the right hand plays it with finger 2.`,
      '<b>Right hand × left hand</b>: the left hand mirrors the right. The numbers are the same (1 = thumb), but the thumb is on the other side, so the left hand going up moves like the right hand going down.',
    ],
    show: `Right hand in ${f} major: play ${f}, ${g} and ${la} with 1-2-3 and stop. Ask: “can the thumb come in now?”. The next note is ${bb}, a black key, so no: finger 4 plays ${bb} and the thumb comes in on ${c}, which is white.`,
  }),
};

export const text = {
  pt,
  en,
  glossary: [
    ['Finger numbers', '', 'Números dos dedos', '1 = polegar, 2 = indicador, 3 = médio, 4 = anelar, 5 = mínimo, iguais nas duas mãos. Aparecem acima ou abaixo das notas na partitura.', '1 = thumb, 2 = index, 3 = middle, 4 = ring, 5 = little finger, the same on both hands. They appear above or below the notes in sheet music.'],
    ['Finger crossing', 'cross over', 'Cruzamento de dedo', 'Um dedo longo (3 ou 4) passa por cima do polegar para continuar a escala. É o movimento inverso da passagem do polegar.', 'A long finger (3 or 4) crosses over the thumb to continue the scale. It is the reverse of the thumb passing under.'],
    ['Hand position', '', 'Posição da mão', 'Um grupo de notas tocado sem cruzar dedos. A escala maior usa uma posição de 3 dedos e uma de 4 por oitava.', 'A group of notes played without crossing fingers. The major scale uses one 3-finger and one 4-finger position per octave.'],
  ],
} satisfies LessonText<typeof pt>;
