// Status badge: Correct, Close, or Not quite, as a small labelled pill.
//
// Used by: Identify's result rows and both review screens.
// Why it exists as its own component: a grade must look the same everywhere
// it appears, and it must never rely on color alone (DESIGN.md principle 5).
// Each status has its own shape and icon as well as its word, so it reads
// for anyone, including people who don't see color differences.

import './StatusBadge.css'

const LOOKS = {
  correct: { word: 'Correct', icon: 'M2 6.5l2.5 2.5L10 3.5' }, // a check
  close: { word: 'Close', icon: 'M2 6h8' }, // a dash: partway there
  'not-quite': { word: 'Not quite', icon: 'M3 3l6 6M9 3l-6 6' }, // a cross
}

export default function StatusBadge({ status, style }) {
  const look = LOOKS[status]
  return (
    <span className={`status-badge is-${status}`} style={style}>
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d={look.icon} />
      </svg>
      {look.word}
    </span>
  )
}
