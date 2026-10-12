# Backlog

Próximos passos sugeridos, em ordem de prioridade. Cada item diz o porquê, o que fazer e quando está pronto.

## 1. Estudo real e retorno do aluno

- **Por quê:** é o que mais melhora a didática, e os testes automáticos não pegam isso.
- **O quê:** estudar a trilha Fundamentos e o Círculo das quintas no iPhone, como aluno, anotando:
  - explicações que não convenceram;
  - previsões fáceis ou difíceis demais;
  - passos que faltaram.

  Reescrever exatamente esses pontos, em passos numerados, uma ideia por passo.
- **Pronto quando:** as duas primeiras trilhas foram estudadas no aparelho, e cada ponto anotado foi resolvido ou explicado.

## 2. Tocar no piano de verdade (microfone)

- **Por quê:** responder no instrumento fixa no corpo o que a cabeça entendeu. No iPhone e no iPad não há Web MIDI, mas o microfone funciona.
- **O quê:**
  - detecção de altura (pitch) pelo microfone, com uma nota por vez para começar;
  - a tecla tocada acende no app;
  - `Predict` no modo `key` e os exercícios aceitam a nota vinda do piano;
  - pedir permissão só depois de um toque do usuário;
  - calibrar a afinação (lá 440 Hz) e a sensibilidade;
  - funcionar com o piano acústico e com o digital pelo alto-falante.
- **Riscos:** precisão em pianos desafinados e em ambientes com ruído; acordes (várias notas ao mesmo tempo) ficam para uma segunda etapa.
- **Pronto quando:** num iPhone real, as 12 notas de uma oitava são reconhecidas de forma confiável, e as previsões de uma trilha inteira podem ser respondidas tocando.

## 3. Previsões na revisão espaçada e desafio por trilha

- **Por quê:** fechar o ciclo prever → errar → revisar. Hoje uma previsão errada se perde.
- **O quê:**
  - cada `Predict` ganha um id; um erro entra nas caixas de Leitner (`state/store.ts`, `recordAnswer`) e a questão volta na "Revisão do dia";
  - cada trilha termina com um desafio curto que junta as ideias dela (por exemplo: monte a escala, ache a armadura, diga qual nota muda no próximo passo do círculo);
  - a trilha conta como concluída quando o desafio é vencido.
- **Pronto quando:** erros de previsão reaparecem na revisão, e cada trilha tem um desafio com feedback lógico.

## 4. Modo apresentação

- **Por quê:** o objetivo do aluno é explicar a outras pessoas.
- **O quê:**
  - cada aula vira uma sequência de telas grandes, uma ideia por tela: a pergunta, os passos, o teclado com som, e o resumo "em uma frase" e "como mostrar no piano";
  - navegação por toque ou setas;
  - pensado para iPad em paisagem ou espelhamento numa TV.
- **Pronto quando:** qualquer aula pode ser apresentada do início ao fim sem rolar a página.

## 5. Tonalidades menores no círculo

- **Por quê:** hoje o círculo escolhe só tonalidades maiores, e as aulas de menor usam a relativa.
- **O quê:**
  - anel interno com as 12 tonalidades menores no `CircleOfFifths`;
  - estado global com o modo (maior ou menor);
  - aulas de menor, exercícios e Piano livre seguem a tonalidade menor escolhida;
  - as aulas de maior mostram a relativa maior;
  - testes de grafia nas 12 menores.
- **Pronto quando:** dá para escolher Lá menor no círculo, e todas as seções reagem de forma coerente.

## 6. Revisão de código

- **Por quê:** muitas aulas foram escritas em paralelo por agentes diferentes.
- **O quê:** revisão procurando bugs (por exemplo: sons que continuam ao trocar de aula, estados que não se atualizam ao mudar a tonalidade ou o idioma, temporizadores sem limpeza) e simplificação de componentes repetidos (teclados de progressão, faixas de melodia).
- **Pronto quando:** os achados forem corrigidos e cobertos por testes onde couber.

## Ideias para depois

- Ditado melódico e de acordes ligado às aulas (ouvir e escrever).
- Escolher uma música (cifras digitadas) e ver a análise de funções, cadências e empréstimos.
- Exportar o resumo das aulas como folha de estudo.
- Revisão de português e inglês por um falante nativo e por um professor de música.
