import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

const pt = {
  meta: {
    nav: 'Leitura na pauta',
    title: 'Ler a pauta do piano',
    sub: 'Clave de sol, clave de fá e o Dó central entre elas',
    teaser: 'A pauta dupla ligada ao teclado: cada linha e cada espaço é uma tecla branca, contando letras.',
  },
  desc:
    'A pauta é um mapa das teclas brancas na vertical. Cada degrau, de uma linha para o espaço seguinte, é uma letra a mais: Dó, Ré, Mi… Os sustenidos e bemóis não ganham degrau próprio; eles vêm da armadura de clave ou de um sinal ao lado da nota. O piano usa duas pautas ao mesmo tempo: a de cima (clave de sol) e a de baixo (clave de fá).',
  modeLabel: 'Modo',
  modes: { explore: 'Explorar', game: 'Achar a nota' },
  exploreHint: 'Toque numa tecla para ver a nota na pauta, ou toque numa linha ou espaço da pauta para acender a tecla.',
  gameHint: 'Qual tecla é esta nota? A armadura de clave vale: toque na tecla certa, na oitava certa.',
  middleToggle: 'Mostrar a linha que falta (Dó central)',
  middleLabel: 'Dó central',
  nudgeUp: 'Subir um degrau na pauta',
  nudgeDown: 'Descer um degrau na pauta',
  clear: 'Limpar',
  staffAria: (key: string) => `Pauta dupla em ${key}, clave de sol e clave de fá`,
  kbdAria: 'Teclado de quatro oitavas, do Dó2 ao Dó6',
  noteName: (name: string, oct: number) => `${name}${oct}`,
  readNote: (name: string, clef: string, where: string) => `${name} · ${clef} · ${where}`,
  clefs: { treble: 'clave de sol', bass: 'clave de fá' },
  line: (n: number) => `${n}ª linha`,
  space: (n: number) => `${n}º espaço`,
  ledgerBelow: (n: number) => (n === 1 ? '1 linha suplementar abaixo' : `${n} linhas suplementares abaixo`),
  ledgerAbove: (n: number) => (n === 1 ? '1 linha suplementar acima' : `${n} linhas suplementares acima`),
  spaceBelow: 'logo abaixo da pauta',
  spaceAbove: 'logo acima da pauta',
  idle: 'Nada escolhido ainda.',
  next: 'Próxima nota',
  start: 'Começar',
  right: (name: string) => `Isso! ${name}.`,
  octWrong: (name: string) => `Nota certa, oitava errada: era ${name}. Conte as linhas a partir do Dó central.`,
  wrong: (got: string, name: string) => `Você tocou ${got}; a nota era ${name}.`,
  score: (streak: number, best: number) => `Sequência: ${streak} · recorde: ${best}`,
  lgTonic: 'tônica',
  lgScale: 'nota da escala',
  lgChg: 'nota fora da armadura (com acidente)',
  lgMiddle: 'Dó central',
  lgAnswer: 'a tecla certa',
  lgWrong: 'a tecla que você tocou',
  octNote: 'O número depois do nome é a oitava: Dó4 é o Dó central, e a oitava muda sempre no Dó.',

  derivedTitle: 'As letras saem da contagem',
  linesOf: (clef: string, lines: string, spaces: string) => `<b>${clef}</b>: linhas ${lines}; espaços ${spaces}.`,

  logicTitle: 'A lógica por baixo',
  logic: (g: string, f: string, c: string) => [
    `<b>Linhas e espaços se alternam</b>: subir da linha para o espaço de cima é andar uma letra. Por isso, de uma linha para a próxima linha pula-se uma letra (a do espaço do meio), e as linhas formam uma sequência de 3ªs. Não precisa decorar frases: basta saber uma nota e contar, como nas teclas brancas.`,
    `<b>As claves são letras</b>: a clave de sol é um G (Sol) desenhado; a espiral abraça a 2ª linha, que vira ${g}4, o ${g} logo acima do Dó central. A clave de fá é um F (Fá); os dois pontos cercam a 4ª linha, que vira ${f}3, o ${f} logo abaixo do Dó central.`,
    `<b>Por que duas pautas, e o ${c} central entre elas</b>: uma pauta de 5 linhas mostra só 9 degraus (pouco mais de uma oitava) sem linhas suplementares, e o piano tem mais de 7 oitavas. Por isso ele usa duas. Agora empilhe as duas e conte. As 5 linhas da clave de fá, mais uma linha, mais as 5 da clave de sol formam uma grade de 11 linhas, e a linha do meio, a 6ª, é o ${c}4. Essa linha não é desenhada (11 linhas seguidas seriam difíceis de ler); quando a nota é o ${c} central, ela aparece curtinha, como linha suplementar, abaixo da clave de sol ou acima da clave de fá. Assim cada pauta cobre uma metade do teclado, e cada mão costuma ler a sua.`,
    `<b>Linhas suplementares</b>: são pedacinhos da mesma grade que continuam para fora da pauta. A alternância linha, espaço, linha continua igual.`,
    `<b>A armadura vale em toda parte</b>: o ♯ ou ♭ da armadura vale em todas as oitavas e nas duas pautas. Um sinal ao lado da nota (♯, ♭ ou ♮) só aparece quando a nota foge da armadura.`,
    `<b>Origem</b>: no século XI, Guido d’Arezzo difundiu a pauta com linhas separadas por 3ªs e marcou certas linhas com uma letra (F ou C) para dizer qual nota elas eram. Com o tempo essas letras, e mais tarde também o G, viraram os desenhos das claves.`,
  ],

  p1: (key: string, name: string) =>
    `Na clave de sol, onde fica a tônica de <b>${key}</b>: o ${name} mais grave que cabe dentro das 5 linhas?`,
  p1Reveal: (where: string, path: string) =>
    `${where}. Comece pela 2ª linha, que é o Sol (a espiral da clave de sol a abraça), e conte uma letra por degrau, linha, espaço, linha: ${path}.`,
  p2Staff: (key: string) => `Pauta dupla em ${key} com uma nota na clave de fá`,
  p2: 'A nota na pauta acima está na clave de fá (com a armadura da tonalidade). Toque a tecla dela, na oitava certa.',
  p2Reveal: (name: string, path: string) =>
    `É o ${name}. Os dois pontos da clave de fá cercam a 4ª linha, que é o Fá logo abaixo do Dó central; conte a partir dele, uma letra por degrau: ${path}.`,
  transfer: (key: string) =>
    `Vá para <b>${key}</b> e responda antes de tocar: quais letras levam sinal na armadura, e em que linha ou espaço fica a tônica na clave de fá?`,
  recap: (c: string, d: string, e: string): RecapText => ({
    oneLine: `O piano soa grave e agudo demais para uma pauta só, então usa duas, uma para cada metade do teclado; empilhadas, elas formam uma grade de 11 linhas, e a linha do meio, a que não se desenha, é o ${c} central. Dentro delas é só contar letras: cada degrau é a próxima tecla branca.`,
    confusions: [
      '<b>Clave de sol × clave de fá</b>: a mesma posição é outra nota. Na clave de fá, cada linha e espaço tem a letra duas acima da clave de sol (a 1ª linha é Mi numa e Sol na outra), e soa bem mais grave.',
      `<b>Linha suplementar × linha da pauta</b>: a linha curta do ${c} central não é a 1ª linha de nenhuma das pautas. É a linha que falta entre as duas.`,
      '<b>Armadura × sinal ao lado da nota</b>: o ♯ ou ♭ da armadura vale para todas as notas com aquela letra, em todas as oitavas e nas duas pautas. O sinal ao lado da nota só aparece quando ela foge da armadura.',
    ],
    show: `Ponha o polegar direito no ${c} central: na pauta ele fica na linha curta logo abaixo da clave de sol. Suba ${d} e ${e}: o ${e} já é a 1ª linha. Depois mostre que o mesmo ${c} é a linha curta logo acima da clave de fá.`,
  }),
};

const en: typeof pt = {
  meta: {
    nav: 'Reading the staff',
    title: 'Reading the piano staff',
    sub: 'Treble clef, bass clef and middle C between them',
    teaser: 'The grand staff linked to the keyboard: each line and space is a white key, counted by letters.',
  },
  desc:
    'The staff is a map of the white keys turned on its side. Each step, from a line to the next space, is one more letter: C, D, E… Sharps and flats do not get their own step; they come from the key signature or a sign before the note. The piano uses two staves at once: the upper one (treble clef) and the lower one (bass clef).',
  modeLabel: 'Mode',
  modes: { explore: 'Explore', game: 'Find the note' },
  exploreHint: 'Tap a key to see the note on the staff, or tap a line or space on the staff to light the key.',
  gameHint: 'Which key is this note? The key signature counts: tap the right key, in the right octave.',
  middleToggle: 'Show the missing line (middle C)',
  middleLabel: 'middle C',
  nudgeUp: 'One step up the staff',
  nudgeDown: 'One step down the staff',
  clear: 'Clear',
  staffAria: (key: string) => `Grand staff in ${key}, treble clef and bass clef`,
  kbdAria: 'Four-octave keyboard, from C2 to C6',
  noteName: (name: string, oct: number) => `${name}${oct}`,
  readNote: (name: string, clef: string, where: string) => `${name} · ${clef} · ${where}`,
  clefs: { treble: 'treble clef', bass: 'bass clef' },
  line: (n: number) => `line ${n}`,
  space: (n: number) => `space ${n}`,
  ledgerBelow: (n: number) => (n === 1 ? '1 ledger line below' : `${n} ledger lines below`),
  ledgerAbove: (n: number) => (n === 1 ? '1 ledger line above' : `${n} ledger lines above`),
  spaceBelow: 'just below the staff',
  spaceAbove: 'just above the staff',
  idle: 'Nothing chosen yet.',
  next: 'Next note',
  start: 'Start',
  right: (name: string) => `Yes! ${name}.`,
  octWrong: (name: string) => `Right note, wrong octave: it was ${name}. Count the lines from middle C.`,
  wrong: (got: string, name: string) => `You played ${got}; the note was ${name}.`,
  score: (streak: number, best: number) => `Streak: ${streak} · best: ${best}`,
  lgTonic: 'tonic',
  lgScale: 'scale note',
  lgChg: 'note outside the key signature (with an accidental)',
  lgMiddle: 'middle C',
  lgAnswer: 'the right key',
  lgWrong: 'the key you played',
  octNote: 'The number after the name is the octave: C4 is middle C, and the octave number always changes at C.',

  derivedTitle: 'The letters come from counting',
  linesOf: (clef: string, lines: string, spaces: string) => `<b>${clef}</b>: lines ${lines}; spaces ${spaces}.`,

  logicTitle: 'The logic underneath',
  logic: (g: string, f: string, c: string) => [
    `<b>Lines and spaces alternate</b>: going from a line to the space above is one letter. So from one line to the next line you skip one letter (the one in the space between), and the lines form a chain of 3rds. No need to memorize sentences: know one note and count, as on the white keys.`,
    `<b>The clefs are letters</b>: the treble clef is a drawn G; its curl wraps the 2nd line, which becomes ${g}4, the ${g} just above middle C. The bass clef is an F; its two dots surround the 4th line, which becomes ${f}3, the ${f} just below middle C.`,
    `<b>Why two staves, with middle ${c} between them</b>: a 5-line staff shows only 9 steps (a little more than an octave) without ledger lines, and the piano has more than 7 octaves. So it uses two. Now stack them and count. The 5 lines of the bass clef, plus one line, plus the 5 of the treble clef make an 11-line grid, and the middle line, the 6th, is ${c}4. That line is not drawn (11 lines in a row would be hard to read); when the note is middle ${c}, it shows up short, as a ledger line, below the treble clef or above the bass clef. So each staff covers one half of the keyboard, and each hand usually reads its own.`,
    `<b>Ledger lines</b>: short pieces of the same grid that continue outside the staff. The line, space, line pattern stays the same.`,
    `<b>The key signature counts everywhere</b>: a ♯ or ♭ in the key signature applies in every octave and on both staves. A sign before a note (♯, ♭ or ♮) appears only when the note departs from the key signature.`,
    `<b>Origin</b>: in the 11th century, Guido of Arezzo spread the use of a staff with lines a 3rd apart and marked certain lines with a letter (F or C) to say which note they were. Over time those letters, and later G as well, became the clef shapes.`,
  ],

  p1: (key: string, name: string) =>
    `In the treble clef, where is the tonic of <b>${key}</b>: the lowest ${name} that fits inside the 5 lines?`,
  p1Reveal: (where: string, path: string) =>
    `${where[0].toUpperCase() + where.slice(1)}. Start from line 2, which is G (the curl of the treble clef wraps it), and count one letter per step, line, space, line: ${path}.`,
  p2Staff: (key: string) => `Grand staff in ${key} with one note on the bass clef`,
  p2: 'The note on the staff above is on the bass clef (with the key signature). Tap its key, in the right octave.',
  p2Reveal: (name: string, path: string) =>
    `It is ${name}. The two dots of the bass clef surround line 4, the F just below middle C; count from there, one letter per step: ${path}.`,
  transfer: (key: string) =>
    `Go to <b>${key}</b> and answer before playing: which letters carry a sign in the key signature, and on which line or space is the tonic in the bass clef?`,
  recap: (c: string, d: string, e: string): RecapText => ({
    oneLine: `The piano goes too low and too high for one staff, so it uses two, one for each half of the keyboard; stacked, they form an 11-line grid, and the middle line, the one not drawn, is middle ${c}. Inside them you just count letters: each step is the next white key.`,
    confusions: [
      '<b>Treble clef × bass clef</b>: the same position is a different note. In the bass clef each line and space has the letter two above the treble clef (line 1 is E in one and G in the other), and it sounds much lower.',
      `<b>Ledger line × staff line</b>: the short line of middle ${c} is not line 1 of either staff. It is the missing line between the two.`,
      '<b>Key signature × sign before a note</b>: a ♯ or ♭ in the key signature applies to every note with that letter, in every octave and on both staves. A sign before a note appears only when the note departs from the key signature.',
    ],
    show: `Put your right thumb on middle ${c}: on the staff it sits on the short line just below the treble clef. Go up ${d} and ${e}: ${e} is already line 1. Then show that the same ${c} is the short line just above the bass clef.`,
  }),
};

export const text = {
  pt,
  en,
  glossary: [
    ['Bass clef', 'F clef', 'Clave de fá', 'A clave da pauta de baixo no piano; os dois pontos cercam a linha do Fá abaixo do Dó central.', 'The clef of the piano\'s lower staff; its two dots surround the line of the F below middle C.'],
    ['Grand staff', 'great staff', 'Pauta dupla', 'As pautas da clave de sol e da clave de fá unidas por uma chave. Juntas são uma pauta de 11 linhas sem a linha do meio, o Dó central.', 'The treble and bass staves joined by a brace. Together they are an 11-line staff without its middle line, middle C.'],
    ['Ledger line', '', 'Linha suplementar', 'Linha curta que estende a pauta para notas acima ou abaixo dela.', 'A short line that extends the staff for notes above or below it.'],
    ['Middle C', 'C4', 'Dó central', 'O Dó no meio do teclado (Dó4). Fica numa linha suplementar entre as duas pautas do piano.', 'The C in the middle of the keyboard (C4). It sits on a ledger line between the two piano staves.'],
  ],
} satisfies LessonText<typeof pt>;
