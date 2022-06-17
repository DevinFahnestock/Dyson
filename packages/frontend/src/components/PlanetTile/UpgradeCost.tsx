import React from 'react'
import { Planet } from '@dyson/shared/dist/Planet'

import upgradeTimes from "@dyson/shared/src/resources/upgrade-times.json"
import upgradeCosts from "@dyson/shared/src/resources/upgrade-costs.json"


interface props {
    planet: Planet
}

const UpgradeCost = ({ planet }: props) => {
    const planetLevel = planet.level
    const upgradeCost = upgradeCosts[planetLevel + 1]
    

  return (
    <div className='UpgradeCost'>
        Cost To Upgrade to Level {planetLevel + 1}:<br />
        Money: {upgradeCost.money}<br />
        Metal: {upgradeCost.metal}<br />
        Organic: {upgradeCost.organic}<br />
        Food: {upgradeCost.food}<br />
        Time: {upgradeTimes[planetLevel + 1]}
    </div>
  )
}

export default UpgradeCost
