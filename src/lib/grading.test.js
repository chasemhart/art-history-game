// Automatic checks for grading typed answers.
//
// Used by: `npm run test`.
// Why it exists: grading has to be fair in both directions, forgiving honest
// typos without accepting different answers. Each example here is a real
// case a student could type, and several are the traps found by testing the
// first draft of the rules against the collection (Manet and Monet, the two
// "Death of" paintings, very short titles).

import { describe, expect, it } from 'vitest'
import movements from '../data/movements.js'
import paintings from '../data/paintings.js'
import { editDistance, gradeArtist, gradeIdentify, gradeMovement, gradeTitle, normalize } from './grading.js'

const byId = (id) => paintings.find((p) => p.id === id)
const raft = byId('the-raft-of-the-medusa')
const olympia = byId('olympia')
const marat = byId('the-death-of-marat')
const bath = byId('the-childs-bath')
const swing = byId('the-swing')
const folies = byId('a-bar-at-the-folies-bergere')

const status = (result) => result.status

describe('normalize', () => {
  it.each([
    ['Géricault', 'gericault'],
    ['  The  Raft of the Medusa! ', 'the raft of the medusa'],
    ['Neo-Classical', 'neo classical'],
    ["Le Déjeuner sur l'herbe", 'le dejeuner sur l herbe'],
    ['', ''],
  ])('turns "%s" into "%s"', (input, output) => {
    expect(normalize(input)).toBe(output)
  })
})

describe('editDistance', () => {
  it.each([
    ['gericalt', 'gericault', 1],
    ['manet', 'monet', 1],
    ['kitten', 'sitting', 3],
    ['', 'abc', 3],
    ['same', 'same', 0],
  ])('%s to %s is %i', (a, b, distance) => {
    expect(editDistance(a, b)).toBe(distance)
  })
})

describe('gradeArtist', () => {
  // The examples the original spec requires
  it.each(['Gericault', 'géricault', 'Géricault', 'Theodore Gericault'])('accepts "%s" for Géricault', (input) => {
    expect(status(gradeArtist(input, raft, paintings))).toBe('correct')
  })

  it('accepts a small typo, with a note showing the spelling', () => {
    expect(gradeArtist('Gericalt', raft, paintings)).toEqual({ status: 'correct', note: 'Spelled Géricault' })
  })

  it('rejects a different artist', () => {
    expect(gradeArtist('Monet', raft, paintings)).toEqual({ status: 'not-quite', note: 'Answer: Géricault' })
  })

  it('never accepts Monet for Manet, though they differ by one letter', () => {
    expect(status(gradeArtist('Monet', olympia, paintings))).toBe('not-quite')
    expect(status(gradeArtist('Manet', olympia, paintings))).toBe('correct')
  })

  it('still forgives a typo in Manet that points to no one else', () => {
    expect(gradeArtist('Mannet', olympia, paintings)).toEqual({ status: 'correct', note: 'Spelled Manet' })
  })

  it('treats a blank answer as not quite, and shows the answer', () => {
    expect(gradeArtist('   ', raft, paintings)).toEqual({ status: 'not-quite', note: 'Answer: Géricault' })
  })
})

describe('gradeMovement', () => {
  it.each(['Romantic', 'romanticism', 'ROMANTIC ERA'])('accepts "%s" for Romantic', (input) => {
    expect(status(gradeMovement(input, raft, movements))).toBe('correct')
  })

  it('accepts a small typo, with a note', () => {
    expect(gradeMovement('Romantc', raft, movements)).toEqual({ status: 'correct', note: 'Spelled Romantic' })
  })

  it('accepts Neo-Classical however it is written', () => {
    for (const input of ['Neo-Classical', 'neoclassical', 'Neoclassicism', 'neo classical']) {
      expect(status(gradeMovement(input, marat, movements))).toBe('correct')
    }
  })

  it('rejects a different movement and shows the answer', () => {
    expect(gradeMovement('Realism', raft, movements)).toEqual({ status: 'not-quite', note: 'Answer: Romantic' })
  })

  it('accepts an extra movement listed in alsoAccept', () => {
    const between = { ...folies, alsoAccept: ['impressionist'] }
    expect(status(gradeMovement('Impressionism', between, movements))).toBe('correct')
    expect(status(gradeMovement('Impressionism', folies, movements))).toBe('not-quite')
  })
})

describe('gradeTitle', () => {
  it.each(['The Raft of the Medusa', 'raft of the medusa', 'raft of medusa', 'Le Radeau de la Méduse'])(
    'accepts "%s" for The Raft of the Medusa',
    (input) => {
      expect(status(gradeTitle(input, raft, paintings))).toBe('correct')
    },
  )

  it('calls a distinctive word "close" and shows the full title', () => {
    expect(gradeTitle('medusa', raft, paintings)).toEqual({ status: 'close', note: 'Nearly: The Raft of the Medusa' })
  })

  it('accepts a small typo in a long title, with a note', () => {
    expect(gradeTitle('raft of the medussa', raft, paintings)).toEqual({ status: 'correct', note: 'Spelled The Raft of the Medusa' })
  })

  it('calls naming a different painting not quite, even when words overlap', () => {
    expect(status(gradeTitle('The Death of Socrates', marat, paintings))).toBe('not-quite')
  })

  it("doesn't treat a word shared by two titles as a clue", () => {
    expect(status(gradeTitle('death', marat, paintings))).toBe('not-quite')
    expect(status(gradeTitle('marat', marat, paintings))).toBe('close')
  })

  it('requires very short titles to be spelled exactly', () => {
    expect(status(gradeTitle('Bath', bath, paintings))).toBe('correct')
    expect(status(gradeTitle('Both', bath, paintings))).toBe('not-quite')
  })

  it('forgives one slip in a short title', () => {
    expect(status(gradeTitle('The Swung', swing, paintings))).toBe('correct')
  })

  it('treats a blank title as not quite, and shows the answer', () => {
    expect(gradeTitle('', raft, paintings)).toEqual({ status: 'not-quite', note: 'Answer: The Raft of the Medusa' })
  })
})

describe('gradeIdentify', () => {
  it('grades all three answers at once', () => {
    const result = gradeIdentify({ title: 'medusa', artist: 'Gericalt', movement: 'romanticism' }, raft, paintings, movements)
    expect(result.title.status).toBe('close')
    expect(result.artist).toEqual({ status: 'correct', note: 'Spelled Géricault' })
    expect(result.movement.status).toBe('correct')
  })

  it('accepts every painting\'s own title, artist, and movement', () => {
    for (const painting of paintings) {
      const movement = movements.find((m) => m.id === painting.movement)
      const result = gradeIdentify(
        { title: painting.title, artist: painting.artist.last, movement: movement.name },
        painting,
        paintings,
        movements,
      )
      expect([result.title.status, result.artist.status, result.movement.status], painting.id).toEqual(['correct', 'correct', 'correct'])
    }
  })
})
