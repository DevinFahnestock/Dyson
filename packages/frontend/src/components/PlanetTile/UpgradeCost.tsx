import React from 'react'
import { Planet } from '@dyson/shared/dist/Planet'

import { PlanetResourceUpgradeCost, PlanetTimeUpgradeCost } from '@dyson/shared/dist/ResourceCost'

import dayjs from '@dyson/shared/dist/Time/Time'
import { duration } from 'dayjs'

interface props {
  planet: Planet
}

const UpgradeCost = ({ planet }: props) => {
  const planetLevel = planet.level
  let upgradeCost = PlanetResourceUpgradeCost(planetLevel + 1)
  const upgradeTime = PlanetTimeUpgradeCost(planetLevel + 1)

  dayjs.extend(duration)

  const dayjstime = dayjs.duration(upgradeTime)

  const timeStr = dayjstime.format('HH:mm:ss')

  return (
    <div className='UpgradeCost'>
      Cost To Upgrade to Level {planetLevel + 1}:<br />
      Money: {upgradeCost.money}
      <br />
      Metal: {upgradeCost.metal}
      <br />
      Organic: {upgradeCost.organic}
      <br />
      Food: {upgradeCost.food}
      <br />
      Time: {timeStr}
    </div>
  )
}

export default UpgradeCost
