// Guardrails: locks the approved decisions in CLAUDE.md so any agent that drifts fails the test run.
// Do not edit or delete this file to make a change pass. Change the decision in CLAUDE.md first.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')

function filesUnder(dir, ext) {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const rel = join(dir, name)
    if (statSync(join(root, rel)).isDirectory()) return filesUnder(rel, ext)
    return ext.test(name) && !/\.test\./.test(name) ? [rel] : []
  })
}

const componentFiles = filesUnder('src/components', /\.tsx$/)

describe('guardrails', () => {
  it('has no dark mode', () => {
    expect(read('src/styles/index.css')).not.toMatch(/prefers-color-scheme|\.dark\b/)
    for (const file of componentFiles) expect(read(file), file).not.toMatch(/\bdark:/)
  })

  it('shows no prices in copy or structured data', () => {
    expect(read('src/content/site.ts')).not.toMatch(/£|\bprice/i)
    for (const page of ['index.html', 'privacy.html', 'terms.html']) {
      expect(read(page), page).not.toMatch(/minPrice|maxPrice|priceSpecification|£\s?\d/)
    }
  })

  it('keeps the approved section order', () => {
    const order = [...read('src/App.tsx').matchAll(/^\s*<(\w+) \/>/gm)].map((m) => m[1])
    expect(order).toEqual([
      'Hero',
      'MaterialSwitcher',
      'PreviousWork',
      'TeamStrip',
      'ProofWall',
      'ShowroomMap',
    ])
  })

  it('keeps the approved team', () => {
    const team = read('src/content/site.ts').match(/export const team = \[([\s\S]*?)\]/)?.[1] ?? ''
    const names = [...team.matchAll(/name: '(\w+)'/g)].map((m) => m[1])
    expect(names.sort()).toEqual(['Dave', 'Jake', 'Tom', 'Wendy'])
  })

  it('uses only design tokens or approved brand colours', () => {
    const allowed = new Set(['#1877f2', '#128c7e', '#fff', '#ffffff'])
    for (const file of componentFiles) {
      for (const [hex] of read(file).matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        expect(allowed.has(hex.toLowerCase()), `${file}: ${hex}`).toBe(true)
      }
    }
  })

  it('adds no runtime dependencies without approval', () => {
    const pkg = JSON.parse(read('package.json'))
    expect(Object.keys(pkg.dependencies).sort()).toEqual(['lucide-react', 'react', 'react-dom'])
  })
})
