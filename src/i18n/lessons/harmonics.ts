import type { LessonText } from '../lessonText';
import type { RecapText } from './extras/types';

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
    fifth: 'Harmônicos 2 e 3: a razão 3:2. É a 5ª justa, o primeiro intervalo com nome novo. A tradição atribui a Pitágoras a ideia de construir as notas empilhando essa razão.',
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
    '<b>Quinta = 3:2</b>: o harmônico 3 é a primeira nota diferente da fundamental. É a mesma razão 3:2 que, segundo a tradição, Pitágoras usou para empilhar quintas e chegar às notas (veja a aula <a href="#/aula/origin">Origem</a>). O círculo das quintas começa aqui, dentro do som.',
    '<b>Tríade maior = 4:5:6</b>: os harmônicos 4, 5 e 6 formam tônica, 3ª maior e 5ª. Todo som de corda já carrega um acorde maior “fraquinho” dentro dele. A 3ª menor (5:6) aparece logo depois, mas a tríade menor inteira só surge mais alto, nos harmônicos 10, 12 e 15.',
    '<b>Por que o piano “desafina” um pouco</b>: a 3ª maior pura (5:4) é 14 cents mais baixa que a do piano. O temperamento igual divide a oitava em 12 partes iguais e aceita esse pequeno erro para poder tocar em todas as tonalidades.',
    '<b>Timbre</b>: um violino, uma flauta e um piano tocando a mesma nota têm a mesma fundamental. O que muda é a força de cada harmônico. É essa “receita” que o ouvido reconhece como timbre.',
  ],
  more: [4, 5],
  pH3: (f: string) => `A fundamental é ${f} (harmônico 1) e o harmônico 2 é a oitava. Antes de ver a série: qual nota é o harmônico 3, a corda vibrando em 3 partes? Toque.`,
  pH3Rev: (n: string) => `${n}. Três vezes a frequência é uma 8ª mais uma 5ª acima da fundamental (dentro da oitava, 3:2). É a primeira nota nova da série, e por isso a 5ª é o intervalo mais forte depois da 8ª.`,
  pCons: 'Toque a 5ª justa (3:2) e a 3ª maior (5:4). Qual das duas divide mais harmônicos entre as duas notas?',
  pConsOpts: ['a 3ª maior', 'a 5ª justa', 'as duas, igual'],
  pConsRev: 'A 5ª. Na razão p:q, a cada p harmônicos da nota de baixo um coincide com a de cima. Com 3:2, coincide o 3º, o 6º, o 9º… (5 dos 16 primeiros). Com 5:4, só o 5º, o 10º e o 15º (3 de 16). Números menores na razão, mais coincidências.',
  transfer: (k: string) => `Em ${k}: quais notas são os harmônicos 4, 5 e 6? Elas formam a tríade maior de ${k}?`,
  recap: {
    oneLine: 'Uma tecla soa muitas notas ao mesmo tempo: a corda vibra inteira e em 2, 3, 4… partes, e esses harmônicos (2×, 3×, 4×… a frequência) se fundem numa nota só; os primeiros formam a 8ª (2:1), a 5ª (3:2), a 4ª (4:3) e a tríade maior (4:5:6).',
    confusions: [
      '<b>Harmônico × nota tocada</b>: você ouve uma nota só, a fundamental; os harmônicos se fundem nela e dão o timbre.',
      '<b>Harmônico 3 × 3º grau</b>: o harmônico 3 é a 5ª (uma oitava acima), não a 3ª. A 3ª maior é o harmônico 5.',
      '<b>Razão × semitons</b>: 3:2 é uma razão de frequências; 7 semitons é a medida no teclado. A 5ª do piano é quase, mas não exatamente, 3:2.',
    ],
    show: 'Abaixe sem fazer som a tecla Sol que fica uma 8ª e uma 5ª acima de um Dó grave e segure. Toque esse Dó forte e solte logo: o Sol continua soando sozinho, porque a corda dele vibra junto com o harmônico 3 do Dó.',
  } as RecapText,
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
    fifth: 'Harmonics 2 and 3: the ratio 3:2. It is the perfect fifth, the first interval with a new note name. Tradition credits Pythagoras with building the notes by stacking this ratio.',
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
    '<b>Fifth = 3:2</b>: harmonic 3 is the first note different from the fundamental. It is the same 3:2 ratio that, as tradition has it, Pythagoras used to stack fifths and reach the notes (see the <a href="#/aula/origin">Origin</a> lesson). The circle of fifths starts here, inside the sound.',
    '<b>Major triad = 4:5:6</b>: harmonics 4, 5 and 6 form tonic, major third and fifth. Every string sound already carries a faint major chord inside it. The minor third (5:6) comes right after, but the whole minor triad only appears higher up, in harmonics 10, 12 and 15.',
    '<b>Why the piano is slightly “out of tune”</b>: the pure major third (5:4) is 14 cents lower than the piano’s. Equal temperament splits the octave into 12 equal parts and accepts that small error so it can play in every key.',
    '<b>Timbre</b>: a violin, a flute and a piano playing the same note share the same fundamental. What changes is the strength of each harmonic. That “recipe” is what the ear recognizes as timbre.',
  ],
  more: [4, 5],
  pH3: (f: string) => `The fundamental is ${f} (harmonic 1) and harmonic 2 is the octave. Before seeing the series: which note is harmonic 3, the string vibrating in 3 parts? Tap it.`,
  pH3Rev: (n: string) => `${n}. Three times the frequency is an octave plus a 5th above the fundamental (within the octave, 3:2). It is the first new note of the series, which is why the 5th is the strongest interval after the octave.`,
  pCons: 'Play the perfect 5th (3:2) and the major 3rd (5:4). Which one shares more harmonics between its two notes?',
  pConsOpts: ['the major 3rd', 'the perfect 5th', 'both the same'],
  pConsRev: 'The 5th. In a ratio p:q, one in every p harmonics of the lower note coincides with the upper one. With 3:2 the 3rd, 6th, 9th… coincide (5 of the first 16). With 5:4 only the 5th, 10th and 15th (3 of 16). Smaller numbers in the ratio, more coincidences.',
  transfer: (k: string) => `In ${k}: which notes are harmonics 4, 5 and 6? Do they form the major triad of ${k}?`,
  recap: {
    oneLine: 'One key sounds many notes at once: the string vibrates as a whole and in 2, 3, 4… parts, and these harmonics (2×, 3×, 4×… the frequency) fuse into a single note; the first ones form the octave (2:1), the 5th (3:2), the 4th (4:3) and the major triad (4:5:6).',
    confusions: [
      '<b>Harmonic vs note played</b>: you hear one note, the fundamental; the harmonics fuse into it and give it its timbre.',
      '<b>Harmonic 3 vs degree 3</b>: harmonic 3 is the 5th (an octave up), not the 3rd. The major 3rd is harmonic 5.',
      '<b>Ratio vs half steps</b>: 3:2 is a ratio of frequencies; 7 half steps is the measure on the keyboard. The piano’s 5th is almost, but not exactly, 3:2.',
    ],
    show: 'Silently press down the G an octave and a 5th above a low C and hold it. Strike that C hard and let go at once: the G keeps sounding by itself, because its string vibrates along with the C’s harmonic 3.',
  } as RecapText,
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
