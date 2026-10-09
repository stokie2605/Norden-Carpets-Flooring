import { copy, subfloorSteps } from '../content/site'

export function SubfloorAdvantage() {
  return (
    <section id="subfloors" aria-labelledby="subfloors-title" className="py-16 sm:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{copy.subfloors.eyebrow}</p>
          <h2 id="subfloors-title" className="mt-3 text-section font-extrabold">
            {copy.subfloors.title}
          </h2>
          <p className="mt-5 max-w-md text-ink-soft">
            {copy.subfloors.intro}
          </p>
          <p className="mt-6 inline-block rounded-full bg-pill px-4 py-2 text-sm font-semibold text-accent-deep">
            {copy.subfloors.promise}
          </p>
        </div>

        <ol>
          {subfloorSteps.map((step, i) => (
            <li
              key={step.title}
              className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-line py-7 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr]"
            >
              <span
                aria-hidden="true"
                className="font-display text-4xl font-extrabold leading-none text-accent sm:text-5xl"
                style={{ fontVariationSettings: "'wdth' 75" }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-xl font-bold sm:text-2xl">{step.title}</h3>
                <p className="mt-2 text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
