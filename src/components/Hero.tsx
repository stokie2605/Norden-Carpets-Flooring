import { useRef, useState, type MouseEvent } from 'react'
import { business, copy, phones, proof } from '../content/site'
import { useBooking } from '../context/BookingContext'
import { Button, ButtonLink } from './ui/Button'
import { Picture } from './ui/Picture'
import { Stars } from './ui/Stars'

export function Hero() {
  const { openBooking } = useBooking()
  // Phones only: the shopfront fills the first screen. Tapping it zooms in, as if walking through the door, then it folds away.
  const [entry, setEntry] = useState<'closed' | 'entering' | 'inside'>('closed')
  const titleRef = useRef<HTMLHeadingElement>(null)
  const stepInside = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setEntry('entering')
    window.setTimeout(() => {
      setEntry('inside')
      window.scrollTo({ top: 0 })
      titleRef.current?.focus({ preventScroll: true })
    }, 900)
  }

  return (
    <section aria-labelledby="hero-title">
      {/* Phones: full width photo on top, text underneath. Desktop: text on the left, photo on the right. */}
      <div className="mx-auto flex max-w-[90rem] flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14 lg:px-16 lg:py-[4.5rem] xl:gap-20">
        <div className="px-5 pt-7 sm:px-6 lg:flex lg:flex-col lg:justify-center lg:p-0">
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1
            id="hero-title"
            ref={titleRef}
            tabIndex={-1}
            className="mt-3 text-[2.5rem] font-extrabold focus:outline-none leading-[1.02] text-ink lg:mt-4 lg:text-[4.25rem] lg:leading-none xl:text-[5rem]"
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

        {/* The shopfront at Tenterhouse Mill. Phones (under 640px): fills the screen between the header and the contact bar, and a tap
            steps inside (zoom, then the photo folds away). It stays in the page flow, not a popup, so the content is never covered.
            Without JavaScript the tap is a plain link to the headline. Tablets: shown whole, up to 28rem wide. Desktop: its natural tall
            shape, never cropped. The original is small, so files stop at 720px. */}
        <div
          data-entry={entry}
          className="group -order-1 grid grid-rows-[1fr] transition-[grid-template-rows] delay-300 duration-500 ease-in-out data-[entry=entering]:grid-rows-[0fr] data-[entry=inside]:max-sm:hidden sm:block sm:px-6 sm:pt-6 lg:order-none lg:p-0"
        >
          <div className="relative min-h-0 overflow-hidden">
            <Picture
              name="hero-shopfront"
              alt={copy.hero.imageAlt}
              sizes="(min-width: 1280px) 440px, (min-width: 1024px) 400px, (min-width: 640px) 448px, 100vw"
              width={574}
              height={830}
              priority
              maxWidth={720}
              className="block h-[calc(100svh-9.25rem)] min-h-[24rem] w-full bg-bg-alt object-cover transition duration-700 ease-in group-data-[entry=entering]:scale-[1.8] group-data-[entry=entering]:opacity-0 sm:mx-auto sm:h-auto sm:min-h-0 sm:max-w-[28rem] sm:rounded-lg lg:h-[36rem] lg:w-auto lg:max-w-none xl:h-[40rem]"
            />
            <a
              href="#hero-title"
              onClick={stepInside}
              className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/55 via-transparent to-transparent pb-8 transition-opacity duration-300 group-data-[entry=entering]:opacity-0 sm:hidden"
            >
              <span className="rounded-md bg-accent px-6 py-3.5 text-base font-bold text-white shadow-lg">{copy.hero.enter}</span>
            </a>
          </div>
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
