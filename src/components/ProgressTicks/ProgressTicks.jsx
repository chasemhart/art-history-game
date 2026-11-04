// Progress ticks: one small mark per painting in the round.
//
// Used by: the header, beside "Painting N of 8".
// Why it exists as its own component: it is a self-contained visual with its
// own rules (done, current, to come) that the arcade header will reuse.
// It is hidden from screen readers because the words beside it already say
// the same thing.

import './ProgressTicks.css'

export default function ProgressTicks({ position, total }) {
  return (
    <span className="progress-ticks" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const state = step < position ? 'is-done' : step === position ? 'is-current' : 'is-ahead'
        return <span key={step} className={`progress-tick ${state}`} />
      })}
    </span>
  )
}
