// Result row: one graded answer in Identify (Title, Artist, or Movement).
//
// Used by: the Identify screen after "Check answers".
// Why it exists as its own component: each row pairs what the student typed
// with its grade and a short teaching note ("Spelled Géricault"), always in
// the same order, so the eye learns where to look: what you wrote, how it did,
// what to remember.

import StatusBadge from '../StatusBadge/StatusBadge.jsx'
import './ResultRow.css'

export default function ResultRow({ label, typed, grade, index }) {
  // Rows arrive one after another in reading order (DESIGN.md section 8.2)
  const delay = { animationDelay: `${100 + index * 100}ms` }
  return (
    <div className="result-row" style={delay}>
      <div className="result-row__text">
        <span className="result-row__label">{label}</span>
        <span className="result-row__typed">{typed.trim() ? `You wrote “${typed.trim()}”` : 'Left blank'}</span>
        {grade.note && <span className={`result-row__note is-${grade.status}`}>{grade.note}</span>}
      </div>
      <StatusBadge status={grade.status} style={delay} />
    </div>
  )
}
