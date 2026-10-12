import type { RecapText } from './types';

type S = string;

const pt = {
  pChange: (prev: S, now: S) => `Abaixo está a escala de <b>${prev}</b>, a tonalidade anterior no círculo. Indo para <b>${now}</b>, só uma nota muda. Qual tecla entra no lugar dela? Toque.`,
  pChangeCw: (old: S, nw: S) => `${old} vira ${nw}. Na escala nova ela é o 7º grau, a sensível, e por isso precisa ficar a um semitom da nova tônica: sobe meio tom.`,
  pChangeCcw: (old: S, nw: S) => `${old} vira ${nw}. Na escala nova ela é o 4º grau, e por isso precisa ficar a um semitom do 3º grau: desce meio tom.`,
  n1: (k: S) => `<b>1. A fórmula</b>: a partir de ${k}, siga T T S T T T S. Cada nota usa uma letra diferente, em ordem, sem pular nem repetir.`,
  n2: '<b>2. Quatro notas iguais de graça</b>: no sentido horário, o bloco de baixo da escala nova é o bloco de cima da antiga (graus 5 a 8). Já são 4 notas em comum.',
  n3: '<b>3. O bloco novo quase serve</b>: o bloco de cima da escala nova começa no 2º grau da antiga e precisa de T T S. A antiga, a partir dali, faz T S T: os dois primeiros passos só batem se a 3ª nota do bloco subir meio tom. Só ela muda; as outras seis ficam. (No anti-horário é o mesmo raciocínio ao contrário.)',
  n4: (sharps: S, flats: S) => `<b>4. A ordem dos acidentes</b>: como cada passo troca uma nota, os acidentes entram um de cada vez. No sentido horário os sustenidos entram nesta ordem: ${sharps}. No anti-horário, os bemóis: ${flats}, a mesma fila de quintas lida ao contrário.`,
  transfer: (k: S) => `Em ${k}: qual nota mudou em relação à tonalidade anterior no círculo?`,
  recap: {
    oneLine: 'Porque escalas vizinhas no círculo dividem um bloco T T S inteiro, e o bloco novo só fica T T S se uma única nota andar meio tom; as outras seis continuam iguais.',
    confusions: [
      '<b>Grau × nota</b>: o grau é a posição na escala (1º a 7º); a nota é o nome. O 7º grau pode ser uma tecla branca numa tonalidade e preta noutra.',
      '<b>Tecla × nome</b>: a mesma tecla preta pode ser ♯ ou ♭. O nome certo é o que mantém uma letra por grau; por isso algumas escalas usam um sustenido numa tecla branca.',
      '<b>Armadura × acidente ocasional</b>: os acidentes da escala vão na armadura, no começo da pauta, e valem para a música toda; um acidente escrito ao lado de uma nota vale só até o fim do compasso.',
    ],
    show: 'Toque a escala de uma tonalidade e depois a da vizinha no círculo. Aponte a única tecla que mudou e mostre que ela fica a um semitom da nova tônica (sentido horário) ou do 3º grau (anti-horário).',
  } as RecapText,
};

const en: typeof pt = {
  pChange: (prev: S, now: S) => `Below is the scale of <b>${prev}</b>, the previous key on the circle. Going to <b>${now}</b>, only one note changes. Which key takes its place? Tap it.`,
  pChangeCw: (old: S, nw: S) => `${old} becomes ${nw}. In the new scale it is degree 7, the leading tone, so it has to sit a half step below the new tonic: it goes up a half step.`,
  pChangeCcw: (old: S, nw: S) => `${old} becomes ${nw}. In the new scale it is degree 4, so it has to sit a half step above degree 3: it goes down a half step.`,
  n1: (k: S) => `<b>1. The formula</b>: from ${k}, follow W W H W W W H. Each note uses a different letter, in order, never skipping or repeating one.`,
  n2: '<b>2. Four notes for free</b>: clockwise, the lower block of the new scale is the upper block of the old one (degrees 5 to 8). That is already 4 notes in common.',
  n3: '<b>3. The new block almost fits</b>: the upper block of the new scale starts on degree 2 of the old one and needs W W H. From there the old scale goes W H W: the first two steps only match if the block’s 3rd note goes up a half step. Only that note changes; the other six stay. (Counter-clockwise it is the same reasoning in reverse.)',
  n4: (sharps: S, flats: S) => `<b>4. The order of accidentals</b>: since each step changes one note, accidentals arrive one at a time. Clockwise, the sharps arrive in this order: ${sharps}. Counter-clockwise, the flats: ${flats}, the same row of fifths read backwards.`,
  transfer: (k: S) => `In ${k}: which note changed compared with the previous key on the circle?`,
  recap: {
    oneLine: 'Because neighboring scales on the circle share a whole W W H block, and the new block is only W W H if one single note moves a half step; the other six stay the same.',
    confusions: [
      '<b>Degree × note</b>: the degree is the position in the scale (1st to 7th); the note is the name. Degree 7 can be a white key in one key and a black key in another.',
      '<b>Key × name</b>: the same black key can be ♯ or ♭. The right name is the one that keeps one letter per degree; that is why some scales put a sharp on a white key.',
      '<b>Key signature × accidental</b>: the scale’s accidentals go in the key signature, at the start of the staff, and hold for the whole piece; an accidental written next to a note only lasts until the end of the bar.',
    ],
    show: 'Play the scale of one key and then that of its neighbor on the circle. Point at the one key that changed and show that it sits a half step from the new tonic (clockwise) or from degree 3 (counter-clockwise).',
  },
};

export const extras = { pt, en };
