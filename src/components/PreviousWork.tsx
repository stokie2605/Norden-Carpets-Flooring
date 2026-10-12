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
          <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 lg:grid-cols-4">
            {installations.map((item) => (
              <li key={item.image}>
                <figure className="group">
                  <div className="aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-bg-alt shadow-sm">
                    {/* Portrait crops (name-tall) keep the floor in frame on phone photos. */}
                    <Picture
                      name={`${item.image}-tall`}
                      alt={item.alt}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      width={480}
                      height={640}
                      className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm font-medium leading-snug text-ink-soft">{item.caption}</figcaption>
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
