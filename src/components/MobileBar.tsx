import { copy, links, phones } from '../content/site'
import { buttonClasses } from './ui/Button'

/** Fixed WhatsApp and Call bar along the bottom of the screen on phones and small tablets. Hidden from 768px upwards. */
export function MobileBar() {
  return (
    <nav
      aria-label="Contact"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg px-5 pt-3 md:hidden"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses({ variant: 'ink', size: 'lg', className: 'whitespace-nowrap px-3 text-[0.9375rem]' })}
        >
          {copy.cta.whatsapp}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <a
          href={phones.showroom.href}
          className={buttonClasses({ variant: 'secondary', size: 'lg', className: 'whitespace-nowrap px-3 text-[0.9375rem]' })}
        >
          {copy.cta.callShort}
          <span className="sr-only"> {phones.showroom.display}</span>
        </a>
      </div>
    </nav>
  )
}
