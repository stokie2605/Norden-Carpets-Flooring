import { StrictMode, act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { render, type Page } from '../entry-server'
import App from '../App'
import PrivacyPage from '../pages/PrivacyPage'

// Guards the build time prerender: the client must hydrate the server HTML without mismatches.
describe.each<[Page, () => React.JSX.Element]>([
  ['home', () => <App />],
  ['privacy', () => <PrivacyPage />],
])('%s page hydration', (page, Component) => {
  it('hydrates the prerendered HTML without recoverable errors', async () => {
    const container = document.createElement('div')
    container.innerHTML = render(page)
    document.body.appendChild(container)

    const errors: string[] = []
    await act(async () => {
      hydrateRoot(
        container,
        <StrictMode>
          <Component />
        </StrictMode>,
        { onRecoverableError: (error) => errors.push(String((error as Error).message ?? error)) },
      )
    })

    expect(errors).toEqual([])
    container.remove()
  })
})
