import React from 'react'
import PlanetTile from '../PlanetTile/PlanetTile'

import './styles.css'

const PlanetView = ({ socketEmitter, planets, user }: any) => {
  return (
    <div className='Planetview'>
      <h3>Planets:</h3>
      <div className='Planetgrid'>
        {planets &&
          planets.map((planet: any) => (
            <PlanetTile
              key={planet.id}
              planet={planet}
              collectClick={() => {
                socketEmitter.UpdateResourceGeneration(planet.id, user.uid)
              }}
              upgradeClick={() => socketEmitter.UpgradePlanet(planet.id, user.uid)}
              onUpgradeTimeComplete={() => socketEmitter.CheckForCompleteUpgrade(planet.id, user.uid)}
            />
          ))}
        {!planets && <>You have no Planets!</>}
      </div>
    </div>
  )
}

export default PlanetView
