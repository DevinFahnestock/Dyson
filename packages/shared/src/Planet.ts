import { PlanetType } from './shared'

export interface Planet {
  id: string
  name: string
  level: number
  owner: string
  created: string
  upgradeFinishedTime: string
  type: PlanetType
  seed: number
}