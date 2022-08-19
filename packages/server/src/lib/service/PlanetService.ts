import { Planet } from '@dyson/shared/dist/Planet'
import { IPlanetRepository } from '../repositories/IPlanetRepository'
import { PlanetType } from '@dyson/shared/dist/Shared'
import { IPlanetService } from './IPlanetService'

import Time from '@dyson/shared/dist/Time/Time'
import PlanetNames from '@dyson/shared/src/resources/planet-names.json'
import { PlanetResourceUpgradeCost, PlanetTimeUpgradeCost } from '@dyson/shared/dist/ResourceCost'
import { Warehouse } from '@dyson/shared/dist/Warehouse'

export class PlanetService implements IPlanetService {
  protected readonly planetRepository: IPlanetRepository

  constructor(planetRepository: IPlanetRepository) {
    this.planetRepository = planetRepository
  }

  async startPlanetUpgrade(
    planetID: string,
    warehouse: Warehouse,
    userID: string,
    warehouseCallback: (warehouse: Warehouse) => void
  ): Promise<Planet> {
    const planetToUpgrade = await this.getPlanet(planetID)

    if (!planetToUpgrade) {
      return null
    }

    if (planetToUpgrade.upgradeFinishedTime) {
      return null
    }

    const nextLevel = planetToUpgrade.level + 1

    const upgradeCost = PlanetResourceUpgradeCost(nextLevel)

    for (const [resource, amount] of Object.entries(upgradeCost)) {
      if (amount > warehouse[resource]) {
        return null
      }
    }

    for (const [resource, amount] of Object.entries(upgradeCost)) {
      warehouse[resource] -= amount as number
    }

    const time = PlanetTimeUpgradeCost(planetToUpgrade.level)
    planetToUpgrade.upgradeFinishedTime = Time.utc()
      .add(time.hours, 'hour')
      .add(time.minutes, 'minute')
      .add(time.seconds, 'second')
      .toISOString()

    this.updatePlanet(planetToUpgrade, userID)

    warehouseCallback(warehouse)

    return planetToUpgrade
  }

  async checkForUpgradeCompleted(userID: string, PlanetID: string): Promise<Planet> {
    const planetToCheck = await this.getPlanet(PlanetID)

    if (!planetToCheck) {
      return null
    }

    if (planetToCheck.owner !== userID) {
      return null
    }

    if (!planetToCheck.upgradeFinishedTime) {
      return null
    }

    const upgradeFinishedTime = Time.utc(planetToCheck.upgradeFinishedTime)
    const durationLeft = Time.duration(upgradeFinishedTime.diff(Time.utc()))

    if (durationLeft.asSeconds() > 0) {
      return null
    }

    if (durationLeft.asSeconds() <= 0) {
      planetToCheck.upgradeFinishedTime = null
      planetToCheck.level++
      return this.updatePlanet(planetToCheck, userID)
    }
  }

  getUserPlanets(userID: string): Promise<Planet[]> {
    return this.planetRepository.fetchUserPlanets(userID)
  }

  getPlanet(planetID: string): Promise<Planet> {
    return this.planetRepository.fetchPlanet(planetID)
  }

  async updatePlanet(planet: Planet, userID: string): Promise<Planet> {
    const planetToUpdate = await this.planetRepository.fetchPlanet(planet.id)

    if (planetToUpdate.owner !== userID) {
      return null
    }

    await this.planetRepository.updatePlanet(planet)
    return planet
  }

  createPlanet(userID: string, type: PlanetType): Promise<Planet> {
    let planet: Planet = {
      level: 0,
      owner: userID,
      type: type,
      upgradeFinishedTime: null,
      seed: Math.random(),
      name: PlanetNames[Math.floor(Math.random() * PlanetNames.length)],
      created: Time.utc().toISOString(),
      id: null,
      ResourceGeneratorLevel: {
        metal: 1,
        organic: 1,
        food: 1,
        money: 1,
      },
      LastGeneratedTime: Time.utc().toISOString(),
    }

    return this.planetRepository.createPlanet(planet)
  }

  getTopTenPlanets(offset: number): Promise<Planet[]> {
    return this.planetRepository.fetchTopPlanets(10, offset)
  }

  getCounters(): Promise<any> {
    return this.planetRepository.getCounters()
  }
}
