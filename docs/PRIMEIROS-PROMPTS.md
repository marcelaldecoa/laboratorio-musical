# Primeiros prompts para o Claude Code

Cole um de cada vez, na ordem. Espere terminar e revise antes de seguir.

## 1. Entender o projeto (sem escrever código)

```
Leia CLAUDE.md e docs/ROADMAP.md. Depois abra prototype/circle-of-fifths-lab.html e faça um inventário:
cada seção da página, cada função de teoria musical do script, e como o i18n está organizado.
Com base nisso, proponha a estrutura de pastas e um plano detalhado para a Fase 0.
Não escreva código ainda; espere eu aprovar o plano.
```

## 2. Fase 0: fundação

```
Plano aprovado. Execute a Fase 0: crie o projeto, porte o núcleo de teoria para src/theory/ com testes
cobrindo as 12 tonalidades nos dois sentidos do círculo, e configure estado global e i18n.
Rode os testes e me mostre o resultado. Faça um commit ao final.
```

## 3. Fase 1: componentes base

```
Execute a Fase 1. Comece pelo componente Keyboard com a mesma capacidade do drawKeys do protótipo
(marcas, teclas fantasma, colchetes, passos T/S). Depois o CircleOfFifths, a Staff e o áudio com Tone.js.
Abra o app no navegador e confira em 400 px de largura, nos temas claro e escuro.
```

## 4. Migrar uma seção

```
Migre a seção "<nome da seção>" do protótipo. Preserve os textos nos dois idiomas e a lógica.
Confira em Dó maior, Fá♯/Sol♭ maior e Si♭ maior, compare com o protótipo e faça um commit.
```

## Dicas

- Peça um plano antes de tarefas grandes e aprove antes de deixar o Claude Code escrever.
- Uma seção por vez, com commit ao final de cada uma, para poder voltar atrás facilmente.
- Se algo novo ficar confuso de entender, peça: "reescreva a explicação em passos numerados, uma ideia por passo".
