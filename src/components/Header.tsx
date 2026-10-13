import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { copy, links, phones } from '../content/site'
import { useBooking } from '../context/BookingContext'
import { Button } from './ui/Button'
import { FacebookIcon } from './ui/BrandIcons'
import { Wordmark } from './ui/Wordmark'

export function Header() {
  const { openBooking } = useBooking()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-bg/95 backdrop-blur transition-[border-color,box-shadow] ${
        scrolled ? 'border-line shadow-[0_1px_0_rgb(15_23_42/0.04)]' : 'border-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-2 md:h-[4.5rem]">
        <a href="/" className="shrink-0 rounded">
          <Wordmark />
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Call and Free measure are always on show, so booking is one tap away anywhere on the page. */}
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={phones.showroom.href}
              className="hidden min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-semibold text-ink hover:text-accent-deep md:inline-flex"
            >
              <Phone className="size-[1.1rem] text-accent" aria-hidden="true" />
              {/* Phones use the Call button in the bottom bar instead. */}
              <span className="sr-only">{copy.cta.callShort} </span>
              {phones.showroom.display}
            </a>
            <Button size="md" onClick={() => openBooking()} className="whitespace-nowrap px-3 xs:px-4 sm:px-5">
              {copy.cta.bookShort}
            </Button>
          </div>
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Norden Carpets & Flooring on Facebook (opens in a new tab)"
            className="grid size-11 place-items-center rounded-full text-ink-soft hover:bg-bg-alt hover:text-accent-deep"
          >
            <FacebookIcon />
          </a>
        </div>
      </div>

    </header>
  )
}
