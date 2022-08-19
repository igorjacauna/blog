import { DefaultTheme, defineConfig, UserConfig } from 'vitepress'

import path from 'path';
import fs from 'fs';

import { version } from '../../package.json'

export default defineConfig(
  <UserConfig<DefaultTheme.Config & {
    docFooter: {
      prev: string;
      next: string;
    }
  }>>{
  lang: 'pt-BR',
  title: 'Igor Jacaúna',
  description: 'Um blog',

  lastUpdated: true,

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/blog/': sidebarConfig(),
    },

    outlineTitle: 'Neste post',

    docFooter: {
      prev: 'Artigo anterior',
      next: 'Próximo artigo'
    },

    editLink: {
      pattern: 'https://github.com/igorjacauna/blog/docs/:path',
      text: 'Editar esta página no GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/igorjacauna' }
    ],

    footer: {
      message: 'Lançado sob a licença MIT',
      copyright: 'Copyright © 2019-present Igor Jacaúna'
    },

    // algolia: {
    //   appId: '8J64VVRP8K',
    //   apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
    //   indexName: 'vitepress'
    // },

    // carbonAds: {
    //   code: 'CEBDT27Y',
    //   placement: 'vuejsorg'
    // }
  }
})

function nav() {
  return [
    { text: 'Blog', link: '/blog/', activeMatch: '/blog/' },
  ]
}


function sidebarConfig() {
  function format(items: string[], dir = '') {
    return items.map((item) => {
      const content = fs.readFileSync(path.resolve(directoryPath, dir, item), { encoding:'utf8', flag:'r' })
      const titleRegEx = /#\s(.*)/;
      const text = content.match(titleRegEx);
      // Do whatever you want to do with the file
      return {
        text: text?.[1] || item,
        link: dir ? `/blog/${dir}/${item}` : `/blog/${item}`
      }
    });
  }

  const directoryPath = path.join(__dirname, '../', 'blog');
  const files = fs.readdirSync(directoryPath, {
    withFileTypes: true
  });

  const rootPosts = format(files.filter(f => f.isFile()).map(f => f.name))

  const categories = files.filter(f => f.isDirectory());

  const categoriesPosts = categories.map(c => {
    const files = fs.readdirSync(path.join(__dirname, '../', 'blog', c.name));
    return {
      text: c.name,
      collapsible: true,
      items: format(files, c.name)
    }
  })
  
  return [
    {
      text: 'Geral',
      collapsible: true,
      items: rootPosts
    },
    ...categoriesPosts
  ]
}