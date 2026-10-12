import type { RecapText } from './types';

type S = string;

const pt = {
  desc: 'O círculo das quintas põe as 12 tonalidades maiores em roda. Use o botão da tonalidade, no topo, para andar por ele. Aqui você vê, no teclado, o salto entre duas vizinhas: os semitons contados da tônica anterior até a atual.',
  pJump: (from: S, n: number) => `Parta de <b>${from}</b>, a tônica anterior, e conte <b>${n}</b> semitons para cima (cada tecla conta, branca ou preta). Onde você chega? Toque.`,
  pJumpCw: (to: S) => `${to}: 7 semitons acima, uma quinta justa. É o salto do sentido horário, o mesmo da corrente de tetracordes (5 do bloco + 2 da ligação).`,
  pJumpCcw: (to: S) => `${to}: 5 semitons acima, uma quarta justa. É o salto do sentido anti-horário: subir uma quarta leva à mesma nota que descer uma quinta.`,
  pLoop: 'Andando sempre no mesmo sentido, quantos passos no círculo até voltar à tonalidade de partida?',
  pLoopOpts: ['7', '12', '24'],
  pLoopAns: '12',
  pLoopRev: 'Doze. Cada passo sobe 7 semitons; 12 passos sobem 12 × 7 = 84 = 7 oitavas, e você cai de novo na mesma tecla. No caminho, passa pelas 12 teclas diferentes, uma vez cada (no teclado, com a afinação igual).',
  n1: (n: number) => `<b>1. Conte teclas</b>: cada tecla, branca ou preta, é um semitom. Da partida (0) até a nova tônica são ${n}.`,
  n2: '<b>2. Por que 7</b>: um bloco T T S (5 semitons) mais o tom de ligação (2) dão 7, a quinta justa. É onde começa o bloco de cima, que vira o bloco de baixo da próxima escala. Duas escalas que dividem um bloco inteiro são as mais parecidas possíveis, e é por isso que o círculo põe lado a lado as tonalidades a uma quinta.',
  n3: '<b>3. Por que 5 no outro sentido</b>: subir uma quarta (5) chega à mesma nota que descer uma quinta (7), porque 5 + 7 = 12, uma oitava. Andar no sentido anti-horário é desfazer o salto.',
  n4: '<b>Círculo das quartas</b>: lido no sentido anti-horário, o mesmo círculo vira um círculo de quartas. Muitos músicos praticam nessa ordem, porque é comum a fundamental dos acordes subir uma quarta numa progressão.',
  transfer: (k: S) => `Em ${k}: conte 7 semitons acima da tônica. Qual é a próxima tonalidade no sentido horário? E 5 semitons, no anti-horário?`,
  recap: {
    oneLine: 'Porque o bloco de cima da escala começa uma quinta (7 semitons) acima da tônica e vira o bloco de baixo da escala seguinte: as escalas que mais se parecem, com só uma nota diferente, ficam a uma quinta uma da outra.',
    confusions: [
      '<b>Quinta × 5 semitons</b>: a quinta justa tem 7 semitons; o “5” do nome conta nomes de nota (1 2 3 4 5), não teclas.',
      '<b>Horário × anti-horário</b>: o horário sobe uma quinta (a escala ganha um ♯ ou perde um ♭); o anti-horário sobe uma quarta (ganha um ♭ ou perde um ♯).',
      '<b>Quarta acima × quinta abaixo</b>: chegam na mesma nota, em oitavas diferentes. Por isso o círculo das quartas é o mesmo círculo, andado ao contrário.',
    ],
    show: 'Ponha o dedo na tônica e conte 7 teclas para a direita, pretas e brancas: essa é a vizinha no sentido horário. Volte e conte 5: é a vizinha do outro lado.',
  } as RecapText,
};

const en: typeof pt = {
  desc: 'The circle of fifths puts the 12 major keys in a ring. Use the key button at the top to walk around it. Here you see, on the keyboard, the jump between two neighbors: the half steps counted from the previous tonic to the current one.',
  pJump: (from: S, n: number) => `Start on <b>${from}</b>, the previous tonic, and count <b>${n}</b> half steps up (every key counts, black or white). Where do you land? Tap it.`,
  pJumpCw: (to: S) => `${to}: 7 half steps up, a perfect fifth. That is the clockwise jump, the same as in the chain of tetrachords (5 for the block + 2 for the joining step).`,
  pJumpCcw: (to: S) => `${to}: 5 half steps up, a perfect fourth. That is the counter-clockwise jump: going up a fourth lands on the same note as going down a fifth.`,
  pLoop: 'Always moving in the same direction, how many steps around the circle until you are back at the starting key?',
  pLoopOpts: ['7', '12', '24'],
  pLoopAns: '12',
  pLoopRev: 'Twelve. Each step goes up 7 half steps; 12 steps go up 12 × 7 = 84 = 7 octaves, and you land on the same key again. On the way you pass through all 12 different keys once each (on the keyboard, in equal temperament).',
  n1: (n: number) => `<b>1. Count keys</b>: every key, black or white, is one half step. From the start (0) to the new tonic there are ${n}.`,
  n2: '<b>2. Why 7</b>: a W W H block (5 half steps) plus the joining whole step (2) make 7, the perfect fifth. That is where the upper block starts, and it becomes the lower block of the next scale. Two scales that share a whole block are as alike as possible, which is why the circle puts keys a fifth apart side by side.',
  n3: '<b>3. Why 5 the other way</b>: going up a fourth (5) lands on the same note as going down a fifth (7), because 5 + 7 = 12, an octave. Moving counter-clockwise undoes the jump.',
  n4: '<b>Circle of fourths</b>: read counter-clockwise, the same circle becomes a circle of fourths. Many musicians practice in this order, because chord roots often move up a fourth in a progression.',
  transfer: (k: S) => `In ${k}: count 7 half steps above the tonic. What is the next key clockwise? And 5 half steps, counter-clockwise?`,
  recap: {
    oneLine: 'Because the upper block of the scale starts a fifth (7 half steps) above the tonic and becomes the lower block of the next scale: the scales that are most alike, with only one note different, are a fifth apart.',
    confusions: [
      '<b>Fifth × 5 half steps</b>: a perfect fifth has 7 half steps; the “5” in the name counts note names (1 2 3 4 5), not keys.',
      '<b>Clockwise × counter-clockwise</b>: clockwise goes up a fifth (the scale gains a ♯ or loses a ♭); counter-clockwise goes up a fourth (gains a ♭ or loses a ♯).',
      '<b>Fourth up × fifth down</b>: they land on the same note, in different octaves. That is why the circle of fourths is the same circle walked backwards.',
    ],
    show: 'Put a finger on the tonic and count 7 keys to the right, black and white: that is the clockwise neighbor. Go back and count 5: that is the neighbor on the other side.',
  },
};

export const extras = { pt, en };
