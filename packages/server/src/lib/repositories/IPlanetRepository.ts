import { Planet } from '@dyson/shared/dist/Planet'

export interface IPlanetRepository {
  createPlanet(planet: Planet): Promise<Planet>

  deletePlanet(planet: Planet): Promise<void>

  deletePlanetByID(planetID: string): Promise<void>

  updatePlanet(planet: Planet): Promise<void>

  fetchPlanet(planetID: string): Promise<Planet>

  fetchUserPlanets(userID: string): Promise<Array<Planet>>

  queryPlanets(limit: number, offset: number): Promise<Planet[]>

  getCounters(): Promise<any>
}
