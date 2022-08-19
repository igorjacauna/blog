---
title: Métodos customizados para Vue-mc
category: Vue
createdAt: 2020-10-01
topics: 
    - vuejs
    - vue-mc
---

Vue-mc é uma lib e tanto que ajuda a manipular entidades vindas de uma API. Pra quem não conhece, é bom dar uma olhada nela que isso vai ajudar e muito contrução de grandes aplicações. Dá uma [olhada lá](http://vuemc.io/#introduction). Ela tém métodos implementados para as ações básicas de um CRUD. Dá pra criar também métodos customizados, e é isso que vamos ver aqui.

<!--more-->

Se observarmos na documentação do Vue-mc, lá nos diz que pra criar um método customizado basta dentro da nossa classe, seja ela `Collection` ou `Model`:

```javascript
export class MyModel extends Model {
  myMethod() {
    return this.createRequest({
        // params, method, url, etc...
    })
  }
}

export class MyCollection extends Collection {
  myMethod() {
    return this.createRequest({
        // params, method, url, etc...
    })
  }
}
```

## O que não nos contaram...

Só que uma coisa que observei nessa abordagem, é que seria necessário eu mesmo manipular a resposta da requisição, e quisesse obter resultados similares com os métodos já implementados no Vue-mc. Como ter os `models` preenchidos em uma collection e o status `loading` mudar de acordo com a requisição.

Pra resolver isso, basta chamar `request()` e não `createRequest()` passando os devidos callbacks nele:

```javascript
export class MyModel extends Model {
  myMethod() {
    return this.createRequest({
        // params, method, url, etc...
    }, this.onFetch, this.onFetchSuccess, this.onFetchFailure)
  }
}
}

export class MyCollection extends Collection {
  myMethod() {
    return this.createRequest({
        // params, method, url, etc...
    }, this.onFetch, this.onFetchSuccess, this.onFetchFailure)
  }
}
```

Dentro do método `request` já é feita a chamada para o `createRequest`, a diferença é que assim podemos ter todo o comportamento que temos nos métodos nativos do Vue-mc e inclusive os estados das requisições, ou seja, `myCollection.loading` pra saber se está em uma requisição, `myCollection.models` e etc funcionarão exatamente como esperando quando usamos os métodos já implementados como `fetch()`

Isso é tudo.