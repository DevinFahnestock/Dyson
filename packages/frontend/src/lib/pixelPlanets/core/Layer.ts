import {
  Object3D,
  Event,
  ShaderMaterialParameters,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
} from "three";
import type { SceneNode } from "./SceneNode";

export abstract class Layer implements SceneNode {
  protected layerMesh: Mesh<PlaneGeometry, ShaderMaterial>;

  constructor(shader: ShaderMaterialParameters) {
    const craterGeometry = new PlaneGeometry(1, 1);
    const craterMaterial = new ShaderMaterial(shader);

    this.layerMesh = new Mesh(craterGeometry, craterMaterial);
  }

  createNode(): Object3D<Event> {
    return this.layerMesh.clone();
  }

  update(delta: number): void {
    if (this.layerMesh.material.uniforms["time"]) {
      this.layerMesh.material.uniforms["time"].value = delta;
    }
  }
}
