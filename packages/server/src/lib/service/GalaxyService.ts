import { ICounterRepository } from '../repositories'
import { IGalaxyRepository } from '../repositories/IGalaxyRepository'
import { IGalaxyService } from './IGalaxyService'

export class GalaxyService implements IGalaxyService {
  protected readonly galaxyRepository: IGalaxyRepository
  protected readonly counterRepository: ICounterRepository

  constructor(galaxyRepository: IGalaxyRepository, counterRepository: ICounterRepository) {
    this.galaxyRepository = galaxyRepository
    this.counterRepository = counterRepository
  }

  async initiateGalaxyCheck(planetsInGalaxy?: number) {
    const galaxyCount = await this.counterRepository.getCounter('galaxyPlanets')
    if (galaxyCount < 20) {
      console.log(`Filling Galaxy to ${planetsInGalaxy || 20} planets`)
      await this.galaxyRepository.AddPlanetsToGalaxy((planetsInGalaxy || 20) - galaxyCount)
    } else {
      console.log('Galaxy is full, skipping galaxy planet creation')
    }
  }
}
