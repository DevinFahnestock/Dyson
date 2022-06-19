import React from 'react'
import PlanetTileSimpleView from '../PlanetTile/PlanetTileSimpleView'

import './styles.css'

const SimplePlanetView = ({ planets, user }: any) => {
  console.log(planets)
  return (
    <div className="PlanetView">
        <h3>Planets:</h3>
        <div className="Planetgrid">
          {planets && planets.map((planet: any) => (
            <PlanetTileSimpleView
              key={planet.id}
              planet={planet}
            />
          ))}
          {!planets && (<>No Planets Found!</>)}
        </div>
      </div>
  )
}

export default SimplePlanetView