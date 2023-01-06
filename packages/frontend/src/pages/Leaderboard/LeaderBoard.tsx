import React, { useEffect } from 'react'
import SimplePlanetView from 'src/components/SimplePlanetView/SimplePlanetView'
import useResolveUsernames from 'src/lib/hooks/useResolveUsernames'

import './styles.css'
import useLeaderboard from 'src/lib/hooks/useLeaderboard'
import useCounters from 'src/lib/hooks/useCounters'
import useOffset from 'src/lib/hooks/useOffset'

const LeaderBoard = () => {
  const [offset, setOffset] = useOffset(0)
  const [leaderboard, loading, updateLeaderboardOffset] = useLeaderboard(offset)
  const [usernames, usernamesLoading, setUserIDs, clearUsernames] = useResolveUsernames()
  const [counters] = useCounters()

  useEffect(() => {
    updateLeaderboardOffset(offset)
    clearUsernames()
  }, [offset])

  useEffect(() => {
    if (leaderboard && !loading) {
      let userIDs: String[] = []
      leaderboard.forEach((planet) => {
        userIDs.push(planet.owner)
      })
      if (userIDs.length > 0) {
        setUserIDs(userIDs)
      }
    }
  }, [leaderboard])

  let pageNums = []
  for (let i = 0; i < counters.planets / 10; i++) {
    pageNums.push(
      <a key={i} onClick={() => setOffset(i * 10)}>
        {i + 1}
      </a>
    )
  }

  if (loading || usernamesLoading || !usernames || Object.keys(usernames)?.length < 1) {
    return <>Loading...</>
  }

  return (
    <div className='UIdisplay'>
      <div className='Navigation'>
        Rankings
        <div className='PageNumbers'>{pageNums}</div>
      </div>
      {leaderboard && usernames && <SimplePlanetView planets={leaderboard} usernames={usernames} />}
    </div>
  )
}

export default LeaderBoard
