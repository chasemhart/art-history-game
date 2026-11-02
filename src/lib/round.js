// Round state: which paintings are in the current round, which one the
// student is looking at, and what they answered for each.
//
// Used by: App.jsx keeps one round per study mode (Sort and Identify each
// have their own) and hands it to that mode's screen, the header (progress),
// and the review screen (results).
// Why it exists as its own file: the rules of a round (when an answer can
// change, no moving on before answering, which answers count) are logic, not
// layout. Written as a reducer, a function that takes the current state and
// an action and returns the new state, every rule can be tested without
// drawing anything.

import { useMemo, useReducer } from 'react'
import { dealFrom, dealRound } from './rounds.js'

export const ROUND_SIZE = 8

// ---------- What counts as right in each mode ----------

// Sort: a painting counts as correct under its own movement, or under any
// extra movement listed in alsoAccept (for works between two movements)
export function isCorrectMovement(painting, movementId) {
  return painting.movement === movementId || (painting.alsoAccept ?? []).includes(movementId)
}

// Identify: right only when title, artist, and movement are all correct
export function isFullyIdentified(_painting, answer) {
  return Object.values(answer.grades).every((g) => g.status === 'correct')
}

// Ranks a grade so two attempts can be compared: correct beats close beats not quite
const RANK = { 'not-quite': 0, close: 1, correct: 2 }

// Identify keeps each field's best result across attempts (Owen's decision:
// "Try again" can turn a miss into a pass), and remembers what was typed then
function keepBest(previous, attempt) {
  if (!previous) return attempt
  const best = { inputs: { ...previous.inputs }, grades: { ...previous.grades } }
  for (const field of Object.keys(attempt.grades)) {
    if (RANK[attempt.grades[field].status] > RANK[previous.grades[field].status]) {
      best.grades[field] = attempt.grades[field]
      best.inputs[field] = attempt.inputs[field]
    }
  }
  return best
}

// ---------- The reducer ----------

function freshRound(paintings) {
  // answers maps a painting id to what the student answered for it
  return { paintings, index: 0, answers: {} }
}

export function startRound(paintings, random = Math.random) {
  return freshRound(dealRound(paintings, ROUND_SIZE, random))
}

export function roundReducer(state, action) {
  const current = state.paintings[state.index]
  switch (action.type) {
    case 'answer':
      // Sort: one answer per painting. The original game let a second drop
      // score the same painting again ("10 / 8"); here a repeat is ignored.
      if (!current || state.answers[current.id]) return state
      return { ...state, answers: { ...state.answers, [current.id]: action.answer } }
    case 'attempt':
      // Identify: each "Check answers" is an attempt, and the best one stands
      if (!current) return state
      return { ...state, answers: { ...state.answers, [current.id]: keepBest(state.answers[current.id], action.attempt) } }
    case 'next':
      // No moving on before answering, and no running past the last painting
      if (!current || !state.answers[current.id]) return state
      return { ...state, index: Math.min(state.index + 1, state.paintings.length - 1) }
    case 'deal':
      return startRound(action.paintings, action.random)
    case 'dealFrom':
      return freshRound(dealFrom(action.paintings, action.ids, action.random))
    default:
      throw new Error(`Unknown round action: ${action.type}`)
  }
}

// The results of a round, one row per painting, in the order they were shown
export function roundResults(state, isRight) {
  return state.paintings.map((painting) => {
    const answer = state.answers[painting.id] ?? null
    return { painting, answer, correct: answer !== null && isRight(painting, answer) }
  })
}

// ---------- The hook screens use ----------

// isRight says what counts as correct in this mode (see the two rules above)
export function useRound(paintings, isRight) {
  const [round, dispatch] = useReducer(roundReducer, paintings, startRound)
  // useMemo hands screens the same object until the round actually changes,
  // so they don't redo work (like re-attaching keyboard listeners) for nothing
  return useMemo(() => {
    const current = round.paintings[round.index]
    const answer = round.answers[current.id] ?? null
    const results = roundResults(round, isRight)
    return {
      current,
      upNext: round.paintings[round.index + 1] ?? null,
      position: round.index + 1,
      total: round.paintings.length,
      isLast: round.index === round.paintings.length - 1,
      answer,
      isCorrect: answer !== null && isRight(current, answer),
      results,
      isFinished: results.every((r) => r.answer !== null),
      choose: (movementId) => dispatch({ type: 'answer', answer: movementId }),
      attempt: (attempt) => dispatch({ type: 'attempt', attempt }),
      next: () => dispatch({ type: 'next' }),
      dealAgain: () => dispatch({ type: 'deal', paintings }),
      dealMissed: () =>
        dispatch({
          type: 'dealFrom',
          paintings,
          ids: results.filter((r) => !r.correct).map((r) => r.painting.id),
        }),
    }
  }, [round, paintings, isRight])
}
