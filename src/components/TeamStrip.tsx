import { copy, team } from '../content/site'

export function TeamStrip() {
  return (
    <section aria-labelledby="team-title" className="pt-16 lg:pt-[6.5rem]">
      {/* Phones: intro, the team, then the quote. Desktop: intro and quote on the left, the team on the right. */}
      <div className="container-x grid gap-y-[1.375rem] lg:grid-cols-[22.5rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-14 lg:gap-y-6">
        <div>
          <h2 id="team-title" className="text-[1.875rem] font-extrabold leading-[1.05] lg:text-4xl">
            {copy.team.title}
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-[1.55] text-ink-soft lg:mt-4 lg:text-base">{copy.team.intro}</p>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:grid-cols-4 lg:gap-3">
          {team.map((person) => (
            <li key={person.name} className="flex flex-col gap-1 border-t-2 border-ink pt-3 lg:gap-1.5 lg:pt-[1.125rem]">
              <span className="text-2xl font-extrabold tracking-[-0.02em] lg:text-[1.875rem]">{person.name}</span>
              <span className="text-sm text-muted lg:text-[0.9375rem]">{person.role}</span>
            </li>
          ))}
        </ul>

        <figure className="text-[0.9375rem] lg:text-base">
          <blockquote>
            <p>&ldquo;{copy.team.review.quote}&rdquo;</p>
          </blockquote>
          <figcaption className="mt-1 text-[0.8125rem] text-muted">{copy.reviews.reviewSource}</figcaption>
        </figure>
      </div>
    </section>
  )
}
