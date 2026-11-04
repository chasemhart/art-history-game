// Header: the wordmark, the mode tabs, and progress through the round.
//
// Used by: App.jsx, above every screen.
// Why it exists as its own component: every screen shares it, so it lives in
// one place. It receives the current route and progress from App rather than
// working them out itself, which keeps it a pure piece of display.

import { modeOf } from '../../lib/useHashRoute.js'
import { useHideOnScroll } from '../../lib/useHideOnScroll.js'
import ProgressTicks from '../ProgressTicks/ProgressTicks.jsx'
import './Header.css'

const TABS = [
  { route: 'sort', label: 'Sort by movement' },
  { route: 'identify', label: 'Identify' },
]

export default function Header({ route, progress }) {
  // The header tucks away while you scroll down and returns when you scroll up
  const tucked = useHideOnScroll()
  return (
    <header className={`site-header glass${tucked ? ' is-tucked' : ''}`}>
      <a className="site-header__wordmark" href="#/sort">
        Art History Study
      </a>

      <nav className="site-header__tabs" aria-label="Study modes">
        {TABS.map((tab) => (
          <a
            key={tab.route}
            href={`#/${tab.route}`}
            className="site-header__tab"
            // A mode's review still belongs to that mode, so its tab stays marked
            aria-current={modeOf(route) === tab.route ? 'page' : undefined}
          >
            {tab.label}
          </a>
        ))}
      </nav>

      {progress && (
        <div className="site-header__progress">
          {/* Announced politely to screen readers each time it changes */}
          <span aria-live="polite">{progress.label}</span>
          <ProgressTicks position={progress.position} total={progress.total} />
        </div>
      )}
    </header>
  )
}
