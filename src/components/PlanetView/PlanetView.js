import React from 'react'
import PlanetTile from '../PlanetTile/PlanetTile'

const PlanetView = ({ socket, user, planets }) => {
  return (
    <div className="Planetview">
        <h3>Planets:</h3>
        <div className="Planetgrid">
          {planets && planets.map((planet) => (
            <PlanetTile
              key={planet.id}
              planet={planet}
              upgradeClick={() => {
                socket.emit("upgradePlanet", {planetID: planet.id, userUID: user.uid})
              }}
            />
          ))}
          {!planets && (<>You have no Planets!</>)}
        </div>
      </div>
  )
}

export default PlanetView