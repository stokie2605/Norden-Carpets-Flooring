// Post build page finishing, run after the client and SSR builds:
// 1. Injects server rendered HTML so content paints before JavaScript runs.
// 2. Inlines the stylesheet (about 7 kB compressed) to remove a render blocking request.
// 3. Preloads the display font so headings do not shift when it swaps in.
// Then removes the temporary SSR bundle.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = resolve('dist')
const SSR_DIR = resolve('dist-ssr')
const ROOT = '<div id="root"></div>'
const PAGES = [
  { page: 'home', file: 'index.html' },
  { page: 'privacy', file: 'privacy.html' },
  { page: 'terms', file: 'terms.html' },
]

const { render } = await import(pathToFileURL(join(SSR_DIR, 'entry-server.js')).href)
const assets = await readdir(join(DIST, 'assets'))
const displayFont = assets.find((f) => /^archivo-wdth-subset-.*\.woff2$/.test(f))
const stylesheetLink = /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/

for (const { page, file } of PAGES) {
  const path = join(DIST, file)
  let html = await readFile(path, 'utf8')
  if (!html.includes(ROOT)) throw new Error(`prerender: ${file} has no empty root to fill`)
  html = html.replace(ROOT, `<div id="root">${render(page)}</div>`)

  const link = html.match(stylesheetLink)
  if (!link?.[1]) throw new Error(`prerender: ${file} has no stylesheet link to inline`)
  const css = await readFile(join(DIST, link[1]), 'utf8')
  html = html.replace(link[0], () => `<style>${css}</style>`)

  if (displayFont) {
    const preload = `<link rel="preload" href="/assets/${displayFont}" as="font" type="font/woff2" crossorigin>`
    html = html.replace('</title>', `</title>\n    ${preload}`)
  }

  await writeFile(path, html)
  console.log(`prerender: ${file}`)
}

await rm(SSR_DIR, { recursive: true, force: true })
