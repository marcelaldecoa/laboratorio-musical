# Currículo: a ordem das aulas e o porquê

A ordem é definida em um só lugar, `src/lessons/curriculum.ts`. Para cada aula ele guarda:

- **needs**: as aulas cujas ideias ela usa;
- **terms**: os termos do glossário que ela explica pela primeira vez.

O teste `src/lessons/curriculum.test.ts` falha se:

- uma aula depender de outra que vem depois;
- um termo aparecer sem definição no glossário, ou for explicado em duas aulas;
- um termo do glossário não for explicado em nenhuma aula.

No app, cada aula mostra no topo **Antes desta aula** (links para os pré-requisitos) e **Termos novos nesta aula** (com as definições). No glossário, cada termo indica a aula onde é explicado.

## A cadeia

Princípio: deduzir, não decorar. Cada passo usa só o que veio antes.

| # | Trilha | Aulas | Por que aqui |
|---|---|---|---|
| 1 | Fundamentos | O teclado · A fórmula · Intervalos · De onde vêm os nomes | Semitom, tom, ♯/♭ e a fórmula T T S T T T S são a base de tudo. Intervalos dão a régua (5ª, 4ª, 3ª) que todas as aulas seguintes usam. |
| 2 | A física por baixo | A série harmônica · A origem | Explica *por que a quinta* antes do círculo das quintas: o 3:2 está dentro do próprio som. |
| 3 | O círculo das quintas | Tetracordes · O salto · A escala · Dobradiças · Trítono · Janela · Funções | O círculo é deduzido da fórmula: o bloco de cima de uma escala é o de baixo da próxima, uma quinta acima. |
| 4 | Acordes da escala | Campo harmônico · Progressões | Tríades saem da janela de 7 quintas; as funções explicam por que os acordes se movem. |
| 5 | Ritmo | Pulso, compasso e figuras | Antes da melodia, que usa tempo forte e compasso. |
| 6 | Melodia e forma | Notas do acorde · Frases e forma · Compor · Harmonizar | Juntam acordes, ritmo e cadências; Compor e Harmonizar fecham como prática. |
| 7 | Escalas e modos | Menor · Menor harmônica e melódica · Modos · Pentatônica e blues · Simétricas | Todas saem da mesma janela, com outra tônica ou outro recorte. |
| 8 | Acordes | Tétrades · V7 · Inversões · Extensões · Cifras | Mais terças na pilha; o °7 depende da menor harmônica (trilha 7). |
| 9 | Harmonia em movimento | Dominantes secundárias · Modulação · Empréstimo modal · Substituição de trítono | Usam o V7, a menor paralela e o trítono. |
| 10 | Piano na prática | Ler a pauta · Dedilhado · Mão esquerda | Aplicação no instrumento. Dependem só dos fundamentos e das progressões. |

## Como acrescentar uma aula

1. Escreva a aula e os textos (veja `CLAUDE.md`).
2. Registre-a na trilha (`src/lessons/track-*.ts`).
3. Inclua-a em `curriculum.ts` no ponto certo, com `needs` e `terms`. Ponha os termos novos no glossário da aula.
4. Rode `npm test`. Se o teste do currículo falhar, a aula está usando algo que ainda não foi ensinado.
