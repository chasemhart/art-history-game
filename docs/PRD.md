# Art History Study: Product Requirements

Version 2, October 24, 2026. Owner: Owen Baucom. Course instructor: Chase Hart.

## 1. Vision

A study tool that treats the art with the respect a museum would, and treats students like visitors being taught how to look. Students practice exactly what their final exam asks: name the **title**, the **artist's last name**, and the **movement** of a painting. The interface is quiet so the painting can speak, and every visual element is placed deliberately to lead the eye in the right order.

Two experiences share one foundation:

- **Study** (Phase 1, branch `study-redesign`): calm, unscored practice. The definite next step.
- **Challenge** (branch `arcade`): the same practice with tasteful arcade scoring and a shared class leaderboard, styled like a museum outreach program rather than a video game. A proposal to show Chase.

## 2. The final exam (why the app asks what it asks)

From Chase: the final asks students to identify the title of the work, the last name of the artist, the name of the movement, and to write an analytical paragraph connecting details of the piece to its movement and historical context. Title, artist, and movement are the priority now. The analytical paragraph is a later phase.

## 3. Goals and non-goals

**Goals**
- Practice recall (typed answers), not only recognition (multiple choice).
- Works equally well on a phone, tablet, or laptop. Phone is the most likely study device.
- Fair, unexploitable behavior. Every known bug in the original is fixed.
- A visual design that is itself a teaching object: every choice has a reason that can be explained (see `DESIGN.md`).
- Chase can add or edit paintings by editing one data file, with no game code changes.
- No running costs for Study. Challenge's leaderboard stays within a free tier.

**Non-goals (for now)**
- Student accounts or logins.
- AI grading or any paid service.
- Art outside the syllabus.
- Anything drawn on top of the artwork itself: no composition overlays, no detail callouts, no annotations on the painting. The painting is always shown clean. (Owen's decision, October 24.)
- An instructor dashboard.

## 4. Phases and milestones

### Phase 1: Study (branch `study-redesign`)

| Milestone | Contents |
| --- | --- |
| M0 Setup | Fork exists, these docs committed, Vercel preview deploys working, Vitest installed. |
| M1 Foundation | Design tokens, layout shell and header, data model and enriched data, image pipeline, round dealing, hash routing, all original bugs fixed. |
| M2 Sort mode | The Sort screen, the zoom view, the round review screen. |
| M3 Identify mode | Typed answers with the grading engine, review screen. |
| M4 Polish | The gold path on every screen, movement colors, era lighting, motion and reduced motion, accessibility pass, phone QA. |

**Demo priority for Monday, October 26:** M1 plus M2 on a preview URL, with as much of M4's visual polish on the Sort screen as time allows. Identify is a bonus.

### Arcade branch (after Phase 1 M2 at minimum)

| Milestone | Contents |
| --- | --- |
| A1 Challenge play | Scoring, laurel streak, optional swift bonus, score chips. |
| A2 Round end | Score, rank, stats, initials entry with filter. |
| A3 Wall of Patrons | Shared leaderboard backed by a small database through a serverless API route. |

### Phase 2 (later, main line)

- Key terms per painting (Chase is tagging these), shown as study notes after each answer.
- Analytical paragraph practice: student writes a paragraph; the app shows which of Chase's key terms for that painting and movement they used. Rule-based, no AI.
- Detail-zoom and timeline modes are possible future ideas, not committed.

## 5. Screens and behavior

All screens share the header and the design language in `DESIGN.md`. Reference prototypes are in `docs/mockups/`.

### 5.1 Header (all screens)

- Floating frosted-glass bar, sticky near the top of the viewport.
- Left: wordmark "Art History Study".
- Center: mode tabs as a segmented control. Study branch: "Sort by movement" and "Identify". Arcade branch adds a top-level "Study / Challenge" switch.
- Right: "Painting N of 8" and a progress row of 8 ticks. Completed ticks are ink, the current tick is gold and wider, future ticks are faint.
- On phones the header compresses: wordmark and progress only; mode tabs move into a simple menu or a second row. Tap targets stay at least 44px.

### 5.2 Sort mode (Study)

Mockup: `docs/mockups/Modern-Sort.dc.html`.

One painting at a time, never a grid. The original eight-card grid is retired because it made each painting small, did not work on touch screens, and showed every answer's competition at once.

**Round setup**
- A round is 8 paintings dealt by `dealRound()` (see 7.3): every movement appears at least once, no repeats within a round, order shuffled fairly.

**Layout (desktop)**
- Left, large: the painting on the "wall", with the ambient glow, overhead gallery light, and gold corner marks (see `DESIGN.md`). The painting is a button that opens the zoom view. A small hint below: "Select the painting to view it larger."
- Right: the glass wall label (title in italic display serif, a short gold rule, artist, "Year · Medium"), then the question "Which movement?" with five answer buttons.
- Phone: the painting on top at full width, then the label, then the answers, stacked.

**Interaction**
- Tap or click a movement to answer. Dragging is not used.
- Optional keyboard shortcuts on desktop: keys 1 to 5 choose a movement, Enter or Right Arrow goes to the next painting. Shortcuts must not fire while focus is in a text field.
- After answering:
  - Answer buttons lock. The correct movement fills with ink from left to right. A wrong pick turns dashed in bronze with a small shake. The rest fade. Labels on the right side of buttons read "Your pick" or "Answer".
  - Verdict line: "Correct. This is Rococo." or "Not quite. This is Rococo."
  - The wall label expands: the movement name (in the movement's ink color, with the gold diamond) and Chase's description, opening with a drop capital.
  - The movement accent color and era lighting take effect now, never before (see `DESIGN.md`, section 7). Showing them before the answer would give it away.
  - A "Next painting" button appears.
- After the eighth painting, "Next painting" becomes "See your round" and goes to the review screen.

**Round review screen**
- Calm list of the eight paintings: thumbnail, title, artist, the student's pick, the answer, a correct or not-quite marker (shape and word, never color alone), and the description collapsed behind "Read the label".
- Summary line at the top in museum voice, not a score: "You placed 6 of 8 correctly." Allowed because it is information, not a game score.
- Buttons: "Study another round" and "Review the ones I missed" (deals a round from missed paintings only; hidden if none were missed).

### 5.3 Zoom view

- Opens when the painting is selected. A frosted scrim covers the page; the painting appears large with a glass caption pill: italic title, artist, year.
- Closes on the close button, a click on the scrim, or the Escape key. Focus moves into the dialog on open and back to the painting on close.
- No overlays on the image.

### 5.4 Identify mode (Study)

Mockup: `docs/mockups/Modern-Phone.dc.html` (phone layout; desktop follows the Sort layout with the form in the right column).

- One painting at a time, same round dealing, same header.
- The wall label is hidden until grading; the painting appears alone.
- Prompt: "Name this work". Three labeled text fields: **Title**, **Artist's last name**, **Movement**. Then "Check answers".
- Grading (section 7.4) returns a status per field: **Correct**, **Close**, or **Not quite**, each with a short note when helpful ("Spelled Géricault", "Nearly: The Raft of the Medusa", "Answer: Romantic"). Status is shown with shape, icon, and word, never color alone. Rows appear one after another in reading order.
- After grading: the full wall label appears (title, artist, year, movement, description) with the same reveal treatment as Sort.
- Buttons: "Try again" (clears the fields for this painting) and "Next".
- A difficulty switch (Guided / Recall) is allowed but not required for Phase 1: Guided replaces the Movement text field with the five movement buttons.
- Round review: same as Sort review, showing each field's result.

### 5.5 Challenge mode (arcade branch only)

Mockups: `docs/mockups/Challenge-Play.dc.html`, `docs/mockups/Challenge-End.dc.html`.

Same Sort interaction with a scoring layer. The design must stay as quiet as Study; scoring is information placed in the header and in small chips, not effects that compete with the painting.

**Scoring**
- Correct answer: 100 points × laurel multiplier.
- Laurel (streak): consecutive correct answers. Multiplier = 1 + 0.25 × min(streak − 1, 4), so ×1, ×1.25, ×1.5, ×1.75, ×2 (cap). A miss resets the laurel to 0. **A miss never subtracts points.**
- Swift bonus (optional, on by default, switchable in a settings menu and as a build constant): full 50 points if answered within 15 seconds, linear fade to 0 at 45 seconds, rounded to the nearest 5. Not multiplied. Shown as a thin gold line under the painting that holds full for 15 seconds, then drains. It pauses when the student answers. Must be generous: Owen is undecided about keeping it, so it must be trivially removable.
- After each correct answer, chips appear in order: "+100 Correct", "×1.5 Laurel" (if above ×1), "+35 Swift" (if above 0), then a dark total chip "+185 this painting". After a miss: "Your laurel resets. No points are lost."
- Header shows the score in display numerals (with a brief pulse when it increases), the laurel icon with the current multiplier and "N in a row", and progress.
- Scoring logic lives in `src/lib/scoring.js` as pure functions with unit tests.

**Round end**
- Large score, rank, three stats (correct of 8, longest laurel, swift bonuses earned).
- Ranks: Visitor, Docent, Curator, Connoisseur. Thresholds are placeholders (0, 500, 1,000, 1,500) until real rounds show the score range; keep them in one constant.
- Rank ladder showing the four ranks with the current one filled, plus "N more points and you join the Connoisseurs".
- Initials entry styled as a brass plate: one to three letters A to Z, uppercased automatically. A blocklist of offensive combinations rejects entries with "Let's choose different initials." The blocklist lives in one file and is checked on the client and again on the server.
- After engraving: "Engraved. Your plaque hangs in third place." with "Play again" and "Back to Study".

**Wall of Patrons (leaderboard)**
- Top 10 for the class, shown with Roman numerals. Ranks I to III are brass plaques; IV to X are stone. A newly engraved plaque animates in ("hangs" and gets a brass shine).
- Weekly reset (proposed, to confirm with Chase): plaques reset each Monday so the wall stays winnable. Caption: "Plaques reset each Monday so every week is a fresh start."
- Storage: a free-tier key-value store connected to the Vercel project (Upstash Redis through the Vercel Marketplace is the expected choice; check Vercel's current docs since their storage offerings change). Accessed only through a serverless function at `/api/scores`. The database token lives in an environment variable and never reaches the browser.
- API: `GET /api/scores` returns the current week's top 10. `POST /api/scores` with `{ initials, score, correct, longestLaurel }` validates initials (regex and blocklist), checks that the score is possible (no higher than the maximum for a round of 8), rate-limits by IP to a few submissions per minute, then stores it in a sorted set keyed by ISO week.
- If the API is unavailable, the end screen still works and shows "The wall is resting. Your score was 1,240." without crashing.

## 6. Original bugs to fix (all resolved by the rebuild)

| Bug | Fix |
| --- | --- |
| Score replay: after a drop, the last dragged painting stays selected, so dropping any text on its bin scores it again ("Final Score: 10 / 8") | Tap-to-answer with one answer per painting enforced in state; buttons lock after answering. |
| No touch support: HTML drag and drop does not work on phones | No drag and drop; buttons only. |
| Hidden bins: bin row is 320px wide but holds five 180px columns | Fluid layout, tested at 390px. |
| Dark mode text: leftover Vite starter CSS turns headings near-white on a fixed cream background | Remove starter CSS; the app sets its own colors explicitly. A dark theme is out of scope for Phase 1. |
| Uneven rounds: 8 random picks can skip a movement | `dealRound()` guarantees coverage. |
| Biased shuffle: `sort(() => Math.random() - 0.5)` | Fisher-Yates shuffle. |
| Heavy images: 32 images total about 17 MB, one is 4.2 MB | Image pipeline (7.5). |
| Unused starter assets (`hero.png`, `react.svg`, `vite.svg`, `icons.svg`) | Remove. |

## 7. Data and logic

### 7.1 Painting data (`src/data/paintings.js`)

Keep Chase's existing file and extend each entry. Existing fields (`title`, `movement`, `image`, `explanation`) stay; the title should no longer include "by Artist".

```js
{
  id: 'raft-of-the-medusa',              // stable slug, used in URLs and storage
  title: 'The Raft of the Medusa',
  titleAccepted: ['raft of the medusa', 'raft of medusa', 'radeau de la meduse'],
  artist: { full: 'Théodore Géricault', last: 'Géricault' },
  artistAccepted: ['gericault', 'theodore gericault'],
  year: '1818 to 1819',                  // display string
  medium: 'Oil on canvas',
  movement: 'romantic',                  // id from movements.js
  alsoAccept: [],                        // extra movement ids that count as correct (see open questions)
  image: { src: '/images/web/raft-of-the-medusa-1600.webp', width: 1600, height: 1093, alt: '...' },
  explanation: '...',                    // Chase's text, unchanged except agreed typo fixes
  keyTerms: [],                          // Phase 2, Chase is tagging these
}
```

- Accepted-answer lists are written already normalized (lowercase, no accents, no punctuation).
- Claude Code drafts the new fields for all 32 works. Anything not taken from Chase's existing text (full names, years, media) gets a `// VERIFY` comment and is listed in the learning log for Chase to check.
- `alt` text describes the image briefly for screen readers without naming the movement. During Identify mode the alt text must not give away the title or artist; use a neutral alt ("The painting to identify") until graded.

### 7.2 Movements (`src/data/movements.js`)

```js
{
  id: 'romantic',
  name: 'Romantic',
  accepted: ['romantic', 'romanticism', 'romantic era', 'romantic period'],
  accent: '#56606A',       // decorative only (lines, diamonds), never text
  ink: '#3F4851',          // text-safe version, at least 4.5:1 on the label background
  light: 'rgba(255, 236, 206, 0.70)', // era lighting color, see DESIGN.md section 7
}
```

Values for all five movements are in `DESIGN.md`, section 7.

### 7.3 Rounds (`src/lib/rounds.js`)

- `shuffle(array)`: Fisher-Yates, returns a new array.
- `dealRound(paintings, size = 8)`: pick one painting from each movement first (random within the movement), fill the remaining slots randomly from the rest without repeats, then shuffle the order. If a movement has no paintings, skip it.
- `dealFrom(paintings, ids)`: for "Review the ones I missed".
- Unit tests: coverage of every movement, no duplicates, correct size, works when the pool is smaller than the round size.

### 7.4 Grading (`src/lib/grading.js`)

Pure functions, no AI, no network. Unit tests are required, including every example below.

- `normalize(text)`: Unicode NFD, strip accents, lowercase, replace punctuation with spaces, collapse whitespace, trim.
- `editDistance(a, b)`: Levenshtein distance.
- `gradeArtist(input, painting)`: blank is "Not quite" with note "Answer: Géricault". Exact match against `artistAccepted` is "Correct". Within edit distance 2 of an accepted answer (1 if the answer is 6 characters or fewer) is "Correct" with note "Spelled Géricault". Otherwise "Not quite" with the answer.
- `gradeMovement(input, painting, movements)`: same rules against the movement's `accepted` list, plus `alsoAccept`.
- `gradeTitle(input, painting)`: strip a leading "the", "a", "an", "le", "la" from both sides, then: exact or within distance 3 of an accepted title is "Correct"; containing a distinctive keyword from the title (any word of 4+ letters that is not a stopword) is "Close" with note "Nearly: The Raft of the Medusa"; otherwise "Not quite".
- Examples that must pass: "Gericault", "géricault", "Gericalt" are Correct for Géricault. "romanticism" is Correct for Romantic. "raft of medusa" and "The Raft of the Medusa" are Correct. "medusa" is Close. "Monet" is Not quite for Géricault.

### 7.5 Images (`scripts/optimize-images.mjs`, `npm run images`)

- Uses `sharp`. Reads the originals in `public/images/` (leave Chase's originals untouched), writes to `public/images/web/` with slugified filenames (no spaces or commas).
- Two widths per image: 800 and 1600 pixels, WebP at quality around 80, plus a JPEG fallback at 1600.
- Writes each image's real width and height into a generated `src/data/imageSizes.json` so the layout reserves space and does not jump while images load.
- Target: every web image under 300 KB at 1600 wide; total for all 1600 versions well under 8 MB.
- Use `srcset` and `sizes` so phones download the 800 version.

### 7.6 Routing (`src/lib/useHashRoute.js`)

A tiny hook (about 15 lines) that reads `window.location.hash`. Routes: `#/sort` (default), `#/identify`, `#/review`, and on the arcade branch `#/challenge` and `#/challenge/end`. Chosen over a routing library because there are only a few screens, it needs no server configuration on Vercel, and it is small enough for Chase to read in full.

## 8. Accessibility requirements

- All text meets WCAG AA contrast (4.5:1 body, 3:1 for text 24px and up). Gold and movement accent colors are decorative only and never carry text.
- Status is never color alone: always a word and a shape or icon as well.
- All controls are real `<button>`, `<a>`, `<input>`, `<label>` elements. Visible focus rings (lapis, see `DESIGN.md`).
- Every animation respects `prefers-reduced-motion: reduce` (animations and transitions off; content still appears).
- Tap targets at least 44 by 44px.
- The zoom dialog traps focus, closes with Escape, and returns focus.
- Text fields have visible labels, not placeholder-only labels.
- Test with keyboard only, and with a screen reader spot check (VoiceOver or NVDA) on Sort and Identify.

## 9. Performance requirements

- First load on a mid-range phone over 4G: the first painting visible in under 3 seconds.
- No layout shift when images load (width and height set).
- Fonts: Cormorant Garamond, Source Serif 4, Work Sans from Google Fonts with `display=swap` and preconnect; load only the weights in `DESIGN.md`.
- Preload the next painting's image while the student is on the current one.
- The ambient glow and backdrop blur are the most expensive effects. If a low-end phone drops frames, reduce blur radius on small screens first; never drop text contrast.

## 10. Acceptance checklist for Phase 1

- [ ] All bugs in section 6 are fixed and cannot be reproduced.
- [ ] A round always has 8 different paintings and covers all five movements.
- [ ] Sort and Identify work fully with touch, mouse, and keyboard.
- [ ] Grading tests pass, including every example in 7.4.
- [ ] Movement color and era light never appear before the student answers.
- [ ] Layout checked at 390px, 768px, 1280px, and 1440px wide.
- [ ] Reduced motion checked.
- [ ] Contrast checked on every text color pair in `DESIGN.md`.
- [ ] Images optimized; total web image weight under 8 MB.
- [ ] Lint, tests, and build pass.
- [ ] `docs/LEARNING.md` has an entry for every milestone.
- [ ] Every new painting fact is marked `// VERIFY` and listed for Chase.

## 11. Open questions for Monday's review with Chase

1. **Folies-Bergère:** Chase's description says it "straddles Realism and Impressionism" but the data files it as Realist only. Should Identify and Sort accept both? (Data supports this through `alsoAccept`.)
2. **Typos in descriptions:** "anticpating", "patriotisim", an unclosed quotation mark in the Daumier entry, and "Bourgeoisie" used as an adjective in the Morisot entry. Fix them, or leave the text exactly as written?
3. **Rococo has only 2 paintings** against 10 Realist and 10 Impressionist. Rounds will show the same two Rococo works constantly. Any more Rococo works on the syllabus?
4. **Round length:** 8 for both modes?
5. **Challenge:** keep the swift bonus? Weekly leaderboard reset? Rank names and thresholds?
6. **Key terms:** what format is Chase tagging them in? (Proposed: a `keyTerms` array per painting, plus a shared list per movement.)
