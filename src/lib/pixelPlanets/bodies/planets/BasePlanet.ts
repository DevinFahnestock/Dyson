import {
  Group,
  Mesh,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
  ShaderMaterialParameters,
} from "three";

import { CelestialBody, Layer, LightSource, ColorPalette } from "../../core";
import vertexShader from "../../shaders/vertex/mainShader.glsl";
import basePlanetFramentShader from "../../shaders/fragment/basePlanet.glsl";

export default class BasePlanet implements CelestialBody {
  public seed: number;
  public colors: ColorPalette;
  public light: LightSource;
  public rotationSpeed: number;
  public rotation: number;

  protected planetGroup: Group;

  constructor(
    seed: number,
    colors: ColorPalette,
    light: LightSource,
    rotation: number = 0.0,
    rotationSpeed: number = 0.1
  ) {
    this.seed = seed;
    this.colors = colors;
    this.light = light;
    this.rotationSpeed = rotationSpeed;
    this.rotation = rotation;

    this.initalizeShaders({
      uniforms: {
        pixels: { value: 100.0 },
        color1: { value: this.colors.color1.toVector() },
        color2: { value: this.colors.color2.toVector() },
        color3: { value: this.colors.color3?.toVector() },
        lightIntensity: { value: this.light.intensity },
        light_origin: { value: this.light.position },
        time_speed: { value: this.rotationSpeed },
        rotation: { value: this.rotation },
        seed: { value: this.seed },
        time: { value: 0.0 },
      },
      vertexShader: vertexShader,
      fragmentShader: basePlanetFramentShader,
      transparent: true,
    });
  }

  update(delta: number): void {
    this.planetGroup.children.forEach((layer: any) => {
      if (layer.material.uniforms["time"]) {
        layer.material.uniforms["time"].value = delta;
      }
    });
  }

  protected initalizeShaders(configuration: ShaderMaterialParameters) {
    this.planetGroup = new Group();

    const planetGeometry = new PlaneGeometry(1, 1);
    const planetMaterial = new ShaderMaterial(configuration);

    this.planetGroup.add(new Mesh(planetGeometry, planetMaterial));
  }

  addLayer(layer: Layer): void {
    this.planetGroup.add(layer.createNode());
  }

  createNode(): Object3D {
    return this.planetGroup.clone();
  }
}
