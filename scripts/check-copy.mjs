// Copy guard: rejects em dashes, en dashes and spaced hyphens in client facing text.
// Scope is deliberately narrow: string values in src/content and the visible text of the HTML pages.
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const RULES = [
  { name: 'em dash', pattern: /\u2014/ },
  { name: 'en dash', pattern: /\u2013/ },
  { name: 'spaced hyphen', pattern: / - / },
]

/** String literal values from a TypeScript source file. Comments are ignored. */
export function stringsFromSource(source) {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  const strings = []
  for (const m of withoutComments.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)) {
    strings.push(m[1] ?? m[2] ?? m[3] ?? '')
  }
  return strings
}

/** Visible text and meta copy from an HTML page. Scripts, styles and markup are ignored. */
export function textFromHtml(html) {
  const meta = [...html.matchAll(/<meta[^>]+content="([^"]*)"/g)].map((m) => m[1])
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, '\n')
  return [...meta, ...body.split('\n').map((s) => s.trim()).filter(Boolean)]
}

export function findViolations(texts, origin) {
  const problems = []
  for (const text of texts) {
    for (const rule of RULES) {
      if (rule.pattern.test(text)) problems.push(`${origin}: ${rule.name} in "${text.slice(0, 80)}"`)
    }
  }
  return problems
}

async function contentFiles(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await contentFiles(path)))
    else if (/\.tsx?$/.test(entry.name) && !entry.name.includes('.test.')) out.push(path)
  }
  return out
}

async function main() {
  const problems = []
  for (const file of await contentFiles('src/content')) {
    problems.push(...findViolations(stringsFromSource(await readFile(file, 'utf8')), file))
  }
  for (const file of ['index.html', 'privacy.html', 'terms.html']) {
    problems.push(...findViolations(textFromHtml(await readFile(file, 'utf8')), file))
  }
  if (problems.length) {
    console.error(`lint:copy found ${problems.length} problem(s):\n  ${problems.join('\n  ')}`)
    process.exit(1)
  }
  console.log('lint:copy passed')
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main()
}
