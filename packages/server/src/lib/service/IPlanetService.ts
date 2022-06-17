import { Planet } from "@dyson/shared/src/Planet"
import { PlanetType } from "@dyson/shared/src/shared"
import { Warehouse } from "@dyson/shared/src/Warehouse"

export interface IPlanetService {

  getUserPlanets(userID: string): Promise<Array<Planet>>

  getPlanet(PlanetID: string): Promise<Planet>

  updatePlanet(planet: Planet, userID: string): Promise<Planet>

  createPlanet(userID: string, type: PlanetType): Promise<Planet>

  checkForUpgradeCompleted(userID: string, PlanetID: string): Promise<Planet>

  startPlanetUpgrade(planetID: string,warehouse: Warehouse, userID: string, warehouseCalllback: (warehouse: Warehouse) => void): Promise<Planet>

}

