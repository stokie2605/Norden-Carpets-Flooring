import { copy, links } from '../content/site'
import { WhatsAppIcon } from './ui/BrandIcons'

/** Floating WhatsApp button for phones and small tablets. Hidden from 768px upwards. */
export function FloatingWhatsApp() {
  return (
    <a
      href={links.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${copy.cta.whatsappFloating} (opens in a new tab)`}
      className="fixed right-4 z-50 grid size-14 place-items-center rounded-full bg-[#128C7E] text-white shadow-[0_10px_25px_-8px_rgb(15_23_42/0.45)] active:scale-95 md:hidden"
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  )
}
