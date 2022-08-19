---
title: Usando NuxtJS com Firebase
category: Vue
createdAt: 2021-02-01
---
Firebase é uma plataforma desenvolvida pelo Google para a criação de aplicativos móveis e da web. Ele tem recursos incríveis e uma facilidade enorme de se trabalhar. E o que é ainda melhor? Ele oferece um plano gratuido com uma cota de uso bem generosa! Aqui vou mostrar como usar o Firebase junto com o NuxtJS usando é claro, o módulo [`@nuxtjs/firebase`](https://firebase.nuxtjs.org/).

<!--more-->

## Instalação e configuração

<alert type="warning">

Não vou mostrar aqui como criar/configurar um projeto no Firebase. Você pode fazer isso seguindo a <a target="blank" href="https://firebase.google.com/docs/web/setup">documentação.</a>

</alert>

Vamos começar instalando o nosso módulo.

```bash
npm i @nuxtjs/firebase
```

Após isso, vamos partir para as configurações do `@nuxtjs/firebase`.

```javascript [nuxt.config.js]
export default {
  ...
  modules: [
    '@nuxtjs/firebase'
  ],
  firebase: {
    config: {
      apiKey: '<apiKey>',
      authDomain: '<authDomain>',
      databaseURL: '<databaseURL>',
      projectId: '<projectId>',
      storageBucket: '<storageBucket>',
      messagingSenderId: '<messagingSenderId>',
      appId: '<appId>',
      measurementId: '<measurementId>'
    }
  }
}
```

Agora vamos indicar quais serviços do firebase vamos utilizar, isso é necessário para o módulo `@nuxtjs/firebase` não importar tudo para nosso projeto desnecessariamente.

Vamos nesse exemplo indicar que iremos usar o serviço de autenticação e o database

```javascript [nuxt.config.js]
export default {
  ...
  modules: [
    '@nuxtjs/firebase'
  ],
  firebase: {
    config: {
      ...
    },
    services: {
      auth: true,
      database: true
    }
  }
}
```

Você pode ver a lista de serviços [aqui](https://firebase.nuxtjs.org/guide/options/#services)

## Autenticação com Firebase

<alert>

Para autenticação, não vamos usar o `@nuxt/auth-next`. Vamos usar o Vuex para gerenciar o usuário logado.

</alert>

### Usando Vuex

Uma opção legal que temos no `@nuxtjs/firebase` é que nas configurações do serviço de autenticação, podemos definir uma `mutation` ou uma `action` para quando houver login

```javascript [nuxt.config.js]
export default {
  ...
  firebase: {
    ...
    auth: {
      initialize: {
        onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION'
      }
    }
  }
}
```

Observe que mudamos de `auth: true` para `auth: { ... }`

Então criamos um `module` do Vuex para guardar o estado do usuário logado e a `mutation` `ON_AUTH_STATE_CHANGED_MUTATION` que configuramos para o serviço `auth` no `@nuxtjs/firebase`:

```javascript [store/auth.js]
export const state = () => ({
  user: null
})

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    if (authUser) {
      const { uid, email, emailVerified } = authUser
      state.user = { uid, email, emailVerified }
    } else {
      state.user = null
    }
  }
}
```

<alert type="warning">

Não use diretamente o objeto `authUser`, pois o `Vuex` vai salvar uma referência direta a ele e o Firebase irá atualizar constantemente esse objeto causando erros e alertas no `Vuex`. Para saber mais leia [aqui](https://firebase.nuxtjs.org/service-options/auth#onauthstatechangedmutation)

```js
export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    // NÃO FAÇA:
    state.user = authUser

    // FAÇA:
    const { uid, email, emailVerified } = authUser
    state.user = { uid, email, emailVerified }
  }
}
```
</alert>

### Login

Agora é só, na nossa página de login, chamarmos o método para realizar o login com Firebase:

```vue [pages/login.vue]
<template>
...
</template>
<script>
export default {
  ...
  methods: {
    login () {
      const provider = new this.$fireModule.auth.GoogleAuthProvider()
      this.$fire.auth.signInWithPopup(provider).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>
```

Se tiver erro, capturamos no `catch`. Se o login for com sucesso, a `mutation` `ON_AUTH_STATE_CHANGED_MUTATION` será chamada salvando o usuário o logado no `Vuex`. Então, para trabalhar com o usuário logado basta usar o `state` do módulo `auth` da nossa `store`

### Middleware

Pra ficar mais legal, vamos criar um `middleware` de autenticação que será responsável por restringir o acesso para certas páginas.

```javascript [middleware/authenticated.vue]
export default function ({ store, redirect }) {
  if (!store.state.auth.user) {
    return redirect('/login')
  }
}
```

E nas páginas que precisam de autenticação:

```vue [pages/secure-page.vue]
<template>
  <h1>Secret page</h1>
</template>
<script>
export default {
  middleware: 'authenticated'
}
</script>
```

Pronto, temos agora um projeto NuxtJS com Firebase com autenticação

## Database

Como trabalhamos com o `@nuxtjs/firebase` não precisamos nos preocupar com a inicialização dos serviços, o módulos nos poupa desse trabalho. Precisamos apenas usar os objetos já inicializados.

```javascript [pages/items]
export default {
  data() {
    return {
      items: []
    }
  },
  methods: {
    getItems () {
      const itemsRef = this.$fire.database.ref('/items')
      itemsRef.on('value', async (snapshot) => {
        this.items = snapshot.val()
      }
      this.$once('hook:beforeDestroy', () => {
        itemsRef.off()
      })
    }
  }
}
```

Como podemos ver, a maneira como trabalhamos não é muito diferente do que está documentado no [site do Firebase](https://firebase.google.com/docs/database/web/read-and-write). Por exemplo, o uso do objeto `this.$fire.database` que é o equivalente ao `firebase.database()`. Portanto, basta observarmos quais objetos/métodos precisamos usar do `@nuxtjs/firebase` para nos comunicar com o Database e outros serviços.

Para saber quais objetos você pode usar com o `@nuxtjs/firebase` basta verificar [aqui](https://firebase.nuxtjs.org/guide/usage/)

## Ambientes diferentes

O `@nuxtjs/firebase` nos dá a opção de configurar ambientes diferentes quando formos trabalhar com o Firebase. Podemos ter um projeto de `development` e outro para `production` assim mantemos os dados no Firebase organizados.

```javascript [nuxt.config.js]
export default {
  ...
  modules: [
    '@nuxtjs/firebase'
  ],
  firebase: {
    config: {
      development: {
        apiKey: '<apiKey>',
        authDomain: '<authDomain>',
        databaseURL: '<databaseURL>',
        projectId: '<projectId>',
        storageBucket: '<storageBucket>',
        messagingSenderId: '<messagingSenderId>',
        appId: '<appId>',
        measurementId: '<measurementId>'
      },
      production: {
        apiKey: '<apiKey>',
        authDomain: '<authDomain>',
        databaseURL: '<databaseURL>',
        projectId: '<projectId>',
        storageBucket: '<storageBucket>',
        messagingSenderId: '<messagingSenderId>',
        appId: '<appId>',
        measurementId: '<measurementId>'
      }
    }
  }
}
```

Não é necessário fazer mais nada para definir qual ambiente usar, pois ele usa de acordo com o valor da variável `NODE_ENV`. Essa variável já é populada pelo NuxtJS conforme o script que executamos. Se for `run dev` o valor será `development` e se for `run build` será `production`.

Se você quiser usar outra variável customizada, tem que lembrar de popular antes de executar os scripts. Para saber mais, basta ler a documentação do [`@nuxtjs/firebase`](https://firebase.nuxtjs.org/guide/options#customenv).

## O que foi usado nesse post

### Uso do `@nuxtjs/firebase`

Usamos esse módulo que nos ajuda a configurar e usar facilmente os serviços do Firebase.

#### Autenticação

Mostramos como podemos usar facilmente o serviço de autenticação do Firebase.

#### Serviços

Com o `@nuxtjs/firebase` não precisamos de muito esforço para configurar e usar os serviços do Firebase, basta saber quais [objetos/métodos](https://firebase.nuxtjs.org/guide/usage) do `@nuxtjs/firebase` usar.

#### Ambientes

O `@nuxtjs/firebase` nos permite facilmente definir diferentes projetos de acordo com o ambiente indicado pela variável `NODE_ENV`, nos ajudando a organizar os dados no Firebase.

### Vuex

Criamos um módulo do Vuex gerando apenas um arquivo chamado `auth.js` dentro do diretório `store` da nossa aplicação. O nome do arquivo vira o nome do módulo e definimos o `state` e uma `mutation` usada para salvar os dados do usuário autenticado.

### Middleware

Vimos como a simples criação de um arquivo no diretório `middleware` nos permite definir regras que são executadas antes da navegação para uma rota.

E o nome do arquivo é o nome do middleware. E usamos o `state` do módulo `auth` para saber se existe usuário logado ou não.


