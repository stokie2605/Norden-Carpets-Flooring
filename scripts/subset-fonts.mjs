// Subsets the variable fonts to the characters this site actually uses, keeping only the axes in use.
// Runs automatically as `prebuild`, so new copy can never ship glyphs missing from the subset.
// The character set is collected from source (copy, components, HTML pages), not hard coded,
// and the build fails if copy uses a character the Latin source fonts cannot render at all.
// Output is committed in src/assets/fonts so `npm run dev` works without a build.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const OUT = 'src/assets/fonts'
const SOURCE_DIRS = ['src']
const SOURCE_FILES = ['index.html', 'privacy.html', 'terms.html']
const SOURCE_EXT = /\.(tsx?|css|html)$/

// Always included: printable ASCII and the no-break space.
const BASE_CODE_POINTS = [...Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => 0x20 + i), 0xa0]

// What the fontsource Latin files can render (their published unicode-range).
const LATIN_COVERAGE = [
  [0x0000, 0x00ff], [0x0131, 0x0131], [0x0152, 0x0153], [0x02bb, 0x02bc], [0x02c6, 0x02c6],
  [0x02da, 0x02da], [0x02dc, 0x02dc], [0x0304, 0x0304], [0x0308, 0x0308], [0x0329, 0x0329],
  [0x2000, 0x206f], [0x20ac, 0x20ac], [0x2122, 0x2122], [0x2191, 0x2191], [0x2193, 0x2193],
  [0x2212, 0x2212], [0x2215, 0x2215], [0xfeff, 0xfeff], [0xfffd, 0xfffd],
]

// Named HTML entities that may appear in JSX or HTML text.
const ENTITIES = {
  amp: 38, apos: 39, quot: 34, lt: 60, gt: 62, nbsp: 160, copy: 169, reg: 174, pound: 163,
  middot: 183, lsquo: 8216, rsquo: 8217, ldquo: 8220, rdquo: 8221, bull: 8226, hellip: 8230,
  euro: 8364, trade: 8482, ndash: 8211, mdash: 8212,
}

const BS = String.fromCharCode(92)
const JS_UNICODE_ESCAPE = new RegExp(`${BS}${BS}u([0-9a-fA-F]{4})`, 'g')
const NAMED_ENTITY = /&([a-zA-Z]+);/g
const NUMERIC_ENTITY = /&#(x[0-9a-fA-F]+|[0-9]+);/g

const FONTS = [
  // Headings only use bold and extrabold, at widths from 75 to 112.
  {
    from: 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2',
    to: 'archivo-wdth-subset.woff2',
    axes: { wght: { min: 700, max: 800 }, wdth: { min: 75, max: 112 } },
  },
  // Body copy uses regular through bold.
  {
    from: 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
    to: 'inter-wght-subset.woff2',
    axes: { wght: { min: 400, max: 700 } },
  },
]

/** Every code point a source file can put on screen: literal characters, JS escapes and HTML entities. */
export function codePointsFromSource(source) {
  const found = new Set()
  for (const ch of source) {
    const cp = ch.codePointAt(0)
    if (cp > 0x7e) found.add(cp)
  }
  for (const m of source.matchAll(JS_UNICODE_ESCAPE)) found.add(parseInt(m[1], 16))
  for (const m of source.matchAll(NUMERIC_ENTITY)) {
    const raw = m[1]
    found.add(raw.startsWith('x') ? parseInt(raw.slice(1), 16) : parseInt(raw, 10))
  }
  const unknownEntities = []
  for (const m of source.matchAll(NAMED_ENTITY)) {
    const cp = ENTITIES[m[1]]
    if (cp === undefined) unknownEntities.push(m[0])
    else found.add(cp)
  }
  return { codePoints: found, unknownEntities }
}

export function isCovered(cp) {
  return LATIN_COVERAGE.some(([start, end]) => cp >= start && cp <= end)
}

const hex = (cp) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`

async function sourceFiles(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await sourceFiles(path)))
    else if (SOURCE_EXT.test(entry.name) && !entry.name.includes('.test.')) out.push(path)
  }
  return out
}

async function main() {
  const files = [...SOURCE_FILES]
  for (const dir of SOURCE_DIRS) files.push(...(await sourceFiles(dir)))

  const codePoints = new Set(BASE_CODE_POINTS)
  const problems = []
  for (const file of files) {
    const { codePoints: found, unknownEntities } = codePointsFromSource(await readFile(file, 'utf8'))
    for (const entity of unknownEntities) problems.push(`${file}: unknown HTML entity ${entity}, add it to ENTITIES`)
    for (const cp of found) {
      if (!isCovered(cp)) problems.push(`${file}: ${hex(cp)} "${String.fromCodePoint(cp)}" is not in the Latin fonts`)
      codePoints.add(cp)
    }
  }
  if (problems.length) {
    console.error(`subset-fonts: ${problems.length} problem(s):\n  ${problems.join('\n  ')}`)
    process.exit(1)
  }

  const { default: subsetFont } = await import('subset-font')
  const text = String.fromCodePoint(...[...codePoints].sort((a, b) => a - b))
  await mkdir(OUT, { recursive: true })
  for (const font of FONTS) {
    const source = await readFile(font.from)
    const subset = await subsetFont(source, text, { targetFormat: 'woff2', variationAxes: font.axes })
    await writeFile(join(OUT, font.to), subset)
    console.log(`subset-fonts: ${font.to} ${(source.length / 1024).toFixed(1)} kB to ${(subset.length / 1024).toFixed(1)} kB`)
  }
  console.log(`subset-fonts: ${codePoints.size} characters from ${files.length} files`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main()
}
