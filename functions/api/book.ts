import {
  MATERIAL_OPTIONS,
  TIME_OPTIONS,
  hasErrors,
  labelFor,
  normalisePhone,
  normalisePostcode,
  toBookingInput,
  validateBooking,
  type BookingInput,
} from '../../src/lib/booking'

export interface Env {
  RESEND_API_KEY: string
  BOOKING_TO_EMAIL: string
  BOOKING_FROM_EMAIL: string
  TURNSTILE_SECRET_KEY: string
}

const MAX_BODY_BYTES = 10_000
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const RESEND_URL = 'https://api.resend.com/emails'

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c)

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  if (ip) form.append('remoteip', ip)
  const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form })
  if (!res.ok) return false
  const outcome = (await res.json()) as { success?: boolean }
  return outcome.success === true
}

function buildEmail(input: BookingInput) {
  const rows: [string, string][] = [
    ['Flooring', labelFor(MATERIAL_OPTIONS, input.material)],
    ['Postcode', normalisePostcode(input.postcode)],
    ['Preferred time', labelFor(TIME_OPTIONS, input.preferredTime)],
    ['Name', input.name.trim()],
    ['Phone', normalisePhone(input.phone)],
    ['Email', input.email.trim() || 'Not given'],
    ['Notes', input.notes.trim() || 'None'],
  ]
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n')
  const html = `<h2 style="font-family:Arial,sans-serif">New quote request</h2><table style="font-family:Arial,sans-serif;border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join('')}</table>`
  return {
    subject: `Quote request: ${labelFor(MATERIAL_OPTIONS, input.material)}, ${normalisePostcode(input.postcode)}`,
    text,
    html,
  }
}

async function handlePost(request: Request, env: Env): Promise<Response> {
  const length = Number(request.headers.get('Content-Length') ?? 0)
  if (length > MAX_BODY_BYTES) return json({ ok: false, error: 'Request too large.' }, 413)

  let body: Record<string, unknown>
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'Request too large.' }, 413)
    body = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400)
  }

  // Honeypot: real visitors never see or fill this field. Reply as if successful so bots learn nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json({ ok: true })
  }

  const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : ''
  if (!token) return json({ ok: false, error: 'Please complete the security check.' }, 400)

  if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY || !env.BOOKING_TO_EMAIL || !env.BOOKING_FROM_EMAIL) {
    console.error('book: missing environment configuration')
    return json({ ok: false, error: 'Booking is temporarily unavailable. Please call us instead.' }, 503)
  }

  let human = false
  try {
    human = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, request.headers.get('CF-Connecting-IP'))
  } catch {
    console.error('book: turnstile verification request failed')
  }
  if (!human) return json({ ok: false, error: 'Security check failed. Please try again.' }, 403)

  const input = toBookingInput(body)
  const errors = validateBooking(input)
  if (hasErrors(errors)) return json({ ok: false, error: 'Please check the highlighted fields.', errors }, 422)

  const email = buildEmail(input)
  const replyTo = input.email.trim()
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.BOOKING_FROM_EMAIL,
        to: [env.BOOKING_TO_EMAIL],
        subject: email.subject,
        text: email.text,
        html: email.html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    })
    if (!res.ok) {
      // Status only: never log the payload, it contains personal data.
      console.error(`book: resend responded ${res.status}`)
      return json({ ok: false, error: 'We could not send your request. Please call us instead.' }, 502)
    }
  } catch {
    console.error('book: resend request failed')
    return json({ ok: false, error: 'We could not send your request. Please call us instead.' }, 502)
  }

  return json({ ok: true })
}

// One handler for every method so non POST requests reliably get a 405.
export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'POST') return handlePost(request, env)
  return new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'application/json; charset=utf-8' },
  })
}
