import { MapPin, Phone, ThumbsUp, Users } from 'lucide-react'
import { copy, phones, proof } from '../content/site'
import { useBooking } from '../context/BookingContext'
import { Button, ButtonLink } from './ui/Button'
import { Picture } from './ui/Picture'

export function Hero() {
  const { openBooking } = useBooking()

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Full width photo. Phones: a band across the top that fades into the page. Desktop: fills the hero and fades from the left behind the text. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[19rem] sm:h-[31rem] lg:inset-y-0 lg:h-auto">
        <Picture
          name="work-herringbone-02"
          alt={copy.hero.imageAlt}
          sizes="100vw"
          width={1024}
          height={768}
          priority
          extraWidths={[2048]}
          className="size-full object-cover object-[50%_25%] lg:object-[50%_20%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-bg/0 via-bg/45 via-55% to-bg lg:bg-linear-to-r lg:from-bg lg:via-bg/80 lg:via-35% lg:to-bg/0"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-24 bg-linear-to-b from-bg/0 to-bg lg:block" />
      </div>

      <div className="container-x pb-10 pt-[9.5rem] sm:pb-14 sm:pt-[18rem] lg:flex lg:min-h-[min(calc(100dvh-4.5rem),46rem)] lg:items-center lg:py-14">
        <div className="max-w-5xl">
          <p className="eyebrow text-muted">{copy.hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-3 text-display sm:mt-4 font-extrabold text-ink">
            {copy.hero.titleStart} {copy.hero.titleAccent}
          </h1>
          <p className="mt-4 max-w-xl text-[1.05rem] text-ink-soft sm:mt-6 sm:text-lg">{copy.hero.intro}</p>

          <div id="hero-actions" className="mt-6 flex sm:mt-8 flex-col gap-3 xs:flex-row">
            <Button onClick={() => openBooking()}>{copy.hero.ctaBook}</Button>
            <ButtonLink href={phones.showroom.href} variant="secondary">
              <Phone className="size-[1.1rem] text-accent" aria-hidden="true" />
              {copy.hero.ctaCall} {phones.showroom.display}
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm font-medium text-muted">{copy.hero.reassurance}</p>

          <ul className="mt-6 flex max-w-2xl flex-wrap gap-x-4 gap-y-2 border-t border-line pt-5 text-[0.8rem] font-medium text-ink-soft sm:mt-8 sm:gap-x-6 sm:gap-y-3 sm:pt-6 sm:text-sm">
            <li className="inline-flex items-center gap-2">
              <ThumbsUp className="size-4 text-accent" aria-hidden="true" />
              {proof.rating} {proof.ratingLabel}
            </li>
            <li className="inline-flex items-center gap-2">
              <Users className="size-4 text-accent" aria-hidden="true" />
              {copy.hero.trustFitters}
            </li>
            <li>
              <a href="#showroom" className="inline-flex items-center gap-2 hover:text-accent-deep">
                <MapPin className="size-4 text-accent" aria-hidden="true" />
                {copy.hero.trustShowroom}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
