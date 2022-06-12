import React, { useEffect, useState } from "react"
import "./styles.css"

import utc from "dayjs/plugin/utc"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from "dayjs"

import UpgradeCosts from '../../../lib/upgrade-costs.json'
import useWarehouse from "src/lib/gameData/useWarehouse"

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(relativeTime)

const UpgradeButton = ({ onClick, planet, onUpgradeTimeComplete }: any) => {
  const upgradeFinishedTime = dayjs.utc(planet.upgradeFinishedTime)
  const [upgradeTimeLeft, setUpgradeTimeLeft] = useState<string>()

  const { warehouse }: any =useWarehouse()



  const setTimerinfo = (timer: null | NodeJS.Timer) => {
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
        timerText =
          durationLeft.asSeconds() > 1
            ? durationLeft.format("s") + " seconds"
            : durationLeft.format("s") + " second"
      }
    } else {
      timerText = "Finished"
      timer && clearInterval(timer)
      onUpgradeTimeComplete?.()
    }

    return timerText;
  }

  const nextLevelReq = UpgradeCosts[planet.level + 1]

  const resourcesMet = () => {
    if (nextLevelReq.food >= warehouse.food) { return false }
    if (nextLevelReq.metal >= warehouse.metal) { return false }
    if (nextLevelReq.money >= warehouse.money) { return false }
    if (nextLevelReq.organic >= warehouse.organic) { return false }
    return true 
  }

    const upgrading = () => {
      if (planet?.upgradeFinishedTime) {return true}
      return false
    }

  useEffect(() => {
    let timer: null | NodeJS.Timer = null

    if (planet?.upgradeFinishedTime) {
      setUpgradeTimeLeft(setTimerinfo(timer))

      timer = setInterval(() => {
        setUpgradeTimeLeft(setTimerinfo(timer))
      }, 1000)
    }

    return () => {
      timer && clearInterval(timer)
    };
  }, [planet?.upgradeFinishedTime])

  return (
    <button type="button" className="UpgradeButton" onClick={onClick} data-upgrading={upgrading()} data-upgradeable={resourcesMet()}>
      {!planet.upgradeFinishedTime ? "Upgrade" : upgradeTimeLeft}
    </button>
  )
}

export default UpgradeButton
