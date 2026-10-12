import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

/* Note names in braces ({F#}) are replaced by the chosen notation; chord symbols always use letters. */
const pt = {
  meta: {
    nav: 'Ode à Alegria',
    title: 'Ode à Alegria',
    sub: 'Beethoven, 9ª Sinfonia: grau conjunto, período e síncope',
    teaser: 'Por que o tema é tão fácil de cantar e tão difícil de esquecer: a análise em 16 compassos.',
  },
  name: 'Beethoven, tema da Ode à Alegria (9ª Sinfonia), em Ré maior',
  desc:
    'O tema do último movimento da 9ª Sinfonia de Beethoven, na tonalidade original, Ré maior. São 16 compassos em quatro frases de 4. A melodia é a de Beethoven. Na sinfonia o tema aparece primeiro sozinho, nos violoncelos e contrabaixos; o acompanhamento de mão esquerda aqui é uma <b>harmonização simples nossa</b>, só com I e V.',
  source: 'Melodia original (Ré maior). Mão esquerda: harmonização simples, não é a de Beethoven.',

  p1: {
    prompt: 'Ouça de cabeça o começo: “{F#} {F#} {G} {A} | {A} {G} {F#} {E} …”. Nos compassos 1 a 8, quantas vezes a melodia <b>salta</b>, isto é, vai para uma nota que não é a vizinha?',
    options: ['Duas', 'Nenhuma', 'Cinco'],
    answer: 'Nenhuma',
    reveal:
      'Nenhuma. Toda nota vai para a vizinha de cima, a de baixo ou se repete: é grau conjunto do começo ao fim. A voz nunca precisa “achar” uma nota longe, e por isso qualquer pessoa canta o tema de primeira.',
  },
  p2: {
    prompt: 'A última frase começa com {F#}, como a primeira. No original, onde esse {F#} começa a soar?',
    options: ['No tempo 1 do compasso 13, como as outras frases', 'No tempo 4 do compasso 12, um tempo antes, ligado por cima da barra'],
    answer: 'No tempo 4 do compasso 12, um tempo antes, ligado por cima da barra',
    reveal:
      'Beethoven adianta o {F#}: ele entra no tempo 4, que é fraco, e continua ligado até o tempo forte. Tirar o acento do lugar esperado é a síncope; a nota que chega antes do acorde dela é uma antecipação. Compare abaixo as duas versões.',
  },

  syncTitle: 'Compassos 11 a 13: com e sem a antecipação',
  syncOrig: 'Como Beethoven escreveu',
  syncPlain: 'Sem a antecipação',
  syncNote: 'Na versão de Beethoven o {F#} chega um tempo antes e fica ligado: a última frase “tropeça” para dentro, e é esse tropeço que todo mundo lembra.',

  findings: [
    '<b>Grau conjunto.</b> Nos compassos 1 a 8 não há nenhum salto: cada nota vai para a vizinha ou se repete. É a forma mais fácil de cantar.',
    '<b>Poucas notas, extensão pequena.</b> As frases principais usam só cinco notas, {D} {E} {F#} {G} {A}, o espaço de uma 5ª justa. O tema inteiro cabe numa oitava, de {A}3 a {A}4.',
    '<b>Pergunta e resposta.</b> A 1ª frase termina em {E} (o 2º grau) sobre o V: cadência suspensiva, uma pergunta. A 2ª frase é igual até o último compasso e termina em {D} sobre o I: cadência perfeita, a resposta. Juntas, formam um período.',
    '<b>Três vezes a mesma frase.</b> A forma é a a’ b a’: a frase de abertura volta três vezes. Só a frase b é diferente, com alguns saltos e um fim no {A} grave, a dominante, que prepara a volta.',
    '<b>A síncope.</b> No compasso 12, o {F#} da última frase entra no tempo 4 e fica ligado sobre a barra. O acento sai do tempo forte: é a síncope. Em relação ao acorde de {D}, que só chega no compasso 13, essa nota é uma antecipação.',
    '<b>Dois acordes bastam.</b> A melodia é feita de notas dos acordes I ({D}) e V ({A}), ligadas por passagens. Por isso nossa harmonização só usa I, V e V7, e o ouvido entende a tonalidade sem esforço.',
  ],

  logic: [
    '<b>Por que grau conjunto é fácil</b>: para cantar uma nota vizinha a voz só “escorrega” um tom ou um semitom. Um salto exige achar a nota nova de cabeça. Melodias de canções populares e de hinos são quase todas assim.',
    '<b>Por que a repetição grava</b>: quando a mesma frase volta, o ouvido já a reconhece e espera pelo final. Ouvir a frase três vezes em 16 compassos é o que torna o tema difícil de esquecer.',
    '<b>Por que a 1ª frase soa como pergunta</b>: ela para no {E}, o 2º grau, que pertence ao V ({A}–{C#}–{E}) e não ao I. O ouvido fica esperando o {D}. A 2ª frase entrega o {D}: a mesma música, com a resposta no fim.',
    '<b>Por que a síncope chama atenção</b>: o ouvido espera notas novas nos tempos fortes. Uma nota que entra no tempo fraco e se sustenta sobre o forte quebra essa expectativa, e o que quebra a expectativa é lembrado.',
    '<b>A história</b>: a 9ª Sinfonia estreou em Viena em 1824, quando Beethoven já estava praticamente surdo. O texto do último movimento vem do poema “An die Freude” (À Alegria), de Friedrich Schiller. Hoje o tema, sem o texto, é o hino da Europa.',
  ],
  more: [4],

  recap: {
    oneLine:
      'É fácil de cantar porque anda quase só por grau conjunto, em poucas notas; e é difícil de esquecer porque a mesma frase volta três vezes, primeiro como pergunta (no V) e depois como resposta (no I), com uma síncope que dá um tropeço memorável.',
    confusions: [
      '<b>Síncope × antecipação</b>: síncope é o acento fora do tempo forte (um efeito de ritmo); antecipação é a nota que chega antes do acorde ao qual pertence (um efeito de harmonia). Aqui a mesma nota faz as duas coisas.',
      '<b>Grau conjunto × nota repetida</b>: as duas são “sem salto”, mas no grau conjunto a nota muda para a vizinha; na repetição ela fica igual.',
      '<b>Frase a × a’</b>: começam iguais; a primeira termina no 2º grau ({E}, pergunta), a segunda no 1º ({D}, resposta).',
    ],
    show:
      'Toque os compassos 1 a 4 só com o polegar até o mindinho, sem mudar a mão de lugar: a mão direita fica em {D} {E} {F#} {G} {A}, e a melodia inteira cabe nos cinco dedos.',
  } satisfies RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Ode to Joy',
    title: 'Ode to Joy',
    sub: 'Beethoven, Symphony No. 9: steps, period and syncopation',
    teaser: 'Why the theme is so easy to sing and so hard to forget: the analysis in 16 bars.',
  },
  name: 'Beethoven, Ode to Joy theme (Symphony No. 9), in D major',
  desc:
    'The theme of the last movement of Beethoven’s Ninth Symphony, in its original key, D major. It is 16 bars in four phrases of 4. The melody is Beethoven’s. In the symphony the theme is first heard alone, in the cellos and double basses; the left-hand accompaniment here is a <b>simple harmonization of ours</b>, using only I and V.',
  source: 'Original melody (D major). Left hand: a simple harmonization, not Beethoven’s.',

  p1: {
    prompt: 'Hear the opening in your head: “{F#} {F#} {G} {A} | {A} {G} {F#} {E} …”. In bars 1 to 8, how many times does the melody <b>leap</b>, that is, go to a note that is not the next one?',
    options: ['Two', 'None', 'Five'],
    answer: 'None',
    reveal:
      'None. Every note goes to the next note up, the next note down, or repeats: it moves by step from start to end. The voice never has to “find” a far note, which is why anyone can sing the theme at first try.',
  },
  p2: {
    prompt: 'The last phrase starts with {F#}, like the first one. In the original, where does that {F#} start to sound?',
    options: ['On beat 1 of bar 13, like the other phrases', 'On beat 4 of bar 12, one beat early, tied over the bar line'],
    answer: 'On beat 4 of bar 12, one beat early, tied over the bar line',
    reveal:
      'Beethoven brings the {F#} forward: it enters on beat 4, a weak beat, and stays tied into the strong beat. Moving the accent away from where we expect it is syncopation; a note that arrives before its chord is an anticipation. Compare the two versions below.',
  },

  syncTitle: 'Bars 11 to 13: with and without the anticipation',
  syncOrig: 'As Beethoven wrote it',
  syncPlain: 'Without the anticipation',
  syncNote: 'In Beethoven’s version the {F#} arrives one beat early and is held: the last phrase “stumbles” in, and that stumble is what everyone remembers.',

  findings: [
    '<b>Steps.</b> In bars 1 to 8 there is not a single leap: every note goes to its neighbor or repeats. It is the easiest way to sing.',
    '<b>Few notes, small range.</b> The main phrases use only five notes, {D} {E} {F#} {G} {A}, the space of a perfect 5th. The whole theme fits in one octave, from {A}3 to {A}4.',
    '<b>Question and answer.</b> Phrase 1 ends on {E} (degree 2) over V: a half cadence, a question. Phrase 2 is the same until its last bar and ends on {D} over I: an authentic cadence, the answer. Together they make a period.',
    '<b>The same phrase three times.</b> The form is a a’ b a’: the opening phrase comes back three times. Only phrase b is different, with a few leaps and an ending on the low {A}, the dominant, which prepares the return.',
    '<b>The syncopation.</b> In bar 12, the {F#} of the last phrase enters on beat 4 and is tied over the bar line. The accent leaves the strong beat: that is syncopation. Against the {D} chord, which only arrives in bar 13, that note is an anticipation.',
    '<b>Two chords are enough.</b> The melody is made of notes of the I ({D}) and V ({A}) chords, linked by passing tones. That is why our harmonization uses only I, V and V7, and the ear grasps the key effortlessly.',
  ],

  logic: [
    '<b>Why steps are easy</b>: to sing the next note the voice only “slides” a whole or half step. A leap means finding the new note in your head. Folk songs and hymns are almost all like this.',
    '<b>Why repetition sticks</b>: when the same phrase returns, the ear already knows it and waits for the ending. Hearing the phrase three times in 16 bars is what makes the theme hard to forget.',
    '<b>Why phrase 1 sounds like a question</b>: it stops on {E}, degree 2, which belongs to V ({A}–{C#}–{E}) and not to I. The ear keeps waiting for {D}. Phrase 2 delivers the {D}: the same music, with the answer at the end.',
    '<b>Why the syncopation stands out</b>: the ear expects new notes on strong beats. A note that enters on a weak beat and is held over the strong one breaks that expectation, and what breaks expectation is remembered.',
    '<b>The history</b>: the Ninth Symphony premiered in Vienna in 1824, when Beethoven was already almost completely deaf. The text of the last movement comes from Friedrich Schiller’s poem “An die Freude” (To Joy). Today the theme, without words, is the anthem of Europe.',
  ],
  more: [4],

  recap: {
    oneLine:
      'It is easy to sing because it moves almost only by step, on a few notes; and it is hard to forget because the same phrase comes back three times, first as a question (on V) and then as an answer (on I), with a syncopation that gives a memorable stumble.',
    confusions: [
      '<b>Syncopation vs anticipation</b>: syncopation is an accent off the strong beat (a rhythm effect); an anticipation is a note that arrives before the chord it belongs to (a harmony effect). Here the same note does both.',
      '<b>Step vs repeated note</b>: both are “no leap”, but in a step the note changes to its neighbor; in a repetition it stays the same.',
      '<b>Phrase a vs a’</b>: they start the same; the first ends on degree 2 ({E}, question), the second on degree 1 ({D}, answer).',
    ],
    show:
      'Play bars 1 to 4 using thumb to little finger without moving your hand: the right hand sits on {D} {E} {F#} {G} {A}, and the whole melody fits under five fingers.',
  } satisfies RecapText,
};

export const text = {
  pt,
  en,
  glossary: [
    ['Syncopation', '', 'Síncope', 'Acento rítmico fora do lugar esperado: uma nota que começa num tempo fraco (ou entre tempos) e se prolonga sobre o tempo forte.', 'A rhythmic accent out of its expected place: a note that starts on a weak beat (or between beats) and is held over the strong beat.'],
    ['Anticipation', '', 'Antecipação', 'Nota que soa antes do acorde ao qual pertence: chega cedo e, quando o acorde muda, já é nota dele.', 'A note that sounds before the chord it belongs to: it arrives early and, when the chord changes, is already one of its notes.'],
  ],
} satisfies LessonText<typeof pt>;
