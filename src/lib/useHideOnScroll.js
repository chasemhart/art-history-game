// Hide on scroll: tells the header when to slide away and when to return.
//
// Used by: the Header, so it gets out of the way while you read down a page
// and comes back the moment you scroll up.
// Why it exists as its own file: the rule is simple to say but easy to get
// subtly wrong (a header that flickers on tiny scrolls, or vanishes at the
// very top of the page). Written as a small pure function, the rule can be
// tested on its own; the hook below only connects it to the browser.

import { useEffect, useState } from 'react'

// Ignore scrolls smaller than this, so a trembling trackpad or a slow finger
// doesn't make the header flicker
const JITTER = 6

// Decide whether the header should be hidden, given where the page was and
// where it is now. Near the top of the page it always shows.
export function shouldHide(wasHidden, lastY, y, revealZone = 120) {
  if (y <= revealZone) return false
  if (Math.abs(y - lastY) < JITTER) return wasHidden
  return y > lastY // scrolling down hides it; scrolling up brings it back
}

export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let waiting = false

    // Scroll events can fire many times per frame; checking once per frame
    // (requestAnimationFrame) is plenty and keeps scrolling smooth
    function onScroll() {
      if (waiting) return
      waiting = true
      requestAnimationFrame(() => {
        waiting = false
        const y = window.scrollY
        // Capture the previous position now: React may run the update below
        // later, after lastY has already moved on
        const previousY = lastY
        setHidden((wasHidden) => shouldHide(wasHidden, previousY, y))
        if (Math.abs(y - previousY) >= JITTER) lastY = y
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return hidden
}
