import { Planet } from "../Planet";
import { IPlanetRepository } from "../repositories/IPlanetRepository";
import { PlanetType } from "../shared";
import { IPlanetService } from './IPlanetService'

import Time from "../Time/Time";
import PlanetNames from '../../resources/planet-names.json'


class PlanetService implements IPlanetService {

  protected readonly planetRepository: IPlanetRepository

  constructor(planetRepository: IPlanetRepository) {
    this.planetRepository = planetRepository
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
    
    this.planetRepository.updatePlanet(planet)
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
      id: null
    }

    return this.planetRepository.createPlanet(planet)

  }
}