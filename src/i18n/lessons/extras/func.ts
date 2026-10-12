import type { RecapText } from './types';

type S = string;

const pt = {
  playVI: 'Ouvir dominante → tônica',
  pSub: (t: S) => `<b>${t}</b> é a tônica. Qual nota fica uma quinta justa <b>abaixo</b> dela? Conte 7 semitons para baixo e toque.`,
  pSubRev: (n: S) => `${n}, o 4º grau: a subdominante, “a dominante de baixo”. A mesma nota aparece também uma quarta acima da tônica (7 para baixo ou 5 para cima dão a mesma letra).`,
  pSide: (k: S) => `A dominante fica uma quinta acima da tônica. Em que sentido do círculo ela é a vizinha de ${k}?`,
  sides: ['horário', 'anti-horário'],
  pSideRev: 'Horário: cada passo horário sobe uma quinta. A subdominante, uma quinta abaixo, é a vizinha do sentido anti-horário. A tônica fica entre as duas.',
  dom: (n: S, k: S) => `<b>Dominante · ${n}</b>: uma quinta acima da tônica. Na série harmônica, a quinta é o primeiro intervalo novo depois da oitava (3:2), por isso é tida como a relação mais forte depois da oitava. No círculo, é a vizinha do sentido horário: ${k}.`,
  why: (d: S, lt: S, x: S, t: S, f: S) => `<b>Por que a dominante pede a tônica</b>: o acorde montado sobre ${d} (${d}, ${lt}, ${x}) contém a sensível, ${lt}, meio tom abaixo de ${t}: o ouvido quer que ela suba. E o baixo ${d} → ${t} desce uma quinta, voltando um passo no círculo, para casa. Se o acorde ganhar ${f}, o 4º grau, ele passa a ter o trítono inteiro, e a tensão aumenta.`,
  transfer: (k: S) => `Em ${k}: quais são a subdominante, a dominante e a sensível? Toque o acorde da dominante e resolva na tônica.`,
  recap: {
    oneLine: 'Porque o acorde da dominante, uma quinta acima da tônica, contém a sensível, meio tom abaixo da tônica, e o baixo cai uma quinta de volta para casa: a sensível sobe meio tom e a fundamental desce uma quinta, as duas chegando na tônica.',
    confusions: [
      '<b>Subdominante não é “abaixo da dominante”</b>: o nome quer dizer “dominante de baixo”, uma quinta abaixo da tônica. Ela também fica um tom abaixo da dominante, mas o nome não vem daí.',
      '<b>Quinta abaixo × quarta acima</b>: a subdominante pode ser tocada nos dois lugares; é a mesma nota, em outra oitava.',
      '<b>Sensível × subtônica</b>: a sensível é o 7º grau a meio tom da tônica, como na escala maior. Se o 7º grau ficar a um tom inteiro, chama-se subtônica e não puxa do mesmo jeito.',
    ],
    show: 'Toque a tônica, depois a nota 7 semitons acima (dominante) e a 7 semitons abaixo (subdominante): são as três tonalidades vizinhas no círculo. Termine com o 7º grau subindo para a tônica e mostre o puxão da sensível.',
  } as RecapText,
};

const en: typeof pt = {
  playVI: 'Hear dominant → tonic',
  pSub: (t: S) => `<b>${t}</b> is the tonic. Which note is a perfect fifth <b>below</b> it? Count 7 half steps down and tap it.`,
  pSubRev: (n: S) => `${n}, degree 4: the subdominant, “the dominant below”. The same note also shows up a fourth above the tonic (7 down or 5 up give the same letter).`,
  pSide: (k: S) => `The dominant is a fifth above the tonic. In which direction around the circle is it ${k}’s neighbor?`,
  sides: ['clockwise', 'counter-clockwise'],
  pSideRev: 'Clockwise: each clockwise step goes up a fifth. The subdominant, a fifth below, is the counter-clockwise neighbor. The tonic sits between the two.',
  dom: (n: S, k: S) => `<b>Dominant · ${n}</b>: a fifth above the tonic. In the harmonic series, the fifth is the first new interval after the octave (3:2), which is why it is seen as the strongest relationship after the octave. On the circle, it is the clockwise neighbor: ${k}.`,
  why: (d: S, lt: S, x: S, t: S, f: S) => `<b>Why the dominant asks for the tonic</b>: the chord built on ${d} (${d}, ${lt}, ${x}) contains the leading tone, ${lt}, a half step below ${t}: the ear wants it to rise. And the bass ${d} → ${t} falls a fifth, one step back around the circle, home. If the chord adds ${f}, degree 4, it holds the whole tritone, and the tension grows.`,
  transfer: (k: S) => `In ${k}: which notes are the subdominant, the dominant and the leading tone? Play the dominant chord and resolve it to the tonic.`,
  recap: {
    oneLine: 'Because the dominant chord, a fifth above the tonic, contains the leading tone, a half step below the tonic, and its bass falls a fifth back home: the leading tone rises a half step and the root falls a fifth, both landing on the tonic.',
    confusions: [
      '<b>Subdominant does not mean “below the dominant”</b>: the name means “the lower dominant”, a fifth below the tonic. It also happens to sit a whole step below the dominant, but that is not where the name comes from.',
      '<b>Fifth below × fourth above</b>: the subdominant can be played in both places; it is the same note, in another octave.',
      '<b>Leading tone × subtonic</b>: the leading tone is degree 7 a half step below the tonic, as in the major scale. If degree 7 sits a whole step below, it is called the subtonic and does not pull the same way.',
    ],
    show: 'Play the tonic, then the note 7 half steps above (dominant) and 7 half steps below (subdominant): they are the three neighboring keys on the circle. End with degree 7 rising to the tonic and show the pull of the leading tone.',
  },
};

export const extras = { pt, en };
