import React from 'react'
import './styles.css'

import CelestialBodyRenderer from '../CelestialBodyRenderer'

interface PlanetTileProps {
  planet: any
  username: String
}

const SimplePlanetTile = ({ planet, username }: PlanetTileProps) => {
  return (
    <div className='PlanetTile'>
      <div className='Definition'>
        <CelestialBodyRenderer type={planet.type} seed={planet.seed} />
        <h3>{planet.name}</h3>
        <div className='SimpleDescription'>
          Level {planet.level} <br />
          <div className='ownertag'>
            Owner: <a href={`/player/${planet.owner}`}>{username}</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimplePlanetTile
