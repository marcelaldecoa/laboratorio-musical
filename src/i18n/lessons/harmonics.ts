import type { LessonText } from '../lessonText';

const pt = {
  meta: {
    nav: 'Série harmônica',
    title: 'A série harmônica',
    sub: 'As notas que já moram dentro de cada nota',
    teaser: 'Uma nota de piano é um acorde escondido: 8ª, 5ª e a tríade maior saem do próprio som.',
  },
  desc:
    'Quando você toca uma tecla, a corda não vibra numa frequência só. Ela vibra inteira e, ao mesmo tempo, em metades, terços, quartos… Cada pedaço soa uma nota mais aguda, os harmônicos. O ouvido junta tudo e escuta uma nota com um “colorido”. Esta aula mostra quais notas são essas e por que delas nascem a 8ª, a 5ª e a tríade maior (três notas tocadas juntas: a tônica, a 3ª e a 5ª).',

  stringTitle: '1. A corda vibra em partes',
  stringHint: 'Os pontos parados são os nós. Com 2 partes a frequência dobra, com 3 triplica, com 4 quadruplica. Toque numa linha para ouvir.',
  modes: ['1 parte · a fundamental (1×)', '2 partes · 2× a frequência', '3 partes · 3× a frequência', '4 partes · 4× a frequência'],
  stringAria: 'Corda vibrando inteira, em 2, em 3 e em 4 partes, com os nós marcados.',

  seriesTitle: '2. Os 16 primeiros harmônicos no teclado',
  seriesHint: (f: string) =>
    `A fundamental é ${f}, duas oitavas abaixo da tônica, para que os 16 caibam em 4 oitavas. O número dentro da tecla é o número do harmônico: a frequência é a da fundamental vezes esse número.`,
  viewPick: 'Destacar',
  views: { all: 'Todos', oct: '8ª · 2:1', fifth: '5ª · 3:2', fourth: '4ª · 4:3', triad: 'Tríade · 4:5:6' },
  viewRead: {
    all: 'Repare no desenho: no grave os harmônicos ficam longe (8ª, 5ª, 4ª) e no agudo vão se apertando até ficarem a um semitom.',
    oct: 'Harmônicos 1 e 2: a razão 2:1. A nota de cima tem o dobro da frequência. É a mesma nota uma volta acima: a 8ª.',
    fifth: 'Harmônicos 2 e 3: a razão 3:2. É a 5ª justa, o primeiro intervalo com nome novo. Foi dela que Pitágoras construiu as 12 notas.',
    fourth: 'Harmônicos 3 e 4: a razão 4:3. É a 4ª justa, o que sobra da 8ª depois da 5ª (3:2 × 4:3 = 2:1).',
    triad: 'Harmônicos 4, 5 e 6: tônica, 3ª maior e 5ª justa. A tríade maior aparece sozinha na série, sem ninguém inventar.',
  },
  bracket: (name: string, ratio: string, semis: number) => `${name} · ${ratio} · ${semis} semitons`,
  ivShort: { oct: '8ª', fifth: '5ª', fourth: '4ª', M3: '3ª M', m3: '3ª m' },
  playSeries: 'Um por um',
  play456: '4:5:6 × piano',
  now: (n: number, name: string, ratio: string, off: string) => `Harmônico ${n} · ${name} · ${ratio} · ${off}`,
  nowIdle: 'Toque numa tecla numerada ou num quadrinho da tabela.',
  offText: (c: number) =>
    Math.abs(c) < 1 ? 'igual à tecla do piano' : c < 0 ? `${Math.round(-c)} cents abaixo da tecla` : `${Math.round(c)} cents acima da tecla`,
  lgOct: 'oitavas da fundamental (a tônica)',
  lgTriad: 'a tríade maior 4:5:6 (tônica, 3ª maior, 5ª)',
  lgIn: 'perto da tecla do piano (até 20 cents)',
  lgOff: 'desafinado em relação ao piano (mais de 20 cents)',
  lgNow: 'soando agora',
  lgOther: 'fora do destaque',
  kbdAria: (f: string) => `Teclado de 4 oitavas com os 16 primeiros harmônicos de ${f} numerados.`,

  tableTitle: '3. Razão e desvio de cada harmônico',
  tableHint: 'Cada quadrinho mostra a razão dentro da oitava e quantos cents (centésimos de semitom) o harmônico fica longe da tecla do piano. Toque para ouvir o harmônico puro e, logo depois, a tecla do piano.',
  cents: (c: number) => (Math.abs(c) < 0.5 ? '0¢' : (c > 0 ? '+' : '−') + Math.abs(c).toFixed(0) + '¢'),
  offNote:
    'Os harmônicos 7, 11 e 13 (e o 14, que é o 7 uma oitava acima) caem entre as teclas. O piano não tem essas notas: elas ficam de fora da música ocidental de 12 notas.',

  buildTitle: '4. Montar o som',
  buildHint: 'Some os harmônicos um a um. Com só o 1 você ouve um tom puro e “oco”; ao somar os outros, o som ganha corpo e brilho, mas continua parecendo uma nota só, a fundamental.',
  buildLabel: (n: number) => `Harmônicos somados: 1 a ${n}`,
  buildPlay: (n: number) => (n === 1 ? 'Ouvir só a fundamental' : `Ouvir 1 a ${n} juntos`),
  buildAria: (n: number) => `Espectro com os harmônicos de 1 a ${n} acesos, igualmente espaçados em frequência.`,
  buildAxis: 'frequência →',

  consTitle: '5. Por que a 8ª e a 5ª soam tão “limpas”',
  consHint: (f: string) =>
    `Toque duas notas juntas e os harmônicos das duas se misturam. Quanto mais harmônicos coincidem, menos eles “brigam” e mais calmo é o intervalo. Cada barra mostra os 16 harmônicos de ${f}; os acesos coincidem com harmônicos da nota de cima. Toque para ouvir o intervalo afinado pela razão.`,
  ivNames: { '8': '8ª justa', '5': '5ª justa', '4': '4ª justa', M3: '3ª maior', m3: '3ª menor', M2: '2ª maior', m2: '2ª menor' } as Record<string, string>,
  shared: (k: number) => (k === 1 ? '1 em comum' : `${k} em comum`),

  whyTitle: 'A lógica por baixo',
  why: [
    '<b>Múltiplos inteiros</b>: uma corda presa nas duas pontas só consegue vibrar em 1, 2, 3, 4… partes iguais. Por isso os harmônicos são exatamente 1×, 2×, 3×, 4×… a frequência da fundamental, sem frações.',
    '<b>Oitava = 2:1</b>: o harmônico 2 é a mesma nota uma volta acima. Metade da corda, o dobro da frequência. A nota de cima não traz nenhum harmônico novo: todos os dela já estão na de baixo. Por isso as duas parecem “a mesma nota”.',
    '<b>Quinta = 3:2</b>: o harmônico 3 é a primeira nota diferente da fundamental. É a mesma razão 3:2 que Pitágoras usou para empilhar quintas e chegar às 12 notas (veja a aula <a href="#/aula/origin">Origem</a>). O círculo das quintas começa aqui, dentro do som.',
    '<b>Tríade maior = 4:5:6</b>: os harmônicos 4, 5 e 6 formam tônica, 3ª maior e 5ª. Todo som de corda já carrega um acorde maior “fraquinho” dentro dele. A 3ª menor (5:6) aparece logo depois, mas a tríade menor inteira só surge bem mais alto na série.',
    '<b>Por que o piano “desafina” um pouco</b>: a 3ª maior pura (5:4) é 14 cents mais baixa que a do piano. O temperamento igual divide a oitava em 12 partes iguais e aceita esse pequeno erro para poder tocar em todas as tonalidades.',
    '<b>Timbre</b>: um violino, uma flauta e um piano tocando a mesma nota têm a mesma fundamental. O que muda é a força de cada harmônico. É essa “receita” que o ouvido reconhece como timbre.',
  ],
};

const en: typeof pt = {
  meta: {
    nav: 'Harmonic series',
    title: 'The harmonic series',
    sub: 'The notes that already live inside every note',
    teaser: 'A piano note is a hidden chord: the octave, the fifth and the major triad come out of the sound itself.',
  },
  desc:
    'When you play a key, the string does not vibrate at a single frequency. It vibrates as a whole and, at the same time, in halves, thirds, quarters… Each part sounds a higher note, the harmonics. The ear blends them and hears one note with a “color”. This lesson shows which notes those are and why the octave, the fifth and the major triad (three notes sounding together: tonic, 3rd and 5th) are born from them.',

  stringTitle: '1. The string vibrates in parts',
  stringHint: 'The still points are the nodes. With 2 parts the frequency doubles, with 3 it triples, with 4 it quadruples. Tap a row to hear it.',
  modes: ['1 part · the fundamental (1×)', '2 parts · 2× the frequency', '3 parts · 3× the frequency', '4 parts · 4× the frequency'],
  stringAria: 'String vibrating as a whole, in 2, 3 and 4 parts, with the nodes marked.',

  seriesTitle: '2. The first 16 harmonics on the keyboard',
  seriesHint: (f: string) =>
    `The fundamental is ${f}, two octaves below the tonic, so all 16 fit in 4 octaves. The number inside the key is the harmonic number: its frequency is the fundamental’s times that number.`,
  viewPick: 'Highlight',
  views: { all: 'All', oct: '8ve · 2:1', fifth: '5th · 3:2', fourth: '4th · 4:3', triad: 'Triad · 4:5:6' },
  viewRead: {
    all: 'Look at the shape: low down the harmonics are far apart (octave, fifth, fourth) and higher up they crowd together until they are a half step apart.',
    oct: 'Harmonics 1 and 2: the ratio 2:1. The upper note has twice the frequency. It is the same note one turn higher: the octave.',
    fifth: 'Harmonics 2 and 3: the ratio 3:2. It is the perfect fifth, the first interval with a new note name. Pythagoras built the 12 notes from it.',
    fourth: 'Harmonics 3 and 4: the ratio 4:3. It is the perfect fourth, what is left of the octave after the fifth (3:2 × 4:3 = 2:1).',
    triad: 'Harmonics 4, 5 and 6: tonic, major third and perfect fifth. The major triad shows up in the series by itself; nobody invented it.',
  },
  bracket: (name: string, ratio: string, semis: number) => `${name} · ${ratio} · ${semis} half steps`,
  ivShort: { oct: '8ve', fifth: '5th', fourth: '4th', M3: 'M3', m3: 'm3' },
  playSeries: 'One by one',
  play456: '4:5:6 vs piano',
  now: (n: number, name: string, ratio: string, off: string) => `Harmonic ${n} · ${name} · ${ratio} · ${off}`,
  nowIdle: 'Tap a numbered key or a square in the table.',
  offText: (c: number) =>
    Math.abs(c) < 1 ? 'same as the piano key' : c < 0 ? `${Math.round(-c)} cents below the key` : `${Math.round(c)} cents above the key`,
  lgOct: 'octaves of the fundamental (the tonic)',
  lgTriad: 'the major triad 4:5:6 (root, major third, fifth)',
  lgIn: 'close to the piano key (within 20 cents)',
  lgOff: 'out of tune with the piano (more than 20 cents)',
  lgNow: 'sounding now',
  lgOther: 'not highlighted',
  kbdAria: (f: string) => `Four-octave keyboard with the first 16 harmonics of ${f} numbered.`,

  tableTitle: '3. Ratio and deviation of each harmonic',
  tableHint: 'Each square shows the ratio within the octave and how many cents (hundredths of a half step) the harmonic is away from the piano key. Tap to hear the pure harmonic and, right after, the piano key.',
  cents: (c: number) => (Math.abs(c) < 0.5 ? '0¢' : (c > 0 ? '+' : '−') + Math.abs(c).toFixed(0) + '¢'),
  offNote:
    'Harmonics 7, 11 and 13 (and 14, which is 7 an octave up) fall between the keys. The piano does not have those notes: they are left out of 12-note Western music.',

  buildTitle: '4. Build the sound',
  buildHint: 'Add the harmonics one by one. With only 1 you hear a pure, “hollow” tone; as you add the others the sound gains body and brightness, yet it still sounds like one note, the fundamental.',
  buildLabel: (n: number) => `Harmonics added: 1 to ${n}`,
  buildPlay: (n: number) => (n === 1 ? 'Hear the fundamental only' : `Hear 1 to ${n} together`),
  buildAria: (n: number) => `Spectrum with harmonics 1 to ${n} lit, evenly spaced in frequency.`,
  buildAxis: 'frequency →',

  consTitle: '5. Why the octave and the fifth sound so “clean”',
  consHint: (f: string) =>
    `Play two notes together and their harmonics mix. The more harmonics coincide, the less they “clash” and the calmer the interval. Each bar shows the 16 harmonics of ${f}; the lit ones coincide with harmonics of the upper note. Tap to hear the interval tuned by its ratio.`,
  ivNames: { '8': 'perfect octave', '5': 'perfect fifth', '4': 'perfect fourth', M3: 'major third', m3: 'minor third', M2: 'major second', m2: 'minor second' },
  shared: (k: number) => `${k} shared`,

  whyTitle: 'The logic underneath',
  why: [
    '<b>Whole multiples</b>: a string fixed at both ends can only vibrate in 1, 2, 3, 4… equal parts. That is why the harmonics are exactly 1×, 2×, 3×, 4×… the fundamental frequency, never fractions.',
    '<b>Octave = 2:1</b>: harmonic 2 is the same note one turn higher. Half the string, twice the frequency. The upper note brings no new harmonic: all of its harmonics are already in the lower one. That is why both feel like “the same note”.',
    '<b>Fifth = 3:2</b>: harmonic 3 is the first note different from the fundamental. It is the same 3:2 ratio Pythagoras used to stack fifths and reach the 12 notes (see the <a href="#/aula/origin">Origin</a> lesson). The circle of fifths starts here, inside the sound.',
    '<b>Major triad = 4:5:6</b>: harmonics 4, 5 and 6 form tonic, major third and fifth. Every string sound already carries a faint major chord inside it. The minor third (5:6) comes right after, but the whole minor triad only appears much higher in the series.',
    '<b>Why the piano is slightly “out of tune”</b>: the pure major third (5:4) is 14 cents lower than the piano’s. Equal temperament splits the octave into 12 equal parts and accepts that small error so it can play in every key.',
    '<b>Timbre</b>: a violin, a flute and a piano playing the same note share the same fundamental. What changes is the strength of each harmonic. That “recipe” is what the ear recognizes as timbre.',
  ],
};

export const text = {
  pt,
  en,
  glossary: [
    ['Harmonic series', 'overtone series', 'Série harmônica', 'As frequências 1×, 2×, 3×, 4×… de uma fundamental, que soam juntas em toda corda ou tubo. Os primeiros formam 8ª, 5ª, 4ª e a tríade maior (4:5:6).', 'The frequencies 1×, 2×, 3×, 4×… of a fundamental, which sound together in every string or pipe. The first ones form the octave, fifth, fourth and the major triad (4:5:6).'],
    ['Harmonic', 'partial, overtone', 'Harmônico', 'Cada uma das frequências que a corda produz ao vibrar em partes iguais: o harmônico n tem n vezes a frequência da fundamental.', 'Each frequency a string makes by vibrating in equal parts: harmonic n has n times the fundamental frequency.'],
    ['Fundamental', 'fundamental frequency', 'Fundamental (do som)', 'O harmônico 1: a corda vibrando inteira. É a nota que o ouvido identifica como “a nota tocada”.', 'Harmonic 1: the string vibrating as a whole. It is the pitch the ear names as “the note played”.'],
    ['Timbre', 'tone color', 'Timbre', 'O “colorido” de um som: a força relativa de cada harmônico. É o que diferencia um piano de uma flauta na mesma nota.', 'The “color” of a sound: the relative strength of each harmonic. It tells a piano from a flute on the same note.'],
    ['Node', 'standing wave', 'Nó (onda estacionária)', 'Ponto da corda que fica parado enquanto o resto vibra. Uma corda vibrando em n partes tem n − 1 nós entre as pontas.', 'A point of the string that stays still while the rest vibrates. A string vibrating in n parts has n − 1 nodes between the ends.'],
  ],
} satisfies LessonText<typeof pt>;
