---
title: Construindo uma aplicação full-stack com NuxtJS e Firestore DB
category: Vue
createdAt: 2021-01-12
---

Firebase e NuxtJS são ferramentas muito úteis quando queremos desenvolver aplicações de forma rápida e segura. O Firebase vem com uma pilha de serviços que podem ser usados gratuitamente, o que ajuda na hora criar uma prova de conceito ou aplicações que possam escalar rapidamente.

Vamos aprender um pouco como construir uma aplicação assim com NuxtJS.

<!--more-->

## Configurando projeto no Firebase

Antes de começarmos a trabalhar com o NuxtJS, precisamos primeiro configurar um projeto no Firebase. Então acesse [esse link](https://console.firebase.google.com/) e crie um novo projeto Firebase. De todos os recursos que o Firebase oferece, vamos utilizar apenas o Cloud Firestore. Firestore é um banco de dados NoSQL.

### Criando o banco

No menu a esquerda, procure por Cloud Firestore e crie um novo banco de dados. Inicie o banco em `modo de produção`.

### Gerando chaves privadas

Após criar o banco de dados, vamos pegar as credenciais para o Node ter permissão de leitura e escrita. No ícone de configuração ao lado de **Visão geral do projeto**, clique em **Configuração do projeto**. Na aba **Contas de serviço** clique em **Gerar nova chave privada**. Vai gerar um arquivo JSON que será usado pelo Node. Salve o arquivo, ele será usado mais tarde.

## Configurar NuxtJS

Agora vamos criar a nossa aplicação NuxtJS. A maneira mais comum é usando `create-nuxt-app` onde você escolhe algumas features que vão estar presentes na sua aplicação.

Você precisa ter o npx instalado: `npm i -g npx`

<alert>

Nâo esqueça que vamos trabalhar com SSR. Então deixe a opção de SSR marcada quando for perguntado.

Selecione também o uso do `@nuxtjs/axios`.

</alert>

```bash
npx create-nuxt-app nuxtapp
```

Para saber mais spbre as opções que são oferecidas no comando acima, leia esse [link](https://github.com/nuxt/create-nuxt-app/blob/master/README.md).

Depois de responder tudo, ele vai instalar as dependências e você só precisa entrar no diretório e rodar o NuxtJS.

```bash
cd nuxtapp
npm run dev
```

Pronto, você pode acessar `localhost:3000` onde irá ver a primeira página do nosso app.

## Conectando ao banco de dados

### Instalando `firebase-admin`

O nosso próximo passo é instalar o `firebase-admin` e criar o arquivo de conexão com o banco `firebase/db/index.js`.

```bash
npm i firebase-admin
```

Agora vamos definir as configurações no nosso arquivo `firebase/db/index.js`.

Lembra que falei pra guardar o arquivo da credencial gerado no Console do Firebase? É aqui que vamos usá-lo.

```javascript [firebase/db/index.js]
import admin from 'firebase-admin';
import serviceAccount from '@/firebase/serviceAccountKey.json';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "DATABASE_URL"
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}
export default admin.firestore();
```

Esse arquivo será usado para acessarmos o nosso banco no Firestore. Basicamente, ele será a nossa conexão com o banco.

## Criando os endpoints

### Diretório da API

Vamos criar um diretório onde vão estar nossos endpoints e tudo relacionado a nossa API. A ideia é usar o `serverMiddleware` do NuxtJS para direcionar as requisições para nossos endpoints de API.

Então, criamos o arquivo `api/index.js`. Nosso `serverMiddleware` pode muito bem ser uma aplicação `Express` completa o que nos permite trabalhar do jeito que quisermos na API.

```javascript [api/index.js]
import db from 'firebase/db'
import express from 'express'

const app = express()

export default app
```

### Configurando API

E então no `nuxt.config.js` definimos o nosso midleware para repassar requisições para nossa API:

```javascript [nuxt.config.js]
export default {
  ...
  serverMiddleware: [
    { path: '/api', handler: '@/api/index.js' }
  ]
}
```

Assim, todas as requisições feitas com `axios` que tenham o prefixo `/api/*` serão redirecionados para a nossa aplicação `express` em `api/index.js`.

Então nosso app NuxtJS agora consegue manipular requisições REST se a URL começar com `http://localhost:3000/api/*`

Manipularemos quatro métodos diferentes. `POST`, `GET`, `PUT` e `DELETE`.

Vamos começar pelo `POST` que servirá para criar uma publicação.

### Endpoints

Vamos editar então nosso arquivo `api/index.js` para criar nosso primeiro endpoint:

```javascript [api/index.js]
import db from 'firebase/db'
import express from 'express'

const app = express()

app.post('/post', async (req, res) => {
  try {
    const { title, content, slug } = req.body
    const posts = await db.collection('posts').get()
    const postsData = posts.docs.map((post) => post.data())
    if (postData.some(post => post.slug == slug )) {
      res.status(400).end()
    } else {
      const { id } = await db.collection('posts').add({
        ...req.body,
        created: new Date().toISOString(),
      });
      res.status(201).end()
    }
  } catch {
    res.status(400).end()
  }
});

export default app
```

<alert>

Observe que por ser uma aplicação `express`, nós definimos os verbos da requisição como:

- `app.post(...)`
- `app.get(...)`
- `etc`

É possível criar de outras formas, só ver [aqui](https://expressjs.com/pt-br/guide/routing.html).

</alert>

Importamos o objeto `db` do nosso arquivo `firebase/db` para assim conseguirmos trabalhar com o Firestore.

Para validar se o artigo existe ou não, nós usamos a propriedade `slug`. Se já tiver um artigo com mesmo `slug` então retornamos o erro `400`. Caso contrário, adicionamos a nossa coleção `posts` no nosso banco de dados do Firestore.

Nosso artigo teria essa estrutura: 

```javascript
{
  title: 'Título do artigo',
  slug: 'titulo-do-artigo`,
  content: 'Conteúdo do artigo`
}
```

Na hora que vamos adicionar no Firestore, incluímos ainda a propriedade `created` com a data de criação.

```javascript
{
  ...,
  created: new Date().toISOString(),
}
```

Agora vamos criar os outros endpoints.

### Recuperando um item ou uma lista

```javascript [api/index.js]
...

app.get('/posts/:id?', async (req, res) => {
  try {
    if (req.params.id) {
      const doc = await db.collection('posts').doc(req.params.id).get();
      res.status(200).json(doc.data());
    } else {
      const posts = await db.collection('posts').orderBy('created').get();
      const postsData = posts.docs.map(post => ({
        id: post.id,
        ...post.data()
      }));
      res.status(200).json(postsData)
    }
  } catch {
    res.status(400).end()
  }
})

...
```

Nessa rota da nossa aplicação `express`, definimos um parâmetro opcional que seria o `id`. Se ele estiver presente, então retornamos o objeto. Caso contrário retornamos a lista de artigos.

### Removendo ou atualizando um item

```javascript [api/index.js]
...

app.delete('/posts/:id', async (req, res) => {
  try {
    const doc = await db.collection('posts').doc(req.params.id).get();
    res.status(200).json(doc.data());
  } catch {
    res.status(400).end()
  }
})

app.put('/posts/:id', async (req, res) => {
  try {
    await db.collection('posts').doc(req.params.id).update({
      ...req.body,
      updated: new Date().toISOString(),
    });
    res.status(200).end()
  } catch {
    res.status(400).end()
  }
})

...
```

Então já temos todos os endpoints prontos para receber nossas requisições. Vamos construir agora nossas páginas.

## Criando as páginas

Vamos criar então, dois "ambientes" o `/admin` para publicarmos nossos artigos e `/posts` para exibição das publicações.

### Layout

Antes de começarmos a construir as páginas, vamos primeiro definir nossos layouts. Vamos usar dois layouts. Um para `/admin` e outro para o restante da aplicação.

NuxtJS nos permite definir layouts diferentes para nossas rotas. Isso facilita na hora de construir as páginas, pois não precisamos inserir toda vez componentes que sempre estarão presentes como *Barra superior de navegação*, *Menus laterais*, etc.

A ideia dos layouts do NuxtJS é similar com outros frameworks. Basta definir um "esqueleto" da aplicação e usar o componente `<nuxt />` para indicar onde as nossas rotas serão renderizadas, por exemplo:

```vue [my-layout.vue]
<template>
  <div class="my-app">
    <TopBar />
    <SideMenu />
    <nuxt /> <!-- As rotas serão renderizadas aqui -->
    <Footer />
  </div>
</template>
```

<alert>

No meu exemplo, usarei o TailwindCSS como framework de UI. Você pode usar o que achar melhor.

</alert>

### Layout /admin

Vamos criar o layout para a página de `/admin`. Criamos o arquivo `admin.vue` no diretório `layouts`

```vue [layouts/admin.vue]
<template>
  <div class="h-screen w-full flex">
    <nav
      class="flex flex-col bg-gray-200 w-64 px-12 pt-4 pb-6"
    >
      <div class="flex flex-row border-b items-center justify-between pb-2">
        <span class="text-lg font-semibold capitalize">
          App
        </span>        
      </div>

      <NuxtLink
        to="/admin/novo"
        class="mt-8 flex items-center justify-between py-3 px-2 text-white bg-green-400 dark:bg-green-500 rounded-lg shadow"
      >
        <span>Novo post</span>
        <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
        </svg>
      </NuxtLink>

      <ul class="mt-2 text-gray-600">
        <li class="mt-8">
          <NuxtLink to="/admin" class="flex">
            <svg
              class="fill-current h-5 w-5 dark:text-gray-300"
              viewBox="0 0 24 24"
            >
              <path
                d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6
							4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6
							4h4v-4h-4M4 8h4V4H4v4z"
              ></path>
            </svg>
            <span
              class="ml-2 capitalize font-medium text-black dark:text-gray-300"
            >
              Posts
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <main
      class="flex-1 flex flex-col bg-gray-100 overflow-y-auto"
    >
      <nuxt /> <!-- Nossas rotas serão renderizadas aqui -->
    </main>
  </div>
</template>
```

Definido o layout de admin, vamos criar a primeira página da seção **admin**

### admin/index.vue

Criando um arquivo em `pages/admin/index.vue` criará nossa primeira rota para admin. Sim, não precisamos criar nenhum outro arquivo `JavaScript`. Por padrão, o NuxtJS trabalha com estrutura de arquivos dentro do diretório `pages` para definir as rotas.

Então, `pages/admin/index.vue` vai se tornar a rota `http://localhost:3000/admin`. Como o arquivo tem o nome `index.vue` não precisamos incluir na URL da rota.

Nessa nossa rota, vamos listar os artigos existentes:

```vue [pages/admin/index.vue]
<template>
  <div class="mx-10 my-2">
    <h2 class="my-4 text-4xl font-semibold dark:text-gray-400">Posts</h2>
    <div
      class="pb-2 flex items-center justify-between text-gray-600 dark:text-gray-400 border-b dark:border-gray-600"
    >
      <div>
        <span>
          <span class="text-green-500 dark:text-green-200"> {{ posts.length }} </span>
          posts
        </span>
      </div>
    </div>
    <NuxtLink
      v-for="(post, index) of posts"
      :key="index"
      to="/admin/3"
      class="mt-2 flex px-4 py-4 justify-between bg-white dark:bg-gray-600 shadow-xl rounded-lg cursor-pointer"
    >
      <div class="flex justify-between">
        <div
          class="ml-4 flex flex-col capitalize text-gray-600 dark:text-gray-400"
        >
          <span>Titulo do post</span>
          <span class="mt-2 text-black dark:text-gray-200">
            {{ post.title }}
          </span>
        </div>
      </div>

      <div class="flex">
        <div
          class="mr-16 flex flex-col capitalize text-gray-600 dark:text-gray-400"
        >
          <span>slug</span>
          <span class="mt-2 text-black dark:text-gray-200">{{ post.slug }}</span>
        </div>

        <div
          class="mr-8 flex flex-col capitalize text-gray-600 dark:text-gray-400"
        >
          <span>Data de criação</span>
          <span class="mt-2 text-green-400 dark:text-green-200">
            {{ new Date(post.created._seconds * 1000).toDateString() }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
<script>
export default {
  layout: "admin",
  async fetch() {
    const response = await this.$axios.get("/api/posts");
    this.posts = response.data;
  },
  data() {
    return {
      posts: [],
    };
  },
};
</script>
```

Como essa página é da seção de admin, precisamos definir que deve ser usado o layout `admin`

#### Fetch

Usamos o hook `fetch` do NuxtJS para fazer a busca por artigos. Esse hook é executado pelo NuxtJS quando for exibir nossa página tanto do lado do servidor, quando for o primeiro acesso, como do lado do cliente quando vier de uma navegação de uma outra rota.

O uso do `fetch` nos dá ainda a possibilidade de trabalhar com os estados da requisição. Ou seja, ele nos disponibiliza através do `$fetchState` se a requisição está pendente (`$fetchState.pending`), houve erro (`$fetchState.error`) e até o timestamp da última requisição (`$fetchState.timestamp`). Isso é útil quando por exemplo quisermos exibir um loading na tela, onde usaríamos no caso `$fetchState.pending` pra saber se a requisição concluiu ou está ocorrendo.

Pra saber mais sobre o `fetch` basta checar [aqui.](https://nuxtjs.org/docs/2.x/components-glossary/pages-fetch)

#### NuxtLink

Para os botões de navegação, usamos o componente `<NuxtLink>` assim, quando esses links estiverem visíveis na tela, o NuxtJS fará um `pre-fetching` dos `resources` das rotas indicadas no `<NuxtLink>`. Isso ajuda e muito a performance de navegação da aplicação, pois as coisas já estarão carregadas quando o link for clicado. Pra saber mais sobre isso, só checar a [documentação](https://nuxtjs.org/docs/2.x/features/nuxt-components#prefetchlinks).


```vue [Speecher.vue]
<template>
  <div class="speecher">
    <div ref="text" class="speecher-content">
      <slot />
    </div>
    <div 
      ref="popup" 
      class="speecher-popup" 
      v-if="showPopup" 
      :style="{ left: `${x}px`, top: `${y}px`}">
      <audio controls>
        <source :src="audioSrc" />
      </audio>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Speecher',
  data() {
    return {
      audioSrc: null,
      showPopup: false,
      x: 0,
      y: 0
    }
  }
}
</script>
<style>
.speecher-popup {
  position: absolute;
}
</style>
```

### Capturando texto selecionado

Agora precisamos incluir um `listener` no elemento onde vai o conteúdo do nosso texto na íntegra e assim definir se há ou não texto selecionado.

```vue [Speecher.vue]
<template>
  <div class="speecher">
    <div ref="text" class="speecher-content">
      <slot />
    </div>
   ...
  </div>
</template>
<script>
export default {
  ...
  mounted() {
    window.addEventListener("mouseup", this.onMouseUp);
  },
  beforeDestroy() {
    window.removeEventListener("mouseup", this.onMouseUp);
  },
  methods: {
    onMouseUp(e) {
      const selection = window.getSelection();
      const selectionRange = selection.getRangeAt(0);
      const startNode = selectionRange.startContainer.parentNode;
      const endNode = selectionRange.endContainer.parentNode;

      if (
        !startNode.isSameNode(this.$refs.text) ||
        !startNode.isSameNode(endNode)
      ) {
        // Checamos se agora o clique foi fora da área do popup
        this.showPopup = Array.from(this.$refs.popup.$el.childNodes).includes(
          e.target
        );
        return;
      }

      const { x, y, width } = selectionRange.getBoundingClientRect();

      if (!width) {
        // Não tem largura para exibir
        this.showPopup = false;
        return;
      }

      this.x = x + width / 2;
      this.y = e.offsetY + 10;
      const selectedText = selection.toString();
      if (selectedText.trim().length === 0) {
        // Não tem texto selecionado
        this.showPopup = false;
        return;
      }
      // TODO: Buscar áudio do texto
    },
  }
}
</script>
```

O que o método `onMouseUp` faz é checar se o clique foi dentro do nosso componente, se houve texto selecionado, e define a posição em que o popup vai ser exibido

### Áudio do texto

Bem se estiver tudo ok, então vamos buscar agora o áudio do nosso texto selecionado

```vue [Speecher.vue]
<template>
   ...
</template>
<script>
export default {
  ...
  methods: {
    async onMouseUp(e) {
      ...
      const selectedText = selection.toString();
      if (selectedText.trim().length === 0) {
        // Não tem texto selecionado
        this.showPopup = false;
        return;
      }

      await this.getAudioFor(selectedText);
      // Só exibe o popup depois de buscar o áudio
      this.showPopup = true
    },
    async getAudioFor(text) {
      this.showPopup = false
      const response = await this.$axios.post(
          "https://[URL]/v1/synthesize",
          { text: this.selectedText },
          {
            responseType: "arraybuffer",
            headers: {
              Accept: "audio/wav",
            },
            auth: {
              username: "apikey",
              password: "<INSIRA SUA API KEY IBM>",
            },
          }
        );
        var blob = new Blob([response.data], { type: "audio/wav" });
        this.audioSrc = window.URL.createObjectURL(blob);
    }
  }
}
</script>
```

Pronto temos nosso componente. Ao selecionar um texto, ele irá capturar, enviar para o Watson que retornará um arquivo Wave e então abrimos um popup com um miniplayer  para reproduzir a narração

<alert type="warning">

**CORS**

Você terá problema de CORS se for executar a requisição do lado do `client`. 

Eu recomendo usar NuxtJS com SSR habilitado e usar o módulo [@nuxtjs/proxy](https://github.com/nuxt-community/proxy-module) para executar essas requisições do lado do servidor e assim contornar o problema de CORS.

</alert>

### Resultado final

```vue [Speecher.vue]
<template>
  <div class="speecher">
    <div ref="text" class="speecher-content">
      <slot />
    </div>
    <div 
     ref="popup" 
     class="speecher-popup" 
     v-if="showPopup" 
     :style="{ left: `${x}px`, top: `${y}px`}">
     <audio controls>
       <source :src="audioSrc" />
     </audio>
    </div>
  </div>
</template>
<script>
export default {
  name: "Speecher",
  data() {
    return {
      audioSrc: null,
      showPopup: false,
    };
  },
  mounted() {
    window.addEventListener("mouseup", this.onMouseUp);
  },
  beforeDestroy() {
    window.removeEventListener("mouseup", this.onMouseUp);
  },
  methods: {
    async onMouseUp(e) {
      const selection = window.getSelection();
      const selectionRange = selection.getRangeAt(0);
      const startNode = selectionRange.startContainer.parentNode;
      const endNode = selectionRange.endContainer.parentNode;

      if (
        !startNode.isSameNode(this.$refs.text) ||
        !startNode.isSameNode(endNode)
      ) {
        // Checamos se agora o clique foi fora da área do popup
        this.showPopup = Array.from(this.$refs.popup.$el.childNodes).includes(
          e.target
        );
        return;
      }

      const { x, y, width } = selectionRange.getBoundingClientRect();

      if (!width) {
        // Não tem largura para exibir
        this.showPopup = false;
        return;
      }

      this.x = x + width / 2;
      this.y = e.offsetY + 10;
      const selectedText = selection.toString();
      if (selectedText.trim().length === 0) {
        // Não tem texto selecionado
        this.showPopup = false;
        return;
      }
      await this.getAudioFor(selectedText)
      this.showPopup = true
    },
    async getAudioFor(text) {
      this.showPopup = false
      const response = await this.$axios.post(
          "http://localhost:62289/audio/v1/synthesize",
          { text },
          {
            responseType: "arraybuffer",
            headers: {
              Accept: "audio/wav",
            },
            auth: {
              username: "apikey",
              password: "uMcZh-Dshn7gxW8vquh7glgkIeqqfGvrUlnZgd4-3d8G",
            },
          }
        );
        var blob = new Blob([response.data], { type: "audio/wav" });
        this.audioSrc = window.URL.createObjectURL(blob);
    }
  },
};
</script>
<style>
.speecher-popup {
  position: absolute;
}
</style>
```

### Como usar

Para usar nosso componente, basta colocar o conteúdo dentro dele dessa forma:

```vue
<template>
  <div>
    <speecher>
      <p>Mussum Ipsum, cacilds vidis litro abertis. Quem num gosta di mim que vai caçá sua turmis! Suco de cevadiss deixa as pessoas mais interessantis. Diuretics paradis num copo é motivis de denguis. Si num tem leite então bota uma pinga aí cumpadi!</p>
    </speecher>
  </dig>
</template>
```

<img src="/images/narrador/exemplo.png" alt="Resultado">

## O que foi usado nesse componente

### Slots

Slots são espaços reservados dentro de um componente `Vue`. Um componente pode ter vários `slots` onde é possível identificá-los com o atributo `name`

```vue [MyComponent.vue]
<template>
  <div class="card">
    <slot name="header" />
    ...
    <slot name="body" />
    ...
    <slot name="footer" />
  </div>
</template>
```

```vue [Page.vue]
<template>
  <div class="page">
    <MyComponent>
      <div slot="header">
        Título
      <div/>
      <div slot="content">
        Conteúdo
      <div/>
      <div slot="footer">
        <button>Fechar</button>
      <div/>
    </MyComponent>
  </div>
</template>
```

Para saber mais sobre: [`Slots`](https://br.vuejs.org/v2/guide/components-slots.html)

### Style

Aplicamos propriedades CSS no componente de acordo com valores do `data()`. Dessa forma, com JavaScript conseguimos mudar o estilo de um elemento do nosso component

```vue
<template>
  <div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
</template>
```

**É importante lembrar de usar 'px', 'em', '%' em valores númericos de acordo com sua preferência**

Para saber mais sobre [`Style`](https://br.vuejs.org/v2/guide/class-and-style.html#Sintaxe-de-Objeto)

### Ciclo de vida

Usamos alguns hooks do ciclo de vida de um componente para adicionar `listeners`. `mounted` e `beforeDestroy` são hooks executados no lado do cliente no caso de aplicações `SSR` Muitas vezes dentro desses hooks trabalhamos com `window` ou `document` já que em uma aplicação SSR esses objetos não existem mas principalmente para adicionar eventos a elementos do DOM como foi o nosso caso.

Para saber mais sobre [`Ciclo de vida de um componente`](https://br.vuejs.org/v2/guide/instance.html#Ciclo-de-Vida-da-Instancia)
