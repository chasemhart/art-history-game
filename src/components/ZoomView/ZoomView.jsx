// Zoom view: the painting shown large over a frosted scrim, for looking closely.
//
// Used by: the Sort screen, when the student selects the painting.
// Why it exists as its own component: an overlay has accessibility rules of
// its own. Focus must move into it, stay inside it, close with Escape, and
// return to the painting afterward. It's built on the browser's own <dialog>
// element, which provides all four, so there is no hand-written focus code
// to get wrong.

import { useEffect, useRef } from 'react'
import { paintingImage } from '../../lib/images.js'
import './ZoomView.css'

// `revealed` is false in Identify before grading: the caption and the alt text
// would name the work, so both stay neutral until then.
// `description`, when given, shows Chase's text under the caption (All at
// once uses it after the set is checked).
export default function ZoomView({ painting, open, onClose, revealed = true, description = null }) {
  const dialogRef = useRef(null)
  // In the zoom view the painting can fill most of the screen, so ask for
  // the largest copy that suits the window
  const image = paintingImage(painting, { sizes: '90vw' })

  // React says whether it should be open; the browser does the opening, which
  // is what makes it a true modal (everything behind it becomes inert)
  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="zoom-view"
      aria-label={revealed ? `${painting.title}, enlarged` : 'The painting, enlarged'}
      // Escape closes a dialog by itself; this keeps React's state in step
      onClose={onClose}
      // A click on the dialog itself (the frosted area around the painting,
      // not the painting or caption) closes it, like stepping back
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <button type="button" className="zoom-view__close glass" onClick={onClose} aria-label="Close">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
        </svg>
      </button>
      <figure className="zoom-view__figure">
        <img
          className="zoom-view__image"
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.sizes}
          width={image.width}
          height={image.height}
          alt={revealed ? image.alt : 'The painting to identify'}
        />
        {revealed && (
          <figcaption className="zoom-view__caption glass">
            <cite className="zoom-view__title">{painting.title}</cite>
            {' · '}
            {[painting.artist.full, painting.year].filter(Boolean).join(', ')}
          </figcaption>
        )}
        {description && <p className="zoom-view__description glass">{description}</p>}
      </figure>
    </dialog>
  )
}
