import React from 'react'
import './styles.css'

import CelestialBodyRenderer from './CelestialBodyRenderer'

interface PlanetTileProps {
  planet: any
}

const PlanetTileSimpleView = ({ planet }: PlanetTileProps) => {
  return (
    <div className='PlanetTile'>
      <div className='Definition'>
        <CelestialBodyRenderer type={planet.type} seed={planet.seed} />
        <h3>{planet.name}</h3>
        <div className='SimpleDescription'>
          Level {planet.level} <br />
          Owner: {planet.owner}
        </div>
      </div>
    </div>
  )
}

export default PlanetTileSimpleView
