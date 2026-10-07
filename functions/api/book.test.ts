import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { onRequest, type Env } from './book'

const env: Env = {
  RESEND_API_KEY: 're_test',
  BOOKING_TO_EMAIL: 'owner@example.com',
  BOOKING_FROM_EMAIL: 'Norden Website <bookings@example.com>',
  TURNSTILE_SECRET_KEY: 'secret',
}

const validBody = {
  material: 'lvt',
  postcode: 'OL12 7TD',
  preferredTime: 'saturday-morning',
  notes: '<b>Kitchen</b>',
  name: 'Jo Bloggs',
  phone: '07904 322 879',
  email: 'jo@example.com',
  consent: true,
  turnstileToken: 'token',
  website: '',
}

function call(body: unknown, init: RequestInit = {}, overrides: Partial<Env> = {}) {
  const request = new Request('https://example.com/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.7' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
    ...init,
  })
  // Only request and env are used by the handler.
  const context = { request, env: { ...env, ...overrides } } as unknown as Parameters<typeof onRequest>[0]
  return onRequest(context)
}

type FetchArgs = [input: RequestInfo | URL, init?: RequestInit]
let fetchMock: ReturnType<typeof vi.fn<(...args: FetchArgs) => Promise<Response>>>

function mockUpstream({ turnstile = true, resendStatus = 200 } = {}) {
  fetchMock.mockImplementation(async (input) => {
    const url = String(input)
    if (url.includes('turnstile')) return Response.json({ success: turnstile })
    if (url.includes('resend')) return new Response('{}', { status: resendStatus })
    throw new Error(`unexpected fetch ${url}`)
  })
}

beforeEach(() => {
  fetchMock = vi.fn<(...args: FetchArgs) => Promise<Response>>()
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('POST /api/book', () => {
  it('sends a valid booking through Resend', async () => {
    mockUpstream()
    const res = await call(validBody)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })

    const resendCall = fetchMock.mock.calls.find(([url]) => String(url).includes('resend'))
    expect(resendCall).toBeDefined()
    const [, init] = resendCall!
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer re_test')
    const payload = JSON.parse(String(init?.body))
    expect(payload.to).toEqual(['owner@example.com'])
    expect(payload.reply_to).toBe('jo@example.com')
    expect(payload.subject).toContain('LVT or herringbone')
    expect(payload.html).toContain('&lt;b&gt;Kitchen&lt;/b&gt;')
    expect(payload.html).not.toContain('<b>Kitchen</b>')
  })

  it('passes the visitor IP to Turnstile siteverify', async () => {
    mockUpstream()
    await call(validBody)
    const verify = fetchMock.mock.calls.find(([url]) => String(url).includes('turnstile'))
    const form = verify?.[1]?.body as FormData
    expect(form.get('remoteip')).toBe('203.0.113.7')
    expect(form.get('secret')).toBe('secret')
  })

  it('silently drops honeypot submissions without calling upstream services', async () => {
    mockUpstream()
    const res = await call({ ...validBody, website: 'http://spam.example' })
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a missing Turnstile token', async () => {
    mockUpstream()
    const res = await call({ ...validBody, turnstileToken: '' })
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a failed Turnstile check and never sends email', async () => {
    mockUpstream({ turnstile: false })
    const res = await call(validBody)
    expect(res.status).toBe(403)
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('resend'))).toBe(false)
  })

  it('returns field errors for invalid input', async () => {
    mockUpstream()
    const res = await call({ ...validBody, postcode: 'nope', consent: false })
    expect(res.status).toBe(422)
    const data = (await res.json()) as { errors: Record<string, string> }
    expect(Object.keys(data.errors).sort()).toEqual(['consent', 'postcode'])
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('resend'))).toBe(false)
  })

  it('returns 502 when Resend fails, without logging personal data', async () => {
    mockUpstream({ resendStatus: 500 })
    const res = await call(validBody)
    expect(res.status).toBe(502)
    const logged = vi.mocked(console.error).mock.calls.flat().join(' ')
    expect(logged).not.toContain('Jo Bloggs')
    expect(logged).not.toContain('07904')
  })

  it('returns 503 when secrets are not configured', async () => {
    mockUpstream()
    const res = await call(validBody, {}, { RESEND_API_KEY: '' })
    expect(res.status).toBe(503)
  })

  it('rejects malformed JSON and oversized bodies', async () => {
    expect((await call('{not json')).status).toBe(400)
    expect((await call({ ...validBody, notes: 'x'.repeat(20_000) })).status).toBe(413)
  })

  it('answers other methods with 405', async () => {
    const request = new Request('https://example.com/api/book', { method: 'GET' })
    const res = await onRequest({ request, env } as unknown as Parameters<typeof onRequest>[0])
    expect(res.status).toBe(405)
    expect(res.headers.get('Allow')).toBe('POST')
  })
})
