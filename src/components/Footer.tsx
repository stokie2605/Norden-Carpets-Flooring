import { addressLines, business, copy, hours, links, phones, towns } from '../content/site'
import { credits } from '../content/credits'
import { FacebookIcon } from './ui/BrandIcons'
import { Wordmark } from './ui/Wordmark'

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm text-ink-soft">
            {copy.footer.blurb}
          </p>
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink hover:text-accent-deep"
          >
            <FacebookIcon className="size-5 text-[#1877F2]" />
            Follow us on Facebook
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">Showroom</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed text-ink-soft">
            <span className="block font-semibold text-ink">{business.name}</span>
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <a href={phones.showroom.href} className="mt-2 flex min-h-11 items-center font-semibold text-ink hover:text-accent-deep">
              {phones.showroom.display}
            </a>
            <a href={phones.mobile.href} className="flex min-h-11 items-center hover:text-accent-deep">
              {phones.mobile.display} (mobile)
            </a>
            <a href={`mailto:${business.email}`} className="flex min-h-11 items-center hover:text-accent-deep">
              {business.email}
            </a>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">Opening hours</h2>
          <dl className="mt-3 space-y-1 text-sm text-ink-soft">
            {hours.map((h) => (
              <div key={h.days}>
                <dt className="inline font-medium text-ink">{h.days}: </dt>
                <dd className="inline">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">Areas we cover</h2>
          <ul className="mt-3 space-y-1 text-sm text-ink-soft">
            {towns.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            {/* Prerendered at build time, so the year may differ from the visitor's clock on hydration. */}
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {business.name}. {business.legalLine}{' '}
            <a href={links.privacy} className="underline hover:text-ink">
              Privacy notice
            </a>
          </p>
          {credits.length > 0 && (
            <p>
              Illustrative photography from Unsplash by{' '}
              {credits.map((c, i) => (
                <span key={c.url}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                    {c.photographer}
                  </a>
                  {i < credits.length - 2 ? ', ' : i === credits.length - 2 ? ' and ' : '.'}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
