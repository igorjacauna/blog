import theme from '@nuxt/content-theme-docs'
import path from 'path'

export default theme({
  srcDir: '.',
  server: {
    port: 3003
  },
  docs: {
    primaryColor: '#845ce0'
  }
})
