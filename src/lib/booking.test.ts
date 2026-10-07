import { describe, expect, it } from 'vitest'
import { emptyBooking, hasErrors, normalisePostcode, toBookingInput, validateBooking, type BookingInput } from './booking'

const valid: BookingInput = {
  material: 'carpets',
  postcode: 'OL12 7TD',
  preferredTime: 'weekday-morning',
  notes: 'Stairs and landing',
  name: 'Jo Bloggs',
  phone: '07904 322 879',
  email: 'jo@example.com',
  consent: true,
}

describe('validateBooking', () => {
  it('accepts a complete, valid booking', () => {
    expect(validateBooking(valid)).toEqual({})
  })

  it('flags every required field on an empty form', () => {
    const errors = validateBooking(emptyBooking)
    expect(Object.keys(errors).sort()).toEqual(['consent', 'material', 'name', 'phone', 'postcode', 'preferredTime'])
  })

  it('only validates the requested fields for a step', () => {
    const errors = validateBooking(emptyBooking, ['material', 'postcode', 'preferredTime'])
    expect(Object.keys(errors).sort()).toEqual(['material', 'postcode', 'preferredTime'])
  })

  it.each(['OL127TD', 'ol12 7td', 'M1 1AE', 'BL0 9AA', 'EC1A 1BB'])('accepts postcode %s', (postcode) => {
    expect(validateBooking({ ...valid, postcode }).postcode).toBeUndefined()
  })

  it.each(['12345', 'OL12', 'NOT A CODE', 'OL12 7TDX'])('rejects postcode %s', (postcode) => {
    expect(validateBooking({ ...valid, postcode }).postcode).toBeDefined()
  })

  it.each(['01706 659 962', '01706659962', '+44 7904 322879', '(01706) 659-962', '0044 1706 659962'])(
    'accepts phone %s',
    (phone) => {
      expect(validateBooking({ ...valid, phone }).phone).toBeUndefined()
    },
  )

  it.each(['12345', '07904', '+1 555 123 4567', 'call me'])('rejects phone %s', (phone) => {
    expect(validateBooking({ ...valid, phone }).phone).toBeDefined()
  })

  it('treats email as optional but validates it when given', () => {
    expect(validateBooking({ ...valid, email: '' }).email).toBeUndefined()
    expect(validateBooking({ ...valid, email: 'not-an-email' }).email).toBeDefined()
  })

  it('rejects unknown material and time values', () => {
    const errors = validateBooking({ ...valid, material: 'marble', preferredTime: 'midnight' })
    expect(errors.material).toBeDefined()
    expect(errors.preferredTime).toBeDefined()
  })

  it('enforces length caps', () => {
    expect(validateBooking({ ...valid, notes: 'x'.repeat(601) }).notes).toBeDefined()
    expect(validateBooking({ ...valid, name: 'x'.repeat(81) }).name).toBeDefined()
  })

  it('requires explicit consent', () => {
    expect(validateBooking({ ...valid, consent: false }).consent).toBeDefined()
  })
})

describe('helpers', () => {
  it('normalises postcodes into the standard spaced format', () => {
    expect(normalisePostcode('ol127td')).toBe('OL12 7TD')
    expect(normalisePostcode(' m1   1ae ')).toBe('M1 1AE')
  })

  it('coerces untrusted JSON without trusting types', () => {
    const input = toBookingInput({ material: 5, name: 'A', consent: 'yes', extra: true })
    expect(input).toEqual({ ...emptyBooking, name: 'A' })
    expect(toBookingInput(null)).toEqual(emptyBooking)
    expect(hasErrors(validateBooking(toBookingInput({ ...valid })))).toBe(false)
  })
})
