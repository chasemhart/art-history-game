# Field Notes

A running log of what changed in the app and why, written for Chase. Newest entries at the top. Claude Code adds an entry after every meaningful change, using the template at the bottom of this file.

---

## November 2, 2026: All at once, your sorting game, rebuilt

**What changed:** at your suggestion, Sort by movement now has two views, chosen with a switch under the header: **One at a time** (the single painting, as before) and **All at once**. All at once brings back the heart of your original game: eight works on the wall together, sorted into five rooms, one per movement. Drag a work into a room, or select it and then select a room. Rearrange as much as you like, then "Check the exhibition". Each room lights up in its movement's era light, misplaced works say where they belong, correct ones say "In place", and any work opens large with your description.

The header also changed on every screen: it slides away as you scroll down and returns when you scroll up, so it never covers what you're reading.

**Where it lives:**
- `src/screens/GroupSortScreen.jsx`: the wall, the rooms, dragging, and the reveal.
- `src/lib/groupSort.js`: the rules (each work in exactly one place, nothing moves after the check, a check needs all eight hung), with tests in `groupSort.test.js`.
- `src/components/ViewSwitch/`: the One at a time / All at once switch.
- `src/lib/useHideOnScroll.js`: when the header hides and returns.

**Why the code is shaped this way:** The rules live in one tested file, and a work has exactly one place at a time, so it can't be counted twice. Dragging works with mouse and touch through a small library called dnd-kit (see ARCHITECTURE.md for why). And the rooms always fit: on a phone they slide up as a tray at the bottom of the screen the moment you pick up a work.

Dragging is never the only way to move a work. Every work can also be selected and then placed. That's how keyboards work, and it's required for people who can't drag. Building both into the same screen means nobody gets a lesser version.

**The design rhetoric:** works hang in an even grid, each centered in an equal frame, the way galleries hang paintings on a shared center line at eye level so no single work is primary. The rooms stay plain until you check. Then each takes its movement's color and light all at once, the same "after the answer" rule as the single-painting view. A room's color showing early wouldn't give away which painting belongs there, but keeping every reveal on the same rule makes the moment of checking feel like one event. Picking up a work tilts it slightly and deepens its shadow, the way a canvas looks when someone is carrying it. On a phone, the work in hand shrinks and rides above your fingertip, so your finger never hides the room you're aiming for.

**Words to know:**
- **Drag and drop:** moving something on screen by pressing, carrying, and releasing it. Simple to describe, surprisingly fiddly to build well, which is why a library does the hard parts.
- **Drop target:** a place that accepts a dropped item. Here, the five rooms, the wall, and the phone tray's buttons.

**Try it yourself:** in `src/screens/GroupSortScreen.jsx`, find `useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } })`. The 180 is how many milliseconds you hold a finger before a drag starts on a phone. Try 600 and it feels sluggish; try 0 and you can't scroll the page without grabbing paintings by accident. That trade-off is why it's a number someone chose rather than a default.

---

## October 28, 2026: Checking the work, and the details that only show up when you check

**What changed:** the app was tested the way a careful visitor would use it, with tools to help: every screen and state, at four screen widths, with an automated accessibility checker, a keyboard alone, a simulated phone, and a deliberately slow connection. It passed nearly everything. These details turned up and were fixed:

- **Enter in Identify** used to submit the whole form from the first field. A phone labels that key "Next" there, so a student could check their answers with two fields still empty. Enter now moves to the next field and only checks the answers from the last one.
- **Hover effects on touch screens.** Phones keep a button in its "hovered" look after a tap, so a painting stayed lifted after closing the zoom view. Effects that move things now apply only on devices with a mouse.
- **The wordmark** was a link too small to tap reliably. It's now the 44 pixels tall a fingertip needs, without looking any different.

**Where it lives:** small edits across the components' `.css` files, and `IdentifyScreen.jsx` for the Enter key.

**Why the code is shaped this way:** most of these were invisible in a quick look on a laptop. That's the case for testing on purpose, with the conditions students actually have: a phone, a thumb, a keyboard, a slow connection. One measurement worth knowing: on a simulated 4G phone with a slow processor, the first painting finishes loading in about 2 seconds. The work on image sizes is what made that possible.

**The design rhetoric:** accessibility and polish are the same thing seen from two sides. A button that's easy for a fingertip to hit is easier for everyone. A focus ring that's always findable helps anyone who loses their place. "Enter means next" is simply the button doing what it says.

**Words to know:**
- **Accessibility audit:** checking a page against the published rules (WCAG) that make the web usable for people with disabilities. Tools catch about a third of problems; the rest need a person.
- **Tap target:** the area a finger can press. 44 by 44 pixels is the widely used minimum.

**Try it yourself:** open the app, then use only your keyboard. Tab to move, number keys to answer in Sort, Enter to continue, Escape to close the zoom view. If you ever can't tell where you are on the page, that's a bug worth reporting: the lapis focus ring should always show you.

**Still needs a person:** a spot check with a screen reader (VoiceOver on a Mac or iPhone, or NVDA on Windows), a try on a real phone, and your review of the drafted facts above.

---

## October 28, 2026: Identify, and teaching a computer to grade fairly

**What changed:** Identify mode works. The painting appears alone, with no label and no hints, even for screen readers. The student types the title, the artist's last name, and the movement, the way the final exam asks, and presses "Check answers". Each answer comes back Correct, Close, or Not quite, with a short note ("Spelled Géricault", "Nearly: The Raft of the Medusa", "Answer: Friedrich"), and then the wall label opens to your description. "Try again" clears the fields; the best result for each field is kept. At the end of a round, the review shows all three answers for every painting.

**Where it lives:**
- `src/lib/grading.js`: the grading rules, with no screen code at all.
- `src/lib/grading.test.js`: 39 examples a student might type, each with the verdict it should get.
- `src/screens/IdentifyScreen.jsx`: the form, the results, and the reveal.
- `src/components/ResultRow/` and `src/components/StatusBadge/`: one graded answer, and the Correct, Close, or Not quite badge (also used on both reviews).

**Why the code is shaped this way:** grading has to be fair in two directions at once. It should forgive an honest typo: "Gericalt" earns credit, with a note showing the spelling. It must not accept a different answer. The first draft of the rules was tested against your actual collection before any screen was built, and that turned up three traps:

- **Manet and Monet** differ by one letter, so a rule that forgives one-letter typos would have marked "Monet" correct for *Olympia*. Now a near-miss only counts if it isn't closer to another artist in the collection.
- **"Death"** is in two titles (*Marat* and *Socrates*), so it isn't a clue to either one. A word only earns "Close" if no other title uses it. The app works that out from the data, so it stays right as you add paintings.
- **Short titles** can't take the same typo allowance as long ones, or "Both" would pass for *Bath*. The allowance now grows with the title's length.

Each trap is now a test, so a future change can't quietly bring them back.

**The design rhetoric:** the result rows always read in the same order: what you wrote, how it did, what to remember. Each status has its own shape (a solid pill with a check, an outline with a dash, a dashed outline with a cross), not only its own color. The fields have spellcheck and autocorrect turned off, because a phone that "fixes" Gericault into something else would be grading itself before the student ever could.

**Words to know:**
- **Edit distance:** how many single-letter changes turn one word into another. "Gericalt" to "Gericault" is 1.
- **Recall and recognition:** recognition is picking the right answer from choices (Sort). Recall is producing it from memory (Identify). Recall is harder, and it's what the exam asks.

**Try it yourself:** in `src/lib/grading.js`, find `titleTolerance` and change its first line from `if (answer.length <= 4) return 0` to `return 1`. It looks harmless: one forgiven typo in a four-letter title. Run `npm run test` and one test fails by name: "requires very short titles to be spelled exactly", because "Both" now passes for *Bath*. Change it back and the tests pass again. That's what the tests are for: a rule that seems safe to loosen often isn't, and they say so the moment it happens.

**To verify (Chase):** spelling. Right now a recognizable misspelling earns full credit with a note. If the exam marks misspellings down, we can make them "Close" instead with a one-line change.

---

## October 28, 2026: Answering, the reveal, and the round review

**What changed:** Sort mode now asks "Which movement?" Students tap one of five movements (or press 1 to 5 on a keyboard). The right answer fills with ink, and a wrong pick turns to a dashed bronze outline with a small shake. Then the room responds: the line under the title redraws in the movement's color, the light above the painting shifts to the movement's era light, and the wall label opens to your description, beginning with a drop capital. Selecting the painting opens it large over a frosted scrim. After the eighth painting, "See your round" shows all eight with each pick and answer, and offers a round of only the missed ones.

**Where it lives:**
- `src/lib/round.js`: the rules. One answer per painting, no moving on before answering, and what counts as correct.
- `src/components/ChoiceList/`: the five buttons and their four looks: waiting, the answer, a wrong pick, and faded.
- `src/components/ArtworkStage/`: now also the ambient glow, the gold corner marks, and the era light.
- `src/components/ZoomView/`: the enlarged painting.
- `src/screens/ReviewScreen.jsx`: the look back over a round.

**Why the code is shaped this way:** the original game's worst bug let one painting be scored again and again ("Final Score: 10 / 8"). The fix isn't in the buttons; it's in the rules. `round.js` simply ignores a second answer to the same painting, and a test tries the old trick on purpose to prove it can't work. Rules that live in one tested place can't be broken by a change to how the screen looks.

The zoom view is built on the browser's own `<dialog>` element. Overlays carry accessibility duties: keyboard focus must move in, stay in, leave with Escape, and return to where it was. The browser does all four for us, so there's no hand-written code there to get wrong.

**The design rhetoric:** nothing about the movement appears before the answer: not its name, not its color, not its light. A light that warmed to candlelight before you answered would hand you "Rococo". After the answer, three things change together, the color, the light, and the words. That repetition is the quiet second lesson: over many rounds, students start to associate each movement with its look and its light without being told. The gold moves with the student, too: the corners of the painting, then the title, then the question, then the movement's name, and finally only the Next button. At any moment, the newest gold is the instruction.

**Words to know:**
- **State:** what the app remembers right now (which painting, what was answered). The screen is drawn from it.
- **Modal dialog:** a layer that takes over until it's closed, like the zoom view. Everything behind it is paused.

**Try it yourself:** in `src/styles/tokens.css`, change `--glow-opacity: 0.24;` to `0` and the room loses its painted tint, then try `0.4` and it starts competing with the painting. DESIGN.md asks for 0.18 to 0.26: enough to feel, not enough to notice. Set it back.

---

## October 24, 2026: The new gallery replaces the old game

**What changed:** the drag-and-drop game is gone. In its place is the new gallery: a frosted header with the two study modes and your progress, one painting at a time on a warm wall under a soft overhead light, and a wall label beside it with the italic title, a short gold line, the artist, and the date. "Next painting" walks through a fairly dealt round of 8. Answering by movement arrives in M2, and Identify in M3; their tabs show a calm "opens soon" note for now.

Removing drag and drop also removes three of the original bugs at their root: the score that could be replayed ("10 / 8"), the game not working on phones (phones don't support that kind of dragging), and the answer bins that were cut off. M2's answer buttons are the replacement, designed so each painting takes exactly one answer.

**Where it lives:**
- `src/App.jsx`: the frame. It reads the address, keeps the current round, and shows the header plus the right screen.
- `src/components/`: the reusable pieces. `Header`, `ProgressTicks`, `ArtworkStage` (the painting, its light, and its shadow), `WallLabel`, and `NextButton`, each in a folder with its own `.css`.
- `src/screens/SortScreen.jsx`: arranges those pieces for Sort mode and handles the Right Arrow shortcut and preloading the next painting.
- `src/lib/round.js`: the rules for moving through a round.

**Why the code is shaped this way:** components are like furniture and screens are like rooms. The same wall label will appear in Sort, Identify, and later Challenge, so it's built once and placed in each room. The round lives in `App.jsx`, above both the header and the screen, because both need it: the screen moves through it and the header shows how far along you are. Shared information belongs to the nearest common parent.

**The design rhetoric:** look at a screen and notice where your eye goes. The painting first: it is the largest thing, lit from above, and casts the deepest shadow, as a framed work hung off a wall does. Then the title, because a thin gold line draws beneath it just after the painting arrives. Then the dark Next button, the heaviest shape on the right. Then, last, the one gold tick in the header that says where you are. Gold appears only where the eye should go next.

**Words to know:**
- **Component:** a reusable piece of interface with its own look and behavior, like the wall label.
- **Responsive layout:** one design that rearranges itself for the screen it's on. Here, painting and label sit side by side on a laptop and stack on a phone.

**Try it yourself:** in `src/styles/tokens.css`, change `--gold: #A9843F;` to a bright blue such as `#2F6FD6`, save, and watch the title line and progress tick change everywhere at once. Notice how loudly blue competes with the painting; that's why the accent is a quiet gold. Change it back.

---

## October 24, 2026: Fair rounds, and addresses for each screen

**What changed:** rounds are now dealt fairly. Every round of 8 includes all five movements, never repeats a painting, and every order is equally likely. Each screen also gets its own web address (`#/sort`, `#/identify`, `#/review`), so the back button and bookmarks work.

**Where it lives:**
- `src/lib/rounds.js`: `shuffle`, `dealRound`, and `dealFrom` (for reviewing missed paintings).
- `src/lib/rounds.test.js`: deals 1,000 rounds and checks each one, and shuffles 60,000 times to check fairness.
- `src/lib/useHashRoute.js`: reads the address and tells the app which screen to show.

**Why the code is shaped this way:** the original game shuffled with a well-known shortcut: "sort the list, flipping a coin for every comparison." It looks random, but it isn't. We measured it on three items, shuffled 60,000 times. Each of the six possible orders should come up about 10,000 times. The shortcut left the list unchanged ("abc") 22,618 times and produced some orders only about 3,700 times. The replacement is the Fisher-Yates shuffle, a standard method since 1938, and the test checks every order lands within 5% of even.

Dealing picks one painting from each movement first, then fills the rest. This matters most for Rococo: with only 2 of 32 paintings, an eight-painting round picked purely at random skips Rococo more than half the time (about 56%).

The router is about 15 lines instead of a library. The part of an address after `#` never reaches the server, so it needs no setup on Vercel.

**Words to know:**
- **Algorithm:** a precise, step-by-step method for a task. Fisher-Yates is an algorithm for shuffling.
- **Edge case:** an unusual situation code must still handle, like a round with fewer paintings than seats. The tests cover several.

**Try it yourself:** run `npm run test:watch`, then in `rounds.js` change `random() * (i + 1)` to `random() * i`. The fairness test fails, because that one-character slip makes some orders impossible. Change it back and the tests pass again.

---

## October 24, 2026: Fast images for phones

**What changed:** a new command, `npm run images`, makes small web copies of every painting. Your originals total about 17 MB, and The Harvester alone is 4 MB, which means seconds of waiting per painting on a phone. The web copies are WebP files in two sizes. Phones usually download a copy around 100 to 200 KB.

**Where it lives:**
- `scripts/optimize-images.mjs`: the script. It reads `paintings.js`, so it knows every painting and its id.
- `public/images/web/`: the copies it writes, named by id (`olympia-800.webp`, `olympia-1600.webp`). Your originals in `public/images/` are never changed.
- `src/data/imageSizes.json`: the real width and height of each copy, written by the script. Never edit it by hand.
- `src/lib/images.js`: one helper that turns a painting into everything an image tag needs.
- `src/lib/images.test.js`: fails if a painting has no web copies, and says to run `npm run images`.

**Why the code is shaped this way:** web pages use a feature called `srcset`, a list of the same image at different sizes. The browser looks at the screen and downloads only the copy it needs. The page also has to know each image's shape *before* it arrives, or the text below would jump down when the picture loads. That is why the script records every size in a file the app reads.

We chose WebP over the newer AVIF format after testing both. AVIF files were about 40% smaller, but at that size they smoothed away visible brushstrokes. For a tool about looking closely at paintings, the brushwork matters more than the bytes.

**The design rhetoric:** speed is part of respect for the work. A painting that arrives in pieces, or pushes the page around as it loads, interrupts the moment of looking before it starts.

**Words to know:**
- **Compression:** storing an image in fewer bytes by discarding detail the eye won't miss. "Quality 80" is how much to keep.
- **Layout shift:** content jumping on the page while it loads. Reserving the image's shape in advance prevents it.

**Try it yourself:** run `npm run images` and read what it prints: how many paintings, the total size, and any warnings. Then look in `public/images/web/` to see the files it made.

**To verify (Chase):** three originals are small enough to look soft on a laptop: The Swing (500 pixels wide), The Secret Meeting (597), and Stack of Wheat (843). If you can find larger versions (museum websites often offer free high-resolution downloads), replace the files in `public/images/` with the same names and run `npm run images`.

---

## October 24, 2026: The collection gets a proper catalogue

**What changed:** your painting list moved to `src/data/paintings.js` and each entry grew from four facts to a full catalogue record: the artist's full and last name, year, medium, other titles students might fairly use, and a description of the image for blind and low-vision students. The five movements got a file of their own. A handful of typos in the descriptions were fixed (listed below).

**Where it lives:**
- `src/data/paintings.js`: the 32 works. The comment at the top explains every field and how to add a painting.
- `src/data/movements.js`: the five movements, the spellings that count as correct ("romanticism" counts for Romantic), and each movement's colors and era light.
- `src/data/paintings.test.js`: 168 automatic checks on the two files.

**Why the code is shaped this way:** in the original, each painting said `movement: "Romantic"` in plain words. One stray letter ("Romantc") would quietly create a movement no student could ever pick. Now each painting points to a movement by its `id`, the movement's name is written once in `movements.js`, and a test fails loudly if a painting points at a movement that doesn't exist. This is a common pattern: write each fact in one place, and have everything else refer to it.

The accepted-answer lists only hold *alternatives* (a French title, a shorter form). The title and artist name themselves always count, so they are never written twice and can never disagree.

**Words to know:**
- **id (identifier):** a short, unique, never-changing name for a record, like a museum accession number. `the-raft-of-the-medusa` stays the same even if the display title is corrected.
- **Alt text:** a written description of an image that screen readers speak aloud. A test makes sure no alt text names a movement, because it is read before the student answers.

**Try it yourself:** in `paintings.js`, change one painting's `movement: 'realist'` to `movement: 'realism'` and run `npm run test`. The test names the painting and says it isn't filed under a real movement. Change it back.

**To verify (Chase):**

Typos fixed in your descriptions: "anticpating" and "patriotisim" (Boilly), "artistocratic" (The Secret Meeting), "Bourgeoisie" used as an adjective (now "bourgeois"), "Katz & Dars book" (now "Katz and Dars' book"), a double space (Morisot), and "Dupre" (now "Dupré"). The Daumier quotation had an opening mark but no closing one; it is now closed, and its "---" became a comma. If the source uses a dash there, tell us and we'll restore it.

Questions:
- **The Harvester:** we couldn't find a date, so the label leaves the year out for now. The image is also a photograph of the painting in its gold frame, taken at a slight angle; a straight-on image without the frame would match the rest of the collection.
- **Monet Painting:** your description says Monet is "at work in his garden". The Tate's title is *Claude Monet Painting by the Edge of a Wood*. Should the description say "at the edge of a wood"?
- **Kauffmann:** you spell her name Kauffmann; many museums use Kauffman. Both are accepted. Which should the label show?
- **Titles:** your titles are kept exactly. Museum titles and French originals were added only as alternatives students may type.

Drafted facts to check (artist full names, years, and media are all marked `// VERIFY` in the file; every medium is drafted as "Oil on canvas"):

| Painting | Artist | Year |
| --- | --- | --- |
| The Swing | Jean-Honoré Fragonard | 1767 |
| Oath of the Horatii | Jacques-Louis David | 1784 |
| Liberty Leading the People | Eugène Delacroix | 1830 |
| The Stonebreakers | Gustave Courbet | 1849 |
| A Burial at Ornans | Gustave Courbet | 1849 to 1850 |
| The Third of May 1808 | Francisco Goya | 1814 |
| The Death of Marat | Jacques-Louis David | 1793 |
| Impression, Sunrise | Claude Monet | 1872 |
| The Secret Meeting | Jean-Honoré Fragonard | 1771 to 1773 |
| The Death of Socrates | Jacques-Louis David | 1787 |
| The Raft of the Medusa | Théodore Géricault | 1818 to 1819 |
| Dance at Le Moulin de la Galette | Pierre-Auguste Renoir | 1876 |
| Summertime | Mary Cassatt | 1894 |
| Boulevard des Capucines | Claude Monet | 1873 to 1874 |
| The Gleaners | Jean-François Millet | 1857 |
| Wanderer above the Sea of Fog | Caspar David Friedrich | c. 1818 |
| Olympia | Édouard Manet | 1863 |
| The Luncheon on the Grass | Édouard Manet | 1863 |
| The Third Class Carriage | Honoré Daumier | c. 1862 to 1864 |
| The Barricade (Memory of Civil War) | Ernest Meissonier | 1849 |
| What is Called Vagrancy | Alfred Stevens | c. 1854 |
| The Harvester | Julien Dupré | not yet found |
| Simon Chenard as a Sans-culotte | Louis-Léopold Boilly | 1792 |
| Cornelia Pointing to her Children as Treasures | Angelica Kauffmann | c. 1785 |
| Monet Painting | John Singer Sargent | c. 1885 |
| The Child's Bath | Mary Cassatt | 1893 |
| Regatta at Argenteuil | Claude Monet | 1872 |
| Stack of Wheat (Snow Effect, Overcast Day) | Claude Monet | 1890 to 1891 |
| The Boating Party | Mary Cassatt | 1893 to 1894 |
| Summer's Day | Berthe Morisot | 1879 |
| A Bar at the Folies-Bergère | Édouard Manet | 1882 |
| The Nightmare | Henry Fuseli | 1781 |

---

## October 24, 2026: The design system becomes code

**What changed:** every color, font, size, spacing step, and timing from `DESIGN.md` now has a name in one file, `src/styles/tokens.css`. The leftover starter styles from the Vite template are gone, along with its sample images.

**Where it lives:**
- `src/styles/tokens.css`: the named values, each with a comment saying why it is what it is.
- `src/styles/base.css`: rules for the whole page. The wall color, default fonts, the lapis focus ring, the frosted-glass surface, and the reduced-motion switch.
- `index.html`: loads the three typefaces (only the weights in use) and names the page "Art History Study".

**Why the code is shaped this way:** components never write a raw color like `#A9843F`. They write `var(--gold)`. If the gold ever needs adjusting, it changes in one line, and nothing can drift out of step. It also makes the stylesheets read like the design document.

The original showed near-white headings on phones set to dark mode. The starter styles followed the phone's dark setting while the game's background stayed cream. The page now states plainly that it is a light design (`color-scheme: light`), and every color comes from the tokens.

**The design rhetoric:** the focus ring is lapis blue, not gold. Gold leaf and ultramarine (ground lapis lazuli) were the two most precious materials in a painter's studio. Gold guides the eye; lapis marks the one thing keyboard users must always be able to find: where they are.

**Contrast, measured** (WCAG AA asks for 4.5:1 for body text, 3:1 for large text and focus rings). Every pair passes:

| Pair | Ratio |
| --- | --- |
| ink on wall | 13.4:1 |
| ink on paper | 15.6:1 |
| muted on wall | 5.7:1 |
| muted on paper | 6.6:1 |
| muted-2 on wall | 5.0:1 |
| bronze on wall | 5.6:1 |
| bronze on paper | 6.5:1 |
| paper on ink | 15.6:1 |
| brass-ink on brass | 6.0:1 |
| lapis focus ring on wall | 7.5:1 |
| Rococo ink on paper | 6.0:1 |
| Neo-Classical ink on paper | 8.0:1 |
| Romantic ink on paper | 8.9:1 |
| Realist ink on paper | 7.7:1 |
| Impressionist ink on paper | 5.9:1 |

**Words to know:**
- **CSS custom property (variable):** a named value in a stylesheet, written `--name` and used as `var(--name)`.
- **Contrast ratio:** how much lighter one color is than another, from 1:1 (identical) to 21:1 (black on white). Higher is easier to read.

**Try it yourself:** in `tokens.css`, change `--t-draw: 900ms;` to `3000ms` and watch the gold line under each title draw slowly. Timing is part of the design: too fast and nobody notices, too slow and it gets in the way. Change it back.

---

## October 24, 2026: A branch for the rebuild, and the first automatic tests

**What changed:** the rebuild now has its own line of work, the `study-redesign` branch, so the original game on `main` stays exactly as you left it. We also installed Vitest, a tool that runs small checking programs called tests, and wrote the first set: they check your painting data every time anyone runs `npm run test`.

**Where it lives:**
- `package.json`: two new commands. `npm run test` runs every test once and reports; `npm run test:watch` keeps running and re-checks every time a file is saved.
- `src/paintings.test.js`: the checks themselves. For every painting, it confirms the title, movement, image, and explanation are filled in, that the movement is one of the five exam movements spelled exactly right, and that the image file really exists in `public/images/`. It also checks no painting is listed twice and every movement has at least one painting.

**Why the code is shaped this way:** a test sits next to the file it checks and has the same name plus `.test.js`, so "where are the checks for this?" always has one obvious answer. We started with the data, not the game rules, because the data is the part you edit most and a mistake there fails silently: a painting filed under "Impressionism" instead of "Impressionist" would not crash anything, it would just form a sixth bin that no student could ever answer correctly. The next tests (fair round dealing, grading typed answers) arrive with the code they check in M1 and M3.

**Words to know:**
- **Branch:** a separate copy of the project's history where work can happen without disturbing the main version. When the work is ready, it is merged back.
- **Test:** a small program that checks another program's behavior and says pass or fail. 99 passing tests here means 99 separate facts about your data were confirmed.

**Try it yourself:** in `src/paintings.js`, change one painting's movement from `"Realist"` to `"Realism"`, then run `npm run test`. One test fails and names the painting. Change it back and run the tests again to see them all pass.

---

## October 24, 2026: Why we are rebuilding, and how the design was decided

**What happened:** before writing any code, we played the original game, read its code, and tested it on a phone. Then we designed four visual directions as clickable mockups (Museum Wall, Salon, Exhibition Catalogue, and a modern Museum Wall), chose the modern Museum Wall, and designed a Challenge version for the arcade proposal.

**Why rebuild instead of patch:** the original is a single file mixing data, rules, layout, and styling. Its main problems (scores that can be replayed, no phone support, uneven rounds) come from its structure, not from typos. A rebuild keeps everything valuable (the 32 paintings and your descriptions) and changes the structure underneath. See `ARCHITECTURE.md`.

**The design rhetoric, in one paragraph:** the interface borrows the language of a gallery. Warm walls so paintings read truthfully. Light from above, so the eye goes to the work first. Wall labels in a consistent typographic hierarchy (italic title, artist, date). A single gold accent that always marks the next place to look, the way a painter places the brightest highlight at the focal point. And after each answer, a quiet second lesson: the light and an accent color shift toward the movement's own palette. Full reasoning is in `DESIGN.md`.

**Words to know:**
- **Mockup:** a realistic model of a screen used to make design decisions before building the real thing.
- **Prototype:** a mockup you can interact with.
- **Design token:** a named value (like `--gold`) used everywhere instead of repeating the raw color. Change it once, it changes everywhere.

**Try it yourself:** open the mockups (see `docs/mockups/README.md`) and click through Sort. Notice the order things appear in. Which did your eye go to first, second, third?