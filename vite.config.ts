import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/** Precarga las dos fuentes del primer render (titulares y texto, subconjunto latino). */
function preloadFonts(): Plugin {
  const wanted = [/manrope-latin-wght-normal-.*\.woff2$/, /dm-sans-latin-opsz-normal-.*\.woff2$/]
  return {
    name: 'ceproc-preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) => wanted.some((r) => r.test(f)))
        return files.map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${f}`, crossorigin: '' },
          injectTo: 'head-prepend' as const,
        }))
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), preloadFonts()],
})
