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

  async initiateGalaxyCheck() {
    console.log('Initializing server. Checking for galaxy planets')
    const galaxyCount = await this.counterRepository.getCounter('galaxyPlanets')
    if (galaxyCount < 20) {
      console.log('No planets found in galaxy, Creating new Galaxy...')
      await this.galaxyRepository.AddPlanetsToGalaxy(20 - galaxyCount)
    } else {
      console.log('Galaxy exists, skipping galaxy creation')
    }
  }
}
