---
title: Usando instância $axios do NuxtJS com Vue-mc
category: Vue
createdAt: 2018-01-01
topics: 
    - vuejs
    - nuxtjs
    - axios
    - vue-mc
---

Vue-mc é uma lib e tanto que ajuda a manipular entidades vindas de uma API. Pra quem não conhece, é bom dar uma olhada nela que isso vai ajudar e muito contrução de grandes aplicações. Dá uma [olhada lá](http://vuemc.io/#introduction). É possível trabalhar com várias libs `http` com o Vue-mc, mas é necessário uma configuração inicial antes que hoje não está documentado e é isso que vou mostrar aqui.

<!--more-->

O Vue-mc usa uma classe chamada `Request` que contém apenas apenas um método que é o `send` que executa em si a requisição e monta a resposta ou exceção. E tanto a resposta como a exceção também usam uma classe específica do Vue-mc. O que vamos fazer é justamente escrever nossas classes para isso e usar o método `getRequest` do `Model` e `Collection`  do Vue-mc para retornar nossa classe `Request`.

Então vamos lá, vamos criar a classe de resposta e de exceção da seguinte forma:

```javascript
import { extend, get } from 'lodash'
import Vue from 'vue'

export class MyResponse {
  constructor(response) {
    this.response = response
  }

  getData() {
    return get(this.response, 'data', null)
  }

  getStatus() {
    return get(this.response, 'status')
  }

  getHeaders() {
    return get(this.response, 'headers', {})
  }

  getValidationErrors() {
    return get(this.response, 'data', null)
  }
}

export class MyRequestError {
  constructor(error, response) {
    this.error = error
    this.response = response
    this.stack = new Error().stack
    this.message = error.message
  }

  toString() {
    return this.message
  }

  getError() {
    return this.error
  }

  getResponse() {
    return this.response
  }
}
```

Os métodos presentes nessas classes são utilizadas pelo Vue-mc para ser manipular os resutados.

Agora resta criar nossa classe de requisição:

```javascript
export class MyRequest {
  constructor(config) {
    this.config = config
  }

  send() {
    this.config = extend(this.config, Vue.prototype.$nuxt.$axios.defaults)
    return Vue.prototype.$nuxt.$axios.request(this.config).then((response) => {
      return new MyResponse(response)
    }).catch((error) => {
      throw new MyRequestError(error, new Response(error.response))
    })
  }
}

```

Eu particularmente sempre crio uma classe base para `Model` e `Collection` a serem utilizadas na minha aplicação. Assim posso criar outros comportamentos e configurações comuns entre os modelos e coleções da aplicação e nessas classes eu sobrescrevo o método `getRequest` e assim retorno a classe que criamos para usar a instância do NuxtJS:

```javascript
export class BaseModel extends Model {
  createRequest(config) {
    return new MyRequest(config)
  }
}

export class BaseCollection extends Collection {
  createRequest(config) {
    return new MyRequest(config)
  }
}
```

A chave mesmo de onde é feito o uso da instância do $axios do NuxJS é no método `send` da classe `MyRequest`:

```javascript
send() {
this.config = extend(this.config, Vue.prototype.$nuxt.$axios.defaults)
  return Vue.prototype.$nuxt.$axios.request(this.config).then((response) => {
    return new MyResponse(response)
  }).catch((error) => {
    throw new MyRequestError(error, new Response(error.response))
  })
}
```

Eu mesclo as configurações pasadas para `MyRequest` pelo método `getRequest` de `BaseModel` e `BaseCollection` com os valores padrões da instância do $axios no NuxtJS e depois executo a requisição e em caso de sucesso retorno a instância de `MyResponse` ou caso contrário jogo a exceção de `MyRequestError`.

O porquê de criar essas classes é que assim o Vue-mc consegue realizar a leitura dos resultados e monta as coleções e objetos de maneira correta, uma vez que essas classes abstraem a forma de como ele recupera isso das respostas das requisições.

Isso é tudo.