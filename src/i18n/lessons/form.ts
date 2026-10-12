import type { LessonText } from '../lessonText';

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
    'A primeira frase, a pergunta, termina no V: uma meia cadência (ou cadência suspensiva). O V é a dominante, que puxa para casa; parar nele soa como uma vírgula.',
    'A segunda frase, a resposta, começa igual à pergunta. Só o final muda: V → I, a cadência autêntica (ou perfeita), com a melodia na tônica. Soa como ponto final.',
    'Pergunta + resposta = um período de 4 + 4 compassos. Troque o final da resposta abaixo e ouça a diferença.',
  ],
  endLabel: 'Final da resposta',
  endName: { authentic: 'V → I', half: 'para no V', deceptive: 'V → vi' } as Record<Ending, S>,
  endRead: {
    authentic: (v: S, i: S, t: S) =>
      `Cadência autêntica: ${v} → ${i}, e a melodia pousa em ${t}, a tônica. Ponto final: a música chegou em casa.`,
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
  qRead: (v: S, d: S) => `Meia cadência: a pergunta para no ${v}, com a melodia em ${d}. É a vírgula: tensão sem resolução.`,
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
    '<b>Vem das funções</b>: o V puxa para o I (o trítono resolve, a sensível sobe para a tônica). Parar no V deixa essa força no ar; ir ao I a resolve. Pergunta e resposta são só isso, usado de propósito.',
    '<b>Por que a resposta começa igual</b>: repetir o começo faz o ouvido comparar as duas frases. Como o início é o mesmo, a diferença do final fica evidente.',
    '<b>Cadência de engano</b>: o vi divide duas notas com o I (é a tônica relativa). Por isso ele “serve” como chegada, mas surpreende e pede mais uma frase.',
    '<b>Origem dos nomes</b>: os teóricos do século XVIII, como Heinrich Koch, compararam a música à retórica: frases, cadências como pontuação, antecedente e consequente. Período vem do grego <i>periodos</i>, “volta completa”.',
    '<b>AABA e verso e refrão</b>: o AABA de 32 compassos foi o molde das canções da Broadway e do jazz nos anos 1920–50; o verso e refrão domina o pop e o rock desde os anos 60. A ABA é muito mais antiga: é a ária da capo do Barroco (“do começo”).',
  ],
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
    'The second phrase, the answer, starts like the question. Only the ending changes: V → I, the authentic cadence, with the melody on the tonic. It sounds like a period.',
    'Question + answer = a period of 4 + 4 bars. Change the answer’s ending below and hear the difference.',
  ],
  endLabel: 'Ending of the answer',
  endName: { authentic: 'V → I', half: 'stops on V', deceptive: 'V → vi' } as Record<Ending, S>,
  endRead: {
    authentic: (v: S, i: S, t: S) =>
      `Authentic cadence: ${v} → ${i}, and the melody lands on ${t}, the tonic. A period: the music is home.`,
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
    '<b>It comes from functions</b>: V pulls toward I (the tritone resolves, the leading tone rises to the tonic). Stopping on V leaves that pull hanging; going to I resolves it. Question and answer are just that, used on purpose.',
    '<b>Why the answer starts the same</b>: repeating the opening makes the ear compare the two phrases. Since the start is identical, the different ending stands out.',
    '<b>Deceptive cadence</b>: vi shares two notes with I (it is the relative tonic). That is why it “works” as an arrival, but it surprises and asks for one more phrase.',
    '<b>Where the names come from</b>: 18th-century theorists such as Heinrich Koch compared music to rhetoric: phrases, cadences as punctuation, antecedent and consequent. Period comes from Greek <i>periodos</i>, “a full circuit”.',
    '<b>AABA and verse–chorus</b>: the 32-bar AABA was the mold of Broadway and jazz standards in the 1920s–50s; verse–chorus has ruled pop and rock since the 1960s. ABA is much older: it is the Baroque da capo aria (“from the head”).',
  ],
};

export const text = {
  pt,
  en,
  glossary: [
    ['Phrase', '', 'Frase', 'Uma ideia musical completa, em geral de 4 compassos, que termina numa cadência. Dá para cantar num fôlego.', 'A complete musical idea, usually 4 bars long, that ends with a cadence. You can sing it in one breath.'],
    ['Period', 'antecedent and consequent', 'Período', 'Duas frases em pergunta e resposta: a primeira (antecedente) termina numa meia cadência, a segunda (consequente) começa igual e termina numa cadência autêntica.', 'Two phrases as question and answer: the first (antecedent) ends with a half cadence, the second (consequent) starts the same and ends with an authentic cadence.'],
    ['Form', 'song form', 'Forma', 'A ordem das seções de uma música, marcada por letras (A, B…) ou nomes (verso, refrão, ponte). A mesma letra é a mesma música.', 'The order of a piece’s sections, marked with letters (A, B…) or names (verse, chorus, bridge). The same letter means the same music.'],
    ['Bridge', '', 'Ponte', 'Seção de contraste (o B do AABA) que sai de casa, muitas vezes por outros acordes, e prepara a volta da seção principal.', 'A contrasting section (the B of AABA) that leaves home, often through other chords, and sets up the return of the main section.'],
    ['Chorus', 'refrain', 'Refrão', 'A seção que se repete com a mesma letra e o gancho principal da canção.', 'The section that repeats with the same lyrics and the song’s main hook.'],
  ],
} satisfies LessonText<typeof pt>;
