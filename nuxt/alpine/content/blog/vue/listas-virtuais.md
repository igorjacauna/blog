---
date: 2022-08-23
layout: article
---

# Listas Virtuais

Quando pensamos em renderizar uma lista de itens pensamos logo em usar o `v-for`. Mas se a lista for gigante logo percebemos impactos na perfomance como, tempo de renderização da página ficar lento e a rolagem da página apresentar problemas.

Mas para nossa sorte, podemos usar listas virtuais ou virtualização de listas.

> Que diabos é isso?!

Em resumo, na virtualização de listas os únicos elementos renderizados são aqueles que estão visíveis na tela.

Ao invés de renderizar toda a lista:

![Lista completa](/images/complete-list.png)

É renderizado apenas os itens que são visíveis na janela

![Lista virtual](/images/virtual-list.png)

Um exemplo de virtualização de listas seria o site do Twitter. Na lista de tweets, ele renderiza apenas aqueles que ficam visíveis na tela. Você pode inspecionar os elementos e perceberá que o número de divs na lista de tweets sempre é o mesmo e quando _scrollamos_ a janela ele renderiza diferentes tweets mas a quantidade de divs permanece.

## useVirtualList

Para ajudar a gente nessa, temos a incrível lib `@vueuse/core`! Ela disponibiliza um _composable_ chamado `useVirtualList`. Vamos ver como funciona.

O _composable_ trabalha com 2 camadas que seria o `container` que define a altura da lista e assim o navegador renderiza a barra de rolagem de acordo, e o `wrapper` onde é renderizado apenas os itens da lista que estão visíveis:

```html{1,2}
<div class="container">
  <div class="wrapper">
    ...
  </div>
</div>
```

Dito isto, vamos para implementação:

```vue
<script>
import { useVirtualList } from '@vueuse/core'

const items = Array.from(Array(99999).keys());

const { list, containerProps, wrapperProps } = useVirtualList(
  // Itens da lista
  items,
  {
    // Defimos a altura de um item para cálculo da altura do container.
    itemHeight: 22,
  },
)
</script>
<template>
  <div v-bind="containerProps" style="height: 300px">
    <div v-bind="wrapperProps">
      <div v-for="(item, index) in list" :key="index" style="height: 22px">
        Item: {{ item }}
      </div>
    </div>
  </div>
</template>
```

É isso, observe que o _composable_ nos retorna `list` que é o que devemos usar no nosso `v-for` ao invés de `items`. Isso porque ele vai repassar os índices corretos pro `v-for` para controle correto da lista. Assim, os dados passam para a propriedade `data` em cada item da `list` e usamos o `index` de cada `item` como índice do `v-for`

## Resultado

Inspecione o elemento abaixo e veja que na nossa lista temos 99999 itens mas só os que estão visíveis são renderizados e assim apenas algumas `divs` são criadas e conforme _scrollamos_ ele atualiza o conteúdo dessas `divs`

<VirtualList />