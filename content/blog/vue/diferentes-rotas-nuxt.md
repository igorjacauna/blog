---
date: 2022-08-23
layout: article
---

# As diferentes rotas no Nuxt

::alert{type="warning"}

Usamos a versão 2.* do Nuxt nesse post, algumas coisas podem ser diferentes para versão 3.*

::

Nuxt.js é uma estrutura de aplicativo da web gratuita e de código aberto baseada em Vue.js, Node.js, Webpack e Babel.js. O framework é anunciado como um "meta-framework para aplicações universais"

Ele trabalha com rotas baseadas em arquivos, mas podemos muito bem alterar esse comportamento e veremos isso agora.

<!--more-->

## `<Nuxt />` & `<NuxtChild />`

Antes de tudo, precisamos entender esses dois componentes primeiro.

### `<Nuxt />`

Vamos começar pelo [`<Nuxt />`](https://nuxtjs.org/docs/2.x/features/nuxt-components#the-nuxt-component). **Que só pode ser usado pelos [layouts](https://nuxtjs.org/docs/2.x/concepts/views#layouts) da nossa aplicação.**

Pra quem já trabalhou com Vue Router, sabe que existe o `<router-view>` que é usado para indicar onde as rotas serão renderizadas. O `<Nuxt />` serve para o mesmo propósito. Ele indica onde as rotas da nossa aplicação Nuxt serão renderizadas.

```vue [layouts/default.vue]
<template>
  <div>
    <div>Top Bar</div>
    <Nuxt />
    <div>Footer</div>
  </div>
</template>
```

### `<NuxtChild />`

Como você já deve ter imaginado, o [`<NuxtChild />`](https://nuxtjs.org/docs/2.x/features/nuxt-components#the-nuxtchild-component) serve para indicarmos onde as rotas aninhadas serão renderizadas. Exemplo:

```
-| pages/
---| parent/
-----| child.vue
---| parent.vue
```

Vai gerar as seguintes rotas:

```javascript
[
  {
    path: '/parent',
    component: '~/pages/parent.vue',
    name: 'parent',
    children: [
      {
        path: 'child',
        component: '~/pages/parent/child.vue',
        name: 'parent-child'
      }
    ]
  }
]
```

Então para renderizar a rota para `child.vue` dentro de `parent.vue`, inserimos o `<NuxtChild />` em `parent.vue`:

```vue [pages/parent.vue]
<template>
  <div>
    <h1>Eu sou a página "parent" passando props "foobar" para a rota filha</h1>
    <NuxtChild :foobar="123" />
  </div>
</template>
```

::alert{type="info"}

Observe que a rota pai é um arquivo `parent.vue`. Para definir as rotas filhas, os `*.vue` devem estar em um diretório com mesmo nome da rota pai, `parent/*`.

::

::alert{type="warning"}

`<NuxtChild />` é usado dentro das páginas apenas, diferente do `<Nuxt />` que só pode ser usado nos [layouts](https://nuxtjs.org/docs/2.x/concepts/views#layouts).

::

Bem, agora que já sabemos o propósito desses dois componentes, vamos às diferentes formas de rotas do Nuxt.

## Padrão

### Definindo rotas
Por padrão, o Nuxt trabalha lendo a [estrutura do diretório](https://nuxtjs.org/docs/2.x/features/file-system-routing) `pages`. Portanto, se a nossa estrutura de diretórios for: 

<table>
  <thead>
    <tr>
      <th>Arquivo</th>
      <th>Rota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>pages/artigos/index.vue</td>
      <td>artigos/</td>
    </tr>
    <tr>
      <td>pages/artigos/novo-artigo.vue</td>
      <td>artigos/novo-artigo</td>
    </tr>
  </tbody>
</table>

### Parâmetros

Para definir um parâmetro, é criado um arquivo com `undescore` antes do nome do parâmetro:

<table>
  <thead>
    <tr>
      <th>Arquivo</th>
      <th>Rota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>pages/artigos/_id.vue</td>
      <td>artigos/{id}</td>
    </tr>
    <tr>
      <td>pages/users/_username.vue</td>
      <td>users/{username}</td>
    </tr>
  </tbody>
</table>

Pra usar o parâmetro na nossa página, basta acessar a `$route.params`:

```vue [pages/users/_username.vue]
<script>
export default {
  async fetch() {
    this.user = await this.$axios.get(`/api/users/${this.$route.params.username}`)
  },
  data() {
    return {
      user: null
    }
  }
}
</script>
```

## Nuxt Router Extras

Uma das coisas mais legais do NuxtJS é o seu ecosistema de módulos. Existem inúmeros módulos que mudam ou complementam o comportamento do NuxtJS. Entre eles, existe o `Router Extras`. Ele nos permite criar as rotas de uma maneira um pouco diferente do padrão do NuxtJS.

Vamos primeiramente instalar o `Router Extras`:

```bash
npm i -D @nuxtjs/router-extras
```

Feito isso, precisamos agora dizer ao Nuxt para usá-lo. Ele é um módulo que trabalha no momento do build do Nuxt, então declaramos na configuração `buildModules`:

```javascript [nuxt.config.js]
export default {
  buildModules: [
    '@nuxtjs/router-extras'
  ]
}
```

**Pronto, só isso. Agora podemos usá-lo a vontade. Simples né? Essa é a maravilha de se trabalhar com Nuxt**

### Definindo rotas

Como falei, com `Router extras` é um pouco diferente. Agora a gente vai definir as rotas, dentro dos arquivos das páginas entre as tags `<router></router>`

```vue [/pages/users/user.vue]
<router>
{
  path: '/users/{username}
}
</router>
<template>
  <div>...</div>
</template>
<script>
export default {
  ...
}
</script>
```

::alert{type="info"}

Observe que o nome do arquivo é `user.vue` e não `_username.vue`. Isso porque agora usamos o `Router extras` pra definir nossas rotas e parâmetros de rotas, então não importa o nome do arquivo, importa o que está dentro de `<router>`.

<br />

As rotas baseadas na estrutura do diretório `pages` continuam funcionando normalmente para as páginas que não tem `<router>`.

::

::alert{type="warning"}

Se você alterar uma rota enquanto o `npm run dev` estiver em execução, será necessário reiniciar para que o `Router Extras` crie a rota com o caminho alterado. Caso contrário, causará erro `404`.

::

### Alias e props

É possível definir também alias e props para os alias:

```html
<router>
 {
    path: '/posts',
    alias: [
      '/articles',
      '/blog'
    ]
 }
</router>
```

**Nota:** Para saber mais, basta acessar [Router Extras](https://github.com/nuxt-community/router-extras-module)

## @nuxtjs/router

Esse módulo traz o já conhecido método de definir rotas através de um arquivo `*.js` que comumente também chamamos de `router.js` ou `routes.js`.

Para usar basta seguir aquele método complicado:

```bash
npm i -D @nuxtjs/router
```

e 

```javascript [nuxt.config.js]
export default {
  buildModules: [
    '@nuxtjs/router'
  ]
}
```

::alert{type="info"}

Se estiver usando o Nuxt para criar uma aplicação SPA, coloque na configuração `generate` no `nuxt.config.js`:

```javascript [nuxt.config.js]
export default {
  generate: {
    routes: [
      '/'
    ]
  }
}
```

::

### Definindo rotas

Por padrão, o `@nuxtjs/router` vai atrás do arquivo `router.js` em `@/router.js` onde `@` é o alias do `srcDir` do NuxtJS, que por padrão é a raiz do projeto (Você pode mudar isso definindo outro path para `srcDir` em `nuxt.config.js`).

O arquivo `router.js` tem que exportar a função `createRouter` por padrão:

```javascript [router.js]
import Vue from 'vue'
import Router from 'vue-router'

import UserPage from '~/pages/users/user.vue'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/users/{user}',
        component: UserPage
      }
    ]
  })
}
```

Pronto, agora a partir daqui o `@nuxtjs/router` trabalha da mesma forma que o `vue-router` que você já deve ter ouvido falar por aí.

### Configurações

Existem mais outras opções pra se configurar no `@nuxtjs/router`, dá uma olhada [aqui](https://github.com/nuxt-community/router-module)

## Muito mais

Existem diversos recursos incríveis e fáceis de usar no roteamento do Nuxt.

- Podemos criar [transições](https://nuxtjs.org/docs/2.x/features/transitions) globais e por página entre as rotas de forma fácil
- Podemos ter [rotas aninhadas dinamicamente](https://nuxtjs.org/docs/2.x/features/file-system-routing#dynamic-nested-routes)
- Podemos ter uma [página que recebe rotas](https://nuxtjs.org/docs/2.x/features/file-system-routing#unknown-dynamic-nested-routes) que existem mas que não tem um padrão: `pages/_.vue`
- Podemos criar uma [extensão das rotas](https://nuxtjs.org/docs/2.x/features/file-system-routing#extending-the-router) geradas pelo Nuxt
- Podemos definir um [prefixo](https://nuxtjs.org/docs/2.x/features/file-system-routing#base) para todas as rotas
- Podemos configurar o [modo](https://nuxtjs.org/docs/2.x/features/file-system-routing#mode) como as rotas funcionarão
- Podemos implementar nossa própria função para [interpretar os `query params`](https://nuxtjs.org/docs/2.x/features/file-system-routing#parsequery--stringifyquery)
- Podemo mudar o [separador de rotas](https://nuxtjs.org/docs/2.x/features/file-system-routing#routenamesplitter), se você quiser mudar o jeito que o Nuxt cria o nome da s rotas
- Podemos definir o [comportamento do scroll](https://nuxtjs.org/docs/2.x/features/file-system-routing#scrollbehavior) nas mudanças de rotas. Ele salva pra você a posição da rota anterior
- Podemos inserir o [`trailing slash` (#)](https://nuxtjs.org/docs/2.x/features/file-system-routing#trailingslash) que por padrão é removido