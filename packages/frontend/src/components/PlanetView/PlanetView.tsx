import React from 'react'
import PlanetTile from '../PlanetTile/PlanetTile'

import './styles.css'

const PlanetView = ({ onUpgradeTimeComplete, upgradeClick, planets, user, socket }: any) => {
  console.log(user, socket)

  return (
    <div className='Planetview'>
      <h3>Planets:</h3>
      <div className='Planetgrid'>
        {planets &&
          planets.map((planet: any) => (
            <PlanetTile
              key={planet.id}
              planet={planet}
              upgradeClick={() => upgradeClick(planet.id, socket, user)}
              onUpgradeTimeComplete={() => onUpgradeTimeComplete(planet.id, socket, user)}
            />
          ))}
        {!planets && <>You have no Planets!</>}
      </div>
    </div>
  )
}

export default PlanetView
