import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

type S = string;

const pt = {
  meta: {
    nav: 'Intervalos: a qualidade',
    title: 'Intervalos: a qualidade',
    sub: 'a segunda régua: semitons',
    teaser: 'Duas terças, dois tamanhos: maior, menor, justa.',
  },
  desc: 'Na aula anterior, o número contou nomes de nota: Dó–Mi e Ré–Fá são as duas 3ªs, com 3 nomes cada. Mas elas não soam iguais. A segunda régua, os semitons, mostra por quê, e dá a cada intervalo a sua qualidade: maior, menor, justa, aumentada ou diminuta.',
  ord: (n: number) => n + 'ª',
  q: { P: 'justa', M: 'maior', m: 'menor', A: 'aumentada', d: 'diminuta' } as Record<string, S>,
  ivName: (g: number, q: S) => `${g}ª ${q}`,
  semis: (n: number) => (n === 1 ? '1 semitom' : `${n} semitons`),

  s1: '1 · Mesmo número, tamanhos diferentes',
  p1: (a: S, b: S, c: S, d: S) => `Conte as teclas, pretas incluídas, de <b>${a}–${b}</b> e de <b>${c}–${d}</b>. As duas são 3ªs. E o tamanho?`,
  p1Opts: ['iguais: 4 e 4', 'diferentes: 4 e 3', 'diferentes: 4 e 5'],
  p1Rev: (c: S, d: S, e: S) => `4 e 3. ${c}–${d} passa pelo trecho curto ${e}–${d} (o semitom entre os graus 3 e 4), então perde um semitom. A de 4 semitons é a 3ª maior, que soa clara; a de 3 é a 3ª menor, que soa mais escura.`,
  s1d: 'O que muda é o caminho. Entre duas notas vizinhas da escala o passo quase sempre é um tom (T), mas há dois trechos curtos, de um semitom (S, em laranja): entre os graus 3 e 4 e entre o 7 e o 8. Uma 3ª anda dois passos. Sem trecho curto: 2 + 2 = 4 semitons. Com um: 2 + 1 = 3.',
  big: (a: S, b: S) => `${a}–${b} · 4`,
  small: (a: S, b: S) => `${a}–${b} · 3`,
  playMaj: 'Ouvir a 3ª de 4',
  playMin: 'Ouvir a 3ª de 3',
  lgMaj: '3ª de 4 semitons (maior)',
  lgMin: '3ª de 3 semitons (menor)',
  lgShort: 'S: trecho curto (1 semitom)',

  s2: '2 · O censo: cada número tem dois tamanhos',
  p2: (k: S) => `Em <b>${k}</b>, seis das sete 5ªs da escala têm 7 semitons. Uma só tem 6. Toque a nota de onde ela parte.`,
  p2Rev: (a: S, b: S) => `${a}. A 5ª ${a}–${b} é a única que atravessa os dois trechos curtos (7–8 e 3–4), então fica com 6 semitons: é a 5ª diminuta. Todas as outras atravessam exatamente um.`,
  s2d: 'Escolha um número. A lista mostra os 7 intervalos desse número dentro da escala, um a partir de cada grau, com o tamanho em semitons. Repare: cada número aparece em exatamente dois tamanhos (a 8ª, com um só). Toque numa linha para ouvir e ver no teclado.',
  pick: 'Número do intervalo',
  now: (a: S, b: S, g: number, s: number, n: S) => `${a}–${b} · ${g} nomes · ${s} semitons · ${n}`,
  inv: (b: S, a: S, n: S, is: number, g: number, ig: number, s: number) =>
    `<b>Invertido</b>: ${b}–${a} = ${n} (${is} semitons). Números: ${g} + ${ig} = 9 · Semitons: ${s} + ${is} = 12.`,
  steps: 'semitons',
  playInt: 'Ouvir o intervalo',

  s3: '3 · Os nomes das qualidades',
  s3d: 'A régua de referência é a própria escala maior, medida a partir da tônica. Os tamanhos que ela dá são, por definição, os maiores e os justos. Toque nas teclas para ouvir cada um junto com a tônica.',
  ref: ['1', '2M', '3M', '4J', '5J', '6M', '7M', '8J'],
  refRead: '2ª maior · 3ª maior · 4ª justa · 5ª justa · 6ª maior · 7ª maior · 8ª justa',
  rules: [
    '<b>Maior ou justa</b>: o tamanho que a escala maior dá a partir da tônica.',
    '<b>Um semitom a menos</b>: a maior vira <b>menor</b>; a justa vira <b>diminuta</b>.',
    '<b>Um semitom a mais</b>: a maior ou a justa vira <b>aumentada</b>.',
    '<b>Por que dois sistemas</b>: 2ª, 3ª, 6ª e 7ª aparecem na escala em dois tamanhos comuns, e nenhum é “o normal”: por isso maior e menor. 4ª, 5ª e 8ª têm um tamanho só (com uma exceção): por isso justa.',
  ],
  lgRef: 'maior ou justa, medido a partir da tônica',
  lgTonic: 'tônica (1)',

  why: 'A lógica por baixo',
  notes: [
    '<b>1. Terças: dois tamanhos</b>: a terça anda 2 passos e atravessa 0 ou 1 trecho curto. Sem trecho curto, 2 + 2 = 4 semitons (Dó–Mi). Com um, 2 + 1 = 3 (Ré–Fá). Na escala, 3 terças têm 4 semitons e 4 têm 3. O mesmo vale para 2ªs, 6ªs e 7ªs.',
    '<b>2. Quintas: um tamanho, mais uma exceção</b>: a quinta anda 4 passos e quase sempre atravessa exatamente 1 trecho curto: 2 + 2 + 2 + 1 = 7 semitons. Só a que parte do 7º grau atravessa os dois e fica com 6. Com 6 de 7 iguais, existe “a” quinta, chamada justa, e a que foge ganha nome de exceção: diminuta. Nas 4ªs, a exceção é a que parte do 4º grau, a 4ª aumentada.',
    '<b>3. Inversão</b>: virar o intervalo troca o número por 9 − n e os semitons por 12 − s. Maior vira menor (3ª de 4 ↔ 6ª de 8), aumentada vira diminuta, e justa continua justa (5ª de 7 ↔ 4ª de 5). As justas são as únicas que mantêm a qualidade, mais um motivo para o nome.',
    '<b>4. Número × qualidade</b>: os dois juntos dão o nome completo. O número vem das letras (a pauta); a qualidade, dos semitons (o teclado). Dó–Mi♭ e Dó–Mi são 3ªs; Dó–Ré♯ tem os mesmos 3 semitons de Dó–Mi♭, mas é uma 2ª (aumentada), porque vai de Dó a Ré.',
    '<b>Por que nenhuma quinta escapa</b>: o maior trecho seguido sem semitom são três tons (do 4º ao 7º grau, Fá–Sol–Lá–Si em Dó), o trítono. A quinta precisa de quatro passos, então sempre esbarra em pelo menos um trecho curto. O fato de cada número ter exatamente dois tamanhos na escala tem nome na teoria: propriedade de Myhill.',
    '<b>Consonâncias perfeitas e imperfeitas</b>: na teoria medieval, uníssono, 8ª, 5ª e 4ª eram as consonâncias perfeitas: razões feitas só com 1, 2, 3 e 4 (1:1, 2:1, 3:2, 4:3). As 3ªs e 6ªs foram classificadas, a partir do século XIII, como consonâncias imperfeitas. Daí vem o nome “justa”. A aula sobre consonância conta essa história.',
    '<b>Em outras línguas</b>: justa em português e espanhol, juste em francês, rein (“pura”) em alemão, perfect em inglês. Todas dizem a mesma coisa: exata, sem variação.',
  ],
  more: [4, 5, 6],
  transfer: (k: S) => `Em ${k}: qual 5ª da escala é a diminuta, e qual 4ª é a aumentada? Use o censo para conferir.`,
  recap: {
    oneLine: 'Dó–Mi e Ré–Fá têm o mesmo número (3 nomes), mas Dó–Mi tem 4 semitons, uma 3ª maior e clara, e Ré–Fá tem 3, uma 3ª menor e escura, porque atravessa o trecho curto Mi–Fá: a qualidade é esse tamanho exato em semitons.',
    confusions: [
      '<b>Número × qualidade</b>: Dó–Mi e Dó–Mi♭ são o mesmo número (3ª), mas tamanhos diferentes (4 × 3 semitons): maior × menor.',
      '<b>Justa × maior</b>: uníssono, 4ª, 5ª e 8ª são justas, nunca maiores; 2ª, 3ª, 6ª e 7ª são maiores ou menores, nunca justas.',
      '<b>4ª aumentada × 5ª diminuta</b>: a mesma distância no teclado (6 semitons), mas Fá–Si conta 4 letras e Si–Fá conta 5.',
    ],
    show: 'Toque Dó–Mi e depois Ré–Fá com a mesma forma de mão: os dedos fazem o mesmo gesto, o som muda. Conte as teclas de cada um (4 e 3) e mostre o Mi–Fá sem preta no meio: é ali que se perde o semitom.',
  } as RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Intervals: the quality',
    title: 'Intervals: the quality',
    sub: 'the second ruler: half steps',
    teaser: 'Two thirds, two sizes: major, minor, perfect.',
  },
  desc: 'In the last lesson the number counted letter names: C–E and D–F are both 3rds, 3 names each. But they do not sound the same. The second ruler, half steps, shows why, and gives every interval its quality: major, minor, perfect, augmented or diminished.',
  ord: (n: number) => (n === 2 ? '2nd' : n === 3 ? '3rd' : n + 'th'),
  q: { P: 'perfect', M: 'major', m: 'minor', A: 'augmented', d: 'diminished' },
  ivName: (g: number, q: S) => `${q} ${en.ord(g)}`,
  semis: (n: number) => (n === 1 ? '1 half step' : `${n} half steps`),

  s1: '1 · Same number, different sizes',
  p1: (a: S, b: S, c: S, d: S) => `Count the keys, black ones included, in <b>${a}–${b}</b> and in <b>${c}–${d}</b>. Both are 3rds. What about the size?`,
  p1Opts: ['equal: 4 and 4', 'different: 4 and 3', 'different: 4 and 5'],
  p1Rev: (c: S, d: S, e: S) => `4 and 3. ${c}–${d} goes through the short gap ${e}–${d} (the half step between degrees 3 and 4), so it loses a half step. The one with 4 half steps is the major 3rd, which sounds bright; the one with 3 is the minor 3rd, which sounds darker.`,
  s1d: 'What changes is the path. Between neighboring scale notes the step is almost always a whole step (W), but there are two short gaps of one half step (H, in orange): between degrees 3 and 4 and between 7 and 8. A 3rd takes two steps. With no short gap: 2 + 2 = 4 half steps. With one: 2 + 1 = 3.',
  big: (a: S, b: S) => `${a}–${b} · 4`,
  small: (a: S, b: S) => `${a}–${b} · 3`,
  playMaj: 'Play the 3rd of 4',
  playMin: 'Play the 3rd of 3',
  lgMaj: '3rd of 4 half steps (major)',
  lgMin: '3rd of 3 half steps (minor)',
  lgShort: 'H: short gap (1 half step)',

  s2: '2 · The census: every number comes in two sizes',
  p2: (k: S) => `In <b>${k}</b>, six of the seven 5ths of the scale have 7 half steps. Only one has 6. Tap the note it starts from.`,
  p2Rev: (a: S, b: S) => `${a}. The 5th ${a}–${b} is the only one that crosses both short gaps (7–8 and 3–4), so it has 6 half steps: the diminished 5th. All the others cross exactly one.`,
  s2d: 'Pick a number. The list shows the 7 intervals of that number inside the scale, one from each degree, with the size in half steps. Notice: every number comes in exactly two sizes (the octave, in one). Tap a row to hear it and see it on the keyboard.',
  pick: 'Interval number',
  now: (a: S, b: S, g: number, s: number, n: S) => `${a}–${b} · ${g} names · ${s} half steps · ${n}`,
  inv: (b: S, a: S, n: S, is: number, g: number, ig: number, s: number) =>
    `<b>Inverted</b>: ${b}–${a} = ${n} (${is} half steps). Numbers: ${g} + ${ig} = 9 · Half steps: ${s} + ${is} = 12.`,
  steps: 'half steps',
  playInt: 'Play the interval',

  s3: '3 · The names of the qualities',
  s3d: 'The reference ruler is the major scale itself, measured from the tonic. The sizes it gives are, by definition, the major and perfect ones. Tap the keys to hear each one together with the tonic.',
  ref: ['1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7', 'P8'],
  refRead: 'major 2nd · major 3rd · perfect 4th · perfect 5th · major 6th · major 7th · perfect octave',
  rules: [
    '<b>Major or perfect</b>: the size the major scale gives from the tonic.',
    '<b>One half step less</b>: major becomes <b>minor</b>; perfect becomes <b>diminished</b>.',
    '<b>One half step more</b>: major or perfect becomes <b>augmented</b>.',
    '<b>Why two systems</b>: 2nds, 3rds, 6ths and 7ths come in two common sizes in the scale, and neither is “the normal one”: hence major and minor. 4ths, 5ths and octaves have a single size (with one exception): hence perfect.',
  ],
  lgRef: 'major or perfect, measured from the tonic',
  lgTonic: 'tonic (1)',

  why: 'The logic underneath',
  notes: [
    '<b>1. Thirds: two sizes</b>: a third takes 2 steps and crosses 0 or 1 short gap. With none, 2 + 2 = 4 half steps (C–E). With one, 2 + 1 = 3 (D–F). In the scale, 3 thirds have 4 half steps and 4 have 3. The same goes for 2nds, 6ths and 7ths.',
    '<b>2. Fifths: one size, plus an exception</b>: a fifth takes 4 steps and almost always crosses exactly 1 short gap: 2 + 2 + 2 + 1 = 7 half steps. Only the one starting on degree 7 crosses both and has 6. With 6 of 7 equal, there is “the” fifth, called perfect, and the odd one gets an exception’s name: diminished. Among 4ths the exception is the one starting on degree 4, the augmented 4th.',
    '<b>3. Inversion</b>: flipping an interval turns the number into 9 − n and the half steps into 12 − s. Major becomes minor (3rd of 4 ↔ 6th of 8), augmented becomes diminished, and perfect stays perfect (5th of 7 ↔ 4th of 5). Perfect intervals are the only ones that keep their quality, one more reason for the name.',
    '<b>4. Number vs quality</b>: together they give the full name. The number comes from the letters (the staff); the quality from the half steps (the keyboard). C–E♭ and C–E are 3rds; C–D♯ has the same 3 half steps as C–E♭, but it is a 2nd (augmented), because it goes from C to D.',
    '<b>Why no fifth escapes</b>: the longest run with no half step is three whole steps (from degree 4 to 7, F–G–A–B in C), the tritone. A fifth needs four steps, so it always hits at least one short gap. The fact that each number has exactly two sizes in the scale has a name in theory: Myhill’s property.',
    '<b>Perfect and imperfect consonances</b>: in medieval theory, unison, octave, 5th and 4th were the perfect consonances: ratios made only of 1, 2, 3 and 4 (1:1, 2:1, 3:2, 4:3). From the 13th century on, 3rds and 6ths were classed as imperfect consonances. That is where “perfect” comes from. The consonance lesson tells this story.',
    '<b>In other languages</b>: justa in Portuguese and Spanish, juste in French, rein (“pure”) in German, perfect in English. They all say the same thing: exact, with no variation.',
  ],
  more: [4, 5, 6],
  transfer: (k: S) => `In ${k}: which 5th of the scale is diminished, and which 4th is augmented? Check with the census.`,
  recap: {
    oneLine: 'C–E and D–F have the same number (3 names), but C–E has 4 half steps, a bright major 3rd, and D–F has 3, a darker minor 3rd, because it crosses the short gap E–F: the quality is that exact size in half steps.',
    confusions: [
      '<b>Number vs quality</b>: C–E and C–E♭ are the same number (3rd) but different sizes (4 vs 3 half steps): major vs minor.',
      '<b>Perfect vs major</b>: unison, 4th, 5th and octave are perfect, never major; 2nds, 3rds, 6ths and 7ths are major or minor, never perfect.',
      '<b>Augmented 4th vs diminished 5th</b>: the same distance on the keyboard (6 half steps), but F–B spans 4 letters and B–F spans 5.',
    ],
    show: 'Play C–E and then D–F with the same hand shape: the fingers make the same gesture, the sound changes. Count the keys in each (4 and 3) and show E–F with no black key between: that is where the half step is lost.',
  } as RecapText,
};

export const text = { pt, en } satisfies LessonText<typeof pt>;
