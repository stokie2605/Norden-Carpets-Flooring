import { describe, expect, it } from 'vitest'
import { codePointsFromSource, isCovered } from './subset-fonts.mjs'

// Characters are built from code points so no tool or editor can rewrite them.
const ch = (cp) => String.fromCodePoint(cp)
const BS = String.fromCharCode(92)

describe('subset-fonts character collection', () => {
  it('collects literal non ASCII characters from copy', () => {
    const { codePoints } = codePointsFromSource(`price: 'From ${ch(0xa3)}16'`)
    expect([...codePoints]).toEqual([0xa3])
  })

  it('collects JS unicode escapes', () => {
    const { codePoints } = codePointsFromSource(`const nbsp = '${BS}u00a0'`)
    expect(codePoints.has(0xa0)).toBe(true)
  })

  it('decodes named and numeric HTML entities used in JSX', () => {
    const { codePoints, unknownEntities } = codePointsFromSource('&ldquo;Quote&rdquo; &copy; &#8217; &#x20AC; &amp;')
    expect(unknownEntities).toEqual([])
    for (const cp of [0x201c, 0x201d, 0xa9, 0x2019, 0x20ac, 38]) expect(codePoints.has(cp)).toBe(true)
  })

  it('reports entities it cannot map so they are never silently dropped', () => {
    expect(codePointsFromSource('a&zwnj;b').unknownEntities).toEqual(['&zwnj;'])
  })
})

describe('subset-fonts coverage check', () => {
  it('accepts characters the Latin source fonts contain', () => {
    for (const cp of [0x41, 0xa3, 0xe9, 0x2019, 0x20ac, 0x2122]) expect(isCovered(cp)).toBe(true)
  })

  it('rejects characters the fonts cannot render, such as emoji and Cyrillic', () => {
    for (const cp of [0x1f525, 0x2728, 0x0416, 0x0101]) expect(isCovered(cp)).toBe(false)
  })
})
