import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

type S = string;
export type R2Id = 'dot' | 'tie' | 'rest' | 'sync' | 'pickup' | 'tri';

interface Concept {
  chip: S;
  title: S;
  steps: S[];
  rows: S[];
  q: S;
  opts: S[];
  answer: S;
  reveal: S;
}

const pt = {
  meta: {
    nav: 'Ler o ritmo',
    title: 'Ler o ritmo na partitura',
    sub: 'Ponto, ligadura, pausa, síncope, anacruse e tercina',
    teaser: 'Como a escrita soma, divide e desloca o tempo, e por que a síncope dá balanço.',
  },
  desc:
    'Na aula anterior cada figura valia a metade da outra. Na partitura de verdade aparecem sinais que somam, calam, deslocam e dividem esse tempo. Escolha um sinal: primeiro preveja, depois veja na grade, ouça e toque.',
  pick: 'Sinal',
  concepts: {
    dot: {
      chip: 'Ponto',
      title: 'O ponto: soma a metade',
      steps: [
        'Um ponto depois da nota soma <b>metade do valor dela</b>.',
        'Semínima (1 tempo) + metade (½ tempo) = semínima pontuada: <b>1 tempo e meio</b>. É o mesmo que uma semínima ligada a uma colcheia.',
        'Por isso a semínima pontuada costuma vir seguida de uma colcheia: as duas juntas fecham 2 tempos certinhos.',
      ],
      rows: ['ligadas', 'pontuadas'],
      q: 'Uma semínima vale 2 colcheias. Quantas colcheias vale uma semínima pontuada?',
      opts: ['2', '3', '4'],
      answer: '3',
      reveal: 'A semínima vale 2 colcheias; o ponto soma a metade disso, 1 colcheia: 2 + 1 = 3. Ouça as duas linhas abaixo: soam iguais, só a escrita muda.',
    },
    tie: {
      chip: 'Ligadura',
      title: 'A ligadura: soma notas iguais',
      steps: [
        'Uma curva ligando <b>duas notas da mesma altura</b> soma as durações: você toca a primeira e segura até o fim da segunda.',
        'Ela existe porque uma figura não pode atravessar a barra de compasso. Quando a nota passa da barra, a ligadura a continua no compasso seguinte.',
        'No exemplo, a nota do tempo 4 segue até o tempo 1 do compasso seguinte: 2 tempos, um só ataque.',
      ],
      rows: ['separadas', 'ligadas'],
      q: 'Com a ligadura do tempo 4 até o tempo 1 do compasso seguinte, quantas vezes você toca a tecla nesses dois tempos?',
      opts: ['1 vez', '2 vezes'],
      answer: '1 vez',
      reveal: 'A ligadura soma: você toca uma vez e segura pelos dois tempos. O tempo 1 do compasso novo chega sem ataque, e o ouvido sente a nota atravessando a barra.',
    },
    rest: {
      chip: 'Pausa',
      title: 'A pausa: silêncio que conta',
      steps: [
        'Cada figura tem uma pausa com o mesmo valor: pausa de semínima = 1 tempo de silêncio, pausa de colcheia = meio tempo.',
        'Na pausa o pulso continua: você solta a tecla e conta o tempo em silêncio.',
        'No exemplo, a pausa no tempo 2 faz o tempo 3 soar como resposta, e a pausa de colcheia no tempo 4 empurra a última nota para o “e”.',
      ],
      rows: ['notas', 'com pausas'],
      q: 'No tempo de uma pausa de semínima, o que você faz?',
      opts: ['Solto a tecla e conto 1 tempo', 'Seguro a nota anterior', 'Pulo para o tempo seguinte'],
      answer: 'Solto a tecla e conto 1 tempo',
      reveal: 'A pausa é uma duração de silêncio: o tempo existe e é contado, só não soa. Segurar a nota seria uma ligadura; pular o tempo quebraria o compasso.',
    },
    sync: {
      chip: 'Síncope',
      title: 'A síncope: o acento fora do tempo',
      steps: [
        'O ouvido espera as notas importantes em cima dos tempos (1, 2, 3, 4).',
        'Na síncope, uma nota começa <b>entre dois tempos</b> (no “e”) e <b>continua soando por cima do tempo seguinte</b>. O tempo chega sem nota nova.',
        'O acento muda de lugar: é uma tensão rítmica, como a sensível é uma tensão de altura. Por isso ela aparece em coral, a cor da tensão.',
      ],
      rows: ['no tempo', 'síncope'],
      q: 'Neste ritmo (♪ ♩ ♪ ♩ ♩), em qual tempo NÃO começa nenhuma nota?',
      opts: ['tempo 1', 'tempo 2', 'tempo 3', 'tempo 4'],
      answer: 'tempo 2',
      reveal: 'A semínima começa no “e” do 1 e atravessa o tempo 2. O pulso continua no 2, mas a mão não toca: o acento ficou antes, fora do tempo. É isso que dá o balanço.',
    },
    pickup: {
      chip: 'Anacruse',
      title: 'A anacruse: começar antes do 1',
      steps: [
        'Muitas melodias começam <b>antes do primeiro tempo forte</b>, com uma ou mais notas de preparação. Esse pedaço antes da primeira barra é a anacruse.',
        'Exemplo: “Parabéns a Você”, em 3/4. “Pa-ra-” vem antes da barra, e “-BÉNS” cai no tempo 1.',
        'Muitas partituras descontam a anacruse do último compasso, para o total fechar em compassos inteiros. Aqui o último compasso termina com 1 tempo de pausa.',
      ],
      rows: ['melodia'],
      q: 'Em “Parabéns a Você”, em qual sílaba cai o primeiro tempo forte?',
      opts: ['Pa', 'ra', 'béns'],
      answer: 'béns',
      reveal: 'Fale em voz alta: pa-ra-BÉNS. A sílaba acentuada cai no tempo 1; “pa-ra” vem antes, na anacruse. O acento das palavras e o tempo forte andam juntos.',
    },
    tri: {
      chip: 'Tercina',
      title: 'A tercina: 3 no tempo de 2',
      steps: [
        'Num compasso simples, um tempo de semínima se divide em <b>2</b> colcheias.',
        'O número 3 sobre um grupo de colcheias diz: <b>toque 3 no tempo de 2</b>. Cada uma dura um terço do tempo.',
        'É o jeito de dividir em 3 dentro de um compasso simples, emprestando por um instante o balanço do 6/8. Conte “um-e” nos tempos normais e “um-e-a” nos tempos da tercina.',
      ],
      rows: ['colcheias', 'tercinas'],
      q: 'Numa tercina de colcheias, quantas notas cabem em 1 tempo?',
      opts: ['2', '3', '4'],
      answer: '3',
      reveal: 'Três: a tercina põe 3 colcheias no tempo de 2. Na grade, os tempos 2 e 4 têm três blocos iguais em vez de dois.',
    },
  } as Record<R2Id, Concept>,
  play: (row: S) => `Ouvir: ${row}`,
  and: 'e',
  gridAria: (title: S) => `Grade rítmica: ${title}. Cada coluna é um tempo; os blocos são as notas.`,
  lgStrong: 'tempo 1',
  lgWeak: 'outros tempos',
  lgNote: 'nota',
  lgTension: 'acento, síncope ou o ponto (a parte somada)',
  lgRest: 'pausa (silêncio contado)',
  lgPickup: 'anacruse',
  kbdTitle: 'No teclado',
  kbdHint: 'O ritmo toca no acorde de Dó maior: o baixo soa no tempo 1 e as outras notas sobem pelo acorde. Na anacruse, ouça a melodia. Os cliques baixinhos marcam o pulso.',
  kbdAria: 'Teclado com o acorde de Dó maior e as notas da melodia.',
  lgRoot: 'tônica (Dó)',
  lgChord: 'notas do acorde e da melodia (número = grau)',
  tapTitle: 'Sua vez: toque o ritmo',
  tapHint: 'Aperte Começar. O metrônomo conta um compasso e, logo depois, você toca a última linha da grade no botão grande, sem parar o pulso. No fim, cada tempo mostra quantas notas você tocou nele.',
  start: 'Começar',
  pad: 'Toque aqui',
  padIdle: 'Aperte Começar',
  padCount: (n: number) => `Preparação: ${n}`,
  padGo: 'Agora!',
  rowGot: 'você',
  perBeat: (got: number, want: number) => `${got}/${want}`,
  result: (ok: number, total: number) =>
    ok === total ? `Perfeito: ${ok} de ${total} tempos certos.` : `${ok} de ${total} tempos certos. Ouça de novo e tente outra vez.`,
  whyTitle: 'A lógica por baixo',
  why: [
    '<b>Por que o ponto soma justamente a metade</b>: as figuras só dividem por 2, então uma duração de 3 metades (1 tempo e meio) não tem figura própria. Sem o ponto, ela teria de ser escrita como duas figuras ligadas; o ponto é a abreviação dessa soma.',
    '<b>Por que a ligadura existe</b>: cada compasso precisa somar exatamente o que a fórmula diz. Quando uma nota passa da barra, ela é dividida em duas figuras, uma de cada lado, e a ligadura mostra que é um só som.',
    '<b>Por que a síncope dá balanço</b>: o corpo sente o pulso nos tempos. Quando a nota começa antes do tempo e segura por cima dele, o acento cai onde o ouvido não esperava, e o tempo que ficou vazio é sentido pelo corpo, não pela mão. Esse desencontro entre pulso e acento é o balanço.',
    '<b>Por que a tercina leva um 3</b>: a escrita é feita de metades. Para dividir um tempo em 3 num compasso simples, usa-se a figura mais próxima (a colcheia) e o número 3 avisa: três destas no lugar de duas.',
    '<b>Na música brasileira</b>: a figura semicolcheia–colcheia–semicolcheia em 2/4 é tão comum no maxixe, no choro e no samba que ganhou o nome de “síncope característica”.',
    '<b>De onde vem “anacruse”</b>: do grego. Na poesia, a palavra designa as sílabas fracas que vêm antes do primeiro acento do verso, a mesma ideia de “Pa-ra-” antes de “-BÉNS”.',
    '<b>Como se desenham as pausas</b>: a de semibreve fica pendurada embaixo de uma linha da pauta, e a de mínima fica apoiada em cima dela. A pausa de semibreve também é usada para um compasso inteiro de silêncio, em qualquer fórmula.',
  ],
  recap: {
    oneLine: 'O ponto soma metade do valor da nota (semínima pontuada = semínima + colcheia), e a síncope dá balanço porque a nota começa entre os tempos e segura por cima do tempo seguinte: o acento cai onde o ouvido não espera.',
    confusions: [
      '<b>Ligadura de valor × ligadura de expressão</b>: a de valor une duas notas de mesma altura, e você toca uma vez só. A curva sobre notas diferentes é a ligadura de expressão (legato): cada nota é tocada, sem separar.',
      '<b>Ponto de aumento × staccato</b>: o ponto ao lado da cabeça da nota soma metade do valor; o ponto em cima ou embaixo da cabeça é staccato, nota curta e destacada.',
      '<b>Síncope × contratempo</b>: no contratempo a nota cai fora do tempo, mas para antes do tempo seguinte; na síncope ela continua soando por cima do tempo seguinte.',
    ],
    show: 'Toque Dó em semínimas contando 1-2-3-4 em voz alta. Depois toque no 1, de novo no “e” do 1, e segure até o 3, sem parar de contar: a mão toca entre os tempos e a voz continua no tempo. Esse desencontro é a síncope.',
  } as RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Reading rhythm',
    title: 'Reading rhythm on paper',
    sub: 'Dot, tie, rest, syncopation, pickup and triplet',
    teaser: 'How notation adds, splits and shifts time, and why syncopation grooves.',
  },
  desc:
    'In the previous lesson each note value was half of the one before. Real sheet music adds signs that add to, silence, shift and split that time. Pick a sign: predict first, then see it on the grid, hear it and tap it.',
  pick: 'Sign',
  concepts: {
    dot: {
      chip: 'Dot',
      title: 'The dot: adds half',
      steps: [
        'A dot after a note adds <b>half of its value</b>.',
        'Quarter note (1 beat) + half of it (½ beat) = dotted quarter: <b>1½ beats</b>. The same as a quarter tied to an eighth.',
        'That is why a dotted quarter is usually followed by an eighth: together they make exactly 2 beats.',
      ],
      rows: ['tied', 'dotted'],
      q: 'A quarter note is worth 2 eighths. How many eighths is a dotted quarter worth?',
      opts: ['2', '3', '4'],
      answer: '3',
      reveal: 'A quarter is 2 eighths; the dot adds half of that, 1 eighth: 2 + 1 = 3. Hear both rows below: they sound the same, only the writing changes.',
    },
    tie: {
      chip: 'Tie',
      title: 'The tie: adds equal notes',
      steps: [
        'A curve joining <b>two notes of the same pitch</b> adds their lengths: you play the first and hold through the end of the second.',
        'It exists because a note value cannot cross a bar line. When a note goes past the bar line, the tie carries it into the next bar.',
        'In the example, the note on beat 4 lasts through beat 1 of the next bar: 2 beats, a single attack.',
      ],
      rows: ['separate', 'tied'],
      q: 'With the tie from beat 4 to beat 1 of the next bar, how many times do you strike the key in those two beats?',
      opts: ['Once', 'Twice'],
      answer: 'Once',
      reveal: 'A tie adds: you strike once and hold for both beats. Beat 1 of the new bar arrives with no attack, and the ear feels the note crossing the bar line.',
    },
    rest: {
      chip: 'Rest',
      title: 'The rest: silence that counts',
      steps: [
        'Every note value has a rest of the same length: quarter rest = 1 beat of silence, eighth rest = half a beat.',
        'During a rest the pulse goes on: you lift the key and count the beat in silence.',
        'In the example, the rest on beat 2 makes beat 3 sound like an answer, and the eighth rest on beat 4 pushes the last note onto the “and”.',
      ],
      rows: ['notes', 'with rests'],
      q: 'During a quarter rest, what do you do?',
      opts: ['Lift the key and count 1 beat', 'Hold the previous note', 'Skip to the next beat'],
      answer: 'Lift the key and count 1 beat',
      reveal: 'A rest is a length of silence: the beat exists and is counted, it just does not sound. Holding the note would be a tie; skipping the beat would break the bar.',
    },
    sync: {
      chip: 'Syncopation',
      title: 'Syncopation: the accent off the beat',
      steps: [
        'The ear expects the important notes on the beats (1, 2, 3, 4).',
        'In syncopation a note starts <b>between two beats</b> (on the “and”) and <b>keeps sounding over the next beat</b>. The beat arrives with no new note.',
        'The accent moves: it is rhythmic tension, as the leading tone is pitch tension. That is why it is coral here, the color of tension.',
      ],
      rows: ['on beat', 'syncopated'],
      q: 'In this rhythm (♪ ♩ ♪ ♩ ♩), on which beat does NO note start?',
      opts: ['beat 1', 'beat 2', 'beat 3', 'beat 4'],
      answer: 'beat 2',
      reveal: 'The quarter note starts on the “and” of 1 and runs across beat 2. The pulse goes on at 2, but the hand does not play: the accent came early, off the beat. That is what makes it groove.',
    },
    pickup: {
      chip: 'Pickup',
      title: 'The pickup (anacrusis): starting before 1',
      steps: [
        'Many tunes start <b>before the first strong beat</b>, with one or more lead-in notes. That piece before the first bar line is the pickup, or anacrusis.',
        'Example: “Happy Birthday”, in 3/4. “Hap-py” comes before the bar line, and “BIRTH-” lands on beat 1.',
        'Many scores take the pickup out of the last bar, so the total comes out in whole bars. Here the last bar ends with 1 beat of rest.',
      ],
      rows: ['melody'],
      q: 'In “Happy Birthday”, on which syllable does the first strong beat fall?',
      opts: ['Hap', 'py', 'birth'],
      answer: 'birth',
      reveal: 'Say it out loud: hap-py BIRTH-day. The stressed syllable lands on beat 1; “hap-py” comes before it, in the pickup. Word stress and the strong beat go together.',
    },
    tri: {
      chip: 'Triplet',
      title: 'The triplet: 3 in the time of 2',
      steps: [
        'In a simple meter, a quarter-note beat splits into <b>2</b> eighths.',
        'The number 3 over a group of eighths says: <b>play 3 in the time of 2</b>. Each one lasts a third of the beat.',
        'It is the way to split in 3 inside a simple meter, borrowing the swing of 6/8 for a moment. Count “one-and” on the normal beats and “one-and-a” on the triplet beats.',
      ],
      rows: ['eighths', 'triplets'],
      q: 'In a triplet of eighth notes, how many notes fit in 1 beat?',
      opts: ['2', '3', '4'],
      answer: '3',
      reveal: 'Three: the triplet puts 3 eighths in the time of 2. On the grid, beats 2 and 4 have three equal blocks instead of two.',
    },
  },
  play: (row: S) => `Hear: ${row}`,
  and: '&',
  gridAria: (title: S) => `Rhythm grid: ${title}. Each column is a beat; the blocks are the notes.`,
  lgStrong: 'beat 1',
  lgWeak: 'other beats',
  lgNote: 'note',
  lgTension: 'accent, syncopation or the dot (the added part)',
  lgRest: 'rest (counted silence)',
  lgPickup: 'pickup',
  kbdTitle: 'On the keyboard',
  kbdHint: 'The rhythm plays on the C major chord: the bass sounds on beat 1 and the other notes climb the chord. In the pickup, hear the melody. The soft clicks mark the pulse.',
  kbdAria: 'Keyboard with the C major chord and the melody notes.',
  lgRoot: 'tonic (C)',
  lgChord: 'chord and melody notes (number = degree)',
  tapTitle: 'Your turn: tap the rhythm',
  tapHint: 'Press Start. The metronome counts one bar and, right after, you tap the last row of the grid on the big button, without stopping the pulse. At the end, each beat shows how many notes you tapped in it.',
  start: 'Start',
  pad: 'Tap here',
  padIdle: 'Press Start',
  padCount: (n: number) => `Get ready: ${n}`,
  padGo: 'Now!',
  rowGot: 'you',
  perBeat: (got: number, want: number) => `${got}/${want}`,
  result: (ok: number, total: number) =>
    ok === total ? `Perfect: ${ok} of ${total} beats right.` : `${ok} of ${total} beats right. Listen again and try once more.`,
  whyTitle: 'The logic underneath',
  why: [
    '<b>Why the dot adds exactly half</b>: note values only divide by 2, so a length of 3 halves (1½ beats) has no symbol of its own. Without the dot it would have to be written as two tied values; the dot is shorthand for that sum.',
    '<b>Why the tie exists</b>: every bar must add up to exactly what the time signature says. When a note crosses the bar line it is split into two values, one on each side, and the tie shows it is a single sound.',
    '<b>Why syncopation grooves</b>: the body feels the pulse on the beats. When a note starts before the beat and holds over it, the accent lands where the ear did not expect it, and the empty beat is felt by the body, not played by the hand. That mismatch between pulse and accent is the groove.',
    '<b>Why the triplet carries a 3</b>: notation is built from halves. To split a beat in 3 in a simple meter, you use the nearest value (the eighth) and the number 3 says: three of these in place of two.',
    '<b>In Brazilian music</b>: the figure sixteenth–eighth–sixteenth in 2/4 is so common in maxixe, choro and samba that Brazilian musicians call it the “characteristic syncopation”.',
    '<b>Where “anacrusis” comes from</b>: Greek. In poetry it names the weak syllables before the first stress of a line, the same idea as “Hap-py” before “BIRTH-”.',
    '<b>How rests are drawn</b>: the whole rest hangs below a staff line and the half rest sits on top of one. The whole rest is also used for a full bar of silence, in any time signature.',
  ],
  recap: {
    oneLine: 'The dot adds half the note’s value (dotted quarter = quarter + eighth), and syncopation grooves because the note starts between the beats and holds over the next one: the accent lands where the ear does not expect it.',
    confusions: [
      '<b>Tie vs slur</b>: a tie joins two notes of the same pitch, and you play once. A curve over different notes is a slur (legato): every note is played, smoothly connected.',
      '<b>Augmentation dot vs staccato</b>: a dot beside the notehead adds half the value; a dot above or below the notehead is staccato, a short detached note.',
      '<b>Syncopation vs off-beat note</b>: an off-beat note starts between beats but stops before the next beat; a syncopated one keeps sounding over the next beat.',
    ],
    show: 'Play C in quarter notes counting 1-2-3-4 out loud. Then play on 1, again on the “and” of 1, and hold until 3, without stopping the count: the hand plays between the beats while the voice stays on the beat. That mismatch is syncopation.',
  },
};

export const text = {
  pt,
  en,
  glossary: [
    ['Dotted note', 'augmentation dot', 'Nota pontuada', 'Nota com um ponto ao lado: o ponto soma metade do valor dela. Semínima pontuada = semínima + colcheia.', 'A note with a dot beside it: the dot adds half its value. Dotted quarter = quarter + eighth.'],
    ['Tie', 'tied notes', 'Ligadura (de valor)', 'Curva que une duas notas da mesma altura: toca-se a primeira e segura-se pela duração das duas. Permite que uma nota atravesse a barra de compasso.', 'A curve joining two notes of the same pitch: you play the first and hold for both lengths. It lets a note cross the bar line.'],
    ['Rest', 'silence', 'Pausa', 'Sinal de silêncio com duração própria. Cada figura tem a sua pausa, com o mesmo valor; o pulso continua sendo contado.', 'A sign for silence with its own length. Each note value has its rest, of the same length; the pulse keeps being counted.'],
    ['Syncopation', 'syncopated', 'Síncope', 'Nota que começa entre dois tempos e continua soando por cima do tempo seguinte, deslocando o acento para fora do tempo.', 'A note that starts between two beats and keeps sounding over the next beat, moving the accent off the beat.'],
    ['Anacrusis', 'pickup', 'Anacruse', 'Nota ou notas que vêm antes do primeiro tempo forte de uma música ou frase, antes da primeira barra de compasso.', 'The note or notes that come before the first strong beat of a piece or phrase, before the first bar line.'],
    ['Triplet', 'tuplet', 'Tercina (quiáltera)', 'Grupo de três notas tocadas no tempo de duas do mesmo valor, marcado com um 3. Quiáltera é o nome geral desses grupos.', 'A group of three notes played in the time of two of the same value, marked with a 3. Tuplet is the general name for such groups.'],
  ],
} satisfies LessonText<typeof pt>;
