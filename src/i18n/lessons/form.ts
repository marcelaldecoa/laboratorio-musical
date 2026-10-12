import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

type S = string;
type Ending = 'authentic' | 'half' | 'deceptive';
type FormId = 'verse' | 'aaba' | 'aba';

const pt = {
  meta: {
    nav: 'Frases e forma',
    title: 'Frases, pergunta e resposta, forma',
    sub: 'Como a música se organiza em frases e seções',
    teaser: 'Vírgula e ponto final na música: cadências fecham frases, frases formam canções.',
  },
  desc:
    'Música se organiza como a fala: em frases. Uma frase curta termina numa pausa que pede continuação (como uma vírgula); outra frase responde e fecha (como um ponto final). Quem faz a pontuação são as cadências que você já conhece.',
  stepsTitle: 'Passo a passo',
  steps: [
    'Uma frase é uma ideia musical de cerca de 4 compassos, que dá para cantar num fôlego só.',
    'A primeira frase, a pergunta, termina no V: uma cadência suspensiva (ou meia cadência). O V é a dominante, que puxa para casa; parar nele soa como uma vírgula.',
  ],
  steps2: [
    'A segunda frase, a resposta, começa igual à pergunta. Só o final muda: V → I, a cadência perfeita (ou autêntica), com a melodia na tônica. Soa como ponto final.',
    'Pergunta + resposta = um período de 4 + 4 compassos. Troque o final da resposta abaixo e ouça a diferença.',
  ],
  predLt: (v: S, notes: S) =>
    `A pergunta para no ${v}, com as notas <b>${notes}</b>. Uma delas fica meio tom abaixo da tônica e “quer” subir até ela. Toque-a.`,
  predLtReveal: (lt: S, t: S) =>
    `${lt} é a sensível (o 7º grau), meio tom abaixo de ${t}. Quando o V vai para o I, ela sobe para a tônica e a tensão se resolve. Parar no V deixa essa subida no ar: por isso a pergunta soa como vírgula.`,
  predEnd: 'A resposta começa igual à pergunta e também passa pelo V. Em qual acorde ela deve terminar, logo depois do V, para soar como ponto final?',
  predEndReveal: (v: S, i: S, lt: S, t: S) =>
    `${v} → ${i}: a sensível ${lt} sobe para ${t}, e a melodia pousa na tônica. É a cadência perfeita (ou autêntica). O vi também pode vir depois do V, mas surpreende: é a cadência de engano, que você ouve no seletor abaixo.`,
  endLabel: 'Final da resposta',
  endName: { authentic: 'V → I', half: 'para no V', deceptive: 'V → vi' } as Record<Ending, S>,
  endRead: {
    authentic: (v: S, i: S, t: S) =>
      `Cadência perfeita (ou autêntica): ${v} → ${i}, e a melodia pousa em ${t}, a tônica. Ponto final: a música chegou em casa.`,
    half: (v: S, _i: S, _t: S, d: S) =>
      `A resposta termina como a pergunta, no ${v} com a melodia em ${d}. Ficou outra vírgula: a música ainda pede continuação.`,
    deceptive: (v: S, _i: S, t: S, _d: S, vi: S) =>
      `Cadência de engano: depois do ${v}, a melodia faz o mesmo caminho até ${t}, mas o acorde troca o I pelo ${vi}. A melodia chegou; a harmonia, não.`,
  } as Record<Ending, (v: S, i: S, t: S, d: S, vi: S) => S>,
  question: 'Pergunta',
  answer: 'Resposta',
  bars4: '4 compassos',
  playQ: 'Pergunta',
  playA: 'Resposta',
  playBoth: 'As duas frases',
  stop: 'Parar',
  rollLabel: 'O período: pergunta (compassos 1–4) e resposta (5–8)',
  showLabel: 'Teclado mostra',
  showQ: 'Fim da pergunta',
  showA: 'Fim da resposta',
  keyLabel: (chord: S, mel: S) => `${chord}, melodia em ${mel}`,
  qRead: (v: S, d: S) => `Cadência suspensiva (ou meia cadência): a pergunta para no ${v}, com a melodia em ${d}. É a vírgula: tensão sem resolução.`,
  lgT: 'tônica (I, vi)',
  lgD: 'dominante (V)',
  lgScale: 'outras notas da melodia',
  lgWas: 'onde a pergunta terminou',
  formTitle: 'Da frase à canção',
  formDesc:
    'Juntando frases você tem seções; juntando seções, a forma da música. As letras marcam o que se repete: a mesma letra é a mesma música. Aqui cada bloco tem 4 compassos para caber na tela; nas canções reais costumam ser 8.',
  formLabel: 'Forma',
  formName: { verse: 'Verso e refrão', aaba: 'AABA', aba: 'ABA' } as Record<FormId, S>,
  formRead: {
    verse:
      'Verso e refrão: o verso conta a história (a letra muda a cada vez), o refrão repete o gancho. Perto do fim, a ponte traz algo novo antes do último refrão.',
    aaba:
      'AABA (forma de 32 compassos): a mesma frase A três vezes, com uma ponte B no meio que sai de casa (aqui começa no vi) e termina no V, pedindo a volta do A.',
    aba: 'ABA (forma ternária): sair e voltar. A apresenta a ideia, B contrasta, e a volta de A dá a sensação de chegar em casa.',
  } as Record<FormId, S>,
  partName: {
    verse: { A: 'Verso', B: 'Ponte', C: 'Refrão' },
    aaba: { A: 'tema', B: 'ponte', C: '' },
    aba: { A: 'tema', B: 'contraste', C: '' },
  } as Record<FormId, Record<'A' | 'B' | 'C', S>>,
  kindName: { A: 'casa (A, verso)', B: 'contraste (B, ponte)', C: 'refrão' } as Record<'A' | 'B' | 'C', S>,
  playForm: 'Tocar a forma',
  tapBlock: 'Toque num bloco para ouvir só aquela seção.',
  logicTitle: 'A lógica por baixo',
  logic: [
    '<b>Vem das funções</b>: o V puxa para o I porque traz a sensível, que sobe meio tom para a tônica. Parar no V deixa essa força no ar; ir ao I a resolve. Pergunta e resposta são só isso, usado de propósito.',
    '<b>Por que a resposta começa igual</b>: repetir o começo faz o ouvido comparar as duas frases. Como o início é o mesmo, a diferença do final fica evidente.',
    '<b>Cadência de engano</b>: o vi divide duas notas com o I (é a tônica relativa). Por isso ele “serve” como chegada, mas surpreende e pede mais uma frase.',
    '<b>Origem dos nomes</b>: teóricos do século XVIII, como Heinrich Christoph Koch, descreveram a música como um discurso: frases que se juntam em períodos, com cadências fazendo o papel da pontuação. Período vem do grego <i>periodos</i>, “volta completa”.',
    '<b>AABA e verso e refrão</b>: o AABA de 32 compassos foi o molde de muitas canções da Broadway e de standards de jazz entre os anos 1920 e 1950; o verso e refrão se tornou o formato mais comum no pop e no rock a partir dos anos 1960. A ideia de ABA é bem mais antiga: um exemplo é a ária <i>da capo</i> do Barroco (“do começo”: depois do B, volta-se ao A).',
  ],
  transfer: (k: S) => `Em ${k}: em qual acorde e em qual nota da melodia a pergunta para? E qual nota sobe meio tom na cadência perfeita?`,
  recap: {
    oneLine:
      'A pergunta para no V, cuja sensível ainda quer subir meio tom até a tônica, e por isso soa como vírgula; a resposta repete o começo e termina em V → I, onde a sensível chega em casa, e por isso soa como ponto final.',
    confusions: [
      '<b>Cadência suspensiva × cadência perfeita</b>: a suspensiva (meia cadência) para <i>no</i> V; a perfeita vai <i>do</i> V para o I.',
      '<b>Frase × período</b>: a frase é uma ideia de uns 4 compassos; o período são duas frases que se respondem.',
      '<b>Refrão × ponte</b>: o refrão volta várias vezes com o mesmo gancho; a ponte costuma aparecer uma vez só e traz contraste.',
    ],
    show:
      'Em Dó, toque uma frase curta e pare num acorde de Sol (o V): quem ouve espera mais. Repita a mesma frase e termine em Sol → Dó, com Si subindo para Dó na melodia: acabou.',
  } as RecapText,
};

const en: typeof pt = {
  meta: {
    nav: 'Phrases and form',
    title: 'Phrases, question and answer, form',
    sub: 'How music is organized in phrases and sections',
    teaser: 'Commas and periods in music: cadences close phrases, phrases build songs.',
  },
  desc:
    'Music is organized like speech: in phrases. A short phrase ends with a pause that asks for more (like a comma); another phrase answers and closes (like a period). The punctuation is made by the cadences you already know.',
  stepsTitle: 'Step by step',
  steps: [
    'A phrase is a musical idea about 4 bars long, short enough to sing in one breath.',
    'The first phrase, the question, ends on V: a half cadence. V is the dominant, which pulls toward home; stopping on it sounds like a comma.',
  ],
  steps2: [
    'The second phrase, the answer, starts like the question. Only the ending changes: V → I, the authentic (perfect) cadence, with the melody on the tonic. It sounds like a period.',
    'Question + answer = a period of 4 + 4 bars. Change the answer’s ending below and hear the difference.',
  ],
  predLt: (v: S, notes: S) =>
    `The question stops on ${v}, with the notes <b>${notes}</b>. One of them sits a half step below the tonic and “wants” to rise to it. Tap it.`,
  predLtReveal: (lt: S, t: S) =>
    `${lt} is the leading tone (degree 7), a half step below ${t}. When V goes to I, it rises to the tonic and the tension resolves. Stopping on V leaves that rise hanging: that is why the question sounds like a comma.`,
  predEnd: 'The answer starts like the question and also passes through V. On which chord should it end, right after V, to sound like a period?',
  predEndReveal: (v: S, i: S, lt: S, t: S) =>
    `${v} → ${i}: the leading tone ${lt} rises to ${t}, and the melody lands on the tonic. It is the authentic (perfect) cadence. vi can also follow V, but it surprises: that is the deceptive cadence, which you can hear in the selector below.`,
  endLabel: 'Ending of the answer',
  endName: { authentic: 'V → I', half: 'stops on V', deceptive: 'V → vi' } as Record<Ending, S>,
  endRead: {
    authentic: (v: S, i: S, t: S) =>
      `Authentic (perfect) cadence: ${v} → ${i}, and the melody lands on ${t}, the tonic. A period: the music is home.`,
    half: (v: S, _i: S, _t: S, d: S) =>
      `The answer ends like the question, on ${v} with the melody on ${d}. Another comma: the music still asks for more.`,
    deceptive: (v: S, _i: S, t: S, _d: S, vi: S) =>
      `Deceptive cadence: after ${v}, the melody takes the same path to ${t}, but the chord swaps I for ${vi}. The melody arrived; the harmony did not.`,
  } as Record<Ending, (v: S, i: S, t: S, d: S, vi: S) => S>,
  question: 'Question',
  answer: 'Answer',
  bars4: '4 bars',
  playQ: 'Question',
  playA: 'Answer',
  playBoth: 'Both phrases',
  stop: 'Stop',
  rollLabel: 'The period: question (bars 1–4) and answer (5–8)',
  showLabel: 'Keyboard shows',
  showQ: 'End of the question',
  showA: 'End of the answer',
  keyLabel: (chord: S, mel: S) => `${chord}, melody on ${mel}`,
  qRead: (v: S, d: S) => `Half cadence: the question stops on ${v}, with the melody on ${d}. It is the comma: tension without resolution.`,
  lgT: 'tonic (I, vi)',
  lgD: 'dominant (V)',
  lgScale: 'other melody notes',
  lgWas: 'where the question ended',
  formTitle: 'From phrase to song',
  formDesc:
    'Phrases make sections; sections make the form of a piece. Letters mark what repeats: the same letter is the same music. Here each block is 4 bars so it fits on screen; in real songs they are usually 8.',
  formLabel: 'Form',
  formName: { verse: 'Verse and chorus', aaba: 'AABA', aba: 'ABA' } as Record<FormId, S>,
  formRead: {
    verse:
      'Verse and chorus: the verse tells the story (its lyrics change each time), the chorus repeats the hook. Near the end, the bridge brings something new before the last chorus.',
    aaba:
      'AABA (32-bar form): the same phrase A three times, with a bridge B in the middle that leaves home (here it starts on vi) and ends on V, asking for A to come back.',
    aba: 'ABA (ternary form): leave and return. A states the idea, B contrasts, and the return of A feels like coming home.',
  } as Record<FormId, S>,
  partName: {
    verse: { A: 'Verse', B: 'Bridge', C: 'Chorus' },
    aaba: { A: 'theme', B: 'bridge', C: '' },
    aba: { A: 'theme', B: 'contrast', C: '' },
  } as Record<FormId, Record<'A' | 'B' | 'C', S>>,
  kindName: { A: 'home (A, verse)', B: 'contrast (B, bridge)', C: 'chorus' } as Record<'A' | 'B' | 'C', S>,
  playForm: 'Play the form',
  tapBlock: 'Tap a block to hear only that section.',
  logicTitle: 'The logic underneath',
  logic: [
    '<b>It comes from functions</b>: V pulls toward I because it carries the leading tone, which rises a half step to the tonic. Stopping on V leaves that pull hanging; going to I resolves it. Question and answer are just that, used on purpose.',
    '<b>Why the answer starts the same</b>: repeating the opening makes the ear compare the two phrases. Since the start is identical, the different ending stands out.',
    '<b>Deceptive cadence</b>: vi shares two notes with I (it is the relative tonic). That is why it “works” as an arrival, but it surprises and asks for one more phrase.',
    '<b>Where the names come from</b>: 18th-century theorists such as Heinrich Christoph Koch described music as speech: phrases joining into periods, with cadences acting as punctuation. Period comes from Greek <i>periodos</i>, “a full circuit”.',
    '<b>AABA and verse–chorus</b>: the 32-bar AABA was the mold of many Broadway songs and jazz standards from the 1920s to the 1950s; verse–chorus became the most common layout in pop and rock from the 1960s on. The ABA idea is much older: one example is the Baroque <i>da capo</i> aria (“from the head”: after B, go back to A).',
  ],
  transfer: (k: S) => `In ${k}: on which chord and which melody note does the question stop? And which note rises a half step in the authentic cadence?`,
  recap: {
    oneLine:
      'The question stops on V, whose leading tone still wants to rise a half step to the tonic, so it sounds like a comma; the answer repeats the opening and ends V → I, where the leading tone gets home, so it sounds like a period.',
    confusions: [
      '<b>Half cadence × authentic cadence</b>: a half cadence stops <i>on</i> V; an authentic cadence goes <i>from</i> V to I.',
      '<b>Phrase × period</b>: a phrase is one idea of about 4 bars; a period is two phrases answering each other.',
      '<b>Chorus × bridge</b>: the chorus comes back several times with the same hook; the bridge usually appears once and brings contrast.',
    ],
    show:
      'In C, play a short phrase and stop on a G chord (V): listeners expect more. Repeat the same phrase and end G → C, with B rising to C in the melody: done.',
  } as RecapText,
};

export const text = {
  pt,
  en,
  glossary: [
    ['Phrase', '', 'Frase', 'Uma ideia musical completa, em geral de 4 compassos, que termina numa cadência. Dá para cantar num fôlego.', 'A complete musical idea, usually 4 bars long, that ends with a cadence. You can sing it in one breath.'],
    ['Period', 'antecedent and consequent', 'Período', 'Duas frases em pergunta e resposta: a primeira (antecedente) termina numa cadência suspensiva (meia cadência), a segunda (consequente) começa igual e termina numa cadência perfeita (autêntica).', 'Two phrases as question and answer: the first (antecedent) ends with a half cadence, the second (consequent) starts the same and ends with an authentic cadence.'],
    ['Form', 'song form', 'Forma', 'A ordem das seções de uma música, marcada por letras (A, B…) ou nomes (verso, refrão, ponte). A mesma letra é a mesma música.', 'The order of a piece’s sections, marked with letters (A, B…) or names (verse, chorus, bridge). The same letter means the same music.'],
    ['Bridge', '', 'Ponte', 'Seção de contraste (o B do AABA) que sai de casa, muitas vezes por outros acordes, e prepara a volta da seção principal.', 'A contrasting section (the B of AABA) that leaves home, often through other chords, and sets up the return of the main section.'],
    ['Chorus', 'refrain', 'Refrão', 'A seção que se repete com a mesma letra e o gancho principal da canção.', 'The section that repeats with the same lyrics and the song’s main hook.'],
  ],
} satisfies LessonText<typeof pt>;
