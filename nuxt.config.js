import blog from './blog.config'
import { footerLinks } from './blog.links'

const baseUrl = 'https://igorjacauna.com.br'

const publicRuntimeConfig = {
  showSocialIconsOnHeader: true,
  baseUrl,

  logoLight: '/logo-light.svg',
  logoDark: '/logo-dark.svg',

  githubOwner: 'igorjacauna',
  githubRepository: 'igorjacauna',
  githubMainBranch: 'master',

  twitterUsername: 'ijacauna',
  linkedinUsername: 'igorjacauna',

  sharingBlogPostEnabled: true,
  sharingDefaultHashtags: [],

  footerLinks,
}

export default blog({
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
