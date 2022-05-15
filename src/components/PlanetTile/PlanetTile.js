import React, { useEffect, useState } from "react"
import "./styles.css"
import UpgradeButton from "./Buttons/UpgradeButton"

import utc from "dayjs/plugin/utc"
import dayjs from "dayjs"

dayjs.extend(utc)

const PlanetTile = ({ planet, upgradeClick }) => {
  const upgradeFinishedTime = dayjs.utc(planet.upgradeFinishedTime)

  const [upgradeTimeLeft, setUpgradeTimeLeft] = useState(upgradeFinishedTime.subtract(dayjs.utc()))

  useEffect(() => {
    let timer = null
    console.log(planet)
    if (planet.upgrading) {
      timer = setInterval(() => {
        setUpgradeTimeLeft(upgradeFinishedTime.subtract(dayjs.utc()))
      }, 1000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [planet?.upgradeFinishedTime])

  return (
    <div className="PlanetTile">
      <div className="Definition">
        <img src={planet.imgsrc} alt="Planet" />
        <h3>{planet.name}</h3>
        <p>
          Level {planet.level}
          <br />
          <UpgradeButton text={!planet.upgrading ? "Upgrade" : upgradeTimeLeft.format("HH:mm:ss")} onClick={upgradeClick} />
        </p>
      </div>
    </div>
  )
}

export default PlanetTile
