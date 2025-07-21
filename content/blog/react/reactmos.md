---
date: 2025-07-16
layout: article
---

# Reactmos

Um mini framework para modularizar aplicações SPA com React

## SPA React modularizado

Inspirado um pouco nas [Layers do Nuxt](https://nuxt.com/docs/4.x/getting-started/layers). Procurei me aventurar e criar algo simples pra trabalhar com o React.

A ideia era ter uma aplicação SPA React que funcionasse bem sozinha, mas que poderia fazer um "extends" de outra aplicação. Onde seria possível acessar as páginas dessa outra aplicação e quaisquer outras coisas.

Usando Vite, comecei a desenhar um módulo virtual que pudesse ser o centralizador da configuração. A coisa foi evoluindo e resultou na criação desse mini framework que chamei de Reactmos, que vem de **REACTM**odule**S**

## Como funciona

Basicamente, o Reactmos é um SPA que, a partir de um arquivo usado como ponto de entrada de um módulo, carrega o componente usado como raiz e as rotas da aplicação. Além de ler também o "extends" que esse módulo faz, ou seja, quais outros módulos é preciso ler as rotas e outras configurações para compor assim uma aplicação final.

### Centralizar em um módulo só

Você pode ter um módulo que faz extensão de todos os outros pra centralizar tudo que sua aplicação final precisa e ainda assim cada módulo pode funcionar individualmente

Dois módulos podem fazer extensão de um mesmo módulo sem problemas. O Reactmos faz leitura de extensão só no primeiro nível de herança, ou seja, tudo depende a partir de qual módulo você quer executar a coisa toda. 

Se você roda a partir do módulo A que faz extensão do módulo B que por sua vez faz extensão do módulo C, saiba que o módulo C não vai ser carregado, a não ser que o módulo A também faça extensão do módulo C.

### Isolamento

Cada módulo, pode rodar individualmente. Então se quiser subir só uma parte da aplicação central, você consegue sem problemas.

No cenário anterior, dos módulos A, B e C. Você pode rodar o módulo B que extende o C pra testar só o B. Bem como rodar só o C também.

Se quise testar tudo, só rodar a partir do módulo A `pnpm dev`.

## Como usar

Mas sem enrolação, vamos ver como seria o uso.

Rodando

```bash
pnpm create reactmos modulo-a
```

Isso vai criar nosso primeiro módulo. Perceba que temos nosso arquivo de ponto de entrada em `src/module.config.ts`. 

Nesse arquivo definimos o nome do módulo, as rotas e outras coisas. E já temos uma rota para o caminho `/` que exibe a página `Welcome`.

Agora vamos criar um segundo módulo em outro diretório, claro, que não seja o diretório do `modulo-a`

```bash
pnpm create reactmos modulo-b
```

A estrutura é muito similar ao `module-a`. Mas vamos modificar o `src/module.config.ts` do `modulo-b`. A página `Welcome` dele vai ficar no camminho `/modulo-b`. Ficando mais ou menos assim:

```ts [src/module.config.ts]
import { ModuleConfig } from 'reactmos';
import Welcome from './pages/Welcome';
import App from './App';

const module: ModuleConfig = {
  moduleName: 'modulo-b',
  root: App,
  routes: () => {
    return [
      {
        path: '/modulo-b',
        Component: Welcome,
      },
    ];
  },
  hooks: {
    'app:beforeRender': () => {
      console.log('Before render')
    }
  }
}

export default module
```

Agora de volta ao `modulo-a`, vamos fazer extends do `modulo-b` nele.

```ts [src/module.config.ts]
import { ModuleConfig } from 'reactmos';
import Welcome from './pages/Welcome';
import App from './App';

const module: ModuleConfig = {
  moduleName: 'modulo-a',
  root: App,
  routes: () => {
    return [
      {
        path: '/',
        Component: Welcome,
      },
    ];
  },
  hooks: {
    'app:beforeRender': () => {
      console.log('Before render')
    }
  },
  extends: [
    '../modulo-b' // Aqui fazemos o extends...
  ]
}

export default module
```

O legal é que você pode fazer extends também de um pacote publicado em algum registry.

```ts
export default {
  ...,
  extends: ['pacote-npm']
}
```

::alert{type="info"}
Quando usamos o caminho relativo no `extends`. O módulo que faz a extensão, deve ter as dependências do módulo extendido instaladas.
::

Pronto. Agora só rodar `pnpm dev` no `modulo-a` pra ver que é possível acessar `/` e `/modulo-b`.

E se modificar o `Welcome` do `modulo-b` você verá que vai refletir imediatamente, se estiver na rota `/modulo-b`

## Ué, mas onde ficam as rotas do `react-router`?

Observe que no `module.config.ts` a gente tem a opção `root`. Ela define o nosso componente de entrada da aplicação.

Se olhar o `App.tsx` do `modulo-a`, vemos que ele importa o componente `Pages` do `reactmos` que já reune todas as rotas, incluindo dos módulos extendidos.

```tsx [App.tsx]
import { Pages } from 'reactmos';

export default function App() {
  return <Pages />
}
```

Mas se você quiser fazer isso por conta própria, o `reactmos` também fornece uma função que retorna um objeto com todas as mesmas rotas pra você montar como quiser. Por exemplo, se quiser montar um provider de autenticação.

Digamos que você crie seu próprio componente `Pages.tsx` que irá reunir as rotas. Seria mais ou menos assim:

```tsx
import { BrowserRouter, useRoutes, type RouteObject } from 'react-router'
import { getRoutes } from 'reactmos'

import AuthProvider from './auth';

type AppRoutesProps = {
  pages: RouteObject[]
}
function AppRoutes({ pages }: AppRoutesProps) {
  return useRoutes(pages)
}

export default function Pages() {
  const pages = getRoutes();
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes pages={pages} />
      </AuthProvider>
    </BrowserRouter>
  )
}
```

## E se a lógica de autenticação estiver em outro módulo?

O `module.config.ts` tem uma opção chamada `extras` onde você fornece qualquer coisa para ser acessado por outros módulos através da função `getExtras` do `reactmos`

Por exemplo, alterando o nosso componente `Pages.tsx` caso o `modulo-b` fornecesse a lógica de autenticação.

No `modulo-b` o `module.config.ts` dele teria:

```ts
import { AuthProvider } from './auth';

const module = {
  moduleName: 'modulo-b',
  ...
  extras: {
    'AuthProvider': AuthProvider,
  }
}

export default module
```

Então, no nosso componente `Page.tsx` no `modulo-a` usaríamos assim:

```tsx
import { BrowserRouter, useRoutes, RouteObject } from 'react-router'
import { getExtras } from 'reactmos'
import { getRoutes } from 'reactmos'

type AppRoutesProps = {
  pages: RouteObject[]
}
function AppRoutes({ pages }: AppRoutesProps) {
  return useRoutes(pages)
}

export default function Pages() {
  const pages = getRoutes();
  const { AuthProvider } = getExtras('modulo-b');
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes pages={pages} />
      </AuthProvider>
    </BrowserRouter>
  )
}
```

## Dependências

Quanto a dependências que não são comuns entre os módulos, temos 2 pontos a levantar aqui.

Se você usa caminho relativo para fazer extends, então é necessário que o módulo que faz _extends_ tenha as dependências do módulo extendido instaladas também.

Agora, se você usa um pacote publicado pra fazer extends, basta garantir que esse pacote tenha as suas dependências corretamente declaradas no `package.json`

## Build

Sem problemas, você roda `pnpm build` e tudo vai pro diretório `dist/` onde você usa para hospedar onde quiser e pronto. Tudo vai funcionar bem. Assets, css, etc. Tudo vai estar incluído no bundle final.

## Mais algumas coisinhas

### Plugin

O Reactmos usa um plugin Vite, `vite-plugin-react-modules`, pra fazer parte da mágica. Você pode usar a lógica de modularização na sua aplicação SPA pré-existente se, é claro, estiver usando o `react-router`. Confira como usar o plugin [aqui](https://reactmos.dev/plugin).

O uso apenas do plugin deixa de lado algumas coisas que o Reactmos tem, como definir o `root` e os gatilhos de ciclo de vida. E cada módulo precisa estar configurado como esperado para o plugin funcionar. Ou seja, precisa ter o arquivo de ponto de entrada certinho. E pra deixar também cada módulo funcionando individualmente precisa de ajustes pra isso dar certo.

### Tem mais?

Temos gatilhos de ciclo de vida, alteração de configuração do Vite, HTML de pre-loading (é exibido enquanto o Reactmos reúne as configurações dos módulos)...

Você pode ver a [documentação](https://reactmos.dev/) do Reactmos para saber mais sobre como co