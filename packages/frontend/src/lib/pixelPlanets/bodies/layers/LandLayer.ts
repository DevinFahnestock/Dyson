import { ColorPalette, Layer, LightSource } from "../../core";

import vertexShader from "../../shaders/vertex/mainShader.glsl";
import fragmentShaderLand from "../../shaders/fragment/landLayer.glsl";

export default class LandLayer extends Layer {
  constructor(
    seed: number,
    colors: ColorPalette,
    light: LightSource,
    rotation: number = 0.0,
    rotationSpeed: number = 0.1,
    land: number = 0.6
  ) {
    super({
      uniforms: {
        pixels: { value: 100.0 },
        land_cutoff: { value: land },
        col1: { value: colors.color1.toVector() },
        col2: { value: colors.color2.toVector() },
        col3: { value: colors.color3?.toVector() },
        col4: { value: colors.color4?.toVector() },
        lightIntensity: { value: light.intensity },
        light_origin: { value: light.position },
        time_speed: { value: rotationSpeed },
        rotation: { value: rotation },
        seed: { value: seed },
        time: { value: 0.0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderLand,
      depthTest: true,
      transparent: true,
    });
  }
}
