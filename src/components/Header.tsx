import { copy, links, phones } from '../content/site'
import { useBooking } from '../context/BookingContext'
import { Button } from './ui/Button'
import { FacebookIcon } from './ui/BrandIcons'
import { Wordmark } from './ui/Wordmark'

export function Header() {
  const { openBooking } = useBooking()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="container-x flex items-center justify-between gap-3 py-3 lg:py-5">
        <a href="/" className="shrink-0 rounded">
          <Wordmark />
        </a>

        {/* Call and Get quote are always on show, so booking is one tap away anywhere on the page. */}
        <div className="flex items-center gap-2 md:gap-5">
          {/* Phones use the Call button in the bottom bar instead. */}
          <a
            href={phones.showroom.href}
            className="hidden whitespace-nowrap text-[0.9375rem] font-semibold text-ink hover:text-accent md:inline"
          >
            {copy.cta.callShort} {phones.showroom.display}
          </a>
          <Button
            size="md"
            onClick={() => openBooking()}
            className="min-h-10 whitespace-nowrap px-3.5 text-sm lg:min-h-11 lg:px-[1.125rem] lg:text-[0.9375rem]"
          >
            {copy.cta.bookShort}
          </Button>
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Norden Carpets & Flooring on Facebook (opens in a new tab)"
            className="-mr-2 grid size-11 shrink-0 place-items-center rounded-md text-[#1877F2] hover:bg-bg-alt md:-ml-2"
          >
            <FacebookIcon className="size-6" />
          </a>
        </div>
      </div>
    </header>
  )
}
