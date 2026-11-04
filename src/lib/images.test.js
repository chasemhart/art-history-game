// Automatic checks that every painting has its optimized web images.
//
// Used by: `npm run test`.
// Why it exists: after adding a painting to paintings.js, it's easy to forget
// to run `npm run images`. Without these checks the app would only break when
// that painting came up in a round. This test fails right away and says what
// to run.

import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import paintings from '../data/paintings.js'
import { paintingImage } from './images.js'

const publicFolder = fileURLToPath(new URL('../../public', import.meta.url))

describe('paintingImage', () => {
  it.each(paintings.map((p) => [p.id, p]))('%s has web images (if not, run npm run images)', (_id, painting) => {
    const image = paintingImage(painting)
    expect(existsSync(publicFolder + image.src)).toBe(true)
    for (const candidate of image.srcSet.split(', ')) {
      const [path, width] = candidate.split(' ')
      expect(existsSync(publicFolder + path), path).toBe(true)
      expect(width).toMatch(/^\d+w$/)
    }
    expect(image.width).toBeGreaterThan(0)
    expect(image.height).toBeGreaterThan(0)
  })

  it('explains what to do when a painting has no web images', () => {
    expect(() => paintingImage({ id: 'not-a-painting' })).toThrow('npm run images')
  })
})
