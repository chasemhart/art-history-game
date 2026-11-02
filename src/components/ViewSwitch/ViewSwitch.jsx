// View switch: slides between the two ways of sorting by movement,
// "One at a time" and "All at once".
//
// Used by: App.jsx, just under the header, on the Sort tab only.
// Why it exists as its own component: the two sorting styles belong to one
// tab (they teach the same thing in two ways), so they share it instead of
// crowding the header with a third tab. Each option is a real link to its own
// address, so the back button and bookmarks work.

import './ViewSwitch.css'

const VIEWS = [
  { route: 'sort', label: 'One at a time' },
  { route: 'sort/all', label: 'All at once' },
]

export default function ViewSwitch({ route }) {
  const activeIndex = Math.max(0, VIEWS.findIndex((v) => v.route === route))
  return (
    <nav className="view-switch glass" aria-label="Sorting style">
      {/* The ink pill slides under whichever option is chosen */}
      <span className="view-switch__pill" style={{ transform: `translateX(${activeIndex * 100}%)` }} aria-hidden="true" />
      {VIEWS.map((view) => (
        <a
          key={view.route}
          href={`#/${view.route}`}
          className="view-switch__option"
          aria-current={route === view.route ? 'page' : undefined}
        >
          {view.label}
        </a>
      ))}
    </nav>
  )
}
