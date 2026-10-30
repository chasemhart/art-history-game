# Art History Study: Design System and Its Reasoning

This document is both a spec and a lesson. Every rule has a **What** (what to build) and a **Why** (the visual rhetoric behind it). Chase is especially interested in the why, so when you implement a rule, carry its reasoning into code comments and the learning log.

Reference prototypes: `docs/mockups/Modern-Sort.dc.html` is the most complete expression of this system. The Challenge mockups predate the gold path and need it added.

## 1. The thesis

> The interface is a piece of art that is home to art.

A museum does two things at once: it gets out of the way of the art, and it quietly teaches you how to look at it. The walls are calm, the light is placed, the labels are small and consistent, and the path through the room is designed. This app does the same on a screen. It borrows the gallery's language (wall, light, label) and adds a modern layer (glass, motion, a guiding accent) without ever competing with the painting.

## 2. Five principles

1. **The painting is the loudest thing on screen.** Everything else is quieter in size, color, and motion. *Why:* attention is finite. Every bright or moving element we add takes attention from the art.
2. **Nothing is ever drawn on the artwork.** No overlays, badges, or effects on the image itself. *Why:* respect for the work, and honesty: students should study what the artist made, not what we added.
3. **Gold is spent like a painter spends highlight.** Sparingly, and only where the eye should go next. *Why:* painters place their brightest highlight at the focal point; a viewer's eye goes to the point of highest contrast first. If everything is gold, nothing leads.
4. **Things arrive in the order we want them seen.** Motion is choreography, not decoration. *Why:* animation timing is a reading order. Staggering elements top to bottom, left to right, teaches the sequence: look, read, decide.
5. **Meaning is never carried by color alone.** Every status also has a word and a shape. *Why:* about 1 in 12 men has some form of color vision deficiency, and redundancy makes meaning clearer for everyone.

## 3. Color

### 3.1 Core tokens

Define these as CSS custom properties in `src/styles/tokens.css`. Component styles use the tokens, never raw hex values.

| Token | Value | Role | Why |
| --- | --- | --- | --- |
| `--wall` | `#EDE9E1` | Page background | A warm off-white, the color of gallery walls. Pure white glares and flattens paintings; a warm neutral lets their colors read truthfully. |
| `--paper` | `#FBFAF7` | Labels, raised surfaces | A step lighter than the wall, like a printed wall label on board. |
| `--ink` | `#22201C` | Primary text, filled buttons | A warm near-black. Pure black is harsh against warm neutrals; warm ink belongs to the same "room". |
| `--ink-hover` | `#36332D` | Hover on ink buttons | A small lift in value signals interactivity without a new color. |
| `--muted` | `#5E5A52` | Secondary text (artist meta, labels) | Readable (about 5.7:1 on the wall) but clearly second in the hierarchy. |
| `--muted-2` | `#66625A` | Faded answer options | The lowest-priority text that still passes contrast. |
| `--hairline` | `rgba(34,32,28,.14)` | Dividers, quiet borders | Lines should separate, not decorate. |
| `--bronze` | `#7A5230` | Text-safe accent (verdict notes, drop caps, wrong-pick state) | The darker, readable cousin of gold. Used when the accent must be read, not just seen. |
| `--gold` | `#A9843F` | The gold path (decorative only) | See section 8. Never used for text: it fails contrast on the wall. |
| `--gold-on-ink` | `#D4B06A` | Gold details on dark buttons | Gold must lighten to stay visible on ink. |
| `--lapis` | `#2F4A6D` | Keyboard focus rings | Gold leaf and ultramarine (ground lapis lazuli) were the two most precious materials in a painter's studio. Lapis is the cool counterpoint to gold and marks the one thing that must always be findable: where your keyboard focus is. |
| `--brass` | `#C7A866` | Plaques, initials plate (arcade) | Museum donor plaques. |
| `--brass-ink` | `#3D2A10` | Text on brass | Engraved look; about 5:1 on brass. |

### 3.2 Contrast pairs to verify in code

Text must reach 4.5:1 (or 3:1 at 24px and larger). Verify these pairs with a contrast checker and record the numbers in the learning log: ink on wall, ink on paper, muted on wall, muted on paper, muted-2 on wall, bronze on wall, bronze on paper, paper on ink, brass-ink on brass, and each movement `ink` on paper (section 7).

## 4. Typography

Three families, each with one job. Load only these weights.

| Role | Family and weights | Why |
| --- | --- | --- |
| Display: titles of works, verdicts, wordmark, big numbers | Cormorant Garamond 500, 600, 700, italic 500 | A Garamond descendant: the voice of fine printing and exhibition catalogues. **Titles of works are italic**, the convention for titles of artworks in museum labels and art history writing. |
| Reading: descriptions, answers, body | Source Serif 4, 400 and 600 (optical sizes) | A serif designed for comfortable screen reading. Chase's descriptions are long-form prose and deserve a book face. |
| Labels: tabs, field labels, meta, buttons | Work Sans 500 and 600, often uppercase with letter-spacing | Museum wayfinding and label metadata are traditionally set in clean sans serifs. Small caps-style labels read as "information about the art" rather than "the art". |

Scale (desktop; reduce by about 15% under 600px): wordmark 26px, work title 36px, verdict 27px, body 17px with 1.65 line height, labels 12 to 14px with 1.2 to 1.4px letter-spacing.

**Drop capital:** the first letter of each description is set in Cormorant Garamond 600, about 60px, bronze, floated left across two lines. *Why:* a nod to illuminated manuscripts, the oldest tradition of art and text sharing a page, and a clear visual "begin reading here".

## 5. Light

Three kinds of light, all subtle, all behind or around the art, never on it.

### 5.1 Ambient glow (painting color)

**What:** a copy of the current painting, blurred about 90px, at about 24% opacity, fills the page behind everything. It fades in over 1.2 seconds when the painting changes.

**Why:** paintings change the color of the rooms they hang in; light bounces off them. The glow makes each painting's palette tint its whole environment, so the room "belongs" to the work. It also gives the glass surfaces something to refract, which is what makes glass read as glass.

**Rules:** opacity between 0.18 and 0.26. Configurable in one constant. Can be turned off without breaking anything.

### 5.2 Gallery spotlight

**What:** a soft radial highlight above the painting, brightest at the top center, fading out about 70% of the way down. Neutral warm white before answering.

**Why:** museum lighting comes from above and slightly in front. A pool of light above the frame tells the eye "this is the object on display" before any text is read. It is also the oldest compositional trick there is: the brightest area wins attention.

### 5.3 Era lighting (after answering only)

**What:** after the student answers, the spotlight color transitions over 1.2 seconds to the movement's era light (section 7).

**Why:** each movement lived under a different light, literally and stylistically: candlelit Rococo salons, the clear even light of Neo-Classical reason, Romantic dusk and drama, the flat honest daylight of Realism, the open air of Impressionism. The shift is a quiet second lesson about the movement.

**Rule:** never before the answer. A light that changes with the movement would give the answer away. This is a mechanics rule, not a style preference.

## 6. Glass

**What:** frosted surfaces: semi-transparent paper (`rgba(251,250,247,.62)`), `backdrop-filter: blur(18px) saturate(1.4)`, a 1px white border at 70% opacity, a soft drop shadow, and a 1px inner top highlight.

**Allowed on:** the header, wall labels, answer buttons (lighter: blur 10px), the zoom view scrim and caption, Challenge panels.

**Never on:** the painting, or anything that sits over the painting.

**Why:** glass lets the ambient painting color pass through every surface, so the interface feels like it exists in the same light as the art. It also creates depth (the label floats in front of the wall) without heavy borders. Used sparingly it reads as refined; used everywhere it becomes a trend that will date the design. Keep it to the list above.

**Fallback:** where `backdrop-filter` is not supported, use solid `--paper` at 92% opacity.

## 7. Movement palette

Each movement has an accent drawn from its own characteristic paintings, a text-safe ink, and an era light. **All three appear only after the student answers** (same reason as 5.3).

| Movement | Accent (decor) | Ink (text) | Era light | Source and reasoning |
| --- | --- | --- | --- | --- |
| Rococo | `#C98E8E` blush | `#8E4E52` | `rgba(255,226,196,.75)` candle warm | Fragonard's pinks and powdered pastels; salons lit by candles. |
| Neo-Classical | `#9E3B32` David red | `#8A2F27` | `rgba(248,248,246,.75)` clear neutral | The red cloaks of the Oath of the Horatii; even, rational light with no drama. |
| Romantic | `#56606A` storm slate | `#3F4851` | `rgba(255,232,200,.70)` amber dusk | Friedrich's fog and Géricault's sea; low, dramatic light. |
| Realist | `#8A7553` field ochre | `#5E4E36` | `rgba(244,241,234,.75)` flat overcast | Millet's wheat fields and Courbet's earth; unidealized daylight. |
| Impressionist | `#6E93B5` water blue | `#3F6585` | `rgba(236,244,255,.75)` cool open air | The water at Argenteuil; painting outdoors in natural light. |

**Where movement color appears after answering:**
- The movement name in the wall label is set in the movement's ink.
- The short rule under the title redraws in the movement accent (it was gold before the answer).
- The era light, as in 5.3.
- On review screens, a small accent dot beside each movement name.

**Why:** color is part of what makes a movement recognizable. Repeated exposure to a consistent accent per movement builds an association students absorb without being told, the same way brands become recognizable by color.

## 8. The gold path

**Rule:** gold marks the next place the eye should go. As the student moves through a screen, the gold moves with them. At any moment, the newest gold element is the instruction.

**Why:** this is how painters compose. A painting is not seen all at once; the eye enters at the brightest or highest-contrast point and travels along lines and repeated accents to secondary areas. We do the same with one warm accent, so the interface teaches its own reading order without instructions.

### 8.1 Sort screen sequence

| Order | Element | Gold treatment | Timing after the painting appears |
| --- | --- | --- | --- |
| 1 | The painting | Four fine gold corner marks (22px, 1px lines) draw in from slightly outside to 16px outside the image, like the corners of a mat. On hover they open to 22px: an invitation to look closer. | 0.35s |
| 2 | The title | A 44px gold hairline under the title draws left to right. | 0.45s |
| 3 | The question | A small gold diamond (6px square rotated 45°) glints in beside "Which movement?" | 0.55s |
| 4 | The answers | On hover, a gold hairline draws under the hovered answer, left to right. | on hover |
| 5 | After answering | The diamond moves to the movement name; the title rule redraws in the movement accent; gold now appears only on the Next button (arrow, and a hover underline). | on answer |
| Ongoing | Progress | The current tick is gold and wider. | always |

### 8.2 Identify screen sequence

1. Corner marks on the painting.
2. Diamond beside "Name this work".
3. Fields: lapis focus ring on the active field (focus is lapis, not gold, everywhere).
4. After grading: result rows appear in order; the diamond moves to the revealed title; gold remains only on Next.

### 8.3 Challenge screens

- The swift bonus line is gold (it is the timer the eye should notice).
- The laurel is a deeper gilt (`#8C6A2F`) and only fully colored while a streak is active.
- Score chips have a faint gold border; the total chip is ink.
- The newly engraved plaque gets a single brass shine sweep.
- Apply the full Sort gold path to the Challenge play screen as well.

## 9. Space, shape, and elevation

- **Spacing scale:** 4, 8, 12, 16, 20, 24, 28, 34, 40, 48, 56, 72px. Use the scale; no one-off values.
- **Page:** max content width 1200px, 48px side padding on desktop, 16 to 20px on phones.
- **Layout:** painting column and label column side by side on wide screens (painting `flex: 999 1 560px`, label `flex: 1 1 340px`), stacking on narrow ones. The painting area is about 660px tall on desktop.
- **Corner radius:** 2px on paintings (a slight softening, like a canvas edge), 10px on buttons and fields, 16px on panels, fully round on pills. *Why:* sharp art, soft furniture. The interface is friendly; the art is an object.
- **Elevation:** three levels. Wall (no shadow). Raised (glass panels: soft shadow, about 36px blur at low opacity). Hung (paintings: a deeper, directional shadow, `0 22px 44px -12px` plus a tight contact shadow) because a framed work hangs off the wall. Hovering a painting lifts it 4px and deepens its shadow.

## 10. Motion

### 10.1 Tokens

| Token | Value | Use | Why |
| --- | --- | --- | --- |
| `--ease-arrive` | `cubic-bezier(.2,.8,.2,1)` | Things entering, lifting, settling | Fast start, gentle landing: feels physical, like setting something down. |
| `--ease-draw` | `cubic-bezier(.65,0,.35,1)` | Lines drawing, ink filling | Slow start and end, like a hand drawing a stroke. |
| `--t-quick` | 200 to 250ms | Hover, press | Instant enough to feel responsive. |
| `--t-settle` | 450 to 600ms | Reveals, rises | Long enough to be seen as an event. |
| `--t-draw` | 600 to 900ms | Gold lines, ink fill | Long enough to read as a gesture. |
| `--t-ambient` | 1200ms | Glow and era light | Lighting changes slowly in real rooms. |

### 10.2 Choreography

- **New painting:** painting fades in from a slight blur and 98.5% scale (like eyes focusing) → label rises → question → answers rise one after another, 50ms apart.
- **Answering:** the correct answer fills with ink left to right; a wrong pick shakes once (about 450ms, small amplitude) and turns dashed; verdict and description rise; Next rises last.
- **Buttons:** hover lifts 2px with a deeper shadow; press scales to 98.5%.
- **Score (Challenge):** a brief pulse to 118% and back when it increases. No counting-up animation (it delays information).

### 10.3 Reduced motion

Under `prefers-reduced-motion: reduce`, turn off all animations and transitions. Content must still appear in its final state. Test this explicitly.

## 11. Components

| Component | Notes |
| --- | --- |
| `Header` | Glass, sticky, wordmark, mode tabs (segmented, active = ink pill), progress ticks. |
| `ArtworkStage` | Owns the ambient glow, spotlight (with era light), corner marks, the painting button, the zoom hint. Never draws on the image. |
| `WallLabel` | Glass panel: italic title, title rule, artist, "Year · Medium", and after answering the movement name and description with drop cap. |
| `ChoiceList` | Five answer buttons with idle, answer, wrong, dim states (class names `is-idle`, `is-answer`, `is-wrong`, `is-dim`). Ink fill uses a `::before` layer scaled on X. |
| `ResultRow` | Identify grading row: field label, "You wrote ...", note, status badge (Correct = ink pill with check; Close = bronze outline with dash; Not quite = dashed muted with ×). |
| `NextButton` | Ink, 10px radius, gold arrow that slides 4px on hover, gold hover underline. |
| `ZoomView` | Frosted scrim, large image, glass caption pill, round glass close button that rotates 90° on hover. |
| `ProgressTicks` | 8 ticks, current is gold and 26px wide, transitions in width. |
| Arcade: `ScoreDisplay`, `Laurel`, `ScoreChips`, `SwiftLine`, `RankLadder`, `InitialsPlate`, `WallOfPatrons`, `Plaque` | See the Challenge mockups. |

## 12. Voice

UI copy reads like a well-written museum label: calm, short, precise. "Not quite. This is Rococo." rather than "Wrong!". "The wall is resting." rather than "Error 500". No exclamation points, no emoji, no em dashes.

## 13. Don'ts

- Don't draw anything on the painting.
- Don't use gold for text or for more than one "lead" at a time.
- Don't show movement color or era light before the answer.
- Don't use color alone to show status.
- Don't add gradients as decoration. (The only gradients allowed: the spotlight, the corner-mark line drawing technique, and the plaque shine.)
- Don't animate anything continuously (no looping pulses) except the swift line in Challenge.
- Don't add new colors, fonts, or radii outside this document without updating it first.
