import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

type S = string;

const pt = {
  meta: {
    nav: 'Dominantes secundárias',
    title: 'Dominantes secundárias',
    sub: 'V/V, V/ii, V/vi: pegar emprestado o V7 de outro acorde',
    teaser: 'Qualquer acorde maior ou menor vira “tônica” por um instante, com uma sensível emprestada.',
  },
  desc: 'Você já sabe que o V7 puxa para a tônica porque traz a sensível, meio tom abaixo dela. A ideia agora é usar o mesmo truque com outros acordes: antes de um acorde da tonalidade, toque o V7 da tonalidade <i>dele</i>. Por um instante, aquele acorde soa como uma tônica. Chamamos esse V7 emprestado de dominante secundária.',
  targetLab: 'Escolha o acorde-alvo',
  chipSub: (v: S, x: S) => `${v} → ${x}`,
  of: (x: S) => `V/${x}`,
  stepsTitle: 'Passo a passo',
  step1: (roman: S, name: S) => `<b>Alvo:</b> ${roman} (${name}). É um acorde maior ou menor, então tem uma quinta justa e pode soar como tônica.`,
  step2: (a: S, b: S) => `<b>Suba uma quinta justa</b> a partir da fundamental do alvo: ${a} → ${b}. Essa é a dominante do alvo.`,
  step3: (name: S, notes: S) => `<b>Monte o V7</b> com a mesma receita de sempre (4 + 3 + 3 semitons): ${name} = ${notes}.`,
  step4lt: (borrowed: S, key: S, lt: S, root: S) =>
    `<b>A nota emprestada:</b> ${borrowed} não pertence a ${key}. ${lt} é a sensível de ${root}: fica meio tom abaixo e sobe para ${root}.`,
  step4iv: (key: S, lt: S, sev: S, dest: S) =>
    `<b>Caso especial:</b> aqui a sensível (${lt}) já pertence a ${key}. A nota emprestada é a sétima, ${sev}, que desce meio tom para ${dest}.`,
  windowsTitle: 'Espiar a janela vizinha',
  windowsDesc: (x: S, n: number) =>
    `O V7 de ${x} cabe inteiro na janela de 7 quintas da tonalidade de ${x}. Essa janela está ${Math.abs(n)} ${Math.abs(n) === 1 ? 'passo' : 'passos'} ${n > 0 ? 'para a direita (lado dos sustenidos)' : 'para a esquerda (lado dos bemóis)'}. As notas do acorde que caem fora da nossa janela são as emprestadas.`,
  winCur: (k: S) => `${k}`,
  winOf: (x: S) => `janela de ${x}`,
  lineAria: (v: S, x: S) => `Linha de quintas: o acorde ${v} dentro da janela de ${x}`,
  pairTitle: 'Ouvir a resolução',
  pairDesc: 'Toque os dois acordes em sequência. Repare na nota coral: ela sobe meio tom até a fundamental do alvo. As teclas tracejadas mostram onde cada voz estava.',
  progTitle: 'Numa progressão',
  progDesc: (roman: S) => `O mesmo acorde-alvo, agora dentro de uma frase completa. Compare de ouvido: ${roman} soa mais “chegada” do que soaria sozinho.`,
  play: 'Tocar',
  stop: 'Parar',
  prev: '◀',
  next: '▶',
  now: (i: number, n: number) => `${i + 1}/${n}`,
  readPair0: (v: S, x: S, lt: S) => `<b>${v}</b> → ${x}. A nota emprestada (${lt}) quer andar.`,
  readPair1: (x: S, lt: S, root: S) => `<b>${x}</b>: ${lt} subiu para ${root}. Por um instante, ${x} soou como tônica.`,
  readPair1iv: (x: S, sev: S, dest: S) => `<b>${x}</b>: ${sev} desceu para ${dest}. Por um instante, ${x} soou como tônica.`,
  readProg: (roman: S, name: S, fn: S) => `<b>${roman}</b> (${name}) · ${fn}`,
  fnT: 'repouso',
  fnSD: 'preparação',
  fnD: 'tensão',
  fnSec: 'dominante emprestada',
  lgV7: 'V7 emprestado',
  lgLt: 'nota emprestada (sensível temporária)',
  lgTarget: 'acorde-alvo: tônica por um instante',
  lgSD: 'subdominante',
  lgWas: 'onde a voz estava',
  lgLineCur: 'nossa janela',
  lgLineV: 'notas do V7',
  lgLineB: 'nota emprestada',
  lgLineT: 'fundamental do alvo',
  logicTitle: 'A lógica por baixo',
  logic: (key: S, vv: S, sharp4: S, four: S) => [
    `<b>Vem da sensível:</b> o V7 resolve porque a sensível está meio tom abaixo da tônica. Qualquer acorde maior ou menor pode ganhar uma sensível “de aluguel”: basta pegar emprestado o V7 da tonalidade dele.`,
    `<b>V/V é o vizinho do círculo:</b> em ${key}, o ${vv} traz ${sharp4}, o ${four} que sobe meio tom. É exatamente a nota que muda quando você dá um passo no sentido horário. A dominante secundária é uma espiada na tonalidade vizinha, sem se mudar para ela.`,
    `<b>Por que não vii°:</b> o acorde diminuto não tem quinta justa, então não soa como casa. Não existe tonalidade “de vii°” para pegar um V7 emprestado. E V/I seria o próprio V7.`,
    `<b>Tonicização ou modulação?</b> Quando o alvo aparece e a música volta logo para a tônica, é uma tonicização (uma visita). Se a música fica na nova tonalidade e faz cadência nela, é uma modulação (uma mudança). Esse é o assunto da próxima aula.`,
    `<b>Nomes:</b> na teoria das funções alemã, o V/V se chama <i>Doppeldominante</i> (“dupla dominante”). O som é bem mais antigo que o nome: os corais de Bach usam V/V e V/vi com frequência. Na música popular aparece em sequências como I – VI7 – ii – V (em Dó: C – A7 – Dm – G7), em que o VI7 é o V/ii.`,
  ],
  predictQ: (key: S, v: S, notes: S, x: S) =>
    `Em ${key}, o V/V é <b>${v}</b> = ${notes}: o V7 de ${x}. Uma dessas quatro notas não pertence a ${key}. Qual? Toque-a.`,
  predictA: (key: S, lt: S, x: S) =>
    `${lt} está fora de ${key}. É a terça do acorde e fica meio tom abaixo de ${x}: é a sensível emprestada, que sobe para ${x}. As outras três notas já são da escala.`,
  transfer: (k: S) => `Em ${k}, qual é o V/V? Qual nota dele fica fora da tonalidade, e para onde ela sobe?`,
  recap: {
    oneLine: 'Para fazer um acorde soar como “casa” por um instante, toque antes dele o V7 da tonalidade dele. A nota de fora é uma sensível emprestada, que sobe meio tom até ele.',
    confusions: [
      '<b>V/V × V:</b> em Dó maior, o V é Sol (G7) e o V/V é Ré (D7). O V/V vem antes do V e prepara a chegada nele.',
      '<b>Tonicização × modulação:</b> na tonicização o alvo soa como tônica por um instante e a música volta logo; na modulação ela fica na nova tonalidade e faz cadência lá.',
      '<b>V/IV × I:</b> em Dó, C7 tem a mesma fundamental da tônica, mas a sétima Si♭ (fora da escala) faz o acorde apontar para Fá.',
    ],
    show: 'Em Dó maior: toque D7 (Ré Fá♯ Lá Dó) e depois G. Aponte o Fá♯ subindo para Sol, igual ao Si que sobe para Dó em G7 → C.',
  } satisfies RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Secondary dominants',
    title: 'Secondary dominants',
    sub: 'V/V, V/ii, V/vi: borrowing another chord’s V7',
    teaser: 'Any major or minor chord can become a “tonic” for a moment, with a borrowed leading tone.',
  },
  desc: 'You already know the V7 pulls to the tonic because it carries the leading tone, a half step below it. Now use the same trick on other chords: before a chord of the key, play the V7 of <i>its</i> key. For a moment, that chord sounds like a tonic. This borrowed V7 is called a secondary dominant.',
  targetLab: 'Choose the target chord',
  chipSub: (v: S, x: S) => `${v} → ${x}`,
  of: (x: S) => `V/${x}`,
  stepsTitle: 'Step by step',
  step1: (roman: S, name: S) => `<b>Target:</b> ${roman} (${name}). It is major or minor, so it has a perfect fifth and can sound like a tonic.`,
  step2: (a: S, b: S) => `<b>Go up a perfect fifth</b> from the target’s root: ${a} → ${b}. That is the target’s dominant.`,
  step3: (name: S, notes: S) => `<b>Build the V7</b> with the usual recipe (4 + 3 + 3 half steps): ${name} = ${notes}.`,
  step4lt: (borrowed: S, key: S, lt: S, root: S) =>
    `<b>The borrowed note:</b> ${borrowed} is not in ${key}. ${lt} is the leading tone of ${root}: a half step below it, rising to ${root}.`,
  step4iv: (key: S, lt: S, sev: S, dest: S) =>
    `<b>Special case:</b> here the leading tone (${lt}) already belongs to ${key}. The borrowed note is the seventh, ${sev}, which falls a half step to ${dest}.`,
  windowsTitle: 'Peeking at the neighbor window',
  windowsDesc: (x: S, n: number) =>
    `The V7 of ${x} fits entirely inside the 7-fifth window of ${x}’s key. That window sits ${Math.abs(n)} ${Math.abs(n) === 1 ? 'step' : 'steps'} ${n > 0 ? 'to the right (the sharp side)' : 'to the left (the flat side)'}. The chord notes that fall outside our window are the borrowed ones.`,
  winCur: (k: S) => `${k}`,
  winOf: (x: S) => `${x} window`,
  lineAria: (v: S, x: S) => `Line of fifths: the ${v} chord inside the ${x} window`,
  pairTitle: 'Hear the resolution',
  pairDesc: 'Play the two chords in a row. Watch the coral note: it rises a half step to the target’s root. Dashed keys show where each voice was.',
  progTitle: 'In a progression',
  progDesc: (roman: S) => `The same target, now inside a complete phrase. Compare by ear: ${roman} feels more like an arrival than it would on its own.`,
  play: 'Play',
  stop: 'Stop',
  prev: '◀',
  next: '▶',
  now: (i: number, n: number) => `${i + 1}/${n}`,
  readPair0: (v: S, x: S, lt: S) => `<b>${v}</b> → ${x}. The borrowed note (${lt}) wants to move.`,
  readPair1: (x: S, lt: S, root: S) => `<b>${x}</b>: ${lt} rose to ${root}. For a moment, ${x} sounded like the tonic.`,
  readPair1iv: (x: S, sev: S, dest: S) => `<b>${x}</b>: ${sev} fell to ${dest}. For a moment, ${x} sounded like the tonic.`,
  readProg: (roman: S, name: S, fn: S) => `<b>${roman}</b> (${name}) · ${fn}`,
  fnT: 'rest',
  fnSD: 'preparation',
  fnD: 'tension',
  fnSec: 'borrowed dominant',
  lgV7: 'borrowed V7',
  lgLt: 'borrowed note (temporary leading tone)',
  lgTarget: 'target chord: tonic for a moment',
  lgSD: 'subdominant',
  lgWas: 'where the voice was',
  lgLineCur: 'our window',
  lgLineV: 'V7 notes',
  lgLineB: 'borrowed note',
  lgLineT: 'target’s root',
  logicTitle: 'The logic underneath',
  logic: (key: S, vv: S, sharp4: S, four: S) => [
    `<b>It comes from the leading tone:</b> the V7 resolves because its leading tone sits a half step below the tonic. Any major or minor chord can get a “rented” leading tone: just borrow the V7 of its key.`,
    `<b>V/V is the circle neighbor:</b> in ${key}, ${vv} brings ${sharp4}, the ${four} raised a half step. That is exactly the note that changes when you take one clockwise step. A secondary dominant peeks at the neighboring key without moving there.`,
    `<b>Why not vii°:</b> the diminished chord has no perfect fifth, so it does not sound like home. There is no “vii° key” to borrow a V7 from. And V/I would just be the V7 itself.`,
    `<b>Tonicization or modulation?</b> When the target arrives and the music soon returns to the tonic, it is a tonicization (a visit). If the music stays in the new key and cadences there, it is a modulation (a move). That is the next lesson.`,
    `<b>Names:</b> in German function theory, V/V is called <i>Doppeldominante</i> (“double dominant”). The sound is much older than the name: Bach’s chorales use V/V and V/vi often. In popular music it shows up in sequences like I – VI7 – ii – V (in C: C – A7 – Dm – G7), where VI7 is V/ii.`,
  ],
  predictQ: (key: S, v: S, notes: S, x: S) =>
    `In ${key}, V/V is <b>${v}</b> = ${notes}: the V7 of ${x}. One of these four notes is not in ${key}. Which one? Tap it.`,
  predictA: (key: S, lt: S, x: S) =>
    `${lt} is outside ${key}. It is the chord’s third and sits a half step below ${x}: the borrowed leading tone, which rises to ${x}. The other three notes are already in the scale.`,
  transfer: (k: S) => `In ${k}, what is V/V? Which of its notes falls outside the key, and where does it rise to?`,
  recap: {
    oneLine: 'To make a chord sound like “home” for a moment, play the V7 of its key right before it. The outside note is a borrowed leading tone that rises a half step into it.',
    confusions: [
      '<b>V/V vs V:</b> in C major, V is G (G7) and V/V is D (D7). V/V comes before V and prepares the arrival on it.',
      '<b>Tonicization vs modulation:</b> in a tonicization the target sounds like a tonic for a moment and the music soon returns; in a modulation it stays in the new key and cadences there.',
      '<b>V/IV vs I:</b> in C, C7 has the same root as the tonic, but its seventh B♭ (outside the scale) makes the chord point to F.',
    ],
    show: 'In C major: play D7 (D F♯ A C), then G. Point to F♯ rising to G, just like B rises to C in G7 → C.',
  },
};

export const text = {
  pt,
  en,
  glossary: [
    ['Secondary dominant', 'applied dominant, V/x', 'Dominante secundária', 'O V7 de um acorde da tonalidade que não é a tônica, como V/V (Ré7 em Dó maior). Traz uma nota de fora, a sensível temporária, que puxa para a fundamental do acorde-alvo.', 'The V7 of a chord of the key other than the tonic, such as V/V (D7 in C major). It brings an outside note, a temporary leading tone, that pulls to the target chord’s root.'],
    ['Tonicization', '', 'Tonicização', 'Fazer um acorde soar como tônica por um instante, em geral com uma dominante secundária, sem mudar de tonalidade.', 'Making a chord sound like a tonic for a moment, usually with a secondary dominant, without changing key.'],
  ],
} satisfies LessonText<typeof pt>;
