// Wall label: the title, artist, and date beside the painting, like the
// printed card next to a work in a museum.
//
// Used by: the Sort screen (and later Identify, after grading).
// Why it exists as its own component: museum labels follow a fixed hierarchy
// (italic title, then artist, then date and medium), and every screen should
// show it the same way. After the student answers, the label opens to show
// the movement and Chase's description.

import './WallLabel.css'

// `movement` is passed only after the student answers. Before that the label
// must not hint at the movement in any way, including color.
export default function WallLabel({ painting, movement = null }) {
  const meta = [painting.year, painting.medium].filter(Boolean).join(' · ')
  return (
    // key: a new painting brings a new label, so it rises in again
    <section key={painting.id} className="wall-label glass" aria-label="Wall label">
      <h1 className="wall-label__title">{painting.title}</h1>
      <span className="wall-label__rule" aria-hidden="true" />
      <p className="wall-label__artist">{painting.artist.full}</p>
      <p className="wall-label__meta">{meta}</p>

      {movement && (
        <div className="wall-label__reveal">
          {/* Gold path, step 5: the diamond moves here, to the movement's name */}
          <p className="wall-label__movement lead">{movement.name}</p>
          <p className="wall-label__description">{painting.explanation}</p>
        </div>
      )}
    </section>
  )
}
