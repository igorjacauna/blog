---
title: Porque uso NuxtJS
category: Vue
createdAt: 2021-01-01
---

Nuxt.js é uma estrutura de aplicativo da web gratuita e de código aberto baseada em Vue.js, Node.js, Webpack e Babel.js. O framework é anunciado como um "meta-framework para aplicações universais"

<!--more-->

Se tem algo do universo Vue que me deixa bastante satisfeito e produtivo, seria o NuxtJS. Esse framework facilita e muito o desenvolvimento de uma aplicação onde em questões de poucos minutos posso ter uma estrutura completa de uma aplicação com autenticação, rotas, layouts e gerenciamento de estado e com poucas linhas de código.

A ideia do NuxtJS, segundo os seus criadores, é trabalhar com os [Single File Components](https://br.vuejs.org/v2/guide/single-file-components.html).

## Instalação

Sendo bem simples, vamos criar um arquivo `package.json`

```json [package.json]
{
    "name": "exemplo-nuxt"
}
```

Então instalamos o `nuxt`.

```bash
npm i nuxt
```

## Rotas

Vamos criar nossa primeira rota. Para isso, basta criar um diretório `pages` e dentro dele criar a página inicial `index.vue`. 

```vue [pages/index.vue]
<template>
  <div>
    <h1>Home</h1>
  </div>
</template>
```

## Rodando aplicação

Agora para rodar nossa aplicação Nuxt, vamos incluir o `script` para isso no nosso arquivo `package.json`

```json [package.json]
{
    ...
    "scripts": {
      "dev": "nuxt"
    }
}
```

Agora se executarmos o  comando:

```bash
npm run dev
```

**Voilá!** Temos nossa aplicação rodando já com a primeira rota configurada.

Vamos poder acessar nossa aplicação em `http://localhost:3000`

<img src="/images/exemplo-nuxtjs/home.png" />

As rotas são baseadas nos arquivos e estrutura presente no diretório `pages`. Para entender como funciona, veja [essa seção](https://nuxtjs.org/docs/2.x/features/file-system-routing).

O NuxtJS já tem integrado `Vuex`, `Vue Router`, `Vue Meta` por exemplo. O que poupa nosso trabalho de configurar essas libs.

## Vuex

Se quisermos criar um módulo do `Vuex`, basta criar um arquivo `*.js` dentro do diretório `store` e automaticamente o NuxtJS "ativa" o `Vuex` e já usa o nome do arquivo como módulo. Por exemplo, se quiser criar um módulo que armazene o estado de um menu Drawer, para indicar em toda aplicação se está aberto ou fechado. 

<alert type="warning">

Aliás, é uma boa prática usar o Vuex apenas pada indicar estados globais, onde essa informação é utilizada em vários componentes independentes. Digo isso porque vejo muita gente usando Vuex como uma espécie de API para requisições no backend o que não é bom.
<br><br>
Veja um bom exemplo do uso do Vuex [aqui](/vue/nuxt-firebase)

</alert>

```javascript [store/drawer.js]
export const state = () => ({
  open: false
})

export const mutation = {
  SET_DRAWER_OPEN(state, open) {
    state.open = open
  }
}
```

Pronto, temos nosso módulo para indicar o estado do drawer da nossa aplicação.

Para usar em qualquer outro componente só utilizar o `$store` que o NuxtJS já injeta no contexto de toda a aplicação:

```vue [components/meu-component.vue]
<template>
  <div>
    {{ $store.state.drawer.open ? 'Drawer aberto' : 'Drawer fechado' }}
  </div>
</template>
<script>
export default {
  computed: {
    drawerOpen() {
      return this.$store.state.drawer.open
    }
  }
}
</script>
```

## Autenticação

Não é complicado incluir autenticação, basta instalar os módulos `@nuxtjs/axios` e `@nuxtjs/auth-next`

```bash
npm i @nuxtjs/axios @nuxtjs/auth-next
```

E para dizer ao NuxtJS quais módulos usar, criamos o arquivo `nuxt.config.js` e dizemos quais módulos ele deve usar:

```javascript [nuxt.config.js]
export default {
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-nex'
  ]
}
```

Agora só precisamos dizer ao `@nuxtjs/auth-next` quais endpoints ele deve usar e como ele deve ler as respostas dessas requisições. E isso fazemos no nosso arquivo `nuxt.config.js`:

```javascript [nuxt.config.js]
export default {
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-nex'
  ],
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token', // No response do endpoint de login, qual propriedade está contido o token
        },
        user: {
          property: 'user' // No endpoint do usuário, qual propriedade está contida os dados do usuário logado
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' }
        }
      }
    }
  },
  redirect: {
    login: '/login', // Rota para página de login
    logout: '/', // Rota para quando fizer logout
    home: '/' // Rota principal
  }
}
```

Agora, podemos usar o método do módulo `@nuxtjs/auth-next` pra realizar login:

```vue [pages/login.vue]
<template>
  <div>
    <form @submit.prevent="userLogin">
      <div>
        <label>Username</label>
        <input type="text" v-model="login.username" />
      </div>
      <div>
        <label>Password</label>
        <input type="text" v-model="login.password" />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async userLogin() {
      try {
        let response = await this.$auth.loginWith('local', { data: this.login })
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
```

Agora no contexto da nossa aplicação, podemos usar `this.$auth.user` para ler os dados do usuário logado e `this.$auth.loggedIn` para saber se tem algum usuário logado.

### Protegendo páginas para acesso

Para indicarmos quais páginas necessitam de autenticação, temos 2 formas. Em cada página podemos indicar o `middleware` `auth`:

```vue [pages/secure-page.vue]
<template>
 ...
</template>
<script>
export default {
  middleware: 'auth'
}
</script>
```

Ou definimos globalmente que por default todas as páginas vão ser protegidas por autenticação.

```javascript [nuxt.config.js]
export default {
  ...
  router: {
    middleware: ['auth']
  }
}
```

Se for definido globalmente, as páginas que não precisam de autenticação precisam indicar dessa forma:

```vue [pages/public-page.vue]
<template>
 ...
</template>
<script>
export default {
  auth: false
}
</script>
```

O `@nuxtjs/auth-next` ainda tem a opção `guest` onde apenas usuários **não autenticados** podem acessar:

```vue [pages/public-page.vue]
<template>
 ...
</template>
<script>
export default {
  auth: 'guest'
}
</script>
```

### Redirects

O `@nuxtjs/auth-next` ainda tem a inteligência de, óbviamente, deixar a página de login com acesso restrito a quem não está autenticado. Não precisamos incluir `auth: 'guest'` na página.

E ainda tem implementado também o redirecionamento automático para quando o usuário tenta acessar uma página protegida e ele está deslogado. Ou seja, após fazer login ele redireciona para a página que o usuário tentou acessar antes de fazer login.

## Buscando dados

O NuxtJS tem 2 `hooks` muito úteis para nossas requisições HTTP. Que são executados tanto do lado do servidor como no lado do cliente, dependendo de como estamos acessando a rota. O `fetch` que pode ser executado em qualquer componente e `asyncData` que é executado apenas nas páginas ou seja, nos componentes dentro do diretório `pages`.

### `fetch`

Gosto do `fetch` pois pode ser executado de qualquer componente e ainda nos dá informações com o `$fetchState`.

```vue [components/mountais.vue]
<template>
  <p v-if="$fetchState.pending">Fetching mountains...</p>
  <p v-else-if="$fetchState.error">An error occurred :(</p>
  <div v-else>
    <h1>Nuxt Mountains</h1>
    <ul>
      <li v-for="mountain of mountains">{{ mountain.title }}</li>
    </ul>
    <button @click="$fetch">Refresh</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        mountains: []
      }
    },
    async fetch() {
      this.mountains = await fetch(
        'https://api.nuxtjs.dev/mountains'
      ).then(res => res.json())
    }
  }
</script>
```

### `asyncData`

Já o `asyncData` só pode ser executado dentro das páginas. E ele não tem acesso ao `this` e também não tem nada que indique se está executando, se houve erro ou finalizou. Como no `fetch`.

```vue [pages/posts/_id.vue]
<template>
  <div>
    <h1>{{ post.title }}</h1>
    <p>{{ post.description }}</p>
  </div>
</template>

<script>
  export default {
    async asyncData({ params, $http }) {
      const post = await $http.$get(`https://api.nuxtjs.dev/posts/${params.id}`)
      return { post }
    }
  }
</script>
```

## Meta

Se você também quer trabalhar com SEO, você pode usar o método `head` nas páginas, para configurar as informações Meta:

```vue [pages/index.vue]
<template>
  <h1>{{ title }}</h1>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Hello World!'
      }
    },
    head() {
      return {
        title: this.title, // Título da página
        meta: [ // Meta tags
          {
            hid: 'description',
            name: 'description',
            content: 'My custom description'
          }
        ]
      }
    }
  }
</script>
```

## Layouts

Uma das coisas legais do NuxtJS são os layouts, que nos permite definir o layout da nossa aplicação evitando que a gente fique replicando um componente em todas as páginas:

```vue [layouts/blog.vue]
<template>
  <div>
    <div>My blog navigation bar here</div>
    <Nuxt />
  </div>
</template>
```

Então, nas suas páginas:

```vue [pages/blog.vue]
<template>
  <div>
    <div>This is below my navigation bar</div>
  </div>
</template>
<script>
export default {
  layout: 'blog',
  // OU
  layout (context) {
    return 'blog'
  }
}
</script>
```

Para definir um layout padrão, só criar um arquivo chamado `default.vue` dentro do diretório `layouts`.

### Páginas de erro

O NuxtJS nos ajuda também a customizar facilmente as páginas de erros. Basta criar um arquivo `error.vue` dentro de `layouts/`

```vue [layouts/error.vue]
<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>An error occurred</h1>
    <NuxtLink to="/">Home page</NuxtLink>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'blog' // A gente pode usar um layout customizado também para a página de erro
}
</script>
```

## Componentes

O NuxtJS nos poupa a importação de componentes em qualquer lugar onde forem utilizados. No VueJS puro, precisamos declarar quando vamos utilizar um componente:

```vue 
<template>
  <div class="container">
    <my-component></my-component>
  </div>
</template>

<script>
import MyComponent from '@/components/MyComponent.vue'
export default {
  components: {
    MyComponent
  }
}
</script>
```

No NuxtJS a partir da versão 2.13, não precisamos disso. Basta configurar a flag `components: true` no `nuxt.config.js`.

```javascript [nuxt.config.js]
export default {
  ...
  components: true
}
```

Pronto, o NuxtJS vai importar o componente no momento do build, então não precisamos declarar mais.

```vue 
<template>
  <div class="container">
    <my-component></my-component>
  </div>
</template>
```

NuxtJS é inteligente o bastante para fazer a importação no build.

## Variáveis de ambiente

Sabe quando precisamos configurar variáveis de ambiente para nossa aplicação? No NuxtJS basta criar um arquivo .env e pronto. Não precisa configurar nem instalar nada a mais.

### Runtime

E sabe o que é demais? As variáveis podem ser em **Runtime**! Não precisamos re-compilar tudo quando mudamos um valor! Basta no `nuxt.config.js` indicar essas variáveis. E tem mais, podemos configurar quais variáveis são públicas e quais são privadas. As variáveis privadas só estarão disponíveis na execução do lado do servidor. As públicas vão estar tando no lado do servidor como do cliente.

```env [.env]
BASE_URL=http://api.com
API_SECRET=secret-api
```

```javascript [nuxt.config.js]
export default {
  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL
  },
  privateRuntimeConfig: {
    apiSecret: process.env.API_SECRET
  }
}
```

Para usar essas variáveis? Vai estar tudo dentro da propriedade `$config` no contexto da aplicação.

```vue [pages/index.vue]
<template>
  <p>Our Url is: {{ $config.baseURL}}</p>
</template>
<script>
  asyncData ({ $config: { baseURL } }) {
    const posts = await fetch(`${baseURL}/posts`)
      .then(res => res.json())
  }
</script>
```

```vue [components/my-component.vue]
<template>
  <p>Our Url is: {{ $config.baseURL}}</p>
</template>
<script>
  async fetch () {
    const posts = await fetch(`${this.$config.baseURL}/posts`)
      .then(res => res.json())
  }
</script>
```

Dá uma olhada [aqui](https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config) pra saber mais.

## Muito mais

O NuxtJS facilita muito nosso trabalho para integração de plugins e módulos.

### Plugins

Sabemos que existe uma grande variedade de plugins do VueJS. Aqueles plugins que usamos com `Vue.use(MyPlugin)`. E podemos muito bem usar esses plugins no NuxtJS. Muitos plugins do VueJS funcionam bem apenas no lado do cliente, o NuxtJS nos permite definir o uso de um plugin apenas do lado do cliente.

Para usar um plugin, basta indicar isso no nosso arquivo `nuxt.config.js`

```javascript [nuxt.config.js]
export default {
  plugins: [
    '@/plugins/my-plugin']
  ]
}
```

E no nosso arquivo usar: 

```javascript [plugins/my-plugin.js]
import Vue from 'vue'
import MyPlugin from 'my-plugin'

Vue.use(MyPlugin)
```

Para os casos onde o plugin deve rodar apenas do lado do cliente:

```javascript [nuxt.config.js]
export default {
  plugins: [
    '@/plugins/my-plugin.client']
  ]
}
```

E no nosso arquivo: 

```javascript [plugins/my-plugin.client.js]
import Vue from 'vue'
import MyPlugin from 'my-plugin'

Vue.use(MyPlugin)
```

<alert type="warning">

Caso não tenha percebido, para dizer pro NuxtJS usar o plugin apenas do lado do cliente, a gente só precisa nomear o arquivo com `*.client.js`
<br><br>
No nosso arquivo de exemplo `my-plugin.js` virou `my-plugin.client.js`. Isso basta para o NuxtJS entender que só deve usar o plugin no lado do cliente.

</alert>

<alert>

Os plugins também podem ser usados para configurar `Vue.directive(...)`, `Vue.mixin(...)` e outras coisas, inclusive alterar comportamentos de módulos como, por exemplo, criar `interceptors` para `@nuxtjs/axios`. Sugiro ver a [documentação do NuxtJS](https://nuxtjs.org/docs/2.x/directory-structure/plugins)

</alert>

### Módulos

Recomendo explorar [alguns dos módulos nesse site oficial](https://modules.nuxtjs.org/) que podem facilitar e muito o nosso trabalho.

### Exemplo de facilidade

Quer um exemplo de como é fácil integrar um módulo?

Crie uma conta no [`Ngrok`](https://ngrok.com/) e obtenha um token.

Instale o módulo do `Ngrok`.

```bash
npm install @nuxtjs/ngrok
```

Configure o NuxtJS para usar o módulo e configure o token

```javascript [nuxt.config.js]
export default {
  ...
  buildModules: [
    '@nuxtjs/ngrok',
  ],
  ngrok: {
    authtoken: <NGROK_AUTHTOKEN>
  }
}
```

Pronto. Agora quando executar `npm run dev` uma URL no Ngrok será criada e você pode compartilhar com qualquer pessoa no mundo que ela vai poder acessar sua aplicação na sua máquina.

<img src="/images/exemplo-nuxtjs/ngrok.png" />

<alert>

Ah, não se preocupe. O módulo é inteligente o suficente pra não fazer isso quando o NuxtJS estiver rodando em produção. Ele só irá fazer isso no modo `development`. Legal né?

</alert>

## Dica

O NuxtJS tem muitos outros recursos fáceis de configurar e usar.

Outro dia vi o pessoal de VueJS perguntando como detectar quando usuário está online ou offline da internet. O NuxtJS tem `$nuxt.isOffline` e `$nuxt.isOnline` já implementado pra isso.

Ele trabalha com um **Smart Prefetching** quando usamos `NuxtLink` como componente de link de navegação para nossas rotas. Assim ele já prepara antecipadamente os arquivos a serem usados nas rotas. Isso aumenta consideravelmente a performance de navegação. Para saber mais [leia aqui](https://nuxtjs.org/blog/introducing-smart-prefetching#introducing-smart-prefetching-%EF%B8%8F)

O módulo `@nuxtjs/pwa` é ótimo para configurar nossa aplicação como PWA sem muito esforço e poucas linhas no `nuxt.config.js`

Precisa de algo com `i18n`? O módulo `nuxt-i18n` vai ser uma mão na roda pra isso. Já se integra com o `Vue Router` sem fazer nada praticamente.

Recomendo fortemente uma leitura na [documentação](https://nuxtjs.org/docs/2.x/get-started/installation) e estudo dos [exemplos oficiais](https://nuxtjs.org/examples) para ver como é fácil trabalhar com ele.

Esse blog? Fiz puramente com NuxtJS e o módulo `@nuxtjs/content`