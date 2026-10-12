import type { RecapText } from './types';

type S = string;

const pt = {
  desc: 'A escala maior pode ser vista como dois blocos de quatro notas com o mesmo formato, T T S, ligados por um tom. Cada bloco se chama tetracorde. O bloco de cima de uma tonalidade é o bloco de baixo de outra, uma quinta acima. Seguir essa corrente leva ao círculo das quintas, o tema das próximas aulas.',
  pSize: 'Um bloco tem os passos T + T + S. Quantos semitons há da primeira à última nota dele?',
  pSizeOpts: ['4', '5', '6', '7'],
  pSizeAns: '5',
  pSizeRev: 'T + T + S = 2 + 2 + 1 = 5 semitons: uma quarta justa. Dois blocos (5 + 5) mais o tom de ligação (2) dão 12, a oitava inteira.',
  pAcc: (start: S) => `A corrente continua: o terceiro bloco começa em <b>${start}</b> e precisa do mesmo formato, T T S. As notas 1, 2 e 4 já estão marcadas. Toque a <b>terceira</b>.`,
  pAccRev: (prev: S, n: S, k: S) => `${n}. Entre a 2ª e a 3ª nota do bloco o passo tem de ser um tom (T), e só ${n} fica um tom acima de ${prev}. Essa é a nota que muda: a escala que começa uma quinta acima de ${k} difere dela exatamente aí.`,
  sharps: (c: S, list: S) => `<b>A ordem dos sustenidos</b>: comece em ${c} (sem acidentes) e siga a corrente. A cada elo, o bloco novo precisa subir a sua 3ª nota para manter T T S, e esse é o sustenido novo. Como cada bloco começa uma quinta acima do anterior, cada sustenido novo também fica uma quinta acima do último: ${list}. A ordem não precisa ser decorada: ela é a própria corrente.`,
  history: '<b>De onde vem o nome</b>: do grego <i>tetra</i> (quatro) + <i>chordé</i> (corda). Na teoria grega antiga, o tetracorde era um grupo de quatro notas cujas pontas ficam a uma quarta justa; as duas notas do meio podiam variar. A escala maior não é grega, mas aproveita a mesma ideia do bloco de quarta.',
  transfer: (k: S) => `Em ${k}: qual nota do terceiro bloco precisa mudar para manter o formato T T S?`,
  recap: {
    oneLine: 'A escala maior são dois blocos T T S; o bloco de cima vira o de baixo da escala seguinte, uma quinta acima, e o bloco novo precisa subir a sua 3ª nota: por isso cada sustenido novo fica uma quinta acima do anterior.',
    confusions: [
      '<b>Tetracorde × acorde</b>: o tetracorde são quatro notas <i>seguidas</i> da escala (graus 1 2 3 4); um acorde junta notas saltadas. O “corde” do nome vem de corda de lira, não de acorde.',
      '<b>Passo do bloco × tom de ligação</b>: dentro de cada bloco os passos são T T S; o tom entre os blocos (do 4º para o 5º grau) não pertence a nenhum dos dois.',
      '<b>Quarta × quinta</b>: um bloco mede uma quarta (5 semitons, da 1ª à 4ª nota); do começo de um bloco ao começo do seguinte há uma quinta (5 + 2 = 7 semitons).',
    ],
    show: 'Toque os graus 1 a 4 (T T S), pule um tom e toque os graus 5 a 8 (T T S de novo). Agora use o segundo bloco como o primeiro de uma escala nova e toque o bloco seguinte: mostre qual tecla precisa mudar para o formato continuar T T S.',
  } as RecapText,
};

const en: typeof pt = {
  desc: 'The major scale can be seen as two four-note blocks with the same shape, W W H, joined by a whole step. Each block is called a tetrachord. The upper block of one key is the lower block of another, a fifth higher. Following this chain leads to the circle of fifths, the topic of the next lessons.',
  pSize: 'A block has the steps W + W + H. How many half steps are there from its first to its last note?',
  pSizeOpts: ['4', '5', '6', '7'],
  pSizeAns: '5',
  pSizeRev: 'W + W + H = 2 + 2 + 1 = 5 half steps: a perfect fourth. Two blocks (5 + 5) plus the joining whole step (2) make 12, the whole octave.',
  pAcc: (start: S) => `The chain goes on: the third block starts on <b>${start}</b> and needs the same shape, W W H. Notes 1, 2 and 4 are already marked. Tap the <b>third</b> one.`,
  pAccRev: (prev: S, n: S, k: S) => `${n}. Between the block’s 2nd and 3rd notes the step must be a whole step (W), and only ${n} is a whole step above ${prev}. That is the note that changes: the scale that starts a fifth above ${k} differs from it exactly there.`,
  sharps: (c: S, list: S) => `<b>The order of sharps</b>: start on ${c} (no accidentals) and follow the chain. At each link, the new block has to raise its 3rd note to keep W W H, and that is the new sharp. Since each block starts a fifth above the previous one, each new sharp is also a fifth above the last: ${list}. The order needs no memorizing: it is the chain itself.`,
  history: '<b>Where the name comes from</b>: Greek <i>tetra</i> (four) + <i>chordé</i> (string). In ancient Greek theory, a tetrachord was a group of four notes whose outer notes are a perfect fourth apart; the two inner notes could vary. The major scale is not Greek, but it reuses the same idea of a block spanning a fourth.',
  transfer: (k: S) => `In ${k}: which note of the third block must change to keep the W W H shape?`,
  recap: {
    oneLine: 'The major scale is two W W H blocks; the upper block becomes the lower block of the next scale, a fifth higher, and the new block has to raise its 3rd note: that is why each new sharp is a fifth above the previous one.',
    confusions: [
      '<b>Tetrachord × chord</b>: a tetrachord is four <i>consecutive</i> scale notes (degrees 1 2 3 4); a chord stacks notes that skip. The “chord” in the name means a lyre string.',
      '<b>Block step × joining step</b>: inside each block the steps are W W H; the whole step between the blocks (degree 4 to 5) belongs to neither.',
      '<b>Fourth × fifth</b>: a block spans a fourth (5 half steps, 1st to 4th note); from the start of one block to the start of the next is a fifth (5 + 2 = 7 half steps).',
    ],
    show: 'Play degrees 1 to 4 (W W H), skip a whole step and play degrees 5 to 8 (W W H again). Now use the second block as the first block of a new scale and play the next block: show which key has to change for the shape to stay W W H.',
  },
};

export const extras = { pt, en };
