import React from 'react'
import PlanetTile from '../PlanetTile/PlanetTile'

const PlanetView = ({ onUpgradeTimeComplete, upgradeClick, planets }: any) => {

  return (
    <div className="Planetview">
        <h3>Planets:</h3>
        <div className="Planetgrid">
          {planets && planets.map((planet: any) => (
            <PlanetTile
              key={planet.id}
              planet={planet}
              upgradeClick={() => upgradeClick(planet.id)}
              onUpgradeTimeComplete={() => onUpgradeTimeComplete(planet.id)
              }
            />
          ))}
          {!planets && (<>You have no Planets!</>)}
        </div>
      </div>
  )
}

export default PlanetView