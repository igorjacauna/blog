export default defineAppConfig({
  alpine: {
    title: 'Igor Jacaúna',
    description: 'Um blog',
    image: {
      src: '/social-card-preview.png',
      alt: 'An image showcasing my project.',
      width: 400,
      height: 300
    },
    header: {
      position: 'right', // possible value are : | 'left' | 'center' | 'right'
      logo: {
        path: '/logo.svg', // path of the logo
        pathDark: '/logo-dark.svg', // path of the logo in dark mode, leave this empty if you want to use the same logo
        alt: 'igor jacaúna' // alt of the logo
      }
    },
    footer: {
      credits: {
        text: 'Igor Jacaúna',
        enabled: true, // possible value are : true | false
        repository: 'https://www.github.com/igorjacauna/blog' // our github repository
      },
      navigation: true, // possible value are : true | false
      alignment: 'center', // possible value are : 'none' | 'left' | 'center' | 'right'
      message: 'Redes sociais' // string that will be displayed in the footer (leave empty or delete to disable)
    },
    socials: {
      twitter: '',
      github: 'igorjacauna',
      linkedin: {
        icon: 'uil:linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/profile/igorjacauna'
      }
    },
    form: {
      successMessage: 'Message sent. Thank you!'
    }
  }
})