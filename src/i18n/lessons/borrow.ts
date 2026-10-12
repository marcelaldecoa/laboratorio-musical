import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

type S = string;

const pt = {
  meta: {
    nav: 'Empréstimo modal',
    title: 'Empréstimo modal',
    sub: 'iv, ♭VI, ♭VII: acordes da tonalidade homônima (menor paralela) dentro da maior',
    teaser: 'A mesma casa com outra luz: acordes pegos da tonalidade menor com a mesma tônica.',
  },
  desc: 'A tonalidade homônima (menor paralela) tem a mesma tônica que a sua tonalidade maior, mas três notas abaixadas meio tom: o 3º, o 6º e o 7º graus. Na trilha Harmonia na menor você viu os acordes dela; iv, ♭VI e ♭VII estão entre eles. Como a casa é a mesma, dá para pegar esses acordes emprestados sem mudar de tonalidade. O resultado é uma sombra rápida, um toque de melancolia ou de força.',
  stepsTitle: 'Passo a passo',
  step1: (maj: S, min: S) => `<b>Mesma tônica, outra escala:</b> ${maj} e ${min} começam na mesma nota.`,
  step2: (b3: S, b6: S, b7: S) => `<b>Três notas descem meio tom:</b> 3º, 6º e 7º graus viram ${b3}, ${b6} e ${b7}. Na linha de quintas, a janela anda 3 passos para a esquerda (3 bemóis a mais).`,
  step3: '<b>Compare grau por grau:</b> monte as tríades da homônima menor nos mesmos graus. As que contêm uma nota abaixada soam diferentes das da maior: são os acordes emprestados.',
  winTitle: 'A janela da homônima menor',
  winAria: (a: S, b: S) => `Linha de quintas com as janelas de ${a} e ${b}`,
  major: (n: S) => `${n} maior`,
  minor: (n: S) => `${n} menor`,
  lgCommon: 'notas comuns',
  lgOut: 'só na maior',
  lgIn: 'nota abaixada da menor',
  rowMajor: (k: S) => `Acordes de ${k}`,
  rowBorrow: (k: S) => `Emprestados de ${k} (homônima)`,
  read: (roman: S, name: S, notes: S, changed: S, cr: S, cn: S) =>
    `<b>${roman}</b> (${name}) = ${notes}. Comparado com ${cr} (${cn}), muda ${changed}.`,
  compare: (a: S, b: S) => `${a} → ${b}`,
  lgBorrow: 'nota do acorde emprestado',
  lgChg: 'a nota que mudou',
  lgWas: 'onde a nota estava na maior',
  dbl: (pairs: S) => `Grafia lógica com dobrado bemol: ${pairs}. Cada nota é um grau abaixado, por isso a letra se mantém; na prática, muita gente escreve a nota enarmônica mais simples.`,
  progTitle: 'Sons famosos',
  progs: { rock: 'I – ♭VII – IV – I', amen: 'I – IV – iv – I', epic: 'I – ♭VI – ♭VII – I' } as Record<string, string>,
  progDesc: {
    rock: 'O ♭VII como “dominante sem sensível”: muito comum no rock. Chega na tônica por baixo, sem a tensão do V.',
    amen: 'O IV vira iv: uma única nota desce meio tom e o “Amém” ganha uma sombra. Ouça a nota coral descer e depois cair na quinta da tônica.',
    epic: 'O ♭VI e o ♭VII sobem em blocos até a tônica maior: som de trilha sonora e de final heroico.',
  } as Record<string, string>,
  play: 'Tocar',
  stop: 'Parar',
  prev: '◀',
  next: '▶',
  now: (i: number, n: number) => `${i + 1}/${n}`,
  readProg: (roman: S, name: S, borrowed: boolean) => `<b>${roman}</b> (${name})${borrowed ? ' · emprestado da homônima menor' : ''}`,
  lgT: 'tônica',
  lgSD: 'subdominante / emprestado',
  lgD: 'dominante',
  logicTitle: 'A lógica por baixo',
  logic: (key: S, min: S) => [
    `<b>Por que a homônima:</b> a relativa menor tem as mesmas notas e outra tônica; a homônima tem a mesma tônica e outras notas. Como o ouvido continua ancorado na mesma casa, ${key} pode usar notas de ${min} sem modular.`,
    `<b>Três bemóis a mais:</b> a menor natural é a maior com 3º, 6º e 7º graus abaixados. São exatamente as três próximas notas da ordem dos bemóis a partir da armadura atual: a janela andou 3 passos no sentido anti-horário.`,
    `<b>Por que roxo:</b> todos os acordes emprestados vêm do lado dos bemóis, o lado da subdominante. Por isso o iv e o ♭VI costumam fazer papel de preparação, e o ♭VII soa como um IV do IV.`,
    `<b>Por que soa como sombra:</b> no iv, a terça do acorde encolhe de 4 para 3 semitons, e terça menor é o som do acorde menor. Além disso, a nota abaixada (6º grau) fica meio tom acima do 5º e tende a cair nele, um movimento para baixo. No ♭VII, o 7º abaixado tira a sensível e deixa a chegada mais suave. Uma nota coral muda a cor; a tônica, que não mudou, mantém a casa.`,
    `<b>Na história:</b> compositores do século XIX, como Schubert e Brahms, alternavam maior e menor na mesma tônica para criar luz e sombra. O caminho contrário é mais antigo: a terça de picardia, uma peça menor que termina num acorde maior.`,
  ],
  predictQ: (key: S, iv: S, notes: S) =>
    `Em ${key}, o IV é <b>${iv}</b> = ${notes}. Na homônima menor ele vira iv: só uma dessas três notas desce meio tom. Qual? Toque-a.`,
  predictA: (n: S, low: S) =>
    `${n} é o 6º grau, um dos três que a homônima menor abaixa (3º, 6º e 7º); vira ${low}. As outras duas notas (1º e 4º graus) não mudam, por isso o iv soa como o mesmo acorde “com sombra”.`,
  transfer: (k: S) => `Em ${k}, quais notas formam o iv e o ♭VII? Qual nota de cada um desceu meio tom?`,
  recap: {
    oneLine: 'A sombra vem de uma única nota: o acorde emprestado da homônima menor traz o 3º, o 6º ou o 7º grau abaixado meio tom, mas a tônica não muda, então o ouvido sente a mesma casa com outra luz.',
    confusions: [
      '<b>Homônima × relativa:</b> Dó menor é a homônima de Dó maior (mesma tônica, 3 bemóis); Lá menor é a relativa (mesmas notas, outra tônica).',
      '<b>Empréstimo × modulação:</b> o empréstimo dura um acorde e a tônica continua a mesma; não há cadência numa nova tonalidade.',
      '<b>♭VII × vii°:</b> em Dó maior, B♭ (Si♭ Ré Fá) é emprestado da menor; B° (Si Ré Fá) é o acorde da própria escala.',
    ],
    show: 'Em Dó maior: toque F e depois Fm (só o Lá desce para Lá♭) e resolva em C. Depois toque C – B♭ – F – C e mostre o Si♭ no lugar do Si.',
  } satisfies RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Modal borrowing',
    title: 'Modal borrowing',
    sub: 'iv, ♭VI, ♭VII: chords from the parallel minor inside the major',
    teaser: 'The same home in a different light: chords taken from the minor key with the same tonic.',
  },
  desc: 'The parallel minor has the same tonic as your major key, but three notes lowered a half step: degrees 3, 6 and 7. In the Harmony in minor track you saw its chords; iv, ♭VI and ♭VII are among them. Since home is the same, you can borrow those chords without changing key. The result is a quick shadow, a touch of melancholy or of power.',
  stepsTitle: 'Step by step',
  step1: (maj: S, min: S) => `<b>Same tonic, another scale:</b> ${maj} and ${min} start on the same note.`,
  step2: (b3: S, b6: S, b7: S) => `<b>Three notes drop a half step:</b> degrees 3, 6 and 7 become ${b3}, ${b6} and ${b7}. On the line of fifths, the window moves 3 steps to the left (3 more flats).`,
  step3: '<b>Compare degree by degree:</b> build the parallel minor’s triads on the same degrees. The ones that contain a lowered note sound different from the major ones: those are the borrowed chords.',
  winTitle: 'The parallel minor’s window',
  winAria: (a: S, b: S) => `Line of fifths with the windows of ${a} and ${b}`,
  major: (n: S) => `${n} major`,
  minor: (n: S) => `${n} minor`,
  lgCommon: 'shared notes',
  lgOut: 'only in the major',
  lgIn: 'lowered note from the minor',
  rowMajor: (k: S) => `Chords of ${k}`,
  rowBorrow: (k: S) => `Borrowed from ${k} (parallel)`,
  read: (roman: S, name: S, notes: S, changed: S, cr: S, cn: S) =>
    `<b>${roman}</b> (${name}) = ${notes}. Compared with ${cr} (${cn}), ${changed} changes.`,
  compare: (a: S, b: S) => `${a} → ${b}`,
  lgBorrow: 'borrowed chord tone',
  lgChg: 'the note that changed',
  lgWas: 'where the note was in major',
  dbl: (pairs: S) => `Logical spelling with double flats: ${pairs}. Each note is a lowered degree, so the letter stays; in practice many musicians write the simpler enharmonic note.`,
  progTitle: 'Famous sounds',
  progs: { rock: 'I – ♭VII – IV – I', amen: 'I – IV – iv – I', epic: 'I – ♭VI – ♭VII – I' } as Record<string, string>,
  progDesc: {
    rock: '♭VII as a “dominant without a leading tone”: very common in rock. It reaches the tonic from below, without the tension of V.',
    amen: 'IV becomes iv: one note drops a half step and the “Amen” gets a shadow. Hear the coral note fall and then land on the tonic’s fifth.',
    epic: '♭VI and ♭VII climb in blocks to the major tonic: a film-score, heroic-ending sound.',
  } as Record<string, string>,
  play: 'Play',
  stop: 'Stop',
  prev: '◀',
  next: '▶',
  now: (i: number, n: number) => `${i + 1}/${n}`,
  readProg: (roman: S, name: S, borrowed: boolean) => `<b>${roman}</b> (${name})${borrowed ? ' · borrowed from the parallel minor' : ''}`,
  lgT: 'tonic',
  lgSD: 'subdominant / borrowed',
  lgD: 'dominant',
  logicTitle: 'The logic underneath',
  logic: (key: S, min: S) => [
    `<b>Why the parallel:</b> the relative minor has the same notes and another tonic; the parallel has the same tonic and other notes. Because the ear stays anchored to the same home, ${key} can use notes from ${min} without modulating.`,
    `<b>Three more flats:</b> natural minor is major with degrees 3, 6 and 7 lowered. They are exactly the next three notes in the order of flats after the current signature: the window moved 3 steps counter-clockwise.`,
    `<b>Why purple:</b> every borrowed chord comes from the flat side, the subdominant side. That is why iv and ♭VI usually act as preparation, and ♭VII sounds like the IV of IV.`,
    `<b>Why it sounds like a shadow:</b> in iv, the chord’s third shrinks from 4 to 3 half steps, and a minor third is the sound of a minor chord. Also, the lowered note (degree 6) sits a half step above degree 5 and tends to fall onto it, a downward pull. In ♭VII, the lowered 7th removes the leading tone and softens the arrival. One coral note changes the color; the tonic, unchanged, keeps home in place.`,
    `<b>In history:</b> 19th-century composers such as Schubert and Brahms alternated major and minor on the same tonic to create light and shade. The opposite path is older: the Picardy third, a minor piece that ends on a major chord.`,
  ],
  predictQ: (key: S, iv: S, notes: S) =>
    `In ${key}, IV is <b>${iv}</b> = ${notes}. In the parallel minor it becomes iv: only one of these three notes drops a half step. Which one? Tap it.`,
  predictA: (n: S, low: S) =>
    `${n} is degree 6, one of the three the parallel minor lowers (3, 6 and 7); it becomes ${low}. The other two notes (degrees 1 and 4) stay, which is why iv sounds like the same chord “in shadow”.`,
  transfer: (k: S) => `In ${k}, which notes make iv and ♭VII? Which note of each dropped a half step?`,
  recap: {
    oneLine: 'The shadow comes from a single note: the chord borrowed from the parallel minor brings degree 3, 6 or 7 lowered a half step, but the tonic stays, so the ear feels the same home in a different light.',
    confusions: [
      '<b>Parallel vs relative:</b> C minor is the parallel of C major (same tonic, 3 flats); A minor is the relative (same notes, another tonic).',
      '<b>Borrowing vs modulation:</b> a borrowed chord lasts one chord and the tonic stays; there is no cadence in a new key.',
      '<b>♭VII vs vii°:</b> in C major, B♭ (B♭ D F) is borrowed from minor; B° (B D F) is the scale’s own chord.',
    ],
    show: 'In C major: play F, then Fm (only A drops to A♭), and resolve to C. Then play C – B♭ – F – C and point to B♭ in place of B.',
  },
};

export const text = {
  pt,
  en,
  glossary: [
    ['Parallel minor', 'parallel key', 'Tonalidade homônima (menor paralela)', 'A tonalidade menor com a mesma tônica da maior (Dó menor para Dó maior), também chamada tonalidade homônima. Tem 3 bemóis a mais: 3º, 6º e 7º graus abaixados.', 'The minor key with the same tonic as the major (C minor for C major). It has 3 more flats: degrees 3, 6 and 7 lowered.'],
    ['Modal borrowing', 'modal mixture, borrowed chord', 'Empréstimo modal', 'Usar na tonalidade maior acordes da homônima menor (menor paralela), como iv, ♭VI, ♭VII e ♭III, sem mudar de tônica.', 'Using chords from the parallel minor inside a major key, such as iv, ♭VI, ♭VII and ♭III, without changing the tonic.'],
  ],
} satisfies LessonText<typeof pt>;
