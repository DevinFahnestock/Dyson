import type { Layer } from "./Layer";
import type {  SceneNode } from "./SceneNode";

export interface CelestialBody extends SceneNode {
  addLayer(layer: Layer): void;
}
