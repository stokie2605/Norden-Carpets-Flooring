import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react'
import type { MaterialValue } from '../lib/booking'

type BookingState = {
  isOpen: boolean
  presetMaterial: MaterialValue | ''
  openBooking: (material?: MaterialValue) => void
  closeBooking: () => void
}

const BookingContext = createContext<BookingState | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [presetMaterial, setPresetMaterial] = useState<MaterialValue | ''>('')

  const openBooking = useCallback((material?: MaterialValue) => {
    setPresetMaterial(material ?? '')
    setIsOpen(true)
  }, [])
  const closeBooking = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({ isOpen, presetMaterial, openBooking, closeBooking }),
    [isOpen, presetMaterial, openBooking, closeBooking],
  )
  return <BookingContext value={value}>{children}</BookingContext>
}

export function useBooking(): BookingState {
  const ctx = use(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider')
  return ctx
}
