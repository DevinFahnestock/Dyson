import { Vector2 } from "three";

import BasePlanet from "../BasePlanet";
import { Color, ColorPalette, LightSource } from "src/lib/pixelPlanets/core";
import CraterLayer from "../../layers/CraterLayer";
import RiverLayer from "../../layers/RiverLayer";

export default class LavaPlanet extends BasePlanet {
  constructor(
    seed: number,
    colors: ColorPalette = {
      color1: new Color(142, 77, 86),
      color2: new Color(82, 51, 63),
      color3: new Color(61, 40, 54),
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
          color1: new Color(82, 51, 63),
          color2: new Color(61, 40, 54),
        },
        this.light,
        this.rotation
      )
    );

    this.addLayer(
      new RiverLayer(
        this.seed,
        {
          color1: new Color(255, 137, 51),
          color2: new Color(230, 68, 56),
          color3: new Color(127, 47, 68),
        },
        this.light,
        this.rotation,
        0.2
      )
    );
  }
}
