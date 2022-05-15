import { Object3D, Event, PlaneGeometry, ShaderMaterial, Mesh } from "three";

import { ColorPalette, Layer, LightSource } from "../../core";

import vertexShader from "../../shaders/vertex/mainShader.glsl";
import fragmentShaderRiver from "../../shaders/fragment/riverLayer.glsl";

export default class RiverLayer implements Layer {
  layerGroup: Mesh<PlaneGeometry, ShaderMaterial>;

  constructor(
    seed: number,
    colors: ColorPalette,
    light: LightSource,
    rotation: number = 0.0,
    rotationSpeed: number = 0.1,
    rivers: number = 0.6
  ) {
    const craterGeometry = new PlaneGeometry(1, 1);
    const craterMaterial = new ShaderMaterial({
      uniforms: {
        light_origin: { value: light.position },
        seed: { value: seed },
        time_speed: { value: rotationSpeed },
        river_cutoff: { value: rivers },
        rotation: { value: rotation },
        color1: { value: colors.color1.toVector() },
        color2: { value: colors.color2.toVector() },
        color3: { value: colors.color3?.toVector() },
        time: { value: 0.0 }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderRiver,
      transparent: true,
    });

    this.layerGroup = new Mesh(craterGeometry, craterMaterial);
  }

  createNode(): Object3D<Event> {
    return this.layerGroup.clone();
  }

  update(delta: number): void {}
}
