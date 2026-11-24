# igorjacauna.com.br

Meu site e blog. Feito com [Nuxt 4](https://nuxt.com), [Nuxt Content](https://content.nuxt.com), [Nuxt Studio](https://nuxt.studio) e [UnoCSS](https://unocss.dev), publicado no Cloudflare Workers.

## Escrever um post

Crie `content/posts/<slug>.md`:

```md
---
title: Título do post
description: Uma frase que aparece na lista, no RSS e na imagem de prévia.
date: 2026-11-24
tags: [nuxt, vue]
draft: true   # tire quando for publicar
---

Texto em markdown...
```

Ou edite direto no navegador em `/_studio` (login com GitHub). O Studio faz commit na branch `v2` e o deploy roda sozinho.

Componentes disponíveis no markdown: `::alert{type="info|warning|success|danger"}`, `:hover3d`, `:virtual-list`.

## Desenvolvimento

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # gera .output (Cloudflare Workers + D1)
pnpm deploy     # build + wrangler deploy
```

## Licença

Textos e imagens sob [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br).
