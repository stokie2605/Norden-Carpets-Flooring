import { Navigation } from 'lucide-react'
import { business, towns, copy } from '../content/site'
import { buttonClasses } from './ui/Button'
import { Picture } from './ui/Picture'

// Map tiles come from OpenStreetMap and load in the visitor's browser (see the privacy notice).
// The view is fixed: zoom 10, centred on Norden, with a ring showing roughly how far we travel.
const SHOWROOM = { lat: 53.6285, lon: -2.2169 }
const ZOOM = 10
const TILE = 256
const BOX = { w: 600, h: 600 } // square, in map pixels at ZOOM, so the ring fills the frame
const RADIUS_KM = 25

function toPixels(lat: number, lon: number) {
  const scale = TILE * 2 ** ZOOM
  const rad = (lat * Math.PI) / 180
  return {
    x: ((lon + 180) / 360) * scale,
    y: ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * scale,
  }
}

function CatchmentMap() {
  const centre = toPixels(SHOWROOM.lat, SHOWROOM.lon)
  const left = centre.x - BOX.w / 2
  const top = centre.y - BOX.h / 2
  const metresPerPixel = (156543.03392 * Math.cos((SHOWROOM.lat * Math.PI) / 180)) / 2 ** ZOOM
  const radius = (RADIUS_KM * 1000) / metresPerPixel

  const tiles: { x: number; y: number }[] = []
  for (let ty = Math.floor(top / TILE); ty * TILE < top + BOX.h; ty++) {
    for (let tx = Math.floor(left / TILE); tx * TILE < left + BOX.w; tx++) tiles.push({ x: tx, y: ty })
  }
  const pct = (value: number, total: number) => `${(value / total) * 100}%`

  return (
    <div
      role="img"
      aria-label={copy.showroom.mapLabel}
      className="relative aspect-square w-full overflow-hidden bg-bg-alt"
    >
      {tiles.map((t) => (
        <img
          key={`${t.x}-${t.y}`}
          src={`https://tile.openstreetmap.org/${ZOOM}/${t.x}/${t.y}.png`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          referrerPolicy="strict-origin-when-cross-origin"
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden'
          }}
          width={TILE}
          height={TILE}
          className="absolute max-w-none grayscale opacity-70"
          style={{
            left: pct(t.x * TILE - left, BOX.w),
            top: pct(t.y * TILE - top, BOX.h),
            width: pct(TILE, BOX.w),
            height: pct(TILE, BOX.h),
          }}
        />
      ))}
      <svg viewBox={`0 0 ${BOX.w} ${BOX.h}`} aria-hidden="true" className="absolute inset-0 size-full">
        <circle cx={BOX.w / 2} cy={BOX.h / 2} r={radius} fill="var(--accent)" fillOpacity="0.08" />
        <circle
          cx={BOX.w / 2}
          cy={BOX.h / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeDasharray="8 8"
        />
        <circle cx={BOX.w / 2} cy={BOX.h / 2} r="12" fill="var(--accent)" stroke="#fff" strokeWidth="4" />
      </svg>
      <span className="absolute left-1/2 top-1/2 mt-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-bg px-3 py-1 text-xs font-bold text-accent-deep shadow-sm">
        {copy.showroom.mapPin}
      </span>
      <span className="absolute left-3 top-3 rounded-full bg-bg px-3 py-1 text-xs font-semibold text-ink shadow-sm">
        {copy.showroom.mapRadius}
      </span>
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 right-0 bg-bg/85 px-1.5 py-0.5 text-[0.65rem] text-ink-soft"
      >
        &copy; OpenStreetMap contributors
      </a>
    </div>
  )
}

export function ShowroomMap() {
  return (
    <section id="showroom" aria-labelledby="showroom-title" className="relative isolate overflow-hidden bg-bg-alt py-12 sm:py-16">
      {/* Dave's herringbone lounge job, shown whole and faded behind the section like the hero. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[22rem] sm:h-[26rem] lg:inset-y-0 lg:h-auto">
        <Picture
          name="hero-herringbone"
          alt=""
          sizes="100vw"
          width={1024}
          height={456}
          className="size-full object-cover object-[35%_60%] lg:object-[50%_55%]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-bg-alt/45 via-bg-alt/80 to-bg-alt lg:bg-linear-to-l lg:from-bg-alt lg:from-35% lg:via-bg-alt/80 lg:via-55% lg:to-bg-alt/5" />
      </div>
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-center lg:gap-12">
          <div>
            <p className="eyebrow">{copy.showroom.eyebrow}</p>
            <h2 id="showroom-title" className="mt-3 max-w-2xl text-section font-extrabold">
              {copy.showroom.title}
            </h2>
            <p className="mt-4 max-w-xl text-ink-soft">{copy.showroom.intro}</p>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-ink">{copy.showroom.areasTitle}</h3>
            <ul className="mt-3 flex max-w-xl flex-wrap gap-2" aria-label={copy.showroom.areasTitle}>
              {towns.map((t) => (
                <li key={t} className="rounded-full border border-line bg-bg px-3 py-1.5 text-sm font-medium text-ink-soft">
                  {t}
                </li>
              ))}
            </ul>

            <a
              href={business.mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: 'secondary', size: 'md', className: 'mt-6' })}
            >
              <Navigation className="size-4 text-accent" aria-hidden="true" />
              {copy.cta.directions}
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          </div>

          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-line bg-bg shadow-lg lg:order-first lg:max-w-none">
            <CatchmentMap />
          </div>
        </div>
      </div>
    </section>
  )
}
