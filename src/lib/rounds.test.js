// Automatic checks that rounds are always fair.
//
// Used by: `npm run test`.
// Why it exists: an unfair round is easy to miss by playing. A round that
// skips Rococo now and then, or a shuffle that favors some orders, looks fine
// in any single game. These tests deal thousands of rounds and check every one.

import { describe, expect, it } from 'vitest'
import movements from '../data/movements.js'
import paintings from '../data/paintings.js'
import { dealFrom, dealRound, shuffle } from './rounds.js'

// A small made-up collection for edge cases
const tiny = [
  { id: 'a', movement: 'rococo' },
  { id: 'b', movement: 'rococo' },
  { id: 'c', movement: 'romantic' },
  { id: 'd', movement: 'realist' },
]

describe('shuffle', () => {
  it('keeps every item exactly once and leaves the original list alone', () => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8]
    const copy = [...list]
    const result = shuffle(list)
    expect([...result].sort((a, b) => a - b)).toEqual(copy)
    expect(list).toEqual(copy)
  })

  it('makes every order equally likely', () => {
    // Shuffle three items 60,000 times. There are six possible orders, so
    // each should appear close to 10,000 times. The original game's shortcut
    // fails this badly.
    const counts = {}
    const trials = 60000
    for (let i = 0; i < trials; i++) {
      const key = shuffle(['a', 'b', 'c']).join('')
      counts[key] = (counts[key] ?? 0) + 1
    }
    expect(Object.keys(counts)).toHaveLength(6)
    for (const count of Object.values(counts)) {
      expect(count).toBeGreaterThan(trials / 6 * 0.95)
      expect(count).toBeLessThan(trials / 6 * 1.05)
    }
  })
})

describe('dealRound', () => {
  it('always deals 8 different paintings covering all five movements', () => {
    for (let i = 0; i < 1000; i++) {
      const round = dealRound(paintings)
      expect(round).toHaveLength(8)
      expect(new Set(round.map((p) => p.id)).size).toBe(8)
      for (const movement of movements) {
        expect(round.some((p) => p.movement === movement.id)).toBe(true)
      }
    }
  })

  it('gives every painting a chance to appear', () => {
    const seen = new Set()
    for (let i = 0; i < 2000; i++) for (const p of dealRound(paintings)) seen.add(p.id)
    expect(seen.size).toBe(paintings.length)
  })

  it('deals the whole pool when it is smaller than the round', () => {
    const round = dealRound(tiny, 8)
    expect(round).toHaveLength(4)
    expect(new Set(round.map((p) => p.id))).toEqual(new Set(['a', 'b', 'c', 'd']))
  })

  it('covers as many movements as fit in a short round', () => {
    for (let i = 0; i < 200; i++) {
      const round = dealRound(tiny, 3)
      expect(round).toHaveLength(3)
      expect(new Set(round.map((p) => p.movement)).size).toBe(3)
    }
  })

  it('skips a movement that has no paintings', () => {
    const round = dealRound(tiny, 3)
    expect(round.every((p) => ['rococo', 'romantic', 'realist'].includes(p.movement))).toBe(true)
  })

  it('handles an empty collection', () => {
    expect(dealRound([], 8)).toEqual([])
  })
})

describe('dealFrom', () => {
  it('deals only the chosen paintings and skips unknown ids', () => {
    const round = dealFrom(tiny, ['d', 'a', 'gone'])
    expect(round.map((p) => p.id).sort()).toEqual(['a', 'd'])
  })
})
