import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Check } from 'lucide-react'
import { materials } from '../content/site'
import { useBooking } from '../context/BookingContext'
import { Button } from './ui/Button'
import { Picture } from './ui/Picture'

export function MaterialSwitcher() {
  const { openBooking } = useBooking()
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()

  const focusTab = (index: number) => {
    const next = (index + materials.length) % materials.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(active + 1),
      ArrowLeft: () => focusTab(active - 1),
      Home: () => focusTab(0),
      End: () => focusTab(materials.length - 1),
    }
    const action = keys[event.key]
    if (action) {
      event.preventDefault()
      action()
    }
  }

  return (
    <section id="flooring" aria-labelledby="flooring-title" className="bg-bg-alt py-16 sm:py-24">
      <div className="container-x">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Flooring and prices</p>
            <h2 id="flooring-title" className="mt-3 text-section font-extrabold">
              Every floor we fit, priced up front.
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft">
            Prices start from the figures below. Your exact quote follows a free home measure.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Flooring types"
          className="scroll-strip -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {materials.map((m, i) => {
            const selected = i === active
            return (
              <button
                key={m.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                type="button"
                id={`${baseId}-tab-${m.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${m.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
                className={`min-h-12 shrink-0 rounded-full border px-5 text-sm font-semibold transition-colors ${
                  selected
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-bg text-ink-soft hover:border-ink/30 hover:text-ink'
                }`}
              >
                {m.label}
              </button>
            )
          })}
        </div>

        {materials.map((m, i) => (
          <div
            key={m.id}
            role="tabpanel"
            id={`${baseId}-panel-${m.id}`}
            aria-labelledby={`${baseId}-tab-${m.id}`}
            hidden={i !== active}
            tabIndex={0}
            className="mt-6 overflow-hidden rounded-[1.75rem] border border-line bg-bg"
          >
            <div className="grid md:grid-cols-[1.1fr_1fr]">
              <div className="aspect-[4/3] bg-bg-alt md:aspect-auto md:min-h-[26rem]">
                <Picture
                  name={m.image}
                  alt={m.imageAlt}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  width={1024}
                  height={768}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col p-6 sm:p-9">
                <h3 className="text-2xl font-extrabold sm:text-3xl">{m.headline}</h3>
                <p className="mt-3 text-ink-soft">{m.pitch}</p>

                <p className="mt-6 flex items-baseline gap-2 border-t border-line pt-5">
                  <span className="font-display text-4xl font-extrabold text-accent-deep">{m.price}</span>
                  <span className="text-sm font-medium text-muted">{m.priceNote}</span>
                </p>

                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${m.label} is ideal for`}>
                  {m.bestFor.map((room) => (
                    <li
                      key={room}
                      className="inline-flex items-center gap-1.5 rounded-full bg-pill px-3 py-1.5 text-sm font-medium text-ink"
                    >
                      <Check className="size-3.5 text-accent-deep" aria-hidden="true" />
                      {room}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 md:mt-auto md:pt-8">
                  <Button onClick={() => openBooking(m.id)} className="w-full sm:w-auto">
                    Book a measure for {m.label.toLowerCase()}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
