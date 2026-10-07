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
              className="flex min-w-0 flex-col items-start gap-2 rounded-2xl border border-line bg-bg p-3 sm:flex-row sm:items-center sm:gap-3 sm:pr-5"
            >
              <span
                aria-hidden="true"
                className="grid size-12 shrink-0 place-items-center rounded-full bg-ink font-display text-lg font-extrabold text-white"
              >
                {person.name.charAt(0)}
              </span>
              <span>
                <span className="block font-semibold text-ink">{person.name}</span>
                <span className="block text-xs text-muted">{person.role}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
