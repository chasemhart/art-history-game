// All at once: eight works hung together, which the student sorts into five
// rooms, one per movement.
//
// Used by: App.jsx when the address is #/sort/all (the Sort tab's second
// view, beside "One at a time").
// Why it exists as its own file: this is the one mode where works are seen
// side by side. Comparing them is the lesson: a Rococo pastel next to a
// Realist field makes each look more like itself. The rules live in
// lib/groupSort.js; this file arranges the wall, the rooms, and the reveal.
//
// Two ways to move a work, both always available:
// - Drag it (mouse, or press and hold on a touch screen) and drop it in a room.
// - Tap it to lift it, then tap a room. This is also the keyboard way (Enter
//   to lift, Enter on a room), and the way for anyone who can't drag.
// Dragging uses dnd-kit, a small library that handles mouse and touch the
// same way, so this file only says what can be dragged and where it can land.

import { DndContext, DragOverlay, MouseSensor, TouchSensor, pointerWithin, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { useRef, useState } from 'react'
import NextButton from '../components/NextButton/NextButton.jsx'
import ZoomView from '../components/ZoomView/ZoomView.jsx'
import movements, { movementById } from '../data/movements.js'
import imageSizes from '../data/imageSizes.json'
import { paintingImage, smallestImage } from '../lib/images.js'
import './GroupSortScreen.css'

// How wide works appear: about a quarter of the page on wide screens, half
// on phones, and small thumbnails inside the rooms
const WALL_SIZES = '(min-width: 900px) 260px, 45vw'
const ROOM_SIZES = '96px'

// Where a drop lands: the wall, a room, or a room in the phone tray
const WALL = 'wall'
const TRAY = 'tray:'

// A work on the wall or in a room. Selecting it lifts it; once the set is
// checked, selecting it opens it large with Chase's description instead.
function Work({ painting, group, compact = false, onZoom, dragGuard }) {
  const { selected, checked, placements, select } = group
  const size = imageSizes[painting.id]
  const image = paintingImage(painting, { sizes: compact ? ROOM_SIZES : WALL_SIZES })
  const isSelected = selected === painting.id
  const placed = placements[painting.id]
  const misplaced = checked && placed && placed !== painting.movement && !(painting.alsoAccept ?? []).includes(placed)
  const inPlace = checked && placed && !misplaced
  // Any work can be dragged until the set is checked. Only the ref and the
  // pointer listeners are used: the button already has its own label and
  // keyboard behavior (tap to lift), which dnd-kit's defaults would replace.
  const { setNodeRef, listeners, isDragging } = useDraggable({ id: painting.id, disabled: checked })

  return (
    <figure
      className={`group-work${compact ? ' is-compact' : ''}${isSelected ? ' is-selected' : ''}${misplaced ? ' is-misplaced' : ''}${isDragging ? ' is-dragging' : ''}`}
    >
      {/* Every work gets an equal frame and hangs centered in it, so the wall
          keeps an even rhythm while each painting keeps its true shape */}
      <div className="group-work__frame">
        <button
          ref={setNodeRef}
          {...listeners}
          type="button"
          className="group-work__button"
          onClick={(event) => {
            // A drag that ends where it began also counts as a click; ignore it
            if (dragGuard.current) return
            // With another work lifted, a click on a hung work counts as a
            // click on its room, so let it pass through to the room
            if (compact && !checked && selected && selected !== painting.id) return
            event.stopPropagation()
            if (checked) onZoom(painting.id)
            else select(painting.id)
          }}
          aria-pressed={checked ? undefined : isSelected}
          aria-label={checked ? `View ${painting.title} larger` : `${isSelected ? 'Put down' : 'Pick up'} ${painting.title}`}
        >
          {/* draggable={false}: stop the browser's own image dragging, which
              would fight with ours */}
          <img
            className="group-work__image"
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes}
            width={size.width}
            height={size.height}
            alt={image.alt}
            draggable={false}
          />
        </button>
      </div>
      <figcaption className="group-work__caption">
        <cite className="group-work__title">{painting.title}</cite>
        {!compact && (
          <span className="group-work__artist">
            {painting.artist.last}
            {!checked && (
              <button type="button" className="group-work__zoom" onClick={() => onZoom(painting.id)} aria-label={`View ${painting.title} larger`}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3.5 3.5M7 4.8v4.4M4.8 7h4.4" />
                </svg>
              </button>
            )}
          </span>
        )}
        {/* After checking, every work says how it did: a word, not only a color */}
        {misplaced && <span className="group-work__belongs">Belongs in {movementById[painting.movement].name}</span>}
        {inPlace && (
          <span className="group-work__in-place">
            <svg aria-hidden="true" width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 6.5l2.5 2.5L10 3.5" />
            </svg>
            In place
          </span>
        )}
      </figcaption>
    </figure>
  )
}

// A room for one movement. With a work lifted or being dragged, the whole
// room is the place to set it down.
function Room({ movement, group, onZoom, dragging, dragGuard }) {
  const { paintings, placements, selected, checked, place } = group
  const hung = paintings.filter((p) => placements[p.id] === movement.id)
  const selectedPainting = paintings.find((p) => p.id === selected)
  const canPlace = selected !== null && !checked
  const { setNodeRef, isOver } = useDroppable({ id: movement.id, disabled: checked })
  // After checking, each room takes on its movement's colors and era light
  const colors = checked ? { '--movement-accent': movement.accent, '--movement-ink': movement.ink, '--era-light': movement.light } : undefined

  return (
    <section
      ref={setNodeRef}
      className={`group-room glass${canPlace || dragging ? ' is-open' : ''}${isOver ? ' is-over' : ''}${checked ? ' is-lit' : ''}`}
      style={colors}
      aria-label={`${movement.name} room`}
    >
      <button
        type="button"
        className="group-room__placard"
        onClick={() => canPlace && place(selected, movement.id)}
        aria-disabled={!canPlace || undefined}
        aria-label={canPlace ? `Hang ${selectedPainting.title} in the ${movement.name} room` : `${movement.name} room, ${hung.length} hung`}
      >
        <span className="group-room__name">{movement.name}</span>
        <span className="group-room__count">{hung.length || ''}</span>
      </button>
      {/* The room's whole wall takes a click too, for mouse users; the
          placard above is the labelled button keyboards and screen readers use */}
      <div className="group-room__works" onClick={canPlace ? () => place(selected, movement.id) : undefined}>
        {hung.map((p) => (
          <Work key={p.id} painting={p} group={group} compact onZoom={onZoom} dragGuard={dragGuard} />
        ))}
        {hung.length === 0 && <p className="group-room__empty">{canPlace || dragging ? 'Hang it here' : 'Empty'}</p>}
      </div>
    </section>
  )
}

// The wall itself is a drop target too, so a hung work can be dragged back
function Wall({ open, children }) {
  const { setNodeRef, isOver } = useDroppable({ id: WALL })
  return (
    <section ref={setNodeRef} className={`group-wall${open ? ' is-open' : ''}${isOver ? ' is-over' : ''}`} aria-label="The wall">
      {children}
    </section>
  )
}

// One room in the phone tray: a tap target and a drop target in one
function TrayRoom({ movement, onPlace }) {
  const { setNodeRef, isOver } = useDroppable({ id: TRAY + movement.id })
  return (
    <button ref={setNodeRef} type="button" className={`group-tray__room${isOver ? ' is-over' : ''}`} onClick={onPlace}>
      {movement.name}
    </button>
  )
}

export default function GroupSortScreen({ group }) {
  const { paintings, placements, selected, checked, allHung, correctCount, total, check, place, dealAgain } = group
  const [zoomedId, setZoomedId] = useState(null)
  // The work being dragged right now, if any
  const [draggingId, setDraggingId] = useState(null)
  // Set for a moment after a drag ends, so the click that follows is ignored
  const dragGuard = useRef(false)

  const onWall = paintings.filter((p) => !placements[p.id])
  const selectedPainting = paintings.find((p) => p.id === selected) ?? null
  const dragging = paintings.find((p) => p.id === draggingId) ?? null
  const zoomed = paintings.find((p) => p.id === zoomedId) ?? null

  // Mouse: a drag starts after moving 6 pixels, so an ordinary click still
  // lifts the work. Touch: press and hold briefly, so a swipe still scrolls.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
  )

  const titleOf = (id) => paintings.find((p) => p.id === id)?.title
  // Where a drop target sends the work: a room, or back to the wall (null)
  const roomFor = (targetId) => (targetId === WALL ? null : String(targetId).replace(TRAY, ''))
  const placeName = (targetId) => (roomFor(targetId) ? `the ${movementById[roomFor(targetId)].name} room` : 'the wall')

  // What screen readers hear during a drag, in plain words
  const announcements = {
    onDragStart: ({ active }) => `Picked up ${titleOf(active.id)}.`,
    onDragOver: ({ active, over }) => (over ? `${titleOf(active.id)} is over ${placeName(over.id)}.` : `${titleOf(active.id)} is not over a room.`),
    onDragEnd: ({ active, over }) => (over ? `Hung ${titleOf(active.id)} in ${placeName(over.id)}.` : `Put ${titleOf(active.id)} back where it was.`),
    onDragCancel: ({ active }) => `Put ${titleOf(active.id)} back where it was.`,
  }

  function endDrag({ active, over }) {
    setDraggingId(null)
    if (over) place(active.id, roomFor(over.id))
    dragGuard.current = true
    setTimeout(() => (dragGuard.current = false), 0)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={({ active }) => setDraggingId(active.id)}
      onDragEnd={endDrag}
      onDragCancel={() => setDraggingId(null)}
      accessibility={{ announcements }}
    >
      <main className="screen group-sort">
        <header className="group-sort__intro">
          {checked ? (
            <p className="group-sort__verdict" role="status">
              You hung {correctCount} of {total} in the right rooms.
            </p>
          ) : (
            // Gold path: the diamond marks the instruction to follow first
            <p className="group-sort__prompt lead">Hang each work in its room.</p>
          )}
          {!checked && !selectedPainting && (
            <p className="group-sort__hint">Drag a work into a room, or select it and then select a room.</p>
          )}
          {!checked && selectedPainting && (
            <p className="group-sort__hint" aria-live="polite">
              <cite>{selectedPainting.title}</cite> is lifted. Choose a room{placements[selected] ? ', or return it to the wall' : ''}.{' '}
              {/* On phones this is the way to look closer, since the small
                  works there have no magnifier of their own */}
              <button type="button" className="group-sort__hint-zoom" onClick={() => setZoomedId(selected)}>
                View it larger
              </button>
            </p>
          )}
        </header>

        {/* The wall: works not yet hung in a room */}
        {!checked && (
          <Wall open={(selected && placements[selected]) || (dragging && placements[draggingId])}>
            {onWall.map((p) => (
              <Work key={p.id} painting={p} group={group} onZoom={setZoomedId} dragGuard={dragGuard} />
            ))}
            {onWall.length === 0 && (
              <p className="group-wall__done">Every work is hung. Move any you like, then check the exhibition.</p>
            )}
            {/* A hung work can come back: with one lifted, the wall takes it */}
            {selected && placements[selected] && (
              <button type="button" className="quiet-button group-wall__return" onClick={() => place(selected, null)}>
                Return to the wall
              </button>
            )}
          </Wall>
        )}

        {!checked && allHung && (
          <div className="group-sort__check">
            <NextButton onClick={check}>Check the exhibition</NextButton>
          </div>
        )}

        <div className="group-rooms">
          {movements.map((m) => (
            <Room key={m.id} movement={m} group={group} onZoom={setZoomedId} dragging={dragging !== null} dragGuard={dragGuard} />
          ))}
        </div>

        {checked && (
          <div className="group-sort__again">
            <NextButton onClick={dealAgain}>Hang another set</NextButton>
          </div>
        )}

        {/* Phones: with a work lifted or being dragged, the five rooms slide
            up within reach of the thumb, as buttons and as drop targets */}
        {!checked && (selectedPainting || dragging) && (
          <nav className="group-tray glass" aria-label="Rooms">
            {movements.map((m) => (
              <TrayRoom key={m.id} movement={m} onPlace={() => selected && place(selected, m.id)} />
            ))}
          </nav>
        )}

        {/* The work in hand: a lifted copy follows the pointer while a faint
            ghost keeps its place on the wall. No animation on drop: it simply
            arrives in its room. */}
        <DragOverlay dropAnimation={null}>
          {dragging && (
            <div className="group-drag">
              <img src={smallestImage(dragging)} alt="" draggable={false} />
            </div>
          )}
        </DragOverlay>

        {zoomed && (
          <ZoomView
            painting={zoomed}
            open
            onClose={() => setZoomedId(null)}
            // Chase's description joins the caption once the set is checked
            description={checked ? zoomed.explanation : null}
          />
        )}
      </main>
    </DndContext>
  )
}
