import React from "react"

const PlanetTile = ({ planet }) => {
  return (
    <div className="PlanetTile">
      <div className="Definition">
        <img src={planet.imgsrc} alt="Planet" />
        {planet.type}
      </div>
    </div>
  )
}

export default PlanetTile
