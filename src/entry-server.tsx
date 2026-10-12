import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

export type Page = 'home' | 'privacy' | 'terms'

/** Build time prerender: real HTML ships in the page, so content paints before any JavaScript runs. */
export function render(page: Page): string {
  return renderToString(<StrictMode>{page === 'home' ? <App /> : page === 'terms' ? <TermsPage /> : <PrivacyPage />}</StrictMode>)
}
