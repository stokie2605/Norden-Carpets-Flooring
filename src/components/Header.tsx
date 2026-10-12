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
  // The hero has its own Book and Call buttons, so the header ones stay hidden until those scroll out of view.
  const [showActions, setShowActions] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const heroActions = document.getElementById('hero-actions')
    if (!heroActions || typeof IntersectionObserver === 'undefined') {
      setShowActions(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShowActions(!!entry && !entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: '-72px 0px 0px 0px' },
    )
    observer.observe(heroActions)
    return () => observer.disconnect()
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
          <div
            className={`flex items-center gap-1 transition-[opacity,visibility] duration-200 sm:gap-2 ${
              showActions ? 'visible opacity-100' : 'invisible opacity-0'
            }`}
          >
            <a
              href={phones.showroom.href}
              className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-1 text-sm font-semibold text-ink hover:text-accent-deep sm:gap-2 sm:px-3"
            >
              <Phone className="size-[1.1rem] text-accent" aria-hidden="true" />
              {/* "Call us" on phones, the number from 640px. The number stays in the accessible name. */}
              <span className="sm:hidden">{copy.cta.callShort}</span>
              <span className="sr-only sm:not-sr-only"> {phones.showroom.display}</span>
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
            className="hidden size-11 place-items-center rounded-full text-ink-soft hover:bg-bg-alt hover:text-accent-deep sm:grid"
          >
            <FacebookIcon />
          </a>
        </div>
      </div>
    </header>
  )
}
