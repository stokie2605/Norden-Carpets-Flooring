import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import PrivacyPage from './pages/PrivacyPage'
import './styles/index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element missing')

const page = (
  <StrictMode>
    <PrivacyPage />
  </StrictMode>
)

// Production HTML is prerendered by scripts/prerender.mjs; the dev server serves an empty root.
if (root.hasChildNodes()) hydrateRoot(root, page)
else createRoot(root).render(page)
