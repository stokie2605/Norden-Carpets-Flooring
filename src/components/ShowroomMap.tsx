import { useState } from 'react'
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react'
import { addressLines, business, hours, links, phones, towns, copy } from '../content/site'
import { buttonClasses } from './ui/Button'
import { FacebookIcon } from './ui/BrandIcons'

// Approximate town centres. The showroom uses the OL12 7TD postcode centroid.
const COORDS: Record<(typeof towns)[number], [lat: number, lon: number]> = {
  Norden: [53.6285, -2.2169],
  Bamford: [53.6174, -2.2007],
  Birtle: [53.6094, -2.2476],
  Edenfield: [53.6732, -2.3065],
  Ramsbottom: [53.6476, -2.3171],
  Bury: [53.5933, -2.2966],
  Rochdale: [53.6158, -2.1551],
}

// Hand placed labels so close neighbours (Norden, Bamford, Rochdale) never collide.
const LABELS: Record<(typeof towns)[number], { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }> = {
  Norden: { dx: 0, dy: -20, anchor: 'middle' },
  Bamford: { dx: 0, dy: 24, anchor: 'middle' },
  Birtle: { dx: -11, dy: 4, anchor: 'end' },
  Edenfield: { dx: 11, dy: 4, anchor: 'start' },
  Ramsbottom: { dx: 0, dy: -12, anchor: 'middle' },
  Bury: { dx: 11, dy: 4, anchor: 'start' },
  Rochdale: { dx: 0, dy: -12, anchor: 'middle' },
}

const BOUNDS = { north: 53.69, south: 53.58, west: -2.35, east: -2.13 }
const VIEW = { w: 440, h: 360, pad: 36 }

function project([lat, lon]: [number, number]) {
  const x = VIEW.pad + ((lon - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * (VIEW.w - VIEW.pad * 2)
  const y = VIEW.pad + ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * (VIEW.h - VIEW.pad * 2)
  return { x, y }
}

function CatchmentMap() {
  const home = project(COORDS.Norden)
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-labelledby="catchment-map-title" className="h-auto w-full">
      <title id="catchment-map-title">{`Map of the areas we cover around our Norden showroom: ${towns.join(', ')}.`}</title>
      <defs>
        <pattern id="map-grid" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0H0V22" fill="none" stroke="var(--line)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={VIEW.w} height={VIEW.h} fill="url(#map-grid)" />
      <circle cx={home.x} cy={home.y} r="190" fill="var(--pill)" opacity="0.55" />
      <circle cx={home.x} cy={home.y} r="190" fill="none" stroke="var(--accent)" strokeDasharray="4 6" strokeWidth="1.25" />
      {towns
        .filter((t) => t !== 'Norden')
        .map((town) => {
          const p = project(COORDS[town])
          return <line key={`l-${town}`} x1={home.x} y1={home.y} x2={p.x} y2={p.y} stroke="var(--ink)" strokeOpacity="0.14" />
        })}
      {towns.map((town) => {
        const p = project(COORDS[town])
        const isHome = town === 'Norden'
        const label = LABELS[town]
        return (
          <g key={town}>
            {isHome ? (
              <>
                <circle cx={p.x} cy={p.y} r="13" fill="var(--accent)" opacity="0.18" />
                <circle cx={p.x} cy={p.y} r="7" fill="var(--accent)" stroke="#fff" strokeWidth="2.5" />
              </>
            ) : (
              <circle cx={p.x} cy={p.y} r="5" fill="var(--ink)" stroke="#fff" strokeWidth="2" />
            )}
            <text
              x={p.x + label.dx}
              y={p.y + label.dy}
              textAnchor={label.anchor}
              fontSize={isHome ? 14 : 13}
              // The map shrinks to about three quarters scale on phones, so labels grow to stay near 13px on screen.
              className={isHome ? 'max-sm:text-[18px]' : 'max-sm:text-[17px]'}
              fontWeight={isHome ? 800 : 600}
              fill={isHome ? 'var(--accent-deep)' : 'var(--ink)'}
              fontFamily="var(--font-sans)"
              paintOrder="stroke"
              stroke="#fff"
              strokeWidth="4"
              strokeLinejoin="round"
            >
              {isHome ? 'Norden showroom' : town}
            </text>
          </g>
        )
      })}
    </svg>
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
          {copy.showroom.introStart} {towns.slice(0, -1).join(', ')} and {towns.at(-1)}, {copy.showroom.introEnd}
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
