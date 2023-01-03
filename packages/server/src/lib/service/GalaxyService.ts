import { ICounterRepository } from '../repositories'
import { IGalaxyRepository } from '../repositories/IGalaxyRepository'
import { IGalaxyService } from './IGalaxyService'

export class GalaxyService implements IGalaxyService {
  protected readonly galaxyRepository: IGalaxyRepository

  constructor(galaxyRepository: IGalaxyRepository) {
    this.galaxyRepository = galaxyRepository
  }

  async initiateGalaxyCheck() {
    console.log('Initializing server. Checking for galaxy planets')
    const counters = await this.galaxyRepository.getCounters()
    if (counters.galaxyPlanets == 0) {
      console.log('No planets found in galaxy, Creating new Galaxy...')
      await this.galaxyRepository.AddPlanetsToGalaxy()
    } else {
      console.log('Galaxy exists, skipping galaxy creation')
    }
  }
}
