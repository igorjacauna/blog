import { readFileSync } from 'node:fs'
import { defineConfig, presetIcons, presetWind4 } from 'unocss'

// Ícones citados em content/projects.yml (editável pelo Studio, fora do alcance do scanner).
const projectIcons = readFileSync(new URL('./content/projects.yml', import.meta.url), 'utf8')
  .match(/i-[a-z0-9]+-[a-z0-9-]+/g) ?? []

export default defineConfig({
  safelist: [...new Set(projectIcons)],
  presets: [
    presetWind4({ dark: 'class' }),
    presetIcons({ scale: 1.1, extraProperties: { 'display': 'inline-block', 'vertical-align': 'middle' } }),
  ],
  theme: {
    font: {
      sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace',
    },
  },
  shortcuts: {
    'link-muted': 'text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors',
    'container-text': 'w-full mx-auto max-w-[44rem] px-5',
  },
})
