import type { LessonText } from '../lessonText';

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
    'Ela pode ser a fundamental, a terça ou a quinta de um acorde: são só três candidatos (é a mesma conta da lição Compor).',
    'Escolha pensando no caminho das funções: tônica (casa) → subdominante (sair) → dominante (tensão) → tônica (voltar).',
    'Comece no I e termine com V → I: é a cadência autêntica, o ponto final.',
    'Toque o resultado, leia as dicas e troque o que soar estranho.',
  ],
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
    start: () => 'Começar no I deixa claro, logo de cara, onde é a casa.',
    end: () => 'O último acorde não é o I: a música termina sem chegar em casa. Experimente o I no último compasso.',
    cadence: (bar: number) => `Antes do I final, o V (compasso ${bar}) faz a cadência autêntica, o final mais forte que existe.`,
    dim: (bar: number) =>
      `O vii° do compasso ${bar} não vai para o I. Ele é um V sem a fundamental: sozinho soa instável. Resolva no I ou troque pelo V.`,
    back: (bar: number) =>
      `No compasso ${bar} a música volta da dominante para a subdominante. Pode, mas soa como dar um passo para trás no caminho T → SD → D → T.`,
    ok: () => 'Tudo certo: começa em casa, segue o caminho das funções e fecha com V → I.',
  } as Record<Tip, (bar: number) => S>,
  logicTitle: 'A lógica por baixo',
  logic: [
    '<b>Por que três acordes</b>: um acorde são graus empilhados de dois em dois (1-3-5). Uma nota é fundamental do acorde dela, terça do acorde dois graus abaixo e quinta do acorde quatro graus abaixo. Três acordes, nem mais nem menos.',
    '<b>Por que a função importa</b>: acordes da mesma função dividem notas (I, iii e vi são todos “tônica”). Trocar um pelo outro muda a cor, não a direção; trocar de função muda a direção.',
    '<b>Por que V → I no final</b>: o V tem a sensível, que sobe meio tom para a tônica, e o trítono, que resolve para dentro. Nenhum outro par de acordes fecha com tanta força.',
    '<b>Por que evitar o vii° sozinho</b>: o vii° é o V7 sem a fundamental (Si-Ré-Fá em Dó, dentro de Sol-Si-Ré-Fá). Tem toda a tensão e nenhum chão; pede resolução imediata no I.',
    '<b>Origem</b>: é assim que se aprendia harmonia desde o século XVIII, com os corais de Bach: uma melodia dada no soprano e o aluno escolhendo um acorde por nota.',
  ],
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
    'It can be the root, third or fifth of a chord: only three candidates (the same count as in the Composing lesson).',
    'Choose with the path of functions in mind: tonic (home) → subdominant (leave) → dominant (tension) → tonic (return).',
    'Start on I and end with V → I: the authentic cadence, the period at the end of the sentence.',
    'Play the result, read the tips and change whatever sounds odd.',
  ],
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
    start: () => 'Starting on I makes it clear, right away, where home is.',
    end: () => 'The last chord is not I: the piece ends without getting home. Try I in the last bar.',
    cadence: (bar: number) => `Before the final I, V (bar ${bar}) makes the authentic cadence, the strongest ending there is.`,
    dim: (bar: number) =>
      `The vii° in bar ${bar} does not go to I. It is a V without its root: on its own it sounds unstable. Resolve it to I or swap it for V.`,
    back: (bar: number) =>
      `In bar ${bar} the music goes back from dominant to subdominant. It is allowed, but it feels like a step backwards on the path T → SD → D → T.`,
    ok: () => 'All good: it starts at home, follows the path of functions and closes with V → I.',
  } as Record<Tip, (bar: number) => S>,
  logicTitle: 'The logic underneath',
  logic: [
    '<b>Why three chords</b>: a chord is scale degrees stacked every other one (1-3-5). A note is the root of its own chord, the third of the chord two degrees below and the fifth of the chord four degrees below. Three chords, no more, no less.',
    '<b>Why function matters</b>: chords with the same function share notes (I, iii and vi are all “tonic”). Swapping one for another changes the color, not the direction; changing function changes the direction.',
    '<b>Why V → I at the end</b>: V holds the leading tone, which rises a half step to the tonic, and the tritone, which resolves inward. No other pair of chords closes as strongly.',
    '<b>Why avoid vii° alone</b>: vii° is V7 without its root (B-D-F in C, inside G-B-D-F). It has all the tension and no floor; it asks to resolve to I right away.',
    '<b>Origin</b>: this is how harmony has been taught since the 18th century, with Bach’s chorales: a given melody in the soprano and the student choosing one chord per note.',
  ],
};

export const text = {
  pt,
  en,
  glossary: [
    ['Harmonization', '', 'Harmonização', 'Escolher acordes para uma melodia dada. Cada nota da escala cabe em três acordes da tonalidade: como fundamental, terça ou quinta.', 'Choosing chords for a given melody. Each scale note fits three chords of the key: as root, third or fifth.'],
  ],
} satisfies LessonText<typeof pt>;
