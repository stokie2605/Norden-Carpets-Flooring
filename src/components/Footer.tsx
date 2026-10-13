import { addressLines, business, copy, hours, links, phones } from '../content/site'
import { credits } from '../content/credits'
import { FacebookIcon, WhatsAppIcon } from './ui/BrandIcons'
import { Wordmark } from './ui/Wordmark'

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      {/* Areas we cover live in the showroom section only. Phones: showroom and hours side by side. */}
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:py-14 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm text-ink-soft">
            {copy.footer.blurb}
          </p>
          {/* Phones get the fixed WhatsApp and Call bar instead. */}
          <div className="mt-5 hidden flex-wrap gap-3 md:flex">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#128C7E] px-5 text-sm font-semibold text-white hover:opacity-90"
            >
              <WhatsAppIcon className="size-5" />
              {copy.cta.whatsapp}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1877F2] px-5 text-sm font-semibold text-white hover:opacity-90"
            >
              <FacebookIcon className="size-5" />
              {copy.footer.facebook}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
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
            <a href={`mailto:${business.email}`} className="flex min-h-11 items-center break-all hover:text-accent-deep">
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
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-3 pb-28 pt-6 text-xs text-muted md:flex-row md:pb-6 md:items-center md:justify-between">
          <p>
            {/* Prerendered at build time, so the year may differ from the visitor's clock on hydration. */}
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {business.name}. {business.legalLine}{' '}
            <a href={links.privacy} className="underline hover:text-ink">
              Privacy notice
            </a>{' '}
            <a href={links.terms} className="underline hover:text-ink">
              Terms and conditions
            </a>
          </p>
          <p>
            {copy.footer.designedBy}{' '}
            <a href={links.designer} target="_blank" rel="noopener" className="font-semibold underline hover:text-ink">
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
    </footer>
  )
}
