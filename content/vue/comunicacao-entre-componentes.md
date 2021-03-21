---
title: Comunicação entre componentes
category: Vue
createdAt: 2021-03-18
---

VueJS nos ajuda a componetizar as nossas aplicações Web de maneira simples. Então podemos dividir a nossa aplicação em blocos/módulos para melhor utilização desse poder de componetização.

Mas se dividirmos nossa aplicação em vários componentes, como eles conversam entre si?

É isso que vamos ver aqui!

<!--more-->

## Instalação

<alert>

Vou usar o `NuxtJS` para nos poupar tempo na configuração do projeto e vou usar também o módulo do `Vuetify` para o `Nuxt` como UI.

</alert>

Então vamos instalar:

```bash
npm i nuxt
npm i -D @nuxtjs/vuetify
```

Nosso projeto vai ser mais ou menos assim:

```
-| package.json
-| nuxt.config.js
-| components/
---| TopBar.vue
---| Menu.vue
---| Container.vue
---| FiltrosLista.vue
---| Lista.vue
-| layouts/
---| default.vue
-| pages/
---! index.vue
```

Nosso arquivo `nuxt.config.js` vai ter a configuração do uso do módulo `@nuxtjs/vuetify` e a importação automática de componentes:

```javascript [nuxt.config.js]
export default {
  buildModules: ['@nuxtjs/vuetify'],
  components: true
}
```

## Estrutura

Digamos que nós vamos ter a seguinte estrutura de componentes:

<img src="/images/comunicacao-componentes/estrutura.png" />

A ideia é, o `<TobBar />` se comunicar com o `<Menu />` para indicar se exibe ou recolhe o menu.

E o `<FiltroLista />` se comunica com `<Lista />` através de um botão que vai dizer para `<Lista />` carregar.

## Componentes

<alert>

Vamos usar alguns componentes do Vuetify em nossos componentes, assim nos poupa trabalho de estilização.

</alert>

Vamos criar nossos componentes em `components/*`. Assim, eles serão importados automaticamente pelo `Nuxt`, não sendo necessário o registro deles onde forem inseridos. Legal né?

### `<TobBar />`

O `<TopBar />` vai ser basicamente o componente `<v-app-bar />` do Vuetify.

```vue [components/TopBar.vue]
<template>
  <v-app-bar>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title>Minha aplicação</v-toolbar-title>
  </v-app-bar>
</template>
```

### `<Menu />`

O `<Menu />` vai ser basicamente o componente `<v-navigation-drawer />` do Vuetify.

```vue [components/Menu.vue]
<template>
  <v-navigation-drawer>
    <!--  -->
  </v-navigation-drawer>
</template>
```

### `<Container />`

O `<Container />` vai ser basicamente o componente `<v-main />` do Vuetify.

```vue [components/Container.vue]
<template>
  <v-main>
    <v-container>
      <slot /> <!-- Todo conteúdo vai nesse slot padrão -->
    </v-container>
  </v-main>
</template>
```

<alert type="warning">

É importante no `<Container />` ter o `slot` padrão `<slot />` para conseguirmos inserir conteúdo dentro do  nosso componente.

</alert>

### `<FiltrosLista />`

O `<FiltrosLista />` vai ter um input para definir o parâmetro de busca.

```vue [components/FiltrosLista.vue]
<template>
  <v-row>
    <v-col>
      <v-text-field placeholder="Pesquisar" prepend-inner-icon="mdi-magnify" />
    </v-col>
  </v-row>
</template>
```

### `<Lista />`

E a nossa `<Lista />` vai ser uma lista... :)

```vue [components/Lista.vue]
<template>
  <v-row>
    <v-col>
      <v-list>
        <v-list-item v-for="(item, index) of items" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          title: 'Content filtering',
          content: 'Set the content filtering level to restrict appts that can be downloaded'
        },
        {
          title: 'Password',
          content: 'Require password for purchase or use password to restrict purchase'
        }
      ]
    }
  }
}
</script>
```

## Layout

Vamos para criação do nosso Layout. Criamos então o arquivo para o layout padrão em `layouts/default.vue`

```vue [layouts/default.vue]
<template>
  <v-app>    
    <TopBar />
    <Menu />
    <Container>
      <Nuxt />
    </Container>
  </v-app>
</template>
```

## `v-bind`

Agora, vamos pegar todo e qualquer `prop` passado para `<TopBar />`, `<Menu />` e `<Container />` e associar também aos componentes do `Vuetify` que usamos dentro dos nossos componentes.

Como? Muito simples: `v-bind="$attrs"`:

### `<TobBar />`

```vue [components/TopBar.vue]
<template>
  <v-app-bar v-bind="$attrs">
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title>Minha aplicação</v-toolbar-title>
  </v-app-bar>
</template>
```

Isso faz com que qualquer `props` passado para `<TobBar />` seja associado também ao `<v-app-bar />`

Todo componente `Vue` tem a propriedade `$attrs` que reúne todos os atributos vinculados a ele.

O uso do `v-bind="$attrs"` faz com que todos os atributos (`$attrs`) recebidos pelo nosso componente (`<TobBar />`) sejam vinculados ao `<v-app-bar />`. Por exemplo, na imagem abaixo, o último quadro ilustra o que acontece quando usamos o `v-bind="$attrs"`:

<img src="/images/comunicacao-componentes/v-bind.png" />

Atribuímos as props `app` e `props1="valor1"` para `<TopBar />`.

Dentro do `<TopBar />`, usamos `v-bind="$attrs"` no `<v-app-bar>`.

Isso faz com que `<v-app-bar >` receba os mesmos atributos associados ao `<TopBar />`.

<alert type="warning">

Se quisermos usar algum dos atributos dentro do nosso componente `<TopBar />`, é necessário declarar esse atributo como `props`, caso contrário não iremos conseguir acessar com o `this.props1`.
<br/>
```vue [components/TopBar.vue]
<template>
  <v-app-bar v-bind="$attrs">
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title>Minha aplicação - {{ props1 }}</v-toolbar-title>
  </v-app-bar>
</template>
<script>
export default {
  props: [props1],
  method: {
    funcao() {
      // ...
      this.props1
    }
  }
}
</script>
```

</alert>

Nosso `<TopBar />` ficaria então assim:

```vue [components/TopBar.vue]
<template>
  <v-app-bar v-bind="$attrs">
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title>Minha aplicação</v-toolbar-title>
  </v-app-bar>
</template>
```

### `<Menu />`

```vue [components/Menu.vue]
<template>
  <v-navigation-drawer v-bind="$attrs">
    <!--  -->
  </v-navigation-drawer>
</template>
```

### `<Container />`

```vue [components/Container.vue]
<template>
  <v-main v-bind="$attrs">
    <v-container>
      <slot /> <!-- Todo conteúdo vai nesse slot padrão -->
    </v-container>
  </v-main>
</template>
```

### Layout

No nosso `layout` precisamos apenas inserir o atributo `app` nos componentes certos, para o `Vuetify` trabalhar corretamente:

```vue [layouts/default.vue]
<template>
  <v-app>    
    <TopBar app />
    <Menu app />
    <Container app>
      <Nuxt />
    </Container>
  </v-app>
</template>
```

Esse atributo `app` é um requisito do Vuetify.

[Saiba mais aqui](https://vuetifyjs.com/en/components/application/#default-application-markup).

## Comunicação

### `<Menu />` & `<TopBar />`

A comunicação entre esses 2 pode ser feita com eventos ou simplesmente um `v-model`.