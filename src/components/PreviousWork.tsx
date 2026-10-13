import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { copy, installations } from '../content/site'
import { Picture } from './ui/Picture'

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Our work: a swipeable slideshow of real jobs with a line of thumbnails and a full size viewer.
 * Photos are shown whole (name-show files, never cropped) over a blurred copy of themselves.
 */
export function PreviousWork() {
  const count = installations.length
  const [index, setIndex] = useState(0)
  const [viewerIndex, setViewerIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDialogElement>(null)
  const drag = useRef<{ x: number; left: number; moved: number } | null>(null)
  const dragged = useRef(false)
  const swipeX = useRef<number | null>(null)

  const go = useCallback(
    (next: number) => {
      const track = trackRef.current
      if (!track || count === 0) return
      const i = (next + count) % count
      track.scrollTo({ left: i * track.clientWidth, behavior: reduceMotion() ? 'auto' : 'smooth' })
      setIndex(i)
    },
    [count],
  )

  // Keep the counter and thumbnails in step with native swiping and trackpad scrolling.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!drag.current) setIndex(Math.round(track.scrollLeft / track.clientWidth))
      })
    }
    const onResize = () => {
      track.scrollLeft = Math.round(track.scrollLeft / track.clientWidth) * track.clientWidth
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Keep the active thumbnail in view.
  useEffect(() => {
    const strip = stripRef.current
    const thumb = strip?.children[index] as HTMLElement | undefined
    if (!strip || !thumb || typeof strip.scrollTo !== 'function') return
    strip.scrollTo({
      left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: reduceMotion() ? 'auto' : 'smooth',
    })
  }, [index])

  const openViewer = (i: number) => {
    setViewerIndex(i)
    const dialog = viewerRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }
  const stepViewer = (d: number) => setViewerIndex((i) => (i + d + count) % count)
  const closeViewer = () => viewerRef.current?.close()

  // Mouse drag on desktop. Touch and trackpads use native swiping.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !trackRef.current) return
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: 0 }
    dragged.current = false
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const track = trackRef.current
    if (!d || !track) return
    const dx = e.clientX - d.x
    d.moved = Math.max(d.moved, Math.abs(dx))
    if (d.moved > 6) {
      dragged.current = true
      track.style.scrollSnapType = 'none'
      track.scrollLeft = d.left - dx
    }
  }
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const track = trackRef.current
    drag.current = null
    if (!d || !track) return
    track.style.scrollSnapType = ''
    if (d.moved > 6) {
      const dx = e.clientX - d.x
      go(Math.abs(dx) > track.clientWidth * 0.12 ? index + (dx < 0 ? 1 : -1) : index)
    }
  }

  if (count === 0) {
    return (
      <section id="work" aria-labelledby="work-title" className="py-16 sm:py-24">
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
  const current = installations[index] ?? installations[0]!
  const shown = installations[viewerIndex] ?? installations[0]!
  const roundButton =
    'grid size-10 place-items-center rounded-full bg-bg/90 text-ink shadow-md transition-colors hover:bg-bg sm:size-12'

  return (
    <section id="work" aria-labelledby="work-title" className="py-16 sm:py-24">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">{copy.work.eyebrow}</p>
          <h2 id="work-title" className="mt-3 text-section font-extrabold">
            {copy.work.title}
          </h2>
          <p className="mt-4 text-ink-soft">{copy.work.intro}</p>
        </div>

        <div className="mt-10" role="region" aria-roledescription="carousel" aria-label={copy.work.slideshowLabel}>
          <div className="relative overflow-hidden rounded-[1.5rem] bg-ink">
            <div
              ref={trackRef}
              tabIndex={0}
              aria-label={copy.work.slideshowLabel}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault()
                  go(index + 1)
                }
                if (e.key === 'ArrowLeft') {
                  e.preventDefault()
                  go(index - 1)
                }
                if (e.key === 'Enter') openViewer(index)
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              className="flex aspect-square snap-x snap-mandatory overflow-x-auto overscroll-x-contain outline-none [scrollbar-width:none] sm:aspect-[4/3] lg:aspect-auto lg:h-[38rem] [&::-webkit-scrollbar]:hidden"
            >
              {installations.map((item, i) => (
                <div
                  key={item.image}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} ${copy.work.of} ${count}`}
                  className="relative w-full shrink-0 snap-start overflow-hidden"
                >
                  <img
                    src={`/images/${item.image}-show-480.webp`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full scale-110 object-cover blur-2xl brightness-50"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => {
                      if (!dragged.current) openViewer(i)
                    }}
                    className="relative block size-full cursor-zoom-in"
                  >
                    <Picture
                      name={`${item.image}-show`}
                      alt={item.alt}
                      sizes="(min-width: 1216px) 1168px, 100vw"
                      width={768}
                      height={1024}
                      className="pointer-events-none size-full select-none object-contain"
                    />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={copy.work.previous}
              className={`absolute left-3 top-1/2 -translate-y-1/2 sm:left-4 ${roundButton}`}
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={copy.work.next}
              className={`absolute right-3 top-1/2 -translate-y-1/2 sm:right-4 ${roundButton}`}
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => openViewer(index)}
              className="absolute right-3 top-3 inline-flex min-h-10 items-center gap-1.5 rounded-full bg-bg/90 px-3.5 text-sm font-semibold text-ink shadow-md hover:bg-bg sm:right-4 sm:top-4"
            >
              <Maximize2 className="size-4" aria-hidden="true" />
              {copy.work.fullSize}
            </button>
          </div>

          <div className="mt-3 flex items-baseline justify-between gap-4">
            <p className="font-medium text-ink" aria-live="polite">
              {current.caption}
            </p>
            <p className="shrink-0 text-sm tabular-nums text-muted">
              {index + 1} {copy.work.of} {count}
            </p>
          </div>

          <div
            ref={stripRef}
            aria-label={copy.work.thumbnails}
            role="group"
            className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]"
          >
            {installations.map((item, i) => (
              <button
                key={item.image}
                type="button"
                onClick={() => go(i)}
                aria-label={item.caption}
                aria-current={i === index ? 'true' : undefined}
                className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-opacity sm:size-20 ${
                  i === index ? 'border-accent opacity-100' : 'border-transparent opacity-60 hover:opacity-90'
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
            ))}
          </div>
        </div>
      </div>

      <dialog
        ref={viewerRef}
        aria-label={shown.caption}
        onClose={() => go(viewerIndex)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') stepViewer(1)
          if (e.key === 'ArrowLeft') stepViewer(-1)
        }}
        className="m-0 size-full max-h-none max-w-none bg-ink p-0 text-white backdrop:bg-ink"
      >
        <div className="flex h-full flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex items-center justify-between px-4 py-3 text-sm tabular-nums">
            <span>
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
              width={768}
              height={1024}
              className="max-h-[calc(100dvh-9rem)] w-auto max-w-full select-none rounded-xl object-contain"
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
          <p className="px-4 py-4 text-center font-medium">{shown.caption}</p>
        </div>
      </dialog>
    </section>
  )
}
