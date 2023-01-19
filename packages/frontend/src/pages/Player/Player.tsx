import React from 'react'

import { useParams } from 'react-router-dom'
import SimplePlanetView from 'src/components/SimplePlanetView/SimplePlanetView'
import useResolveUsernames from 'src/lib/hooks/useResolveUsernames'
//import useFetchUserData from 'src/lib/hooks/useFetchUserData'

const Player = () => {
  const { id } = useParams()

  let userID: Array<string> = []
  if (id) {
    userID.push(id)
  }

  let [usernames, loadingUsernames] = useResolveUsernames(userID)

  let planets, loading //= useFetchUserData()

  if (loading || loadingUsernames) {
    return <>Loading...</>
  }
  return (
    <div>
      {/* {user && user.displayName} */}
      {planets && usernames && <SimplePlanetView planets={planets} usernames={usernames} />}
    </div>
  )
}

export default Player
