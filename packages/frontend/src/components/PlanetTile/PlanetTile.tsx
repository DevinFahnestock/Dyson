import React from 'react'
import './styles.css'

import UpgradeButton from './Buttons/UpgradeButton'
import CelestialBodyRenderer from './CelestialBodyRenderer'
import UpgradeCost from './UpgradeCost'
import CollectButton from './Buttons/CollectButton'

import ReactTooltip from 'react-tooltip'

interface PlanetTileProps {
  planet: any
  upgradeClick: () => void
  onUpgradeTimeComplete: () => void
  collectClick: () => void
}

const PlanetTile = ({ planet, upgradeClick, onUpgradeTimeComplete, collectClick }: PlanetTileProps) => {
  return (
    <div className='PlanetTile'>
      <div className='Definition'>
        <CelestialBodyRenderer type={planet.type} seed={planet.seed} />
        <h3 className='PlanetName'>{planet.name}</h3>
        <CollectButton onClick={collectClick} planet={planet} />
        <div className='LevelSection'>
          Level {planet.level}
          <ReactTooltip id='upgradeCost'>{!planet.upgradeFinishedTime && <UpgradeCost planet={planet} />}</ReactTooltip>
          <a data-tip data-for='upgradeCost' data-background-color='clear'>
            <UpgradeButton onClick={upgradeClick} onUpgradeTimeComplete={onUpgradeTimeComplete} planet={planet} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default PlanetTile
