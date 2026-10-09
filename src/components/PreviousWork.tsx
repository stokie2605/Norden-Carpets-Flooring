import { copy, installations } from '../content/site'
import { Picture } from './ui/Picture'

/** Real installation photos from the team. Until they arrive, preview builds show a TODO_CONFIRM note that blocks the main build. */
export function PreviousWork() {
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

        {installations.length > 0 ? (
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {installations.map((item) => (
              <li key={item.image}>
                <figure>
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-bg-alt">
                    <Picture
                      name={item.image}
                      alt={item.alt}
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      width={640}
                      height={480}
                      className="size-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-2 text-sm text-muted">{item.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-line bg-bg-alt p-8 text-center text-sm text-muted">
            {copy.work.empty}
          </p>
        )}
      </div>
    </section>
  )
}
