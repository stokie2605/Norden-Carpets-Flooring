// Converts source photos in design-source/ into responsive AVIF and WebP files in public/images.
// Usage: npm run images
import { mkdir, readdir } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import sharp from 'sharp'

const SOURCES = ['design-source/unsplash', 'design-source/installations']
const OUT = 'public/images'
const WIDTHS = [480, 720, 1024, 1600]
// Hero is shown as a tall portrait crop; every other image is 4:3.
const ASPECT = { 'hero-bedroom': 4 / 5, 'hero-stairs': 4 / 5 }
const DEFAULT_ASPECT = 4 / 3

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
    for (const width of WIDTHS) {
      const height = Math.round(width / ratio)
      const pipeline = sharp(join(dir, file)).resize(width, height, { fit: 'cover', position: 'attention' })
      await pipeline.clone().avif({ quality: 50 }).toFile(join(OUT, `${name}-${width}.avif`))
      await pipeline.clone().webp({ quality: 72 }).toFile(join(OUT, `${name}-${width}.webp`))
    }
    console.log(`optimised ${name}`)
  }
}
