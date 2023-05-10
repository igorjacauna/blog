---
date: 2023-05-10
layout: article
---

# Layers, layers, layers...

Uma das principais funcionalidades presentes no Nuxt 3 é a [_Layers_](https://nuxt.com/docs/getting-started/layers).

Com ela você pode extender várias aplicações Nuxt resultando em uma só. Assim, é possível reutilizar componentes, _composables_, configurações, páginas, funções.

Dá pra fazer _extends_ local, de um pacote NPM e até de um repositório git.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: [
    '../base',                     // Extend from a local layer
    '@my-themes/awesome',          // Extend from an installed npm package
    'github:my-themes/awesome#v1', // Extend from a git repository
  ]
});
```

## Mas como pode ser usado?

Eu costumo usar com _monorepos_ e mantenho as rotas de API, páginas e componentes em três projetos separados.

É uma ótima maneira de organizar o projeto para se trabalhar com vários times. Onde cada time, por exemplo, trabalha em um escopo diferente dentro da mesma aplicação final sem interferir no trabalho de outro time. Já que estarão em repositórios diferentes.

Como o Nuxt 3 foi feito baseado no incrível [NitroJS](https://nitro.unjs.io/), é possível fazer deploy para Firebase, Vercel, etc. com o benefício do _serverless_ sem muita dor de cabeça, alterando apenas algumas linhas. Então a camada que contém a API é executada do lado do servidor com _Cloud Functions_ no Firebase por exemplo. E com NitroJS é possível ter SSR sem complicações.

## Exemplo com _monorepo_

Crie um novo projeto como `yarn init -y -p`

Altere o `package.json` adicionando `workspaces`:

::alert{type="info"}
Certifique-se de que tenha `"private": true`
::

```json
{
  "name": "@myapp/layers",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "private": true,
  "workspaces": [
    "layers/**"
  ]
}
```

Vamos criar o diretório com os pacotes do nosso _workspace_

```bash
mkdir layers
cd layers
```

Agora vamos criar nosso app base que vai fazer _extends_ das layers

```bash
npx nuxi@latest init app
```

Agora vamos criar nossa layer de API que vai rodar no _Firebase Cloud Function_.

Pra facilitar vamos usar o template de `layer` do `nuxi`

```bash
npx nuxi@latest init --template layer server
```

### Layer `server`

Aqui vamos alterar o `package.json` fazendo o seguinte:

::list{type="primary"}
- Alterar o nome para estar mais de acordo com o _workspace_
::

```json [layers/server/package.json]
{
  "name": "@myapp/server",
  "type": "module",
  "version": "0.0.1",
  "main": "./nuxt.config.ts",
  "scripts": {
    "dev": "nuxi dev .playground",
    "build": "nuxt build .playground",
    "generate": "nuxt generate .playground",
    "preview": "nuxt preview .playground",
    "lint": "eslint .",
    "postinstall": "nuxt prepare .playground"
  },
  "devDependencies": {
    "@nuxt/eslint-config": "^0.1.1",
    "eslint": "^8.28.0",
    "nuxt": "^3.0.0",
    "typescript": "^4.9.3"
  }
}
```

### Layer `app`

Aqui vamos alterar o `package.json` fazendo o seguinte:

::list{type="primary"}
- Adicionar `version` para funcionar com o _workspace_ do `yarn`
- Remover o `private` adicionado por padrão pelo `nuxi`
- Alterar o nome do pacote para estar mais de acordo com o _workspace_
- Adicionar o `@myapp/server` como dependência. Essa é a nossa _layer_
::

```json [layers/app/package.json]
{
  "name": "@myapp/app",
  "version": "0.0.1",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "devDependencies": {
    "@myapp/server": "0.0.1",
    "@types/node": "^18",
    "nuxt": "^3.4.3"
  }
}
```

Alteramos agora o `nuxt.config.ts` para ele fazer _extends_ da nossa layer `server`.

```ts [layers/app/nuxt.config.ts]
export default defineNuxtConfig({
  extends: [
    '@myapp/server'
  ]
})
```

Pronto, já temos uma estrutura de reutilização de código com as _layers_ do Nuxt

### Instalação

Agora a partir da raiz do nosso _workspace_ executamos a instalação das dependências

```bash [myapp]
yarn install
```

## Implementações

Agora vem a parte legal, podemos usar as [rotas de API de servidor](https://nuxt.com/docs/guide/directory-structure/server#api-routes) do Nuxt para construir as funções que vão ser usadas no _Firebase Cloud Function_.

Essa implementação vamos manter na _layer_ server. Nela estará todas as rotas da API que serão executadas do lado do servidor.

Para isso, basta criar os arquivos das rotas dentro do diretório `server/api` na nossa layer `server`.

```ts [layers/server/server/api/hello.ts]
export default defineEventHandler((event) => {
  return {
    api: 'works'
  }
})
```

## Testando

Pronto, se quisermos testar, basta rodar o _script_ `dev` da layer `@myapp/app`:

```bash
yarn workspace @myapp/app dev
```

E então abrir no navegador [`http://localhost:3000/api/hello`](http://localhost:3000/api/hello) que você vai ver a resposta implementada na _layer_ server em `layers/server/server/api/hello.ts`

Perceba que rodamos o `@myapp/app` mas a implementação da rota da API está no `@myapp/server`. E o Nuxt mesclou as layers para gente.

## Deploy

Para fazer deploy é tão simples como implementar as _layers_. 

### Nitro

Nuxt 3 foi construído sobre o [NitroJS](https://nitro.unjs.io/). 

E o que é legal, ele tem _presets_ de deploy para vários serviços, incluindo Firebase.

Pra configurar no nosso `@myapp/app` com preset do Firebase, vamos alterar o `nuxt.config.ts`

```ts [layers/app/nuxt.config.ts]
export default defineNuxtConfig({
  extends: [
    '@myapp/server'
  ],
  nitro: {
    preset: 'firebase'
  }
})
```

Instalar as dependências do Firebase

```bash
yarn workspace @myapp/app add -D firebase-admin firebase-functions firebase-functions-test
```

Agora só configurar o firebase com o `firebase-tools`:

```bash
firebase login
firebase init hosting
```

Quando for perguntado sobre qual diretório contém a aplicação a ser enviada para o Firebase, dizer que é a `.output/public`

Depois de concluído, altere o `firebase.json` para habilitar a renderização com _Cloud Functions_

```json
{
  "functions": { "source": ".output/server" },
  "hosting": [
    {
      "site": "<your_project_id>",
      "public": ".output/public",
      "cleanUrls": true,
      "rewrites": [{ "source": "**", "function": "server" }]
    }
  ]
}
```

Pronto, agora só fazer deploy que sua aplicação vai ter renderização do lado do servidor, APIs e tudo isso usando layers!!

Pra saber mais sobre os presets no Nitro só ler [aqui](https://nitro.unjs.io/deploy/providers/firebase)

Descubra mais sobre _Layers_ [aqui](https://nuxt.com/docs/getting-started/layers)