import React from "react";

import { CelestialBody } from "src/lib/pixelPlanets/core";
import AtmospherelessPlanet from "src/lib/pixelPlanets/bodies/planets/prototypes/AtmospherelessPlanet";
import LavaPlanet from "src/lib/pixelPlanets/bodies/planets/prototypes/LavaPlanet";
import WetPlanet from "src/lib/pixelPlanets/bodies/planets/prototypes/WetPlanet";
import { PlanetType } from "@dyson/shared/dist/shared";

import CelestialBodyRenderer from "./CelestialBodyRenderer";

const getPlanet = (type: string, seed: number): CelestialBody => {
  switch (type) {
    case PlanetType.Wet:
      return new WetPlanet(seed);

    case PlanetType.Lava:
      return new LavaPlanet(seed);

    case PlanetType.NoAtmosphere:
      return new AtmospherelessPlanet(seed);

    default:
      return new AtmospherelessPlanet(seed);
  }
};

const MemonizedRenderer = React.memo(({ type, seed }: any) => {
  const celestialBody = getPlanet(type, seed);

  return <CelestialBodyRenderer celestialBody={celestialBody} />;
});

export default MemonizedRenderer;
