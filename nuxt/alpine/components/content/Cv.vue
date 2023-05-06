<script setup lang="ts">
const epxerienceItems = [
  {
    title: 'Frontend Sênior',
    place: 'Méliuz',
    period: '2021 - atualmente',
    img: '/cv/meliuzlogo.png',
    description: `
      <p>Atuo como desenvolvedor frontend sênior na Méliuz. Trabalhando com React, NextJS, React Native e NodeJS. Envolve também SEO, testes unitários com Jest, AWS, CI, Docker, colaboração, desenvolvimento em par e melhoria contínua tanto de processos como crescimento profissional do time.</p>
    `
  },
  {
    title: 'Analista de sistemas',
    place: 'FPF Tech',
    period: '2013 - 2021',
    img: '/cv/fpflogo.png',
    description: `
      <p>
        Desenvolvimento de aplicação para Windows como plataforma de anúncios envolvendo Visual C++, Chromium Embedded Framework e VueJS.
        Desenvolvimento de aplicações JAM stack com Angular, VueJS, NuxtJS, Aurelia, Django, .NET e .NET Core, Laravel, Lumen, Flask.
        Criação de ambientes com Docker e Docker Compose.
        Criação de ambientes de Integração Contínua com builds, testes, deploy integrados ao Git como GitlabCI e Github Actions.
      </p>
    `
  },
  {
    title: 'Estágio em PHP Wordpress',
    place: 'SEMTEC',
    period: '2011 - 2012',
    img: 'https://api.dicebear.com/6.x/icons/svg?seed=Coco',
    description: `
      <p>Trabalhei atuando na atualização de um sistema baseado em Wordpress e PHP</p>
    `
  },
  {
    title: 'Instrutor',
    place: 'CETAM',
    period: '2008 - 2009',
    img: 'https://api.dicebear.com/6.x/icons/svg?seed=Coco',
    description: `
      <p>Instrutor no Projeto Rede Cidadã. Ensino de Windows/Linux</p>
    `
  }
];

const skills = [
  'JavaScript',
  'TypeScript',
  'Vue',
  'React',
  'Node',
  'Docker',
  'SEO',
  'CI',
  'Unit Tests'
]

const social = [
  {
    name: '@igorjacauna',
    url: 'https://github.com/igorjacauna',
    icon: 'logos:github-icon',
  },
  {
    name: '@igorjacauna',
    url: 'https://www.linkedin.com/in/igorjacauna/',
    icon: 'logos:linkedin-icon',
  },
  {
    name: '@ijacauna',
    url: 'https://twitter.com/ijacauna',
    icon: 'logos:twitter',
  },
]
</script>
<template>
  <div class="cv">
    <aside>
      <div class="card">
        <h1>Ígor Jacaúna Martins</h1>
        <h3>Sênior Frotend Developer</h3>
      </div>
      <div class="card">
        <h2>Social</h2>
        <ul class="social">
          <template v-for="(profile, index) in social" :key="index">
            <li><a :href="profile.url" target="_blank"><Icon :name="profile.icon" size="24" />{{ profile.name }}</a></li>
          </template>
        </ul>
      </div>
      <div class="card">
        <h2>Skills</h2>
        <ul class="skills">
          <template v-for="(skill, index) in skills" :key="index">
            <li>{{ skill }}</li>
        </template>
        </ul>
      </div>
    </aside>
    <main>
      <article class="card about">
        <h2>Sobre</h2>
        <br>
        <p>
          Trabalho programação desde 2010 e nos meus projetos pessoais hoje trabalho com Vite, React, Vue, Nuxt, Tauri, Vitest e o que mais tiver de novo e que possa melhorar o desenvolvimento.
        </p>
        <br>
        <p>
          Esses projetos estão mais para prova de conceitos e busca por melhoria de processos e DX (Developer Experience) onde quer que eu esteja trabalhando.
        </p>
        <br>
        <p>
          Tenho projetos publicados que me ajudam a construir novas coisas, são mais para ferramentas que poupam tempo como:
        </p>
        <br>
        <p>
          <pre>@igorjacauna/eslint-config</pre> contém regras de ESLint que costumo usar. 
          <br>
          <br>
          <pre>@spalla-dev/starter</pre> que é um prompt para criar proojetos rapidamente a partir de templates presente no repositório.
        </p>
      </article>
      <article class="card experience">
        <h2>Experiência</h2>
        <template v-for="(item, index) in epxerienceItems" :key="index">
          <div class="experience-item">
            <div class="image">
              <img :src="item.img" alt="">
            </div>
            <div class="content">
              <div class="title">{{ item.title }}</div>
              <div class="meta secondary-text">
                <div><Icon name="ph:suitcase-simple" class="icon" size="16"/>{{ item.place }}</div>
                <div><Icon name="material-symbols:calendar-month-outline-rounded" class="icon" size="16" />{{ item.period }}</div>
              </div>
              <div class="description" v-html="item.description" />
            </div>
            <hr />
          </div>
        </template>
      </article>
      <article class="card experience">
        <h2>Formação</h2>
        <div class="experience-item">
          <div class="image">
            <img src="/cv/fucapilogo.png" alt="">
          </div>
          <div class="content">
            <div class="title">Ciência da Computação</div>
            <div class="meta secondary-text">
              <div><Icon name="iconoir:graduation-cap" class="icon" size="16"/>FUCAPI</div>
              <div><Icon name="material-symbols:calendar-month-outline-rounded" class="icon" size="16" />2013 - 2017</div>
            </div>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>
<style>
:root {
  --cv-border: rgba(60, 60, 60, 0.13);
  --cv-text: rgba(60, 60, 60, 0.7);
  --cv-text-2: rgba(60, 60, 60, 0.6);
  --cv-bg: #f9f9f9;
  --cv-tag-bg: $dt('color.primary.200');
  --cv-tag-color: $dt('color.primary.700');
}

.dark {
  --cv-border: rgba(80, 80, 80, 0.8);
  --cv-text: rgba(235, 235, 235, 0.7);
  --cv-text-2: rgba(235, 235, 235, 0.4);
  --cv-bg: rgba(60, 60, 60, 0.7);
  --cv-tag-bg: $dt('color.primary.700');
  --cv-tag-color: $dt('color.primary.200');
}
</style>
<style scoped lang="postcss">
.cv {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;

  h1 {
    font-size: 1.3em;
    font-weight: 600;
  }
  
  h2 {
    font-size: 1.2em;
    font-weight: 600;
  }
  
  h3 {
    font-size: .8em;
    color: var(--cv-text-2);
  }
  
  .secondary-text {
    color: var(--cv-text-2);
  }

  .card {
    padding: 24px;
    border-radius: 12px;
    border: 1px solid var(--cv-border);
    background-color: var(--cv-bg);
  }

  aside {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .social {
      margin-top: 24px;
      li a {
        display: flex;
        justify-content: space-between;
        margin: 12px 0;
      }
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 24px;

      li {
        padding: 4px 16px;
        background-color: var(--cv-tag-bg);
        color: var(--cv-tag-color);
        border-radius: .75em;
        font-size: .9em;
      }
    }
  }

  main {
    display: grid;
    gap: 12px;

    .experience {
      h2{
        margin-bottom: 24px;
      }
      
      .experience-item {
        display: grid;
        gap: 24px;
        grid-template-columns: 56px 1fr;
        margin-bottom: 24px;
        
        hr {
          grid-column: 1 / span 2;
          border: 0;
          border-bottom: 1px solid var(--cv-border);
        }

        .content {
          .title {
            font-weight: 500;
          }
          .meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.8em;

            .icon {
              margin-right: 8px;
            }
          }

          .description {
            margin-top: 24px;
          }
        }
      }

    }
  }
}
</style>
