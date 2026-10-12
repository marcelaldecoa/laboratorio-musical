import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

type S = string;

const pt = {
  meta: {
    nav: 'Intervalos: o número',
    title: 'Intervalos: o número',
    sub: 'contar nomes de nota, com as duas pontas',
    teaser: 'Por que Dó–Sol é uma quinta, e não uma quarta.',
  },
  desc: 'Intervalo é a distância entre duas notas. Ele tem duas medidas, como uma régua com duas escalas. Esta aula trata da primeira: o número (2ª, 3ª, 5ª…), que conta nomes de nota. A próxima trata da segunda: os semitons.',
  ord: (n: number) => n + 'ª',

  s1: '1 · Contar nomes, incluindo as duas pontas',
  p1: (a: S, b: S) => `De <b>${a}</b> até <b>${b}</b> (o 5º grau da escala): que número tem esse intervalo?`,
  p1Rev: (list: S) => `5ª. Conte os nomes, incluindo as duas pontas: ${list}. São 5 nomes. Os passos entre eles são só 4, mas o intervalo não conta passos: conta nomes.`,
  s1d: 'Na pauta fica fácil ver: cada nome de nota tem a sua posição (linha ou espaço). O número do intervalo é quantas posições ele ocupa, da nota de baixo até a de cima, contando as duas.',
  staffCap: (a: S, b: S) => `${a} → ${b}: cinco posições na pauta, contando as duas pontas. Por isso é uma 5ª.`,
  playStaff: 'Ouvir os 5 nomes',

  s2: '2 · O número no teclado',
  s2d: 'Escolha a nota de partida e o número. Os números dentro das teclas contam os nomes de nota da escala, a partir de 1. O intervalo termina na tecla com o número escolhido.',
  from: 'Nota de partida',
  pick: 'Número do intervalo',
  bracket: (g: number) => `${g}ª · ${g} nomes`,
  read: (a: S, b: S, g: number, names: S) => `${a}–${b}: ${g} nomes (${names}) → ${g === 8 ? 'oitava (8ª)' : g + 'ª'}. São ${g - 1} passos de letra.`,
  playInt: 'Ouvir o intervalo',
  lgEnds: 'as duas pontas do intervalo',
  lgMid: 'os nomes contados no meio',

  s3: '3 · Somar intervalos: a + b − 1',
  p3: 'Uma 4ª e, em cima dela, uma 5ª. Juntas, dão que intervalo?',
  p3Opts: ['9ª', '8ª', '7ª'],
  p3Ans: '8ª',
  p3Rev: (a: S, m: S) => `8ª. De ${a} a ${m} é uma 4ª, e de ${m} ao ${a} de cima é uma 5ª. Mas ${m} foi contado duas vezes, uma em cada intervalo. Por isso a soma é 4 + 5 − 1 = 8.`,
  s3d: (m: S) => `A nota do meio (${m}, em laranja) é o fim de um intervalo e o começo do outro: ela entra nas duas contagens. Para somar números de intervalo, some e tire 1.`,
  sumTop: '8ª = 4 + 5 − 1',
  playSum: 'Ouvir 4ª + 5ª',
  lgTwice: 'a nota contada duas vezes',

  s4: '4 · Acima da oitava: intervalos compostos',
  s4d: 'Os números continuam depois da oitava: 9ª, 10ª, 11ª… Uma 9ª é uma 2ª uma oitava acima, pela mesma conta: 2 + 8 − 1 = 9. Os números dentro das teclas seguem contando depois do 8.',
  compTop: '9ª = 2 + 8 − 1',
  playComp: 'Ouvir a 9ª',

  s5: '5 · Inverter: 9 − n',
  p5: (a: S, b: S) => `${a}–${b} é uma 3ª. Agora inverta: de ${b} até o ${a} de cima. Que número tem?`,
  p5Opts: ['5ª', '6ª', '7ª'],
  p5Ans: '6ª',
  p5Rev: (b: S) => `6ª. Os dois intervalos juntos formam a oitava (8), e ${b} é contado duas vezes: 3 + 6 − 1 = 8. Por isso o número invertido é sempre 9 − n.`,
  s5d: 'Inverter é passar a nota de baixo para cima (uma oitava acima). O intervalo e o seu inverso completam a oitava. Escolha um número e veja o par.',
  invRead: (a: S, b: S, n: number, m: number) => `${a}–${b} = ${n}ª · ${b}–${a} = ${m}ª · ${n} + ${m} = 9`,
  playInv: 'Ouvir o intervalo e o inverso',

  why: 'A lógica por baixo',
  notes: [
    '<b>1. Duas réguas</b>: o número conta nomes de nota, ou seja, posições na pauta, que só tem 7 letras. Ele não diz quantas teclas há no meio. Para isso existe a segunda régua, os semitons, que dá a qualidade (maior, menor, justa…). É o tema da próxima aula.',
    '<b>2. Por que “quinta” com só 4 passos</b>: os romanos contavam incluindo o ponto de partida, e os algarismos romanos nem têm zero. Por isso a mesma nota é o uníssono, a “1ª”, e não a “0ª”. O português guarda esse hábito: “daqui a oito dias” é uma semana, e “quinze dias” são duas. A oitava é a mesma ideia: oito nomes, de Dó a Dó.',
    '<b>3. A aritmética</b>: se o número conta as duas pontas, então número = passos + 1. Somar intervalos é somar passos: 4ª (3 passos) + 5ª (4 passos) = 7 passos = 8ª. Em fórmula, a + b − 1. A inversão sai da mesma conta: n + m − 1 = 8, então m = 9 − n.',
    '<b>4. Acidentes não mudam o número</b>: Dó–Mi, Dó–Mi♭ e Dó♯–Mi são todas 3ªs, porque vão da letra Dó à letra Mi. O número só olha as letras. O que muda com o acidente é o tamanho em semitons, a outra régua.',
    '<b>Os nomes</b>: 2ª, 3ª, 4ª, 5ª vêm dos ordinais latinos secunda, tertia, quarta, quinta. Por isso dizemos “a quinta” como dizemos “a quinta posição”.',
    '<b>Acordes com 9, 11 e 13</b>: quando uma cifra traz 9, 11 ou 13, ela fala de uma 2ª, uma 4ª e uma 6ª postas acima da oitava (2 + 8 − 1 = 9, 4 + 8 − 1 = 11, 6 + 8 − 1 = 13). A aula de extensões volta a esse assunto.',
  ],
  more: [4, 5],
  transfer: (k: S) => `Em ${k}: que número tem o intervalo da tônica até o 6º grau? E o inverso dele?`,
  recap: {
    oneLine: 'Dó–Sol é uma quinta porque o número do intervalo conta os nomes de nota incluindo as duas pontas (Dó Ré Mi Fá Sol = 5), e não os passos entre elas (4).',
    confusions: [
      '<b>Nomes × passos</b>: de Dó a Sol são 4 passos, mas 5 nomes. O intervalo usa os nomes; por isso Dó–Dó é uma 8ª, e não uma 7ª.',
      '<b>Número × semitons</b>: Dó–Sol tem 5 nomes e 7 semitons. O número conta letras; os semitons são a outra régua (próxima aula).',
      '<b>Somar números</b>: 4ª + 5ª não dá 9ª, dá 8ª. A nota do meio entra nas duas contas, então a + b − 1.',
    ],
    show: 'Ponha o polegar no Dó e o dedo 5 no Sol, um dedo por tecla branca: a mão mostra os 5 nomes da 5ª. Depois mostre Dó–Fá (4ª) e Fá–Dó (5ª), apontando o Fá que as duas dividem: 4 + 5 − 1 = 8.',
  } as RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Intervals: the number',
    title: 'Intervals: the number',
    sub: 'counting letter names, both ends included',
    teaser: 'Why C–G is a fifth, not a fourth.',
  },
  desc: 'An interval is the distance between two notes. It has two measures, like a ruler with two scales. This lesson is about the first one: the number (2nd, 3rd, 5th…), which counts letter names. The next one is about the second: half steps.',
  ord: (n: number) => (n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : n + 'th'),

  s1: '1 · Count names, both ends included',
  p1: (a: S, b: S) => `From <b>${a}</b> to <b>${b}</b> (degree 5 of the scale): what number is this interval?`,
  p1Rev: (list: S) => `A 5th. Count the names, both ends included: ${list}. That is 5 names. There are only 4 steps between them, but an interval does not count steps: it counts names.`,
  s1d: 'On the staff it is easy to see: each letter name has its own position (line or space). The interval number is how many positions it spans, from the lower note to the upper one, counting both.',
  staffCap: (a: S, b: S) => `${a} → ${b}: five staff positions, counting both ends. That is why it is a 5th.`,
  playStaff: 'Hear the 5 names',

  s2: '2 · The number on the keyboard',
  s2d: 'Pick the starting note and the number. The numbers inside the keys count the letter names of the scale, starting from 1. The interval ends on the key with the chosen number.',
  from: 'Starting note',
  pick: 'Interval number',
  bracket: (g: number) => `${en.ord(g)} · ${g} names`,
  read: (a: S, b: S, g: number, names: S) => `${a}–${b}: ${g} names (${names}) → ${g === 8 ? 'octave (8th)' : en.ord(g)}. That is ${g - 1} letter steps.`,
  playInt: 'Play the interval',
  lgEnds: 'the two ends of the interval',
  lgMid: 'the names counted in between',

  s3: '3 · Adding intervals: a + b − 1',
  p3: 'A 4th and, on top of it, a 5th. Together, what interval do they make?',
  p3Opts: ['9th', '8th', '7th'],
  p3Ans: '8th',
  p3Rev: (a: S, m: S) => `An 8th. From ${a} to ${m} is a 4th, and from ${m} to the upper ${a} is a 5th. But ${m} was counted twice, once in each interval. So the sum is 4 + 5 − 1 = 8.`,
  s3d: (m: S) => `The middle note (${m}, in orange) is the end of one interval and the start of the other: it is in both counts. To add interval numbers, add them and subtract 1.`,
  sumTop: '8th = 4 + 5 − 1',
  playSum: 'Play 4th + 5th',
  lgTwice: 'the note counted twice',

  s4: '4 · Beyond the octave: compound intervals',
  s4d: 'The numbers go on after the octave: 9th, 10th, 11th… A 9th is a 2nd an octave up, by the same count: 2 + 8 − 1 = 9. The numbers inside the keys keep counting after 8.',
  compTop: '9th = 2 + 8 − 1',
  playComp: 'Play the 9th',

  s5: '5 · Inverting: 9 − n',
  p5: (a: S, b: S) => `${a}–${b} is a 3rd. Now invert it: from ${b} up to the upper ${a}. What number is it?`,
  p5Opts: ['5th', '6th', '7th'],
  p5Ans: '6th',
  p5Rev: (b: S) => `A 6th. The two intervals together make the octave (8), and ${b} is counted twice: 3 + 6 − 1 = 8. That is why the inverted number is always 9 − n.`,
  s5d: 'To invert, move the lower note to the top (an octave up). An interval and its inversion fill the octave. Pick a number and see the pair.',
  invRead: (a: S, b: S, n: number, m: number) => `${a}–${b} = ${en.ord(n)} · ${b}–${a} = ${en.ord(m)} · ${n} + ${m} = 9`,
  playInv: 'Play the interval and its inversion',

  why: 'The logic underneath',
  notes: [
    '<b>1. Two rulers</b>: the number counts letter names, that is, staff positions, and the staff has only 7 letters. It does not tell how many keys lie between. For that there is the second ruler, half steps, which gives the quality (major, minor, perfect…). That is the next lesson.',
    '<b>2. Why a “fifth” with only 4 steps</b>: the Romans counted including the starting point, and Roman numerals have no zero. So the same note is the unison, the “1st”, not the “0th”. Some languages keep the habit: in French and Portuguese “eight days” means a week and “fifteen days” two weeks. The octave is the same idea: eight names, from C to C.',
    '<b>3. The arithmetic</b>: if the number counts both ends, then number = steps + 1. Adding intervals means adding steps: 4th (3 steps) + 5th (4 steps) = 7 steps = 8th. As a formula, a + b − 1. Inversion comes from the same count: n + m − 1 = 8, so m = 9 − n.',
    '<b>4. Accidentals do not change the number</b>: C–E, C–E♭ and C♯–E are all 3rds, because they go from the letter C to the letter E. The number only sees letters. What the accidental changes is the size in half steps, the other ruler.',
    '<b>The names</b>: 2nd, 3rd, 4th, 5th come from the Latin ordinals secunda, tertia, quarta, quinta. That is why we say “the fifth” as we say “the fifth position”.',
    '<b>Chords with 9, 11 and 13</b>: when a chord symbol has 9, 11 or 13, it means a 2nd, a 4th and a 6th placed above the octave (2 + 8 − 1 = 9, 4 + 8 − 1 = 11, 6 + 8 − 1 = 13). The extensions lesson comes back to this.',
  ],
  more: [4, 5],
  transfer: (k: S) => `In ${k}: what number is the interval from the tonic to degree 6? And its inversion?`,
  recap: {
    oneLine: 'C–G is a fifth because the interval number counts letter names including both ends (C D E F G = 5), not the steps between them (4).',
    confusions: [
      '<b>Names vs steps</b>: from C to G there are 4 steps but 5 names. Intervals use names; that is why C–C is an 8th, not a 7th.',
      '<b>Number vs half steps</b>: C–G spans 5 names and 7 half steps. The number counts letters; half steps are the other ruler (next lesson).',
      '<b>Adding numbers</b>: a 4th plus a 5th is not a 9th but an 8th. The middle note is in both counts, so a + b − 1.',
    ],
    show: 'Put your thumb on C and your fifth finger on G, one finger per white key: the hand shows the 5 names of the 5th. Then show C–F (4th) and F–C (5th), pointing at the F they share: 4 + 5 − 1 = 8.',
  } as RecapText,
};

export const text = { pt, en } satisfies LessonText<typeof pt>;
