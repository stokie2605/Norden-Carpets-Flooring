import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { copy } from '../content/site'

/** Back to top button for phones and small tablets. Appears once the footer scrolls into view. Hidden from 768px upwards. */
export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setShow(!!entry && entry.isIntersecting))
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  const backToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    document.querySelector<HTMLElement>('header a')?.focus({ preventScroll: true })
  }

  return (
    <button
      type="button"
      onClick={backToTop}
      aria-label={copy.cta.backToTop}
      className={`fixed right-4 z-50 grid size-14 place-items-center rounded-full bg-ink text-white shadow-[0_10px_25px_-8px_rgb(15_23_42/0.45)] transition-[opacity,visibility] duration-200 active:scale-95 md:hidden ${
        show ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <ArrowUp className="size-6" aria-hidden="true" />
    </button>
  )
}
