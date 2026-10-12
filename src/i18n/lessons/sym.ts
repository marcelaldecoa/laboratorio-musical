import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

type S = string;

const pt = {
  meta: {
    nav: 'Escalas simétricas',
    title: 'Escalas simétricas',
    sub: 'cromática, tons inteiros e diminuta',
    teaser: 'Passos iguais: toda nota parece a tônica.',
  },
  desc: 'Na escala maior os passos são desiguais (T T S T T T S), e é essa desigualdade que aponta para uma tônica. Se todos os passos forem iguais, ou repetirem um padrão curto, a escala fica igual a si mesma em vários pontos de partida, e nenhuma nota se destaca como “casa”.',
  kind: 'Escala',
  chromatic: 'Cromática',
  whole: 'Tons inteiros',
  octatonic: 'Diminuta',
  now: (start: S, notes: S) => `A partir de ${start}: ${notes}`,
  shift: 'Começar na próxima nota →',
  reset: 'Voltar à tônica',
  same: (pattern: S) => `Passos: ${pattern}. O desenho não muda, seja qual for a nota de partida.`,
  lgStart: 'nota de partida',
  lgA: {
    chromatic: 'as outras 11 notas',
    whole: 'a mesma escala de tons inteiros',
    octatonic: 'um acorde diminuto (3 + 3 + 3 + 3)',
  },
  lgB: {
    chromatic: '',
    whole: 'a outra escala de tons inteiros',
    octatonic: 'o outro acorde diminuto, entrelaçado',
  },
  play: 'Ouvir',
  circleTitle: 'O desenho no círculo das 12 notas',
  circleLabel: (shape: S) => `Círculo das 12 notas mostrando ${shape}`,
  shape: {
    chromatic: 'um polígono de 12 lados',
    whole: 'dois hexágonos',
    octatonic: 'dois quadrados',
  },
  circleRead: {
    chromatic: 'As 12 notas formam um polígono regular de 12 lados: girar o círculo uma casa não muda nada.',
    whole: 'Cada escala de tons inteiros é um hexágono regular. Girar uma casa (um semitom) troca para o outro hexágono; girar duas casas devolve o mesmo. Por isso só existem duas.',
    octatonic: 'A diminuta são dois quadrados entrelaçados (dois acordes diminutos). Girar três casas devolve o mesmo desenho, então só existem três escalas diminutas diferentes.',
  },
  count: (n: number) => `${n === 1 ? 'Existe só 1 transposição' : `Existem só ${n} transposições`} diferentes.`,
  predict: (t: S) => `A escala de tons inteiros sobe sempre 2 semitons: a partir de ${t}, ela tem 6 notas. Escalas maiores existem 12, uma para cada tecla. E escalas de tons inteiros diferentes, quantas existem?`,
  predictOptions: ['1', '2', '6', '12'],
  predictAnswer: '2',
  predictReveal: 'Só 2. Subindo de 2 em 2 semitons a partir de Dó você pega metade das teclas; a partir de Dó♯, a outra metade. Começar em qualquer outra tecla cai numa dessas duas, porque o desenho se repete a cada passo.',
  transfer: (k: S) => `Vá para ${k} e monte a escala de tons inteiros a partir da tônica. É a mesma de Dó ou a outra? (conte os semitons de Dó até a tônica: se for par, é a mesma)`,
  recap: {
    oneLine: 'Existe: quando todos os passos são iguais (ou repetem um padrão curto), toda nota da escala vê o mesmo desenho à sua volta, e não sobra sensível nem quinta justa que aponte uma casa.',
    confusions: [
      '<b>Escala diminuta × acorde diminuto:</b> o acorde tem 4 notas (3 + 3 + 3 semitons); a escala tem 8 e é feita de dois acordes diminutos entrelaçados.',
      '<b>S T × T S:</b> a diminuta que começa com semitom e a que começa com tom são a mesma coleção de notas, vista de pontos de partida diferentes.',
      '<b>Cromática × tons inteiros:</b> a cromática usa os 12 semitons; a de tons inteiros, só uma tecla sim, outra não.',
    ],
    show: 'Toque Dó Ré Mi Fá♯ Sol♯ Lá♯ Dó com o pedal: soa como sonho, sem chegada. Depois comece em Ré com o mesmo passo: são as mesmas teclas, e nenhuma soa mais “casa” que as outras.',
  } satisfies RecapText,
  whyTitle: 'Por que não existe uma tônica',
  why: [
    '<b>Simetria:</b> uma escala é simétrica quando seus passos se repetem antes de completar a oitava. A cromática repete S; a de tons inteiros repete T; a diminuta repete S T. Começar em outra nota da escala dá exatamente o mesmo padrão.',
    '<b>Sem sensível, sem dominante:</b> na escala maior, o semitom entre o 7º grau e a tônica e a quinta justa até a dominante “apontam” para casa. A de tons inteiros não tem semitom nenhum nem quinta justa. O ouvido fica sem chão: o som é flutuante, de sonho.',
    '<b>Por que a de tons inteiros não tem quinta:</b> somando passos de 2 semitons só se chega a números pares (2, 4, 6, 8, 10). A quinta justa tem 7, um número ímpar, então nunca aparece.',
    '<b>Quantas existem:</b> divida 12 pelo tamanho do padrão que se repete. Cromática: 12 ÷ 12 = 1. Tons inteiros: o padrão repete a cada 2 semitons, então há 2. Diminuta: repete a cada 3 semitons, então há 3. A escala maior não repete nunca: são 12 tonalidades.',
    '<b>Na história:</b> Debussy usou a escala de tons inteiros em quase todo o prelúdio “Voiles” (1909) para criar névoa. Olivier Messiaen chamou essas escalas de “modos de transposição limitada”. No jazz, a diminuta que começa com semitom é muito usada sobre acordes de dominante.',
    '<b>A grafia:</b> como 6, 8 ou 12 notas não cabem em 7 letras, alguma letra se repete ou é pulada. A convenção é escolher a grafia com menos acidentes, e não existe uma única forma certa.',
  ],
};

const en: typeof pt = {
  meta: {
    nav: 'Symmetric scales',
    title: 'Symmetric scales',
    sub: 'chromatic, whole-tone and diminished',
    teaser: 'Equal steps: every note looks like the tonic.',
  },
  desc: 'In the major scale the steps are uneven (W W H W W W H), and that unevenness points to one tonic. If all the steps are equal, or repeat a short pattern, the scale is identical to itself from several starting points, and no note stands out as “home”.',
  kind: 'Scale',
  chromatic: 'Chromatic',
  whole: 'Whole-tone',
  octatonic: 'Diminished',
  now: (start: S, notes: S) => `From ${start}: ${notes}`,
  shift: 'Start on the next note →',
  reset: 'Back to the tonic',
  same: (pattern: S) => `Steps: ${pattern}. The shape does not change, whatever note you start on.`,
  lgStart: 'starting note',
  lgA: {
    chromatic: 'the other 11 notes',
    whole: 'the same whole-tone scale',
    octatonic: 'one diminished chord (3 + 3 + 3 + 3)',
  },
  lgB: {
    chromatic: '',
    whole: 'the other whole-tone scale',
    octatonic: 'the other diminished chord, interlocked',
  },
  play: 'Listen',
  circleTitle: 'The shape on the circle of 12 notes',
  circleLabel: (shape: S) => `Circle of 12 notes showing ${shape}`,
  shape: {
    chromatic: 'a 12-sided polygon',
    whole: 'two hexagons',
    octatonic: 'two squares',
  },
  circleRead: {
    chromatic: 'The 12 notes form a regular 12-sided polygon: turning the circle one slot changes nothing.',
    whole: 'Each whole-tone scale is a regular hexagon. Turning one slot (a half step) switches to the other hexagon; turning two slots gives back the same one. That is why there are only two.',
    octatonic: 'The diminished scale is two interlocked squares (two diminished chords). Turning three slots gives back the same shape, so there are only three different diminished scales.',
  },
  count: (n: number) => `There ${n === 1 ? 'is only 1 transposition' : `are only ${n} different transpositions`}.`,
  predict: (t: S) => `The whole-tone scale always goes up 2 half steps: from ${t}, it has 6 notes. There are 12 major scales, one per key. How many different whole-tone scales are there?`,
  predictOptions: ['1', '2', '6', '12'],
  predictAnswer: '2',
  predictReveal: 'Only 2. Going up by 2 half steps from C you take half of the keys; from C♯, the other half. Starting on any other key lands in one of those two, because the shape repeats at every step.',
  transfer: (k: S) => `Go to ${k} and build the whole-tone scale from the tonic. Is it the same as C’s or the other one? (count the half steps from C to the tonic: if even, it is the same)`,
  recap: {
    oneLine: 'Yes: when all the steps are equal (or repeat a short pattern), every note of the scale sees the same shape around it, and no leading tone or perfect fifth is left to point to a home.',
    confusions: [
      '<b>Diminished scale vs diminished chord:</b> the chord has 4 notes (3 + 3 + 3 half steps); the scale has 8 and is made of two interlocked diminished chords.',
      '<b>H W vs W H:</b> the diminished scale starting with a half step and the one starting with a whole step are the same collection of notes, seen from different starting points.',
      '<b>Chromatic vs whole-tone:</b> the chromatic uses all 12 half steps; the whole-tone, every other key.',
    ],
    show: 'Play C D E F♯ G♯ A♯ C with the pedal: it sounds like a dream, with no arrival. Then start on D with the same step: same keys, and none sounds more like “home” than the others.',
  } satisfies RecapText,
  whyTitle: 'Why there is no single tonic',
  why: [
    '<b>Symmetry:</b> a scale is symmetric when its steps repeat before the octave is complete. The chromatic repeats H; the whole-tone repeats W; the diminished repeats H W. Starting on another note of the scale gives exactly the same pattern.',
    '<b>No leading tone, no dominant:</b> in the major scale, the half step from degree 7 to the tonic and the perfect fifth to the dominant “point” home. The whole-tone scale has no half step and no perfect fifth at all. The ear has nothing to stand on: the sound floats, like a dream.',
    '<b>Why the whole-tone scale has no fifth:</b> adding steps of 2 half steps only reaches even numbers (2, 4, 6, 8, 10). A perfect fifth is 7, an odd number, so it never appears.',
    '<b>How many exist:</b> divide 12 by the size of the repeating pattern. Chromatic: 12 ÷ 12 = 1. Whole-tone: the pattern repeats every 2 half steps, so there are 2. Diminished: it repeats every 3 half steps, so there are 3. The major scale never repeats: there are 12 keys.',
    '<b>In history:</b> Debussy used the whole-tone scale for most of the prelude “Voiles” (1909) to create a haze. Olivier Messiaen called these scales “modes of limited transposition”. In jazz, the diminished scale starting with a half step is widely used over dominant chords.',
    '<b>Spelling:</b> since 6, 8 or 12 notes do not fit into 7 letters, some letter repeats or is skipped. The convention is to choose the spelling with the fewest accidentals, and there is no single correct form.',
  ],
};

export const text = {
  pt,
  en,
  glossary: [
    ['Whole-tone scale', '', 'Escala de tons inteiros', 'Seis notas separadas por tons inteiros (Dó Ré Mi Fá♯ Sol♯ Lá♯). Não tem semitons nem quinta justa; só existem duas.', 'Six notes a whole step apart (C D E F♯ G♯ A♯). It has no half steps and no perfect fifth; only two exist.'],
    ['Diminished scale', 'octatonic, half-whole', 'Escala diminuta', 'Oito notas alternando semitom e tom (S T S T…). São dois acordes diminutos entrelaçados; só existem três.', 'Eight notes alternating half and whole steps (H W H W…). It is two interlocked diminished chords; only three exist.'],
    ['Symmetric scale', 'mode of limited transposition', 'Escala simétrica', 'Escala cujos passos se repetem antes da oitava, de modo que ela é igual a si mesma em vários pontos de partida e tem poucas transposições diferentes.', 'A scale whose steps repeat before the octave, so it is identical to itself from several starting points and has few distinct transpositions.'],
  ],
} satisfies LessonText<typeof pt>;
