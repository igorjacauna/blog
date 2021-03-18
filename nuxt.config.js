import theme from '@jsilva-pt/nuxt-content-theme-blog'
import { footerLinks } from './blog.settings'

const baseUrl = 'https://igorjacauna.github.io'

const publicRuntimeConfig = {
  baseUrl: 'https://igorjacauna.github.io',

  logoLight: '/logo-light.svg',
  logoDark: '/logo-dark.svg',

  githubOwner: 'igorjacauna',
  githubRepository: 'igorjacauna',
  githubMainBranch: 'master',

  footerLinks,
}

export default theme({
  feedOptions: {
    title: 'Blog',
    description: '',
    link: baseUrl,
  },
  publicRuntimeConfig,
  pwa: {
    manifest: {
      short_name: 'Blog',
    },
    meta: {
      author: 'Ígor Jacaúna',
      theme_color: '#2C3E50',
      ogHost: baseUrl,
      twitterCard: 'summary_large_image',
      twitterSite: publicRuntimeConfig.twitterUsername,
      twitterCreator: publicRuntimeConfig.twitterUsername,
    },
  },
  i18n: {
    locales: [
      {
        code: 'pt',
        iso: 'pt-BR',
        name: 'Português Brasil',
      },
      {
        code: 'en',
        iso: 'pt-US',
        name: 'English US',
      },
    ],
    defaultLocale: 'pt',
    vueI18n: {
      fallbackLocale: 'pt',
      messages: {
        pt: require('./i18n/pt-BR'),
        en: require('./i18n/en-US'),
      },
    },
  },
})
