import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { copy, links, nav, phones } from '../content/site'
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

        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-medium text-ink-soft">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={`/${item.href}`} className="rounded py-2 hover:text-accent-deep">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div
            className={`flex items-center gap-1 transition-[opacity,visibility] duration-200 sm:gap-2 ${
              showActions ? 'visible opacity-100' : 'invisible opacity-0'
            }`}
          >
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

      {/* Below 1024px the section links drop in under the bar once the hero buttons scroll away. */}
      <nav
        aria-label="Sections"
        className={`absolute inset-x-0 top-full border-b border-line bg-bg/95 backdrop-blur transition-[opacity,visibility,transform] duration-200 lg:hidden ${
          showActions ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        <ul className="container-x flex items-center gap-1 overflow-x-auto py-1.5 text-sm font-medium text-ink-soft [scrollbar-width:none]">
          {nav.map((item) => (
            <li key={item.href} className="shrink-0">
              <a
                href={`/${item.href}`}
                className="inline-flex min-h-10 items-center rounded-full px-3 hover:bg-bg-alt hover:text-accent-deep"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
