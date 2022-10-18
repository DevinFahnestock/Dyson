import React from 'react'
import SimplePlanetTile from '../SimplePlanetTile/SimplePlanetTile'

import './styles.css'

const SimplePlanetView = ({ planets, usernames }: any) => {
  return (
    <div className='PlanetView'>
      <div className='Planetgrid'>
        {planets &&
          planets.map((planet: any) => (
            <SimplePlanetTile key={planet.id} planet={planet} username={usernames[planet.owner]} />
          ))}
        {!planets && <>No Planets Found!</>}
      </div>
    </div>
  )
}

export default SimplePlanetView
