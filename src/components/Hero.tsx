import { MapPin, Phone } from 'lucide-react'
import { business, phones } from '../content/site'
import { useBooking } from '../context/BookingContext'
import { Button, ButtonLink } from './ui/Button'
import { Picture } from './ui/Picture'

export function Hero() {
  const { openBooking } = useBooking()

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-x grid items-center gap-10 pb-12 pt-6 sm:pt-10 lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:py-12">
        <div>
          <p className="eyebrow">Family run in Norden for {business.yearsInTrade} years</p>
          <h1 id="hero-title" className="mt-4 text-display font-extrabold text-ink">
            Floors fitted by the people who <span className="text-accent">own the shop.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[1.05rem] text-ink-soft sm:text-lg">
            {business.proprietors} have spent over 30 years building a trusted family business across Rochdale and
            Bury. <span className="hidden sm:inline">Every job is fitted by our own team, with no subcontractors and no shortcuts under the floor.</span>
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <ButtonLink href={phones.showroom.href} variant="secondary" className="px-4 leading-tight sm:px-6">
              <Phone className="size-[1.1rem] text-accent" aria-hidden="true" />
              Call the Showroom
            </ButtonLink>
            <Button onClick={() => openBooking()} className="px-4 leading-tight sm:px-6">
              Book a Free Measure
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted">Free measuring and quotations, with no obligation.</p>

          <p className="mt-8 inline-flex max-w-full items-start gap-2 rounded-2xl border border-line bg-bg-alt px-4 py-3 text-sm text-ink-soft">
            <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              Showroom: {business.address.unit}, {business.address.street}, {business.address.postcode}
            </span>
          </p>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-bg-alt sm:aspect-[5/4] lg:aspect-[4/5]">
            <Picture
              name="hero-bedroom"
              alt="Bright bedroom with a soft neutral carpet"
              sizes="(min-width: 1024px) 40vw, 100vw"
              width={1024}
              height={1280}
              priority
              className="size-full object-cover"
            />
          </div>
          <p className="absolute -bottom-4 left-4 right-4 rounded-2xl bg-bg p-4 shadow-[0_18px_40px_-18px_rgb(15_23_42/0.35)] sm:left-auto sm:right-6 sm:max-w-xs">
            <span className="inline-block rounded-full bg-pill px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-deep">
              In-house fitters. Zero subcontractors.
            </span>
            <span className="mt-2 block text-sm text-ink-soft">
              Dave, Tom and Jake handle the fitting, while Wendy keeps the business running smoothly.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
