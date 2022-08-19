# Criando um chat em 25 minutos com NuxtJS + Vuetify + Firebase

:::warning Atenção

Usamos a versão 2.* do Nuxt nesse post, algumas coisas podem ser diferentes para versão 3.*

:::

<iframe width="100%" height="480" src="https://www.youtube.com/embed/PuJkxnZ4734" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

NuxtJS como já sabemos é um framework incrível feito com VueJS. Ele facilita muito o trabalho e o objetivo dele é de trabalharmos o máximo nos arquivos `*.vue`

Vamos aprender agora como construir uma aplicação de chat em tempo real com ele, mais o framework de UI `Vuetify` e o Firebase com seu `Realtime Database`.

<!--more-->

## Dependências

Inicialmente, nosso `package.json` começa com:

```json [package.json]
{
  "name": "chat",
  "dependencies": {
    "@nuxtjs/firebase": "^7.4.1",
    "firebase": "^8.2.6",
    "nuxt": "^2.14.12"
  },
  "devDependencies": {
    "@nuxtjs/vuetify": "^1.11.3"
  }
}
```

Temos então as dependências:

- [`@nuxtjs/firebase`](https://firebase.nuxtjs.org/) - Módulo do `Nuxt` para ajudar na integração com os serviços do Firebase
- [`firebase`](https://firebase.google.com/) - O Firebase em si, que é usado pelo `@nuxtjs/firebase`
- [`nuxt`](https://nuxtjs.org/) - Não preciso dizer nada né?
- [`@nuxtjs/vuetify`](https://github.com/nuxt-community/vuetify-module) - Por último mas não menos importante, nosso Framework de UI `Vuetify`. Lembrando que com NuxtJS você pode usar qualquer framework de UI, o `npx create-nuxt-app <appname>` te dá um lista de opções.

Roda aí o `npm ci` pra instalar as dependências. 

:::info

Porque `ci` e não `install`? Porque o `ci` instala a partir do `package-lock.json`. Isso evita que o `npm` tente atualizar os pacotes definidos no `package.json`. É útil para builds automáticos em Integração Contínua. Fica a dica.

:::

## Scripts

Bem, como é pra ser simples, vamos usar apenas o comando `nuxt` por enquanto. Pra saber dos outros comandos [leia aqui.](https://nuxtjs.org/docs/2.x/get-started/installation#set-up-your-project)

```json [package.json]
{
  ...
  "scripts": {
    "dev": "nuxt"
  }
  ...
}
```

## `nuxt.config.js`

O `Nuxt` usa um arquivo onde definimos algumas configurações para ele. Ele funciona sem esse arquivo, mas muito provavelmente você terá que utilizar.

```javascript [nuxt.config.js]
export default {
  ssr: false, // Não será Server Side Render
  target: 'static',
  modules: [
    '@nuxtjs/firebase'
  ],
  buildModules: [
    '@nuxtjs/vuetify'
  ],
  firebase: {
    config: {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: ""
    },
    services: {
      auth: {
        initialize: {
          onAuthStateChangedMutation: 'auth/SET_USER'
        },
      },
      database: true
    }
  }
}
```

Sobre porque temos `ssr: false` só checar [aqui](https://nuxtjs.org/docs/2.x/features/deployment-targets)

:::warning

Não esqueça de criar um banco de dados no Firebase após criar seu projeto lá. E preencha o `databaseURL` após criar o banco. As configurações do Firebase são obrigatórias para o módulo `@nuxtjs/firebase`. Por motivos óbvios né.

:::

### `modules` e `buildModules`

Nem todo módulo do `Nuxt` precisa ser executado em `runtime` pela aplicação, alguns bastam ser executados no `build`. Temos nesse caso o módulo `@nuxtjs/vuetify`. Já o módulo `@nuxtjs/firebase` ele é executado em `runtime`, pois ele inicializa o Firebase para ser utilizado pela nossa aplicação.

## Firebase Services

No nosso arquivo `nuxt.config.js`, criamos uma seção `firebase` onde definimos algumas configurações para o módulo `@nuxtjs/firebase`.

```javascript [nuxt.config.js]
export default {
  ...
  firebase: {
    config: {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: ""
    },
    services: {
      database: true,
      auth: {
        initialize: {
          onAuthStateChangedMutation: 'auth/SET_USER'
        },
      }
    }
  }
  ...
}
```

Observe que além do `config`, que é onde definimos as configurações de conexão com Firebase. temos também a `services`, que definimos quais serviços vão ser inicializados pelo módulo. No caso vamos usar o `database` e o `auth`. Pra ativar um serviço basta passar `true` como foi no caso do database, mas se precisar de alguma configuração extra, podemos incluir como foi o caso do `auth`.

Com `onAuthStateChangedMutation` dizemos para o módulo chamar uma `mutation` em caso de [alteração do `auth` no Firebase](https://firebase.google.com/docs/auth/web/manage-users). Assim, não precisamos configurar nada diretamente, o módulo faz pra gente. É possível usar uma `action` também. [Veja aqui como](https://firebase.nuxtjs.org/service-options/auth#initialize).

Pra saber todos os serviços só [ver aqui](https://firebase.nuxtjs.org/guide/getting-started).

## Layouts

Pois bem, módulos configurados. Vamos para nossos layouts. Vamos criar 2 layouts. Um será o padrão e outro usado apenas na página de `login`.

Esse será o layout padrão:

```vue [layouts/default.vue]
<template>
  <v-app>
    <v-app-bar app>
      <v-avatar>
        <img :src="$store.state.auth.user.photoURL" />
      </v-avatar>
      <v-btn text @click="logout()">Sair</v-btn>
    </v-app-bar>
    <v-main app>
      <nuxt />
    </v-main>
  </v-app>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$fire.auth.signOut()
      this.$router.replace('/')
    }
  }
}
</script>
```

Observe que já estamos usando a store com `$store.state.auth.user.photoURL`. Mas não se preocupe que vamos definir isso mais tarde.

Observe também que usamos o `$router`. O `Nuxt` já vem integrado com o `Vue Router`.

A `props` `app` passada para `v-app-bar` e `v-main` servem para o `Vuetify` identificar componentes do layout e manipular corretamente. [Veja mais detalhes aqui](https://vuetifyjs.com/en/components/application/#default-application-markup)

O componente `<nuxt />` é responsável por indicar no nosso layout, onde as rotas serão renderizadas.

Para o nosso layout de login:

```vue [layouts/default.vue]
<template>
  <v-app>
    <v-main app>
      <nuxt />
    </v-main>
  </v-app>
</template>
```

## Pages

Agora vamos para as nossas páginas ou rotas se preferir chamar assim.

A primeira será a nossa `home` que na verdade será a página de `login`. Então criamos o diretório `pages` e dentro dele o arquivo `index.vue`.

### Home

```vue [pages/index.vue]
<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-btn color="primary" x-large dark @click="login"> Login </v-btn>
    </v-row>
  </v-container>
</template>
<script>
export default {
  layout: 'login',
  methods: {
    async login() {
      const provider = new this.$fireModule.auth.GoogleAuthProvider();
      await this.$fire.auth.signInWithPopup(provider);
    },
  },
  watch: {
    '$store.state.auth.user'() {
      if (this.$store.state.auth.user) {
        this.$router.replace('/chats');
      }
    },
  },
  beforeMount() {
    if (this.$store.state.auth.user) {
      this.$router.replace('/chats');
    }
  },
};
</script>
```

A página contém só um botão pra fazer login. E temos um `watch` para quando o usuário estiver logado, substituir a página atual pela página que lista os `chats`.

E claro, temos também o `beforeMount` para quando estiver acessando ou dando refresh na página na rota `/` e já exista usuário logado, substituímos a página com a página de `chats`. Isso é só pra evitar um usuário logado de acessar a página de login, já que isso não faria sentido.

#### `$fire` vs `$fireModule`

Existem maneiras diferentes de acessar certos recursos do Firebase pelo módulo `@nuxtjs/firebase`. Pra saber qual recurso usar de acordo com a documentação do Firebase, só dar uma olhada [aqui](https://firebase.nuxtjs.org/guide/usage)

#### Layout

Observe que definimos explicitamente o layout para a página do login com `layout: 'login'`. Para as demais páginas o `Nuxt` vai usar o layout `default`.

### Chats

Essa página vai listar os chats criados e também dar a possibilidade de criar um novo chat.

```vue [pages/chats.vue]
<template>
  <v-container>
    <v-row no-gutters>
      <v-text-field v-model.trim="chatName" hide-details outlined class="mr-2"></v-text-field>
      <v-btn color="primary" x-large :disabled="chatName === ''" @click="newChat">Novo chat</v-btn>
    </v-row>
    <v-row>
     <v-col>
       <v-card>
         <v-list>
          <v-list-item v-for="(chat, index) of chats" :key="index" :to="`/chat/${chat.id}`">
            <v-list-item-content>
              {{ chat.name }}
            </v-list-item-content>
          </v-list-item>
         </v-list>
       </v-card>
     </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  middleware: 'auth',
  fetch() {
    const chats = this.$fire.database.ref('chats')
    chats.on('child_added', snapshot => {
      this.chats.push({
        id: snapshot.key,
        ...snapshot.val()
      })
    })
    this.$on('hook:beforeDestroy', () => {
      chats.off()
    })
  },
  data() {
    return {
      chats: [],
      chatName: ''
    }
  },
  methods: {
    newChat() {
      const ref = this.$fire.database.ref('chats').push()
      ref.set({
        name: this.chatName
      })
      this.chatName = ''
    }
  }
}
</script>
```

#### `trim`

Uma das coisas legais que o `Vue` tem é o modificador `trim` nos `v-model`. Isso faz com que automaticamente o `Vue` já faça o `trim` do input, removendo os espaços nas bordas da string. Ajuda com o problema de submeter strings vazias através de um `input`. Existe também o modificador `number` que faz com que `'4'` se torne um `4`. Dá uma olhada [aqui](https://vuejs.org/v2/guide/forms.html#Modifiers) pra saber mais.

#### `fetch`

Isso é um `hook` do `Nuxt`, ele ajuda a definir ações de fetch para todo e qualquer componente, seja página ou não. Ele cria indicadores do estado, quando retornamos uma promise no `fetch`, com `$fetchState` como `$fetchState.pending` ou `$fetchState.error` pra ajudar a criar loadings ou mensagens de erro. Pra saber mais só [olhar aqui](https://nuxtjs.org/docs/2.x/components-glossary/pages-fetch)

#### `$on('hook:beforeDestroy')`

No caso do Firebase, é necessário "desligar" certos listeners quando saímos de uma página caso contrário, continuarão funcionando. Pra evitar salvar uma instância de um `ref` no `data` e aumentar o consumo de memória pois o Vue acabaria por tornar reativo o `ref`, podemos usar o `hook:beforeDestroy`. É o mesmo que usarmos o `beforeDestroy()` do componente, com a diferença de que não vou precisar usar o `data()` pra salvar uma referência de algo pra usar no `beforeDestroy()` do componente.

### Chat

A nossa última página, o chat em si. Pra entender o nome do arquivo, sugiro ler [esse artigo](/blog/Vue/diferentes-rotas-nuxt)

```vue [pages/chat/_id.vue]
<template>
  <v-container fill-height>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-btn icon @click="$router.back()">
              <v-icon> mdi-chevron-left </v-icon>
            </v-btn>
          </v-toolbar>
          <v-list max-height="400px" min-height="400px">
            <v-list-item-group>
              <v-list-item v-for="(message, index) of messages" :key="index">
                <v-avatar color="secondary" size="32" class="mr-2">
                  <img :src="message.photo" v-if="message.photo" />
                  <span v-else>{{ message.author[0] }}</span>
                </v-avatar>
                <span>
                  <b>{{ message.author }}:</b> {{ message.message }}
                </span>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-divider> </v-divider>
          <form @submit.prevent="sendMessage">
            <v-card-actions class="pa-5">
              <v-row>
                <v-text-field
                  v-model.trim="message"
                  class="mr-2"
                  hide-details
                  outlined
                  full-width
                  placeholder="Digite sua mensagem"
                >
                </v-text-field>
                <v-btn
                  x-large
                  color="primary"
                  :disabled="message === ''"
                  type="submit"
                  >Enviar</v-btn
                >
              </v-row>
            </v-card-actions>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  middleware: 'auth',
  fetch() {
    this.room = this.$fire.database.ref(
      `/chats/${this.$route.params.id}/messages`
    );
    this.room.on("child_added", (snapshot) => {
      this.messages.unshift(snapshot.val());
      this.message = "";
    });
    this.$on("hook:beforeDestroy", () => {
      this.room.off();
    });
  },
  data() {
    return {
      room: null,
      messages: [],
      message: "",
    };
  },
  methods: {
    sendMessage() {
      this.room.push({
        author: this.$store.state.auth.user.displayName,
        photo: this.$store.state.auth.user.photoURL,
        message: this.message,
      });
    },
  },
};
</script>
```

Usamos um `<form>` porque é mais conveniente apertar `<ENTER>` pra enviar mensagem. E usamos o modificador `.prevent` no `@submit` pra obviamente prevenir o comportamento padrão do `<form>` quando ele é submetido.

## Middleware

Pois bem, construídas as páginas, vamos ao nosso `middleware`. Ele será responsável por permitir ou não o acesso a uma página onde fica definido o seu uso.

```javascript [middleware/auth.js]
export default ({ store, redirect }) => {
  if (!store.state.auth.user) {
    redirect('/')
  }
}
```

Ele é bem simples. Um middleware no `Nuxt` recebe um contexto como parâmetro, nós descontruímos esse contexto para só trabalhar com o `store` do `Vuex` e com a função de `redirect`.

Agora nas nossas páginas, você deve ter percebido que definimos o uso desse nosso `middleware` apenas passando: `middleware: 'auth'`:

```vue [pages/chats.vue]
<template>
...
</template>
<script>
export default {
  middleware: 'auth',
  ...
}
</script>
```

## Store

Por último, vamos criar nosso `store` do `Vuex`. Não há nada complicado aqui, basta criar um arquivo `auth.js` dentro do diretório `store` que o `Nuxt` passará a usar o `Vuex` e já criará um módulo `Vuex` com `namespace` `auth` (que é o mesmo nome do arquivo)

```javascript [store/auth.js]
export const state = () => ({
  user: null
})

export const mutations = {
  SET_USER(state, { authUser }) {
    if (authUser) {
      const { displayName, photoURL } = authUser
      state.user = {
        displayName,
        photoURL
      }
    } else {
      state.user = null
    }
  }
}
```

No nosso módulo, definimos o `state` e uma `mutation`.

Essa `mutation` é usada pelo `@nuxtjs/firebase` lembra? [Configuramos](#firebase-services) ele pra usar essa `mutation` quando houver alteração no `auth` do firebase.

## Executar

Isso é tudo, agora só rodar `npm run dev` e ver nossa aplicação funcionando.

## Repositório

O código dessa aplicação se encontra no [GitHub](https://github.com/igorjacauna/chat-nuxtjs). 