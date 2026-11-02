// Automatic checks for when the header hides and returns.
//
// Used by: `npm run test`.

import { describe, expect, it } from 'vitest'
import { shouldHide } from './useHideOnScroll.js'

describe('shouldHide', () => {
  it('hides when scrolling down past the top of the page', () => {
    expect(shouldHide(false, 300, 400)).toBe(true)
  })

  it('returns when scrolling up', () => {
    expect(shouldHide(true, 400, 300)).toBe(false)
  })

  it('always shows near the top of the page', () => {
    expect(shouldHide(true, 200, 100)).toBe(false)
    expect(shouldHide(false, 0, 80)).toBe(false)
  })

  it('ignores tiny scrolls, so it never flickers', () => {
    expect(shouldHide(true, 400, 397)).toBe(true)
    expect(shouldHide(false, 400, 403)).toBe(false)
  })
})
