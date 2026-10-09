import type { ReactNode } from 'react'
import { BookingProvider } from '../context/BookingContext'
import { BookingModal } from './BookingModal'
import { Footer } from './Footer'
import { Header } from './Header'
import { FloatingWhatsApp } from './FloatingWhatsApp'

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <BookingProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <BookingModal />
    </BookingProvider>
  )
}
