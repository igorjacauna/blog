---
date: 2022-08-23
layout: article
---

# Efeito 3D no Hover

## Exemplo

<Hover3d style="margin: 10px;"></Hover3d>

Vue tem uma super biblioteca repleta de _composables_, a [`@vueuse`](https://vueuse.org/). E eles são muito úteis de fato. Facilitam o trabalho pra gente em tarefas rotineiras na criação dos nossos componentes.

Exemplo disso, é a criação de um componente com esse efeito 3D no hover.

Usaremos o _composable_ `useMouseInElement`. Ele nos dá informações sobre a posição do mouse em relação a um elemento na tela. Então é muito útil quando queremos criar componentes que interagem com o mouse por exemplo.

Então vamos começar.

## Instalação

Antes de tudo, precisamos instalar o `@vueuse/core` então:

```bash
yarn add @vueuse/core
```

## Componente

Feita instalação, vamos ao nosso componente que aqui, vamos chamar de `Card.vue`

```vue
<script setup lang="ts">
</script>

<template>
  <div class="card">
    <div class="card-title">
      Phil'sosophies
    </div>
    <div class="card-body">
      Dance Until Your Feet Hurt, Sing Until Your Lungs Hurt, Act Until You're William Hurt.
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 12px;
  background-color: #636363;
  max-width: 300px;
  border-radius: 8px;
}

.card-title {
  font-size: 1.2em;
  font-weight: bold;
}

.card-body {
  margin-top: 24px;
}
</style>
```

Dada uma certa estilizada nele. Agora vamos para a implementação do efeito

A gente precisa fazer uma referência ao elemento que vai ser o _target_ do _composable_ então basta declarar um `ref` e inserir no elemento no `template`:

```vue{4,8}
<script setup lang="ts">
import { ref } from 'vue'

const cardRef = ref(null)
</script>

<template>
  <div class="card" ref="cardRef">
   ...
  </div>
</template>
```

Agora só passar essa referência para o _composable_

```vue{3,7}
<script setup lang="ts">
import { ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'

const cardRef = ref(null)

const { } = useMouseInElement(cardRef)

</script>
```

E as informações do mouse, em relação ao elemento, que vamos usar vão ser:

```vue{8-12}
<script setup lang="ts">
import { ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'

const cardRef = ref(null)

const {
  elementHeight,
  elementWidth,
  elementX,
  elementY,
  isOutside
} = useMouseInElement(cardRef)

</script>
```

Os valores retornados pelo _composable_ são reativos. Então se atualizam conforme a interação do mouse com o elemento alvo.

## Animação

Vamos usar a propriedade `transform` do CSS para rotacionar o elemento nos eixos. E para isso vamos criar um valor _computed_ que irá fazer os cálculos dos valores para a propriedade `transform`

Abstraia o entendimento do cálculo. Se quiser alterar o quanto é rotacionado basta mudar o valor de `ROTATION`

```vue{6-14}
<script setup lang="ts">
import { computed, ref } from 'vue'

...

const transformElement = computed(() => {
  const ROTATION = 16
  const rX = (ROTATION / 2 - (elementY.value / elementHeight.value) * ROTATION).toFixed()
  const rY = (ROTATION / 2 - (elementX.value / elementWidth.value) * ROTATION).toFixed()

  if (isOutside.value) return ''

  return `perspective(${elementWidth.value / 2}px) rotateX(${rX}deg) rotateY(${rY}deg)`
})

</script>
```

Se o mouse estiver fora do elemento, `isOutside.value` for `true`, então não retornamos nenhum valor.

Agora o que a gente faz é só aplicar o estilo ao componente usando o _reactive styles_! Sim, podemos usar _refs_ no `<style>`

```vue{3,18-19}
<script setup lang="ts">
...
const transformElement = computed(() => {
  ...
})
</script>

<template>
...
</template>

<style scoped>
.card {
  padding: 12px;
  background-color: #636363;
  max-width: 300px;
  border-radius: 8px;
  transform: v-bind(transformElement);
  transition: transform 0.25s ease-out;
}
...
</style>
```

## Resultado

<Hover3d></Hover3d>

## Código final

```vue
<script lang="ts" setup>
import { useMouseInElement } from '@vueuse/core'
import { computed, ref } from 'vue'
const cardRef = ref(null)

const { elementHeight, elementWidth, elementX, elementY, isOutside } = useMouseInElement(cardRef)

const transformElement = computed(() => {
  const ROTATION = 16
  const rX = (ROTATION / 2 - (elementY.value / elementHeight.value) * ROTATION).toFixed()
  const rY = (ROTATION / 2 - (elementX.value / elementWidth.value) * ROTATION).toFixed()

  if (isOutside.value) return ''

  return `perspective(${elementWidth.value / 2}px) rotateX(${rX}deg) rotateY(${rY}deg)`
})
</script>
<template>
  <div class="card" ref="cardRef">
    <div class="card-title">
      Phil'sosophies
    </div>
    <div class="card-body">
      Dance Until Your Feet Hurt, Sing Until Your Lungs Hurt, Act Until You're William Hurt.
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 12px;
  background-color: #636363;
  max-width: 300px;
  border-radius: 8px;
  transform: v-bind(transformElement);
  transition: transform 0.25s ease-out;
}

.card-title {
  font-size: 1.2em;
  font-weight: bold;
}

.card-body {
  margin-top: 24px;
}
</style>
```

E é isso!

> Créditos ao [LearnVue](https://learnvue.co/)
>
> Conteúdo extraído do vídeo: https://www.youtube.com/watch?v=AVMNjbKdU1M
