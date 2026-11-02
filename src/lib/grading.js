// Grading typed answers: decides whether what a student typed for a title,
// an artist, or a movement counts as right.
//
// Used by: the Identify screen, when the student checks their answers.
// Why it exists as its own file: grading is the most rule-heavy part of the
// app, and the rules have to be fair in both directions. A small typo
// ("Gericalt") should still earn credit, but a different answer ("Monet" for
// Manet) must not. Kept as pure functions (text in, verdict out, with no
// screen and no network), every rule is checked by the examples in
// grading.test.js.
//
// Every grade comes back as { status, note }:
// - status: 'correct', 'close' (titles only: on the right track), or 'not-quite'
// - note: a short line to show beneath the answer, or null

// ---------- Making answers comparable ----------

// Turn any answer into a plain, comparable form: no accents, lowercase, no
// punctuation, single spaces. "Géricault" and "gericault" both become
// "gericault"; "Neo-Classical" becomes "neo classical".
export function normalize(text = '') {
  return text
    .normalize('NFD') // split "é" into "e" plus a separate accent mark...
    .replace(/[̀-ͯ]/g, '') // ...then drop the accent marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// How many single-letter edits (add, remove, or change a letter) turn one
// word into another. "gericalt" to "gericault" is 1: add a "u". This is the
// Levenshtein distance, a standard measure of how close two spellings are.
export function editDistance(a, b) {
  // Only the previous row of the comparison table is needed at each step
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const change = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + change)
    }
    previous = current
  }
  return previous[b.length]
}

// ---------- How many typos to forgive ----------

// Names: one slip in a short name, two in a longer one
function nameTolerance(answer) {
  return answer.length <= 6 ? 1 : 2
}

// Titles: the allowance grows with length. A flat allowance of three would
// accept "both" for "Bath"; very short titles must be spelled exactly.
function titleTolerance(answer) {
  if (answer.length <= 4) return 0
  if (answer.length <= 8) return 1
  if (answer.length <= 15) return 2
  return 3
}

// ---------- The shared rule ----------

// Compare one typed answer against the accepted answers and against every
// *other* answer in the collection. A near-miss earns credit only if it is
// nearer to this answer than to any other one, so "Monet" (exactly another
// artist) never passes as a misspelled "Manet".
function matchAgainst(typed, accepted, others, tolerance) {
  if (accepted.includes(typed)) return 'exact'
  if (others.includes(typed)) return 'other'
  const distanceTo = (list) => Math.min(Infinity, ...list.map((answer) => editDistance(typed, answer)))
  const nearest = distanceTo(accepted)
  const withinReach = accepted.some((answer) => editDistance(typed, answer) <= tolerance(answer))
  return withinReach && nearest < distanceTo(others) ? 'near' : 'none'
}

const grade = (status, note = null) => ({ status, note })

// ---------- Artists ----------

// Every way of naming one artist: last name, full name, and listed spellings
function artistNames(painting) {
  return [normalize(painting.artist.last), normalize(painting.artist.full), ...painting.artistAccepted]
}

export function gradeArtist(input, painting, paintings) {
  const answer = painting.artist.last
  const typed = normalize(input)
  if (!typed) return grade('not-quite', `Answer: ${answer}`)

  const accepted = artistNames(painting)
  const others = paintings.filter((p) => p.artist.last !== painting.artist.last).flatMap(artistNames)
  const match = matchAgainst(typed, accepted, others, nameTolerance)
  if (match === 'exact') return grade('correct')
  if (match === 'near') return grade('correct', `Spelled ${answer}`)
  return grade('not-quite', `Answer: ${answer}`)
}

// ---------- Movements ----------

export function gradeMovement(input, painting, movements) {
  const movement = movements.find((m) => m.id === painting.movement)
  const typed = normalize(input)
  if (!typed) return grade('not-quite', `Answer: ${movement.name}`)

  // A work that sits between two movements accepts either (alsoAccept)
  const ids = [painting.movement, ...(painting.alsoAccept ?? [])]
  const accepted = movements.filter((m) => ids.includes(m.id)).flatMap((m) => m.accepted)
  const others = movements.filter((m) => !ids.includes(m.id)).flatMap((m) => m.accepted)
  const match = matchAgainst(typed, accepted, others, nameTolerance)
  if (match === 'exact') return grade('correct')
  if (match === 'near') return grade('correct', `Spelled ${movement.name}`)
  return grade('not-quite', `Answer: ${movement.name}`)
}

// ---------- Titles ----------

// Students often drop or add a leading article ("Raft of the Medusa"), and
// French titles begin with "le", "la", or "les". None of them should matter.
const LEADING_ARTICLE = /^(the|a|an|le|la|les|un|une|el) /

function titleKey(text) {
  return normalize(text).replace(LEADING_ARTICLE, '')
}

function titleForms(painting) {
  return [titleKey(painting.title), ...painting.titleAccepted.map(titleKey)]
}

// Words too common to show the student was thinking of a particular painting
const STOPWORDS = new Set(['the', 'and', 'with', 'from', 'into', 'over', 'under', 'above', 'what', 'called', 'that', 'this', 'their'])

function wordsOf(text) {
  return text.split(' ').filter((word) => word.length >= 4 && !STOPWORDS.has(word))
}

// A title's distinctive words: words of four or more letters that appear in
// no other painting's title. "medusa" points to one painting; "death" appears
// in two titles, so it points to neither. Worked out from the data, so it stays
// right as Chase adds paintings.
function distinctiveWords(painting, paintings) {
  const elsewhere = new Set(paintings.filter((p) => p !== painting).flatMap((p) => titleForms(p).flatMap(wordsOf)))
  return new Set(titleForms(painting).flatMap(wordsOf).filter((word) => !elsewhere.has(word)))
}

export function gradeTitle(input, painting, paintings) {
  const answer = painting.title
  const typed = titleKey(input)
  if (!typed) return grade('not-quite', `Answer: ${answer}`)

  const others = paintings.filter((p) => p !== painting).flatMap(titleForms)
  const match = matchAgainst(typed, titleForms(painting), others, titleTolerance)
  if (match === 'exact') return grade('correct')
  if (match === 'near') return grade('correct', `Spelled ${answer}`)
  // Naming a different work is a miss, even if it shares words with this one
  if (match === 'other') return grade('not-quite', `Answer: ${answer}`)

  // On the right track: the answer contains a word that only this title has
  const distinctive = distinctiveWords(painting, paintings)
  if (wordsOf(typed).some((word) => distinctive.has(word))) return grade('close', `Nearly: ${answer}`)
  return grade('not-quite', `Answer: ${answer}`)
}

// ---------- All three at once ----------

export function gradeIdentify({ title, artist, movement }, painting, paintings, movements) {
  return {
    title: gradeTitle(title, painting, paintings),
    artist: gradeArtist(artist, painting, paintings),
    movement: gradeMovement(movement, painting, movements),
  }
}
