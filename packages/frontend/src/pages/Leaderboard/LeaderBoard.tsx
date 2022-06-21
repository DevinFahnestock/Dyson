import { Planet } from '@dyson/shared/dist/Planet'
import React, { useEffect, useRef } from 'react'
import SimplePlanetView from 'src/components/PlanetView/SimplePlanetView'

const LeaderBoard = ({ socketRef }: any) => {
  let planets = useRef<Array<Planet>>()

  socketRef?.current?.emit('topTenPlanets')

  useEffect(() => {
    socketRef?.current?.on('topTenUpdate', (data: any) => {
      planets.current = data
    })
    return () => {
      socketRef?.current?.off('')
    }
  })

  let userIds
  const planetsList = planets.current
  if (planetsList) {
    userIds = planetsList
  }

  socketRef?.current?.emit('topTenPlanets')
  socketRef?.current?.emit('resolveUserNames', userIds)

  return (
    <div>
      Rankings
      <div className='UIdisplay'>{planets && <SimplePlanetView planets={planets.current} />}</div>
    </div>
  )
}

export default LeaderBoard

//topTenPlanets
