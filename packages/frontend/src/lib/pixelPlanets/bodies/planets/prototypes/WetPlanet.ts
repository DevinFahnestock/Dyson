import LandLayer from "../../layers/LandLayer";
import { Vector2 } from "three";

import BasePlanet from "../BasePlanet";
import { Color, ColorPalette, LightSource } from "src/lib/pixelPlanets/core";
import CloudLayer from "../../layers/CloudLayer";
import AtmosphereLayer from "../../layers/AtmosphereLayer";

export default class WetPlanet extends BasePlanet {
  constructor(
    seed: number,
    colors: ColorPalette = {
      color1: new Color(102, 176, 199),
      color2: new Color(102, 176, 199),
      color3: new Color(52, 65, 157),
    },
    light: LightSource = { position: new Vector2(0.39, 0.7), intensity: 0.1 },
    rotation: number = 0.0,
    rotationSpeed: number = 0.1
  ) {
    super(seed, colors, light, rotation, rotationSpeed);

    this.addLayer(
      new LandLayer(
        this.seed,
        {
          color1: new Color(200, 212, 93),
          color2: new Color(98, 170, 63),
          color3: new Color(47, 86, 82),
          color4: new Color(40, 52, 63),
        },
        this.light,
        this.rotation
      )
    );

    this.addLayer(
      new CloudLayer(
        this.seed,
        {
          color1: new Color(224, 240, 255),
          color2: new Color(191, 226, 255),
          color3: new Color(186, 220, 241), //91, 117, 165
          color4: new Color(63, 73, 114),
        },
        this.light,
        this.rotation
      )
    );

    this.addLayer(
      new AtmosphereLayer({
        color1: new Color(173, 216, 230, 0.25),
        color2: new Color(0, 127, 255, 0.25),
        color3: new Color(0, 0, 128, 0.45),
      })
    );
  }
}
