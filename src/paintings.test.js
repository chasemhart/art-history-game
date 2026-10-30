// Automatic checks for the painting data in paintings.js.
//
// Used by: `npm run test`, which runs every file ending in .test.js.
// Why it exists: paintings.js is the file Chase edits most often, and a small
// slip (a misspelled movement, an image path with a typo) would not show up
// as an error. The painting would just quietly never appear in the right
// place. These checks catch those slips the moment the tests run.
//
// In M1 this file moves to src/data/ alongside paintings.js and grows to
// cover the new fields (artist, year, accepted answers).

import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import paintings from './paintings.js'

// The five movements on the final exam. A painting filed under anything else
// (say "Impressionism" instead of "Impressionist") would form its own sixth bin.
const MOVEMENTS = ['Rococo', 'Neo-Classical', 'Romantic', 'Realist', 'Impressionist']

// Image paths in the data start with /images/, which the browser reads from
// the public/ folder. Here we turn them into real file locations to check them.
const publicFolder = fileURLToPath(new URL('../public', import.meta.url))

describe('painting data', () => {
  it('has paintings to study', () => {
    expect(paintings.length).toBeGreaterThan(0)
  })

  it.each(paintings.map((p) => [p.title, p]))('%s has a title, movement, image, and explanation', (_title, painting) => {
    for (const field of ['title', 'movement', 'image', 'explanation']) {
      expect(painting[field], `missing ${field}`).toBeTypeOf('string')
      expect(painting[field].trim(), `empty ${field}`).not.toBe('')
    }
  })

  it.each(paintings.map((p) => [p.title, p]))('%s is filed under one of the five movements', (_title, painting) => {
    expect(MOVEMENTS).toContain(painting.movement)
  })

  it.each(paintings.map((p) => [p.title, p]))('%s points to an image file that exists', (_title, painting) => {
    expect(existsSync(publicFolder + painting.image), `no file at public${painting.image}`).toBe(true)
  })

  it('lists each painting only once', () => {
    const titles = paintings.map((p) => p.title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('includes every movement at least once, so a round can cover all five', () => {
    for (const movement of MOVEMENTS) {
      expect(paintings.some((p) => p.movement === movement), `no ${movement} paintings`).toBe(true)
    }
  })
})
