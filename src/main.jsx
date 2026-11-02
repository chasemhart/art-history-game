// Starting point: loads the page-wide styles and puts the App on the page.
//
// Used by: index.html, which loads this file first.
// Why it exists as its own file: it is the one place that connects React to
// the HTML page. Everything the student sees lives in App.jsx and below.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Tokens first, so base styles and every component can use them
import './styles/tokens.css'
import './styles/base.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
