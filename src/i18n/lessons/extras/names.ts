import type { RecapText } from './types';

type S = string;

const pt = {
  desc: 'Cada grau da escala tem um nome: tônica, supertônica, mediante, subdominante, dominante, submediante e sensível. Eles não são aleatórios. Medem a distância até a tônica, para cima e para baixo, como um espelho com a tônica no meio.',
  pSub: (t: S, d: S) => `A dominante, <b>${d}</b>, fica uma 5ª acima de <b>${t}</b>. “Sub” quer dizer “de baixo”. Toque a subdominante: o espelho da dominante.`,
  pSubRev: (s: S, t: S) => `${s}: uma 5ª <b>abaixo</b> de ${t}, à mesma distância que a dominante fica acima. Por isso “subdominante” é “a dominante de baixo”. Na escala ela aparece como 4º grau, logo abaixo da dominante, mas o nome não vem daí: vem do espelho.`,
  pMed: (t: S) => `A mediante é o 3º grau, uma 3ª acima de ${t}. Seguindo o espelho, qual grau é a submediante?`,
  pMedOpts: ['o 2º grau', 'o 4º grau', 'o 6º grau'],
  pMedAns: 'o 6º grau',
  pMedRev: (n: S, t: S) => `O 6º grau, ${n}: uma 3ª abaixo de ${t}. A mediante está no meio do caminho entre a tônica e a dominante (acima); a submediante, no meio do caminho entre a tônica e a subdominante (abaixo).`,
  notes: [
    '<b>1. Subdominante = dominante de baixo</b>: o nome é de Rameau (sous-dominante), nos anos 1720. A dominante fica uma 5ª acima da tônica; a subdominante, uma 5ª abaixo. Não quer dizer “logo abaixo da dominante”, embora na escala ela fique ali. No círculo das quintas, as duas são as vizinhas da tônica, uma de cada lado.',
    '<b>2. Dominante</b>: depois da tônica, é a nota mais forte da tonalidade: está a uma 5ª, o intervalo mais estável depois da oitava (a aula sobre a série harmônica mostra por quê). Rameau fixou o nome para o 5º grau.',
    '<b>3. Mediante e submediante</b>: a mediante (3º grau) fica no meio do caminho entre a tônica e a dominante. A submediante (6º grau) fica no meio do caminho entre a tônica e a subdominante de baixo. Uma é o espelho da outra.',
    '<b>4. Supertônica e sensível</b>: as duas vizinhas da tônica. A supertônica (2º grau) fica um tom acima. A sensível (7º grau) fica só um semitom abaixo e por isso “sente” a atração da tônica: do francês note sensible. Em inglês, leading tone, a nota que conduz.',
    '<b>De onde vem “dominante”</b>: no canto gregoriano, cada modo tinha uma nota de recitação, a mais repetida (chamada tenor, e mais tarde também dominante), que muitas vezes ficava uma 5ª acima da nota final.',
    '<b>Tônica</b>: do grego tónos, “tensão” ou “tom”. É a nota que dá o tom à música e onde a tensão se desfaz.',
    '<b>2ª, 3ª, 4ª, 5ª…</b>: os nomes dos intervalos vêm dos ordinais latinos secunda, tertia, quarta, quinta, e contam as duas pontas, como na aula de intervalos.',
  ],
  more: [4, 5, 6],
  transfer: (k: S) => `Em ${k}: quem é a dominante (5ª acima) e quem é a subdominante (5ª abaixo)? Confira que são as duas vizinhas de ${k} no círculo.`,
  recap: {
    oneLine: 'O 4º grau se chama subdominante porque é a “dominante de baixo”: fica uma 5ª abaixo da tônica, espelhando a dominante, que fica uma 5ª acima; os outros nomes seguem o mesmo espelho (mediante e submediante, 3ª acima e abaixo; supertônica e sensível, as vizinhas).',
    confusions: [
      '<b>Subdominante × “abaixo da dominante”</b>: ela fica abaixo da dominante na escala, mas o nome vem do espelho em volta da tônica: uma 5ª abaixo dela.',
      '<b>Mediante × submediante</b>: 3ª acima da tônica (3º grau) × 3ª abaixo (6º grau).',
      '<b>Sensível × supertônica</b>: as duas são vizinhas da tônica, mas a sensível está a um semitom (e puxa para a tônica); a supertônica, a um tom.',
    ],
    show: 'Ponha um dedo na tônica. Mostre a dominante uma 5ª acima e a subdominante uma 5ª abaixo, à mesma distância. Depois a mediante e a submediante (3ª acima e abaixo), e por fim a supertônica e a sensível, coladas na tônica.',
  } as RecapText,
};

const en: typeof pt = {
  desc: 'Each scale degree has a name: tonic, supertonic, mediant, subdominant, dominant, submediant and leading tone. They are not random. They measure the distance to the tonic, up and down, like a mirror with the tonic in the middle.',
  pSub: (t: S, d: S) => `The dominant, <b>${d}</b>, is a 5th above <b>${t}</b>. “Sub” means “below”. Tap the subdominant: the dominant’s mirror image.`,
  pSubRev: (s: S, t: S) => `${s}: a 5th <b>below</b> ${t}, as far down as the dominant is up. That is why “subdominant” means “the lower dominant”. In the scale it shows up as degree 4, just below the dominant, but the name does not come from that: it comes from the mirror.`,
  pMed: (t: S) => `The mediant is degree 3, a 3rd above ${t}. Following the mirror, which degree is the submediant?`,
  pMedOpts: ['degree 2', 'degree 4', 'degree 6'],
  pMedAns: 'degree 6',
  pMedRev: (n: S, t: S) => `Degree 6, ${n}: a 3rd below ${t}. The mediant is halfway between the tonic and the dominant (above); the submediant, halfway between the tonic and the subdominant (below).`,
  notes: [
    '<b>1. Subdominant = the lower dominant</b>: the name is Rameau’s (sous-dominante), in the 1720s. The dominant is a 5th above the tonic; the subdominant, a 5th below. It does not mean “just below the dominant”, even though it sits there in the scale. On the circle of fifths, both are the tonic’s neighbors, one on each side.',
    '<b>2. Dominant</b>: after the tonic it is the strongest note of the key: it lies a 5th away, the most stable interval after the octave (the harmonic series lesson shows why). Rameau fixed the name for degree 5.',
    '<b>3. Mediant and submediant</b>: the mediant (degree 3) is halfway between the tonic and the dominant. The submediant (degree 6) is halfway between the tonic and the lower dominant. Each is the other’s mirror.',
    '<b>4. Supertonic and leading tone</b>: the tonic’s two neighbors. The supertonic (degree 2) is a whole step above. The leading tone (degree 7) is only a half step below, so it “feels” the pull of the tonic: in French note sensible. In English, leading tone, the note that leads.',
    '<b>Where “dominant” comes from</b>: in Gregorian chant each mode had a reciting note, the most repeated one (called tenor, and later also dominant), often a 5th above the final note.',
    '<b>Tonic</b>: from the Greek tónos, “tension” or “tone”. It is the note that sets the key and where tension dissolves.',
    '<b>2nd, 3rd, 4th, 5th…</b>: interval names come from the Latin ordinals secunda, tertia, quarta, quinta, and count both ends, as in the intervals lesson.',
  ],
  more: [4, 5, 6],
  transfer: (k: S) => `In ${k}: which note is the dominant (a 5th up) and which is the subdominant (a 5th down)? Check that they are ${k}’s two neighbors on the circle.`,
  recap: {
    oneLine: 'Degree 4 is called the subdominant because it is the “lower dominant”: a 5th below the tonic, mirroring the dominant a 5th above; the other names follow the same mirror (mediant and submediant, a 3rd up and down; supertonic and leading tone, the neighbors).',
    confusions: [
      '<b>Subdominant vs “below the dominant”</b>: it does sit below the dominant in the scale, but the name comes from the mirror around the tonic: a 5th below it.',
      '<b>Mediant vs submediant</b>: a 3rd above the tonic (degree 3) vs a 3rd below (degree 6).',
      '<b>Leading tone vs supertonic</b>: both are the tonic’s neighbors, but the leading tone is a half step away (and pulls to the tonic); the supertonic, a whole step.',
    ],
    show: 'Put a finger on the tonic. Show the dominant a 5th above and the subdominant a 5th below, the same distance. Then the mediant and submediant (a 3rd up and down), and finally the supertonic and leading tone, right next to the tonic.',
  } as RecapText,
};

export const extras = { pt, en };
