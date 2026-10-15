import { business, copy, phones, proof } from '../content/site'
import { useBooking } from '../context/BookingContext'
import { Button, ButtonLink } from './ui/Button'
import { Picture } from './ui/Picture'
import { Stars } from './ui/Stars'

export function Hero() {
  const { openBooking } = useBooking()

  return (
    <section aria-labelledby="hero-title">
      {/* Phones: full width photo on top, text underneath. Desktop: text on the left, photo on the right. */}
      <div className="mx-auto flex max-w-[90rem] flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14 lg:px-16 lg:py-[4.5rem] xl:gap-20">
        <div className="px-5 pt-7 sm:px-6 lg:flex lg:flex-col lg:justify-center lg:p-0">
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="mt-3 text-[2.5rem] font-extrabold leading-[1.02] text-ink lg:mt-4 lg:text-[4.25rem] lg:leading-none xl:text-[5rem]"
          >
            {copy.hero.titleStart} {copy.hero.titleAccent}
          </h1>
          <p className="mt-4 max-w-[31.25rem] text-base leading-[1.55] text-ink-soft lg:mt-6 lg:text-lg">{copy.hero.intro}</p>

          <div id="hero-actions" className="mt-6 flex flex-col gap-2.5 lg:mt-8 lg:flex-row lg:gap-3">
            <Button onClick={() => openBooking()}>{copy.hero.ctaBook}</Button>
            <ButtonLink href={phones.showroom.href} variant="secondary">
              {/* Kept on one line so the number never splits on narrow phones. */}
              <span className="whitespace-nowrap">
                {copy.hero.ctaCall} {phones.showroom.display}
              </span>
            </ButtonLink>
          </div>
          <p className="mt-2.5 text-center text-[0.8125rem] text-muted lg:mt-3 lg:text-left">{copy.hero.reassurance}</p>
        </div>

        <div className="-order-1 px-5 pt-6 sm:px-6 lg:order-none lg:p-0">
          {/* The shopfront at Tenterhouse Mill, always shown whole and never cropped. Phones: as wide as the screen allows, but never
              taller than 70% of it, so the whole photo fits on screen. Desktop: its natural tall shape. The original is small, so files stop at 720px. */}
          <Picture
            name="hero-shopfront"
            alt={copy.hero.imageAlt}
            sizes="(min-width: 1280px) 440px, (min-width: 1024px) 400px, (min-width: 640px) 448px, calc(100vw - 2.5rem)"
            width={574}
            height={830}
            priority
            maxWidth={720}
            className="mx-auto block h-auto max-h-[70svh] w-auto max-w-full rounded-lg bg-bg-alt sm:max-w-[28rem] lg:h-[36rem] lg:max-h-none lg:max-w-none xl:h-[40rem]"
          />
        </div>
      </div>

      <div className="container-x mt-7 lg:mt-0">
        <ul className="grid border-t border-ink lg:grid-cols-3 lg:border-b lg:border-b-line">
          <li className="flex items-baseline gap-2.5 border-b border-line py-3.5 lg:gap-3 lg:border-b-0 lg:py-[1.375rem]">
            <span className="text-2xl font-extrabold text-accent lg:text-[1.75rem]">{proof.rating}</span>
            <span className="text-[0.9375rem] text-ink-soft">{proof.ratingLabel}</span>
          </li>
          <li className="flex items-center gap-2 border-b border-line py-3.5 lg:gap-2.5 lg:border-b-0 lg:border-l lg:py-[1.375rem] lg:pl-7">
            <Stars className="size-4 lg:size-5" />
            <span className="text-2xl font-extrabold lg:text-[1.75rem]">{proof.google.rating}</span>
            <span className="text-[0.9375rem] text-ink-soft">{proof.google.label}</span>
          </li>
          <li className="flex items-baseline gap-2.5 border-b border-line py-3.5 lg:gap-3 lg:border-b-0 lg:border-l lg:py-[1.375rem] lg:pl-7">
            <span className="text-2xl font-extrabold text-accent lg:text-[1.75rem]">{business.yearsInTrade}</span>
            <span className="text-[0.9375rem] text-ink-soft">{copy.hero.trustYearsLabel}</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
