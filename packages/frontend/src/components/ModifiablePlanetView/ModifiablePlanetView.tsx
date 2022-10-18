import React from 'react'
import useToken from 'src/lib/hooks/useToken'
import ModifiablePlanetTile from '../PlanetTile/ModifiablePlanetTile'

import './styles.css'

const ModifiablePlanetView = ({ socketEmitter, planets }: any) => {
  const { token }: any = useToken()
  return (
    <div className='Planetview'>
      <h3>Planets:</h3>
      <div className='Planetgrid'>
        {planets &&
          planets.map((planet: any) => (
            <ModifiablePlanetTile
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

export default ModifiablePlanetView