---
title: Um narrador de textos
category: Vue
---

A plataforma Medium tem um componente interessante que é ativado quando selecionamos um trecho do texto publicado. Esse componente nos dá as opções de compartilhar ou citar o trecho nas redes sociais.

Aqui vamos mostrar como fazer um componente parecido mas para narrar um trecho selecionado na página. Para deixar mais legal, vamos usar o [Watson da IBM](https://www.ibm.com/cloud/watson-text-to-speech) para ler pra gente.

<!--more-->

<alert>

**Não vou mostrar aqui como configurar um projeto Vue, vamos direto ao ponto para criar nosso componente. Aliás, como exemplo estou usando uma aplicação NuxtJS. Portanto, módulos como [@nuxtjs/axios](https://axios.nuxtjs.org/), [@nuxtjs/vuetify](https://www.npmjs.com/package/@nuxtjs/vuetify) já estarão configurados**

</alert>

Vamos chamar nosso componente de `Speecher.vue`

```vue [Speecher.vue]
<script>
export default {
  name: 'Speecher'
}
</script>
```

## Como vai funcionar?

Bem,  a ideia é que no `slot` padrão do nosso componente, recebemos o conteúdo na íntegra, onde iremos observar quando algo for selecionado. E quando for selecionado, exbiremos nosso popup com a opção de dar o play no text selecionado. Então vamos lá!

### Estrutura do componente

Basicamente, nosso componente seria assim:

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
