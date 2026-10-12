// Converts source photos in design-source/ into responsive AVIF and WebP files in public/images.
// Usage: npm run images
import { mkdir, readdir } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import sharp from 'sharp'

const SOURCES = ['design-source/installations']
const OUT = 'public/images'
const WIDTHS = [480, 720, 1024, 1600]
// Tailored crops for flooring tabs so the flooring material is the clear focus.
const CROPS = {
  // Focus on the carpet treads and the full curved bullnose step
  'tab-carpets': { left: 0, top: 900, width: 1134, height: 850 },
  // Focus on the patterned vinyl floor, keeping cupboards to a minimal plinth edge
  'tab-vinyl': { left: 150, top: 925, width: 900, height: 675 },
  // Zoom out to reveal the full room, archway, and expansive laminate floor
  'tab-laminate': { left: 0, top: 500, width: 1536, height: 1152 },
}

// Hero is shown in its natural panoramic ratio so nothing is cut off; tabs and gallery use 4:3.
const ASPECT = {
  'hero-herringbone': 1024 / 456,
}
const DEFAULT_ASPECT = 4 / 3
// Full width images also get a 2048px file so large screens are not stretching the 1600px one.
const EXTRA_WIDTHS = {
  'work-herringbone-02': [2048],
}
// Our work gallery: extra 3:4 portrait crops (saved as name-tall) with a light colour lift,
// because the originals are dim phone photos taken upright.
const TALL = new Set([
  'work-stairs-carpet-02',
  'work-hallway-transition-01',
  'work-garden-room-01',
  'work-kitchen-laminate-01',
])
const lift = (pipeline) =>
  pipeline.normalise({ lower: 1, upper: 99 }).modulate({ brightness: 1.04, saturation: 1.06 }).sharpen({ sigma: 0.6 })

await mkdir(OUT, { recursive: true })

for (const dir of SOURCES) {
  let files = []
  try {
    files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  } catch {
    continue
  }
  for (const file of files) {
    const name = basename(file, extname(file))
    const ratio = ASPECT[name] ?? DEFAULT_ASPECT
    for (const width of [...WIDTHS, ...(EXTRA_WIDTHS[name] ?? [])]) {
      const height = Math.round(width / ratio)
      let pipeline = sharp(join(dir, file))
      if (CROPS[name]) {
        pipeline = pipeline.extract(CROPS[name]).resize(width, height)
      } else {
        pipeline = pipeline.resize(width, height, { fit: 'cover', position: 'attention' })
      }
      await pipeline.clone().avif({ quality: 50 }).toFile(join(OUT, `${name}-${width}.avif`))
      await pipeline.clone().webp({ quality: 72 }).toFile(join(OUT, `${name}-${width}.webp`))
    }
    if (TALL.has(name)) {
      for (const width of WIDTHS) {
        const tall = lift(sharp(join(dir, file)).resize(width, Math.round((width * 4) / 3), { fit: 'cover', position: 'attention' }))
        await tall.clone().avif({ quality: 50 }).toFile(join(OUT, `${name}-tall-${width}.avif`))
        await tall.clone().webp({ quality: 72 }).toFile(join(OUT, `${name}-tall-${width}.webp`))
      }
    }
    console.log(`optimised ${name}`)
  }
}
