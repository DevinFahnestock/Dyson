import { Planet } from '@dyson/shared/dist/Planet'
import React, { useEffect, useRef, useState } from 'react'
import SimplePlanetView from 'src/components/PlanetView/SimplePlanetView'
import { SocketEmitter } from 'src/lib/Networking/SocketEmitter'

type props = {
  socketEmitter: SocketEmitter
}

const LeaderBoard = ({ socketEmitter }: props) => {
  let planets = useRef<Planet[]>()
  let [usernames, setUsernames] = useState<String[]>()
  let [offset, setOffset] = useState<number>(0)

  useEffect(() => {
    // if (!planets.current) {
    socketEmitter.TopTenPlanets(offset)

    socketEmitter.socket.on('topTenUpdate', (data: any) => {
      planets.current = data
      let userIDs: String[] = []
      if (planets.current) {
        planets.current.forEach((planet) => {
          userIDs.push(planet.owner)
        })
      }
      socketEmitter.ResolveUserNames(userIDs)
      socketEmitter.socket.on('usernamesResolved', (data: any) => {
        setUsernames(data)
      })
    })
    // }
    return () => {
      socketEmitter.socket.off('topTenUpdate')
      socketEmitter.socket.off('usernamesResolved')
    }
  }, [offset])
  console.log('updating content')

  let pageNums = []
  for (let i = 0; i < 10; i++) {
    pageNums.push(<a onClick={() => setOffset(i * 10)}>{i + 1}</a>)
  }

  return (
    <div>
      Rankings
      {pageNums}
      <div className='UIdisplay'>
        {planets.current && usernames && <SimplePlanetView planets={planets.current} usernames={usernames} />}
      </div>
    </div>
  )
}

export default LeaderBoard
