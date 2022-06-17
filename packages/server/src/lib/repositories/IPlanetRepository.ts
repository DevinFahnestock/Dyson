import { Planet } from "@dyson/shared/src/Planet"

export interface IPlanetRepository {

  createPlanet(planet: Planet): Promise<Planet> 

  updatePlanet(planet: Planet): Promise<void>

  fetchPlanet(planetID: string): Promise<Planet>

  fetchUserPlanets(userID: string): Promise<Array<Planet>>

}