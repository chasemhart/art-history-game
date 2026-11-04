// Group sort state ("All at once"): eight works on the wall, which room each
// one hangs in, which work the student has lifted, and whether the set has
// been checked.
//
// Used by: the All at once screen (#/sort/all), the Sort tab's second view.
// Why it exists as its own file: the rules of the set (each work hangs in
// exactly one place, nothing moves once checked, a check needs all eight
// hung) are logic, not layout. As a reducer they can be tested without
// drawing anything, the same way the single-painting round is (round.js).

import { useMemo, useReducer } from 'react'
import { isCorrectMovement } from './round.js'
import { dealRound } from './rounds.js'

export const GROUP_SIZE = 8

export function startGroup(paintings, random = Math.random) {
  return {
    paintings: dealRound(paintings, GROUP_SIZE, random),
    // placements maps a painting id to the movement id of the room it hangs
    // in. A work missing from it is still on the wall.
    placements: {},
    // The work the student has tapped to lift, waiting for a room
    selected: null,
    checked: false,
  }
}

export function groupSortReducer(state, action) {
  // Once checked, the set is a record of what the student did: nothing moves
  if (state.checked && action.type !== 'deal') return state

  switch (action.type) {
    case 'select':
      // Tapping the lifted work again puts it down
      return { ...state, selected: state.selected === action.id ? null : action.id }
    case 'place': {
      // One place per work: hanging it in a room replaces wherever it was, so
      // the original game's "10 / 8" double-scoring can't happen here
      const placements = { ...state.placements }
      if (action.movementId) placements[action.id] = action.movementId
      else delete placements[action.id] // back to the wall
      return { ...state, placements, selected: null }
    }
    case 'check':
      // A set is checked only when every work is hung
      if (Object.keys(state.placements).length < state.paintings.length) return state
      return { ...state, checked: true, selected: null }
    case 'deal':
      return startGroup(action.paintings, action.random)
    default:
      throw new Error(`Unknown group sort action: ${action.type}`)
  }
}

// One row per work: where it hangs, and whether that's the right room
export function groupResults(state) {
  return state.paintings.map((painting) => {
    const placed = state.placements[painting.id] ?? null
    return { painting, placed, correct: placed !== null && isCorrectMovement(painting, placed) }
  })
}

export function useGroupSort(paintings) {
  const [group, dispatch] = useReducer(groupSortReducer, paintings, startGroup)
  return useMemo(() => {
    const results = groupResults(group)
    const hung = results.filter((r) => r.placed !== null).length
    return {
      ...group,
      results,
      hung,
      total: group.paintings.length,
      allHung: hung === group.paintings.length,
      correctCount: results.filter((r) => r.correct).length,
      select: (id) => dispatch({ type: 'select', id }),
      place: (id, movementId) => dispatch({ type: 'place', id, movementId }),
      check: () => dispatch({ type: 'check' }),
      dealAgain: () => dispatch({ type: 'deal', paintings }),
    }
  }, [group, paintings])
}
