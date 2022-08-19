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
  let [counters, setCounters] = useState<{ planets: number; users: number; warehouses: number }>({
    planets: 0,
    users: 0,
    warehouses: 0,
  })

  useEffect(() => {
    socketEmitter.TopTenPlanets(offset)
    socketEmitter.GetCounters()

    socketEmitter.socket.on('counters', (counters) => {
      setCounters(counters)
    })

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
    return () => {
      socketEmitter.socket.off('topTenUpdate')
      socketEmitter.socket.off('usernamesResolved')
      socketEmitter.socket.off('counters')
    }
  }, [offset])
  console.log('updating content')

  let pageNums = []
  for (let i = 0; i < counters.planets / 10; i++) {
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
