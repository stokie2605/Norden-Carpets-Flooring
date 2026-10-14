import { addressLines, business, copy, hours, links, phones } from '../content/site'
import { credits } from '../content/credits'
import { buttonClasses } from './ui/Button'
import { FacebookIcon } from './ui/BrandIcons'

export function Footer() {
  return (
    <footer className="bg-bg">
      <div className="container-x flex flex-col gap-6 py-8 text-sm leading-[1.6] text-ink-soft lg:grid lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10 lg:pb-10 lg:pt-14">
        <div>
          <p className="text-xl font-extrabold tracking-[-0.02em] text-accent lg:text-[1.375rem]">Norden</p>
          <p className="mt-1.5 lg:mt-2">{copy.footer.blurb}</p>
          <div className="mt-4 flex gap-2">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              /* Phones get WhatsApp in the fixed bottom bar instead. */
              className={buttonClasses({ variant: 'ink', size: 'sm', className: 'min-h-9 px-3 text-[0.8125rem] max-md:hidden' })}
            >
              {copy.cta.whatsapp}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-ink/20 px-3 text-[0.8125rem] font-semibold text-ink hover:border-ink md:min-h-9"
            >
              <FacebookIcon className="size-4 text-[#1877F2]" />
              {copy.footer.facebook}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div>
          <h2 className="mb-1.5 font-bold text-ink lg:mb-2">Showroom</h2>
          <address className="not-italic">
            <span className="block">{business.name}</span>
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>

        <div>
          <h2 className="mb-1.5 font-bold text-ink lg:mb-2">Opening hours</h2>
          <dl>
            {hours.map((h) => (
              <div key={h.days}>
                <dt className="inline">{h.days}: </dt>
                <dd className="inline">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="mb-1.5 font-bold text-ink lg:mb-2">Contact</h2>
          <a href={phones.showroom.href} className="block hover:text-accent">
            {phones.showroom.display}
          </a>
          <a href={phones.mobile.href} className="block hover:text-accent">
            {phones.mobile.display} (mobile)
          </a>
          <a href={`mailto:${business.email}`} className="block whitespace-nowrap hover:text-accent">
            {business.email}
          </a>
        </div>
      </div>

      <div className="lg:border-t lg:border-line">
        <div className="container-x">
          <div className="flex flex-col gap-4 border-t border-line pb-28 pt-4 text-xs text-muted md:pb-6 lg:flex-row lg:justify-between lg:gap-6 lg:border-t-0 lg:py-[1.125rem]">
            <p>
              {/* Prerendered at build time, so the year may differ from the visitor's clock on hydration. */}
              &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {business.name}. {business.legalLine}{' '}
              <a href={links.privacy} className="hover:text-ink hover:underline">
                Privacy notice
              </a>{' '}
              &middot;{' '}
              <a href={links.terms} className="hover:text-ink hover:underline">
                Terms and conditions
              </a>
            </p>
            <p className="lg:shrink-0">
              {copy.footer.designedBy}{' '}
              <a href={links.designer} target="_blank" rel="noopener" className="hover:text-ink hover:underline">
                {copy.footer.designerName}
              </a>
              <span className="sr-only"> (opens in a new tab)</span>
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
      </div>
    </footer>
  )
}
