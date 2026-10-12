import type { RecapText } from './types';

type S = string;

const pt = {
  desc: 'Um acorde (tríade) é uma pilha de três notas da escala: uma sim, uma não. Cada grau da escala gera o seu acorde. Siga os passos:',
  steps: [
    'Escolha um grau. Ele é a <b>fundamental</b> (1), a nota que dá nome ao acorde.',
    'Pule uma nota da escala e pegue a seguinte: é a <b>terça</b> (3).',
    'Pule mais uma: é a <b>quinta</b> (5). Em Dó maior, a partir do grau 2: Ré, (Mi), Fá, (Sol), Lá. O acorde é Ré–Fá–Lá.',
    'Meça a terça de baixo no teclado: <b>4 semitons = acorde maior</b>, <b>3 semitons = acorde menor</b>. Se a quinta tiver só 6 semitons em vez de 7, o acorde é <b>diminuto</b>.',
    'Na linha de quintas, cada tipo de acorde é um desenho fixo: 5ª justa = 1 casa à direita, 3ª maior = 4 casas à direita, 3ª menor = 3 casas à esquerda. O desenho só serve se couber inteiro dentro da janela das 7 notas.',
  ],
  quality: { maj: 'maior', min: 'menor', dim: 'diminuto' } as Record<S, S>,
  p1: (key: S, root: S) =>
    `Em <b>${key}</b>, monte o acorde do grau 6 pulando notas da escala a partir de <b>${root}</b>. Ele é maior, menor ou diminuto?`,
  p1r: (names: S, a: number) =>
    `${names}. A terça de baixo tem ${a} semitons, uma 3ª menor, e a quinta é justa: acorde menor. Em qualquer tonalidade maior o grau 6 cai na mesma casa da janela, por isso é sempre menor.`,
  p2: (key: S, root: S) =>
    `Em <b>${key}</b>, o acorde do grau 5 começa em <b>${root}</b>. Toque a terça dele: pule uma nota da escala e pegue a seguinte.`,
  p2r: (root: S, skip: S, third: S) =>
    `${root}, pula ${skip}, chega em <b>${third}</b>: 4 semitons, uma 3ª maior, por isso o V é maior. E ${third} é a sensível, o grau 7. É ela que faz o V pedir a volta para a tônica (próxima aula).`,
  why: [
    '<b>Por que sempre 3 maiores, 3 menores e 1 diminuto</b>: cada acorde precisa da sua 3ª e da sua 5ª dentro da janela de 7 quintas. O desenho maior só cabe a partir das três casas da esquerda (IV, I, V); o menor, das três seguintes (ii, vi, iii); e a casa da ponta direita (vii) só aceita o desenho diminuto. A janela tem a mesma forma em toda tonalidade maior, então a conta dá sempre 3 + 3 + 1, nos mesmos graus.',
    '<b>Maior × menor</b>: as duas tríades têm as mesmas peças, uma 3ª maior (4 semitons) e uma 3ª menor (3), em ordem trocada. Com a maior embaixo (4 + 3) o acorde soa claro; com a menor embaixo (3 + 4), escuro. A 5ª justa (7 semitons) é igual nas duas.',
    '<b>Diminuto</b>: duas 3ªs menores (3 + 3). A 5ª fica com 6 semitons, o trítono entre o grau 7 e o grau 4 da escala. Por isso o vii° soa instável.',
    '<b>Algarismos romanos</b>: cada acorde recebe o número do grau em que nasce. Maiúsculo (I, IV, V) é maior; minúsculo (ii, iii, vi) é menor; ° (vii°) é diminuto. A mesma receita vale em qualquer tonalidade: I–IV–V é Dó–Fá–Sol em Dó maior e Sol–Dó–Ré em Sol maior.',
    '<b>Fundamental</b>: a nota de baixo da pilha de terças, a que dá nome ao acorde. Em Rém, a fundamental é Ré.',
    '<b>Na cifra</b>: o acorde maior é só a letra (C = Dó maior), o menor ganha “m” (Dm = Ré menor) e o diminuto ganha “°” ou “dim” (B° = Si diminuto). As letras vêm do sistema A B C D E F G, em que A = Lá.',
    '<b>De onde vêm os algarismos</b>: a análise com algarismos romanos se popularizou no século XIX, em tratados de harmonia alemães como o de Gottfried Weber. A ideia é a desta aula: dar nome ao acorde pela posição na escala, não pela nota.',
  ],
  transfer: (k: S) => `Em <b>${k}</b>, quais são as três notas do acorde ii? Monte de cabeça (uma sim, uma não) e depois confira tocando no chip.`,
  recap: {
    oneLine: 'Porque cada acorde é uma pilha de terças com notas da escala, e a escala maior tem sempre o mesmo desenho: os graus 1, 4 e 5 ganham 3ª maior, os graus 2, 3 e 6 ganham 3ª menor, e o 7 fica com a 5ª diminuta.',
    confusions: [
      '<b>Maiúsculo × minúsculo</b>: no algarismo romano, a letra diz o grau e o tamanho diz o tipo. V é maior, v seria menor. Não é “volume”, é qualidade.',
      '<b>Grau × nota</b>: “ii” é o acorde do grau 2 em qualquer tonalidade. Em Dó maior é Rém; em Sol maior é Lám.',
      '<b>Terça × acorde</b>: “3ª maior” é uma distância de 4 semitons; “acorde maior” é o acorde cuja 3ª de baixo é maior. A 5ª justa não decide nada: é igual no maior e no menor.',
    ],
    show: 'Ponha a mão em Dó–Mi–Sol e mova o mesmo desenho (tecla branca sim, branca não) para Ré–Fá–Lá, Mi–Sol–Si e assim por diante. Em cada um, conte os semitons da nota de baixo à do meio: 4 é maior, 3 é menor. Em Si–Ré–Fá, mostre que a quinta encolheu para 6.',
  } satisfies RecapText,
};

const en: typeof pt = {
  desc: 'A chord (triad) is a stack of three scale notes: one yes, one no. Each scale degree makes its own chord. Follow the steps:',
  steps: [
    'Pick a degree. It is the <b>root</b> (1), the note that names the chord.',
    'Skip one scale note and take the next: that is the <b>third</b> (3).',
    'Skip one more: that is the <b>fifth</b> (5). In C major, from degree 2: D, (E), F, (G), A. The chord is D–F–A.',
    'Measure the lower third on the keyboard: <b>4 half steps = major chord</b>, <b>3 half steps = minor chord</b>. If the fifth has only 6 half steps instead of 7, the chord is <b>diminished</b>.',
    'On the line of fifths each chord type is a fixed shape: perfect 5th = 1 box to the right, major 3rd = 4 boxes to the right, minor 3rd = 3 boxes to the left. The shape only works if it fits entirely inside the window of 7 notes.',
  ],
  quality: { maj: 'major', min: 'minor', dim: 'diminished' },
  p1: (key: S, root: S) =>
    `In <b>${key}</b>, build the chord on degree 6 by skipping scale notes from <b>${root}</b>. Is it major, minor or diminished?`,
  p1r: (names: S, a: number) =>
    `${names}. The lower third has ${a} half steps, a minor 3rd, and the fifth is perfect: a minor chord. In every major key degree 6 lands on the same box of the window, so it is always minor.`,
  p2: (key: S, root: S) =>
    `In <b>${key}</b>, the chord on degree 5 starts on <b>${root}</b>. Tap its third: skip one scale note and take the next.`,
  p2r: (root: S, skip: S, third: S) =>
    `${root}, skip ${skip}, land on <b>${third}</b>: 4 half steps, a major 3rd, so V is major. And ${third} is the leading tone, degree 7. It is what makes V ask to go back to the tonic (next lesson).`,
  why: [
    '<b>Why always 3 major, 3 minor and 1 diminished</b>: each chord needs its 3rd and 5th inside the window of 7 fifths. The major shape only fits from the three left boxes (IV, I, V); the minor shape from the next three (ii, vi, iii); and the rightmost box (vii) only takes the diminished shape. The window has the same shape in every major key, so the count is always 3 + 3 + 1, on the same degrees.',
    '<b>Major vs minor</b>: both triads have the same parts, a major 3rd (4 half steps) and a minor 3rd (3), in swapped order. With the major one below (4 + 3) the chord sounds bright; with the minor one below (3 + 4), dark. The perfect 5th (7 half steps) is the same in both.',
    '<b>Diminished</b>: two minor 3rds (3 + 3). The fifth shrinks to 6 half steps, the tritone between degrees 7 and 4 of the scale. That is why vii° sounds unstable.',
    '<b>Roman numerals</b>: each chord gets the number of the degree it is built on. Uppercase (I, IV, V) is major; lowercase (ii, iii, vi) is minor; ° (vii°) is diminished. The same recipe works in any key: I–IV–V is C–F–G in C major and G–C–D in G major.',
    '<b>Root</b>: the bottom note of the stack of thirds, the one that names the chord. In Dm, the root is D.',
    '<b>In chord symbols</b>: a major chord is just the letter (C = C major), minor adds “m” (Dm = D minor) and diminished adds “°” or “dim” (B° = B diminished).',
    '<b>Where the numerals come from</b>: Roman numeral analysis became widespread in the 19th century, in German harmony treatises such as Gottfried Weber’s. The idea is this lesson’s: name a chord by its place in the scale, not by its note.',
  ],
  transfer: (k: S) => `In <b>${k}</b>, what are the three notes of the ii chord? Build it in your head (one yes, one no), then check by tapping the chip.`,
  recap: {
    oneLine: 'Because every chord is a stack of thirds taken from the scale, and the major scale always has the same shape: degrees 1, 4 and 5 get a major 3rd, degrees 2, 3 and 6 get a minor 3rd, and 7 is left with a diminished 5th.',
    confusions: [
      '<b>Uppercase vs lowercase</b>: in a Roman numeral the letters say the degree and the case says the type. V is major; v would be minor.',
      '<b>Degree vs note</b>: “ii” is the chord on degree 2 in any key. In C major it is Dm; in G major it is Am.',
      '<b>Third vs chord</b>: “major 3rd” is a distance of 4 half steps; a “major chord” is one whose lower third is major. The perfect 5th decides nothing: it is the same in major and minor.',
    ],
    show: 'Put your hand on C–E–G and move the same shape (white key yes, white key no) to D–F–A, E–G–B and so on. In each one, count the half steps from the bottom note to the middle one: 4 is major, 3 is minor. On B–D–F, show that the fifth has shrunk to 6.',
  },
};

export const extras = { pt, en };
