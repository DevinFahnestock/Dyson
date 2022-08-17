import React from 'react'
import PlanetTile from '../PlanetTile/PlanetTile'

import './styles.css'

const PlanetView = ({ onUpgradeTimeComplete, upgradeClick, collectClick, planets, user, socket }: any) => {
  return (
    <div className='Planetview'>
      <h3>Planets:</h3>
      <div className='Planetgrid'>
        {planets &&
          planets.map((planet: any) => (
            <PlanetTile
              key={planet.id}
              planet={planet}
              collectClick={() => collectClick(planet.id, user.id)}
              upgradeClick={() => upgradeClick(planet.id, user.id)}
              onUpgradeTimeComplete={() => onUpgradeTimeComplete(planet.id, user.id)}
            />
          ))}
        {!planets && <>You have no Planets!</>}
      </div>
    </div>
  )
}

export default PlanetView
