import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

/* Note names in braces ({F#}) are replaced by the chosen notation; chord symbols (D7/C) always use letters. */
const pt = {
  meta: {
    nav: 'Bach: Prelúdio em Dó',
    title: 'Bach, Prelúdio em Dó maior',
    sub: 'BWV 846, compassos 1 a 11: um desenho, onze acordes',
    teaser: 'O mesmo arpejo em todo compasso: só o acorde muda, e a análise mostra por quê funciona.',
  },
  name: 'J. S. Bach, Prelúdio em Dó maior, BWV 846',
  desc:
    'É o primeiro prelúdio do <i>Cravo Bem Temperado</i>, Livro I. Cada compasso é um único acorde tocado nota por nota, sempre no mesmo desenho: duas notas na mão esquerda e três na direita, que se repetem. O ritmo nunca muda. O que muda de um compasso para o outro é só o acorde, e é nele que está toda a história.',
  source: 'Compassos 1 a 11, com as notas e oitavas do original. Os algarismos romanos e as cifras são a nossa leitura: Bach não os escreveu.',

  p1: {
    prompt:
      'Até o compasso 5, todas as notas são teclas brancas: Dó maior puro. No compasso 6 aparece uma nota de fora. O compasso 7 é um acorde de {G}. Que nota, colocada logo abaixo de {G}, “puxaria” até ele, como {B} puxa até {C}? Toque-a.',
    reveal:
      '{F#}: meio tom abaixo de {G}, assim como {B} está meio tom abaixo de {C}. {F#} é a sensível de {G}. Com ele, {D}–{F#}–{A}–{C} vira D7, o acorde de dominante de {G}: a dominante da dominante (V⁷/V).',
  },
  p2: {
    prompt: 'Compassos 9, 10 e 11: Am7 → D7 → G. As fundamentais são {A}, {D} e {G}. Que distância separa cada fundamental da seguinte?',
    options: ['Uma 2ª abaixo', 'Uma 5ª abaixo (= 4ª acima)', 'Uma 3ª abaixo'],
    answer: 'Uma 5ª abaixo (= 4ª acima)',
    reveal:
      'Conte os nomes: {A}–{G}–{F}–{E}–{D} são cinco, então {A} desce uma 5ª até {D}, e {D} desce uma 5ª até {G}. É o mesmo movimento de V → I, repetido: o círculo das quintas no sentido anti-horário, andando em direção à tônica.',
  },

  findings: [
    '<b>Um desenho, onze acordes.</b> Cada compasso tem 5 notas: o baixo e mais uma na mão esquerda; três na direita, repetidas. O desenho se toca duas vezes por compasso. É um acorde quebrado (arpejo): o acorde inteiro soa, uma nota de cada vez.',
    '<b>O baixo quase não se mexe.</b> {C}, {C}, {B}, {C}, {C}, {C}, {B}, {B}, {A}: o baixo anda por grau conjunto em volta do Dó central. Para isso Bach usa inversões: Dm7/C, G7/B, Am/C. A cifra com barra mostra a nota do baixo.',
    '<b>ii–V–I logo na abertura.</b> Compassos 2 a 4: Dm7/C → G7/B → C, ou seja, subdominante → dominante → tônica. Em quatro compassos o ouvido já ouviu a tonalidade inteira: repouso, preparação, tensão e volta.',
    '<b>A primeira nota de fora: {F#}.</b> No compasso 6, o D7/C traz {F#}, a sensível de {G}. D7 é a dominante de {G}: o V⁷ do V (V⁷/V). Por um instante {G} soa como tônica (tonicização), e o compasso 7 chega em G/B.',
    '<b>Cada voz anda o mínimo.</b> Do compasso 6 para o 7: {F#} sobe meio tom para {G} (a sensível resolve para cima) e o {C} do baixo, a 7ª do D7, desce para {B}. É a resolução do V7 → I, só que em direção a {G}.',
    '<b>Corrente de quintas.</b> Compassos 9 a 11: Am7 → D7 → G. As fundamentais {A} → {D} → {G} caem uma 5ª de cada vez: o círculo das quintas no sentido anti-horário. O D7 volta, agora com {D} no baixo, e o trecho para no V ({G}): uma pausa na dominante.',
  ],

  bassTitle: 'A linha do baixo, compasso a compasso',
  bassAria: 'Gráfico da nota mais grave de cada compasso: Dó, Dó, Si, Dó, Dó, Dó, Si, Si, Lá, depois Ré e Sol.',
  bassNote: 'Os nove primeiros compassos ficam a um passo do Dó central. O salto só vem no fim, quando o baixo desce de {A} para {D} e sobe para {G}: as fundamentais da corrente de quintas.',
  lgBass: 'baixo de cada compasso (cor = função do acorde)',
  lgFifth: 'salto entre fundamentais (5ª abaixo = 4ª acima: a mesma nota de chegada)',
  fifthDown: '5ª ↓',
  fourthUp: '4ª ↑',

  logic: [
    '<b>Por que um desenho fixo funciona</b>: quando ritmo e desenho não mudam, o ouvido para de prestar atenção neles e passa a ouvir só o que muda, a harmonia. É como uma fileira de janelas iguais em que só a luz de cada uma muda.',
    '<b>Por que o baixo quase parado prende o ouvido</b>: a nota mais grave é a base que o ouvido usa para entender o acorde. Se o baixo fica em {C} enquanto os acordes mudam por cima, cada acorde novo soa como um desvio que pede para voltar. Esse puxa e volta é a tensão e o repouso das funções.',
    '<b>Por que o {F#} não muda a tonalidade</b>: nestes compassos ele aparece duas vezes, sempre a caminho de {G}, e logo depois a música continua em Dó maior. É tonicização ({G} vira tônica por um instante), não uma troca definitiva de tonalidade.',
    '<b>Por que as quintas levam para casa</b>: V → I é uma 5ª descendo. Encadear várias 5ªs descendo (Lá → Ré → Sol → Dó) faz cada acorde soar como a dominante do seguinte, uma fila de pequenas resoluções que aponta para a tônica.',
    '<b>O Cravo Bem Temperado</b>: em 1722 Bach reuniu um prelúdio e uma fuga em cada uma das 24 tonalidades maiores e menores (o Livro I). Era uma demonstração de que um teclado afinado para servir a todas as tonalidades podia tocar em qualquer uma delas (veja a aula <a href="#/aula/origin">A origem</a>).',
    '<b>A Ave Maria</b>: em 1853 Charles Gounod sobrepôs uma melodia a este prelúdio, deixando as notas de Bach por baixo. Mais tarde, com o texto da Ave Maria, ela ficou famosa como a “Ave Maria de Bach-Gounod”.',
  ],
  more: [4, 5],

  recap: {
    oneLine:
      'Bach fixa o desenho para que o ouvido escute só o que muda: um acorde por compasso, com o baixo andando por grau conjunto e uma dominante emprestada (D7) e uma corrente de quintas que levam de volta à dominante e à tônica.',
    confusions: [
      '<b>Dm7/C × C</b>: o baixo é o mesmo ({C}), mas o acorde é outro. Leia o acorde antes da barra e o baixo depois dela.',
      '<b>D7 × Dm7</b>: os dois têm {D}, {A} e {C}. O {F#} (3ª maior) faz do D7 uma dominante que puxa para {G}; com {F}, o Dm7 é o ii de Dó, sem essa puxada.',
      '<b>Tonicização × modulação</b>: um {F#} de passagem só aponta para {G}. Para mudar de tonalidade seria preciso uma cadência em {G} e o {F#} continuar.',
    ],
    show:
      'Toque o compasso 6 ({C} {D} {F#} {A} {D}) e depois o 7 ({B} {D} {G} {D} {G}) e mostre as duas vozes que andam meio tom: {F#} sobe para {G}, o {C} do baixo desce para {B}.',
  } satisfies RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Bach: Prelude in C',
    title: 'Bach, Prelude in C major',
    sub: 'BWV 846, bars 1 to 11: one pattern, eleven chords',
    teaser: 'The same arpeggio in every bar: only the chord changes, and the analysis shows why it works.',
  },
  name: 'J. S. Bach, Prelude in C major, BWV 846',
  desc:
    'This is the first prelude of <i>The Well-Tempered Clavier</i>, Book I. Each bar is a single chord played note by note, always in the same pattern: two notes in the left hand and three in the right, repeated. The rhythm never changes. What changes from one bar to the next is only the chord, and that is where the whole story is.',
  source: 'Bars 1 to 11, with the original notes and octaves. The Roman numerals and chord symbols are our reading: Bach did not write them.',

  p1: {
    prompt:
      'Up to bar 5 every note is a white key: plain C major. In bar 6 an outside note appears. Bar 7 is a {G} chord. Which note, placed just below {G}, would “pull” to it the way {B} pulls to {C}? Tap it.',
    reveal:
      '{F#}: a half step below {G}, just as {B} is a half step below {C}. {F#} is the leading tone of {G}. With it, {D}–{F#}–{A}–{C} becomes D7, the dominant chord of {G}: the dominant of the dominant (V⁷/V).',
  },
  p2: {
    prompt: 'Bars 9, 10 and 11: Am7 → D7 → G. The roots are {A}, {D} and {G}. What distance separates each root from the next?',
    options: ['A 2nd down', 'A 5th down (= 4th up)', 'A 3rd down'],
    answer: 'A 5th down (= 4th up)',
    reveal:
      'Count the names: {A}–{G}–{F}–{E}–{D} is five, so {A} falls a 5th to {D}, and {D} falls a 5th to {G}. It is the V → I motion, repeated: the circle of fifths counter-clockwise, walking toward the tonic.',
  },

  findings: [
    '<b>One pattern, eleven chords.</b> Each bar has 5 notes: the bass plus one more in the left hand; three in the right, repeated. The pattern is played twice per bar. It is a broken chord (arpeggio): the whole chord sounds, one note at a time.',
    '<b>The bass barely moves.</b> {C}, {C}, {B}, {C}, {C}, {C}, {B}, {B}, {A}: the bass moves by step around middle C. To do that Bach uses inversions: Dm7/C, G7/B, Am/C. The slash in the chord symbol shows the bass note.',
    '<b>ii–V–I right at the start.</b> Bars 2 to 4: Dm7/C → G7/B → C, that is, subdominant → dominant → tonic. In four bars the ear has heard the whole key: rest, preparation, tension and return.',
    '<b>The first outside note: {F#}.</b> In bar 6, D7/C brings {F#}, the leading tone of {G}. D7 is the dominant of {G}: the V⁷ of V (V⁷/V). For a moment {G} sounds like a tonic (tonicization), and bar 7 lands on G/B.',
    '<b>Every voice moves as little as possible.</b> From bar 6 to bar 7: {F#} rises a half step to {G} (the leading tone resolves up) and the bass {C}, the 7th of D7, falls to {B}. It is the V7 → I resolution, only aimed at {G}.',
    '<b>A chain of fifths.</b> Bars 9 to 11: Am7 → D7 → G. The roots {A} → {D} → {G} fall a 5th each time: the circle of fifths counter-clockwise. D7 comes back, now with {D} in the bass, and the excerpt stops on V ({G}): a pause on the dominant.',
  ],

  bassTitle: 'The bass line, bar by bar',
  bassAria: 'Chart of the lowest note of each bar: C, C, B, C, C, C, B, B, A, then D and G.',
  bassNote: 'The first nine bars stay one step from middle C. The leap only comes at the end, when the bass falls from {A} to {D} and rises to {G}: the roots of the chain of fifths.',
  lgBass: 'bass of each bar (color = chord function)',
  lgFifth: 'leap between roots (5th down = 4th up: the same arrival note)',
  fifthDown: '5th ↓',
  fourthUp: '4th ↑',

  logic: [
    '<b>Why a fixed pattern works</b>: when rhythm and pattern do not change, the ear stops paying attention to them and hears only what changes, the harmony. It is like a row of identical windows where only the light in each one changes.',
    '<b>Why an almost still bass holds the ear</b>: the lowest note is the base the ear uses to make sense of the chord. If the bass stays on {C} while the chords change above it, each new chord sounds like a detour that wants to come back. That pull and return is the tension and rest of the functions.',
    '<b>Why the {F#} does not change the key</b>: in these bars it appears twice, always on its way to {G}, and right after that the music goes on in C major. It is tonicization ({G} becomes a tonic for a moment), not a lasting change of key.',
    '<b>Why fifths lead home</b>: V → I is a 5th going down. Chaining several falling 5ths (A → D → G → C) makes each chord sound like the dominant of the next, a row of small resolutions pointing at the tonic.',
    '<b>The Well-Tempered Clavier</b>: in 1722 Bach collected a prelude and a fugue in each of the 24 major and minor keys (Book I). It showed that a keyboard tuned to serve every key could play in any of them (see the <a href="#/aula/origin">Origin</a> lesson).',
    '<b>The Ave Maria</b>: in 1853 Charles Gounod laid a melody over this prelude, keeping Bach’s notes underneath. Later, with the Ave Maria text, it became famous as the “Bach-Gounod Ave Maria”.',
  ],
  more: [4, 5],

  recap: {
    oneLine:
      'Bach fixes the pattern so the ear hears only what changes: one chord per bar, with the bass moving by step, and a borrowed dominant (D7) and a chain of fifths leading back to the dominant and the tonic.',
    confusions: [
      '<b>Dm7/C vs C</b>: the bass is the same ({C}), but the chord is different. Read the chord before the slash and the bass after it.',
      '<b>D7 vs Dm7</b>: both have {D}, {A} and {C}. The {F#} (major 3rd) makes D7 a dominant pulling to {G}; with {F}, Dm7 is the ii of C, without that pull.',
      '<b>Tonicization vs modulation</b>: a passing {F#} only points at {G}. Changing key would need a cadence in {G} and the {F#} to stay.',
    ],
    show:
      'Play bar 6 ({C} {D} {F#} {A} {D}) and then bar 7 ({B} {D} {G} {D} {G}) and point out the two voices that move a half step: {F#} rises to {G}, the bass {C} falls to {B}.',
  } satisfies RecapText,
};

export const text = { pt, en } satisfies LessonText<typeof pt>;
