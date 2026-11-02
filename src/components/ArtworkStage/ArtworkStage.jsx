// Artwork stage: the painting hung on the wall, with the light around it.
//
// Used by: the Sort screen (and later Identify and Challenge).
// Why it exists as its own component: everything around the painting (the
// ambient glow, the gallery spotlight and its era light, the gold corner
// marks, the shadow, and the button that opens the zoom view) belongs
// together and must follow one rule from DESIGN.md: nothing is ever drawn on
// the painting itself. Keeping it all here makes that rule easy to see.

import { paintingImage, smallestImage } from '../../lib/images.js'
import './ArtworkStage.css'

// `lit` turns on the era light, which happens only after the student answers.
// `alt` replaces the painting's description when that description would give
// an answer away (Identify, before grading).
export default function ArtworkStage({ painting, lit = false, onZoom, alt }) {
  const image = paintingImage(painting)
  return (
    <div className={`artwork-stage${lit ? ' is-lit' : ''}`}>
      {/* Ambient glow: a heavily blurred copy of the painting tints the whole
          room, the way light bouncing off a canvas colors a gallery
          (DESIGN.md section 5.1). Decorative, so screen readers skip it. */}
      <img key={`glow-${painting.id}`} className="artwork-stage__glow" src={smallestImage(painting)} alt="" aria-hidden="true" />

      {/* Gallery spotlight from above, plus the era light that fades in over
          it after the answer (DESIGN.md sections 5.2 and 5.3) */}
      <div className="artwork-stage__spot" aria-hidden="true" />
      <div className="artwork-stage__era" aria-hidden="true" />

      <div className="artwork-stage__hang">
        {/* The painting is a button that opens the zoom view. key: a new
            painting is a new element, so its arrival animation plays again. */}
        <button key={painting.id} type="button" className="artwork-stage__button" onClick={onZoom} aria-label={alt ? 'View the painting larger' : `View ${painting.title} larger`}>
          <img
            className="artwork-stage__painting"
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes}
            width={image.width}
            height={image.height}
            alt={alt ?? image.alt}
            decoding="async"
            fetchPriority="high"
          />
        </button>
      </div>

      <p className="artwork-stage__hint">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.5 3.5M7 4.8v4.4M4.8 7h4.4" />
        </svg>
        Select the painting to view it larger
      </p>
    </div>
  )
}
