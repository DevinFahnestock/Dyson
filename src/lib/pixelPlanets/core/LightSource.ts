import { Vector2 } from "three"

export interface LightSource {
    position: Vector2,
    intensity?: number
}