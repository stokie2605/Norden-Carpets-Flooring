import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element missing')

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is prerendered by scripts/prerender.mjs; the dev server serves an empty root.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
