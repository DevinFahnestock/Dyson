import { Object3D, Event, PlaneGeometry, ShaderMaterial, Mesh } from "three";

import { ColorPalette, Layer, LightSource } from "../../core";

import vertexShader from "../../shaders/vertex/mainShader.glsl";
import fragmentShaderClouds from "../../shaders/fragment/cloudLayer.glsl";

export default class CloudLayer implements Layer {
  layerGroup: Mesh<PlaneGeometry, ShaderMaterial>;

  constructor(
    seed: number,
    colors: ColorPalette,
    light: LightSource,
    rotation: number = 0.0,
    rotationSpeed: number = 0.1,
    scale: number = 4.0,
    cloudCover = 0.546, 
    stretch = 2.5
  ) {
    const craterGeometry = new PlaneGeometry(1, 1);
    const craterMaterial = new ShaderMaterial({
      uniforms: {
        light_origin: { value: light.position },
        pixels: { value: 100.0 },
        seed: { value: seed },
        time_speed: { value: rotationSpeed },
        base_color: { value: colors.color1.toVector() },
        outline_color: { value:colors.color2.toVector()  },
        shadow_base_color: { value: colors.color3?.toVector() },
        shadow_outline_color: { value: colors.color4?.toVector() },
        cloud_cover: { value: cloudCover },
        rotation: { value: rotation },
        stretch: { value: stretch },
        size: { value: scale },
        time: { value: 0.0 }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderClouds,
      transparent: true,
    });

    this.layerGroup = new Mesh(craterGeometry, craterMaterial);
  }

  createNode(): Object3D<Event> {
    return this.layerGroup.clone();
  }

  update(delta: number): void {
  }
}
