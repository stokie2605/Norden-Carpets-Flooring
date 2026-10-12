import { expect, test, type Page } from '@playwright/test'

const WIDTHS = [360, 375, 390, 414] as const
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'privacy', path: '/privacy.html' },
] as const
const SCREENSHOT_WIDTH = 375

/** Loads every lazy image and waits for fonts so layout and screenshots are final. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    for (const img of document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')) img.loading = 'eager'
    await Promise.all(
      [...document.images].map((img) => (img.complete ? null : img.decode().catch(() => null))),
    )
    await document.fonts.ready
  })
}

/**
 * Lists every rendered element whose right edge passes the viewport.
 * Elements inside an intentional scroll or clipping container (overflow-x auto, scroll, hidden or clip) are excluded.
 * The document scrollWidth check below still catches any real sideways scroll.
 */
async function findOverflow(page: Page) {
  return page.evaluate(() => {
    const viewport = document.documentElement.clientWidth
    const scrolls = (el: Element) => /^(auto|scroll|hidden|clip)$/.test(getComputedStyle(el).overflowX)
    const offenders: string[] = []

    for (const el of document.body.querySelectorAll('*')) {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0 || rect.right <= viewport + 0.5) continue
      if (getComputedStyle(el).visibility === 'hidden') continue

      let parent = el.parentElement
      while (parent && parent !== document.body && !scrolls(parent)) parent = parent.parentElement
      if (parent && parent !== document.body) continue

      const cls = typeof el.className === 'string' ? el.className.slice(0, 60) : ''
      const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 30)
      offenders.push(`<${el.tagName.toLowerCase()} class="${cls}"> "${text}" right=${Math.round(rect.right)}`)
    }

    const pageWidth = document.documentElement.scrollWidth
    if (pageWidth > viewport) offenders.unshift(`document scrollWidth ${pageWidth} > viewport ${viewport}`)
    return offenders
  })
}

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 800 } })

    for (const { name, path } of PAGES) {
      test(`${name}: nothing passes the right edge`, async ({ page }) => {
        await page.goto(path)
        await settle(page)
        expect(await findOverflow(page)).toEqual([])

        if (width === SCREENSHOT_WIDTH) {
          // Paint every section once and decode images synchronously, or a tall capture can show blank image tiles.
          await page.evaluate(async () => {
            for (const img of document.images) img.decoding = 'sync'
            for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
              scrollTo(0, y)
              await new Promise(requestAnimationFrame)
            }
            scrollTo(0, 0)
          })
          await page.screenshot({ path: `screenshots/mobile-${width}-${name}.png`, fullPage: true })
        }
      })
    }

    test('home: every material tab is on screen and opens its panel', async ({ page }) => {
      await page.goto('/')
      await settle(page)
      const tabs = page.getByRole('tablist', { name: 'Flooring types' }).getByRole('tab')
      await expect(tabs).toHaveCount(3)

      for (const tab of await tabs.all()) {
        const box = await tab.boundingBox()
        expect(box, `${await tab.textContent()} has no box`).not.toBeNull()
        expect(box!.x).toBeGreaterThanOrEqual(0)
        expect(box!.x + box!.width).toBeLessThanOrEqual(width)

        await tab.click()
        await expect(tab).toHaveAttribute('aria-selected', 'true')
        await expect(page.getByRole('tabpanel')).toBeVisible()
        expect(await findOverflow(page)).toEqual([])
      }
    })

    test('home: all four team members are fully on screen', async ({ page }) => {
      await page.goto('/')
      const members = page.getByRole('region', { name: 'Meet the team.' }).getByRole('listitem')
      await expect(members).toHaveCount(4)
      for (const member of await members.all()) {
        const box = (await member.boundingBox())!
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(width)
      }
    })

    test('home: catchment map labels and radius sit inside the map', async ({ page }) => {
      await page.goto('/')
      await settle(page)
      const map = page.getByRole('img', { name: /Map of the areas we cover/ })
      const result = await map.evaluate((svg) => {
        const frame = svg.getBoundingClientRect()
        const outside = [...svg.querySelectorAll('text, circle')].flatMap((node) => {
          const r = node.getBoundingClientRect()
          const inside =
            r.left >= frame.left - 0.5 &&
            r.right <= frame.right + 0.5 &&
            r.top >= frame.top - 0.5 &&
            r.bottom <= frame.bottom + 0.5
          return inside ? [] : [`${node.tagName} "${node.textContent ?? ''}"`]
        })
        const labels = [...svg.querySelectorAll('text')].map((t) => ({ name: t.textContent ?? '', r: t.getBoundingClientRect() }))
        // Town dots only: the radius ring and the showroom halo are meant to sit under labels.
        const dots = [...svg.querySelectorAll('circle')]
          .filter((c) => Number(c.getAttribute('r')) <= 7)
          .map((c) => ({ name: `dot near ${c.parentElement?.textContent ?? ''}`, r: c.getBoundingClientRect() }))
        // Labels need a visible gap between them, not just boxes that avoid touching.
        const hits = (a: DOMRect, b: DOMRect, gap: number) =>
          a.left - gap < b.right && b.left - gap < a.right && a.top - gap < b.bottom && b.top - gap < a.bottom
        const overlaps = labels.flatMap((a, i) => [
          ...labels.slice(i + 1).filter((b) => hits(a.r, b.r, 4)).map((b) => `${a.name} / ${b.name}`),
          ...dots.filter((b) => hits(a.r, b.r, 0)).map((b) => `${a.name} / ${b.name}`),
        ])
        return { outside, overlaps, frameRight: frame.right, smallestLabel: Math.min(...labels.map((l) => l.r.height)) }
      })
      expect(result.outside).toEqual([])
      expect(result.overlaps).toEqual([])
      expect(result.frameRight).toBeLessThanOrEqual(width)
      // A text box about 1.2x the font size; 14px boxes mean roughly 12px type.
      expect(result.smallestLabel).toBeGreaterThanOrEqual(14)
    })
  })
}
