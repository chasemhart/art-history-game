// The frame of the app: the header, then whichever screen the address asks for.
//
// Used by: main.jsx, which puts it on the page.
// Why it exists as its own file: it is the one place that decides which
// screen is showing and holds the state screens share. Each study mode has
// its own round (switching tabs mid-round never mixes them up), and the
// header and review screens read from whichever round belongs to the screen.

import { useEffect } from 'react'
import Header from './components/Header/Header.jsx'
import ViewSwitch from './components/ViewSwitch/ViewSwitch.jsx'
import paintings from './data/paintings.js'
import { isCorrectMovement, isFullyIdentified, useRound } from './lib/round.js'
import { useGroupSort } from './lib/groupSort.js'
import { modeOf, useHashRoute } from './lib/useHashRoute.js'
import IdentifyScreen from './screens/IdentifyScreen.jsx'
import PlaceholderScreen from './screens/PlaceholderScreen.jsx'
import ReviewScreen from './screens/ReviewScreen.jsx'
import GroupSortScreen from './screens/GroupSortScreen.jsx'
import SortScreen from './screens/SortScreen.jsx'
import './App.css'

const PAGE_TITLES = {
  sort: 'Sort by movement',
  'sort/all': 'All at once',
  identify: 'Identify',
  review: 'Your round',
  'identify/review': 'Your round',
}

export default function App() {
  const route = useHashRoute()
  const sortRound = useRound(paintings, isCorrectMovement)
  const identifyRound = useRound(paintings, isFullyIdentified)
  // All at once keeps its own state, so switching views never loses a set
  const group = useGroupSort(paintings)
  const mode = modeOf(route)
  const round = mode === 'identify' ? identifyRound : sortRound

  // Name the browser tab after the screen, which also tells screen reader
  // users where they have landed
  useEffect(() => {
    document.title = `${PAGE_TITLES[route]} · Art History Study`
    // A new screen starts at the top, as a new page would
    window.scrollTo(0, 0)
  }, [route])

  // Starting a new round always returns to that mode's first screen
  function startOver(deal) {
    deal()
    window.location.hash = `#/${mode}`
  }

  const isReview = route === 'review' || route === 'identify/review'

  // What the header's progress counts: paintings seen, or works hung
  const progress = isReview
    ? null
    : route === 'sort/all'
      ? { label: `${group.hung} of ${group.total} hung`, position: group.hung + 1, total: group.total }
      : { label: `Painting ${round.position} of ${round.total}`, position: round.position, total: round.total }

  return (
    <div className="app">
      <Header route={route} progress={progress} />

      {/* The Sort tab's two views share it: one painting at a time, or the wall */}
      {(route === 'sort' || route === 'sort/all') && <ViewSwitch route={route} />}

      {route === 'sort' && <SortScreen round={sortRound} onFinish={() => (window.location.hash = '#/review')} />}

      {route === 'sort/all' && <GroupSortScreen group={group} />}

      {route === 'identify' && (
        // key: each painting gets a fresh Identify screen, so the fields and
        // grades from the last painting can never carry over
        <IdentifyScreen
          key={identifyRound.current.id}
          round={identifyRound}
          onFinish={() => (window.location.hash = '#/identify/review')}
        />
      )}

      {isReview &&
        (round.isFinished ? (
          <ReviewScreen
            mode={mode}
            results={round.results}
            onStudyAnother={() => startOver(round.dealAgain)}
            onReviewMissed={() => startOver(round.dealMissed)}
          />
        ) : (
          <PlaceholderScreen title="Your round">Finish a round to review it here.</PlaceholderScreen>
        ))}
    </div>
  )
}
