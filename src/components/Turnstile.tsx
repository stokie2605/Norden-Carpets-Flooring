import { useEffect, useImperativeHandle, useRef, type Ref } from 'react'

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
      theme?: 'light' | 'dark' | 'auto'
      size?: 'normal' | 'flexible' | 'compact'
    },
  ) => string
  reset: (id: string) => void
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise: Promise<TurnstileApi> | null = null

/** Loads the Turnstile script once, on demand, the first time the booking form needs it. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile unavailable')))
      script.onerror = () => {
        scriptPromise = null
        reject(new Error('Turnstile failed to load'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

export type TurnstileHandle = { reset: () => void }

type TurnstileProps = {
  onToken: (token: string) => void
  onExpire: () => void
  onError: () => void
  ref?: Ref<TurnstileHandle>
}

export function Turnstile({ onToken, onExpire, onError, ref }: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  // Keep the latest callbacks without re-rendering the widget.
  const callbacks = useRef({ onToken, onExpire, onError })
  callbacks.current = { onToken, onExpire, onError }

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current)
    },
  }))

  useEffect(() => {
    let cancelled = false
    loadTurnstile()
      .then((api) => {
        if (cancelled || !container.current) return
        widgetId.current = api.render(container.current, {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
          theme: 'light',
          size: 'flexible',
          callback: (token) => callbacks.current.onToken(token),
          'expired-callback': () => callbacks.current.onExpire(),
          'error-callback': () => callbacks.current.onError(),
        })
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onError()
      })
    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = null
    }
  }, [])

  return <div ref={container} className="min-h-[65px]" />
}
