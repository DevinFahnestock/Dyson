import React from 'react'
import PlanetTile from '../PlanetTile/PlanetTile'

const PlanetView = ({ socket, user, planets }: any) => {

  return (
    <div className="Planetview">
        <h3>Planets:</h3>
        <div className="Planetgrid">
          {planets && planets.map((planet: any) => (
            <PlanetTile
              key={planet.id}
              planet={planet}
              upgradeClick={() => {
                socket.emit("upgradePlanet", {planetID: planet.id, userID: user.uid})
              }}
              onUpgradeTimeComplete={() => {
                socket.emit("checkCompleteUpgrade", {planetID: planet.id, userID: user.uid})
              }}
            />
          ))}
          {!planets && (<>You have no Planets!</>)}
        </div>
      </div>
  )
}

export default PlanetView