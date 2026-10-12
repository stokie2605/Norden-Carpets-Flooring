import { MapPin } from 'lucide-react'
import { business, copy } from '../content/site'
import { Picture } from './ui/Picture'

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-x grid items-center gap-10 pb-12 pt-6 sm:pt-10 lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:py-12">
        <div>
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-4 text-display font-extrabold text-ink">
            {copy.hero.titleStart} <span className="text-accent">{copy.hero.titleAccent}</span>
          </h1>
          <p className="mt-5 max-w-xl text-[1.05rem] text-ink-soft sm:text-lg">
            {copy.hero.intro}
          </p>

          <p className="mt-5 text-sm font-medium text-muted">{copy.hero.reassurance}</p>

          <p className="mt-8 inline-flex max-w-full items-start gap-2 rounded-2xl border border-line bg-bg-alt px-4 py-3 text-sm text-ink-soft">
            <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              Showroom: {business.address.unit}, {business.address.street}, {business.address.postcode}
            </span>
          </p>
        </div>

        <div className="relative">
          <div className="relative aspect-[1024/456] overflow-hidden rounded-[1.75rem] bg-bg-alt shadow-sm">
            <Picture
              name="hero-herringbone"
              alt={copy.hero.imageAlt}
              sizes="(min-width: 1024px) 45vw, 100vw"
              width={1024}
              height={456}
              priority
              className="size-full object-cover"
            />
          </div>
          <p className="mt-4 rounded-2xl border border-line bg-bg-alt p-4 text-left sm:ml-auto sm:max-w-sm">
            <span className="inline-block rounded-full bg-pill px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-deep">
              {copy.hero.badge}
            </span>
            <span className="mt-2 block text-sm text-ink-soft">
              {copy.hero.badgeBody}
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
