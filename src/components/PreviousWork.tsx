import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { copy, installations } from '../content/site'
import { Picture } from './ui/Picture'

// Phones: one wide photo, two side by side, then one wide. Desktop: a tall photo on the left, two small and one wide on the right.
const TILE_LAYOUT = ['col-span-2 lg:col-span-1 lg:row-span-2', '', '', 'col-span-2'] as const
const TILE_SIZES = ['(min-width: 1024px) 50vw, 100vw', '(min-width: 1024px) 25vw, 50vw', '(min-width: 1024px) 25vw, 50vw', '(min-width: 1024px) 50vw, 100vw'] as const

/**
 * Our work. A grid of the four newest jobs, the last tile showing how many more there are.
 * Any tile opens the full size viewer, which shows every photo whole with thumbnails underneath.
 */
export function PreviousWork() {
  const count = installations.length
  const [viewerIndex, setViewerIndex] = useState(0)
  const viewerRef = useRef<HTMLDialogElement>(null)
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const swipeX = useRef<number | null>(null)

  // Keep the current thumbnail in view as the viewer moves on.
  useEffect(() => {
    const thumb = thumbRefs.current[viewerIndex]
    if (viewerRef.current?.open && typeof thumb?.scrollIntoView === 'function') {
      thumb.scrollIntoView({ block: 'nearest', inline: 'center' })
    }
  }, [viewerIndex])

  const openViewer = (i: number) => {
    setViewerIndex(i)
    const dialog = viewerRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }
  const stepViewer = (d: number) => setViewerIndex((i) => (i + d + count) % count)
  const closeViewer = () => viewerRef.current?.close()

  if (count === 0) {
    return (
      <section id="work" aria-labelledby="work-title" className="pt-16 lg:pt-[6.5rem]">
        <div className="container-x">
          <p className="eyebrow mb-2.5 lg:mb-3">{copy.work.eyebrow}</p>
          <h2 id="work-title" className="text-[2rem] font-extrabold leading-[1.05] lg:text-[2.875rem] lg:leading-[1.02]">
            {copy.work.title}
          </h2>
          <p className="mt-10 rounded-lg border border-dashed border-line bg-bg-alt p-8 text-center text-sm text-muted">
            {copy.work.empty}
          </p>
        </div>
      </section>
    )
  }

  const more = count - TILE_LAYOUT.length
  // count > 0 here, so the first photo is always there as a fallback.
  const shown = installations[viewerIndex] ?? installations[0]!
  const arrow = 'grid size-11 place-items-center rounded-full bg-white text-ink hover:bg-bg-alt'

  return (
    <section id="work" aria-labelledby="work-title" className="pt-16 lg:pt-[6.5rem]">
      <div className="container-x">
        <p className="eyebrow mb-2.5 lg:mb-3">{copy.work.eyebrow}</p>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2 id="work-title" className="text-[2rem] font-extrabold leading-[1.05] lg:text-[2.875rem] lg:leading-[1.02]">
            {copy.work.title}
          </h2>
          <p className="text-[0.9375rem] leading-normal text-ink-soft lg:max-w-[26.25rem] lg:text-right">{copy.work.intro}</p>
        </div>

        <ul
          aria-label={copy.work.slideshowLabel}
          className="mt-5 grid grid-cols-2 grid-rows-[13.75rem_9.375rem_10.625rem] gap-2 sm:grid-rows-[20rem_14rem_16rem] lg:mt-10 lg:grid-cols-[2fr_1fr_1fr] lg:grid-rows-[14.375rem_14.375rem] lg:gap-3 xl:grid-rows-[17.5rem_17.5rem]"
        >
          {installations.slice(0, TILE_LAYOUT.length).map((item, i) => {
            const showMore = i === TILE_LAYOUT.length - 1 && more > 0
            return (
              <li key={item.image} className={`relative overflow-hidden rounded-lg bg-bg-alt ${TILE_LAYOUT[i]}`}>
                <button
                  type="button"
                  onClick={() => openViewer(i)}
                  aria-label={
                    showMore
                      ? `${copy.work.seeAll} ${count} ${copy.work.photos}`
                      : `${copy.work.openPhoto} ${item.caption}`
                  }
                  className="group block size-full cursor-zoom-in"
                >
                  <Picture
                    name={`${item.image}-show`}
                    alt={item.alt}
                    sizes={TILE_SIZES[i] ?? '50vw'}
                    width={item.width}
                    height={item.height}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                  />
                  <span className="absolute bottom-2.5 left-2.5 rounded bg-white px-[0.4375rem] py-1 text-xs text-ink lg:bottom-4 lg:left-4 lg:px-[0.5625rem] lg:py-[0.3125rem] lg:text-[0.8125rem]">
                    {item.caption}
                  </span>
                  {showMore && (
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-ink/[0.62] text-white lg:gap-1">
                      <span className="text-[2rem] font-extrabold tracking-[-0.02em] lg:text-[2.5rem]">+{more}</span>
                      <span className="text-sm font-semibold lg:text-[0.9375rem]">
                        {copy.work.seeAll} {count} {copy.work.photos}
                      </span>
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <dialog
        ref={viewerRef}
        aria-label={shown.caption}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') stepViewer(1)
          if (e.key === 'ArrowLeft') stepViewer(-1)
        }}
        className="m-0 size-full max-h-none max-w-none bg-ink p-0 text-white backdrop:bg-ink"
      >
        <div
          className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-3 px-3.5 lg:gap-4 lg:px-16"
          style={{
            paddingTop: 'max(1.75rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1.75rem, env(safe-area-inset-bottom))',
          }}
        >
          <div className="flex items-center justify-between gap-4 text-sm lg:text-[0.9375rem]">
            <p>
              <b>{shown.caption}</b>
              <span className="mt-0.5 block tabular-nums text-white/65 lg:ml-2 lg:mt-0 lg:inline">
                {viewerIndex + 1} {copy.work.of} {count}
              </span>
            </p>
            <button
              type="button"
              onClick={closeViewer}
              className="shrink-0 rounded-md border border-white/25 px-3.5 py-2.5 font-semibold hover:bg-white/10 lg:py-2"
            >
              {copy.work.close}
            </button>
          </div>

          <div
            className="relative touch-pan-y bg-black lg:rounded-lg"
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
              className="absolute inset-0 size-full select-none object-contain"
            />
            <button
              type="button"
              onClick={() => stepViewer(-1)}
              aria-label={copy.work.previous}
              className={`absolute bottom-2 left-1 lg:bottom-auto lg:left-3 lg:top-1/2 lg:-translate-y-1/2 ${arrow}`}
            >
              <ChevronLeft className="size-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => stepViewer(1)}
              aria-label={copy.work.next}
              className={`absolute bottom-2 right-1 lg:bottom-auto lg:right-3 lg:top-1/2 lg:-translate-y-1/2 ${arrow}`}
            >
              <ChevronRight className="size-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>

          <ul className="flex gap-[0.3125rem] overflow-x-auto [scrollbar-width:none] lg:gap-1.5 [&::-webkit-scrollbar]:hidden">
            {installations.map((item, i) => {
              const current = i === viewerIndex
              return (
                <li key={item.image} className="flex-none">
                  <button
                    ref={(el) => {
                      thumbRefs.current[i] = el
                    }}
                    type="button"
                    onClick={() => setViewerIndex(i)}
                    aria-label={item.caption}
                    aria-current={current ? 'true' : undefined}
                    className={`block h-10 w-[3.25rem] overflow-hidden rounded bg-ink-soft transition-opacity lg:h-12 lg:w-16 ${
                      current ? 'opacity-100 outline-2 outline-white' : 'opacity-55 hover:opacity-100'
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
              )
            })}
          </ul>
        </div>
      </dialog>
    </section>
  )
}
