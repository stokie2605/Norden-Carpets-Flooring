import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { links, nav, phones } from '../content/site'
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
      <div className="container-x flex h-16 items-center justify-between gap-3 md:h-[4.5rem]">
        <a href="/" className="shrink-0 rounded">
          <Wordmark />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-medium text-ink-soft">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={`/${item.href}`} className="py-2 hover:text-accent-deep">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Norden Carpets & Flooring on Facebook (opens in a new tab)"
            className="grid size-11 place-items-center rounded-full text-ink-soft hover:bg-bg-alt hover:text-accent-deep"
          >
            <FacebookIcon />
          </a>
          <a
            href={phones.showroom.href}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-ink hover:text-accent-deep sm:px-3"
          >
            <Phone className="size-[1.1rem] text-accent" aria-hidden="true" />
            {/* Visible "Call" leads the accessible name on small screens, followed by the number. */}
            <span className="sm:hidden">Call </span>
            <span className="sr-only sm:not-sr-only">{phones.showroom.display}</span>
          </a>
          {/* Below 416px the hero and utility bar carry the actions, so the header stays uncluttered. */}
          <div className="hidden xs:block">
            <Button size="md" onClick={() => openBooking()}>
              Book Measure
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
