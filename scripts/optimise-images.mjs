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
  // Patterned bathroom vinyl, full width of the original so the room is shown, not just the pattern
  'tab-vinyl-02': { left: 0, top: 250, width: 1200, height: 900 },
  // Herringbone carpet on the stairs and landing, seen from above
  'tab-carpets-02': { left: 0, top: 560, width: 1134, height: 850 },
  // Carpet through a living room and round the two curved bottom steps
  'tab-carpets-03': { left: 0, top: 250, width: 1200, height: 900 },
  // Grey and white patterned bathroom vinyl, showing the floor up to the shower tray
  'tab-vinyl-03': { left: 0, top: 200, width: 1200, height: 900 },
}
// Fine patterns go soft at the default quality, so these get a higher setting and a light sharpen.
const CRISP = new Set(['tab-vinyl-02', 'tab-carpets-02', 'tab-carpets-03', 'tab-vinyl-03'])

// Hero is shown in its natural panoramic ratio so nothing is cut off; tabs and gallery use 4:3.
const ASPECT = {
  'hero-herringbone': 1024 / 456,
  // Dave's van, cut from the link preview image. Shown square in the showroom section.
  'showroom-van': 1,
}
const DEFAULT_ASPECT = 4 / 3
// Full width images also get a 2048px file so large screens are not stretching the 1600px one.
const EXTRA_WIDTHS = {
  'work-herringbone-02': [2048],
}
// Our work slideshow: the whole photo, never cropped, with a light colour lift (saved as name-show),
// because the originals are dim phone photos. Files are never made bigger than the original.
const SHOWCASE = new Set([
  'work-leopard-carpet-01',
  'work-cream-carpet-01',
  'work-stair-runner-01',
  'work-stairs-carpet-02',
  'work-utility-vinyl-01',
  'work-cloakroom-vinyl-01',
  'work-grey-lounge-laminate-01',
  'work-oak-lounge-laminate-01',
  'work-kitchen-laminate-02',
  'work-feature-wall-laminate-01',
  'work-dining-laminate-01',
  'work-hallway-transition-01',
  'work-lounge-laminate-02',
  'work-garden-room-01',
])
// Busy patterns make big files, so these get a lower quality to stay light on phones.
const SHOW_QUALITY = {
  'work-utility-vinyl-01': { avif: 38, webp: 58 },
}
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
    // Slideshow photos only need their uncropped -show files.
    const cropWidths = SHOWCASE.has(name) ? [] : [...WIDTHS, ...(EXTRA_WIDTHS[name] ?? [])]
    for (const width of cropWidths) {
      const height = Math.round(width / ratio)
      let pipeline = sharp(join(dir, file))
      if (CROPS[name]) {
        pipeline = pipeline.extract(CROPS[name]).resize(width, height)
        if (CRISP.has(name)) pipeline = pipeline.sharpen({ sigma: 0.7 })
      } else {
        pipeline = pipeline.resize(width, height, { fit: 'cover', position: 'attention' })
      }
      const crisp = CRISP.has(name)
      await pipeline.clone().avif({ quality: crisp ? 64 : 50 }).toFile(join(OUT, `${name}-${width}.avif`))
      await pipeline.clone().webp({ quality: crisp ? 85 : 72 }).toFile(join(OUT, `${name}-${width}.webp`))
    }
    if (SHOWCASE.has(name)) {
      for (const width of WIDTHS) {
        const show = lift(sharp(join(dir, file)).rotate().resize({ width, withoutEnlargement: true }))
        const q = SHOW_QUALITY[name] ?? { avif: 52, webp: 76 }
        await show.clone().avif({ quality: q.avif }).toFile(join(OUT, `${name}-show-${width}.avif`))
        await show.clone().webp({ quality: q.webp }).toFile(join(OUT, `${name}-show-${width}.webp`))
      }
    }
    console.log(`optimised ${name}`)
  }
}
