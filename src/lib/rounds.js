// Fair shuffling and dealing: decides which paintings a round contains and
// in what order.
//
// Used by: the Sort screen (and later Identify) at the start of every round,
// and the "Review the ones I missed" button.
// Why it exists as its own file: these are the rules of the game, not its
// appearance. Kept apart from the screens, they can be tested automatically
// (see rounds.test.js) by dealing thousands of rounds in a fraction of a
// second and checking every one.
//
// Every function takes an optional `random` argument. In the app it is
// Math.random. Tests can pass their own to make results repeatable.

// Fisher-Yates shuffle: walk backward through the list, swapping each item
// with a randomly chosen item at or before it. Every possible order is equally
// likely. The original game sorted with `() => Math.random() - 0.5`, a common
// shortcut that is biased: some orders come up far more often than others.
// Returns a new array and leaves the original alone.
export function shuffle(items, random = Math.random) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Deal a round: one painting from every movement first, so a round always
// covers all five, then fill the remaining places from everything left, with
// no painting twice. The final order is shuffled so the guaranteed paintings
// aren't always first.
//
// If the pool is smaller than the round, the round is just the whole pool.
// If the round is smaller than the number of movements, it covers as many
// different movements as it has room for.
export function dealRound(paintings, size = 8, random = Math.random) {
  const byMovement = new Map()
  for (const painting of paintings) {
    if (!byMovement.has(painting.movement)) byMovement.set(painting.movement, [])
    byMovement.get(painting.movement).push(painting)
  }

  // Shuffle the movements too, so a short round doesn't always favor the
  // movements listed first
  const groups = shuffle([...byMovement.values()], random)
  const chosen = groups.slice(0, size).map((group) => group[Math.floor(random() * group.length)])

  const rest = shuffle(
    paintings.filter((p) => !chosen.includes(p)),
    random,
  )
  const round = [...chosen, ...rest.slice(0, Math.max(0, size - chosen.length))]

  return shuffle(round, random)
}

// Deal a round from a chosen set of paintings, such as the ones a student
// missed, in a fresh random order. Ids that no longer exist are skipped.
export function dealFrom(paintings, ids, random = Math.random) {
  const wanted = new Set(ids)
  return shuffle(
    paintings.filter((p) => wanted.has(p.id)),
    random,
  )
}
