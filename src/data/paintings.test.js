// Automatic checks for the painting and movement data.
//
// Used by: `npm run test`, which runs every file ending in .test.js.
// Why it exists: paintings.js is the file Chase edits most often, and a small
// slip (a misspelled movement id, an image name with a typo, an accepted
// answer with a capital letter) would not show up as an error. The painting
// would quietly never be gradeable or never appear. These checks catch those
// slips the moment the tests run.

import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import movements, { movementById } from './movements.js'
import paintings from './paintings.js'

// Image file names in the data refer to Chase's originals in public/images/
const originalsFolder = fileURLToPath(new URL('../../public/images/', import.meta.url))

// Accepted answers must already be normalized: lowercase letters and digits,
// single spaces between words. Grading normalizes what students type the same
// way, so an entry like "Raft of the Médusa" here could never match anything.
const NORMALIZED = /^[a-z0-9]+( [a-z0-9]+)*$/

// Ids appear in web addresses and image file names: lowercase words and hyphens
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

const each = paintings.map((p) => [p.id, p])

describe('movements', () => {
  it('lists the five exam movements', () => {
    expect(movements.map((m) => m.name)).toEqual([
      'Rococo',
      'Neo-Classical',
      'Romantic',
      'Realist',
      'Impressionist',
    ])
  })

  it.each(movements.map((m) => [m.name, m]))('%s has normalized accepted answers', (_name, movement) => {
    expect(movement.accepted.length).toBeGreaterThan(0)
    for (const answer of movement.accepted) expect(answer).toMatch(NORMALIZED)
  })
})

describe('painting data', () => {
  it('has unique ids', () => {
    const ids = paintings.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes every movement at least once, so a round can cover all five', () => {
    for (const movement of movements) {
      expect(
        paintings.some((p) => p.movement === movement.id),
        `no ${movement.name} paintings`,
      ).toBe(true)
    }
  })

  it.each(each)('%s has every required field', (_id, painting) => {
    expect(painting.id).toMatch(SLUG)
    for (const text of [painting.title, painting.artist.full, painting.artist.last, painting.medium, painting.explanation]) {
      expect(text).toBeTypeOf('string')
      expect(text.trim()).not.toBe('')
    }
    // A year may be left empty (null) until it is confirmed, but not blank
    if (painting.year !== null) expect(painting.year.trim()).not.toBe('')
    // The original's "Title by Artist" format is retired: the label shows the artist separately
    expect(painting.title).not.toMatch(/ by [A-Z]/)
  })

  it.each(each)('%s is filed under a real movement', (_id, painting) => {
    expect(movementById).toHaveProperty(painting.movement)
    for (const extra of painting.alsoAccept ?? []) expect(movementById).toHaveProperty(extra)
  })

  it.each(each)('%s has normalized accepted answers', (_id, painting) => {
    for (const answer of [...painting.titleAccepted, ...painting.artistAccepted]) {
      expect(answer).toMatch(NORMALIZED)
    }
  })

  it.each(each)('%s points to an image that exists and has alt text', (_id, painting) => {
    expect(existsSync(originalsFolder + painting.image.original), `no file public/images/${painting.image.original}`).toBe(true)
    expect(painting.image.alt.trim().length).toBeGreaterThan(20)
  })

  it.each(each)("%s alt text doesn't give away the movement", (_id, painting) => {
    // Alt text is read aloud before the student answers, so naming the
    // movement there would hand screen reader users the answer
    const alt = painting.image.alt.toLowerCase()
    for (const movement of movements) {
      for (const word of movement.accepted) expect(alt).not.toContain(word)
    }
  })
})
