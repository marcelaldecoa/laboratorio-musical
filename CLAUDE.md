# Laboratório Musical

App interativo e bilíngue (pt-BR padrão, en) para estudar teoria musical para piano pela lógica, e não pela memorização. O usuário é um pianista iniciante que lê partitura e quer entender o "debaixo do capô" de cada regra para conseguir explicá-la a outras pessoas.

O protótipo funcional está em `prototype/circle-of-fifths-lab.html`. Ele é a referência de comportamento, textos e lógica já aprovados. Ao migrar uma seção, preserve os textos e a lógica e confira o resultado contra o protótipo.

## Princípios pedagógicos

- **Deduzir, não decorar.** Toda regra nasce de um fato anterior. A cadeia é: fórmula T T S T T T S → tetracordes → círculo das quintas → janela de 7 quintas → intervalos → campo harmônico → funções → progressões → composição.
- **Cada conceito tem quatro partes:** explicação curta, piano interativo, som, e a lógica ou origem histórica por baixo.
- **Uma ideia por passo.** Quando algo ficar confuso, reescreva em passos numerados com exemplos concretos no teclado, em vez de acrescentar mais conceitos.
- **Tudo segue a tonalidade selecionada no círculo.** A tonalidade é estado global; todas as seções se atualizam juntas.
- **Prosa clara.** Termos técnicos aparecem nos dois idiomas no glossário. O idioma escolhido vale para a página inteira, inclusive nomes de notas (Dó Ré Mi em pt, C D E em en), com opção de trocar a notação separadamente.

## Linguagem visual

O piano é o principal meio de explicação. Toda seção nova deve ter pelo menos um teclado, e o significado das cores é o mesmo no app inteiro:

| Elemento | Significado |
|---|---|
| Verde (accent) | tônica, repouso, acorde maior, intervalo justo ou maior |
| Roxo | subdominante, acorde menor, lado dos bemóis no círculo |
| Azul | dominante |
| Coral / laranja | sensível, a nota que muda, semitom, exceção, tensão |
| Verde-claro | notas da escala sem papel especial |
| Tecla tracejada | para onde a nota vai, ou onde a voz estava |
| Colchete acima do teclado | uma distância, com o tamanho escrito (ex.: "5ª · 7 semitons") |
| T / S abaixo do teclado | os passos entre teclas; S sempre em coral |
| Número dentro da tecla | grau da escala ou contagem de nomes de nota |

Outras regras visuais:

- Mostrar oitavas inteiras sempre que possível, para que o padrão de teclas pretas (2 + 3) ajude a orientar.
- Cada explicação "por quê" ganha um diagrama: colchetes, linha de quintas, censo em barras, espelho em volta da tônica.
- Legenda sempre visível abaixo de cada teclado colorido.
- Animações só quando mostram movimento real (uma voz andando, a janela deslizando).

## Stack

- Vite + React + TypeScript
- Tone.js para áudio (Sampler com amostras de piano; o protótipo usa osciladores simples)
- Vitest para testes
- CSS com tokens de cor para tema claro e escuro
- i18n com dicionários tipados (`src/i18n/pt.ts`, `src/i18n/en.ts`)
- PWA (funciona offline e no celular)

## Arquitetura

```
src/
  theory/        Núcleo de teoria. Funções puras, sem DOM, 100% testadas.
    note.ts        Nota = { letter: 0-6, acc: -2..2 }, pitch class, nome localizado
    scale.ts       escala maior com grafia correta por letra
    fifths.ts      círculo e linha de quintas, armaduras, ordem de ♯ e ♭
    interval.ts    número, qualidade, inversão, censo de intervalos
    chord.ts       tríades, qualidade, função (T/SD/D), notas comuns
    voicing.ts     condução de vozes (posição mais próxima)
  audio/         Tone.js, só inicia após interação do usuário
  components/    Keyboard, CircleOfFifths, Staff, Chips, Bracket, Legend
  lessons/       Uma pasta por seção (veja docs/ROADMAP.md)
  i18n/
  state/         tonalidade, direção, grafia enarmônica, idioma, notação (persistidos em localStorage)
```

O componente `Keyboard` deve aceitar: faixa de notas, marcas por tecla (cor, rótulo, nome), teclas fantasma tracejadas, colchetes com rótulo acima e passos T/S abaixo. Quase todas as seções do protótipo usam essa mesma API (função `drawKeys`).

## Regras

- **Grafia das notas:** nunca derive o nome da nota a partir da pitch class. Use sempre letra + acidente, para que Fá♯ maior tenha Mi♯ e Sol♭ maior tenha Dó♭.
- **Ordem das aulas:** a sequência, os pré-requisitos e os termos de cada aula ficam em `src/lessons/curriculum.ts` (explicado em `docs/CURRICULO.md`). Uma aula só pode usar conceitos de aulas anteriores; `curriculum.test.ts` confere.
- **Testes obrigatórios para `src/theory/`:** cubra as 12 tonalidades nos dois sentidos do círculo, as 7 tríades de cada tonalidade, o censo de intervalos (cada número com exatamente dois tamanhos, a 8ª com um), inversões e notas comuns entre acordes.
- **Contraste:** nunca use texto com cor próxima do fundo. Todo texto precisa de contraste AA nos temas claro e escuro.
- **Mobile primeiro:** a página funciona a ~400 px sem rolagem horizontal; teclados largos rolam dentro do próprio container.
- **Nenhum texto fixo no código:** todo texto visível vem do i18n.
- **Áudio** só começa depois de um clique do usuário.

## Comandos

- `npm run dev` para desenvolver
- `npm test` para rodar os testes
- `npm run build` para gerar a versão de produção
