import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { copy, installations } from '../content/site'
import { Picture } from './ui/Picture'

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Our work. Phones and tablets: an edge to edge swipe row where every photo keeps its own shape.
 * Desktop: one large photo at its own shape with a line of thumbnails underneath.
 * Nothing is cropped and there are no filled bands. Tap a photo for the full size viewer.
 */
export function PreviousWork() {
  const count = installations.length
  const [viewerIndex, setViewerIndex] = useState(0)
  const [active, setActive] = useState(0)
  const [bar, setBar] = useState({ start: 0, size: 1 })
  const railRef = useRef<HTMLUListElement>(null)
  const viewerRef = useRef<HTMLDialogElement>(null)
  const drag = useRef<{ x: number; left: number; moved: number } | null>(null)
  const dragged = useRef(false)
  const swipeX = useRef<number | null>(null)

  // Progress line under the rail, kept in step with swiping, trackpads and the arrows.
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = rail.scrollWidth - rail.clientWidth
        const size = rail.scrollWidth > 0 ? Math.min(1, rail.clientWidth / rail.scrollWidth) : 1
        setBar({ start: max > 0 ? (rail.scrollLeft / max) * (1 - size) : 0, size })
      })
    }
    update()
    rail.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      rail.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // Desktop: fetch the photos either side so moving on is instant.
  useEffect(() => {
    if (count < 2 || typeof Image === 'undefined') return
    for (const d of [1, -1]) {
      const next = installations[(active + d + count) % count]
      if (next) new Image().src = `/images/${next.image}-show-1024.webp`
    }
  }, [active, count])
  const move = (d: number) => setActive((i) => (i + d + count) % count)

  const page = (direction: 1 | -1) => {
    const rail = railRef.current
    if (!rail || typeof rail.scrollBy !== 'function') return
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: reduceMotion() ? 'auto' : 'smooth' })
  }

  const openViewer = (i: number) => {
    setViewerIndex(i)
    const dialog = viewerRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }
  const stepViewer = (d: number) => setViewerIndex((i) => (i + d + count) % count)
  const closeViewer = () => viewerRef.current?.close()

  // Mouse drag on desktop. Touch and trackpads use native swiping.
  const onPointerDown = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || !railRef.current) return
    drag.current = { x: e.clientX, left: railRef.current.scrollLeft, moved: 0 }
    dragged.current = false
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLUListElement>) => {
    const d = drag.current
    const rail = railRef.current
    if (!d || !rail) return
    const dx = e.clientX - d.x
    d.moved = Math.max(d.moved, Math.abs(dx))
    if (d.moved > 6) {
      dragged.current = true
      rail.style.scrollSnapType = 'none'
      rail.scrollLeft = d.left - dx
    }
  }
  const endDrag = () => {
    if (!drag.current || !railRef.current) return
    drag.current = null
    railRef.current.style.scrollSnapType = ''
  }

  if (count === 0) {
    return (
      <section id="work" aria-labelledby="work-title" className="py-11 sm:py-24">
        <div className="container-x">
          <p className="eyebrow">{copy.work.eyebrow}</p>
          <h2 id="work-title" className="mt-3 text-section font-extrabold">
            {copy.work.title}
          </h2>
          <p className="mt-10 rounded-2xl border border-dashed border-line bg-bg-alt p-8 text-center text-sm text-muted">
            {copy.work.empty}
          </p>
        </div>
      </section>
    )
  }

  // count > 0 here, so the first photo is always there as a fallback.
  const shown = installations[viewerIndex] ?? installations[0]!
  const current = installations[active] ?? installations[0]!
  const arrow =
    'grid size-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white'

  return (
    <section id="work" aria-labelledby="work-title" className="overflow-hidden py-11 sm:py-24">
      <div className="container-x flex items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="eyebrow">{copy.work.eyebrow}</p>
          <h2 id="work-title" className="mt-3 text-section font-extrabold">
            {copy.work.title}
          </h2>
          <p className="mt-4 text-ink-soft">{copy.work.intro}</p>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex lg:hidden">
          <button type="button" onClick={() => page(-1)} aria-label={copy.work.previous} className={arrow}>
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => page(1)} aria-label={copy.work.next} className={arrow}>
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={railRef}
        aria-label={copy.work.slideshowLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="rail mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain [--rail-h:26rem] [scrollbar-width:none] sm:gap-4 sm:[--rail-h:30rem] lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        {installations.map((item, i) => {
          const ratio = item.height / item.width
          // Same height for every photo, narrower on phones for wide shots so they never overflow.
          const height = `min(var(--rail-h), calc(86vw * ${ratio.toFixed(4)}))`
          const size: CSSProperties = { height, width: `calc(${height} / ${ratio.toFixed(4)})` }
          return (
            <li key={item.image} className="shrink-0 snap-start">
              <figure>
                <button
                  type="button"
                  onClick={() => {
                    if (!dragged.current) openViewer(i)
                  }}
                  aria-label={`${copy.work.openPhoto} ${item.caption}`}
                  style={size}
                  className="group block cursor-zoom-in overflow-hidden rounded-2xl bg-bg-alt"
                >
                  <Picture
                    name={`${item.image}-show`}
                    alt={item.alt}
                    sizes="(min-width: 1024px) 26rem, 70vw"
                    width={item.width}
                    height={item.height}
                    className="pointer-events-none size-full select-none object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                  />
                </button>
                <figcaption className="mt-3 text-sm font-medium text-ink-soft">{item.caption}</figcaption>
              </figure>
            </li>
          )
        })}
      </ul>

      <div className="container-x mt-6 lg:hidden">
        <div className="relative h-0.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div
            className="absolute inset-y-0 rounded-full bg-ink"
            style={{ left: `${bar.start * 100}%`, width: `${bar.size * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop gallery */}
      <div className="container-x mt-12 hidden lg:block">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={copy.work.slideshowLabel}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') move(1)
            if (e.key === 'ArrowLeft') move(-1)
            if (e.key === 'Enter') openViewer(active)
          }}
          className="relative flex h-[38rem] items-center justify-center rounded-2xl outline-none"
        >
          <button
            type="button"
            onClick={() => openViewer(active)}
            aria-label={`${copy.work.openPhoto} ${current.caption}`}
            className="h-full cursor-zoom-in"
          >
            <Picture
              key={current.image}
              name={`${current.image}-show`}
              alt={current.alt}
              sizes="(min-width: 1024px) 60rem, 100vw"
              width={current.width}
              height={current.height}
              className="fade-in h-full w-auto max-w-full rounded-2xl object-contain shadow-[0_24px_60px_-28px_rgb(15_23_42/0.45)]"
            />
          </button>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={copy.work.previous}
            className={`absolute left-0 top-1/2 -translate-y-1/2 ${arrow}`}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={copy.work.next}
            className={`absolute right-0 top-1/2 -translate-y-1/2 ${arrow}`}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex items-baseline justify-center gap-3 text-sm">
          <p className="font-medium text-ink" aria-live="polite">
            {current.caption}
          </p>
          <p className="tabular-nums text-muted">
            {active + 1} {copy.work.of} {count}
          </p>
        </div>

        <ul
          className="mt-6 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${Math.min(count, 14)}, minmax(0, 1fr))` }}
        >
          {installations.map((item, i) => (
            <li key={item.image}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={item.caption}
                aria-current={i === active ? 'true' : undefined}
                className={`block aspect-square w-full overflow-hidden rounded-xl transition-[opacity,box-shadow] ${
                  i === active
                    ? 'opacity-100 ring-2 ring-accent ring-offset-2 ring-offset-bg'
                    : 'opacity-55 hover:opacity-100'
                }`}
              >
                <img
                  src={`/images/${item.image}-show-480.webp`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={viewerRef}
        aria-label={shown.caption}
        onClose={() => setActive(viewerIndex)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') stepViewer(1)
          if (e.key === 'ArrowLeft') stepViewer(-1)
        }}
        className="m-0 size-full max-h-none max-w-none bg-transparent p-0 text-white backdrop:bg-ink/55 backdrop:backdrop-blur-xl"
      >
        <div className="flex h-full flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex items-center justify-between px-4 py-3 text-sm tabular-nums">
            <span className="rounded-full bg-ink/40 px-3 py-1.5 backdrop-blur">
              {viewerIndex + 1} {copy.work.of} {count}
            </span>
            <button
              type="button"
              onClick={closeViewer}
              aria-label={copy.work.close}
              className="grid size-12 place-items-center rounded-full bg-white/15 hover:bg-white/25"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div
            className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeViewer()
            }}
            onPointerDown={(e) => {
              swipeX.current = e.clientX
            }}
            onPointerUp={(e) => {
              if (swipeX.current === null) return
              const dx = e.clientX - swipeX.current
              swipeX.current = null
              if (Math.abs(dx) > 40) stepViewer(dx < 0 ? 1 : -1)
            }}
          >
            <Picture
              key={shown.image}
              name={`${shown.image}-show`}
              alt={shown.alt}
              sizes="100vw"
              width={shown.width}
              height={shown.height}
              className="max-h-[calc(100dvh-9rem)] w-auto max-w-full select-none rounded-xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => stepViewer(-1)}
              aria-label={copy.work.previous}
              className="absolute left-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 hover:bg-white/25 sm:grid"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => stepViewer(1)}
              aria-label={copy.work.next}
              className="absolute right-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 hover:bg-white/25 sm:grid"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
          <p className="px-4 py-4 text-center font-medium [text-shadow:0_1px_8px_rgb(15_23_42/0.6)]">{shown.caption}</p>
        </div>
      </dialog>
    </section>
  )
}
