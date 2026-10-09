import { useState } from 'react'
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react'
import { addressLines, business, hours, links, phones, towns, copy } from '../content/site'
import { buttonClasses } from './ui/Button'
import { FacebookIcon } from './ui/BrandIcons'

// Map tiles come from OpenStreetMap and load in the visitor's browser (see the privacy notice).
// The view is fixed: zoom 10, centred on Norden, with a ring showing roughly how far we travel.
const SHOWROOM = { lat: 53.6285, lon: -2.2169 }
const ZOOM = 10
const TILE = 256
const BOX = { w: 704, h: 576 } // 11:9, in map pixels at ZOOM
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
      aria-label={`Map of the areas we cover: about ${RADIUS_KM}km around our Norden showroom.`}
      className="relative aspect-[11/9] w-full overflow-hidden bg-bg-alt"
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
  const [showLiveMap, setShowLiveMap] = useState(false)

  return (
    <section id="showroom" aria-labelledby="showroom-title" className="bg-bg-alt py-16 sm:py-24">
      <div className="container-x">
        <p className="eyebrow">{copy.showroom.eyebrow}</p>
        <h2 id="showroom-title" className="mt-3 max-w-3xl text-section font-extrabold">
          {copy.showroom.title}
        </h2>
        <p className="mt-4 max-w-2xl text-ink-soft">
          {copy.showroom.intro}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-line bg-bg p-7 sm:p-9">
            <h3 className="text-2xl font-extrabold">{business.name}</h3>
            <address className="mt-4 flex gap-3 not-italic text-ink-soft">
              <MapPin className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
              <span>
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </address>

            <div className="mt-6 flex gap-3">
              <Clock className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
              <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
                {hours.map((h) => (
                  <div key={h.days} className="contents">
                    <dt className="font-medium text-ink">{h.days}</dt>
                    <dd className="text-ink-soft">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <ul className="mt-6 space-y-1 border-t border-line pt-6">
              {[phones.showroom, phones.mobile].map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="flex min-h-11 items-center gap-3 font-semibold text-ink hover:text-accent-deep">
                    <Phone className="size-5 text-accent" aria-hidden="true" />
                    <span>
                      {p.display} <span className="font-normal text-muted">({p.label})</span>
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${business.email}`}
                  className="flex min-h-11 items-center gap-3 break-all font-semibold text-ink hover:text-accent-deep"
                >
                  <Mail className="size-5 shrink-0 text-accent" aria-hidden="true" />
                  {business.email}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={business.mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses({ size: 'md' })}>
                <Navigation className="size-4" aria-hidden="true" />
                Get directions
                <span className="sr-only">(opens Google Maps in a new tab)</span>
              </a>
              <a href={links.facebook} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: 'secondary', size: 'md' })}>
                <FacebookIcon className="size-4 text-[#1877F2]" />
                Facebook
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-bg">
            {showLiveMap ? (
              <iframe
                title="Google Map showing Norden Carpets & Flooring at Tenterhouse Mill"
                src={business.mapsEmbedUrl}
                className="aspect-[11/9] w-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <CatchmentMap />
            )}
            <div className="mt-auto flex flex-col gap-3 border-t border-line p-5 sm:flex-row sm:items-center sm:justify-between">
              <ul className="flex flex-wrap gap-1.5" aria-label="Areas covered">
                {towns.map((t) => (
                  <li key={t} className="rounded-full bg-bg-alt px-2.5 py-1 text-xs font-medium text-ink-soft">
                    {t}
                  </li>
                ))}
              </ul>
              {!showLiveMap && (
                <button
                  type="button"
                  onClick={() => setShowLiveMap(true)}
                  className={buttonClasses({ variant: 'secondary', size: 'md', className: 'shrink-0' })}
                >
                  Show interactive map
                </button>
              )}
            </div>
            {!showLiveMap && (
              <p className="px-5 pb-5 text-xs text-muted">
                The interactive map is provided by Google and only loads when you tap the button. See our{' '}
                <a href={links.privacy} className="underline">
                  privacy notice
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
