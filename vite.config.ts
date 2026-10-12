/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { parse } from 'smol-toml'

const PRODUCTION_BRANCH = 'main'

type WranglerVars = { VITE_TURNSTILE_SITE_KEY?: string }
type WranglerConfig = {
  vars?: WranglerVars
  env?: { preview?: { vars?: WranglerVars } }
}

/**
 * Public build values live in wrangler.toml so the dashboard holds secrets only.
 * Cloudflare Pages sets CF_PAGES_BRANCH during builds: main gets [vars],
 * every other branch (and local dev) gets [env.preview.vars].
 * A VITE_TURNSTILE_SITE_KEY in the shell or a local .env file wins over both.
 */
function resolveTurnstileSiteKey(mode: string): string {
  const local = loadEnv(mode, process.cwd(), 'VITE_')
  const override = process.env.VITE_TURNSTILE_SITE_KEY ?? local.VITE_TURNSTILE_SITE_KEY
  if (override) return override

  const config = parse(readFileSync(resolve(import.meta.dirname, 'wrangler.toml'), 'utf8')) as WranglerConfig
  const isProduction = process.env.CF_PAGES_BRANCH === PRODUCTION_BRANCH
  const key = isProduction
    ? config.vars?.VITE_TURNSTILE_SITE_KEY
    : config.env?.preview?.vars?.VITE_TURNSTILE_SITE_KEY

  if (!key) throw new Error('VITE_TURNSTILE_SITE_KEY is missing from wrangler.toml')
  return key
}

/** Serve /privacy locally the same way Cloudflare Pages does (privacy.html at /privacy). */
function cleanUrls(): Plugin {
  const rewrite = (url: string | undefined) => url?.replace(/^\/privacy\/?(?=$|\?)/, '/privacy.html')
  return {
    name: 'norden-clean-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        req.url = rewrite(req.url)
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        req.url = rewrite(req.url)
        next()
      })
    },
  }
}

/**
 * Link previews (WhatsApp, Facebook) need an absolute og:image URL. index.html points at the
 * production domain; on preview branches Cloudflare sets CF_PAGES_URL, so point it there instead
 * and previews of pages.dev links show the image too.
 */
function previewOgImage(): Plugin {
  return {
    name: 'norden-preview-og-image',
    transformIndexHtml(html) {
      const previewUrl = process.env.CF_PAGES_URL
      if (!previewUrl || process.env.CF_PAGES_BRANCH === PRODUCTION_BRANCH) return html
      return html.replace(
        /(<meta property="og:image" content=")https:\/\/nordencarpets\.co\.uk/,
        `$1${previewUrl.replace(/\/$/, '')}`,
      )
    },
  }
}

export default defineConfig(({ mode, isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), cleanUrls(), previewOgImage()],
  define: {
    'import.meta.env.VITE_TURNSTILE_SITE_KEY': JSON.stringify(resolveTurnstileSiteKey(mode)),
  },
  build: {
    target: 'es2022',
    // The SSR build (used only for prerendering) takes its entry from the CLI instead.
    rollupOptions: isSsrBuild
      ? {}
      : {
          input: {
            main: resolve(import.meta.dirname, 'index.html'),
            privacy: resolve(import.meta.dirname, 'privacy.html'),
          },
        },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'functions/**/*.test.ts', 'scripts/**/*.test.mjs'],
  },
}))
