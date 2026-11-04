// Automatic checks for reading screen names from the web address.
//
// Used by: `npm run test`.

import { describe, expect, it } from 'vitest'
import { modeOf, parseRoute } from './useHashRoute.js'

describe('parseRoute', () => {
  it.each([
    ['#/sort', 'sort'],
    ['#/identify', 'identify'],
    ['#/review', 'review'],
    ['#identify', 'identify'],
    ['#/review?round=2', 'review'],
    ['#/identify/review', 'identify/review'],
    ['#/sort/all', 'sort/all'],
    ['#/identify/nowhere', 'identify'],
    ['#/identify/', 'identify'],
  ])('reads %s as %s', (hash, route) => {
    expect(parseRoute(hash)).toBe(route)
  })

  it.each(['', '#', '#/', '#/nowhere', '#/Sort'])('falls back to Sort for "%s"', (hash) => {
    expect(parseRoute(hash)).toBe('sort')
  })
})

describe('modeOf', () => {
  it.each([
    ['sort', 'sort'],
    ['review', 'sort'],
    ['sort/all', 'sort'],
    ['identify', 'identify'],
    ['identify/review', 'identify'],
  ])('puts %s under the %s tab', (route, mode) => {
    expect(modeOf(route)).toBe(mode)
  })
})
