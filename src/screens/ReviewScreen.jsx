// Review screen: a calm look back over the round just finished.
//
// Used by: App.jsx at #/review (Sort) and #/identify/review (Identify), once
// a round is finished.
// Why it exists as its own file: reviewing is its own moment in studying,
// different from answering. It shows every painting at once with the
// student's answers beside the right ones, so patterns show up ("I keep
// calling Realist works Romantic"), and offers a round of just the misses.
// Both modes share it; only the middle of each row differs.

import { useEffect, useRef } from 'react'
import NextButton from '../components/NextButton/NextButton.jsx'
import ResultRow from '../components/ResultRow/ResultRow.jsx'
import StatusBadge from '../components/StatusBadge/StatusBadge.jsx'
import { movementById } from '../data/movements.js'
import { smallestImage } from '../lib/images.js'
import imageSizes from '../data/imageSizes.json'
import './ReviewScreen.css'

// A movement name with its accent dot: after answering, each movement's color
// helps build the association between the movement and its look (DESIGN.md 7)
function MovementName({ id }) {
  const movement = movementById[id]
  return (
    <span className="review-movement">
      <span className="review-movement__dot" style={{ background: movement.accent }} aria-hidden="true" />
      {movement.name}
    </span>
  )
}

// Sort: the movement picked, and the answer if the pick was wrong
function SortAnswers({ painting, answer, isRight }) {
  return (
    <dl className="review-item__answers">
      <div>
        <dt>Your pick</dt>
        <dd>{answer ? <MovementName id={answer} /> : 'None'}</dd>
      </div>
      {!isRight && (
        <div>
          <dt>Answer</dt>
          <dd>
            <MovementName id={painting.movement} />
          </dd>
        </div>
      )}
    </dl>
  )
}

// Identify: the best attempt at each of the three fields, with its note
function IdentifyAnswers({ answer }) {
  const fields = [
    ['title', 'Title'],
    ['artist', 'Artist'],
    ['movement', 'Movement'],
  ]
  return (
    <div className="review-item__fields">
      {fields.map(([name, label], i) => (
        <ResultRow key={name} label={label} typed={answer.inputs[name]} grade={answer.grades[name]} index={i} />
      ))}
    </div>
  )
}

export default function ReviewScreen({ mode, results, onStudyAnother, onReviewMissed }) {
  const headingRef = useRef(null)
  const correct = results.filter((r) => r.correct).length
  const missed = results.length - correct

  // Arriving on a new screen, move focus to its heading so screen reader
  // users hear where they are, as they would on a new page
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <main className="screen review">
      <header className="review__header">
        <h1 ref={headingRef} tabIndex={-1} className="review__title">
          Your round
        </h1>
        <span className="review__rule" aria-hidden="true" />
        {/* Information in a museum's voice, not a game score */}
        <p className="review__summary">
          {mode === 'identify'
            ? `You named ${correct} of ${results.length} in full.`
            : `You placed ${correct} of ${results.length} correctly.`}
        </p>
      </header>

      <ol className="review__list">
        {results.map(({ painting, answer, correct: isRight }, i) => {
          const size = imageSizes[painting.id]
          return (
            <li key={painting.id} className="review-item glass" style={{ animationDelay: `${i * 50}ms` }}>
              <img
                className="review-item__thumb"
                src={smallestImage(painting)}
                width={size.width}
                height={size.height}
                alt=""
                loading="lazy"
              />
              <div className="review-item__body">
                <div className="review-item__heading">
                  <h2 className="review-item__title">{painting.title}</h2>
                  <StatusBadge status={isRight ? 'correct' : 'not-quite'} />
                </div>
                <p className="review-item__artist">{painting.artist.full}</p>
                {mode === 'identify' ? (
                  <IdentifyAnswers answer={answer} />
                ) : (
                  <SortAnswers painting={painting} answer={answer} isRight={isRight} />
                )}
                {/* The description waits behind a click, so the list stays calm */}
                <details className="review-item__label">
                  <summary>Read the label</summary>
                  <p>{painting.explanation}</p>
                </details>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="review__actions">
        <NextButton onClick={onStudyAnother}>Study another round</NextButton>
        {missed > 0 && (
          <button type="button" className="quiet-button" onClick={onReviewMissed}>
            Review the {missed === 1 ? 'one' : `${missed}`} I missed
          </button>
        )}
      </div>
    </main>
  )
}
