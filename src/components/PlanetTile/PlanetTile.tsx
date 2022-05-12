import React from "react"
import UpgradeButton from "./Buttons/UpgradeButton"

const PlanetTile = ({ planet, upgradeClick}: any) => {
  return (
    <div className="PlanetTile">
      <div className="Definition">
        <img src={planet.imgsrc} alt="Planet" />
        <h3>{planet.type}</h3>
        <p>
          Level {planet.level}<br />
          <UpgradeButton text="Upgrade" onClick={upgradeClick} />
        </p>
      </div>
    </div>
  )
}

export default PlanetTile
