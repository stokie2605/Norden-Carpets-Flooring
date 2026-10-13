import { Clock, MapPin, Navigation } from 'lucide-react'
import { addressLines, business, copy, hours, towns } from '../content/site'
import { buttonClasses } from './ui/Button'
import { Picture } from './ui/Picture'

/** Showroom and areas we cover: Dave's van, the showroom address and hours, the towns we cover and a directions link. */
export function ShowroomMap() {
  return (
    <section id="showroom" aria-labelledby="showroom-title" className="relative isolate overflow-hidden bg-bg-alt py-10 sm:py-16">
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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow">{copy.showroom.eyebrow}</p>
            <h2 id="showroom-title" className="mt-3 max-w-2xl text-section font-extrabold">
              {copy.showroom.title}
            </h2>
            <p className="mt-4 max-w-xl text-ink-soft">{copy.showroom.intro}</p>

            <p className="mt-6 flex max-w-xl gap-2.5 font-medium text-ink">
              <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <span>{addressLines.join(', ')}</span>
            </p>
            <p className="mt-3 flex max-w-xl gap-2.5 text-ink-soft">
              <Clock className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <span>
                {hours
                  .filter((h) => h.time !== 'Closed')
                  .map((h) => `${h.days} ${h.time}`)
                  .join(', ')}
              </span>
            </p>

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

          {/* Dave's van in a circle, the same size the old map took up. */}
          <div className="mx-auto w-full max-w-[13rem] sm:max-w-sm lg:order-first lg:max-w-none">
            <Picture
              name="showroom-van"
              alt={copy.showroom.vanAlt}
              sizes="(min-width: 640px) 24rem, 13rem"
              width={640}
              height={640}
              className="aspect-square w-full rounded-full object-cover shadow-lg ring-4 ring-bg sm:ring-8"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
