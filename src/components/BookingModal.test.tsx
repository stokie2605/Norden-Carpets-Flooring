import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BookingProvider, useBooking } from '../context/BookingContext'
import { BookingModal } from './BookingModal'

// The real widget loads a remote script. In tests it immediately yields a token.
vi.mock('./Turnstile', async () => {
  const { useEffect } = await import('react')
  return {
    Turnstile: ({ onToken }: { onToken: (t: string) => void }) => {
      useEffect(() => onToken('test-token'), [])
      return <div data-testid="turnstile" />
    },
  }
})

function Opener() {
  const { openBooking } = useBooking()
  return (
    <>
      <button onClick={() => openBooking()}>Open booking</button>
      <button onClick={() => openBooking('laminate')}>Book laminate</button>
    </>
  )
}

function setup() {
  render(
    <BookingProvider>
      <Opener />
      <BookingModal />
    </BookingProvider>,
  )
  return userEvent.setup()
}

const dialog = () => document.querySelector('dialog')!

async function fillStepOne(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByLabelText('Carpets'))
  await user.type(screen.getByLabelText('Postcode'), 'OL12 7TD')
  await user.click(screen.getByLabelText('Weekday morning'))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

async function fillStepTwo(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Your name'), 'Jo Bloggs')
  await user.type(screen.getByLabelText('Phone number'), '07904 322 879')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('BookingModal', () => {
  it('opens from context and locks page scroll', async () => {
    const user = setup()
    expect(dialog()).not.toHaveAttribute('open')
    await user.click(screen.getByText('Open booking'))
    expect(dialog()).toHaveAttribute('open')
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(screen.getByRole('heading', { name: 'Your floor' })).toBeInTheDocument()
  })

  it('closes from the close button and restores scroll', async () => {
    const user = setup()
    await user.click(screen.getByText('Open booking'))
    await user.click(screen.getByRole('button', { name: 'Close booking form' }))
    expect(dialog()).not.toHaveAttribute('open')
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('preselects the material when opened from a material panel', async () => {
    const user = setup()
    await user.click(screen.getByText('Book laminate'))
    expect(screen.getByLabelText('Laminate')).toBeChecked()
  })

  it('blocks progress and shows inline errors for missing step fields', async () => {
    const user = setup()
    await user.click(screen.getByText('Open booking'))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Choose a flooring type.')).toBeInTheDocument()
    expect(screen.getByText('Enter your postcode.')).toBeInTheDocument()
    expect(screen.getByText('Choose a preferred time.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Your floor' })).toBeInTheDocument()
  })

  it('validates phone numbers on the details step', async () => {
    const user = setup()
    await user.click(screen.getByText('Open booking'))
    await fillStepOne(user)
    await user.type(screen.getByLabelText('Your name'), 'Jo')
    await user.type(screen.getByLabelText('Phone number'), '123')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText('Phone number')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Enter a valid UK phone number.')).toBeInTheDocument()
  })

  it('requires consent, then submits and shows the success state', async () => {
    const fetchMock = vi.fn(async () => Response.json({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)
    const user = setup()
    await user.click(screen.getByText('Open booking'))
    await fillStepOne(user)
    await fillStepTwo(user)

    await user.click(screen.getByRole('button', { name: 'Request my free measure' }))
    expect(screen.getByText('Please tick the box so we can contact you about your measure.')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Request my free measure' }))

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Thank you' })).toBeInTheDocument())
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('/api/book')
    const body = JSON.parse(String(init.body))
    expect(body).toMatchObject({ material: 'carpets', postcode: 'OL12 7TD', consent: true, turnstileToken: 'test-token', website: '' })
  })

  it('offers call and WhatsApp fallbacks when sending fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ ok: false, error: 'Upstream down.' }, { status: 502 })))
    const user = setup()
    await user.click(screen.getByText('Open booking'))
    await fillStepOne(user)
    await fillStepTwo(user)
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Request my free measure' }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Upstream down.'))
    expect(screen.getByRole('link', { name: /Call 01706 659 962/ })).toHaveAttribute('href', 'tel:+441706659962')
    expect(screen.getByRole('link', { name: /WhatsApp us/ })).toHaveAttribute('href', expect.stringContaining('wa.me/447904322879'))
  })
})
