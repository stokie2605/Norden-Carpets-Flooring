// Shared booking validation. Imported by the browser form and by functions/api/book.ts,
// so it must stay dependency free and runtime agnostic.

export const MATERIAL_OPTIONS = [
  { value: 'carpets', label: 'Carpets' },
  { value: 'lvt', label: 'Vinyl' },
  { value: 'laminate', label: 'Laminate' },
  { value: 'underlay', label: 'Underlay' },
  { value: 'unsure', label: 'Not sure yet' },
] as const

export const TIME_OPTIONS = [
  { value: 'weekday-morning', label: 'Weekday morning' },
  { value: 'weekday-afternoon', label: 'Weekday afternoon' },
  { value: 'saturday-morning', label: 'Saturday morning' },
  { value: 'any', label: 'Any time' },
] as const

export type MaterialValue = (typeof MATERIAL_OPTIONS)[number]['value']
export type TimeValue = (typeof TIME_OPTIONS)[number]['value']

export type BookingInput = {
  material: string
  postcode: string
  preferredTime: string
  notes: string
  name: string
  phone: string
  email: string
  consent: boolean
}

export type BookingField = keyof BookingInput
export type BookingErrors = Partial<Record<BookingField, string>>

export const LIMITS = {
  name: 80,
  email: 120,
  phone: 20,
  postcode: 10,
  notes: 600,
} as const

// UK postcode, tolerant of missing or extra spaces.
const POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i
// UK landline or mobile: 0xxxxxxxxxx or +44xxxxxxxxxx, spaces, dots, dashes and brackets ignored.
const PHONE = /^(?:\+44|0044|0)\d{9,10}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const materialValues = new Set<string>(MATERIAL_OPTIONS.map((o) => o.value))
const timeValues = new Set<string>(TIME_OPTIONS.map((o) => o.value))

export function normalisePhone(raw: string): string {
  return raw.replace(/[\s().-]/g, '')
}

export function normalisePostcode(raw: string): string {
  const compact = raw.replace(/\s+/g, '').toUpperCase()
  return compact.length > 3 ? `${compact.slice(0, -3)} ${compact.slice(-3)}` : compact
}

/** Validates the fields belonging to one step, or every field when `fields` is omitted. */
export function validateBooking(input: BookingInput, fields?: readonly BookingField[]): BookingErrors {
  const errors: BookingErrors = {}
  const check = (field: BookingField) => !fields || fields.includes(field)

  if (check('material') && !materialValues.has(input.material)) {
    errors.material = 'Choose a flooring type.'
  }
  if (check('postcode')) {
    const postcode = input.postcode.trim()
    if (!postcode) errors.postcode = 'Enter your postcode.'
    else if (postcode.length > LIMITS.postcode || !POSTCODE.test(postcode)) errors.postcode = 'Enter a valid UK postcode.'
  }
  if (check('preferredTime') && !timeValues.has(input.preferredTime)) {
    errors.preferredTime = 'Choose a preferred time.'
  }
  if (check('notes') && input.notes.length > LIMITS.notes) {
    errors.notes = `Keep notes under ${LIMITS.notes} characters.`
  }
  if (check('name')) {
    const name = input.name.trim()
    if (name.length < 2) errors.name = 'Enter your name.'
    else if (name.length > LIMITS.name) errors.name = 'Name is too long.'
  }
  if (check('phone')) {
    const phone = normalisePhone(input.phone)
    if (!phone) errors.phone = 'Enter a phone number so we can arrange the visit.'
    else if (input.phone.length > LIMITS.phone || !PHONE.test(phone)) errors.phone = 'Enter a valid UK phone number.'
  }
  if (check('email')) {
    const email = input.email.trim()
    if (email && (email.length > LIMITS.email || !EMAIL.test(email))) errors.email = 'Enter a valid email address or leave it blank.'
  }
  if (check('consent') && input.consent !== true) {
    errors.consent = 'Please tick the box so we can contact you about your measure.'
  }
  return errors
}

export function hasErrors(errors: BookingErrors): boolean {
  return Object.keys(errors).length > 0
}

export function labelFor<T extends { value: string; label: string }>(options: readonly T[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value
}

/** Coerces untrusted JSON into a BookingInput shape without trusting any types. */
export function toBookingInput(body: unknown): BookingInput {
  const b = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v : '')
  return {
    material: str(b.material),
    postcode: str(b.postcode),
    preferredTime: str(b.preferredTime),
    notes: str(b.notes),
    name: str(b.name),
    phone: str(b.phone),
    email: str(b.email),
    consent: b.consent === true,
  }
}

export const emptyBooking: BookingInput = {
  material: '',
  postcode: '',
  preferredTime: '',
  notes: '',
  name: '',
  phone: '',
  email: '',
  consent: false,
}
