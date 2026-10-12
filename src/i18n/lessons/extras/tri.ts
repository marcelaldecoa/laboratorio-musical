import type { RecapText } from './types';

type S = string;

const pt = {
  pMirror: (a: S, b: S) => `De ${a} até o ${b} acima há 6 semitons. Invertendo (de ${b} até o próximo ${a} acima), quantos semitons haverá?`,
  pMirrorOpts: ['5', '6', '7'],
  pMirrorAns: '6',
  pMirrorRev: 'Seis. A oitava tem 12 semitons, e toda inversão completa a oitava: a quinta (7) vira quarta (5). Só o trítono cai em si mesmo, 6 + 6. Por isso soa ambíguo: sozinho, não aponta para um lado.',
  pRes: (lt: S) => `${lt}, o 7º grau, quer andar meio tom. Para onde? Toque a tecla.`,
  pResRev: (a: S, b: S, c: S, d: S) => `Para ${d}, a tônica, um semitom acima. E ${a} faz o espelho: desce meio tom para ${c}. O trítono ${a}–${b} se desfaz com as duas notas andando o menor passo possível.`,
  name: (a: S, b: S, c: S, d: S) => `<b>O nome</b>: do latim <i>tritonus</i>, “três tons” inteiros: ${a}–${b}, ${b}–${c}, ${c}–${d}.`,
  devil: '<b>Por que “diabo na música”</b>: o trítono é o intervalo mais instável da escala. Não tem a razão simples da quinta (3:2) e, por dividir a oitava ao meio, não aponta para nenhum lado; é também difícil de cantar afinado. A teoria medieval, feita para o canto, evitava esse salto na melodia (a regra resumida como <i>mi contra fa</i>). O apelido em latim, <i>diabolus in musica</i>, só aparece por escrito bem depois da Idade Média; ele resume essa fama, não uma proibição da Igreja.',
  unique: (a: S, b: S, k: S) => `<b>Impressão digital</b>: a escala maior tem um único trítono, ${a}–${b}, e entre as 12 escalas maiores só a de ${k} tem esse par. Por isso ouvir ${a}–${b} é uma pista forte de onde a música está.`,
  transfer: (k: S) => `Em ${k}: quais são as duas notas do trítono, e para onde cada uma resolve?`,
  recap: {
    oneLine: 'Porque o trítono divide a oitava exatamente ao meio (6 + 6): soa instável e ambíguo e era difícil de cantar, e a teoria medieval o evitava; o apelido veio depois, mas a tensão é real, e é ela que faz o 4º e o 7º graus pedirem resolução.',
    confusions: [
      '<b>Trítono × quinta justa</b>: 6 semitons contra 7. Uma tecla de diferença troca a tensão pelo repouso.',
      '<b>4ª aumentada × 5ª diminuta</b>: é o mesmo trítono escrito de dois jeitos. Do 4º grau subindo ao 7º é uma 4ª aumentada (4 nomes de nota); do 7º subindo ao 4º é uma 5ª diminuta (5 nomes).',
      '<b>Abre × fecha</b>: na 4ª aumentada as notas se afastam ao resolver (4º desce, 7º sobe, chegando a uma 6ª); na 5ª diminuta elas se aproximam (chegando a uma 3ª).',
    ],
    show: 'Toque o 4º e o 7º graus juntos (6 semitons) e deixe soar a tensão. Depois mova cada um meio tom, o 4º para baixo e o 7º para cima, e ouça o repouso.',
  } as RecapText,
};

const en: typeof pt = {
  pMirror: (a: S, b: S) => `From ${a} up to ${b} there are 6 half steps. Inverted (from ${b} up to the next ${a}), how many half steps will there be?`,
  pMirrorOpts: ['5', '6', '7'],
  pMirrorAns: '6',
  pMirrorRev: 'Six. The octave has 12 half steps, and every inversion completes the octave: the fifth (7) becomes a fourth (5). Only the tritone lands on itself, 6 + 6. That is why it sounds ambiguous: on its own, it points nowhere.',
  pRes: (lt: S) => `${lt}, degree 7, wants to move a half step. Where to? Tap the key.`,
  pResRev: (a: S, b: S, c: S, d: S) => `To ${d}, the tonic, a half step up. And ${a} mirrors it: it goes down a half step to ${c}. The tritone ${a}–${b} dissolves with both notes moving the smallest step possible.`,
  name: (a: S, b: S, c: S, d: S) => `<b>The name</b>: Latin <i>tritonus</i>, “three whole tones”: ${a}–${b}, ${b}–${c}, ${c}–${d}.`,
  devil: '<b>Why “the devil in music”</b>: the tritone is the most unstable interval in the scale. It lacks the simple ratio of the fifth (3:2) and, since it splits the octave in half, it points nowhere; it is also hard to sing in tune. Medieval theory, made for singing, avoided this leap in melodies (the rule summed up as <i>mi contra fa</i>). The Latin nickname, <i>diabolus in musica</i>, only shows up in writing well after the Middle Ages; it sums up that reputation, not a ban by the Church.',
  unique: (a: S, b: S, k: S) => `<b>Fingerprint</b>: the major scale has a single tritone, ${a}–${b}, and among the 12 major scales only ${k} has that pair. That is why hearing ${a}–${b} is a strong clue to where the music is.`,
  transfer: (k: S) => `In ${k}: which two notes make the tritone, and where does each one resolve?`,
  recap: {
    oneLine: 'Because the tritone splits the octave exactly in half (6 + 6): it sounds unstable and ambiguous and was hard to sing, so medieval theory avoided it; the nickname came later, but the tension is real, and it is what makes degrees 4 and 7 ask to resolve.',
    confusions: [
      '<b>Tritone × perfect fifth</b>: 6 half steps against 7. One key of difference swaps tension for rest.',
      '<b>Augmented 4th × diminished 5th</b>: the same tritone spelled two ways. From degree 4 up to 7 it is an augmented 4th (4 note names); from 7 up to 4 it is a diminished 5th (5 names).',
      '<b>Opens × closes</b>: an augmented 4th widens as it resolves (4 goes down, 7 goes up, landing on a 6th); a diminished 5th narrows (landing on a 3rd).',
    ],
    show: 'Play degrees 4 and 7 together (6 half steps) and let the tension ring. Then move each one a half step, 4 down and 7 up, and hear the rest.',
  },
};

export const extras = { pt, en };
