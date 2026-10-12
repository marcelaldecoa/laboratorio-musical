import type { RecapText } from './types';

type S = string;

const pt = {
  desc: [
    '<b>1.</b> Na série harmônica, a 5ª (3:2) é a primeira nota nova dentro de um som.',
    '<b>2.</b> A tradição conta que Pitágoras chegou a ela medindo cordas: metade da corda soa uma 8ª acima (2:1); dois terços soam uma 5ª acima (3:2).',
    '<b>3.</b> Empilhando 5ªs a partir de Dó (Sol, Ré, Lá, Mi…) aparecem, uma a uma, as 12 notas.',
    '<b>4.</b> A pergunta desta aula: depois de 12 quintas puras, você volta exatamente ao Dó?',
  ],
  pString: (c: S) => `Metade da corda de ${c} soa a oitava. Antes de ouvir: que nota soam <b>dois terços</b> da corda? Toque.`,
  pStringRev: (g: S) => `${g}. Dois terços do comprimento vibram 3/2 mais rápido: a 5ª justa, 7 semitons acima. É o harmônico 3 da aula anterior, trazido para dentro da oitava.`,
  pComma: (c: S) => `Comece em ${c} e suba 12 quintas puras (3:2). Comparado ao ${c} sete oitavas acima, onde você chega?`,
  pCommaOpts: (c: S) => [`exatamente no ${c}`, 'um pouquinho acima', 'um semitom abaixo'],
  pCommaRev: 'Um pouquinho acima. (3/2)¹² ≈ 129,75, e sete oitavas são 2⁷ = 128. A sobra, 23,46 cents (quase um quarto de semitom), é a coma pitagórica. É por causa dela que o desenho abaixo vira uma espiral.',
  why: 'A lógica por baixo',
  notes: [
    '<b>1. Comprimento × frequência</b>: metade da corda vibra duas vezes mais rápido. A frequência é o inverso do comprimento: 2/3 do comprimento dão 3/2 da frequência, a 5ª.',
    '<b>2. Por que 12 quintas não fecham</b>: cada 5ª multiplica a frequência por 3/2, e cada 8ª por 2. Para 12 quintas caírem exatamente em 7 oitavas, 3¹² teria de ser igual a 2¹⁹. Mas uma potência de 3 é sempre ímpar e uma potência de 2 é par: nunca são iguais. Nenhuma pilha de quintas puras fecha em oitavas.',
    '<b>3. Temperamento igual</b>: divide a coma entre as 12 quintas. Cada 5ª fica com 700 cents em vez de 701,96, uns 2 cents menor, quase impossível de ouvir. Doze vezes 1,96 dá os 23,46 cents da coma: ela some, e o círculo fecha.',
    '<b>4. O que o pianista ganha</b>: com quintas iguais, Si♯ e Dó são a mesma tecla, e o mesmo piano toca nas 12 tonalidades sem reafinar. É por isso que, nas próximas aulas, o círculo das quintas é um círculo, e não uma espiral.',
    '<b>A lenda dos martelos</b>: conta-se que Pitágoras descobriu as razões ouvindo martelos de ferreiro. A história não se sustenta (o peso de um martelo não muda o som do jeito que a lenda diz), mas as razões de corda 2:1, 3:2 e 4:3 são reais e estão no centro da tradição pitagórica.',
    '<b>Quem calculou o temperamento igual</b>: cálculos precisos aparecem no fim do século XVI, com Zhu Zaiyu na China e, pouco depois, Simon Stevin na Europa. Ele só virou o padrão da afinação de pianos no século XIX.',
    '<b>“Bem temperado” não é “igual”</b>: O Cravo Bem Temperado, de Bach (1722), mostra que dá para tocar nas 24 tonalidades com uma boa afinação. Não se sabe ao certo qual ele usava; na época eram comuns temperamentos desiguais, em que cada tonalidade tinha um colorido próprio.',
  ],
  more: [4, 5, 6],
  recap: {
    oneLine: 'Doze quintas puras (3:2) não fecham o círculo porque nenhuma potência de 3 é igual a uma potência de 2: elas passam de sete oitavas por 23,46 cents, a coma pitagórica; o piano encolhe cada quinta uns 2 cents (temperamento igual) para o círculo fechar.',
    confusions: [
      '<b>Coma × semitom</b>: a coma (23,46 cents) é quase um quarto de semitom (100 cents). Pequena, mas o ouvido percebe o batimento.',
      '<b>Bem temperado × temperamento igual</b>: “bem temperado” quer dizer uma afinação que serve para todas as tonalidades; não necessariamente a igual.',
      '<b>5ª pura × 5ª do piano</b>: 701,96 × 700 cents. Uma de cada vez a diferença quase não se ouve; somada 12 vezes, vira a coma.',
    ],
    show: 'Suba de 5ª em 5ª a partir de Dó (Dó Sol Ré Lá Mi Si Fá♯ Dó♯ Sol♯ Ré♯ Lá♯ Mi♯ Si♯), descendo uma oitava quando faltar teclado. No piano você chega de novo na tecla do Dó: cada quinta já foi encolhida um pouquinho para isso. Com quintas puras, chegaria um pouco acima.',
  } as RecapText,
};

const en: typeof pt = {
  desc: [
    '<b>1.</b> In the harmonic series, the 5th (3:2) is the first new note inside a sound.',
    '<b>2.</b> Tradition says Pythagoras found it by measuring strings: half the string sounds an octave higher (2:1); two thirds sound a 5th higher (3:2).',
    '<b>3.</b> Stacking 5ths from C (G, D, A, E…) brings out the 12 notes one by one.',
    '<b>4.</b> The question of this lesson: after 12 pure fifths, do you land exactly on C again?',
  ],
  pString: (c: S) => `Half of the ${c} string sounds the octave. Before listening: what note do <b>two thirds</b> of the string sound? Tap it.`,
  pStringRev: (g: S) => `${g}. Two thirds of the length vibrate 3/2 as fast: the perfect 5th, 7 half steps up. It is harmonic 3 from the last lesson, brought down into the octave.`,
  pComma: (c: S) => `Start on ${c} and go up 12 pure fifths (3:2). Compared with the ${c} seven octaves up, where do you land?`,
  pCommaOpts: (c: S) => [`exactly on ${c}`, 'a little bit above', 'a half step below'],
  pCommaRev: 'A little bit above. (3/2)¹² ≈ 129.75, and seven octaves are 2⁷ = 128. The excess, 23.46 cents (almost a quarter of a half step), is the Pythagorean comma. That is why the drawing below turns into a spiral.',
  why: 'The logic underneath',
  notes: [
    '<b>1. Length vs frequency</b>: half the string vibrates twice as fast. Frequency is the inverse of length: 2/3 of the length gives 3/2 of the frequency, the 5th.',
    '<b>2. Why 12 fifths do not close</b>: each 5th multiplies the frequency by 3/2, and each octave by 2. For 12 fifths to land exactly on 7 octaves, 3¹² would have to equal 2¹⁹. But a power of 3 is always odd and a power of 2 is even: they are never equal. No stack of pure fifths closes in octaves.',
    '<b>3. Equal temperament</b>: it shares the comma among the 12 fifths. Each 5th gets 700 cents instead of 701.96, about 2 cents smaller, almost impossible to hear. Twelve times 1.96 makes the 23.46 cents of the comma: it vanishes and the circle closes.',
    '<b>4. What the pianist gains</b>: with equal fifths, B♯ and C are the same key, and the same piano plays in all 12 keys without retuning. That is why, in the next lessons, the circle of fifths is a circle and not a spiral.',
    '<b>The hammer legend</b>: the story goes that Pythagoras found the ratios by listening to blacksmiths’ hammers. The story does not hold up (a hammer’s weight does not change the sound the way the legend says), but the string ratios 2:1, 3:2 and 4:3 are real and central to the Pythagorean tradition.',
    '<b>Who computed equal temperament</b>: precise calculations appear in the late 16th century, by Zhu Zaiyu in China and, soon after, Simon Stevin in Europe. It only became the standard tuning for pianos in the 19th century.',
    '<b>“Well-tempered” is not “equal”</b>: Bach’s Well-Tempered Clavier (1722) shows that one tuning can serve all 24 keys. Which one he used is not known for sure; unequal temperaments, in which each key had its own color, were common at the time.',
  ],
  more: [4, 5, 6],
  recap: {
    oneLine: 'Twelve pure fifths (3:2) do not close the circle because no power of 3 equals a power of 2: they overshoot seven octaves by 23.46 cents, the Pythagorean comma; the piano shrinks each fifth by about 2 cents (equal temperament) so the circle closes.',
    confusions: [
      '<b>Comma vs half step</b>: the comma (23.46 cents) is almost a quarter of a half step (100 cents). Small, but the ear hears the beating.',
      '<b>Well-tempered vs equal temperament</b>: “well-tempered” means a tuning that works in every key; not necessarily the equal one.',
      '<b>Pure 5th vs piano 5th</b>: 701.96 vs 700 cents. One at a time the difference is barely audible; added up 12 times, it becomes the comma.',
    ],
    show: 'Go up in 5ths from C (C G D A E B F♯ C♯ G♯ D♯ A♯ E♯ B♯), dropping an octave when you run out of keys. On the piano you land on the C key again: each fifth has already been shrunk a little for that. With pure fifths you would land a bit higher.',
  } as RecapText,
};

export const extras = { pt, en };
