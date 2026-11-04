// Choice list: the five movement buttons the student answers with.
//
// Used by: the Sort screen (and later Challenge).
// Why it exists as its own component: each button has four looks (waiting,
// the right answer, a wrong pick, and faded) and the rules for which button
// gets which look are the heart of the answer moment. Keeping them together
// means every mode answers the same way.

import './ChoiceList.css'

// Which look a button takes once the student has answered
function stateFor(movementId, picked, correctId) {
  if (picked === null) return 'idle'
  if (movementId === correctId) return 'answer'
  if (movementId === picked) return 'wrong'
  return 'dim'
}

export default function ChoiceList({ movements, picked, correctId, onChoose }) {
  const answered = picked !== null
  return (
    <div className="choice-list" role="group" aria-label="Movements">
      {movements.map((movement, i) => {
        const state = stateFor(movement.id, picked, correctId)
        // Status is never color alone: the right answer and a wrong pick also
        // carry a word on the right side of the button
        const mark = state === 'answer' ? (picked === movement.id ? 'Your pick' : 'Answer') : state === 'wrong' ? 'Your pick' : ''
        return (
          <button
            key={movement.id}
            type="button"
            className={`choice is-${state}`}
            // Answers rise in one after another, 50ms apart: a reading order
            style={{ animationDelay: `${120 + i * 50}ms` }}
            // aria-disabled instead of disabled: the button can't be used
            // again, but it stays readable and focusable for screen readers
            aria-disabled={answered || undefined}
            onClick={() => !answered && onChoose(movement.id)}
          >
            <span className="choice__label">
              {/* The keyboard shortcut, shown quietly on wide screens */}
              <span className="choice__key" aria-hidden="true">
                {i + 1}
              </span>
              {movement.name}
            </span>
            {mark && <span className="choice__mark">{mark}</span>}
            {state === 'idle' && (
              <svg className="choice__chevron" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 3.5L10.5 8 6 12.5" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
