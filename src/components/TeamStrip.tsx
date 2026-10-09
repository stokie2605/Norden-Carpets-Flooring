import { team } from '../content/site'

export function TeamStrip() {
  return (
    <section aria-labelledby="team-title" className="border-y border-line bg-bg-alt py-12 sm:py-14">
      <div className="container-x grid gap-8 xl:grid-cols-[minmax(0,20rem)_1fr] xl:items-center xl:gap-12">
        <div className="max-w-sm">
          <h2 id="team-title" className="text-2xl font-extrabold sm:text-3xl">
            The same four faces at every job.
          </h2>
          <p className="mt-2 text-ink-soft">
            Our own fitting team, start to finish. We never pass your floor to a stranger.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {team.map((person) => (
            <li
              key={person.name}
              className="flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="grid size-12 shrink-0 place-items-center rounded-full bg-pill font-display text-lg font-extrabold text-accent-deep"
              >
                {person.name.charAt(0)}
              </span>
              <div>
                <span className="block font-semibold text-ink">{person.name}</span>
                <span className="block text-[0.85rem] text-ink-soft">{person.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
