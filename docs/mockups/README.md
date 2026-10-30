# Mockups

These are the approved design prototypes, exported from the design canvas where they were made. They are **reference, not app code**: match their look, layout, copy, and motion, but build the real app from the structure in `ARCHITECTURE.md`.

| File | What it shows | Branch |
| --- | --- | --- |
| `Modern-Sort.dc.html` | Sort mode on desktop, with the full gold path, gallery light, corner marks, ambient glow, glass, answer states, zoom view. **The most complete reference for the whole design system.** | `study-redesign` |
| `Modern-Phone.dc.html` | Identify mode on a phone: title, artist, and movement fields, working grading, result rows. Predates the gold path; apply `DESIGN.md` section 8.2. | `study-redesign` |
| `Challenge-Play.dc.html` | Challenge mode play screen: score, laurel streak, swift bonus line, score chips. Predates the gold path; apply it. | `arcade` |
| `Challenge-End.dc.html` | Round end: score, rank ladder, stats, initials plate, Wall of Patrons. | `arcade` |

## How to read these files

They use a small template format called Design Components:

- Everything between `<x-dc>` and `</x-dc>` is the markup.
- `<helmet><style>` holds the CSS. **This CSS is the most precise source** for colors, shadows, easing curves, and timings. Carry the values into `src/styles/tokens.css` and component `.css` files.
- `{{name}}` is a value filled in from the script at the bottom, the way React fills in `{name}`.
- `<sc-if value="{{flag}}">` shows its contents only when the flag is true, like `{flag && (...)}` in React.
- `<sc-for list="{{items}}" as="item">` repeats its contents for each item, like `items.map(...)` in React.
- The script at the bottom (`class Component extends DCLogic`) holds the state and logic. Its grading and scoring code is a working sketch of `src/lib/grading.js` and `src/lib/scoring.js`; rewrite it cleanly with tests rather than copying it.
- `./support.js` is the prototype runtime and is not included. The files will not run on their own; read them as source.

Image paths point at Chase's original files in `public/images/`. The prototypes use only four paintings (The Swing, Wanderer above the Sea of Fog, The Gleaners, The Raft of the Medusa) to demonstrate the flow.

## Known differences between the mockups and the spec

Where they disagree, `PRD.md` and `DESIGN.md` win:

- The mockups show sample progress ("Painting 3 of 8") and sample scores; the real app computes these.
- Movement accent colors and era lighting (`DESIGN.md` section 7) are not in the mockups yet.
- The Challenge leaderboard in the mockup uses made-up entries.
- The Sort mockup's layout uses `flex: 999 1 560px` for the painting column; keep that, it is what lets the layout stack cleanly on phones.
