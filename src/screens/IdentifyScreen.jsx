// Identify screen: the painting appears alone, and the student names its
// title, artist, and movement from memory, as the final exam asks.
//
// Used by: App.jsx when the address is #/identify.
// Why it exists as its own file: Identify is recall, not recognition. There
// are no buttons to choose from, only three empty fields. This screen owns
// that flow: look, type, check, learn, try again or move on. The grading
// rules live in lib/grading.js; this file decides what the student sees.

import { useEffect, useId, useRef, useState } from 'react'
import ArtworkStage from '../components/ArtworkStage/ArtworkStage.jsx'
import NextButton from '../components/NextButton/NextButton.jsx'
import ResultRow from '../components/ResultRow/ResultRow.jsx'
import WallLabel from '../components/WallLabel/WallLabel.jsx'
import ZoomView from '../components/ZoomView/ZoomView.jsx'
import movements, { movementById } from '../data/movements.js'
import paintings from '../data/paintings.js'
import { gradeIdentify } from '../lib/grading.js'
import { preloadPainting } from '../lib/images.js'
import './screens.css'

// label asks the question on the form; short names the row once graded
const FIELDS = [
  { name: 'title', label: 'Title', short: 'Title' },
  { name: 'artist', label: "Artist's last name", short: 'Artist' },
  { name: 'movement', label: 'Movement', short: 'Movement' },
]

const EMPTY = { title: '', artist: '', movement: '' }

// Keyboard shortcuts must never fire while the student is typing
function isTyping(target) {
  return target.closest('input, textarea, select, [contenteditable="true"]') !== null
}

// Phones and tablets: don't open the on-screen keyboard by itself, because
// it would cover the painting the student is meant to look at first
function canFocusFieldsSafely() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export default function IdentifyScreen({ round, onFinish }) {
  const { current, upNext, isLast, answer, attempt, next } = round
  const [inputs, setInputs] = useState(EMPTY)
  // The grades for the attempt just made, shown in the result rows. The
  // round itself keeps the best attempt for the review.
  const [shown, setShown] = useState(null)
  const [zoomedId, setZoomedId] = useState(null)
  const firstFieldRef = useRef(null)
  const nextRef = useRef(null)
  const idPrefix = useId()

  const graded = shown !== null
  const movement = movementById[current.movement]
  const advance = isLast ? onFinish : next

  // App gives this screen a fresh start for each painting (its key is the
  // painting's id), so the fields begin empty. On a desktop, put the cursor
  // straight into the first field.
  useEffect(() => {
    if (canFocusFieldsSafely()) firstFieldRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (upNext) preloadPainting(upNext)
  }, [upNext])

  // After checking, focus moves to Next, so Enter, Enter moves through a round
  useEffect(() => {
    if (graded) nextRef.current?.focus({ preventScroll: true })
  }, [graded])

  // Right Arrow moves on once the answers are checked (never while typing)
  useEffect(() => {
    function onKeyDown(event) {
      if (!graded || zoomedId || event.key !== 'ArrowRight' || event.repeat || isTyping(event.target)) return
      if (event.altKey || event.ctrlKey || event.metaKey) return
      advance()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [graded, zoomedId, advance])

  function check(event) {
    // A form would normally reload the page when submitted; this stops that
    event.preventDefault()
    const grades = gradeIdentify(inputs, current, paintings, movements)
    attempt({ inputs, grades })
    setShown(grades)
  }

  // Enter moves to the next field rather than submitting early. A phone
  // labels that key "Next" in the first two fields, so it should behave that
  // way; only Enter in the last field checks the answers.
  function moveToNextField(event, index) {
    if (event.key !== 'Enter' || index === FIELDS.length - 1) return
    event.preventDefault()
    event.currentTarget.form.querySelectorAll('input')[index + 1].focus()
  }

  function tryAgain() {
    setInputs(EMPTY)
    setShown(null)
    // Back to the first field, ready to type (a click, not a surprise keyboard)
    requestAnimationFrame(() => firstFieldRef.current?.focus())
  }

  // The movement's colors and era light appear only after grading, as in Sort
  const movementColors = graded
    ? { '--movement-accent': movement.accent, '--movement-ink': movement.ink, '--era-light': movement.light }
    : undefined

  return (
    <main className="screen screen--split" style={movementColors}>
      <div className="screen__art">
        <ArtworkStage
          painting={current}
          lit={graded}
          // Before grading, the alt text must not name the work it describes
          alt={graded ? undefined : 'The painting to identify'}
          onZoom={() => setZoomedId(current.id)}
        />
      </div>

      <div className="screen__side">
        {!graded ? (
          <form className="identify-form glass" onSubmit={check}>
            {/* Gold path, step 2: a gold diamond beside the prompt */}
            <h1 className="identify-form__prompt lead">Name this work</h1>
            {FIELDS.map((field, i) => (
              <div key={field.name} className="identify-field">
                <label className="identify-field__label" htmlFor={`${idPrefix}-${field.name}`}>
                  {field.label}
                </label>
                <input
                  ref={i === 0 ? firstFieldRef : undefined}
                  id={`${idPrefix}-${field.name}`}
                  className="identify-field__input"
                  type="text"
                  value={inputs[field.name]}
                  onChange={(event) => setInputs({ ...inputs, [field.name]: event.target.value })}
                  onKeyDown={(event) => moveToNextField(event, i)}
                  // Spellcheck and autocorrect would "fix" Gericault before
                  // grading ever saw it, so they are off
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  enterKeyHint={i === FIELDS.length - 1 ? 'done' : 'next'}
                />
              </div>
            ))}
            <NextButton type="submit">Check answers</NextButton>
          </form>
        ) : (
          <>
            <section className="identify-results glass" aria-label="Your answers">
              {/* Read aloud once, so screen reader users hear the outcome */}
              <p className="visually-hidden" role="status">
                {FIELDS.map((f) => `${f.short}: ${shown[f.name].status.replace('-', ' ')}.`).join(' ')}
              </p>
              {FIELDS.map((field, i) => (
                <ResultRow key={field.name} label={field.short} typed={inputs[field.name]} grade={shown[field.name]} index={i} />
              ))}
            </section>

            <WallLabel painting={current} movement={movement} />

            <div className="identify-actions">
              <button type="button" className="quiet-button" onClick={tryAgain}>
                Try again
              </button>
              <NextButton ref={nextRef} onClick={advance}>
                {isLast ? 'See your round' : 'Next painting'}
              </NextButton>
            </div>
          </>
        )}

        {/* After a try again, a quiet reminder that the best attempt is kept */}
        {!graded && answer && <p className="identify-note">Your best answers so far are kept.</p>}
      </div>

      <ZoomView painting={current} open={zoomedId === current.id} onClose={() => setZoomedId(null)} revealed={graded} />
    </main>
  )
}
