# Field Notes

A running log of what changed in the app and why, written for Chase. Newest entries at the top. Claude Code adds an entry after every meaningful change, using the template at the bottom of this file.

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

---

## Entry template

```
## [Date]: [Short title of the change]

**What changed:** one or two sentences a non-programmer can follow.

**Where it lives:** the files touched, each with a few words on its role.

**Why the code is shaped this way:** the architectural reasoning. Why here and not somewhere else? What would break or get harder if we did it differently?

**The design rhetoric:** (for visual changes) what the choice communicates and how it guides attention.

**Words to know:** one or two terms, each with a one-line definition.

**Try it yourself:** a small, safe experiment: change a token, a timing, a line of copy, or add a painting, and what to look for.

**To verify (Chase):** any facts or content decisions that need your eyes. Optional.
```
