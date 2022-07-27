import { Planet } from '@dyson/shared/dist/Planet'
import React, { useEffect, useRef, useState } from 'react'
import SimplePlanetView from 'src/components/PlanetView/SimplePlanetView'

const LeaderBoard = ({ socketRef }: any) => {
  let planets = useRef<Planet[]>()
  let [usernames, setUsernames] = useState<String[]>()

  console.log('top planets: ', planets.current)

  useEffect(() => {
    if (!planets.current) {
      socketRef?.current?.emit('topTenPlanets')

      socketRef?.current?.on('topTenUpdate', (data: any) => {
        planets.current = data
        let userIDs: String[] = []
        if (planets.current) {
          planets.current.forEach((planet) => {
            userIDs.push(planet.owner)
          })
        }
        socketRef?.current?.emit('resolveUserNames', userIDs)
        socketRef?.current?.on('usernamesResolved', (data: any) => {
          setUsernames(data)
        })
      })
    }
    return () => {
      socketRef?.current?.off('topTenUpdate')
      socketRef?.current?.off('usernamesResolved')
    }
  }, [])

  return (
    <div>
      Rankings
      <div className='UIdisplay'>
        {planets.current && usernames && <SimplePlanetView planets={planets.current} usernames={usernames} />}
      </div>
    </div>
  )
}

export default LeaderBoard

//topTenPlanets
