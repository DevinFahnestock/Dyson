import React, { useEffect, useState } from "react"
import "./styles.css"
import UpgradeButton from "./Buttons/UpgradeButton"

import utc from "dayjs/plugin/utc"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from "dayjs"
import { Socket } from "socket.io-client"

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(relativeTime)

interface PlanetTileProps {planet: any, upgradeClick: () => void, socket: Socket}

const PlanetTile = ({ planet, upgradeClick, socket }:PlanetTileProps) => {
  const upgradeFinishedTime = dayjs.utc(planet.upgradeFinishedTime)

  const [upgradeTimeLeft, setUpgradeTimeLeft] = useState<string>()

  const setTimerinfo = () => {
    //planet.upgrading && console.log(upgradeFinishedTime.subtract(dayjs.utc()), dayjs.utc(), upgradeFinishedTime)

    const durationLeft = dayjs.duration(upgradeFinishedTime.diff(dayjs.utc()))

    const hoursLeft = durationLeft.get("hours")
    const minutesLeft = durationLeft.get("minutes")

    let timerText = ""

    if (durationLeft.asSeconds() > 0) {
      if (hoursLeft > 0) {
        timerText = durationLeft.format("H:mm:ss")
      } else if (minutesLeft > 0) {
        timerText = durationLeft.format("m:ss")
      } else {
        timerText = durationLeft.asSeconds() > 1 ? durationLeft.format("s") + " seconds" : durationLeft.format("s") + " second"
      }
    } else {
      timerText = "Finished"
    }

    if (durationLeft.asSeconds() <= 0) {
      // upgrade should be complete
      socket.emit("checkCompleteUpgrade", planet.id)
    }

    return timerText
  }

  useEffect(() => {
    let timer: null|NodeJS.Timer = null
    if (planet.upgrading) {
      setUpgradeTimeLeft(setTimerinfo())
      timer = setInterval(() => {
        setUpgradeTimeLeft(setTimerinfo())
      }, 1000)
    }
    return () => {
      timer && clearInterval(timer)
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
          <UpgradeButton text={!planet.upgrading ? "Upgrade" : upgradeTimeLeft} onClick={upgradeClick} />
        </p>
      </div>
    </div>
  )
}

export default PlanetTile
