import { Planet } from '@dyson/shared/dist/Planet'
import { User } from '@firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { SocketEmitter } from 'src/lib/Networking/SocketEmitter'

import { useParams } from 'react-router-dom'
import SimplePlanetView from 'src/components/PlanetView/SimplePlanetView'

type props = {
  socketEmitter: SocketEmitter
}

const Player = ({ socketEmitter }: props) => {
  const { id } = useParams()

  function getUserPageData(id: string) {
    console.log('fetching user data')
    socketEmitter.GetUserPage(id)
    socketEmitter.socket.on('userPageData', (data) => {
      userPageData.current = data
    })
  }

  let userPageData = useRef<{ user: User; planets: Planet[] }>()
  let [usernames, setUsernames] = useState<String[]>()

  useEffect(() => {
    if (id) {
      getUserPageData(id)
      if (userPageData?.current?.user) {
        let userIDs: string[] = []
        userIDs.push(userPageData.current.user.uid)
        socketEmitter.ResolveUserNames(userIDs)
        socketEmitter.socket.on('usernamesResolved', (data: any) => {
          setUsernames(data)
        })
      }
    }
    return () => {
      socketEmitter.socket.off('userPageData')
    }
  }, [setUsernames, userPageData.current])

  return (
    <div>
      {userPageData?.current?.user && userPageData.current.user.displayName}
      {userPageData?.current?.planets && usernames && (
        <SimplePlanetView planets={userPageData.current.planets} usernames={usernames} />
      )}
    </div>
  )
}

export default Player
