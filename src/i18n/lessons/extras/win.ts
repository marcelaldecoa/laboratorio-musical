import type { RecapText } from './types';

type S = string;

const pt = {
  pOut: (right: boolean): S => right
    ? 'Deslizando a janela uma casa para a <b>direita</b> (sentido horário), uma nota sai. Qual?'
    : 'Deslizando a janela uma casa para a <b>esquerda</b> (sentido anti-horário), uma nota sai. Qual?',
  pOutRevR: (o: S) => `${o}, a ponta esquerda, o 4º grau. A janela anda para a direita e a casa da esquerda fica para trás.`,
  pOutRevL: (o: S) => `${o}, a ponta direita, o 7º grau. A janela anda para a esquerda e a casa da direita fica para trás.`,
  pIn: (right: boolean): S => right
    ? 'E qual nota entra pela ponta direita? Toque-a no teclado (as notas de agora estão marcadas).'
    : 'E qual nota entra pela ponta esquerda? Toque-a no teclado (as notas de agora estão marcadas).',
  pInRevR: (i: S, o: S) => `${i}: sete quintas acima de ${o}, a mesma letra com um sustenido a mais. Por isso a nota que entra ocupa exatamente o lugar da que sai, meio tom acima.`,
  pInRevL: (i: S, o: S) => `${i}: sete quintas abaixo de ${o}, a mesma letra com um bemol a mais. Por isso a nota que entra ocupa exatamente o lugar da que sai, meio tom abaixo.`,
  why: (a: S, b: S) => `<b>Por que as sete cabem</b>: comece no 4º grau e suba de quinta justa em quinta justa: 4 → 1 → 5 → 2 → 6 → 3 → 7. Cada quinta cai numa nota da escala. A próxima já não cabe: do 7º grau (${a}) ao 4º (${b}) há um trítono, 6 semitons, e não uma quinta justa. Sete quintas seguidas, e só sete.`,
  transfer: (k: S) => `Em ${k}: quais são as duas pontas da janela, e qual nota entra ao deslizar para a direita?`,
  recap: {
    oneLine: 'Subindo de quinta justa em quinta justa a partir do 4º grau, você passa pelas sete notas da escala, uma em cada casa; a oitava quinta já sairia da escala, porque do 7º ao 4º grau há um trítono.',
    confusions: [
      '<b>Linha × círculo</b>: o círculo dá a volta e põe duas grafias da mesma tecla na mesma casa; a linha nunca volta, então cada grafia tem o seu lugar.',
      '<b>Ordem da janela × ordem da escala</b>: na janela as notas estão em quintas (4 1 5 2 6 3 7); na escala, em graus seguidos (1 2 3 4 5 6 7). São as mesmas sete notas.',
      '<b>Pontas × tônica</b>: as pontas são o 4º grau (esquerda) e o 7º (direita), as duas dobradiças; a tônica é a segunda casa, não a do meio.',
    ],
    show: 'Toque o 4º grau e vá subindo de quinta em quinta, sete vezes, dentro da escala. Depois toque mais uma quinta justa: ela cai fora da escala, e é a nota nova da vizinha no sentido horário.',
  } as RecapText,
};

const en: typeof pt = {
  pOut: (right: boolean): S => right
    ? 'Sliding the window one slot to the <b>right</b> (clockwise), one note leaves. Which one?'
    : 'Sliding the window one slot to the <b>left</b> (counter-clockwise), one note leaves. Which one?',
  pOutRevR: (o: S) => `${o}, the left end, degree 4. The window moves right and the left slot is left behind.`,
  pOutRevL: (o: S) => `${o}, the right end, degree 7. The window moves left and the right slot is left behind.`,
  pIn: (right: boolean): S => right
    ? 'And which note enters at the right end? Tap it on the keyboard (the current notes are marked).'
    : 'And which note enters at the left end? Tap it on the keyboard (the current notes are marked).',
  pInRevR: (i: S, o: S) => `${i}: seven fifths above ${o}, the same letter with one more sharp. That is why the note that enters takes exactly the place of the one that leaves, a half step higher.`,
  pInRevL: (i: S, o: S) => `${i}: seven fifths below ${o}, the same letter with one more flat. That is why the note that enters takes exactly the place of the one that leaves, a half step lower.`,
  why: (a: S, b: S) => `<b>Why all seven fit</b>: start on degree 4 and go up by perfect fifths: 4 → 1 → 5 → 2 → 6 → 3 → 7. Each fifth lands on a scale note. The next one no longer fits: from degree 7 (${a}) to degree 4 (${b}) is a tritone, 6 half steps, not a perfect fifth. Seven fifths in a row, and only seven.`,
  transfer: (k: S) => `In ${k}: what are the two ends of the window, and which note enters when you slide right?`,
  recap: {
    oneLine: 'Going up by perfect fifths from degree 4, you pass through the seven scale notes, one per slot; an eighth fifth would leave the scale, because from degree 7 to degree 4 is a tritone.',
    confusions: [
      '<b>Line × circle</b>: the circle wraps around and puts two spellings of the same key in one slot; the line never wraps, so each spelling has its own place.',
      '<b>Window order × scale order</b>: in the window the notes are in fifths (4 1 5 2 6 3 7); in the scale, in consecutive degrees (1 2 3 4 5 6 7). They are the same seven notes.',
      '<b>Ends × tonic</b>: the ends are degree 4 (left) and degree 7 (right), the two hinges; the tonic is the second slot, not the middle one.',
    ],
    show: 'Play degree 4 and keep going up by fifths, seven times, inside the scale. Then play one more perfect fifth: it falls outside the scale, and it is the new note of the clockwise neighbor.',
  },
};

export const extras = { pt, en };
