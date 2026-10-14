import { business, copy, hours } from '../content/site'
import { buttonClasses } from './ui/Button'
import { Picture } from './ui/Picture'

/** Showroom: Dave's van, opening hours and a directions link. The full address is in the footer. */
export function ShowroomMap() {
  return (
    <section id="showroom" aria-labelledby="showroom-title" className="container-x mt-16 lg:mt-[6.5rem]">
      {/* A panel inside the page width, so its edges line up with every section above it. */}
      <div className="overflow-hidden rounded-lg bg-ink text-white lg:grid lg:grid-cols-2">
        <div className="relative h-60 bg-ink-soft sm:h-80 lg:h-auto lg:min-h-[28rem]">
          <Picture
            name="showroom-van"
            alt={copy.showroom.vanAlt}
            sizes="(min-width: 1440px) 656px, (min-width: 1024px) 45vw, 100vw"
            width={1024}
            height={1024}
            className="absolute inset-0 size-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-3.5 px-5 pb-8 pt-7 sm:px-8 lg:justify-center lg:gap-[1.125rem] lg:p-14 xl:p-16">
          <p className="eyebrow text-accent-bright">{copy.showroom.eyebrow}</p>
          <h2 id="showroom-title" className="text-[1.875rem] font-extrabold leading-[1.05] lg:text-[2.625rem]">
            {copy.showroom.title}
          </h2>
          <p className="text-[0.9375rem] leading-[1.6] text-white/80 lg:text-base">
            {copy.showroom.coverage}
            <br />
            {hours
              .filter((h) => h.time !== 'Closed')
              .map((h) => `${h.days} ${h.time}`)
              .join(', ')}
          </p>
          <a
            href={business.mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: 'inverse', size: 'lg', className: 'lg:mt-2 lg:self-start' })}
          >
            {copy.cta.directions}
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
