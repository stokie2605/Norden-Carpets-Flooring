import { Phone } from 'lucide-react'
import { copy, links, phones } from '../content/site'
import { WhatsAppIcon } from './ui/BrandIcons'

/** Fixed WhatsApp and Call bar along the bottom of the screen on phones and small tablets. Hidden from 768px upwards. */
export function MobileBar() {
  return (
    <nav
      aria-label="Contact"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 pt-3 backdrop-blur md:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-2 gap-3">
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#128C7E] px-3 font-semibold text-white active:scale-[0.98]"
        >
          <WhatsAppIcon className="size-5" />
          {copy.cta.whatsapp}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <a
          href={phones.showroom.href}
          className="inline-flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3 font-semibold text-white active:scale-[0.98]"
        >
          <Phone className="size-5" aria-hidden="true" />
          {copy.cta.callShort}
          <span className="sr-only"> {phones.showroom.display}</span>
        </a>
      </div>
    </nav>
  )
}
