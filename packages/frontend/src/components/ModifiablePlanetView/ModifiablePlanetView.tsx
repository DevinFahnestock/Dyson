import React from 'react'
import useUserData from 'src/lib/hooks/useFetchUserData'
import useSocket from 'src/lib/hooks/useSocket'
import useToken from 'src/lib/hooks/useToken'
import { CheckCompleteUpgrade, UpdateResourceGeneration, UpgradePlanet } from 'src/lib/Networking/SocketEmitter'
import ModifiablePlanetTile from '../PlanetTile/ModifiablePlanetTile'

import './styles.css'

const ModifiablePlanetView = () => {
  const { planets } = useUserData()
  const { socket } = useSocket()
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
              collectClick={() => UpdateResourceGeneration(socket, planet.id, token)}
              upgradeClick={() => UpgradePlanet(socket, planet.id, token)}
              onUpgradeTimeComplete={() => CheckCompleteUpgrade(socket, planet.id, token)}
            />
          ))}
        {!planets && <>You have no Planets!</>}
      </div>
    </div>
  )
}

export default ModifiablePlanetView
