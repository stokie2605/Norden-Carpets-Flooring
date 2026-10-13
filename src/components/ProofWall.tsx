import { Check, Star } from 'lucide-react'
import { copy, links, proof } from '../content/site'
import { FacebookIcon } from './ui/BrandIcons'
import { buttonClasses } from './ui/Button'

export function ProofWall() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="py-16 sm:py-24">
      <div className="container-x">
        <p className="eyebrow">{copy.reviews.eyebrow}</p>
        <h2 id="reviews-title" className="mt-3 max-w-2xl text-section font-extrabold">
          {copy.reviews.title}
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="flex flex-col justify-between rounded-[1.75rem] bg-pill p-7 sm:p-9">
            <div>
              <p
                className="font-display text-[clamp(4.5rem,3rem+6vw,7.5rem)] font-extrabold leading-none text-accent-deep"
                style={{ fontVariationSettings: "'wdth' 80" }}
              >
                {proof.rating}
              </p>
              <p className="mt-2 text-lg font-semibold text-ink">{proof.ratingLabel}</p>
              <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-lg font-semibold text-ink">
                <span className="inline-flex items-center gap-1.5 font-display text-3xl font-extrabold text-accent-deep">
                  <Star className="size-6 fill-current" aria-hidden="true" />
                  {proof.google.rating}
                </span>
                {proof.google.label}
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-accent/15 pt-6">
                {proof.highlights.map((item) => (
                  <li key={item} className="flex gap-2.5 text-ink">
                    <Check className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-ink-soft">
                {proof.ratingSource}
                <br />
                {proof.google.source}
              </p>
              <a
                href={links.facebook}
                target="_blank"
                rel="noopener"
                className={buttonClasses({ variant: 'secondary', size: 'md' })}
              >
                <FacebookIcon className="size-4 text-[#1877F2]" />
                {copy.reviews.facebookLink}
                <span className="sr-only">(opens Facebook in a new tab)</span>
              </a>
            </div>
          </div>

          <figure className="flex flex-col justify-between rounded-[1.75rem] border border-line p-7 sm:p-10">
            <span aria-hidden="true" className="font-display text-7xl font-extrabold leading-[0.6] text-accent">
              &ldquo;
            </span>
            <blockquote className="mt-4 text-xl font-medium leading-relaxed text-ink sm:text-2xl">
              <p>{proof.featured.quote}</p>
            </blockquote>
            <figcaption className="mt-8 border-t border-line pt-5">
              <span className="block text-sm font-semibold text-ink">{copy.reviews.reviewSource}</span>
            </figcaption>
          </figure>
        </div>

        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {proof.reviews.map((review) => (
            <li key={review.quote.slice(0, 24)}>
              <figure className="flex h-full flex-col justify-between rounded-[1.25rem] border border-line bg-bg-alt p-6">
                <blockquote className="text-ink">
                  <p>&ldquo;{review.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-ink">
                    {review.source === 'google' ? copy.reviews.googleSource : copy.reviews.reviewSource}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
