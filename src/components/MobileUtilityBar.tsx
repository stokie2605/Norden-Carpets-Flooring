import { Phone } from 'lucide-react'
import { copy, links, phones } from '../content/site'
import { WhatsAppIcon } from './ui/BrandIcons'

/** Thumb zone actions for phones and small tablets. Hidden from 768px upwards. */
export function MobileUtilityBar() {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg/95 px-3 pt-2 backdrop-blur md:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-2 gap-2">
        <a
          href={phones.showroom.href}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-3 text-[0.95rem] font-semibold text-white active:bg-accent-deep"
        >
          <Phone className="size-[1.1rem]" aria-hidden="true" />
          {copy.cta.callShort}
        </a>
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 bg-bg px-3 text-[0.95rem] font-semibold text-ink active:bg-bg-alt"
        >
          <WhatsAppIcon className="size-5 text-[#128C7E]" />
          WhatsApp
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </nav>
  )
}
