import React from 'react'
import { Planet } from 'src/lib/Planet'

import upgradeCosts from "../../lib/upgrade-costs.json"

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
    </div>
  )
}

export default UpgradeCost
