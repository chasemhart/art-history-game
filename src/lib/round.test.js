// Automatic checks for the rules of a round.
//
// Used by: `npm run test`.
// Why it exists: the original game's worst bug was a score that could be
// replayed past 8 out of 8. These tests pin down the rules that make that
// impossible: one answer per painting, and no moving on without answering.

import { describe, expect, it } from 'vitest'
import movements from '../data/movements.js'
import paintings from '../data/paintings.js'
import { ROUND_SIZE, isCorrectMovement, isFullyIdentified, roundReducer, roundResults, startRound } from './round.js'

// Answer the current painting, then move on
function answerAndNext(state, movementId) {
  return roundReducer(roundReducer(state, { type: 'answer', answer: movementId }), { type: 'next' })
}

describe('roundReducer', () => {
  it('starts a round of 8 at the first painting with no answers', () => {
    const round = startRound(paintings)
    expect(round.paintings).toHaveLength(ROUND_SIZE)
    expect(round.index).toBe(0)
    expect(round.answers).toEqual({})
  })

  it('records one answer per painting and ignores a second try', () => {
    let round = startRound(paintings)
    const first = round.paintings[0]
    round = roundReducer(round, { type: 'answer', answer: 'rococo' })
    round = roundReducer(round, { type: 'answer', answer: 'romantic' })
    expect(round.answers).toEqual({ [first.id]: 'rococo' })
  })

  it("doesn't move on until the current painting is answered", () => {
    const round = startRound(paintings)
    expect(roundReducer(round, { type: 'next' }).index).toBe(0)
  })

  it('moves through the round and stops at the last painting', () => {
    let round = startRound(paintings)
    for (let i = 0; i < 20; i++) round = answerAndNext(round, 'realist')
    expect(round.index).toBe(ROUND_SIZE - 1)
    expect(Object.keys(round.answers)).toHaveLength(ROUND_SIZE)
  })

  it('can never score more than the number of paintings', () => {
    // The original game's "10 / 8" bug, attempted on purpose
    let round = startRound(paintings)
    for (let i = 0; i < 50; i++) {
      round = roundReducer(round, { type: 'answer', answer: round.paintings[round.index].movement })
      if (i % 3 === 0) round = roundReducer(round, { type: 'next' })
    }
    const correct = roundResults(round, isCorrectMovement).filter((r) => r.correct).length
    expect(correct).toBeLessThanOrEqual(ROUND_SIZE)
  })

  it('deals a fresh round with no answers', () => {
    let round = answerAndNext(startRound(paintings), 'rococo')
    round = roundReducer(round, { type: 'deal', paintings })
    expect(round.index).toBe(0)
    expect(round.answers).toEqual({})
  })

  it('deals a round of only the chosen paintings', () => {
    const ids = [paintings[0].id, paintings[5].id]
    const round = roundReducer(startRound(paintings), { type: 'dealFrom', paintings, ids })
    expect(round.paintings.map((p) => p.id).sort()).toEqual([...ids].sort())
    expect(round.answers).toEqual({})
  })

  it('rejects an unknown action, so typos fail loudly', () => {
    expect(() => roundReducer(startRound(paintings), { type: 'nxet' })).toThrow('Unknown round action')
  })
})

describe('roundResults', () => {
  it('marks each painting correct or not, in the order shown', () => {
    let round = startRound(paintings)
    const [first, second] = round.paintings
    round = answerAndNext(round, first.movement)
    const wrong = movements.find((m) => m.id !== second.movement).id
    round = answerAndNext(round, wrong)
    const results = roundResults(round, isCorrectMovement)
    expect(results[0]).toMatchObject({ answer: first.movement, correct: true })
    expect(results[1].correct).toBe(false)
    expect(results[2]).toMatchObject({ answer: null, correct: false })
  })
})

describe('isCorrectMovement', () => {
  const between = { movement: 'realist', alsoAccept: ['impressionist'] }

  it("accepts the painting's own movement and any listed in alsoAccept", () => {
    expect(isCorrectMovement(between, 'realist')).toBe(true)
    expect(isCorrectMovement(between, 'impressionist')).toBe(true)
    expect(isCorrectMovement(between, 'romantic')).toBe(false)
    expect(isCorrectMovement({ movement: 'rococo' }, 'rococo')).toBe(true)
  })
})

describe('Identify attempts', () => {
  // One attempt: what was typed and how each field was graded
  const attempt = (title, artist, movement) => ({
    inputs: { title, artist, movement },
    grades: {
      title: { status: title, note: null },
      artist: { status: artist, note: null },
      movement: { status: movement, note: null },
    },
  })

  it('keeps the best result for each field across attempts', () => {
    let round = startRound(paintings)
    const id = round.paintings[0].id
    round = roundReducer(round, { type: 'attempt', attempt: attempt('correct', 'not-quite', 'close') })
    round = roundReducer(round, { type: 'attempt', attempt: attempt('not-quite', 'correct', 'not-quite') })
    const grades = round.answers[id].grades
    expect([grades.title.status, grades.artist.status, grades.movement.status]).toEqual(['correct', 'correct', 'close'])
  })

  it('remembers what was typed in the attempt that counted', () => {
    let round = startRound(paintings)
    const id = round.paintings[0].id
    round = roundReducer(round, { type: 'attempt', attempt: { ...attempt('not-quite', 'correct', 'correct'), inputs: { title: 'first', artist: 'a', movement: 'm' } } })
    round = roundReducer(round, { type: 'attempt', attempt: { ...attempt('correct', 'not-quite', 'not-quite'), inputs: { title: 'second', artist: 'b', movement: 'n' } } })
    expect(round.answers[id].inputs).toEqual({ title: 'second', artist: 'a', movement: 'm' })
  })

  it('counts a painting as identified only when all three fields are correct', () => {
    expect(isFullyIdentified(null, attempt('correct', 'correct', 'correct'))).toBe(true)
    expect(isFullyIdentified(null, attempt('correct', 'close', 'correct'))).toBe(false)
  })
})
