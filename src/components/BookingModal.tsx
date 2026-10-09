import { useEffect, useId, useRef, useState, type ComponentProps, type FormEvent, type MouseEvent, type ReactNode } from 'react'
import { CheckCircle2, Phone, X } from 'lucide-react'
import { links, phones } from '../content/site'
import { useBooking } from '../context/BookingContext'
import {
  LIMITS,
  MATERIAL_OPTIONS,
  TIME_OPTIONS,
  emptyBooking,
  hasErrors,
  labelFor,
  normalisePostcode,
  validateBooking,
  type BookingErrors,
  type BookingField,
  type BookingInput,
} from '../lib/booking'
import { Button, ButtonLink } from './ui/Button'
import { WhatsAppIcon } from './ui/BrandIcons'
import { Turnstile, type TurnstileHandle } from './Turnstile'

const STEPS: { title: string; fields: readonly BookingField[] }[] = [
  { title: 'Your floor', fields: ['material', 'postcode', 'preferredTime'] },
  { title: 'Your details', fields: ['name', 'phone', 'email', 'notes'] },
  { title: 'Confirm', fields: ['consent'] },
]

type Status = 'editing' | 'submitting' | 'success' | 'error'

const inputClass =
  'mt-1.5 block w-full min-h-12 rounded-xl border bg-bg px-4 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-accent-deep">
      {message}
    </p>
  )
}

function ChoiceGroup({
  legend,
  name,
  options,
  value,
  error,
  onChange,
  columns,
}: {
  legend: string
  name: string
  options: readonly { value: string; label: string }[]
  value: string
  error?: string
  onChange: (value: string) => void
  columns: string
}) {
  const errorId = `${name}-error`
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-semibold text-ink">{legend}</legend>
      <div className={`mt-2 grid gap-2 ${columns}`}>
        {options.map((o) => (
          <label
            key={o.value}
            className={`flex min-h-12 cursor-pointer items-center rounded-xl border px-4 text-sm font-medium transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent ${
              value === o.value ? 'border-ink bg-ink text-white' : 'border-line bg-bg text-ink hover:border-ink/40'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  )
}

function TextField({
  label,
  name,
  value,
  error,
  onChange,
  hint,
  ...input
}: {
  label: string
  name: BookingField
  value: string
  error?: string
  hint?: ReactNode
  onChange: (value: string) => void
} & Pick<ComponentProps<'input'>, 'type' | 'inputMode' | 'autoComplete' | 'maxLength' | 'placeholder' | 'autoCapitalize'>) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label} {hint}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClass} ${error ? 'border-accent' : 'border-line'}`}
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

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<BookingInput>(emptyBooking)
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
        setForm(emptyBooking)
        setStep(0)
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

  // Move focus to the step heading so screen readers announce each step.
  useEffect(() => {
    if (isOpen) headingRef.current?.focus()
  }, [step, status, isOpen])

  const update = (field: BookingField, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const currentStep = STEPS[step] ?? STEPS[0]!

  const goNext = () => {
    const stepErrors = validateBooking(form, currentStep.fields)
    setErrors(stepErrors)
    if (!hasErrors(stepErrors)) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1))
    } else {
      setTimeout(() => {
        const first = currentStep.fields.find((f) => stepErrors[f])
        if (first) (document.querySelector(`[name="${first}"]`) as HTMLElement)?.focus()
      }, 0)
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (step < STEPS.length - 1) {
      goNext()
      return
    }
    const allErrors = validateBooking(form)
    setErrors(allErrors)
    if (hasErrors(allErrors)) {
      const firstBad = STEPS.findIndex((s) => s.fields.some((f) => allErrors[f]))
      if (firstBad >= 0) {
        setStep(firstBad)
        setTimeout(() => {
          const first = STEPS[firstBad]?.fields.find((f) => allErrors[f])
          if (first) (document.querySelector(`[name="${first}"]`) as HTMLElement)?.focus()
        }, 0)
      }
      return
    }
    if (!token) {
      setServerMessage('Please complete the security check below.')
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
        const firstBad = STEPS.findIndex((s) => s.fields.some((f) => data.errors?.[f]))
        setStep(firstBad >= 0 ? firstBad : 0)
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

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={onDialogClick}
      className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0 sm:m-auto sm:h-fit sm:max-h-[min(92dvh,52rem)] sm:max-w-xl sm:rounded-[1.75rem]"
    >
      <div className="flex h-full flex-col bg-bg sm:max-h-[min(92dvh,52rem)] sm:rounded-[1.75rem]">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 pb-4 pt-5 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep">
              {status === 'success' ? 'Request sent' : `Free measure, step ${step + 1} of ${STEPS.length}`}
            </p>
            <h2 id={titleId} ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-extrabold focus:outline-none">
              {status === 'success' ? 'Thank you' : status === 'error' ? "Sorry, that didn't send" : currentStep.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close booking form"
            className="grid size-12 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-bg-alt hover:text-ink"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-7">
            <CheckCircle2 className="size-12 text-accent" aria-hidden="true" />
            <p className="mt-4 text-lg text-ink">
              Thanks {form.name.trim().split(' ')[0]}. Dave or Wendy will call you on {form.phone} to arrange your free
              measure, usually within one working day.
            </p>
            <Button className="mt-8 w-full sm:w-auto" onClick={() => dialogRef.current?.close()}>
              Done
            </Button>
          </div>
        ) : status === 'error' ? (
          <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-7">
            <p role="alert" className="text-ink">
              {serverMessage} Your details have not been lost: you can try again or reach us directly.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ButtonLink href={phones.showroom.href}>
                <Phone className="size-4" aria-hidden="true" />
                Call {phones.showroom.display}
              </ButtonLink>
              <ButtonLink href={links.whatsapp} target="_blank" rel="noopener noreferrer" variant="secondary">
                <WhatsAppIcon className="size-5 text-[#128C7E]" />
                WhatsApp us
              </ButtonLink>
            </div>
            <Button variant="quiet" className="mt-6" onClick={() => setStatus('editing')}>
              Back to the form
            </Button>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-7">
              {step === 0 && (
                <>
                  <ChoiceGroup
                    legend="What would you like fitted?"
                    name="material"
                    options={MATERIAL_OPTIONS}
                    value={form.material}
                    error={errors.material}
                    onChange={(v) => update('material', v)}
                    columns="grid-cols-2"
                  />
                  <TextField
                    label="Postcode"
                    name="postcode"
                    value={form.postcode}
                    error={errors.postcode}
                    onChange={(v) => update('postcode', v)}
                    autoComplete="postal-code"
                    autoCapitalize="characters"
                    maxLength={LIMITS.postcode}
                    placeholder="M1 1AA"
                  />
                  <ChoiceGroup
                    legend="When suits you for the visit?"
                    name="preferredTime"
                    options={TIME_OPTIONS}
                    value={form.preferredTime}
                    error={errors.preferredTime}
                    onChange={(v) => update('preferredTime', v)}
                    columns="grid-cols-2"
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <TextField
                    label="Your name"
                    name="name"
                    value={form.name}
                    error={errors.name}
                    onChange={(v) => update('name', v)}
                    autoComplete="name"
                    maxLength={LIMITS.name}
                  />
                  <TextField
                    label="Phone number"
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
                    label="Email"
                    hint={<span className="font-normal text-muted">(optional)</span>}
                    name="email"
                    type="email"
                    inputMode="email"
                    value={form.email}
                    error={errors.email}
                    onChange={(v) => update('email', v)}
                    autoComplete="email"
                    maxLength={LIMITS.email}
                  />
                  <NotesField value={form.notes} error={errors.notes} onChange={(v) => update('notes', v)} />
                </>
              )}

              {step === 2 && (
                <>
                  <dl className="divide-y divide-line rounded-2xl border border-line text-sm">
                    {[
                      ['Flooring', labelFor(MATERIAL_OPTIONS, form.material)],
                      ['Postcode', normalisePostcode(form.postcode)],
                      ['Preferred time', labelFor(TIME_OPTIONS, form.preferredTime)],
                      ['Name', form.name],
                      ['Phone', form.phone],
                      ...(form.email ? [['Email', form.email]] : []),
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 px-4 py-3">
                        <dt className="text-muted">{k}</dt>
                        <dd className="text-right font-medium text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => update('consent', e.target.checked)}
                        aria-invalid={errors.consent ? true : undefined}
                        aria-describedby={errors.consent ? 'consent-error' : undefined}
                        className="mt-0.5 size-5 shrink-0 accent-[var(--accent)]"
                      />
                      <span>
                        I agree to Norden Carpets &amp; Flooring using these details to contact me about my free measure.
                        Read our{' '}
                        <a href={links.privacy} target="_blank" className="font-semibold text-ink underline">
                          privacy notice
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
                      onToken={(t) => {
                        setToken(t)
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
                        The security check could not load. Please refresh, or call us on{' '}
                        <a className="font-semibold underline" href={phones.showroom.href}>
                          {phones.showroom.display}
                        </a>
                        .
                      </p>
                    )}
                  </div>
                </>
              )}

              {serverMessage && status === 'editing' && (
                <p role="alert" className="rounded-xl bg-pill px-4 py-3 text-sm font-medium text-accent-deep">
                  {serverMessage}
                </p>
              )}
            </div>

            <div className="flex gap-3 border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">
              {step > 0 && (
                <Button variant="secondary" onClick={() => setStep((s) => s - 1)} className="flex-1 sm:flex-none">
                  Back
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={status === 'submitting'}>
                {step < STEPS.length - 1
                  ? 'Continue'
                  : status === 'submitting'
                    ? 'Sending...'
                    : 'Request my free measure'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}

function NotesField({ value, error, onChange }: { value: string; error?: string; onChange: (v: string) => void }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        Anything we should know? <span className="font-normal text-muted">(optional)</span>
      </label>
      <textarea
        id={id}
        name="notes"
        rows={3}
        value={value}
        maxLength={LIMITS.notes}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder="Rooms, stairs, furniture to move, timescales"
        className={`${inputClass} py-3 ${error ? 'border-accent' : 'border-line'}`}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}
