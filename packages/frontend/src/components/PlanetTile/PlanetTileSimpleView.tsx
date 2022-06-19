import React from "react";
import "./styles.css";

import CelestialBodyRenderer from "./CelestialBodyRenderer";
import UpgradeCost from "./UpgradeCost";

interface PlanetTileProps {
  planet: any;
  upgradeClick: () => void;
  onUpgradeTimeComplete: () => void;
}

const PlanetTileSimpleView = ({
  planet
}: PlanetTileProps) => {
  return (
    <div className="PlanetTile">
      <div className="Definition">
        <CelestialBodyRenderer type={planet.type} seed={planet.seed} />
        <h3>{planet.name}</h3>
        {!planet.upgradeFinishedTime && <UpgradeCost planet={planet}/>}
        <div>
          Level {planet.level}
        </div>
      </div>
    </div>
  );
}; 

export default PlanetTileSimpleView;

