import React, { useEffect, useState } from 'react'
import './styles.css'

import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

import UpgradeCosts from '@dyson/shared/src/resources/upgrade-costs.json'
import useWarehouse from 'src/lib/gameData/useWarehouse'

import { resourcesMet, isUpgrading } from './helpers/UpgradeValidations'

import UpgradeCostInfoPanel from './UpgradeCostInfoPanel'
import ReactTooltip from 'react-tooltip'

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(relativeTime)

const UpgradeButton = ({ onClick, planet, onUpgradeTimeComplete }: any) => {
  const upgradeFinishedTime = dayjs.utc(planet.upgradeFinishedTime)
  const [upgradeTimeLeft, setUpgradeTimeLeft] = useState<string>()

  const { warehouse }: any = useWarehouse()

  const nextLevelReq = UpgradeCosts[planet.level + 1]

  const setTimerinfo = (timer: null | NodeJS.Timer) => {
    const durationLeft = dayjs.duration(upgradeFinishedTime.diff(dayjs.utc()))

    const hoursLeft = durationLeft.get('hours')
    const minutesLeft = durationLeft.get('minutes')

    let timerText = ''

    if (durationLeft.asSeconds() > 0) {
      if (hoursLeft > 0) {
        timerText = durationLeft.format('H:mm:ss')
      } else if (minutesLeft > 0) {
        timerText = durationLeft.format('m:ss')
      } else {
        timerText =
          durationLeft.asSeconds() > 1 ? durationLeft.format('s') + ' seconds' : durationLeft.format('s') + ' second'
      }
    } else {
      timerText = 'Finished'
      timer && clearInterval(timer)
      onUpgradeTimeComplete?.()
    }

    return timerText
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
    }
  }, [planet?.upgradeFinishedTime])

  const tooltipID = `tooltip-upgradeCost-${planet.id}`

  ReactTooltip.rebuild()

  return (
    <div>
      <ReactTooltip id={tooltipID}>
        <UpgradeCostInfoPanel planet={planet} />
      </ReactTooltip>
      <button
        data-tip
        data-for={tooltipID}
        data-background-color='clear'
        type='button'
        className='UpgradeButton'
        onClick={onClick}
        data-upgrading={isUpgrading(planet)}
        data-upgradeable={resourcesMet(nextLevelReq, warehouse)}
      >
        {!planet.upgradeFinishedTime ? 'Upgrade' : upgradeTimeLeft}
      </button>
    </div>
  )
}

export default UpgradeButton
