import { Planet } from "../Planet"
import { PlanetType } from "../shared"

export interface IPlanetService {

  getUserPlanets(userID: string): Promise<Array<Planet>>

  getPlanet(PlanetID: string): Promise<Planet>

  updatePlanet(planet: Planet, userID: string): Promise<Planet>

  createPlanet(userID: string, type: PlanetType): Promise<Planet>

}