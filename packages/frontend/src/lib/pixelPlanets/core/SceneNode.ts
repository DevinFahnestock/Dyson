import type { Object3D } from "three";

export interface SceneNode {
  createNode(): Object3D;
  update(delta: number): void;
}
