import { Planet } from '@dyson/shared/dist/Planet'
import { User } from '@firebase/auth'
import React, { useRef } from 'react'
import { SocketEmitter } from 'src/lib/Networking/SocketEmitter'

import { useParams } from 'react-router-dom'
import SimplePlanetView from 'src/components/SimplePlanetView/SimplePlanetView'
import useResolveUsernames from 'src/lib/hooks/useResolveUsernames'

type props = {
  socketEmitter: SocketEmitter
}

const Player = ({ socketEmitter }: props) => {
  const { id } = useParams()

  let userID: Array<String> = []
  if (id) {
    userID.push(id)
  }

  let { usernames, error } = useResolveUsernames(socketEmitter, userID)

  let userPageData = useRef<{ user: User; planets: Planet[] }>()

  // useEffect(() => {
  //   if (id) {
  //     console.log('getting users planets', userPageData)
  //   socketEmitter.GetUserPage(id)
  //   socketEmitter.socket.on(Socketcom.userPageData, (data) => {
  //     console.log(data)
  //     userPageData.current = data
  //   })
  //   }
  //   return () => {
  //     socketEmitter.socket.off('userPageData')
  //   }
  // }, [])

  return (
    <div>
      {userPageData?.current?.user && userPageData.current.user.displayName}
      {userPageData?.current?.planets && usernames && (
        <SimplePlanetView planets={userPageData.current.planets} usernames={usernames} />
      )}
      {usernames && (
        <ul>
          {Object.entries(usernames).map(([key, value]) => (
            <li key={key}>{value}</li>
          ))}
        </ul>
      )}
      {error && error}
    </div>
  )
}

export default Player
