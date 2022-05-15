import { Object3D, Event, PlaneGeometry, ShaderMaterial, Mesh } from "three";

import { ColorPalette, Layer } from "../../core";

import vertexShader from "../../shaders/vertex/mainShader.glsl";
import fragmentShaderAtmosphere from "../../shaders/fragment/cloudLayer.glsl";

export default class AtmosphereLayer implements Layer {
  layerGroup: Mesh<PlaneGeometry, ShaderMaterial>;

  constructor(colors: ColorPalette) {
    const craterGeometry = new PlaneGeometry(1, 1);
    const craterMaterial = new ShaderMaterial({
      uniforms: {
        color: { value: colors.color1.toVector() },
        color2: { value: colors.color2.toVector() },
        color3: { value: colors.color1.toVector() },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderAtmosphere,
      transparent: true,
    });

    this.layerGroup = new Mesh(craterGeometry, craterMaterial);
  }

  createNode(): Object3D<Event> {
    return this.layerGroup.clone();
  }

  update(delta: number): void {}
}
