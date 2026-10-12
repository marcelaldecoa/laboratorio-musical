import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

type S = string;

const pt = {
  meta: {
    nav: 'Transposição',
    title: 'Transposição',
    sub: 'A mesma música, outra tonalidade',
    teaser: 'Todas as notas andam a mesma distância; os graus e os algarismos romanos ficam iguais.',
  },
  desc:
    'Transpor é tocar a mesma música começando em outra nota. A melodia continua reconhecível porque todas as notas andam exatamente a mesma distância. Vamos levar uma melodia curta, com os acordes I–IV–V–I, de Dó maior para a tonalidade escolhida no círculo.',
  isC: 'Você está em Dó maior, e transpor de Dó para Dó não muda nada. Por isso a aula usa Sol maior como destino. Escolha outra tonalidade no círculo para levar a melodia até ela.',

  srcTitle: '1. A melodia em Dó maior',
  srcHint:
    'Os números dentro das teclas são os graus da escala. Repare na melodia escrita em graus: 3 4 5 3 | 6 5 4 6 | 5 4 2 7 | 1. Ela termina com a sensível (7) subindo para a tônica (1).',
  tuneDegrees: 'Melodia em graus',
  chordsLabel: 'Acordes · toque para ouvir',
  playIn: (k: S) => `Ouvir em ${k}`,
  kbdAria: (k: S) => `Teclado com as notas da melodia em ${k}, marcadas com o grau.`,
  lgTonic: 'tônica (grau 1)',
  lgScale: 'outras notas da melodia (número = grau)',

  p1: (k: S) => `Agora em <b>${k}</b>: qual nota é o grau 5? Toque.`,
  p1r: (names: S, fifth: S) =>
    `Conte cinco nomes a partir da tônica: ${names}. O grau 5 é <b>${fifth}</b>, sempre uma 5ª justa (7 semitons) acima da tônica, porque a fórmula T T S T T T S é a mesma em toda tonalidade. Por isso os graus não mudam quando você transpõe.`,
  p2: (k: S, deg: number, a: S, b: S) =>
    `Em <b>${k}</b>, o grau ${deg} cai numa tecla que pode se chamar ${a} ou ${b}. Qual é o nome certo nesta tonalidade?`,
  p2r: (deg: number, prev: S, letter: S, right: S, wrong: S) =>
    `A escala usa cada letra uma vez, em ordem. O grau ${deg - 1} é ${prev}, então o grau ${deg} precisa da letra seguinte, ${letter}: <b>${right}</b>. ${wrong} é a mesma tecla, mas deixaria uma letra repetida e outra faltando.`,

  stepsTitle: '2. Passo a passo: como transpor',
  steps: (from: S, to: S, intName: S, semis: number, letters: number, ex: S, exLetter: S, exTo: S) => [
    `<b>Meça a distância entre as tônicas.</b> De ${from} subindo até ${to} é ${intName}: ${semis} semitons, e a letra anda ${letters} ${letters === 1 ? 'casa' : 'casas'} (${letters + 1} nomes, contando as duas pontas).`,
    `<b>Mova todas as notas essa mesma distância.</b> Melodia e acordes, sem exceção. É isso que mantém os intervalos, e com eles a melodia.`,
    `<b>Escreva pela letra, depois ajuste o acidente.</b> Exemplo: ${ex} anda ${letters} ${letters === 1 ? 'casa' : 'casas'} de letra e vira ${exLetter}; o acidente se ajusta para dar ${semis} semitons: <b>${exTo}</b>.`,
    `<b>Atalho: use os graus.</b> A melodia em graus (3 4 5 3 | 6 5 4 6 | 5 4 2 7 | 1) e os acordes em algarismos romanos (I–IV–V–I) não mudam. Basta ler cada grau na escala nova.`,
  ],
  intName: (ord: S, q: S) => `uma ${ord} ${q}`,
  tableAria: 'Tabela dos sete graus nas duas tonalidades.',
  rowDeg: 'grau',
  rowNaive: 'contando só semitons',
  naiveHint:
    'A última linha mostra o erro de contar só semitons e chamar toda tecla preta de sustenido: uma letra aparece duas vezes e outra some (em coral, o que sai errado).',

  naiveOk: 'Nesta tonalidade, contar semitons e chamar toda tecla preta de sustenido por sorte acerta todos os nomes. Experimente Fá maior ou Fá♯ maior no círculo: lá essa conta erra.',
  dstTitle: (k: S) => `3. A mesma melodia em ${k}`,
  dstHint: 'Mesmos números nas teclas, mesmos algarismos romanos. Só os nomes mudaram. Ouça as duas versões em seguida.',

  whyTitle: 'A lógica por baixo',
  why: [
    '<b>Por que os graus não mudam</b>: a escala maior tem a mesma fórmula (T T S T T T S) em qualquer tonalidade, então cada grau fica sempre à mesma distância da tônica. Mover tudo pelo mesmo intervalo leva cada grau ao mesmo grau da escala nova.',
    '<b>Por que pela letra</b>: uma escala maior usa as sete letras, uma por grau. Contando só semitons você pode escrever Lá♯ onde a escala pede Si♭: a tecla é a mesma, mas a escala fica com dois Lás e nenhum Si, e a leitura vira um quebra-cabeça.',
    '<b>Por que os cantores pedem para transpor</b>: cada voz tem uma região confortável. Se a música fica alta ou baixa demais, desce-se ou sobe-se tudo um tom ou dois. A melodia continua a mesma porque os intervalos entre as notas são os mesmos.',
    '<b>Por que os algarismos romanos facilitam</b>: uma progressão escrita em graus (I–IV–V–I) já vale para todas as tonalidades. Para transpor, só falta ler os nomes na escala nova; a função de cada acorde (T, SD, D) não muda.',
    '<b>Números em vez de cifras</b>: em Nashville, músicos de estúdio costumam escrever os acordes como números (1, 4, 5), o chamado sistema de números de Nashville, justamente para trocar de tom na hora.',
    '<b>Instrumentos transpositores</b>: no clarinete em Si♭, a nota escrita Dó soa Si♭. A partitura dele já vem transposta, para que o mesmo dedilhado sirva para toda a família do instrumento.',
    '<b>O botão “transpose”</b>: muitos teclados digitais têm um botão que desloca todas as notas. O pianista toca em Dó e o som sai em outra tonalidade. É a mesma ideia desta aula, feita pela máquina.',
  ],
  transfer: (k: S) => `Em <b>${k}</b>, quais são as três primeiras notas da melodia (graus 3, 4 e 5)? Diga os nomes antes de tocar.`,
  recap: {
    oneLine: 'Movendo todas as notas pela mesma distância: os graus e os algarismos romanos não mudam, então basta ler cada grau na escala nova, letra por letra, sem reescrever a música do zero.',
    confusions: [
      '<b>Contar semitons × contar letras</b>: os semitons dizem qual tecla; as letras dizem qual nome. O grau 4 de Fá maior é Si♭, não Lá♯.',
      '<b>Grau × nota</b>: “grau 5” é uma posição na escala (a dominante); a nota que ocupa essa posição muda com a tonalidade.',
      '<b>Mesmo desenho × mesmas teclas</b>: ao transpor, as teclas pretas e brancas mudam (em Ré maior aparecem Fá♯ e Dó♯), mas as distâncias entre as notas ficam iguais.',
    ],
    show: 'Toque Dó–Mi–Sol (graus 1, 3 e 5 em Dó). Depois toque a mesma forma começando em Ré: Ré–Fá♯–Lá. Mostre que a mão mantém as distâncias (4 + 3 semitons) e que só os nomes mudaram, e que Fá♯ continua sendo uma letra F.',
  } satisfies RecapText as RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Transposition',
    title: 'Transposition',
    sub: 'The same music, another key',
    teaser: 'Every note moves the same distance; scale degrees and Roman numerals stay the same.',
  },
  desc:
    'To transpose is to play the same music starting on another note. The tune stays recognizable because every note moves exactly the same distance. Let us take a short melody, with the chords I–IV–V–I, from C major to the key chosen on the circle.',
  isC: 'You are in C major, and transposing from C to C changes nothing. So this lesson uses G major as the target. Pick another key on the circle to take the melody there.',

  srcTitle: '1. The melody in C major',
  srcHint:
    'The numbers inside the keys are scale degrees. Look at the melody written in degrees: 3 4 5 3 | 6 5 4 6 | 5 4 2 7 | 1. It ends with the leading tone (7) rising to the tonic (1).',
  tuneDegrees: 'Melody in degrees',
  chordsLabel: 'Chords · tap to hear',
  playIn: (k: S) => `Hear it in ${k}`,
  kbdAria: (k: S) => `Keyboard with the melody notes in ${k}, marked with their degree.`,
  lgTonic: 'tonic (degree 1)',
  lgScale: 'other melody notes (number = degree)',

  p1: (k: S) => `Now in <b>${k}</b>: which note is degree 5? Tap it.`,
  p1r: (names: S, fifth: S) =>
    `Count five letter names from the tonic: ${names}. Degree 5 is <b>${fifth}</b>, always a perfect 5th (7 half steps) above the tonic, because the formula W W H W W W H is the same in every key. That is why degrees do not change when you transpose.`,
  p2: (k: S, deg: number, a: S, b: S) =>
    `In <b>${k}</b>, degree ${deg} falls on a key that could be called ${a} or ${b}. Which is the right name in this key?`,
  p2r: (deg: number, prev: S, letter: S, right: S, wrong: S) =>
    `A scale uses each letter once, in order. Degree ${deg - 1} is ${prev}, so degree ${deg} needs the next letter, ${letter}: <b>${right}</b>. ${wrong} is the same key, but it would leave one letter twice and another missing.`,

  stepsTitle: '2. Step by step: how to transpose',
  steps: (from: S, to: S, intName: S, semis: number, letters: number, ex: S, exLetter: S, exTo: S) => [
    `<b>Measure the distance between the tonics.</b> From ${from} up to ${to} is ${intName}: ${semis} half steps, and the letter moves ${letters} ${letters === 1 ? 'place' : 'places'} (${letters + 1} names, counting both ends).`,
    `<b>Move every note that same distance.</b> Melody and chords, no exceptions. That keeps the intervals, and with them the tune.`,
    `<b>Spell by letter, then fix the accidental.</b> Example: ${ex} moves ${letters} letter ${letters === 1 ? 'place' : 'places'} and becomes ${exLetter}; the accidental adjusts to make ${semis} half steps: <b>${exTo}</b>.`,
    `<b>Shortcut: use the degrees.</b> The melody in degrees (3 4 5 3 | 6 5 4 6 | 5 4 2 7 | 1) and the chords in Roman numerals (I–IV–V–I) do not change. Just read each degree in the new scale.`,
  ],
  intName: (ord: S, q: S) => `${/^[aeiou]/.test(q) ? 'an' : 'a'} ${q} ${ord}`,
  tableAria: 'Table of the seven degrees in both keys.',
  rowDeg: 'degree',
  rowNaive: 'counting half steps only',
  naiveHint:
    'The last row shows the mistake of counting half steps only and calling every black key a sharp: one letter appears twice and another disappears (in coral, what comes out wrong).',

  naiveOk: 'In this key, counting half steps and calling every black key a sharp happens to get every name right. Try F major or F♯ major on the circle: there that count goes wrong.',
  dstTitle: (k: S) => `3. The same melody in ${k}`,
  dstHint: 'Same numbers on the keys, same Roman numerals. Only the names changed. Hear both versions one after the other.',

  whyTitle: 'The logic underneath',
  why: [
    '<b>Why degrees do not change</b>: the major scale has the same formula (W W H W W W H) in every key, so each degree is always the same distance from the tonic. Moving everything by the same interval takes each degree to the same degree of the new scale.',
    '<b>Why by letter</b>: a major scale uses all seven letters, one per degree. Counting half steps only, you might write A♯ where the scale needs B♭: same key, but the scale ends up with two As and no B, and reading becomes a puzzle.',
    '<b>Why singers ask to transpose</b>: every voice has a comfortable range. If a song sits too high or too low, everything moves down or up a step or two. The tune stays the same because the intervals between the notes are the same.',
    '<b>Why Roman numerals make it easy</b>: a progression written in degrees (I–IV–V–I) already works in every key. To transpose you only need to read the names in the new scale; the function of each chord (T, SD, D) does not change.',
    '<b>Numbers instead of chord symbols</b>: in Nashville, session musicians often write chords as numbers (1, 4, 5), the so-called Nashville number system, precisely so they can change key on the spot.',
    '<b>Transposing instruments</b>: on a B♭ clarinet, a written C sounds B♭. Its part comes already transposed, so the same fingering works for the whole family of the instrument.',
    '<b>The “transpose” button</b>: many digital keyboards have a button that shifts every note. The pianist plays in C and the sound comes out in another key. The same idea as this lesson, done by the machine.',
  ],
  transfer: (k: S) => `In <b>${k}</b>, what are the first three notes of the melody (degrees 3, 4 and 5)? Say the names before you play.`,
  recap: {
    oneLine: 'By moving every note the same distance: degrees and Roman numerals do not change, so you just read each degree in the new scale, letter by letter, without rewriting the song from scratch.',
    confusions: [
      '<b>Counting half steps vs counting letters</b>: half steps tell you which key; letters tell you which name. Degree 4 of F major is B♭, not A♯.',
      '<b>Degree vs note</b>: “degree 5” is a position in the scale (the dominant); the note in that position changes with the key.',
      '<b>Same shape vs same keys</b>: when you transpose, the black and white keys change (D major brings F♯ and C♯), but the distances between the notes stay the same.',
    ],
    show: 'Play C–E–G (degrees 1, 3 and 5 in C). Then play the same shape starting on D: D–F♯–A. Show that the hand keeps the distances (4 + 3 half steps), that only the names changed, and that F♯ is still a letter F.',
  },
};

export const text = {
  pt,
  en,
  glossary: [
    ['Transposition', 'transpose', 'Transposição', 'Tocar ou escrever uma música em outra tonalidade, movendo todas as notas pelo mesmo intervalo. Os graus e os algarismos romanos não mudam; os nomes das notas mudam, letra por letra.', 'Playing or writing music in another key by moving every note by the same interval. Degrees and Roman numerals stay the same; the note names change, letter by letter.'],
  ],
} satisfies LessonText<typeof pt>;
