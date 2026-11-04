// Placeholder screen: a quiet note for screens that are not built yet.
//
// Used by: App.jsx for Identify (arriving in M3) and the round review
// (arriving in M2).
// Why it exists: the header links to every mode from the start, so each link
// should land somewhere calm and useful rather than on a blank page.

import './screens.css'

export default function PlaceholderScreen({ title, children }) {
  return (
    <main className="screen screen--note">
      <section className="placeholder glass">
        <h1 className="placeholder__title">{title}</h1>
        <span className="placeholder__rule" aria-hidden="true" />
        <p>{children}</p>
        <a className="placeholder__link" href="#/sort">
          Go to Sort by movement
        </a>
      </section>
    </main>
  )
}
