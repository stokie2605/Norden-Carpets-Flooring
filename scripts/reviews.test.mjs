// No repeated reviews: every customer quote on the site appears once.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('reviews', () => {
  it('never shows the same quote twice', () => {
    const site = readFileSync(join(process.cwd(), 'src/content/site.ts'), 'utf8')
    const quotes = [...site.matchAll(/quote:\s*\n?\s*(['"])(.+?)\1/g)].map((m) => m[2])
    expect(quotes.length).toBeGreaterThan(8)
    expect(quotes.filter((q, i) => quotes.indexOf(q) !== i)).toEqual([])
  })
})
