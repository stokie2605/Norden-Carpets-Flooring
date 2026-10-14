import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { copy, links, proof, type Review } from '../content/site'
import { buttonClasses } from './ui/Button'
import { Stars } from './ui/Stars'

const sourceLabel = (review: Review) =>
  review.source === 'google' ? copy.reviews.googleSource : copy.reviews.reviewSource

/** Where each card in the stack sits. k is its distance from the top card; phones use a tighter fan. */
function cardStyle(k: number): CSSProperties {
  const visible = k < 3
  return {
    zIndex: 10 - k,
    opacity: visible ? 1 : 0,
    '--tx': visible ? `${k * 7}px` : '30px',
    '--ty': visible ? `${k * -8.4}px` : '-28px',
    '--tx-lg': visible ? `${k * 14}px` : '60px',
    '--ty-lg': visible ? `${k * -12}px` : '-40px',
    '--r': visible ? `${k * 1.6}deg` : '6deg',
    '--s': visible ? `${1 - k * 0.03}` : '0.9',
  } as CSSProperties
}

export function ProofWall() {
  const reviews: readonly Review[] = [{ quote: proof.featured.quote }, ...proof.reviews]
  const total = reviews.length
  const [index, setIndex] = useState(0)
  const [seen, setSeen] = useState<readonly number[]>([0])
  const swipeX = useRef<number | null>(null)
  const current = reviews[index] ?? reviews[0]!

  const go = (i: number) => {
    const next = (i + total) % total
    setIndex(next)
    setSeen((s) => (s.includes(next) ? s : [...s, next]))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      go(index + 1)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(index - 1)
    }
  }

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="pt-16 lg:pt-[6.5rem]">
      <div className="container-x">
        <p className="eyebrow mb-2.5 lg:mb-3">{copy.reviews.eyebrow}</p>
        <h2 id="reviews-title" className="text-[2rem] font-extrabold leading-[1.05] lg:text-[2.875rem] lg:leading-[1.02]">
          {copy.reviews.title}
        </h2>

        <div className="mt-[1.375rem] grid gap-3 lg:mt-10 lg:grid-cols-[21.25rem_minmax(0,1fr)] xl:grid-cols-[25rem_minmax(0,1fr)]">
          {/* Ratings panel. Phones: the two figures side by side. Desktop: stacked, with the reviews link at the bottom. */}
          <div className="grid grid-cols-2 items-end gap-x-4 gap-y-1.5 rounded-lg bg-ink p-[1.375rem] text-white lg:flex lg:flex-col lg:items-stretch lg:gap-2 lg:p-9">
            <span className="order-1 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-accent-bright lg:text-[5rem]">
              {proof.rating}
            </span>
            <span className="order-3 text-[0.8125rem] lg:order-2 lg:text-[0.9375rem]">{proof.ratingLabel}</span>
            <span className="order-2 flex items-center gap-1.5 text-[2rem] font-extrabold leading-[0.9] lg:order-3 lg:mt-6 lg:block lg:leading-normal">
              {proof.google.rating}
              <Stars className="size-[0.9375rem] lg:hidden" />
              <span className="text-[0.9375rem] font-normal max-lg:hidden"> {proof.google.label}</span>
            </span>
            <span className="order-4 text-[0.8125rem] lg:hidden">{proof.google.label}</span>
            <span className="order-5 col-span-2 mt-2.5 text-xs leading-normal text-white/65 lg:mt-auto lg:pt-6 lg:text-[0.8125rem]">
              {proof.ratingSource}
              <span className="lg:hidden"> &middot; </span>
              <br className="max-lg:hidden" />
              {proof.google.source}
            </span>
            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: 'inverse', size: 'sm', className: 'order-6 mt-3.5 self-start max-lg:hidden' })}
            >
              {copy.reviews.readAll}
              <span className="sr-only">(opens Facebook in a new tab)</span>
            </a>
          </div>

          <div className="lg:flex lg:flex-col lg:gap-5 lg:pl-7 lg:pt-2">
            {/* The quote for screen readers. The card stack below is visual only. */}
            <figure className="sr-only" aria-live="polite">
              <blockquote>
                <p>{current.quote}</p>
              </blockquote>
              <figcaption>
                {sourceLabel(current)}, {index + 1} {copy.reviews.of} {total}
              </figcaption>
            </figure>

            <div
              role="button"
              tabIndex={0}
              aria-label={`${copy.reviews.deckLabel}: ${copy.reviews.tapNext}`}
              onKeyDown={onKeyDown}
              onPointerDown={(e) => {
                swipeX.current = e.clientX
              }}
              onPointerUp={(e) => {
                const dx = e.clientX - (swipeX.current ?? e.clientX)
                swipeX.current = null
                go(Math.abs(dx) > 40 && dx > 0 ? index - 1 : index + 1)
              }}
              className="relative mt-7 h-[18.75rem] cursor-pointer touch-pan-y select-none rounded-[0.625rem] lg:mt-0 lg:h-[20.625rem]"
            >
              {reviews.map((review, i) => {
                const k = (i - index + total) % total
                const top = k === 0
                return (
                  <div
                    key={review.quote}
                    aria-hidden="true"
                    style={cardStyle(k)}
                    className="absolute inset-y-0 left-0 right-3.5 flex flex-col justify-between gap-3.5 rounded-[0.625rem] border border-line bg-bg p-[1.375rem] shadow-[0_10px_24px_rgb(0_0_0/0.08)] [transform:translate(var(--tx),var(--ty))_rotate(var(--r))_scale(var(--s))] [transition:transform_0.45s_cubic-bezier(0.2,0.8,0.2,1),opacity_0.35s] lg:right-0 lg:gap-5 lg:p-10 lg:shadow-[0_12px_30px_rgb(0_0_0/0.08)] lg:[transform:translate(var(--tx-lg),var(--ty-lg))_rotate(var(--r))_scale(var(--s))]"
                  >
                    <div className="flex items-center justify-between">
                      <Stars className="size-[0.9375rem] lg:size-[1.125rem]" />
                      <span className="text-xs text-muted lg:text-[0.8125rem]">{sourceLabel(review)}</span>
                    </div>
                    <p
                      className={`font-medium leading-[1.4] lg:tracking-[-0.01em] ${
                        review.quote.length > 120 ? 'text-[1.0625rem] lg:text-[1.375rem]' : 'text-xl lg:text-[1.625rem]'
                      }`}
                    >
                      &ldquo;{review.quote}&rdquo;
                    </p>
                    <span className="min-h-[1lh] text-xs font-semibold text-accent lg:text-[0.8125rem]">
                      {top && (
                        <>
                          <span className="lg:hidden">{copy.reviews.swipeNext}</span>
                          <span className="max-lg:hidden">
                            {index === total - 1 ? copy.reviews.startAgain : copy.reviews.tapNext}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="mt-2.5 lg:mt-0 lg:flex lg:items-center lg:gap-4">
              <div className="flex gap-1 lg:flex-1 lg:gap-[0.3125rem]">
                {reviews.map((review, i) => (
                  <button
                    key={review.quote}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`${copy.reviews.goTo} ${i + 1}`}
                    aria-current={i === index ? 'true' : undefined}
                    className="flex-1 cursor-pointer py-2"
                  >
                    <span
                      className={`block h-1.5 rounded-[3px] transition-colors duration-300 ${
                        i === index ? 'bg-accent' : seen.includes(i) ? 'bg-ink' : 'bg-line'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-1.5 flex items-center justify-between lg:mt-0 lg:min-w-[6.875rem] lg:justify-end">
                <span className="text-sm text-ink-soft">
                  <b className="text-ink">{seen.length}</b> {copy.reviews.of} {total} {copy.reviews.read}
                </span>
                <span className="text-[0.8125rem] text-muted lg:hidden">{copy.reviews.swipeMore}</span>
              </div>
            </div>

            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: 'secondary', size: 'md', className: 'mt-3 w-full lg:hidden' })}
            >
              {copy.reviews.readAll}
              <span className="sr-only">(opens Facebook in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
