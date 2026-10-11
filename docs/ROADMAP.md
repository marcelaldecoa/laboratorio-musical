# Roadmap

## Fase 0: fundação

1. Criar o projeto (Vite + React + TypeScript, Vitest, Tone.js).
2. Portar o núcleo de teoria do protótipo para `src/theory/`, com testes. Funções a portar: `scaleOf`, `sigOf`, `diff`, `fIdx`/`fromF` (linha de quintas), `qual`, `chordInfo`, `triad`, `common`, `voice`.
3. Estado global (tonalidade, direção, grafia enarmônica, idioma, notação) e i18n.

## Fase 1: componentes base

- `Keyboard` (mesma capacidade do `drawKeys` do protótipo)
- `CircleOfFifths` (navegação, sentido horário e anti-horário, F♯/G♭)
- `Staff` (armadura de clave e pauta simples)
- Áudio com Tone.js e amostras de piano
- Seletor de idioma com bandeiras e seletor de notação

## Fase 2: migrar as seções do protótipo

Na ordem da página:

1. O salto
2. A escala
3. Tetracordes
4. As funções
5. De onde vêm os nomes
6. Intervalos
7. As dobradiças
8. O trítono
9. A origem (quintas puras × temperamento igual)
10. A janela (linha de quintas)
11. Campo harmônico
12. Progressões
13. Compor na prática
14. Glossário

Critério de pronto para cada seção: textos iguais aos do protótipo nos dois idiomas, comportamento conferido em 3 tonalidades (Dó, Fá♯/Sol♭, Si♭), sem erros de contraste, funcionando a 400 px.

## Fase 3: conteúdo novo

Cada tema traz o recurso visual principal entre parênteses. Ordem sugerida: as trilhas na sequência, mas o tema 3.1 primeiro.

### 3.1 A física por baixo
- Série harmônica: os harmônicos de uma nota numerados sobre um teclado de 4 oitavas (Dó Dó Sol Dó Mi Sol…). Mostra por que a 8ª e a 5ª são as mais consonantes e como a tríade maior “sai” da própria natureza do som.

### 3.2 Escalas e modos
- Escala menor natural e tonalidade relativa (mesmas teclas, outra tônica em verde; anel interno no círculo)
- Menor harmônica e melódica (a sensível “emprestada” em coral; colchete na 2ª aumentada)
- Modos gregos (a janela com 7 pontos de partida; chips ordenados do mais brilhante ao mais escuro)
- Pentatônica e blues (as 5 teclas pretas; janela de 5 quintas; a blue note em coral)
- Escalas simétricas: cromática e de tons inteiros (cores alternadas mostrando a simetria)

### 3.3 Acordes
- Tétrades: 7M, 7, m7, m7(♭5), °7 (terças empilhadas em quatro cores; formas na linha de quintas)
- O V7 e o trítono dentro dele (subdominante em roxo e sensível em coral dentro do acorde azul)
- Inversões e baixo (mesmas notas, baixo destacado; cifras com barra, como G/B)
- Extensões 9, 11, 13 (terças continuando por cima da oitava, teclado de 3 oitavas)
- Leitura de cifras (cifra → teclas acesas)

### 3.4 Harmonia em movimento
- Dominantes secundárias, V/V (a janela vizinha “espiada”; o acidente emprestado em coral)
- Modulação e acordes pivô (duas janelas sobrepostas; acordes comuns no meio)
- Empréstimo modal: iv, ♭VI, ♭VII (acordes da menor paralela em roxo)
- Substituição de trítono (dois V7 com o mesmo trítono; fundamentais em lados opostos do círculo)

### 3.5 Melodia e forma
- Notas do acorde × notas de passagem (melodia colorida por papel)
- Frases, pergunta e resposta, forma de canção (verso, refrão, AABA)
- Harmonizar uma melodia simples passo a passo

### 3.6 Piano na prática
- Dedilhado de escalas (números dos dedos nas teclas, setas na passagem do polegar)
- Padrões de mão esquerda: baixo + acorde, arpejo, baixo de Alberti (teclado com duas cores, uma por mão)
- Leitura: pauta (claves de sol e de fá) ligada ao teclado

### 3.7 Ritmo
- Pulso, compasso e figuras (grade estilo piano roll com cores por tempo forte e fraco)

## Fase 4: prática

- Exercícios e quiz (identificar tonalidade pela armadura, intervalos de ouvido, função de um acorde)
- Entrada MIDI pela Web MIDI API: tocar no piano real e ver as teclas acenderem no app (Chrome e Edge)
- Progresso salvo e uma rotina de estudo diário

## Fase 5: publicação

- PWA instalável
- Deploy em hospedagem estática
