import { Planet } from "@dyson/shared/dist/Planet"
import { IPlanetRepository } from "../repositories/IPlanetRepository"
import { PlanetType } from "@dyson/shared/dist/Shared"
import { IPlanetService } from "./IPlanetService"

import Time from  "@dyson/shared/dist/Time/Time" 
import PlanetNames from "@dyson/shared/src/resources/planet-names.json"
import upgradeTimes from "@dyson/shared/src/resources/upgrade-times.json"
import upgradeCosts from '@dyson/shared/src/resources/upgrade-costs.json'
import { Warehouse } from "@dyson/shared/dist/Warehouse"


export class PlanetService implements IPlanetService {
  protected readonly planetRepository: IPlanetRepository

  constructor(planetRepository: IPlanetRepository) {
    this.planetRepository = planetRepository
  }

  async startPlanetUpgrade(planetID: string, warehouse: Warehouse, userID: string, warehouseCalllback: (warehouse: Warehouse) => void): Promise<Planet> {
    const planetToUpgrade = await this.getPlanet(planetID)
    
    if (!planetToUpgrade) {
      return null
    }

    if (planetToUpgrade.upgradeFinishedTime) {
      return null
    }

    const nextLevel = planetToUpgrade.level + 1
    
    const upgradeCost = upgradeCosts[nextLevel]

    //think of a better way to do this that isnt a 3AM solution
    if (upgradeCost.metal > warehouse.metal) {return null}
    if (upgradeCost.organic > warehouse.organic) {return null}
    if (upgradeCost.money > warehouse.money) {return null}
    if (upgradeCost.food > warehouse.food) {return null}

    warehouse.metal -= upgradeCost.metal
    warehouse.organic -= upgradeCost.organic
    warehouse.money -= upgradeCost.money
    warehouse.food -= upgradeCost.food

    warehouseCalllback(warehouse)

    const time = upgradeTimes[planetToUpgrade.level].split(":")
    planetToUpgrade.upgradeFinishedTime = Time.utc()
      .add(parseInt(time[0]), "hour")
      .add(parseInt(time[1]), "minute")
      .add(parseInt(time[2]), "second")
      .toISOString()

    this.updatePlanet(planetToUpgrade, userID)

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
        metal: 10,
        organic: 10,
        food: 10,
        money: 10
      }
    }

    return this.planetRepository.createPlanet(planet)
  }

  getTopTenPlanets(): Promise<Planet[]> {
    return this.planetRepository.fetchTopPlanets(10)
  }

}
