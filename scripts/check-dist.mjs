// Post build guard: fails production builds that still contain TODO_CONFIRM placeholders.
// Fails only when Cloudflare Pages builds the production branch (CF_PAGES_BRANCH=main).
// Preview branches and local builds print a warning and continue.
import { readdir, readFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

export const MARKER = 'TODO_CONFIRM'
export const PRODUCTION_BRANCH = 'main'
const TEXT_FILE = /\.(html|js|mjs|css|json|txt|xml|svg|webmanifest)$/i

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else if (TEXT_FILE.test(entry.name)) yield path
  }
}

/** Returns every placeholder found in the built output, with file and a short excerpt. */
export async function findMarkers(dir) {
  const hits = []
  for await (const file of walk(dir)) {
    const text = await readFile(file, 'utf8')
    for (const match of text.matchAll(new RegExp(`${MARKER}[\\w ]{0,48}`, 'g'))) {
      hits.push({ file: relative(dir, file).split(sep).join('/'), excerpt: match[0].trim() })
    }
  }
  return hits
}

/** Returns the process exit code: 1 only for a production branch build with markers present. */
export async function checkDist({ dir = 'dist', branch = process.env.CF_PAGES_BRANCH, log = console } = {}) {
  const hits = await findMarkers(dir)
  if (hits.length === 0) {
    log.log(`check-dist: no ${MARKER} markers in ${dir}/`)
    return 0
  }
  const lines = hits.map((h) => `  ${h.file}: ${h.excerpt}`).join('\n')
  if (branch === PRODUCTION_BRANCH) {
    log.error(
      `check-dist: ${hits.length} ${MARKER} marker(s) found. Production deploys are blocked until they are resolved:\n${lines}`,
    )
    return 1
  }
  log.warn(
    `check-dist: warning, ${hits.length} ${MARKER} marker(s) found (branch: ${branch ?? 'local'}). These will block a ${PRODUCTION_BRANCH} deploy:\n${lines}`,
  )
  return 0
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(await checkDist())
}
