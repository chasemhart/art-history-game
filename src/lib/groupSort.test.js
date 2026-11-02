// Automatic checks for the rules of the group sort ("All at once").
//
// Used by: `npm run test`.
// Why it exists: the original sorting game let a work be scored twice. These
// tests pin down the rules that make that impossible here, and the ones that
// keep a checked wall from changing.

import { describe, expect, it } from 'vitest'
import movements from '../data/movements.js'
import paintings from '../data/paintings.js'
import { GROUP_SIZE, groupSortReducer, groupResults, startGroup } from './groupSort.js'

const act = (state, ...actions) => actions.reduce(groupSortReducer, state)
// Hang every work on the wall in its correct room
const hangAllCorrectly = (state) =>
  act(state, ...state.paintings.map((p) => ({ type: 'place', id: p.id, movementId: p.movement })))

describe('groupSortReducer', () => {
  it('deals eight different works covering all five movements, none hung yet', () => {
    const wall = startGroup(paintings)
    expect(wall.paintings).toHaveLength(GROUP_SIZE)
    expect(new Set(wall.paintings.map((p) => p.id)).size).toBe(GROUP_SIZE)
    for (const m of movements) expect(wall.paintings.some((p) => p.movement === m.id)).toBe(true)
    expect(wall.placements).toEqual({})
  })

  it('lifts a work on tap, and puts it down on a second tap', () => {
    const wall = startGroup(paintings)
    const id = wall.paintings[0].id
    expect(act(wall, { type: 'select', id }).selected).toBe(id)
    expect(act(wall, { type: 'select', id }, { type: 'select', id }).selected).toBe(null)
  })

  it('hangs a work in one room at a time, and can send it back to the wall', () => {
    const wall = startGroup(paintings)
    const id = wall.paintings[0].id
    let next = act(wall, { type: 'select', id }, { type: 'place', id, movementId: 'rococo' })
    expect(next.placements).toEqual({ [id]: 'rococo' })
    expect(next.selected).toBe(null)
    next = act(next, { type: 'place', id, movementId: 'romantic' })
    expect(next.placements).toEqual({ [id]: 'romantic' })
    next = act(next, { type: 'place', id, movementId: null })
    expect(next.placements).toEqual({})
  })

  it("won't check until every work is hung", () => {
    const wall = startGroup(paintings)
    const almost = act(wall, ...wall.paintings.slice(1).map((p) => ({ type: 'place', id: p.id, movementId: p.movement })))
    expect(act(almost, { type: 'check' }).checked).toBe(false)
    expect(act(hangAllCorrectly(wall), { type: 'check' }).checked).toBe(true)
  })

  it('freezes the set once checked', () => {
    const checked = act(hangAllCorrectly(startGroup(paintings)), { type: 'check' })
    const id = checked.paintings[0].id
    expect(act(checked, { type: 'place', id, movementId: null })).toBe(checked)
    expect(act(checked, { type: 'select', id })).toBe(checked)
  })

  it('can never score more than eight, however works are moved', () => {
    let wall = startGroup(paintings)
    for (let i = 0; i < 40; i++) {
      const p = wall.paintings[i % GROUP_SIZE]
      wall = act(wall, { type: 'place', id: p.id, movementId: p.movement })
    }
    wall = act(wall, { type: 'check' })
    expect(groupResults(wall).filter((r) => r.correct).length).toBe(GROUP_SIZE)
  })

  it('deals a fresh set, even after checking', () => {
    const checked = act(hangAllCorrectly(startGroup(paintings)), { type: 'check' })
    const fresh = act(checked, { type: 'deal', paintings })
    expect(fresh.checked).toBe(false)
    expect(fresh.placements).toEqual({})
  })
})

describe('groupResults', () => {
  it('marks each work right or wrong by its room', () => {
    const wall = startGroup(paintings)
    const [first, second] = wall.paintings
    const wrong = movements.find((m) => m.id !== second.movement).id
    const placed = act(wall, { type: 'place', id: first.id, movementId: first.movement }, { type: 'place', id: second.id, movementId: wrong })
    const results = groupResults(placed)
    expect(results[0]).toMatchObject({ placed: first.movement, correct: true })
    expect(results[1]).toMatchObject({ placed: wrong, correct: false })
    expect(results[2]).toMatchObject({ placed: null, correct: false })
  })
})
