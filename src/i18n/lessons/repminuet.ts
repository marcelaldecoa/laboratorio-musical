import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

/* Note names in braces ({F#}) are replaced by the chosen notation; chord symbols always use letters. */
const pt = {
  meta: {
    nav: 'Minueto em Sol',
    title: 'Minueto em Sol maior',
    sub: 'BWV Anh. 114, compassos 1 a 16: pergunta e resposta',
    teaser: 'Notas do acorde, passagens, I–IV–V e duas cadências: a teoria toda num minueto de iniciante.',
  },
  name: 'Minueto em Sol maior, BWV Anh. 114 (Christian Petzold)',
  desc:
    'Este minueto está no <i>Caderno de Anna Magdalena Bach</i> (1725) e é uma das primeiras peças que muitos pianistas aprendem. É uma dança em 3 tempos: o tempo 1 é o forte. Aqui estão os 16 primeiros compassos, a parte A inteira. A melodia (mão direita) é a do original; a mão esquerda foi <b>simplificada</b> para uma nota grave por harmonia.',
  source: 'Mão direita como no original. Mão esquerda simplificada; os acordes são a nossa leitura da harmonia.',

  p1: {
    prompt:
      'Compasso 1: a melodia é {D} {G} {A} {B} {C}, sobre o acorde de {G} ({G}–{B}–{D}, já marcado). Toque uma nota da melodia que <b>não</b> está no acorde.',
    reveal:
      '{A} ou {C}. Cada uma fica entre duas notas do acorde e liga uma à outra por grau conjunto: {G} → {A} → {B} e {B} → {C} → {D}. São notas de passagem. No tempo forte, a nota do acorde; no meio do caminho, a passagem.',
  },
  p2: {
    prompt: 'O compasso 8 termina em {A}, sobre o acorde de {D} (o V). Essa frase soa terminada ou pede continuação?',
    options: ['Terminada: cadência perfeita', 'Pede continuação: cadência suspensiva'],
    answer: 'Pede continuação: cadência suspensiva',
    reveal:
      'Ela para no V, a dominante, que contém a sensível {F#} e pede para voltar ao I. Por isso soa como uma vírgula: é a cadência suspensiva (ou meia cadência). No compasso 16 a mesma música termina em V → I: agora é ponto final, a cadência perfeita (ou autêntica).',
  },

  cadTitle: 'Compare os dois finais',
  cad1: 'Fim da 1ª frase (comp. 7–8)',
  cad2: 'Fim da 2ª frase (comp. 15–16)',
  cadNote: 'O começo das duas frases é idêntico. Só o fim muda: a primeira para no V (suspensiva), a segunda vai do V ao I (perfeita).',

  findings: [
    '<b>Nota do acorde no tempo forte, passagem entre elas.</b> No compasso 1, {D}, {G} e {B} são notas do acorde de {G}; {A} e {C} ligam essas notas por grau conjunto. Quase todo compasso segue essa regra: no tempo 1, uma nota do acorde.',
    '<b>Poucos acordes bastam.</b> Na nossa leitura, a parte A usa o I ({G}), o IV ({C}), o V ({D}) e o ii (Am): as três funções, tônica, subdominante e dominante, do campo harmônico de Sol maior.',
    '<b>A mão esquerda conduz.</b> Uma nota longa por compasso, quase sempre por grau conjunto: {B}, {C}, {B}, {A}, {G}. Ela diz ao ouvido qual é o acorde enquanto a direita corre. (No original há algumas notas a mais; aqui ficou só o essencial.)',
    '<b>Dois finais diferentes.</b> O compasso 8 para no V: cadência suspensiva, uma pergunta. O compasso 16 vai do V ao I: cadência perfeita, a resposta.',
    '<b>A mesma frase, outra pontuação.</b> Os compassos 9 a 14 repetem os compassos 1 a 6 nota por nota. Duas frases que começam iguais e terminam diferente, uma no V e outra no I, formam um período.',
    '<b>Forma binária.</b> Estes 16 compassos são a parte A, tocada duas vezes. Depois vem a parte B, que passa por Ré maior (aparece {C#}) e volta para Sol, também repetida: ||: A :||: B :||. É a forma típica das danças da época.',
  ],

  logic: [
    '<b>Por que a passagem vai no tempo fraco</b>: o ouvido confere a harmonia no tempo forte. Se ali está uma nota do acorde, as notas do meio soam como caminho, não como erro. Troque a ordem e a mesma nota soa como tensão.',
    '<b>Por que parar no V soa como pergunta</b>: o acorde de {D} tem o {F#}, a sensível de Sol, meio tom abaixo da tônica. Enquanto ele não resolve em {G}, o ouvido fica esperando.',
    '<b>Por que repetir o começo</b>: quem ouve reconhece a frase e passa a prestar atenção só no que muda, o final. É assim que o período deixa claro que a segunda frase responde à primeira.',
    '<b>Por que 3 tempos</b>: o minueto era uma dança de salão em compasso ternário; o passo forte cai no tempo 1. Por isso a harmonia e a nota do acorde ficam ali.',
    '<b>Quem compôs</b>: por mais de dois séculos este minueto foi atribuído a J. S. Bach, porque está no caderno da família. Nos anos 1970 os pesquisadores concluíram que ele é de Christian Petzold, organista de Dresden; por isso o número “Anh.” (anexo) no catálogo de Bach.',
    '<b>Na música popular</b>: a canção “A Lover’s Concerto” (1965), do grupo The Toys, usa esta melodia em compasso de 4 tempos.',
  ],
  more: [4, 5],

  recap: {
    oneLine:
      'Por baixo do minueto está a teoria básica inteira: nota do acorde no tempo forte e passagens por grau conjunto, poucos acordes (I, IV, V) e duas frases iguais que terminam uma no V (pergunta) e outra no I (resposta).',
    confusions: [
      '<b>Cadência suspensiva × perfeita</b>: a suspensiva <i>termina</i> no V; a perfeita <i>vai</i> do V para o I. Olhe o último acorde da frase.',
      '<b>Nota de passagem × nota errada</b>: a passagem chega e sai por grau conjunto, na mesma direção, e fica no tempo fraco, entre duas notas do acorde.',
      '<b>Período × repetição</b>: numa repetição o fim é igual; num período o começo é igual e o fim muda (V, depois I).',
    ],
    show:
      'Toque o compasso 1 com {G} na mão esquerda e mostre que só {A} e {C} ficam fora do acorde. Depois toque o fim do compasso 8 e o fim do 16: só o segundo “fecha”.',
  } satisfies RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Minuet in G',
    title: 'Minuet in G major',
    sub: 'BWV Anh. 114, bars 1 to 16: question and answer',
    teaser: 'Chord tones, passing tones, I–IV–V and two cadences: all the theory in a beginner’s minuet.',
  },
  name: 'Minuet in G major, BWV Anh. 114 (Christian Petzold)',
  desc:
    'This minuet is in the <i>Notebook for Anna Magdalena Bach</i> (1725) and is one of the first pieces many pianists learn. It is a dance in 3 beats: beat 1 is the strong one. Here are the first 16 bars, the whole A section. The melody (right hand) is the original; the left hand is <b>simplified</b> to one low note per harmony.',
  source: 'Right hand as in the original. Left hand simplified; the chords are our reading of the harmony.',

  p1: {
    prompt:
      'Bar 1: the melody is {D} {G} {A} {B} {C}, over the {G} chord ({G}–{B}–{D}, already marked). Tap a melody note that is <b>not</b> in the chord.',
    reveal:
      '{A} or {C}. Each sits between two chord tones and links them by step: {G} → {A} → {B} and {B} → {C} → {D}. They are passing tones. On the strong beat, the chord tone; on the way, the passing tone.',
  },
  p2: {
    prompt: 'Bar 8 ends on {A}, over the {D} chord (the V). Does this phrase sound finished, or does it ask for more?',
    options: ['Finished: authentic cadence', 'Asks for more: half cadence'],
    answer: 'Asks for more: half cadence',
    reveal:
      'It stops on V, the dominant, which holds the leading tone {F#} and wants to go back to I. So it sounds like a comma: a half cadence. In bar 16 the same music ends V → I: now it is a full stop, the authentic (perfect) cadence.',
  },

  cadTitle: 'Compare the two endings',
  cad1: 'End of phrase 1 (bars 7–8)',
  cad2: 'End of phrase 2 (bars 15–16)',
  cadNote: 'Both phrases start identically. Only the ending changes: the first stops on V (half cadence), the second goes from V to I (authentic).',

  findings: [
    '<b>Chord tone on the strong beat, passing tones in between.</b> In bar 1, {D}, {G} and {B} belong to the {G} chord; {A} and {C} link them by step. Almost every bar follows this rule: on beat 1, a chord tone.',
    '<b>A few chords are enough.</b> In our reading, the A section uses I ({G}), IV ({C}), V ({D}) and ii (Am): the three functions, tonic, subdominant and dominant, from the diatonic chords of G major.',
    '<b>The left hand leads.</b> One long note per bar, mostly by step: {B}, {C}, {B}, {A}, {G}. It tells the ear which chord is sounding while the right hand runs. (The original has a few more notes; here only the essentials remain.)',
    '<b>Two different endings.</b> Bar 8 stops on V: a half cadence, a question. Bar 16 goes from V to I: an authentic cadence, the answer.',
    '<b>Same phrase, different punctuation.</b> Bars 9 to 14 repeat bars 1 to 6 note for note. Two phrases that start the same and end differently, one on V and one on I, make a period.',
    '<b>Binary form.</b> These 16 bars are the A section, played twice. Then comes the B section, which passes through D major (a {C#} appears) and returns to G, also repeated: ||: A :||: B :||. It is the typical form of the dances of that time.',
  ],

  logic: [
    '<b>Why the passing tone goes on the weak beat</b>: the ear checks the harmony on the strong beat. If a chord tone is there, the notes in between sound like a path, not a mistake. Swap them and the same note sounds like tension.',
    '<b>Why stopping on V sounds like a question</b>: the {D} chord holds {F#}, the leading tone of G, a half step below the tonic. Until it resolves to {G}, the ear keeps waiting.',
    '<b>Why repeat the beginning</b>: the listener recognizes the phrase and pays attention only to what changes, the ending. That is how the period makes clear that the second phrase answers the first.',
    '<b>Why 3 beats</b>: the minuet was a ballroom dance in triple meter; the strong step falls on beat 1. That is why the harmony and the chord tone sit there.',
    '<b>Who wrote it</b>: for more than two centuries this minuet was credited to J. S. Bach, because it is in the family notebook. In the 1970s scholars concluded it is by Christian Petzold, an organist in Dresden; hence the “Anh.” (appendix) number in Bach’s catalogue.',
    '<b>In pop music</b>: the song “A Lover’s Concerto” (1965), by The Toys, uses this melody in 4 beats.',
  ],
  more: [4, 5],

  recap: {
    oneLine:
      'Under the minuet lies all the basic theory: chord tones on the strong beat with passing tones by step, a few chords (I, IV, V), and two equal phrases, one ending on V (question) and one on I (answer).',
    confusions: [
      '<b>Half vs authentic cadence</b>: the half cadence <i>ends</i> on V; the authentic one <i>goes</i> from V to I. Look at the last chord of the phrase.',
      '<b>Passing tone vs wrong note</b>: a passing tone arrives and leaves by step, in the same direction, on a weak beat between two chord tones.',
      '<b>Period vs repetition</b>: in a repetition the ending is the same; in a period the beginning is the same and the ending changes (V, then I).',
    ],
    show:
      'Play bar 1 with {G} in the left hand and show that only {A} and {C} are outside the chord. Then play the end of bar 8 and the end of bar 16: only the second one “closes”.',
  } satisfies RecapText,
};

export const text = {
  pt,
  en,
  glossary: [
    ['Minuet', 'menuet', 'Minueto', 'Dança de salão em compasso de 3 tempos, de passo moderado, muito comum nos séculos XVII e XVIII. Suas frases costumam ter 4 ou 8 compassos.', 'A ballroom dance in 3 beats at a moderate pace, very common in the 17th and 18th centuries. Its phrases usually last 4 or 8 bars.'],
    ['Binary form', 'AB form', 'Forma binária', 'Peça em duas partes, A e B, cada uma normalmente repetida (||: A :||: B :||). Muitas vezes uma das partes visita a tonalidade da dominante, e a peça termina de volta na tônica.', 'A piece in two parts, A and B, each usually repeated (||: A :||: B :||). Often one of the parts visits the key of the dominant, and the piece ends back on the tonic.'],
  ],
} satisfies LessonText<typeof pt>;
