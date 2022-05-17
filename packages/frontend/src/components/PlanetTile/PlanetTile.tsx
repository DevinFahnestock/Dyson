import React, { useRef, useEffect } from "react"
import "./styles.css"
import UpgradeButton from "./Buttons/UpgradeButton"

import { PlanetType } from "../../lib/shared"

import CelestialBodyRenderer from "./CelestialBodyRenderer"
import LavaPlanet from "src/lib/pixelPlanets/bodies/planets/prototypes/LavaPlanet"
import { CelestialBody } from "src/lib/pixelPlanets/core"
import WetPlanet from "src/lib/pixelPlanets/bodies/planets/prototypes/WetPlanet"
import AtmospherelessPlanet from "src/lib/pixelPlanets/bodies/planets/prototypes/AtmospherelessPlanet"

interface PlanetTileProps {
  planet: any
  upgradeClick: () => void
  onUpgradeTimeComplete: () => void
}

const getPlanet = (planet: any): CelestialBody => {

  switch (planet.type) {
    case PlanetType.Wet:
      return new WetPlanet(planet.seed)

    case PlanetType.Lava:
      return new LavaPlanet(planet.seed)

    case PlanetType.NoAtmosphere:
      return new AtmospherelessPlanet(planet.seed)

    default:
      return new AtmospherelessPlanet(planet.seed)
  }
}

const PlanetTile = ({ planet, upgradeClick, onUpgradeTimeComplete }: PlanetTileProps) => {

  const planetRef = useRef<CelestialBody>()

  useEffect(() => {
    planetRef.current = getPlanet(planet)
  })

  return (
    <div className="PlanetTile">
      <div className="Definition">
        {planetRef.current && (<CelestialBodyRenderer celestialBody={planetRef.current} />)}
        <h3>{planet.name}</h3>
        <div>
          Level {planet.level}
          <br />
          <UpgradeButton onClick={upgradeClick} onUpgradeTimeComplete={onUpgradeTimeComplete} planet={planet} />
        </div>
      </div>
    </div>
  )
}

export default PlanetTile
