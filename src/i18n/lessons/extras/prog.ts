import type { RecapText } from './types';

type S = string;

const pt = {
  desc: 'Uma progressão é uma sequência de acordes que conta uma história de tensão e repouso. Os 7 acordes do campo harmônico têm só três papéis, as <b>funções</b>: casa (T), afastamento (SD) e tensão (D). Acordes que dividem duas notas soam parecidos e podem se substituir.',
  p1: (key: S, I: S) => `Em <b>${key}</b>, o acorde ${I} (I) é a casa. Qual destes tem <b>duas notas em comum</b> com ele e pode substituí-lo?`,
  p1r: (vi: S, I: S, common: S) =>
    `${vi} (vi) divide ${common} com o acorde ${I}. Fundamentais a uma terça de distância sempre dividem duas notas, e acordes que dividem duas notas fazem o mesmo papel: o vi também é função de tônica.`,
  p2: (key: S, V: S) =>
    `Em <b>${key}</b>, olhe o acorde ${V} (V) no teclado e imagine o próximo, o I. Uma nota do V <b>fica parada</b> e vira parte do I. Toque essa nota.`,
  p2r: (n: S, lt: S, tonic: S) =>
    `<b>${n}</b> é a fundamental do V e a quinta do I, então fica parada. As outras andam pouco: a sensível ${lt} sobe meio tom até ${tonic}. Uma nota parada e as outras andando por tom ou semitom: é por isso que V → I soa como um ponto final.`,
  logic: [
    '<b>Cadência</b>: o final de uma frase, como a pontuação de um texto. V → I é a cadência perfeita (ou autêntica), o ponto final. Parar no V é a cadência suspensiva (ou meia cadência), uma vírgula. IV → I é a cadência plagal, e V → vi, a cadência de engano.',
    '<b>O caminho da fundamental decide a força</b>: (1) caindo uma quinta (V → I, ii → V), uma nota fica e as outras andam por tom ou semitom: o movimento mais forte, um passo anti-horário no círculo, rumo à tônica. (2) Andando uma terça (I → vi), duas notas ficam: só troca a cor. (3) Andando um grau (IV → V), nenhuma nota fica: o ouvido sente um empurrão.',
    '<b>Mesmos acordes, músicas diferentes</b>: as funções são só três, então muitas músicas usam o mesmo esqueleto (casa, afastamento, tensão, volta). O que faz cada uma ser única é o resto: a ordem dos acordes (I–V–vi–IV e vi–IV–I–V usam os mesmos quatro acordes; só muda por onde começam), a melodia, o ritmo e a tonalidade.',
    '<b>Condução de vozes</b>: no teclado, cada acorde aparece na posição mais próxima do anterior. As notas em comum ficam paradas, e as tracejadas mostram de onde as outras vozes saíram. É assim que o pianista encadeia acordes sem saltar pelo teclado.',
    '<b>De onde vêm os nomes T, SD e D</b>: a ideia de reduzir todos os acordes a três funções foi sistematizada pelo teórico alemão Hugo Riemann, no fim do século XIX.',
    '<b>“Amém”</b>: a cadência plagal ganhou esse apelido porque muitos hinos cantam o “A-mém” final sobre IV → I.',
  ],
  pats: {
    pop: 'Uma das progressões mais usadas no pop (“Let It Be”, “Don’t Stop Believin’”). Chega à tensão no V e, em vez de voltar ao I, cai no vi, primo menor da tônica, e respira no IV.',
    pachelbel: 'As fundamentais descem uma quarta e sobem um grau, em degraus (I–V, vi–iii, IV–I). O padrão do Cânon de Pachelbel reaparece em muitas canções.',
  } as Record<S, S>,
  transfer: (k: S) => `Em <b>${k}</b>, toque ii–V–I. Em cada troca, qual nota fica parada?`,
  recap: {
    oneLine: 'Porque os acordes de uma tonalidade têm só três papéis (casa, afastamento e tensão) e a história casa → afastamento → tensão → volta funciona em qualquer música; o que muda de uma para outra é a ordem, a melodia, o ritmo e a tonalidade.',
    confusions: [
      '<b>Cadência perfeita × suspensiva</b>: V → I fecha a frase (ponto final); parar no V deixa a frase em aberto (vírgula).',
      '<b>Plagal × de engano</b>: a plagal é IV → I, chega em casa sem a sensível. A de engano é V → vi: a tensão do V resolve num acorde que não é o I.',
      '<b>Função × grau</b>: o grau é o lugar do acorde na escala (I, vi, iii); a função é o papel (T). Vários graus têm a mesma função porque dividem duas notas.',
    ],
    show: 'Toque V → I na posição mais próxima. Segure a nota em comum com o mesmo dedo e mostre a sensível subindo meio tom até a tônica. Depois toque V → vi e mostre que a sensível sobe do mesmo jeito, mas o baixo engana o ouvido.',
  } satisfies RecapText,
};

const en: typeof pt = {
  desc: 'A progression is a sequence of chords that tells a story of tension and rest. The 7 chords of the key have only three roles, the <b>functions</b>: home (T), departure (SD) and tension (D). Chords that share two notes sound alike and can stand in for each other.',
  p1: (key: S, I: S) => `In <b>${key}</b>, the ${I} chord (I) is home. Which of these shares <b>two notes</b> with it and can replace it?`,
  p1r: (vi: S, I: S, common: S) =>
    `${vi} (vi) shares ${common} with the ${I} chord. Roots a third apart always share two notes, and chords that share two notes do the same job: vi is a tonic-function chord too.`,
  p2: (key: S, V: S) =>
    `In <b>${key}</b>, look at the ${V} chord (V) on the keyboard and imagine the next one, I. One note of V <b>stays put</b> and becomes part of I. Tap that note.`,
  p2r: (n: S, lt: S, tonic: S) =>
    `<b>${n}</b> is the root of V and the fifth of I, so it stays. The others move a little: the leading tone ${lt} rises a half step to ${tonic}. One note held and the others moving by a whole or half step: that is why V → I sounds like a full stop.`,
  logic: [
    '<b>Cadence</b>: the end of a phrase, like punctuation in a text. V → I is the perfect (authentic) cadence, the full stop. Stopping on V is the half cadence, a comma. IV → I is the plagal cadence, and V → vi the deceptive cadence.',
    '<b>The path of the root decides the strength</b>: (1) falling a fifth (V → I, ii → V), one note stays and the others move by a whole or half step: the strongest move, one counterclockwise step on the circle, toward the tonic. (2) Moving a third (I → vi), two notes stay: only the color changes. (3) Moving a step (IV → V), no note stays: the ear feels a push.',
    '<b>Same chords, different songs</b>: there are only three functions, so many songs share the same skeleton (home, departure, tension, return). What makes each one unique is everything else: the order of the chords (I–V–vi–IV and vi–IV–I–V use the same four chords; only the starting point changes), the melody, the rhythm and the key.',
    '<b>Voice leading</b>: on the keyboard each chord appears in the position closest to the one before. Common tones stay put, and the dashed keys show where the other voices came from. That is how a pianist links chords without jumping around the keyboard.',
    '<b>Where T, SD and D come from</b>: the idea of reducing every chord to three functions was systematized by the German theorist Hugo Riemann in the late 19th century.',
    '<b>“Amen”</b>: the plagal cadence got this nickname because many hymns sing the final “A-men” over IV → I.',
  ],
  pats: {
    pop: 'One of the most used progressions in pop (“Let It Be”, “Don’t Stop Believin’”). It reaches tension on V and, instead of going back to I, falls to vi, the tonic’s minor cousin, and breathes on IV.',
    pachelbel: 'The roots fall a fourth and rise a step, in stairs (I–V, vi–iii, IV–I). The pattern of Pachelbel’s Canon turns up in many songs.',
  },
  transfer: (k: S) => `In <b>${k}</b>, play ii–V–I. At each change, which note stays put?`,
  recap: {
    oneLine: 'Because the chords of a key have only three roles (home, departure and tension) and the story home → departure → tension → return works in any song; what changes from one song to another is the order, the melody, the rhythm and the key.',
    confusions: [
      '<b>Perfect vs half cadence</b>: V → I closes the phrase (full stop); stopping on V leaves it open (comma).',
      '<b>Plagal vs deceptive</b>: plagal is IV → I, reaching home without the leading tone. Deceptive is V → vi: the tension of V resolves to a chord that is not I.',
      '<b>Function vs degree</b>: the degree is the chord’s place in the scale (I, vi, iii); the function is its role (T). Several degrees share a function because they share two notes.',
    ],
    show: 'Play V → I in the closest position. Hold the common tone with the same finger and show the leading tone rising a half step to the tonic. Then play V → vi and show the leading tone rising the same way while the bass fools the ear.',
  },
};

export const extras = { pt, en };
