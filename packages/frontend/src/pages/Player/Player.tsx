import { Planet } from '@dyson/shared/dist/Planet'
import { User } from '@firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { SocketEmitter } from 'src/lib/Networking/SocketEmitter'

import { useParams } from 'react-router-dom'
import SimplePlanetView from 'src/components/SimplePlanetView/SimplePlanetView'
import { Socketcom } from '@dyson/shared/dist/Socketcom'

type props = {
  socketEmitter: SocketEmitter
}

const Player = ({ socketEmitter }: props) => {
  const { id } = useParams()

  const getUserPageData = (id: string) => {
    socketEmitter.GetUserPage(id)
    socketEmitter.socket.on(Socketcom.userPageData, (data) => {
      console.log(data)
      userPageData.current = data
    })
  }

  let userPageData = useRef<{ user: User; planets: Planet[] }>()
  let [usernames, setUsernames] = useState<String[]>()

  useEffect(() => {
    if (id) {
      console.log('getting users planets', userPageData)
      getUserPageData(id)
    }
    return () => {
      socketEmitter.socket.off('userPageData')
    }
  }, [setUsernames])

  useEffect(() => {
    if (userPageData.current) {
      let userIDs: string[] = []
      userIDs.push(userPageData.current.user.uid)
      socketEmitter.ResolveUserNames(userIDs)
      socketEmitter.socket.on(Socketcom.usernamesResolved, (data: any) => {
        setUsernames(data)
        console.log(data)
      })
    }
  }, [])

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
