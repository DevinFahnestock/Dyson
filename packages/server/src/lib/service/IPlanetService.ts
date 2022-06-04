import { type } from "os"
import { Planet } from "../Planet"
import { PlanetType } from "../shared"
import { Warehouse } from "../Warehouse"

type nullablePlanet = Planet | null

export interface IPlanetService {

  getUserPlanets(userID: string): Promise<Array<Planet>>

  getPlanet(PlanetID: string): Promise<Planet>

  updatePlanet(planet: Planet, userID: string): Promise<Planet>

  createPlanet(userID: string, type: PlanetType): Promise<Planet>

  checkForUpgradeCompleted(userID: string, PlanetID: string): Promise<Planet>

  startPlanetUpgrade(planetID: string,warehouse: Warehouse, userID: string, warehouseCalllback: (warehouse: Warehouse) => void): Promise<Planet>

}

