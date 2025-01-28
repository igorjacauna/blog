---
date: 2022-08-23
layout: article
---

# O que são os composables?

## Composition API

Desde que o Evan You anunciou a [`Composition API`](https://vuejs.org/guide/extras/composition-api-faq.html) muitos *devs* estavam empolgados e outros confusos e outros simplesmente não aceitavam a ideia.

Mas acontece que a `Composition API` veio e agora todos estão felizes com a facilidade que ela traz no desenvolvimento principalmente de grandes aplicações com Vue.

Quem conhece o meio `React` vai ver uma semelhança da `Composition API` do `Vue` com os `Custom Hooks` do `React`. Mas no Vue tem algumas [diferenças](https://vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks) que melhoram a experiência de desenvolvimento.

Para ajudar, a ideia da `Composition API` é podermos separar funcionalidades do componente em funções que simplesmente podem ser importadas. Assim temos um grande poder de reutilização de código trazendo assim a possibilidade de *compor* um componente conforme vamos importando as funções e usamos no componente.

## Composable

E quando separamos essas funcionalidades em funções, damos o nome para cada função de [*composable*](https://vuejs.org/guide/reusability/composables.html).

Por definição, as funções *composable* tem um padrão no nome que é `use<Funcionalidade>`, por exemplo, `useMouse`.

### Quando escrever um?

Até aqui tudo certo, então já podemos sair escrevendo composables e dando nome de `useFazQualquerCoisa`?!

Bem... Não. a proposta dos composables é trabalhar exclusivamente com a `Composition API` para gerenciar estados para o componente. O que quero dizer com isso?!

Vejamos o seguinte exemplo.

Temos a necessidade de sempre formatar uma `string` de data, podemos então criar uma função que faça isso correto?

```typescript [formatDate.ts]
export default function formatDate(date: Date) {
  const formatted = '';
  ...
  return formatted;
};
```

Inicialmente, pensamos: "Vou transformar em um *composable* chamado `useFormatDate` e reutilizar onde quiser"

```ts
export default function useFormatDate() {
  const formatDate = (date: Date) => {
    const formatted = '';
    ...
    return formatted;
  }

  return formatDate;
};
```

Assim posso usar nos componentes como um *composable*

```vue
<script setup lang="ts">
import useFormatDate from './composables/useFormatDate';

const formatDate = useFormatDate();
</script>

<template>
  <div>{{ formatDate(new Date()) }}</div>
</template>
```

Qual o problema nisso?

Bem, é que a ideia por trás dos *composables* é que eles usem a `Composition API` e no nosso exemplo, `useFormatDate` não faz uso de nenhuma função da `Composition API`, ou seja, não gerencia estado algum e se torna uma função sem estado. É assim que algumas libs funcionam como `date-fns` e `lodash`. Portanto, o ideal é que ela seja apenas uma função que ficaria ali no diretório `helpers`, `utils` ou qualquer outro. Mas ela não seria considerada uma função *composable*.

Vamos ver um outro exemplo então que faria mais sentido ser um composable.

Supomos que queremos sempre obter a posição do mouse para exibir na tela. Então teríamos:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

Se nós precisarmos utilizar essa lógica em outros componentes então faz sentido transformar em um composable. Já que temos um gerenciamento de estado.

```js
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// by convention, composable function names start with "use"
export default function useMouse() {
  // state encapsulated and managed by the composable
  const x = ref(0)
  const y = ref(0)

  // a composable can update its managed state over time.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expose managed state as return value
  return { x, y }
}
```

Agora nos nossos componentes, basta chamar o composable

```vue
<script setup>
import useMouse from './composables/mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

Percebeu o que fizemos? A ideia do *composable* é ter funções que isolam o gerenciamento de estado e que podem ser reutilizadas em outros componentes. Observe que o gerenciamento do estado é feito com a `Composition API`.

---

Exemplos tirados da documentação sobre [*composables*](https://vuejs.org/guide/reusability/composables.html#mouse-tracker-example)
