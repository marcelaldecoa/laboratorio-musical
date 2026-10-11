# Laboratório Musical

App web (PWA) interativo e bilíngue (pt-BR / en) para estudar teoria musical para piano **pela lógica, não pela memorização**. Feito para iPhone (16 Pro Max) e iPad, funciona offline depois de instalado.

## O que tem

- **Círculo das quintas** interativo (toque ou arraste o anel), com cartão da tonalidade: armadura, a nota que muda e a conferência.
- **14 aulas** migradas do protótipo (`prototype/circle-of-fifths-lab.html`): O salto, A escala, Tetracordes, Funções, Nomes, Intervalos, Dobradiças, Trítono, Origem, Janela, Campo harmônico, Progressões, Compor e Glossário.
- **Todo teclado é tocável**: toque nas teclas para ouvir. Quando um som toca, as teclas acendem.
- **Piano livre**: notas ou acordes do campo harmônico, rótulos com nome ou grau, Web MIDI (Chrome/Edge).
- **Praticar**: armadura → tonalidade, nomear intervalos, função do acorde e intervalos de ouvido, com a explicação lógica depois de cada resposta.
- Tudo segue a tonalidade global; idioma, notação (C D E / Dó Ré Mi) e tema claro/escuro ficam salvos.
- Som de piano real (amostras Salamander via Tone.js, guardadas em cache para uso offline); sintetizador enquanto carrega. No iOS 17+ o som toca mesmo com a chave de silêncio.

## Instalar no iPhone / iPad

Abra o site no Safari → Compartilhar → **Adicionar à Tela de Início**.

## Desenvolvimento

```bash
npm install
npm run dev      # servidor local (acessível na rede: abra no iPhone pelo IP do computador)
npm test         # testes do núcleo de teoria (src/theory)
npm run build    # versão de produção em dist/ (hospedagem estática)
```

Arquitetura e regras: veja `CLAUDE.md`. Roadmap: `docs/ROADMAP.md`.
