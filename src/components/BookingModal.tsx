import { useEffect, useId, useRef, useState, type ComponentProps, type FormEvent, type MouseEvent } from 'react'
import { X } from 'lucide-react'
import { copy, links, phones } from '../content/site'
import { useBooking } from '../context/BookingContext'
import {
  LIMITS,
  MATERIAL_OPTIONS,
  emptyBooking,
  hasErrors,
  validateBooking,
  type BookingErrors,
  type BookingField,
  type BookingInput,
} from '../lib/booking'
import { Button, ButtonLink } from './ui/Button'
import { Turnstile, type TurnstileHandle } from './Turnstile'

type Status = 'editing' | 'submitting' | 'success' | 'error'

// One short screen. Dave or Wendy phone to arrange the visit, so no email or visit time is asked for.
const initialForm: BookingInput = { ...emptyBooking, preferredTime: 'any' }
// The order fields appear in, so the first problem gets focus.
const FIELD_ORDER: readonly BookingField[] = ['material', 'name', 'phone', 'postcode', 'notes', 'consent']

const t = copy.booking

const inputClass =
  'mt-1.5 block w-full min-h-12 rounded-md border bg-bg px-3.5 text-base text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-accent-deep">
      {message}
    </p>
  )
}

function TextField({
  label,
  name,
  value,
  error,
  onChange,
  optional,
  ...input
}: {
  label: string
  name: BookingField
  value: string
  error?: string
  optional?: boolean
  onChange: (value: string) => void
} & Pick<ComponentProps<'input'>, 'type' | 'inputMode' | 'autoComplete' | 'maxLength' | 'placeholder' | 'autoCapitalize'>) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label} {optional && <span className="font-normal text-muted">{t.optional}</span>}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClass} ${error ? 'border-accent' : 'border-ink/20'}`}
        {...input}
      />
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export function BookingModal() {
  const { isOpen, presetMaterial, closeBooking } = useBooking()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const turnstileRef = useRef<TurnstileHandle>(null)
  const titleId = useId()
  const notesId = useId()

  const [form, setForm] = useState<BookingInput>(initialForm)
  const [errors, setErrors] = useState<BookingErrors>({})
  const [status, setStatus] = useState<Status>('editing')
  const [serverMessage, setServerMessage] = useState('')
  const [token, setToken] = useState('')
  const [turnstileFailed, setTurnstileFailed] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  // Open and close the native dialog in step with context state, and lock page scroll while open.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) {
      if (status === 'success' || status === 'error') {
        setForm(initialForm)
        setStatus('editing')
        setToken('')
      }
      if (presetMaterial) setForm((f) => ({ ...f, material: presetMaterial }))
      setErrors({})
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
    // status is read only to decide whether to reset when reopening, so it is not a dependency.
  }, [isOpen, presetMaterial])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onClose = () => {
      document.documentElement.style.overflow = ''
      closeBooking()
    }
    dialog.addEventListener('close', onClose)
    return () => dialog.removeEventListener('close', onClose)
  }, [closeBooking])

  // Move focus to the heading so screen readers announce the form, the thank you and any error.
  useEffect(() => {
    if (isOpen) headingRef.current?.focus()
  }, [status, isOpen])

  const update = (field: BookingField, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const focusFirstError = (found: BookingErrors) => {
    const first = FIELD_ORDER.find((f) => found[f])
    if (first) setTimeout(() => (document.querySelector(`dialog [name="${first}"]`) as HTMLElement | null)?.focus(), 0)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validateBooking(form)
    setErrors(found)
    if (hasErrors(found)) {
      focusFirstError(found)
      return
    }
    if (!token) {
      setServerMessage(t.securityPrompt)
      return
    }

    setStatus('submitting')
    setServerMessage('')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken: token, website: honeypot }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: BookingErrors }
      if (res.ok && data.ok) {
        setStatus('success')
        return
      }
      if (res.status === 422 && data.errors) {
        setErrors(data.errors)
        focusFirstError(data.errors)
        setStatus('editing')
      } else if (res.status === 403 || res.status === 400) {
        setServerMessage(data.error ?? 'Security check failed. Please try again.')
        setStatus('editing')
      } else {
        setServerMessage(data.error ?? 'Something went wrong sending that.')
        setStatus('error')
      }
    } catch {
      setServerMessage("We couldn't send that. Check your connection, or give us a call.")
      setStatus('error')
    }
    // Turnstile tokens are single use.
    setToken('')
    turnstileRef.current?.reset()
  }

  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    // A click on the dialog element itself (not its content) is a click on the backdrop.
    if (event.target === dialogRef.current) dialogRef.current?.close()
  }

  const close = () => dialogRef.current?.close()
  const pad = 'px-5 sm:px-8'

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={onDialogClick}
      className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0 sm:m-auto sm:h-fit sm:max-h-[min(92dvh,50rem)] sm:max-w-[34rem]"
    >
      <div className="flex h-full flex-col bg-bg sm:max-h-[min(92dvh,50rem)] sm:overflow-hidden sm:rounded-lg">
        <div className={`flex items-start justify-between gap-4 border-b border-line pb-4 pt-5 sm:pb-5 sm:pt-7 ${pad}`}>
          <div>
            <p className="eyebrow">{status === 'success' ? t.successEyebrow : t.eyebrow}</p>
            <h2
              id={titleId}
              ref={headingRef}
              tabIndex={-1}
              className="mt-1.5 text-[1.75rem] font-extrabold leading-[1.05] focus:outline-none sm:text-[2rem]"
            >
              {status === 'success' ? t.successTitle : status === 'error' ? t.errorTitle : t.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t.close}
            className="grid size-11 shrink-0 place-items-center rounded-md border border-line text-ink hover:border-ink"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {status === 'success' ? (
          <div className={`flex-1 overflow-y-auto py-7 ${pad}`}>
            <p className="text-lg leading-[1.55] text-ink">
              {t.successBody(form.name.trim().split(' ')[0] ?? '', form.phone)}
            </p>
            <Button variant="ink" className="mt-7 w-full sm:w-auto" onClick={close}>
              {t.done}
            </Button>
          </div>
        ) : status === 'error' ? (
          <div className={`flex-1 overflow-y-auto py-7 ${pad}`}>
            <p role="alert" className="leading-[1.55] text-ink">
              {serverMessage} {t.errorBody}
            </p>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              <ButtonLink href={phones.showroom.href}>Call {phones.showroom.display}</ButtonLink>
              <ButtonLink href={links.whatsapp} target="_blank" rel="noopener noreferrer" variant="ink">
                {copy.cta.whatsapp}
              </ButtonLink>
            </div>
            <Button variant="quiet" className="mt-6" onClick={() => setStatus('editing')}>
              {t.back}
            </Button>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className={`flex-1 space-y-5 overflow-y-auto py-6 ${pad}`}>
              <p className="text-[0.9375rem] leading-[1.55] text-ink-soft">{t.intro}</p>

              <fieldset aria-describedby={errors.material ? 'material-error' : undefined}>
                <legend className="text-sm font-semibold text-ink">{t.materialLegend}</legend>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {MATERIAL_OPTIONS.map((o) => {
                    const selected = form.material === o.value
                    return (
                      <label
                        key={o.value}
                        className={`flex min-h-12 cursor-pointer items-center justify-center rounded-md border px-2 text-center text-[0.9375rem] font-semibold leading-tight transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                          selected ? 'border-ink bg-ink text-white' : 'border-ink/20 bg-bg text-ink hover:border-ink'
                        }`}
                      >
                        <input
                          type="radio"
                          name="material"
                          value={o.value}
                          checked={selected}
                          onChange={() => update('material', o.value)}
                          className="sr-only"
                        />
                        {o.label}
                      </label>
                    )
                  })}
                </div>
                <FieldError id="material-error" message={errors.material} />
              </fieldset>

              <TextField
                label={t.name}
                name="name"
                value={form.name}
                error={errors.name}
                onChange={(v) => update('name', v)}
                autoComplete="name"
                maxLength={LIMITS.name}
              />
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
                <TextField
                  label={t.phone}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  error={errors.phone}
                  onChange={(v) => update('phone', v)}
                  autoComplete="tel"
                  maxLength={LIMITS.phone}
                />
                <TextField
                  label={t.postcode}
                  name="postcode"
                  value={form.postcode}
                  error={errors.postcode}
                  onChange={(v) => update('postcode', v)}
                  autoComplete="postal-code"
                  autoCapitalize="characters"
                  maxLength={LIMITS.postcode}
                />
              </div>

              <div>
                <label htmlFor={notesId} className="text-sm font-semibold text-ink">
                  {t.notes} <span className="font-normal text-muted">{t.optional}</span>
                </label>
                <textarea
                  id={notesId}
                  name="notes"
                  rows={2}
                  value={form.notes}
                  maxLength={LIMITS.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  aria-invalid={errors.notes ? true : undefined}
                  aria-describedby={errors.notes ? `${notesId}-error` : undefined}
                  placeholder={t.notesPlaceholder}
                  className={`${inputClass} py-3 ${errors.notes ? 'border-accent' : 'border-ink/20'}`}
                />
                <FieldError id={`${notesId}-error`} message={errors.notes} />
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-[1.5] text-ink-soft">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={(e) => update('consent', e.target.checked)}
                    aria-invalid={errors.consent ? true : undefined}
                    aria-describedby={errors.consent ? 'consent-error' : undefined}
                    className="mt-0.5 size-5 shrink-0 accent-[var(--accent)]"
                  />
                  <span>
                    {t.consentStart}{' '}
                    <a href={links.privacy} target="_blank" className="font-semibold text-ink underline underline-offset-2">
                      {t.consentLink}
                    </a>
                    .
                  </span>
                </label>
                <FieldError id="consent-error" message={errors.consent} />
              </div>

              {/* Honeypot: hidden from people and assistive tech, attractive to bots. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>

              <div>
                <Turnstile
                  ref={turnstileRef}
                  onToken={(tk) => {
                    setToken(tk)
                    setTurnstileFailed(false)
                    setServerMessage('')
                  }}
                  onExpire={() => setToken('')}
                  onError={() => {
                    setToken('')
                    setTurnstileFailed(true)
                  }}
                />
                {turnstileFailed && (
                  <p className="mt-2 text-sm text-accent-deep">
                    {t.securityFailed}{' '}
                    <a className="font-semibold underline" href={phones.showroom.href}>
                      {phones.showroom.display}
                    </a>
                    .
                  </p>
                )}
              </div>

              {serverMessage && status === 'editing' && (
                <p role="alert" className="rounded-md bg-pill px-4 py-3 text-sm font-medium text-accent-deep">
                  {serverMessage}
                </p>
              )}
            </div>

            <div className={`border-t border-line pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6 ${pad}`}>
              <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? t.sending : t.submit}
              </Button>
              <p className="mt-2.5 text-center text-[0.8125rem] text-muted">{t.reply}</p>
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}
