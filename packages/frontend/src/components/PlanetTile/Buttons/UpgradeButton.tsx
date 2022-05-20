import React, { useEffect, useState } from "react"
import './styles.css'

import utc from "dayjs/plugin/utc"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from "dayjs"



dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(relativeTime)

const UpgradeButton = ( { onClick, planet, onUpgradeTimeComplete }: any ) => {

  const upgradeFinishedTime = dayjs.utc(planet.upgradeFinishedTime)

  const [upgradeTimeLeft, setUpgradeTimeLeft] = useState<string>()

  const setTimerinfo = () => {

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

    if (durationLeft.asSeconds() <= 0) onUpgradeTimeComplete()

    return timerText
  }

  useEffect(() => {

    let timer: null | NodeJS.Timer = null
    if (planet.upgradeFinishedTime) {
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
    <button type="button" className='UpgradeButton' onClick={onClick}>{!planet.upgradeFinishedTime ? "Upgrade" : upgradeTimeLeft}</button>
  )
}

export default UpgradeButton