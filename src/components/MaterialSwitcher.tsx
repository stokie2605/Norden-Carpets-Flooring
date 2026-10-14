import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { copy, materials } from '../content/site'
import { Picture } from './ui/Picture'

export function MaterialSwitcher() {
  const [active, setActive] = useState(0)
  const [visited, setVisited] = useState(() => new Set([0]))
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()
  const [titleStart, titleEnd] = copy.flooring.titleLines

  const select = (index: number) => {
    setActive(index)
    setVisited((prev) => new Set(prev).add(index))
  }

  const focusTab = (index: number) => {
    const next = (index + materials.length) % materials.length
    select(next)
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
    <section id="flooring" aria-labelledby="flooring-title" className="pt-16 lg:pt-[6.5rem]">
      <div className="container-x">
        <p className="eyebrow mb-2.5 lg:mb-3">{copy.flooring.eyebrow}</p>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2 id="flooring-title" className="text-[2rem] font-extrabold leading-[1.05] lg:text-[2.875rem] lg:leading-[1.02]">
            {titleStart}
            <br className="max-lg:hidden" /> {titleEnd}
          </h2>
          <p className="text-[0.9375rem] leading-normal text-ink-soft lg:max-w-[20.625rem] lg:text-base">{copy.flooring.intro}</p>
        </div>

        <div role="tablist" aria-label="Flooring types" className="mt-6 flex gap-6 border-b border-line lg:mt-10 lg:gap-7">
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
                onClick={() => select(i)}
                onKeyDown={onKeyDown}
                className={`-mb-px border-b-2 pb-3 pt-2 text-base font-semibold transition-colors lg:pb-3.5 lg:text-[1.0625rem] ${
                  selected ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
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
            className="pt-5 lg:pt-10"
          >
            <div className="lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
              <div className="h-60 overflow-hidden rounded-lg bg-bg-alt sm:h-[22rem] lg:h-[26.25rem] xl:h-[30rem]">
                {visited.has(i) && (
                  <Picture
                    name={m.image}
                    alt={m.imageAlt}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    width={1024}
                    height={768}
                    className="size-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col lg:justify-center lg:gap-5">
                <h3 className="mt-5 text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] lg:mt-0 lg:text-[1.875rem] lg:leading-[1.1]">
                  {m.headline}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.6] text-ink-soft lg:mt-0 lg:text-base">{m.pitch}</p>
                {m.review && (
                  <figure className="mt-4 border-y border-line py-3.5 text-[0.9375rem] leading-normal lg:mt-0 lg:py-[1.125rem] lg:text-base">
                    <blockquote>
                      <p>&ldquo;{m.review.quote}&rdquo;</p>
                    </blockquote>
                    <figcaption className="mt-1.5 text-[0.8125rem] text-muted">{copy.reviews.reviewSource}</figcaption>
                  </figure>
                )}
                <p className="mt-3.5 text-sm text-ink-soft lg:mt-0">
                  <span className="sr-only">{m.label} is ideal for: </span>
                  {m.bestFor.join(' · ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
