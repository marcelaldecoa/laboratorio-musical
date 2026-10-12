import type { RecapText } from './types';

type S = string;
type Fn = 'T' | 'SD' | 'D';

const pt = {
  desc:
    'Na aula Notas do acorde, a melodia nasceu dos acordes. Agora o caminho é o inverso: você tem uma nota da melodia e quer saber quais acordes servem para ela. Escolha uma nota abaixo e preveja antes de ouvir.',
  melLabel: 'Nota da melodia',
  predThird: (mel: S) => `${mel} é a <b>terça</b> de um acorde da tonalidade. Toque a fundamental desse acorde.`,
  predThirdReveal: (mel: S, root: S, chord: S) =>
    `Um acorde pula de dois em dois graus (1-3-5). Então, a partir de ${mel}, desça dois graus da escala: ${root}. O acorde ${chord} tem ${mel} como terça.`,
  predCount: (mel: S) => `Em quantos dos 7 acordes da tonalidade a nota ${mel} aparece?`,
  predCountReveal: (mel: S, a: S, b: S, c: S) =>
    `Em três. ${mel} é a fundamental de ${a}, a terça de ${b} e a quinta de ${c}. Cada acorde tem três notas, e cada nota ocupa uma dessas três posições em um acorde diferente.`,
  harmRole: (n: S, r: S) => `${n} é a ${r} do acorde`,
  roleName: { root: 'fundamental', third: 'terça', fifth: 'quinta' } as Record<'root' | 'third' | 'fifth', S>,
  fnName: { T: 'tônica', SD: 'subdominante', D: 'dominante' } as Record<Fn, S>,
  playHarm: 'Ouvir com a melodia no topo',
  keyLabel: (chord: S, mel: S) => `${chord} com ${mel} na melodia`,
  lgT: 'tônica (I, iii, vi)',
  lgSD: 'subdominante (ii, IV)',
  lgD: 'dominante (V, vii°)',
  lgMel: 'nota da melodia (♪)',
  chooseTitle: 'Então, qual dos três?',
  choose: [
    'A nota de cima é a mesma nos três acordes. O que muda é a <b>função</b> do acorde: tônica (casa), subdominante (sair) ou dominante (tensão).',
    'Por isso a pergunta não é “qual acorde está certo?”, e sim “para onde a frase precisa ir agora?”.',
    'No começo, a tônica diz onde é a casa. No meio, a subdominante sai de casa. Antes do fim, a dominante cria a tensão. No fim, V → I fecha.',
  ],
  recipeTitle: 'Receita para compor uma frase',
  recipe: [
    'Escolha a tonalidade no círculo e liste os seus 7 acordes. Esse é o seu vocabulário.',
    'Planeje duas frases de 4 compassos, como na aula Frases e forma: a pergunta termina no V (vírgula); a resposta começa igual e termina em V → I (ponto final).',
    'Preencha o caminho com funções: T → SD → D → T. Para variar, troque um acorde por outro da mesma função: vi no lugar do I, ii no lugar do IV.',
    'Na melodia, faça como na aula Notas do acorde: notas do acorde nos tempos fortes, e notas de passagem ou bordaduras entre elas, por grau conjunto.',
    '<b>Ritmo harmônico</b> é a frequência com que os acordes mudam. Um acorde por compasso é o padrão; trocar mais rápido perto da cadência cria impulso.',
    'Teste o final: troque o último I por vi. Se soar inacabado (é a cadência de engano), a sua cadência está funcionando.',
  ],
  moreBass:
    '<b>O baixo</b>: quando a fundamental do baixo cai uma quinta (Sol → Dó), a mudança soa decidida, como no V → I. Quando anda por terça (Dó → Lá), soa suave, porque os dois acordes dividem duas notas. Quando anda por grau (Fá → Sol), dá um empurrão, porque os acordes não têm nenhuma nota em comum.',
  nextHint: 'Na próxima aula, Harmonizar, você aplica isto a uma melodia inteira, compasso por compasso.',
  logicTitle: 'A lógica por baixo',
  logic: [
    '<b>Por que três acordes</b>: um acorde são graus empilhados de dois em dois (1-3-5). Uma nota é a fundamental do acorde dela, a terça do acorde dois graus abaixo e a quinta do acorde quatro graus abaixo. Três, nem mais nem menos.',
    '<b>Mesma função, outra cor</b>: I, iii e vi dividem notas e são todos “tônica”. Trocar um pelo outro muda a cor do som, não a direção da frase. Trocar de função muda a direção.',
    '<b>A nota de cima é a que mais se ouve</b>: por isso a melodia fica no topo, e o acorde muda por baixo dela.',
  ],
  transfer: (k: S) => `Em ${k}, escolha a 5ª nota da escala: quais são os três acordes que a contêm, e qual deles é a dominante?`,
  recap: {
    oneLine:
      'Não existe um acorde “certo”: a nota cabe em três acordes, cada um com uma função (tônica, subdominante ou dominante), e você escolhe a função que leva a frase para onde ela precisa ir, T → SD → D → T, fechando com V → I.',
    confusions: [
      '<b>Nota da melodia × fundamental do acorde</b>: a nota de cima pode ser a terça ou a quinta do acorde, não só a fundamental.',
      '<b>Mesma função × outra função</b>: vi no lugar do I muda a cor; IV no lugar do I muda a direção.',
      '<b>Ritmo harmônico × ritmo da melodia</b>: o primeiro é quantas vezes o acorde muda; o segundo, a duração de cada nota da melodia.',
    ],
    show:
      'Em Dó, segure Mi no alto com a mão direita e toque embaixo, com a esquerda, Dó-Sol (I), depois Sol-Si (iii) e depois Lá-Dó (vi). A mesma nota muda de cor a cada acorde.',
  } as RecapText,
};

const en: typeof pt = {
  desc:
    'In the Chord tones lesson, the melody grew out of the chords. Now we go the other way: you have a melody note and want to know which chords fit it. Choose a note below and predict before you listen.',
  melLabel: 'Melody note',
  predThird: (mel: S) => `${mel} is the <b>third</b> of a chord in the key. Tap that chord’s root.`,
  predThirdReveal: (mel: S, root: S, chord: S) =>
    `A chord skips every other scale degree (1-3-5). So from ${mel}, go down two scale degrees: ${root}. The ${chord} chord has ${mel} as its third.`,
  predCount: (mel: S) => `In how many of the key’s 7 chords does ${mel} appear?`,
  predCountReveal: (mel: S, a: S, b: S, c: S) =>
    `In three. ${mel} is the root of ${a}, the third of ${b} and the fifth of ${c}. Each chord has three notes, and each note takes one of those three places in a different chord.`,
  harmRole: (n: S, r: S) => `${n} is the chord’s ${r}`,
  roleName: { root: 'root', third: 'third', fifth: 'fifth' } as Record<'root' | 'third' | 'fifth', S>,
  fnName: { T: 'tonic', SD: 'subdominant', D: 'dominant' } as Record<Fn, S>,
  playHarm: 'Hear it with the melody on top',
  keyLabel: (chord: S, mel: S) => `${chord} with ${mel} in the melody`,
  lgT: 'tonic (I, iii, vi)',
  lgSD: 'subdominant (ii, IV)',
  lgD: 'dominant (V, vii°)',
  lgMel: 'melody note (♪)',
  chooseTitle: 'So, which of the three?',
  choose: [
    'The top note is the same in all three chords. What changes is the chord’s <b>function</b>: tonic (home), subdominant (leaving) or dominant (tension).',
    'So the question is not “which chord is right?” but “where does the phrase need to go now?”.',
    'At the start, the tonic says where home is. In the middle, the subdominant leaves home. Before the end, the dominant builds tension. At the end, V → I closes.',
  ],
  recipeTitle: 'A recipe for composing a phrase',
  recipe: [
    'Choose the key on the circle and list its 7 chords. That is your vocabulary.',
    'Plan two 4-bar phrases, as in the Phrases and form lesson: the question ends on V (a comma); the answer starts the same and ends V → I (a period).',
    'Fill the path with functions: T → SD → D → T. For variety, swap a chord for another with the same function: vi instead of I, ii instead of IV.',
    'In the melody, do as in the Chord tones lesson: chord tones on strong beats, and passing or neighbor tones between them, by step.',
    '<b>Harmonic rhythm</b> is how often the chords change. One chord per bar is the default; changing faster near the cadence builds momentum.',
    'Test the ending: swap the last I for vi. If it sounds unfinished (that is the deceptive cadence), your cadence is working.',
  ],
  moreBass:
    '<b>The bass</b>: when the bass root falls a fifth (G → C), the change sounds decisive, as in V → I. When it moves by a third (C → A), it sounds smooth, because the two chords share two notes. When it moves by step (F → G), it gives a push, because the chords share no notes.',
  nextHint: 'In the next lesson, Harmonize, you apply this to a whole melody, bar by bar.',
  logicTitle: 'The logic underneath',
  logic: [
    '<b>Why three chords</b>: a chord is scale degrees stacked every other one (1-3-5). A note is the root of its own chord, the third of the chord two degrees below and the fifth of the chord four degrees below. Three, no more, no less.',
    '<b>Same function, another color</b>: I, iii and vi share notes and are all “tonic”. Swapping one for another changes the color of the sound, not the direction of the phrase. Changing function changes the direction.',
    '<b>The top note is the one you hear most</b>: that is why the melody stays on top and the chord changes underneath it.',
  ],
  transfer: (k: S) => `In ${k}, choose the 5th note of the scale: which three chords contain it, and which one is the dominant?`,
  recap: {
    oneLine:
      'There is no single “right” chord: the note fits three chords, each with a function (tonic, subdominant or dominant), and you pick the function that takes the phrase where it needs to go, T → SD → D → T, closing with V → I.',
    confusions: [
      '<b>Melody note × chord root</b>: the top note can be the chord’s third or fifth, not only its root.',
      '<b>Same function × different function</b>: vi instead of I changes the color; IV instead of I changes the direction.',
      '<b>Harmonic rhythm × melodic rhythm</b>: the first is how often the chord changes; the second, how long each melody note lasts.',
    ],
    show:
      'In C, hold E high in the right hand and play underneath, with the left, C-G (I), then G-B (iii), then A-C (vi). The same note changes color with each chord.',
  } as RecapText,
};

export const extras = { pt, en };
