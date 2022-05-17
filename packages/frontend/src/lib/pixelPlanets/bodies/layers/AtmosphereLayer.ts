import { ColorPalette, Layer } from "../../core";

import vertexShader from "../../shaders/vertex/mainShader.glsl";
import fragmentShaderAtmosphere from "../../shaders/fragment/cloudLayer.glsl";

export default class AtmosphereLayer extends Layer {
  constructor(colors: ColorPalette) {
    super({
      uniforms: {
        color: { value: colors.color1.toVector() },
        color2: { value: colors.color2.toVector() },
        color3: { value: colors.color1.toVector() },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderAtmosphere,
      transparent: true,
    });
  }
}
