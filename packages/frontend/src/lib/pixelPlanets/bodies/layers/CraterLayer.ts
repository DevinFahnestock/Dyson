import { ColorPalette, Layer, LightSource } from "../../core";

import vertexShader from "../../shaders/vertex/mainShader.glsl";
import fragmentShaderCrater from "../../shaders/fragment/craterLayer.glsl";

export default class CraterLayer extends Layer {
  constructor(
    seed: number,
    colors: ColorPalette,
    light: LightSource,
    rotation: number = 0.0,
    rotationSpeed: number = 0.1,
    scale: number = 5.0
  ) {
    super({
      uniforms: {
        color1: { value: colors.color1.toVector() },
        color2: { value: colors.color2.toVector() },
        light_origin: { value: light.position },
        time_speed: { value: rotationSpeed },
        rotation: { value: rotation },
        seed: { value: seed },
        time: { value: 0.0 },
        size: { value: scale },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderCrater,
      depthTest: true,
      transparent: true,
    });
  }
}
