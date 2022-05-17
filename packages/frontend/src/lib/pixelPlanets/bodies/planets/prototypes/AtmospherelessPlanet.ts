import { Vector2 } from "three";

import BasePlanet from "../BasePlanet";
import { Color, ColorPalette, LightSource } from "src/lib/pixelPlanets/core";
import CraterLayer from "../../layers/CraterLayer";

export default class AtmospherelessPlanet extends BasePlanet {
  constructor(
    seed: number,
    colors: ColorPalette = {
      color1: new Color(155, 158, 184),
      color2: new Color(71, 97, 124),
      color3: new Color(53, 57, 65),
    },
    light: LightSource = { position: new Vector2(0.39, 0.7), intensity: 0.1 },
    rotation: number = 0.0,
    rotationSpeed: number = 0.1
  ) {
    super(seed, colors, light, rotation, rotationSpeed);

    this.addLayer(
      new CraterLayer(
        this.seed,
        {
          color1: new Color(71, 97, 124),
          color2: new Color(53, 57, 85),
        },
        this.light,
        this.rotation
      )
    );
  }
}
