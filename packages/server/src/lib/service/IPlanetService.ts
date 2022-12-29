import { Planet } from '@dyson/shared/dist/Planet'
import { PlanetType } from '@dyson/shared/dist/shared'
import { Warehouse } from '@dyson/shared/dist/Warehouse'

export interface IPlanetService {
  getUserPlanets(userID: string): Promise<Array<Planet>>

  getPlanet(PlanetID: string): Promise<Planet>

  updatePlanet(planet: Planet, userID: string): Promise<Planet>

  createPlanet(userID: string, type: PlanetType): Promise<Planet>

  checkForUpgradeCompleted(userID: string, PlanetID: string): Promise<Planet>

  startPlanetUpgrade(
    planetID: string,
    warehouse: Warehouse,
    userID: string,
    warehouseCalllback: (warehouse: Warehouse) => void
  ): Promise<Planet>

  fetchLeaderboard(offset: number): Promise<Planet[]>

  getCounters(): Promise<any>
}
