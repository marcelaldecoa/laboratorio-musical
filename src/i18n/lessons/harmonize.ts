import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

type S = string;
type Tip = 'pick' | 'start' | 'end' | 'cadence' | 'dim' | 'back' | 'ok';
type Fn = 'T' | 'SD' | 'D';

const pt = {
  meta: {
    nav: 'Harmonizar',
    title: 'Harmonizar uma melodia',
    sub: 'Escolher um acorde para cada nota, passo a passo',
    teaser: 'Cada nota cabe em três acordes. Escolha um por compasso e ouça a sua harmonia.',
  },
  desc:
    'Aqui está uma melodia de 8 notas, uma por compasso. Harmonizar é escolher um acorde para cada nota. Você não precisa adivinhar: cada nota da escala pertence a exatamente três acordes da tonalidade.',
  stepsTitle: 'Como fazer, em cinco passos',
  steps: [
    'Olhe a nota da melodia do compasso.',
    'Ela pode ser a fundamental, a terça ou a quinta de um acorde: são só três candidatos (é a mesma conta da aula Compor).',
    'Escolha pensando no caminho das funções: tônica (casa) → subdominante (sair) → dominante (tensão) → tônica (voltar).',
    'Comece no I, que mostra onde é a casa, e planeje o final antes do resto: os dois últimos compassos fazem a cadência.',
    'Toque o resultado, leia as dicas e troque o que soar estranho.',
  ],
  predEnd: (d: S, t: S) =>
    `Os dois últimos compassos têm <b>${d}</b> e <b>${t}</b> na melodia. Qual par de acordes fecha a música com ponto final?`,
  predEndReveal: (d: S, v: S, lt: S, t: S) =>
    `${v} → I. ${d} é a quinta do ${v}, então o acorde cabe na melodia. E o V traz a sensível ${lt}, que sobe meio tom até ${t}: é a cadência perfeita (ou autêntica). V → vi também cabe, mas é a cadência de engano: chega sem fechar.`,
  melLabel: 'A melodia · toque num compasso',
  barLabel: (k: number) => `Compasso ${k}`,
  none: '?',
  stepNow: (k: number, n: number, mel: S) => `Passo ${k} de ${n} · melodia em ${mel}`,
  options: (mel: S) => `Os três acordes que contêm ${mel}:`,
  roleIn: (mel: S, role: S) => `${mel} é a ${role}`,
  roleName: { root: 'fundamental', third: 'terça', fifth: 'quinta' } as Record<'root' | 'third' | 'fifth', S>,
  fnName: { T: 'tônica', SD: 'subdominante', D: 'dominante' } as Record<Fn, S>,
  choose: 'Escolher e ouvir',
  chosen: 'Escolhido',
  prev: '◀',
  next: '▶',
  play: 'Tocar a harmonização',
  stop: 'Parar',
  suggest: 'Ver uma sugestão',
  clear: 'Recomeçar',
  progLabel: 'Sua progressão',
  keyLabel: (chord: S, mel: S) => `${chord} com ${mel} na melodia`,
  lgT: 'tônica (I, iii, vi)',
  lgSD: 'subdominante (ii, IV)',
  lgD: 'dominante (V, vii°)',
  lgMel: 'nota da melodia (♪)',
  tipsTitle: 'Dicas',
  tip: {
    pick: (bar: number) => `Ainda falta escolher o acorde do compasso ${bar}.`,
    start: () => 'O primeiro acorde não é o I. Começar no I deixa claro, logo de cara, onde é a casa.',
    end: () => 'O último acorde não é o I: a música termina sem chegar em casa. Experimente o I no último compasso.',
    cadence: (bar: number) => `No compasso ${bar}, experimente o V: V → I é a cadência perfeita (ou autêntica), o final mais forte, porque a sensível sobe para a tônica.`,
    dim: (bar: number) =>
      `O vii° do compasso ${bar} não vai para o I. Ele é um V sem a fundamental: sozinho soa instável. Resolva no I ou troque pelo V.`,
    back: (bar: number) =>
      `No compasso ${bar} a música volta da dominante para a subdominante. Pode, mas soa como dar um passo para trás no caminho T → SD → D → T.`,
    ok: () => 'Tudo certo: começa em casa, segue o caminho das funções e fecha com V → I.',
  } as Record<Tip, (bar: number) => S>,
  logicTitle: 'A lógica por baixo',
  logic: [
    '<b>Por que três acordes</b>: como na aula Compor, um acorde pula de dois em dois graus (1-3-5), então cada nota é a fundamental de um acorde, a terça de outro e a quinta de um terceiro.',
    '<b>Por que a função importa</b>: acordes da mesma função dividem notas (I, iii e vi são todos “tônica”). Trocar um pelo outro muda a cor, não a direção; trocar de função muda a direção.',
    '<b>Por que V → I no final</b>: o V tem a sensível, que sobe meio tom para a tônica, e o baixo cai uma quinta (Sol → Dó em Dó maior), o movimento de baixo mais decidido. Nenhum outro par de acordes fecha com tanta força.',
    '<b>Por que evitar o vii° sozinho</b>: o vii° (Si-Ré-Fá em Dó) tem duas notas do V (Si e Ré), mas não tem a fundamental Sol, que daria o chão. E Si-Fá é o trítono, que pede resolução: por isso ele precisa ir logo para o I.',
    '<b>Origem</b>: harmonizar uma melodia dada é um exercício clássico do ensino de harmonia. Os corais a quatro vozes de Bach, reunidos e publicados depois da morte dele, viraram o modelo mais estudado: uma melodia conhecida no soprano e um acorde para cada nota.',
  ],
  transfer: (k: S) => `Em ${k}, a melodia muda de nome mas não de graus. Qual acorde vai no compasso 7, e que nota da melodia é a quinta dele?`,
  recap: {
    oneLine:
      'Sem adivinhar: para cada nota, liste os três acordes que a contêm (como 1, 3 ou 5) e escolha entre eles pelo caminho das funções, T → SD → D → T, começando no I e fechando com V → I.',
    confusions: [
      '<b>vii° × V</b>: os dois são dominantes e dividem duas notas, mas o vii° não tem a fundamental do V e soa instável sozinho.',
      '<b>iii × I</b>: dividem duas notas e os dois são tônica, mas o iii é uma tônica fraca: bom para variar, ruim para começar ou terminar.',
      '<b>Cadência de engano × erro</b>: V → vi no fim é uma escolha de propósito (pede mais música), não um acorde errado.',
    ],
    show:
      'Em Dó, toque a melodia Mi Fá Sol Lá Sol Mi Ré Dó na mão direita, uma nota por compasso. Na esquerda, toque I IV I ii V vi V I. Depois troque o último I por vi e ouça a música ficar no ar.',
  } as RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Harmonize',
    title: 'Harmonize a melody',
    sub: 'Choosing a chord for each note, step by step',
    teaser: 'Each note fits three chords. Pick one per bar and hear your harmony.',
  },
  desc:
    'Here is an 8-note melody, one note per bar. Harmonizing means choosing a chord for each note. No guessing needed: every scale note belongs to exactly three chords of the key.',
  stepsTitle: 'How to do it, in five steps',
  steps: [
    'Look at the bar’s melody note.',
    'It can be the root, third or fifth of a chord: only three candidates (the same count as in the Compose lesson).',
    'Choose with the path of functions in mind: tonic (home) → subdominant (leave) → dominant (tension) → tonic (return).',
    'Start on I, which shows where home is, and plan the ending before the rest: the last two bars make the cadence.',
    'Play the result, read the tips and change whatever sounds odd.',
  ],
  predEnd: (d: S, t: S) =>
    `The last two bars have <b>${d}</b> and <b>${t}</b> in the melody. Which pair of chords closes the piece with a period?`,
  predEndReveal: (d: S, v: S, lt: S, t: S) =>
    `${v} → I. ${d} is the fifth of ${v}, so the chord fits the melody. And V carries the leading tone ${lt}, which rises a half step to ${t}: the authentic (perfect) cadence. V → vi also fits, but it is the deceptive cadence: it arrives without closing.`,
  melLabel: 'The melody · tap a bar',
  barLabel: (k: number) => `Bar ${k}`,
  none: '?',
  stepNow: (k: number, n: number, mel: S) => `Step ${k} of ${n} · melody on ${mel}`,
  options: (mel: S) => `The three chords that contain ${mel}:`,
  roleIn: (mel: S, role: S) => `${mel} is the ${role}`,
  roleName: { root: 'root', third: 'third', fifth: 'fifth' } as Record<'root' | 'third' | 'fifth', S>,
  fnName: { T: 'tonic', SD: 'subdominant', D: 'dominant' } as Record<Fn, S>,
  choose: 'Choose and listen',
  chosen: 'Chosen',
  prev: '◀',
  next: '▶',
  play: 'Play the harmonization',
  stop: 'Stop',
  suggest: 'See a suggestion',
  clear: 'Start over',
  progLabel: 'Your progression',
  keyLabel: (chord: S, mel: S) => `${chord} with ${mel} in the melody`,
  lgT: 'tonic (I, iii, vi)',
  lgSD: 'subdominant (ii, IV)',
  lgD: 'dominant (V, vii°)',
  lgMel: 'melody note (♪)',
  tipsTitle: 'Tips',
  tip: {
    pick: (bar: number) => `You still need to choose the chord for bar ${bar}.`,
    start: () => 'The first chord is not I. Starting on I makes it clear, right away, where home is.',
    end: () => 'The last chord is not I: the piece ends without getting home. Try I in the last bar.',
    cadence: (bar: number) => `In bar ${bar}, try V: V → I is the authentic (perfect) cadence, the strongest ending, because the leading tone rises to the tonic.`,
    dim: (bar: number) =>
      `The vii° in bar ${bar} does not go to I. It is a V without its root: on its own it sounds unstable. Resolve it to I or swap it for V.`,
    back: (bar: number) =>
      `In bar ${bar} the music goes back from dominant to subdominant. It is allowed, but it feels like a step backwards on the path T → SD → D → T.`,
    ok: () => 'All good: it starts at home, follows the path of functions and closes with V → I.',
  } as Record<Tip, (bar: number) => S>,
  logicTitle: 'The logic underneath',
  logic: [
    '<b>Why three chords</b>: as in the Compose lesson, a chord skips every other degree (1-3-5), so each note is the root of one chord, the third of another and the fifth of a third one.',
    '<b>Why function matters</b>: chords with the same function share notes (I, iii and vi are all “tonic”). Swapping one for another changes the color, not the direction; changing function changes the direction.',
    '<b>Why V → I at the end</b>: V holds the leading tone, which rises a half step to the tonic, and the bass falls a fifth (G → C in C major), the most decisive bass move. No other pair of chords closes as strongly.',
    '<b>Why avoid vii° alone</b>: vii° (B-D-F in C) has two notes of V (B and D) but lacks the root G, which would give it a floor. And B-F is the tritone, which asks to resolve: that is why it needs to go to I right away.',
    '<b>Origin</b>: harmonizing a given melody is a classic exercise in harmony teaching. Bach’s four-part chorales, collected and published after his death, became the most studied model: a familiar tune in the soprano and one chord for each note.',
  ],
  transfer: (k: S) => `In ${k}, the melody changes names but not degrees. Which chord goes in bar 7, and which melody note is its fifth?`,
  recap: {
    oneLine:
      'No guessing: for each note, list the three chords that contain it (as 1, 3 or 5) and choose among them by the path of functions, T → SD → D → T, starting on I and closing with V → I.',
    confusions: [
      '<b>vii° × V</b>: both are dominants and share two notes, but vii° lacks the root of V and sounds unstable on its own.',
      '<b>iii × I</b>: they share two notes and both are tonic, but iii is a weak tonic: good for variety, poor for starting or ending.',
      '<b>Deceptive cadence × mistake</b>: V → vi at the end is a deliberate choice (it asks for more music), not a wrong chord.',
    ],
    show:
      'In C, play the melody E F G A G E D C in the right hand, one note per bar. In the left, play I IV I ii V vi V I. Then swap the last I for vi and hear the music stay in the air.',
  } as RecapText,
};

export const text = {
  pt,
  en,
  glossary: [
    ['Harmonization', '', 'Harmonização', 'Escolher acordes para uma melodia dada. Cada nota da escala cabe em três acordes da tonalidade: como fundamental, terça ou quinta.', 'Choosing chords for a given melody. Each scale note fits three chords of the key: as root, third or fifth.'],
  ],
} satisfies LessonText<typeof pt>;
