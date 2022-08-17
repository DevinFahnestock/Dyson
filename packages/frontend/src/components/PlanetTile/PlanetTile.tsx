import React from 'react'
import './styles.css'

import UpgradeButton from './Buttons/UpgradeButton'
import CelestialBodyRenderer from './CelestialBodyRenderer'
import UpgradeCost from './UpgradeCost'
import CollectButton from './Buttons/CollectButton'

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
        <h3>{planet.name}</h3>
        <CollectButton onClick={collectClick} planet={planet} />
        {!planet.upgradeFinishedTime && <UpgradeCost planet={planet} />}
        <div>
          Level {planet.level}
          <br />
          <UpgradeButton onClick={upgradeClick} onUpgradeTimeComplete={onUpgradeTimeComplete} planet={planet} />
        </div>
      </div>
    </div>
  )
}

export default PlanetTile
