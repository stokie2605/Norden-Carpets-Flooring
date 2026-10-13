// No duplicate photos: every photo on the home page is used once, and no two of them are the same original file.
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')
const sourceDir = 'design-source/installations'
const sources = new Map(readdirSync(join(root, sourceDir)).map((f) => [f.slice(0, -extname(f).length), f]))

// Photos named in the content file and in the components that render them.
function usedPhotos() {
  const site = read('src/content/site.ts')
  const fromContent = [...site.matchAll(/^\s*image: '([\w-]+)'/gm)].map((m) => m[1])
  const fromComponents = ['Hero', 'ShowroomMap'].flatMap((c) =>
    [...read(`src/components/${c}.tsx`).matchAll(/name="([\w-]+)"/g)].map((m) => m[1]),
  )
  return [...fromContent, ...fromComponents]
}

describe('photos', () => {
  it('uses each photo once on the page', () => {
    const used = usedPhotos()
    expect(used.length).toBeGreaterThan(5)
    const repeats = used.filter((name, i) => used.indexOf(name) !== i)
    expect(repeats).toEqual([])
  })

  it('never shows the same original photo under two names', () => {
    const seen = new Map()
    for (const name of usedPhotos()) {
      const file = sources.get(name)
      expect(file, `${name} has no source in ${sourceDir}`).toBeDefined()
      const hash = createHash('sha1').update(readFileSync(join(root, sourceDir, file))).digest('hex')
      expect(seen.get(hash), `${name} is the same photo as ${seen.get(hash)}`).toBeUndefined()
      seen.set(hash, name)
    }
  })
})
