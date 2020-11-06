---
title: Uma diretiva de permissão
date: 2020-11-05
type: post
blog: true
excerpt: Vamos criar uma diretiva para ser usada na verificação de permissão para exibição de componentes na tela da aplicação.
tags: 
    - vuejs
    - permissions
---

Vamos criar uma diretiva para ser usada na verificação de permissão para exibição de componentes na tela da aplicação.

Normalmente nas nossas aplicações a gente precisa restringir acesso a certos módulos, telas, ou componentes.

Em um sistema que trabalhei, as permissões eram configuradas por perfils de acesso e cada perfil tinha ainda módulos e quais ações eram permitidas sobre esse módulo. 

Por exemplo, se tenho um módulo chamado "Páginas". E temos 2 perfis  "Editor" e "Revisor".

```json
{
  "profiles": {
    "editor": {
      "modules": {
        "pages": {
          "cancreate": true,
          "canread": true
        }     
      }
    },
    "revisor": {
      "modules": {
        "pages": {
          "cancreate": false,
          "canread": true
        }     
      }
    }
  }
}
```

A ideia do uso da diretiva seria assim:

```html
<div v-permission="pages:canread">
</div>

<my-component v-permission="pages:canread && canwrite">
</my-component>

<my-component v-permission="pages:canread || canwrite">
</my-component>
```

A definição da diretiva seria algo assim:

```javascript
Vue.directive('permission', {
  inserted (el, binding, vnode) {
    // Se a diretiva tiver um valor atribuído
    if (binding.value) {
      // Se não existir um usuário logado remove o elemento
      if (!vnode.context.$auth.user) {
        el.parentNode.removeChild(el)
      } else {
        // Pegamos as permissões do usuário logado
        const permissions = vnode.context.$auth.user.permissions || []
        // Chamamos a função que fará a verificação das permissões
        if (!hasPermission(permissions, binding.value)) {
          // Se não tiver as permissões remove o elemento
          el.parentNode.removeChild(el)
        }
      }
    } else {
      // Se não tiver valor atribuído a gente remove o elemento
      el.parentNode.removeChild(el)
    }
  }
})
```

## A função chave

Criei separadamente uma função que é responsável por validar as regras das permissões necessárias

```javascript
export function hasPermission (userPermissions, permissionsRequired) {
  // Primeiro descontruímos o valor associado a diretiva
  // Separamos o nome do módulo das permissões requisitadas
  // Removemos ao mesmo tempo os espaços em branco
  const [module, permissions] = permissionsRequired.replace(/ /g, '').split(':')

  // Procuramos dentre as permissões do usuário, as permissões do módulo
  // indicado no valor da diretiva
  const moduleInUserPermissions = userPermissions.find((item) => {
    return item.ModuleName === module
  })

  // Se o módulo da diretiva não existir, então já não tem permissão
  if (!moduleInUserPermissions) {
    return false
  }

  // Pegamos quais ações estão no módulo
  // Ex: canread, canwrite, candelete, etc
  const permissionsInModule = Object.keys(moduleInUserPermissions)

  let permissionsToEvaluate = permissions.toLowerCase()
  permissionsInModule.forEach((permission) => {
    // Se a ação do módulo está presente no valor da diretiva
    if (permissionsToEvaluate.includes(permission.toLowerCase())) {
      // Pegamos o valor booleano da permissão
      // O resultado do replace vai gerar uma string com valores booleanos
      // 'true && false'
      permissionsToEvaluate = permissionsToEvaluate.replace(permission.toLowerCase(), moduleInUserPermissions[permission])
    }
  })

  // No final retornamos a avaliação da string 'true && false'
  return eval(permissionsToEvaluate)
}
```

## Isso não é tudo

Lembrando que isso não é tudo pra garantir a segurança de acesso a áreas restritas. Ainda se faz necessário ter regras de restrição no backend do seu projeto.

O uso da função `eval` é desencorajado em certas situações no JavaScript, se você usa ESLint com regras padrões de Vue ou Nuxt haverá um erro. Você pode incluir um comentário sobre a linha do `eval : ```// eslint-disable-next-line no-eval``` para ignorar essa regra apenas nessa linha