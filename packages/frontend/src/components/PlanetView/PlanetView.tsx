import React from 'react'
import useToken from 'src/lib/gameData/useToken'
import PlanetTile from '../PlanetTile/PlanetTile'

import './styles.css'

const PlanetView = ({ socketEmitter, planets }: any) => {
  const { token }: any = useToken()
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
                socketEmitter.UpdateResourceGeneration(planet.id, token)
              }}
              upgradeClick={() => socketEmitter.UpgradePlanet(planet.id, token)}
              onUpgradeTimeComplete={() => socketEmitter.CheckCompleteUpgrade(planet.id, token)}
            />
          ))}
        {!planets && <>You have no Planets!</>}
      </div>
    </div>
  )
}

export default PlanetView
