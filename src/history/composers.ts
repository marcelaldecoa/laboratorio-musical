import type { Composer } from './types';

/**
 * Composer cards, grouped by period in the UI (written by the history content pass).
 * Ordered by period, then by birth year. Brazilian thread marked with `brazil: true`.
 * Accuracy rules: years checked, cautious wording for anecdotes, no invented quotes.
 */
export const COMPOSERS: Composer[] = [
  // ───────────────────────── Medieval ─────────────────────────
  {
    id: 'guido', name: 'Guido d’Arezzo', born: 991, died: 1033, period: 'medieval',
    lessons: ['reading', 'formula'],
    pt: {
      why: 'Monge e professor italiano; as datas são aproximadas (nasceu por volta de 991 e morreu depois de 1033). A ele se atribui a pauta com linhas espaçadas por terças e o método de cantar com as sílabas ut, ré, mi, fá, sol, lá. É o avô da leitura de partitura que você usa hoje.',
      listen: ['Hino “Ut queant laxis” (canto gregoriano)', 'Micrologus (tratado, c. 1025)'],
      play: '',
      fact: 'As sílabas vêm do início de cada verso do hino a São João “Ut queant laxis”, em que cada verso começa uma nota acima. Mais tarde o “ut” virou “dó” na maior parte dos países, e o “si” foi acrescentado.',
    },
    en: {
      why: 'Italian monk and teacher; his dates are approximate (born around 991, died after 1033). He is credited with the staff whose lines are a third apart and with singing by the syllables ut, re, mi, fa, sol, la. He is the grandfather of the score reading you use today.',
      listen: ['Hymn “Ut queant laxis” (Gregorian chant)', 'Micrologus (treatise, c. 1025)'],
      play: '',
      fact: 'The syllables come from the start of each line of the hymn to Saint John “Ut queant laxis”, where each line begins one note higher. Later “ut” became “do” in most countries, and “si” (ti) was added.',
    },
  },
  {
    id: 'hildegard', name: 'Hildegard von Bingen', born: 1098, died: 1179, period: 'medieval',
    lessons: ['modes'],
    pt: {
      why: 'Abadessa alemã, escritora, cientista da natureza e compositora de cantos para uma só voz. Suas melodias usam os modos da Igreja com saltos amplos e frases longas, um ótimo exemplo de música modal antes do sistema maior/menor.',
      listen: ['Ordo Virtutum', 'O virtus Sapientiae', 'Columba aspexit', 'O frondens virga'],
      play: '',
      fact: 'Ordo Virtutum, uma peça moral cantada, costuma ser citada como um dos mais antigos dramas musicais conhecidos. Em 2012 Hildegard foi declarada Doutora da Igreja.',
    },
    en: {
      why: 'German abbess, writer, natural scientist and composer of chant for a single voice. Her melodies use the church modes with wide leaps and long phrases, a great example of modal music before the major/minor system.',
      listen: ['Ordo Virtutum', 'O virtus Sapientiae', 'Columba aspexit', 'O frondens virga'],
      play: '',
      fact: 'Ordo Virtutum, a sung morality play, is often cited as one of the oldest known musical dramas. In 2012 Hildegard was declared a Doctor of the Church.',
    },
  },
  {
    id: 'perotin', name: 'Pérotin', born: 1160, died: 1230, period: 'medieval',
    lessons: ['consonance', 'rhythm'],
    pt: {
      why: 'Mestre da escola de Notre-Dame de Paris, ativo por volta de 1200; as datas de nascimento e morte são só estimativas. Escreveu organa a quatro vozes, empilhando quintas, quartas e oitavas sobre notas longas do canto, com ritmos repetidos: as consonâncias perfeitas da aula de consonância, em som de catedral.',
      listen: ['Viderunt omnes', 'Sederunt principes', 'Alleluia Nativitas'],
      play: '',
      fact: 'Quase tudo o que se sabe sobre ele vem de um tratado escrito décadas depois por um estudante inglês anônimo, conhecido hoje como “Anônimo IV”.',
    },
    en: {
      why: 'Master of the Notre-Dame school in Paris, active around 1200; his birth and death dates are only estimates. He wrote four-voice organa, stacking fifths, fourths and octaves over long notes of the chant, with repeating rhythms: the perfect consonances of the consonance lesson, in cathedral sound.',
      listen: ['Viderunt omnes', 'Sederunt principes', 'Alleluia Nativitas'],
      play: '',
      fact: 'Almost everything known about him comes from a treatise written decades later by an anonymous English student, known today as “Anonymous IV”.',
    },
  },
  {
    id: 'machaut', name: 'Guillaume de Machaut', born: 1300, died: 1377, period: 'medieval',
    lessons: ['consonance'],
    pt: {
      why: 'Poeta e compositor francês da Ars Nova (nasceu por volta de 1300). Sua Missa de Notre Dame é um dos primeiros ciclos completos da missa escritos por um único compositor conhecido. Suas canções mostram a música medieval tardia passando de quintas vazias para terças e sextas, mais doces.',
      listen: ['Messe de Nostre Dame', 'Ma fin est mon commencement', 'Douce dame jolie'],
      play: '',
      fact: 'No rondó “Ma fin est mon commencement” (“Meu fim é meu começo”), uma voz canta a mesma melodia de outra de trás para frente: o título descreve a própria música.',
    },
    en: {
      why: 'French poet and composer of the Ars Nova (born around 1300). His Mass of Notre Dame is one of the first complete settings of the Mass by a single known composer. His songs show late medieval music moving from bare fifths toward sweeter thirds and sixths.',
      listen: ['Messe de Nostre Dame', 'Ma fin est mon commencement', 'Douce dame jolie'],
      play: '',
      fact: 'In the rondeau “Ma fin est mon commencement” (“My end is my beginning”), one voice sings another voice’s melody backwards: the title describes the music itself.',
    },
  },

  // ───────────────────────── Renaissance ─────────────────────────
  {
    id: 'josquin', name: 'Josquin des Prez', born: 1450, died: 1521, period: 'renaissance',
    lessons: ['consonance'],
    pt: {
      why: 'O compositor mais admirado de sua geração (o ano de nascimento é aproximado, por volta de 1450). Em sua música as vozes imitam umas às outras e se encaixam com cuidado nas consonâncias, base do contraponto que Bach levaria ao teclado dois séculos depois.',
      listen: ['Ave Maria… virgo serena', 'Missa Pange lingua', 'Mille regretz'],
      play: '',
      fact: 'Em 1502 o impressor Ottaviano Petrucci, em Veneza, publicou um livro só com missas de Josquin, um dos primeiros dedicados à obra de um único compositor.',
    },
    en: {
      why: 'The most admired composer of his generation (his birth year is approximate, around 1450). In his music the voices imitate one another and fit carefully on consonances, the basis of the counterpoint Bach would bring to the keyboard two centuries later.',
      listen: ['Ave Maria… virgo serena', 'Missa Pange lingua', 'Mille regretz'],
      play: '',
      fact: 'In 1502 the printer Ottaviano Petrucci, in Venice, published a book of masses by Josquin alone, one of the first devoted to the work of a single composer.',
    },
  },
  {
    id: 'cabezon', name: 'Antonio de Cabezón', born: 1510, died: 1566, period: 'renaissance',
    lessons: ['modes'],
    pt: {
      why: 'Organista da corte espanhola de Filipe II e um dos primeiros grandes compositores para teclado. Suas “diferencias” (variações sobre uma melodia ou um baixo) são antepassadas diretas das variações para piano.',
      listen: ['Diferencias sobre el canto del caballero', 'Diferencias sobre la Pavana italiana', 'Tientos'],
      play: '',
      fact: 'Ficou cego ainda criança. Suas obras foram publicadas depois de sua morte, em 1578, pelo filho Hernando, no livro “Obras de música para tecla, arpa y vihuela”.',
    },
    en: {
      why: 'Organist to the Spanish court of Philip II and one of the first great composers for keyboard. His “diferencias” (variations on a melody or a bass) are direct ancestors of piano variations.',
      listen: ['Diferencias sobre el canto del caballero', 'Diferencias sobre la Pavana italiana', 'Tientos'],
      play: '',
      fact: 'He became blind as a child. His works were published after his death, in 1578, by his son Hernando, in the book “Obras de música para tecla, arpa y vihuela”.',
    },
  },
  {
    id: 'palestrina', name: 'Giovanni Pierluigi da Palestrina', born: 1525, died: 1594, period: 'renaissance',
    lessons: ['consonance', 'chordtones'],
    pt: {
      why: 'Seu estilo de polifonia sacra, em que toda dissonância é preparada e resolvida por grau conjunto, virou modelo de ensino por séculos. As notas de passagem e as resoluções que você estuda nas aulas de melodia têm aqui uma de suas formas mais puras.',
      listen: ['Missa Papae Marcelli', 'Sicut cervus', 'Stabat Mater'],
      play: '',
      fact: 'Segundo uma lenda antiga, a Missa Papae Marcelli teria convencido o Concílio de Trento a não proibir a polifonia na igreja. Os historiadores consideram a história exagerada, mas ela ajudou a fazer de Palestrina um símbolo.',
    },
    en: {
      why: 'His style of sacred polyphony, in which every dissonance is prepared and resolved by step, became a teaching model for centuries. The passing tones and resolutions you study in the melody lessons appear here in one of their purest forms.',
      listen: ['Missa Papae Marcelli', 'Sicut cervus', 'Stabat Mater'],
      play: '',
      fact: 'According to an old legend, the Missa Papae Marcelli convinced the Council of Trent not to ban polyphony in church. Historians consider the story exaggerated, but it helped make Palestrina a symbol.',
    },
  },
  {
    id: 'byrd', name: 'William Byrd', born: 1540, died: 1623, period: 'renaissance',
    lessons: ['modes'],
    pt: {
      why: 'O maior compositor inglês de sua época (nasceu por volta de 1540) e um dos pais da música para teclado, escrita para o virginal, um pequeno cravo. Suas pavanas e variações mostram uma melodia vestida de formas diferentes, como se faz até hoje ao piano.',
      listen: ['The Bells', 'Missa a quatro vozes', 'Ave verum corpus', 'My Ladye Nevells Booke (coletânea)'],
      play: 'Pavana “The Earl of Salisbury”',
      fact: 'Em 1575 ele e Thomas Tallis receberam da rainha Elizabeth I o privilégio exclusivo de imprimir música na Inglaterra.',
    },
    en: {
      why: 'The greatest English composer of his time (born around 1540) and one of the fathers of keyboard music, written for the virginal, a small harpsichord. His pavans and variations show one melody dressed in different ways, as pianists still do today.',
      listen: ['The Bells', 'Mass for Four Voices', 'Ave verum corpus', 'My Ladye Nevells Booke (collection)'],
      play: 'Pavan “The Earl of Salisbury”',
      fact: 'In 1575 he and Thomas Tallis received from Queen Elizabeth I the exclusive right to print music in England.',
    },
  },

  // ───────────────────────── Baroque ─────────────────────────
  {
    id: 'monteverdi', name: 'Claudio Monteverdi', born: 1567, died: 1643, period: 'baroque',
    lessons: ['consonance'],
    pt: {
      why: 'Fez a ponte entre a Renascença e o Barroco: uma melodia acompanhada por um baixo e seus acordes, em vez de vozes iguais. Usou dissonâncias sem preparação para expressar o texto, um passo rumo à tensão e resolução da harmonia tonal.',
      listen: ['L’Orfeo', 'Vésperas da Bem-Aventurada Virgem (1610)', 'Lamento della ninfa', 'Cruda Amarilli'],
      play: '',
      fact: 'Por volta de 1600 o teórico Giovanni Maria Artusi criticou as dissonâncias de seus madrigais. Monteverdi respondeu defendendo uma “segunda prática”, em que o texto manda na harmonia.',
    },
    en: {
      why: 'He bridged the Renaissance and the Baroque: a melody accompanied by a bass and its chords, instead of equal voices. He used unprepared dissonances to express the text, a step toward the tension and resolution of tonal harmony.',
      listen: ['L’Orfeo', 'Vespers of the Blessed Virgin (1610)', 'Lamento della ninfa', 'Cruda Amarilli'],
      play: '',
      fact: 'Around 1600 the theorist Giovanni Maria Artusi criticized the dissonances in his madrigals. Monteverdi answered by defending a “second practice”, in which the text rules the harmony.',
    },
  },
  {
    id: 'pachelbel', name: 'Johann Pachelbel', born: 1653, died: 1706, period: 'baroque',
    lessons: ['prog'],
    pt: {
      why: 'Organista alemão cujo Cânone em Ré é construído sobre um baixo de oito notas que se repete o tempo todo. Essa sequência de acordes (I–V–vi–iii–IV–I–IV–V) é uma aula de progressão e de funções, e reaparece em muitas canções populares.',
      listen: ['Cânone em Ré', 'Chacona em Fá menor', 'Hexachordum Apollinis'],
      play: 'Cânone em Ré (arranjo simplificado para piano)',
      fact: 'Pachelbel foi professor de Johann Christoph Bach, o irmão mais velho de J. S. Bach, que depois ensinou o próprio Sebastian.',
    },
    en: {
      why: 'German organist whose Canon in D is built over an eight-note bass that repeats all the way through. That chord sequence (I–V–vi–iii–IV–I–IV–V) is a lesson in progression and function, and it returns in many pop songs.',
      listen: ['Canon in D', 'Chaconne in F minor', 'Hexachordum Apollinis'],
      play: 'Canon in D (simplified piano arrangement)',
      fact: 'Pachelbel taught Johann Christoph Bach, J. S. Bach’s older brother, who later taught Sebastian himself.',
    },
  },
  {
    id: 'couperin', name: 'François Couperin', born: 1668, died: 1733, period: 'baroque',
    lessons: ['fingering'],
    pt: {
      why: 'Cravista francês, autor de mais de 200 peças curtas com títulos poéticos. Seu livro “A arte de tocar o cravo” (1716) discute dedilhado e ornamentos, e é um dos primeiros manuais de técnica de teclado.',
      listen: ['Les Barricades mystérieuses', 'Le Tic-Toc-Choc', 'Les Moissonneurs'],
      play: 'Les Barricades mystérieuses (intermediário)',
      fact: 'É chamado de “Couperin, o Grande” para não ser confundido com os vários outros músicos da família, que por gerações foram organistas em Paris.',
    },
    en: {
      why: 'French harpsichordist, author of more than 200 short pieces with poetic titles. His book “The Art of Playing the Harpsichord” (1716) discusses fingering and ornaments, and is one of the first keyboard technique manuals.',
      listen: ['Les Barricades mystérieuses', 'Le Tic-Toc-Choc', 'Les Moissonneurs'],
      play: 'Les Barricades mystérieuses (intermediate)',
      fact: 'He is called “Couperin le Grand” to tell him apart from the many other musicians in his family, who were organists in Paris for generations.',
    },
  },
  {
    id: 'rameau', name: 'Jean-Philippe Rameau', born: 1683, died: 1764, period: 'baroque',
    lessons: ['field', 'func', 'inversions'],
    pt: {
      why: 'Compositor e o grande teórico da harmonia tonal. Em seu Tratado de Harmonia (1722) explicou que um acorde invertido continua sendo o mesmo acorde e que a música anda por um “baixo fundamental”, ideias por trás das aulas de campo harmônico, funções e inversões.',
      listen: ['Le Rappel des oiseaux', 'Tambourin', 'Les Sauvages', 'Hippolyte et Aricie'],
      play: 'Menuet en rondeau (Pièces de clavecin, 1724)',
      fact: 'Ficou famoso primeiro como teórico: sua primeira ópera, Hippolyte et Aricie, estreou em 1733, quando ele já tinha cerca de 50 anos.',
    },
    en: {
      why: 'Composer and the great theorist of tonal harmony. In his Treatise on Harmony (1722) he explained that an inverted chord is still the same chord and that music moves by a “fundamental bass”, ideas behind the lessons on diatonic chords, functions and inversions.',
      listen: ['Le Rappel des oiseaux', 'Tambourin', 'Les Sauvages', 'Hippolyte et Aricie'],
      play: 'Menuet en rondeau (Pièces de clavecin, 1724)',
      fact: 'He became famous first as a theorist: his first opera, Hippolyte et Aricie, premiered in 1733, when he was already about 50.',
    },
  },
  {
    id: 'bach', name: 'Johann Sebastian Bach', born: 1685, died: 1750, period: 'baroque',
    lessons: ['origin', 'repbach', 'inversions', 'modulation'],
    pt: {
      why: 'O mestre do contraponto: várias melodias independentes que, juntas, formam harmonias claras. O Cravo Bem Temperado (Livro I, 1722) tem um prelúdio e uma fuga em cada uma das 24 tonalidades, mostrando que uma afinação que sirva a todas abre o círculo das quintas inteiro.',
      listen: ['O Cravo Bem Temperado', 'Variações Goldberg', 'Concertos de Brandemburgo', 'Invenções a duas vozes'],
      play: 'Peças do Caderno de Anna Magdalena Bach (o famoso Minueto em Sol é hoje atribuído a Christian Petzold) ou o Prelúdio em Dó, BWV 846',
      fact: 'Em 1705, ainda jovem, viajou de Arnstadt até Lübeck, uns 400 km, para ouvir o organista Dieterich Buxtehude; segundo o relato tradicional, fez a viagem a pé.',
    },
    en: {
      why: 'The master of counterpoint: several independent melodies that together form clear harmonies. The Well-Tempered Clavier (Book I, 1722) has a prelude and fugue in each of the 24 keys, showing that a tuning that serves them all opens up the whole circle of fifths.',
      listen: ['The Well-Tempered Clavier', 'Goldberg Variations', 'Brandenburg Concertos', 'Two-Part Inventions'],
      play: 'Pieces from the Notebook for Anna Magdalena Bach (the famous Minuet in G is now attributed to Christian Petzold) or the Prelude in C, BWV 846',
      fact: 'In 1705, still young, he travelled from Arnstadt to Lübeck, about 400 km, to hear the organist Dieterich Buxtehude; according to the traditional account, he made the journey on foot.',
    },
  },
  {
    id: 'handel', name: 'George Frideric Handel', born: 1685, died: 1759, period: 'baroque',
    lessons: ['prog', 'form'],
    pt: {
      why: 'Alemão que fez carreira em Londres, mestre da ópera italiana e do oratório. Sua harmonia é direta, feita de cadências fortes que qualquer ouvinte sente chegar: ótima para treinar o ouvido em tônica, subdominante e dominante.',
      listen: ['O Messias (com o coro “Aleluia”)', 'Música Aquática', 'Música para os Reais Fogos de Artifício', '“O Ferreiro Harmonioso” (Ária com variações, Suíte em Mi)'],
      play: 'Sarabanda em Ré menor, HWV 437 (versão simplificada)',
      fact: 'Nasceu no mesmo ano que Bach, também na Alemanha central, mas os dois nunca se encontraram; conta-se que Bach tentou ao menos uma vez visitá-lo, sem sucesso.',
    },
    en: {
      why: 'A German who built his career in London, master of Italian opera and oratorio. His harmony is direct, made of strong cadences any listener can feel coming: great ear training for tonic, subdominant and dominant.',
      listen: ['Messiah (with the “Hallelujah” chorus)', 'Water Music', 'Music for the Royal Fireworks', '“The Harmonious Blacksmith” (Air and variations, Suite in E)'],
      play: 'Sarabande in D minor, HWV 437 (simplified version)',
      fact: 'He was born in the same year as Bach, also in central Germany, but the two never met; it is said that Bach tried at least once to visit him, without success.',
    },
  },
  {
    id: 'scarlatti', name: 'Domenico Scarlatti', born: 1685, died: 1757, period: 'baroque',
    lessons: ['form'],
    pt: {
      why: 'Napolitano que passou boa parte da vida na península Ibérica, a serviço da princesa portuguesa Maria Bárbara, em Lisboa e depois em Madri. Escreveu 555 sonatas para cravo, quase todas em forma binária (duas partes repetidas), cheias de cruzamentos de mãos e ecos do violão espanhol.',
      listen: ['Sonata em Ré menor, K. 9', 'Sonata em Mi maior, K. 380', 'Sonata em Ré menor, K. 141'],
      play: 'Sonata em Ré menor, K. 32 (“Aria”)',
      fact: 'Segundo o primeiro biógrafo de Handel, os dois disputaram em Roma uma competição amistosa de teclado: Scarlatti teria empatado no cravo e reconhecido a superioridade de Handel no órgão.',
    },
    en: {
      why: 'A Neapolitan who spent much of his life in the Iberian Peninsula, serving the Portuguese princess Maria Bárbara, in Lisbon and later in Madrid. He wrote 555 harpsichord sonatas, almost all in binary form (two repeated halves), full of hand-crossings and echoes of the Spanish guitar.',
      listen: ['Sonata in D minor, K. 9', 'Sonata in E major, K. 380', 'Sonata in D minor, K. 141'],
      play: 'Sonata in D minor, K. 32 (“Aria”)',
      fact: 'According to Handel’s first biographer, the two held a friendly keyboard contest in Rome: Scarlatti is said to have tied on the harpsichord and acknowledged Handel’s superiority on the organ.',
    },
  },

  // ───────────────────────── Classical ─────────────────────────
  {
    id: 'cpebach', name: 'Carl Philipp Emanuel Bach', born: 1714, died: 1788, period: 'classical',
    lessons: ['fingering'],
    pt: {
      why: 'Filho de J. S. Bach e ponte entre o Barroco e o Classicismo, com mudanças súbitas de humor ao teclado. Seu “Ensaio sobre a verdadeira arte de tocar teclado” (1753) ensinou dedilhado, com o polegar passando por baixo, e ornamentos a gerações, incluindo Haydn e Beethoven.',
      listen: ['Solfeggietto em Dó menor', 'Sonatas “prussianas”', 'Fantasia em Fá sustenido menor'],
      play: 'Solfeggietto em Dó menor (intermediário)',
      fact: 'Por quase trinta anos foi cravista da corte de Frederico, o Grande, rei da Prússia, que tocava flauta.',
    },
    en: {
      why: 'Son of J. S. Bach and a bridge between Baroque and Classical, with sudden changes of mood at the keyboard. His “Essay on the True Art of Playing Keyboard Instruments” (1753) taught fingering, with the thumb passing under, and ornaments to generations, including Haydn and Beethoven.',
      listen: ['Solfeggietto in C minor', '“Prussian” Sonatas', 'Fantasia in F-sharp minor'],
      play: 'Solfeggietto in C minor (intermediate)',
      fact: 'For almost thirty years he was harpsichordist at the court of Frederick the Great, King of Prussia, who played the flute.',
    },
  },
  {
    id: 'haydn', name: 'Joseph Haydn', born: 1732, died: 1809, period: 'classical',
    lessons: ['form', 'prog'],
    pt: {
      why: 'Chamado de pai da sinfonia e do quarteto de cordas, ajudou a fixar a forma sonata: frases claras, perguntas e respostas, modulação para a dominante e volta para casa. Suas sonatas para piano mostram cadências e períodos de forma muito transparente.',
      listen: ['Sinfonia nº 94 “Surpresa”', 'Quarteto “Imperador”, op. 76 nº 3', 'A Criação', 'Sonata para piano em Mi bemol, Hob. XVI:52'],
      play: 'Sonata em Dó maior, Hob. XVI:35, 1º movimento (intermediário)',
      fact: 'A melodia do segundo movimento do Quarteto “Imperador”, composta em 1797 como hino ao imperador austríaco, é hoje a melodia do hino nacional da Alemanha.',
    },
    en: {
      why: 'Called the father of the symphony and the string quartet, he helped settle sonata form: clear phrases, question and answer, modulation to the dominant and the return home. His piano sonatas show cadences and periods very transparently.',
      listen: ['Symphony No. 94 “Surprise”', '“Emperor” Quartet, Op. 76 No. 3', 'The Creation', 'Piano Sonata in E-flat, Hob. XVI:52'],
      play: 'Sonata in C major, Hob. XVI:35, 1st movement (intermediate)',
      fact: 'The melody of the “Emperor” Quartet’s second movement, written in 1797 as a hymn to the Austrian emperor, is today the tune of Germany’s national anthem.',
    },
  },
  {
    id: 'clementi', name: 'Muzio Clementi', born: 1752, died: 1832, period: 'classical',
    lessons: ['lefthand', 'fingering'],
    pt: {
      why: 'Pianista italiano radicado em Londres, um dos primeiros a escrever pensando no piano e não no cravo. Suas Sonatinas op. 36 são talvez as peças clássicas mais tocadas por alunos: escalas, arpejos e baixo de Alberti em forma de música.',
      listen: ['Sonatinas op. 36', 'Gradus ad Parnassum', 'Sonata em Sol menor, op. 34 nº 2'],
      play: 'Sonatina em Dó maior, op. 36 nº 1',
      fact: 'Em 1781, em Viena, participou de um duelo pianístico com Mozart diante do imperador José II. Mais tarde também fabricou pianos e publicou partituras em Londres.',
    },
    en: {
      why: 'An Italian pianist based in London, one of the first to write with the piano in mind rather than the harpsichord. His Sonatinas Op. 36 are perhaps the classical pieces students play most: scales, arpeggios and Alberti bass turned into music.',
      listen: ['Sonatinas Op. 36', 'Gradus ad Parnassum', 'Sonata in G minor, Op. 34 No. 2'],
      play: 'Sonatina in C major, Op. 36 No. 1',
      fact: 'In 1781, in Vienna, he took part in a piano contest with Mozart before Emperor Joseph II. Later he also built pianos and published music in London.',
    },
  },
  {
    id: 'mozart', name: 'Wolfgang Amadeus Mozart', born: 1756, died: 1791, period: 'classical',
    lessons: ['lefthand', 'form', 'chordtones'],
    pt: {
      why: 'Sua música é a forma clássica no estado mais claro: melodia cantável na mão direita e acompanhamento em acordes quebrados na esquerda, como o baixo de Alberti. Frases de 4 e 8 compassos, cadências nítidas e apojaturas expressivas fazem dele um ótimo laboratório de forma e de notas do acorde.',
      listen: ['Eine kleine Nachtmusik', 'Sonata K. 331 (com o “Rondó alla turca”)', 'Concerto para piano nº 21', 'Réquiem'],
      play: 'Sonata em Dó maior, K. 545, 1º movimento',
      fact: 'Seus primeiros minuetos foram compostos por volta dos 5 anos e anotados pelo pai, Leopold, no caderno de estudos da irmã, Nannerl.',
    },
    en: {
      why: 'His music is classical form at its clearest: a singing melody in the right hand and broken-chord accompaniment in the left, like the Alberti bass. Four- and eight-bar phrases, sharp cadences and expressive appoggiaturas make him a great laboratory for form and chord tones.',
      listen: ['Eine kleine Nachtmusik', 'Sonata K. 331 (with the “Rondo alla turca”)', 'Piano Concerto No. 21', 'Requiem'],
      play: 'Sonata in C major, K. 545, 1st movement',
      fact: 'His first minuets were composed at about age 5 and written down by his father, Leopold, in his sister Nannerl’s study notebook.',
    },
  },
  {
    id: 'josemauricio', name: 'José Maurício Nunes Garcia', born: 1767, died: 1830, period: 'classical', brazil: true,
    lessons: ['prog'],
    pt: {
      why: 'Padre e músico afro-brasileiro do Rio de Janeiro, mestre de capela da catedral e, com a chegada da corte portuguesa em 1808, da Capela Real. Escreveu música sacra no estilo clássico de Haydn e Mozart e um Método de Pianoforte (1821), um dos primeiros métodos de piano escritos no Brasil.',
      listen: ['Missa de Santa Cecília', 'Missa de Réquiem (1816)', 'Abertura em Ré'],
      play: 'Lições do Método de Pianoforte (1821)',
      fact: 'Em 1819 regeu no Rio de Janeiro a primeira apresentação conhecida no Brasil do Réquiem de Mozart.',
    },
    en: {
      why: 'An Afro-Brazilian priest and musician from Rio de Janeiro, chapel master of the cathedral and, after the Portuguese court arrived in 1808, of the Royal Chapel. He wrote sacred music in the classical style of Haydn and Mozart and a Pianoforte Method (1821), one of the first piano methods written in Brazil.',
      listen: ['Missa de Santa Cecília', 'Requiem Mass (1816)', 'Overture in D'],
      play: 'Lessons from the Pianoforte Method (1821)',
      fact: 'In 1819 he conducted in Rio de Janeiro the first known performance in Brazil of Mozart’s Requiem.',
    },
  },
  {
    id: 'beethoven', name: 'Ludwig van Beethoven', born: 1770, died: 1827, period: 'classical',
    lessons: ['repode', 'repelise', 'secdom', 'modulation'],
    pt: {
      why: 'A ponte entre o Classicismo e o Romantismo: pegou as formas de Haydn e Mozart e as esticou com modulações ousadas, motivos curtos desenvolvidos ao máximo e contrastes fortes. Escreveu para um piano que crescia em extensão e volume, e suas 32 sonatas são um pilar do repertório.',
      listen: ['Sinfonia nº 5', 'Sinfonia nº 9 (com a “Ode à Alegria”)', 'Sonata “ao Luar”, op. 27 nº 2', 'Sonata “Patética”, op. 13'],
      play: 'Für Elise (parte A) ou o tema da “Ode à Alegria”',
      fact: 'Começou a perder a audição por volta dos 30 anos e continuou compondo; nos últimos anos conversava por escrito, em cadernos que em boa parte se conservaram.',
    },
    en: {
      why: 'The bridge between Classical and Romantic: he took the forms of Haydn and Mozart and stretched them with bold modulations, short motifs developed to the limit and strong contrasts. He wrote for a piano that was growing in range and volume, and his 32 sonatas are a pillar of the repertoire.',
      listen: ['Symphony No. 5', 'Symphony No. 9 (with the “Ode to Joy”)', '“Moonlight” Sonata, Op. 27 No. 2', '“Pathétique” Sonata, Op. 13'],
      play: 'Für Elise (A section) or the “Ode to Joy” theme',
      fact: 'He began losing his hearing around age 30 and kept composing; in his last years he conversed in writing, in notebooks that have largely survived.',
    },
  },
  {
    id: 'czerny', name: 'Carl Czerny', born: 1791, died: 1857, period: 'classical',
    lessons: ['fingering'],
    pt: {
      why: 'Aluno de Beethoven e professor de Liszt, é o elo entre as duas gerações. Seus estudos transformam problemas técnicos (escalas, passagem do polegar, mãos alternadas) em peças curtas: a técnica da aula de dedilhado, treinada como música.',
      listen: ['A Escola da Velocidade, op. 299', 'A Arte de Dar Destreza aos Dedos, op. 740', 'Variações sobre “La Ricordanza”, op. 33'],
      play: 'Estudos op. 599 (para principiantes)',
      fact: 'Começou a estudar com Beethoven por volta dos 10 anos e, adulto, ensinou o menino Liszt em Viena.',
    },
    en: {
      why: 'A pupil of Beethoven and teacher of Liszt, he links the two generations. His studies turn technical problems (scales, thumb-under, alternating hands) into short pieces: the technique of the fingering lesson, practised as music.',
      listen: ['The School of Velocity, Op. 299', 'The Art of Finger Dexterity, Op. 740', 'Variations on “La Ricordanza”, Op. 33'],
      play: 'Studies Op. 599 (for beginners)',
      fact: 'He began studying with Beethoven at about age 10 and, as an adult, taught the young Liszt in Vienna.',
    },
  },

  // ───────────────────────── Romantic ─────────────────────────
  {
    id: 'schubert', name: 'Franz Schubert', born: 1797, died: 1828, period: 'romantic',
    lessons: ['borrow', 'modulation'],
    pt: {
      why: 'Mestre da canção (lied), escreveu mais de 600. Adorava alternar maior e menor sobre a mesma tônica e saltar para tonalidades a uma terça de distância, efeitos de luz e sombra que você vê nas aulas de empréstimo modal e modulação.',
      listen: ['Ave Maria (Ellens dritter Gesang)', 'Improvisos, D. 899', 'A Truta (quinteto)', 'Viagem de Inverno (Winterreise)'],
      play: 'Valsas e Écossaises (peças curtas, por exemplo D. 145)',
      fact: 'Morreu aos 31 anos. Em vida fez um único concerto público dedicado só à sua música, em março de 1828.',
    },
    en: {
      why: 'A master of song (lied), he wrote more than 600. He loved switching between major and minor on the same tonic and jumping to keys a third away, light-and-shadow effects you see in the lessons on modal borrowing and modulation.',
      listen: ['Ave Maria (Ellens dritter Gesang)', 'Impromptus, D. 899', '“Trout” Quintet', 'Winterreise'],
      play: 'Waltzes and Écossaises (short pieces, e.g. D. 145)',
      fact: 'He died at 31. In his lifetime he gave only one public concert devoted entirely to his music, in March 1828.',
    },
  },
  {
    id: 'chopin', name: 'Frédéric Chopin', born: 1810, died: 1849, period: 'romantic',
    lessons: ['seventh', 'secdom', 'prog'],
    pt: {
      why: 'O poeta do piano: quase tudo o que escreveu é para o instrumento. Usou o pedal para misturar harmonias, o rubato (estica e encolhe o tempo) para cantar, e uma harmonia cromática em que as vozes descem por semitom, como no Prelúdio em Mi menor, uma aula viva de condução de vozes.',
      listen: ['Noturno op. 9 nº 2', 'Balada nº 1', 'Fantasia-Improviso', 'Polonaise “Heroica”, op. 53'],
      play: 'Prelúdio em Mi menor, op. 28 nº 4',
      fact: 'Morreu em Paris, mas, a pedido dele, seu coração foi levado pela irmã para Varsóvia; hoje está numa coluna da Igreja da Santa Cruz.',
    },
    en: {
      why: 'The poet of the piano: almost everything he wrote is for the instrument. He used the pedal to blend harmonies, rubato (stretching and squeezing time) to sing, and a chromatic harmony in which voices slide down by half step, as in the Prelude in E minor, a living lesson in voice leading.',
      listen: ['Nocturne Op. 9 No. 2', 'Ballade No. 1', 'Fantaisie-Impromptu', '“Heroic” Polonaise, Op. 53'],
      play: 'Prelude in E minor, Op. 28 No. 4',
      fact: 'He died in Paris, but at his request his heart was taken by his sister to Warsaw; today it rests in a pillar of the Holy Cross Church.',
    },
  },
  {
    id: 'schumann', name: 'Robert Schumann', born: 1810, died: 1856, period: 'romantic',
    lessons: ['form', 'rhythm2'],
    pt: {
      why: 'Compositor de ciclos de peças curtas para piano, cada uma um pequeno retrato. Seu Álbum para a Juventude (1848), escrito para as filhas, é uma das melhores portas de entrada do repertório romântico: frases claras, síncopes e harmonias que já soam românticas.',
      listen: ['Cenas Infantis (com “Träumerei”)', 'Carnaval, op. 9', 'Concerto para piano em Lá menor', 'Dichterliebe'],
      play: 'Álbum para a Juventude, op. 68 (por exemplo “Melodia” e “O Alegre Camponês”)',
      fact: 'Queria ser pianista concertista, mas uma lesão na mão direita encerrou esse plano; ele então se dedicou à composição e à crítica musical.',
    },
    en: {
      why: 'A composer of cycles of short piano pieces, each a little portrait. His Album for the Young (1848), written for his daughters, is one of the best doors into Romantic repertoire: clear phrases, syncopations and harmonies that already sound Romantic.',
      listen: ['Scenes from Childhood (with “Träumerei”)', 'Carnaval, Op. 9', 'Piano Concerto in A minor', 'Dichterliebe'],
      play: 'Album for the Young, Op. 68 (e.g. “Melody” and “The Happy Farmer”)',
      fact: 'He wanted to be a concert pianist, but an injury to his right hand ended that plan; he then devoted himself to composition and music criticism.',
    },
  },
  {
    id: 'liszt', name: 'Franz Liszt', born: 1811, died: 1886, period: 'romantic',
    lessons: ['sym', 'modulation'],
    pt: {
      why: 'O maior virtuose do século XIX, que levou a técnica do piano ao limite e transcreveu óperas e sinfonias para o teclado. Nas obras tardias experimentou acordes aumentados e escalas de tons inteiros, abrindo caminho para Debussy e para a música do século XX.',
      listen: ['Liebestraum nº 3', 'Rapsódia Húngara nº 2', 'La Campanella', 'Sonata em Si menor'],
      play: 'Consolação nº 3 (intermediário)',
      fact: 'Costuma ser citado como o criador do recital de piano solo: em 1840, em Londres, seus concertos foram anunciados como “recitals”.',
    },
    en: {
      why: 'The greatest virtuoso of the 19th century, who took piano technique to its limit and transcribed operas and symphonies for the keyboard. In his late works he experimented with augmented chords and whole-tone scales, opening the way for Debussy and 20th-century music.',
      listen: ['Liebestraum No. 3', 'Hungarian Rhapsody No. 2', 'La Campanella', 'Sonata in B minor'],
      play: 'Consolation No. 3 (intermediate)',
      fact: 'He is often credited with creating the solo piano recital: in 1840, in London, his concerts were advertised as “recitals”.',
    },
  },
  {
    id: 'claraschumann', name: 'Clara Schumann', born: 1819, died: 1896, period: 'romantic',
    pt: {
      why: 'Uma das maiores pianistas do século XIX, com carreira de mais de 60 anos, e compositora. Ajudou a fixar o repertório de concerto (Beethoven, Chopin, Schumann, Brahms) e a ideia de que o intérprete serve à obra.',
      listen: ['Trio para piano em Sol menor, op. 17', 'Concerto para piano em Lá menor, op. 7', 'Três Romances, op. 22 (violino e piano)', 'Três Romances, op. 11 (piano)'],
      play: '',
      fact: 'Começou a se apresentar ainda criança, ensinada pelo pai, Friedrich Wieck. Seu retrato estampou a nota de 100 marcos alemães, de 1989 até a chegada do euro.',
    },
    en: {
      why: 'One of the greatest pianists of the 19th century, with a career of more than 60 years, and a composer. She helped establish the concert repertoire (Beethoven, Chopin, Schumann, Brahms) and the idea that the performer serves the work.',
      listen: ['Piano Trio in G minor, Op. 17', 'Piano Concerto in A minor, Op. 7', 'Three Romances, Op. 22 (violin and piano)', 'Three Romances, Op. 11 (piano)'],
      play: '',
      fact: 'She began performing as a child, taught by her father, Friedrich Wieck. Her portrait appeared on the German 100-mark note from 1989 until the euro arrived.',
    },
  },
  {
    id: 'brahms', name: 'Johannes Brahms', born: 1833, died: 1897, period: 'romantic',
    lessons: ['rhythm2', 'borrow'],
    pt: {
      why: 'Uniu a forma clássica à harmonia romântica. Gostava de deslocar o acento do compasso (síncopes, grupos de 2 dentro de 3) e de misturar maior e menor; seus Intermezzi tardios são harmonia densa num espaço pequeno.',
      listen: ['Canção de Ninar (Wiegenlied), op. 49 nº 4', 'Danças Húngaras', 'Intermezzo op. 118 nº 2', 'Um Réquiem Alemão'],
      play: 'Valsa em Lá bemol, op. 39 nº 15 (Brahms publicou ele mesmo uma versão simplificada)',
      fact: 'Levou cerca de duas décadas para concluir a primeira sinfonia, estreada em 1876; conta-se que sentia o peso da comparação com Beethoven.',
    },
    en: {
      why: 'He joined classical form to Romantic harmony. He liked shifting the accent of the bar (syncopations, groups of 2 inside 3) and mixing major and minor; his late Intermezzi are dense harmony in a small space.',
      listen: ['Lullaby (Wiegenlied), Op. 49 No. 4', 'Hungarian Dances', 'Intermezzo Op. 118 No. 2', 'A German Requiem'],
      play: 'Waltz in A-flat, Op. 39 No. 15 (Brahms himself published a simplified version)',
      fact: 'It took him about two decades to finish his first symphony, premiered in 1876; it is said he felt the weight of comparison with Beethoven.',
    },
  },
  {
    id: 'tchaikovsky', name: 'Piotr Ilitch Tchaikovsky', born: 1840, died: 1893, period: 'romantic',
    lessons: ['minor', 'form'],
    pt: {
      why: 'Mestre da melodia e do balé. Seu Álbum para a Juventude, op. 39 (1878), traz 24 peças curtas em maior e menor, muitas com melodias folclóricas, ótimas para sentir a diferença de cor entre os dois modos.',
      listen: ['O Quebra-Nozes', 'O Lago dos Cisnes', 'Concerto para piano nº 1', 'As Estações, op. 37a'],
      play: 'Álbum para a Juventude, op. 39 (por exemplo “Doença da boneca” e “Canção italiana”)',
      fact: 'Em 1891 foi convidado a reger na semana de inauguração do Carnegie Hall, em Nova York.',
    },
    en: {
      why: 'A master of melody and ballet. His Album for the Young, Op. 39 (1878), has 24 short pieces in major and minor, many with folk tunes, great for feeling the difference in color between the two modes.',
      listen: ['The Nutcracker', 'Swan Lake', 'Piano Concerto No. 1', 'The Seasons, Op. 37a'],
      play: 'Album for the Young, Op. 39 (e.g. “The Sick Doll” and “Italian Song”)',
      fact: 'In 1891 he was invited to conduct during the opening week of Carnegie Hall in New York.',
    },
  },
  {
    id: 'grieg', name: 'Edvard Grieg', born: 1843, died: 1907, period: 'romantic',
    lessons: ['penta', 'modes'],
    pt: {
      why: 'Norueguês que levou a música folclórica de seu país para o piano: bordões no baixo, quartas aumentadas e melodias pentatônicas. Suas 66 Peças Líricas são miniaturas acessíveis e cheias de cor.',
      listen: ['Peer Gynt (“A Manhã”, “Na Gruta do Rei da Montanha”)', 'Concerto para piano em Lá menor', 'Peças Líricas'],
      play: 'Arietta, op. 12 nº 1 (Peças Líricas)',
      fact: '“A Manhã”, a música que muita gente associa aos fiordes, descreve na peça de Ibsen um nascer do sol no deserto do Marrocos.',
    },
    en: {
      why: 'A Norwegian who brought his country’s folk music to the piano: drones in the bass, raised fourths and pentatonic melodies. His 66 Lyric Pieces are accessible, colorful miniatures.',
      listen: ['Peer Gynt (“Morning Mood”, “In the Hall of the Mountain King”)', 'Piano Concerto in A minor', 'Lyric Pieces'],
      play: 'Arietta, Op. 12 No. 1 (Lyric Pieces)',
      fact: '“Morning Mood”, the music many people link to fjords, depicts in Ibsen’s play a sunrise in the Moroccan desert.',
    },
  },
  {
    id: 'chiquinha', name: 'Chiquinha Gonzaga', born: 1847, died: 1935, period: 'romantic', brazil: true,
    lessons: ['rhythm2'],
    pt: {
      why: 'Pianista e compositora carioca que misturou as danças de salão europeias (polca, valsa) com o ritmo sincopado afro-brasileiro, abrindo caminho para o maxixe e o choro. Suas polcas são um ótimo treino de síncope na mão direita sobre um baixo firme.',
      listen: ['Ó Abre Alas', 'Atraente', 'Corta-Jaca (Gaúcho)', 'Lua Branca'],
      play: 'Atraente (polca, versão simplificada)',
      fact: 'É considerada a primeira mulher a reger uma orquestra no Brasil. O Dia Nacional da Música Popular Brasileira, 17 de outubro, é a data do seu nascimento.',
    },
    en: {
      why: 'A pianist and composer from Rio who mixed European salon dances (polka, waltz) with Afro-Brazilian syncopated rhythm, paving the way for maxixe and choro. Her polkas are great practice for right-hand syncopation over a steady bass.',
      listen: ['Ó Abre Alas', 'Atraente', 'Corta-Jaca (Gaúcho)', 'Lua Branca'],
      play: 'Atraente (polka, simplified version)',
      fact: 'She is considered the first woman to conduct an orchestra in Brazil. Brazil’s National Popular Music Day, 17 October, is her birthday.',
    },
  },
  {
    id: 'nepomuceno', name: 'Alberto Nepomuceno', born: 1864, died: 1920, period: 'romantic', brazil: true,
    lessons: ['rhythm2'],
    pt: {
      why: 'Cearense formado na Europa, é um dos pais do nacionalismo musical brasileiro: levou ritmos e temas populares para a música de concerto, como no “Batuque” da Série Brasileira. Também compôs para piano peças como a Galhofeira.',
      listen: ['Série Brasileira (com o “Batuque”)', 'Galhofeira', 'Sinfonia em Sol menor'],
      play: '',
      fact: 'Na época muitos achavam que o português não servia para o canto erudito; ele defendeu e compôs canções de câmara na língua do país.',
    },
    en: {
      why: 'Born in Ceará and trained in Europe, he is one of the fathers of Brazilian musical nationalism: he brought popular rhythms and themes into concert music, as in the “Batuque” of the Série Brasileira. He also wrote piano pieces such as Galhofeira.',
      listen: ['Série Brasileira (with the “Batuque”)', 'Galhofeira', 'Symphony in G minor'],
      play: '',
      fact: 'At the time many believed Portuguese was unsuitable for art song; he defended it and wrote art songs in his country’s language.',
    },
  },

  // ───────────────────────── Impressionism and turn of the century ─────────────────────────
  {
    id: 'faure', name: 'Gabriel Fauré', born: 1845, died: 1924, period: 'impressionism',
    lessons: ['modes', 'modulation'],
    pt: {
      why: 'Sua harmonia desliza por tonalidades vizinhas com suavidade e usa cores modais, uma ponte entre o Romantismo e Debussy. Foi diretor do Conservatório de Paris e professor de Ravel.',
      listen: ['Réquiem', 'Pavane', 'Après un rêve', 'Suíte Dolly (piano a quatro mãos)'],
      play: 'Berceuse da Suíte Dolly (piano a quatro mãos)',
      fact: 'A Suíte Dolly foi escrita para a menina Hélène Bardac, a “Dolly”; anos depois a mãe dela, Emma Bardac, casou-se com Debussy.',
    },
    en: {
      why: 'His harmony glides through neighboring keys smoothly and uses modal colors, a bridge between Romanticism and Debussy. He was director of the Paris Conservatoire and Ravel’s teacher.',
      listen: ['Requiem', 'Pavane', 'Après un rêve', 'Dolly Suite (piano four hands)'],
      play: 'Berceuse from the Dolly Suite (piano four hands)',
      fact: 'The Dolly Suite was written for the young Hélène Bardac, “Dolly”; years later her mother, Emma Bardac, married Debussy.',
    },
  },
  {
    id: 'debussy', name: 'Claude Debussy', born: 1862, died: 1918, period: 'impressionism',
    lessons: ['sym', 'penta', 'modes'],
    pt: {
      why: 'Libertou os acordes da obrigação de resolver: usou a escala de tons inteiros, a pentatônica, os modos antigos e acordes paralelos como cores. Pensava o pedal e a ressonância do piano como parte da harmonia.',
      listen: ['Clair de lune', 'Prelúdio à Tarde de um Fauno', 'Voiles (Prelúdios, Livro I)', 'A Catedral Submersa'],
      play: '“The Little Shepherd” (Children’s Corner)',
      fact: 'Na Exposição Universal de Paris de 1889 ouviu um gamelão javanês, experiência que costuma ser citada como uma influência em sua música.',
    },
    en: {
      why: 'He freed chords from the duty to resolve: he used the whole-tone scale, the pentatonic, old modes and parallel chords as colors. He treated the pedal and the piano’s resonance as part of the harmony.',
      listen: ['Clair de lune', 'Prelude to the Afternoon of a Faun', 'Voiles (Preludes, Book I)', 'The Sunken Cathedral'],
      play: '“The Little Shepherd” (Children’s Corner)',
      fact: 'At the 1889 Paris World’s Fair he heard a Javanese gamelan, an experience often cited as an influence on his music.',
    },
  },
  {
    id: 'nazareth', name: 'Ernesto Nazareth', born: 1863, died: 1934, period: 'impressionism', brazil: true,
    lessons: ['rhythm2', 'lefthand'],
    pt: {
      why: 'Pianista carioca que chamava suas peças de “tangos brasileiros”: o choro escrito para piano, com baixo que anda como um violão de sete cordas e melodia cheia de síncopes. É a ponte entre a valsa e a polca de salão e a música popular brasileira.',
      listen: ['Odeon', 'Brejeiro', 'Apanhei-te, Cavaquinho', 'Escorregando'],
      play: 'Odeon (arranjo simplificado)',
      fact: 'Tocou por anos na sala de espera do Cinema Odeon, no Rio de Janeiro, e deu ao cinema o nome de um de seus tangos mais famosos.',
    },
    en: {
      why: 'A pianist from Rio who called his pieces “Brazilian tangos”: choro written for piano, with a bass that moves like a seven-string guitar and a melody full of syncopation. He bridges the salon waltz and polka and Brazilian popular music.',
      listen: ['Odeon', 'Brejeiro', 'Apanhei-te, Cavaquinho', 'Escorregando'],
      play: 'Odeon (simplified arrangement)',
      fact: 'For years he played in the waiting room of the Odeon cinema in Rio de Janeiro, and named one of his most famous tangos after it.',
    },
  },
  {
    id: 'satie', name: 'Erik Satie', born: 1866, died: 1925, period: 'impressionism',
    lessons: ['modes', 'seventh'],
    pt: {
      why: 'Excêntrico e minimalista antes do tempo: na Gymnopédie nº 1 dois acordes de sétima maior se alternam calmamente sob uma melodia modal. Mostra que pouca coisa, bem escolhida, já é música.',
      listen: ['Gymnopédie nº 1', 'Gnossienne nº 1', 'Je te veux', 'Vexations'],
      play: 'Gymnopédie nº 1',
      fact: 'Na partitura de Vexations há uma indicação sugerindo tocá-la 840 vezes seguidas; em 1963 John Cage organizou em Nova York uma apresentação completa, que durou cerca de 18 horas.',
    },
    en: {
      why: 'Eccentric and minimalist ahead of his time: in Gymnopédie No. 1 two major seventh chords alternate calmly under a modal melody. He shows that very little, well chosen, is already music.',
      listen: ['Gymnopédie No. 1', 'Gnossienne No. 1', 'Je te veux', 'Vexations'],
      play: 'Gymnopédie No. 1',
      fact: 'The score of Vexations has a note suggesting it be played 840 times in a row; in 1963 John Cage organized a complete performance in New York that lasted about 18 hours.',
    },
  },
  {
    id: 'ravel', name: 'Maurice Ravel', born: 1875, died: 1937, period: 'impressionism',
    lessons: ['extensions', 'seventh'],
    pt: {
      why: 'Orquestrador perfeccionista, usou acordes de sétima, nona e décima primeira com uma precisão que o jazz depois adotou. Também olhou para trás: Le Tombeau de Couperin homenageia o cravo francês do Barroco.',
      listen: ['Boléro', 'Pavane pour une infante défunte', 'Le Tombeau de Couperin', 'Concerto para a mão esquerda'],
      play: 'Pavana da Bela Adormecida (Ma mère l’Oye, piano a quatro mãos)',
      fact: 'O Concerto para a mão esquerda foi escrito para o pianista Paul Wittgenstein, que perdeu o braço direito na Primeira Guerra Mundial.',
    },
    en: {
      why: 'A perfectionist orchestrator, he used seventh, ninth and eleventh chords with a precision that jazz later adopted. He also looked back: Le Tombeau de Couperin pays tribute to the French Baroque harpsichord.',
      listen: ['Boléro', 'Pavane for a Dead Princess', 'Le Tombeau de Couperin', 'Piano Concerto for the Left Hand'],
      play: 'Pavane of Sleeping Beauty (Ma mère l’Oye, piano four hands)',
      fact: 'The Concerto for the Left Hand was written for the pianist Paul Wittgenstein, who lost his right arm in World War I.',
    },
  },

  // ───────────────────────── Modern (20th century) ─────────────────────────
  {
    id: 'schoenberg', name: 'Arnold Schoenberg', born: 1874, died: 1951, period: 'modern',
    lessons: ['sym'],
    pt: {
      why: 'Levou o cromatismo romântico até o fim: abandonou a tônica e depois criou o método dodecafônico, em que as 12 notas da escala cromática são ordenadas numa série. É o ponto em que a teoria deste app (tonalidade, funções) deixa de valer, e entender isso ajuda a ver por que ela funciona.',
      listen: ['Noite Transfigurada (Verklärte Nacht)', 'Pierrot lunaire', 'Seis Pequenas Peças para piano, op. 19', 'Suíte para piano, op. 25'],
      play: 'Seis Pequenas Peças, op. 19 nº 2 (muito curta)',
      fact: 'Conta-se que tinha medo do número 13. Morreu numa sexta-feira, 13 de julho de 1951.',
    },
    en: {
      why: 'He took Romantic chromaticism to its end: he abandoned the tonic and later created the twelve-tone method, in which the 12 notes of the chromatic scale are ordered into a row. It is the point where this app’s theory (keys, functions) stops applying, and understanding that helps you see why it works.',
      listen: ['Transfigured Night (Verklärte Nacht)', 'Pierrot lunaire', 'Six Little Piano Pieces, Op. 19', 'Suite for Piano, Op. 25'],
      play: 'Six Little Pieces, Op. 19 No. 2 (very short)',
      fact: 'He is said to have feared the number 13. He died on Friday, 13 July 1951.',
    },
  },
  {
    id: 'bartok', name: 'Béla Bartók', born: 1881, died: 1945, period: 'modern',
    lessons: ['modes', 'rhythm', 'sym'],
    pt: {
      why: 'Pesquisou a música camponesa da Hungria e dos países vizinhos e tirou dela modos, escalas incomuns e compassos irregulares. Seu Mikrokosmos, 153 peças em seis volumes, vai do primeiro dia ao piano até o nível de concerto, ensinando modos, ritmos e dissonâncias passo a passo.',
      listen: ['Concerto para Orquestra', 'Allegro barbaro', 'Danças Folclóricas Romenas', 'Música para cordas, percussão e celesta'],
      play: 'Mikrokosmos, volumes 1 e 2 (ou Para Crianças)',
      fact: 'Com Zoltán Kodály gravou milhares de canções folclóricas em cilindros de fonógrafo, viajando de aldeia em aldeia.',
    },
    en: {
      why: 'He researched the peasant music of Hungary and neighboring countries and drew from it modes, unusual scales and irregular meters. His Mikrokosmos, 153 pieces in six volumes, goes from the first day at the piano to concert level, teaching modes, rhythms and dissonance step by step.',
      listen: ['Concerto for Orchestra', 'Allegro barbaro', 'Romanian Folk Dances', 'Music for Strings, Percussion and Celesta'],
      play: 'Mikrokosmos, volumes 1 and 2 (or For Children)',
      fact: 'With Zoltán Kodály he recorded thousands of folk songs on phonograph cylinders, travelling from village to village.',
    },
  },
  {
    id: 'stravinsky', name: 'Igor Stravinsky', born: 1882, died: 1971, period: 'modern',
    lessons: ['rhythm', 'tri'],
    pt: {
      why: 'Revolucionou o ritmo: acentos deslocados, compassos que mudam a cada passo, blocos sonoros sobrepostos. O “acorde de Petrushka” soma dois acordes maiores a um trítono de distância, um exemplo direto da aula do trítono.',
      listen: ['A Sagração da Primavera', 'O Pássaro de Fogo', 'Petrushka', 'Sinfonia dos Salmos'],
      play: 'Les cinq doigts (oito peças fáceis para cinco dedos, 1921)',
      fact: 'A estreia de A Sagração da Primavera, em Paris, em 29 de maio de 1913, provocou um tumulto famoso na plateia.',
    },
    en: {
      why: 'He revolutionized rhythm: displaced accents, meters that change at every step, overlapping blocks of sound. The “Petrushka chord” combines two major chords a tritone apart, a direct example from the tritone lesson.',
      listen: ['The Rite of Spring', 'The Firebird', 'Petrushka', 'Symphony of Psalms'],
      play: 'Les cinq doigts (eight easy five-finger pieces, 1921)',
      fact: 'The premiere of The Rite of Spring, in Paris on 29 May 1913, caused a famous uproar in the audience.',
    },
  },
  {
    id: 'villalobos', name: 'Heitor Villa-Lobos', born: 1887, died: 1959, period: 'modern', brazil: true,
    lessons: ['modes', 'rhythm2'],
    pt: {
      why: 'O compositor brasileiro mais conhecido no mundo. Nas Bachianas Brasileiras uniu o contraponto de Bach a melodias e ritmos do Brasil; para o piano escreveu A Prole do Bebê e o Guia Prático, sobre cantigas de roda.',
      listen: ['Bachianas Brasileiras nº 5 (Ária)', 'O Trenzinho do Caipira (Bachianas nº 2)', 'Choros nº 1', 'A Prole do Bebê'],
      play: 'Cirandinhas ou peças do Guia Prático (sobre cantigas de roda)',
      fact: 'Com o canto orfeônico nas escolas, regeu concentrações corais com dezenas de milhares de estudantes em estádios do Rio de Janeiro nos anos 1930 e 1940.',
    },
    en: {
      why: 'The best-known Brazilian composer in the world. In the Bachianas Brasileiras he joined Bach’s counterpoint to Brazilian melodies and rhythms; for piano he wrote A Prole do Bebê and the Guia Prático, based on children’s songs.',
      listen: ['Bachianas Brasileiras No. 5 (Aria)', '“The Little Train of the Caipira” (Bachianas No. 2)', 'Choros No. 1', 'A Prole do Bebê'],
      play: 'Cirandinhas or pieces from the Guia Prático (on children’s songs)',
      fact: 'Through choral singing in schools, he conducted mass choral gatherings of tens of thousands of students in Rio de Janeiro stadiums in the 1930s and 1940s.',
    },
  },
  {
    id: 'prokofiev', name: 'Sergei Prokofiev', born: 1891, died: 1953, period: 'modern',
    lessons: ['modulation'],
    pt: {
      why: 'Sua marca são melodias claras que, de repente, escorregam para uma tonalidade distante e voltam como se nada tivesse acontecido. A Música para Crianças, op. 65, mostra esse humor em peças que um aluno consegue tocar.',
      listen: ['Pedro e o Lobo', 'Romeu e Julieta', 'Concerto para piano nº 3', 'Sinfonia Clássica'],
      play: 'Música para Crianças, op. 65 (por exemplo “Manhã”)',
      fact: 'Morreu em 5 de março de 1953, o mesmo dia que Stálin; a notícia de sua morte quase passou despercebida.',
    },
    en: {
      why: 'His trademark is clear melodies that suddenly slip into a distant key and come back as if nothing happened. Music for Children, Op. 65, shows that humor in pieces a student can play.',
      listen: ['Peter and the Wolf', 'Romeo and Juliet', 'Piano Concerto No. 3', 'Classical Symphony'],
      play: 'Music for Children, Op. 65 (e.g. “Morning”)',
      fact: 'He died on 5 March 1953, the same day as Stalin; news of his death went almost unnoticed.',
    },
  },
  {
    id: 'novaes', name: 'Guiomar Novaes', born: 1895, died: 1979, period: 'modern', brazil: true,
    pt: {
      why: 'Pianista paulista de fama internacional, admirada pelo som cantado e pelo rubato natural em Chopin e Schumann. Lembra que a teoria serve à interpretação: saber a harmonia ajuda a decidir onde respirar e o que destacar.',
      listen: ['Chopin: Noturnos (na gravação dela)', 'Schumann: Cenas Infantis (na gravação dela)', 'Chopin: Prelúdios, op. 28 (na gravação dela)'],
      play: '',
      fact: 'Em 1909, ainda adolescente, ficou em primeiro lugar no exame de admissão do Conservatório de Paris, entre centenas de candidatos; segundo os relatos, o júri incluía Debussy e Fauré.',
    },
    en: {
      why: 'A pianist from São Paulo state with an international career, admired for her singing tone and natural rubato in Chopin and Schumann. She reminds us that theory serves interpretation: knowing the harmony helps you decide where to breathe and what to bring out.',
      listen: ['Chopin: Nocturnes (her recording)', 'Schumann: Scenes from Childhood (her recording)', 'Chopin: Preludes, Op. 28 (her recording)'],
      play: '',
      fact: 'In 1909, still a teenager, she placed first in the Paris Conservatoire entrance exam among hundreds of candidates; according to the accounts, the jury included Debussy and Fauré.',
    },
  },
  {
    id: 'guarnieri', name: 'Camargo Guarnieri', born: 1907, died: 1993, period: 'modern', brazil: true,
    lessons: ['modes'],
    pt: {
      why: 'Grande nome do nacionalismo brasileiro depois de Villa-Lobos, e professor de muitas gerações. Seus 50 Ponteios para piano usam modos, contraponto e ritmos brasileiros em peças curtas.',
      listen: ['Ponteios (para piano)', 'Dança Brasileira', 'Dança Negra', 'Concertos para piano'],
      play: '',
      fact: 'Em 1950 publicou uma “Carta aberta aos músicos e críticos do Brasil” contra o dodecafonismo, o que gerou uma polêmica famosa com Hans-Joachim Koellreutter.',
    },
    en: {
      why: 'A leading figure of Brazilian nationalism after Villa-Lobos, and a teacher of many generations. His 50 Ponteios for piano use modes, counterpoint and Brazilian rhythms in short pieces.',
      listen: ['Ponteios (for piano)', 'Dança Brasileira', 'Dança Negra', 'Piano Concertos'],
      play: '',
      fact: 'In 1950 he published an “Open Letter to the Musicians and Critics of Brazil” against twelve-tone music, sparking a famous controversy with Hans-Joachim Koellreutter.',
    },
  },

  // ───────────────────────── Jazz and popular ─────────────────────────
  {
    id: 'joplin', name: 'Scott Joplin', born: 1868, died: 1917, period: 'jazz',
    lessons: ['rhythm2', 'lefthand', 'form'],
    pt: {
      why: 'O “rei do ragtime” (a data exata de nascimento é incerta, fim de 1867 ou 1868). A mão esquerda marca o tempo em “oom-pah” (baixo, acorde) enquanto a direita sincopa: a aula de síncope em estado puro, e um dos caminhos que levaram ao jazz.',
      listen: ['Maple Leaf Rag', 'The Entertainer', 'Solace', 'Treemonisha'],
      play: 'The Entertainer (versão simplificada)',
      fact: 'Sua música voltou a fazer sucesso em 1973 com o filme “Golpe de Mestre” (The Sting). Em 1976 recebeu um Prêmio Pulitzer póstumo.',
    },
    en: {
      why: 'The “King of Ragtime” (his exact birth date is uncertain, late 1867 or 1868). The left hand keeps time in “oom-pah” (bass, chord) while the right hand syncopates: the syncopation lesson in its purest form, and one of the roads that led to jazz.',
      listen: ['Maple Leaf Rag', 'The Entertainer', 'Solace', 'Treemonisha'],
      play: 'The Entertainer (simplified version)',
      fact: 'His music became popular again in 1973 with the film “The Sting”. In 1976 he was awarded a posthumous Pulitzer Prize.',
    },
  },
  {
    id: 'gershwin', name: 'George Gershwin', born: 1898, died: 1937, period: 'jazz',
    lessons: ['penta', 'seventh', 'extensions'],
    pt: {
      why: 'Uniu a canção americana, o blues e o jazz à sala de concerto. Suas melodias usam blue notes e acordes com sétimas e nonas, e suas canções viraram standards que os músicos de jazz estudam até hoje.',
      listen: ['Rhapsody in Blue', 'Summertime (Porgy and Bess)', 'Um Americano em Paris', 'Três Prelúdios para piano'],
      play: 'Summertime (arranjo simplificado)',
      fact: 'Conta-se que o famoso glissando de clarinete que abre a Rhapsody in Blue nasceu nos ensaios, quando o clarinetista transformou a escala escrita numa “escorregada”, e Gershwin gostou.',
    },
    en: {
      why: 'He brought American song, blues and jazz into the concert hall. His melodies use blue notes and chords with sevenths and ninths, and his songs became standards jazz musicians still study.',
      listen: ['Rhapsody in Blue', 'Summertime (Porgy and Bess)', 'An American in Paris', 'Three Preludes for piano'],
      play: 'Summertime (simplified arrangement)',
      fact: 'It is said that the famous clarinet glissando opening Rhapsody in Blue was born in rehearsal, when the clarinetist turned the written scale into a slide, and Gershwin liked it.',
    },
  },
  {
    id: 'monk', name: 'Thelonious Monk', born: 1917, died: 1982, period: 'jazz',
    lessons: ['sym', 'penta'],
    pt: {
      why: 'Pianista e compositor do bebop com um estilo inconfundível: segundas menores batidas juntas, silêncios inesperados, escalas de tons inteiros. Mostra que a “nota errada” no lugar certo vira linguagem.',
      listen: ['’Round Midnight', 'Blue Monk', 'Straight, No Chaser', 'Ruby, My Dear'],
      play: 'Blue Monk (o tema, um blues de 12 compassos)',
      fact: 'Em 1964 apareceu na capa da revista Time, algo raro para um músico de jazz.',
    },
    en: {
      why: 'A bebop pianist and composer with an unmistakable style: minor seconds struck together, unexpected silences, whole-tone runs. He shows that the “wrong note” in the right place becomes a language.',
      listen: ['’Round Midnight', 'Blue Monk', 'Straight, No Chaser', 'Ruby, My Dear'],
      play: 'Blue Monk (the head, a 12-bar blues)',
      fact: 'In 1964 he appeared on the cover of Time magazine, something rare for a jazz musician.',
    },
  },
  {
    id: 'jobim', name: 'Tom Jobim', born: 1927, died: 1994, period: 'jazz', brazil: true,
    lessons: ['borrow', 'extensions', 'secdom', 'symbols'],
    pt: {
      why: 'Pianista e compositor, um dos criadores da bossa nova. Suas canções usam acordes emprestados, dominantes secundárias, baixos que descem por semitom e extensões (sétimas, nonas) em quase todo acorde: um curso de harmonia em forma de canção.',
      listen: ['Garota de Ipanema', 'Chega de Saudade', 'Águas de Março', 'Wave'],
      play: 'Garota de Ipanema (arranjo simplificado com cifra)',
      fact: 'Desde 1999 o aeroporto internacional do Galeão, no Rio de Janeiro, leva o seu nome.',
    },
    en: {
      why: 'A pianist and composer, one of the creators of bossa nova. His songs use borrowed chords, secondary dominants, basses that descend by half step and extensions (sevenths, ninths) on almost every chord: a harmony course in song form.',
      listen: ['The Girl from Ipanema', 'Chega de Saudade', 'Waters of March', 'Wave'],
      play: 'The Girl from Ipanema (simplified arrangement with chord symbols)',
      fact: 'Since 1999 Rio de Janeiro’s Galeão international airport has carried his name.',
    },
  },
  {
    id: 'billevans', name: 'Bill Evans', born: 1929, died: 1980, period: 'jazz',
    lessons: ['extensions', 'symbols', 'modes'],
    pt: {
      why: 'Mudou o jeito de tocar acordes no piano de jazz: voicings sem a fundamental (que fica para o baixista), com nonas, décimas primeiras e décimas terceiras arrumadas perto umas das outras. Foi o pianista do disco Kind of Blue, marco do jazz modal.',
      listen: ['Waltz for Debby', 'Peace Piece', 'Kind of Blue (com Miles Davis)', 'Sunday at the Village Vanguard'],
      play: 'Peace Piece (o ostinato da mão esquerda, sobre o qual dá para improvisar)',
      fact: 'Escreveu o texto da contracapa de Kind of Blue (1959), comparando a improvisação a uma arte visual japonesa em que o traço não pode ser corrigido.',
    },
    en: {
      why: 'He changed how chords are played on jazz piano: voicings without the root (left to the bassist), with ninths, elevenths and thirteenths packed close together. He was the pianist on Kind of Blue, a landmark of modal jazz.',
      listen: ['Waltz for Debby', 'Peace Piece', 'Kind of Blue (with Miles Davis)', 'Sunday at the Village Vanguard'],
      play: 'Peace Piece (the left-hand ostinato, which you can improvise over)',
      fact: 'He wrote the liner notes for Kind of Blue (1959), comparing improvisation to a Japanese visual art in which the stroke cannot be corrected.',
    },
  },
  {
    id: 'johnnyalf', name: 'Johnny Alf', born: 1929, died: 2010, period: 'jazz', brazil: true,
    lessons: ['extensions'],
    pt: {
      why: 'Pianista e cantor carioca considerado um precursor da bossa nova: nos anos 1950 já usava acordes com extensões do jazz em canções brasileiras. Tocava em bares de Copacabana frequentados pelos jovens músicos que criariam a bossa nova.',
      listen: ['Eu e a Brisa', 'Rapaz de Bem', 'Ilusão à Toa'],
      play: 'Eu e a Brisa (melodia com cifra)',
      fact: 'Johnny Alf era nome artístico; seu nome de batismo era Alfredo José da Silva.',
    },
    en: {
      why: 'A pianist and singer from Rio considered a forerunner of bossa nova: in the 1950s he was already using jazz extended chords in Brazilian songs. He played in Copacabana bars frequented by the young musicians who would create bossa nova.',
      listen: ['Eu e a Brisa', 'Rapaz de Bem', 'Ilusão à Toa'],
      play: 'Eu e a Brisa (melody with chord symbols)',
      fact: 'Johnny Alf was a stage name; his birth name was Alfredo José da Silva.',
    },
  },

  // ───────────────────────── Contemporary ─────────────────────────
  {
    id: 'ligeti', name: 'György Ligeti', born: 1923, died: 2006, period: 'contemporary',
    lessons: ['sym', 'rhythm'],
    pt: {
      why: 'Compositor húngaro de texturas e ritmos complexos. Seus Estudos para piano exploram camadas de ritmo que se defasam, e a Musica ricercata constrói cada peça com um número crescente de notas: uma aula sobre o que cada nota a mais acrescenta.',
      listen: ['Musica ricercata', 'Estudos para piano (por exemplo “Désordre”)', 'Atmosphères', 'Lux aeterna'],
      play: 'Musica ricercata nº 1 (intermediário)',
      fact: 'A primeira peça da Musica ricercata usa só a nota Lá, em várias oitavas, até que um Ré aparece no fim; a peça seguinte usa três notas, e assim por diante.',
    },
    en: {
      why: 'A Hungarian composer of complex textures and rhythms. His Piano Études explore layers of rhythm that drift out of phase, and Musica ricercata builds each piece from a growing number of notes: a lesson in what each added note brings.',
      listen: ['Musica ricercata', 'Piano Études (e.g. “Désordre”)', 'Atmosphères', 'Lux aeterna'],
      play: 'Musica ricercata No. 1 (intermediate)',
      fact: 'The first piece of Musica ricercata uses only the note A, in several octaves, until a D appears at the end; the next piece uses three notes, and so on.',
    },
  },
  {
    id: 'part', name: 'Arvo Pärt', born: 1935, died: null, period: 'contemporary',
    lessons: ['field', 'consonance'],
    pt: {
      why: 'Compositor estoniano que criou o estilo “tintinnabuli”: uma voz anda pela escala enquanto outra toca só as notas da tríade da tônica. É a ideia de escala + acorde da aula de campo harmônico reduzida ao essencial.',
      listen: ['Spiegel im Spiegel', 'Für Alina', 'Fratres', 'Tabula Rasa'],
      play: 'Für Alina',
      fact: 'Antes de criar o tintinnabuli, em 1976, passou anos compondo pouquíssimo e estudando canto gregoriano e polifonia medieval e renascentista.',
    },
    en: {
      why: 'An Estonian composer who created the “tintinnabuli” style: one voice moves along the scale while another plays only the notes of the tonic triad. It is the scale + chord idea of the diatonic chords lesson reduced to its essence.',
      listen: ['Spiegel im Spiegel', 'Für Alina', 'Fratres', 'Tabula Rasa'],
      play: 'Für Alina',
      fact: 'Before creating tintinnabuli in 1976, he spent years composing very little and studying Gregorian chant and medieval and Renaissance polyphony.',
    },
  },
  {
    id: 'reich', name: 'Steve Reich', born: 1936, died: null, period: 'contemporary',
    lessons: ['rhythm'],
    pt: {
      why: 'Pioneiro do minimalismo, criou o “phasing”: dois músicos tocam o mesmo padrão e um deles acelera aos poucos, até as duas linhas se reencontrarem deslocadas. Transforma pulso e compasso em matéria de composição.',
      listen: ['Piano Phase', 'Music for 18 Musicians', 'Clapping Music', 'Different Trains'],
      play: 'Clapping Music (com palmas, em dupla)',
      fact: 'Recebeu o Prêmio Pulitzer de Música em 2009, pela obra Double Sextet.',
    },
    en: {
      why: 'A pioneer of minimalism, he created “phasing”: two musicians play the same pattern and one gradually speeds up, until the two lines line up again, shifted. He turns pulse and meter into compositional material.',
      listen: ['Piano Phase', 'Music for 18 Musicians', 'Clapping Music', 'Different Trains'],
      play: 'Clapping Music (clapping, in pairs)',
      fact: 'He won the 2009 Pulitzer Prize for Music for Double Sextet.',
    },
  },
  {
    id: 'hermeto', name: 'Hermeto Pascoal', born: 1936, died: 2025, period: 'contemporary', brazil: true,
    lessons: ['harmonize', 'extensions'],
    pt: {
      why: 'Multi-instrumentista alagoano, o “Bruxo”, que tocava piano, flautas e até chaleiras e brinquedos. Harmonizava a melodia da fala, de sons de animais e de qualquer coisa com acordes ricos em extensões: a aula de harmonização levada ao extremo.',
      listen: ['Bebê', 'Chorinho pra Ele', 'O Ovo', 'Slaves Mass'],
      play: 'Chorinho pra Ele (melodia com cifra)',
      fact: 'No projeto “Calendário do Som” compôs uma música por dia ao longo de um ano inteiro, entre 1996 e 1997.',
    },
    en: {
      why: 'A multi-instrumentalist from Alagoas, “the Wizard”, who played piano, flutes and even kettles and toys. He harmonized the melody of speech, animal sounds and anything else with chords rich in extensions: the harmonization lesson taken to the extreme.',
      listen: ['Bebê', 'Chorinho pra Ele', 'O Ovo', 'Slaves Mass'],
      play: 'Chorinho pra Ele (melody with chord symbols)',
      fact: 'In the “Calendário do Som” (Calendar of Sound) project he composed one piece a day for a whole year, between 1996 and 1997.',
    },
  },
  {
    id: 'glass', name: 'Philip Glass', born: 1937, died: null, period: 'contemporary',
    lessons: ['lefthand', 'rhythm'],
    pt: {
      why: 'Compositor minimalista cuja música repete arpejos com pequenas mudanças, de modo que o ouvido percebe cada nota nova do acorde. Suas peças para piano mostram o acorde quebrado da aula de mão esquerda como motor da música inteira.',
      listen: ['Metamorphosis', 'Glassworks (“Opening”)', 'Einstein on the Beach', 'Koyaanisqatsi'],
      play: 'Metamorphosis One ou “Opening” (intermediário)',
      fact: 'Por anos, em Nova York, trabalhou como taxista, encanador e carregador de mudanças enquanto compunha.',
    },
    en: {
      why: 'A minimalist composer whose music repeats arpeggios with small changes, so the ear notices each new chord tone. His piano pieces show the broken chord of the left-hand lesson as the engine of the whole piece.',
      listen: ['Metamorphosis', 'Glassworks (“Opening”)', 'Einstein on the Beach', 'Koyaanisqatsi'],
      play: 'Metamorphosis One or “Opening” (intermediate)',
      fact: 'For years in New York he worked as a taxi driver, plumber and mover while composing.',
    },
  },
  {
    id: 'jarrett', name: 'Keith Jarrett', born: 1945, died: null, period: 'contemporary',
    lessons: ['modes'],
    pt: {
      why: 'Pianista americano famoso por concertos inteiramente improvisados, que passeiam por gospel, folk, clássico e jazz. Mostra que improvisar é compor em tempo real, usando escalas, modos e progressões que se conhecem a fundo.',
      listen: ['The Köln Concert', 'Standards, Vol. 1', 'My Song'],
      play: '',
      fact: 'O The Köln Concert (1975), um dos discos de piano solo mais vendidos, foi gravado num piano menor e em mau estado, e não no instrumento que ele havia pedido.',
    },
    en: {
      why: 'An American pianist famous for fully improvised concerts that wander through gospel, folk, classical and jazz. He shows that improvising is composing in real time, with scales, modes and progressions known inside out.',
      listen: ['The Köln Concert', 'Standards, Vol. 1', 'My Song'],
      play: '',
      fact: 'The Köln Concert (1975), one of the best-selling solo piano records, was recorded on a smaller piano in poor condition, not the instrument he had requested.',
    },
  },
  {
    id: 'gismonti', name: 'Egberto Gismonti', born: 1947, died: null, period: 'contemporary', brazil: true,
    lessons: ['modes'],
    pt: {
      why: 'Pianista e violonista fluminense que mistura música erudita, choro, frevo e sons indígenas. Sua escrita para piano usa modos, ostinatos e ritmos brasileiros com liberdade de improviso.',
      listen: ['Água e Vinho', 'Frevo', 'Palhaço', 'Loro'],
      play: '',
      fact: 'Estudou em Paris com Nadia Boulanger, professora de muitos compositores do século XX; conta-se que ela o incentivou a olhar para a música do Brasil.',
    },
    en: {
      why: 'A pianist and guitarist from Rio de Janeiro state who blends classical music, choro, frevo and Indigenous sounds. His piano writing uses modes, ostinatos and Brazilian rhythms with improvisational freedom.',
      listen: ['Água e Vinho', 'Frevo', 'Palhaço', 'Loro'],
      play: '',
      fact: 'He studied in Paris with Nadia Boulanger, teacher of many 20th-century composers; it is said she encouraged him to look to Brazilian music.',
    },
  },
];
