import React from 'react'
import { SocketEmitter } from 'src/lib/Networking/SocketEmitter'

import { useParams } from 'react-router-dom'
import SimplePlanetView from 'src/components/SimplePlanetView/SimplePlanetView'
import useResolveUsernames from 'src/lib/hooks/useResolveUsernames'
import useFetchUserPageData from 'src/lib/hooks/useFetchUserPageData'

type props = {
  socketEmitter: SocketEmitter
}

const Player = ({ socketEmitter }: props) => {
  const { id } = useParams()

  let userID: Array<String> = []
  if (id) {
    userID.push(id)
  }

  let [usernames, loadingUsernames] = useResolveUsernames(socketEmitter, userID)

  let [userPageData, loading] = useFetchUserPageData(socketEmitter, id)

  if (loading || loadingUsernames) {
    return <>Loading...</>
  }
  return (
    <div>
      {userPageData.user && userPageData.user.displayName}
      {userPageData.planets && usernames && <SimplePlanetView planets={userPageData.planets} usernames={usernames} />}
    </div>
  )
}

export default Player
