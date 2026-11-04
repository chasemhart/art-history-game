// Next button: the solid ink button that moves the student forward.
//
// Used by: the Sort screen (and later Identify and the review screens).
// Why it exists as its own component: it is the single strongest call to
// action on any screen, so it should look and behave identically everywhere,
// including its gold arrow.

import './NextButton.css'

// ref lets a screen move keyboard focus here once the next step is ready.
// type="submit" lets it send a form, as "Check answers" does in Identify.
export default function NextButton({ children, onClick, ref, type = 'button' }) {
  return (
    <button ref={ref} type={type} className="next-button" onClick={onClick}>
      {children}
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 9h11M10 4.5L14.5 9 10 13.5" />
      </svg>
    </button>
  )
}
