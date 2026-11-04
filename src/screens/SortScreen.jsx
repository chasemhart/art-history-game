// Sort screen: one painting at a time on the wall, the student names its
// movement, and the label opens to teach why.
//
// Used by: App.jsx when the address is #/sort (the default).
// Why it exists as its own file: a screen arranges components for one mode of
// study and owns that mode's flow: look, decide, read, move on. The rules
// (one answer per painting, what counts as correct) live in lib/round.js;
// this file decides what the student sees at each moment.

import { useEffect, useRef, useState } from 'react'
import ArtworkStage from '../components/ArtworkStage/ArtworkStage.jsx'
import ChoiceList from '../components/ChoiceList/ChoiceList.jsx'
import NextButton from '../components/NextButton/NextButton.jsx'
import WallLabel from '../components/WallLabel/WallLabel.jsx'
import ZoomView from '../components/ZoomView/ZoomView.jsx'
import movements, { movementById } from '../data/movements.js'
import { preloadPainting } from '../lib/images.js'
import './screens.css'

// Keyboard shortcuts must never fire while the student is typing
function isTyping(target) {
  return target.closest('input, textarea, select, [contenteditable="true"]') !== null
}

export default function SortScreen({ round, onFinish }) {
  const { current, upNext, isLast, answer: picked, isCorrect, choose, next } = round
  const answered = picked !== null
  const movement = movementById[current.movement]
  const nextRef = useRef(null)
  // Which painting is open in the zoom view, if any. Storing the id (not
  // true or false) means a new painting can never inherit an open zoom.
  const [zoomedId, setZoomedId] = useState(null)
  const zoomOpen = zoomedId === current.id
  const advance = isLast ? onFinish : next

  // Start downloading the next painting while the student looks at this one,
  // so it appears without a wait
  useEffect(() => {
    if (upNext) preloadPainting(upNext)
  }, [upNext])

  // Once answered, keyboard focus moves to Next, so the flow is "press a
  // number, then Enter". preventScroll keeps the page from jumping on phones.
  useEffect(() => {
    if (answered) nextRef.current?.focus({ preventScroll: true })
  }, [answered, current.id])

  // Desktop shortcuts: keys 1 to 5 choose a movement, Right Arrow moves on.
  // Enter already works on the focused button, as it does for every button.
  useEffect(() => {
    function onKeyDown(event) {
      // event.repeat: holding a key down shouldn't race through the round
      // The zoom view is a separate layer: keys pressed there mustn't answer
      // the painting behind it
      if (zoomOpen || event.repeat || event.altKey || event.ctrlKey || event.metaKey || isTyping(event.target)) return
      const choice = movements[Number(event.key) - 1]
      if (!answered && choice) choose(choice.id)
      else if (answered && event.key === 'ArrowRight') advance()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [answered, choose, advance, zoomOpen])

  // The movement's colors and era light are set only after the answer.
  // Showing them earlier would give the answer away (DESIGN.md section 7).
  const movementColors = answered
    ? { '--movement-accent': movement.accent, '--movement-ink': movement.ink, '--era-light': movement.light }
    : undefined

  return (
    <main className="screen screen--split" style={movementColors}>
      <div className="screen__art">
        <ArtworkStage painting={current} lit={answered} onZoom={() => setZoomedId(current.id)} />
      </div>
      <div className="screen__side">
        <WallLabel painting={current} movement={answered ? movement : null} />

        <div className="sort-answer">
          {/* One live region for the question and the verdict, so screen
              readers announce the result the moment it appears */}
          <p className="sort-answer__prompt" aria-live="polite">
            {answered ? (
              <span key="verdict" className="sort-answer__verdict">
                {isCorrect ? 'Correct.' : 'Not quite.'} This is {movement.name}.
              </span>
            ) : (
              // Gold path, step 3: a gold diamond beside the question
              <span key={`ask-${current.id}`} className="sort-answer__question lead">
                Which movement?
              </span>
            )}
          </p>
          <ChoiceList key={current.id} movements={movements} picked={picked} correctId={current.movement} onChoose={choose} />
        </div>

        {answered && (
          <div className="sort-next">
            <NextButton ref={nextRef} onClick={advance}>
              {isLast ? 'See your round' : 'Next painting'}
            </NextButton>
          </div>
        )}
      </div>

      <ZoomView painting={current} open={zoomOpen} onClose={() => setZoomedId(null)} />
    </main>
  )
}
