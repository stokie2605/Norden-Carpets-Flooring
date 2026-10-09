import { copy, links, proof } from '../content/site'
import { buttonClasses } from './ui/Button'
import { FacebookIcon } from './ui/BrandIcons'

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
            </div>
            <p className="mt-8 text-sm text-ink-soft">Source: {proof.ratingSource}</p>
          </div>

          <figure className="flex flex-col justify-between rounded-[1.75rem] border border-line p-7 sm:p-10">
            <span aria-hidden="true" className="font-display text-7xl font-extrabold leading-[0.6] text-accent">
              &ldquo;
            </span>
            <blockquote className="mt-4 text-xl font-medium leading-relaxed text-ink sm:text-2xl">
              <p>{proof.featured.quote}</p>
            </blockquote>
            <figcaption className="mt-8 border-t border-line pt-5">
              <span className="block font-semibold text-ink">{proof.featured.author}</span>
              <span className="block text-sm text-muted">{proof.featured.detail}</span>
            </figcaption>
          </figure>
        </div>

        {proof.reviews.length > 0 && (
          <ul className="mt-6 columns-1 gap-6 md:columns-2 lg:columns-3">
            {proof.reviews.map((review) => (
              <li key={review.author + review.quote.slice(0, 16)} className="mb-6 break-inside-avoid">
                <figure className="rounded-[1.25rem] border border-line bg-bg-alt p-6">
                  <blockquote className="text-ink">
                    <p>{review.quote}</p>
                  </blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold text-ink">{review.author}</span>
                    <span className="text-muted">, {review.source}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}


        <div className="mt-10">
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: 'secondary' })}
          >
            <FacebookIcon className="size-5 text-[#1877F2]" />
            See our reviews on Facebook
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
