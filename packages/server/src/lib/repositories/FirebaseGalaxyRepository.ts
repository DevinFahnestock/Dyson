import { app } from 'firebase-admin'
import { IGalaxyRepository } from './IGalaxyRepository'

export class FirebasePlanetRepository implements IGalaxyRepository {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  async createGalaxy() {
    await this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('galaxyData')
      .doc('galaxy1')
      .collection('planets')

    throw new Error('Method not implemented.')
  }
  fetchGalaxy() {
    throw new Error('Method not implemented.')
  }
  fetchGalaxyPlanets() {
    throw new Error('Method not implemented.')
  }
}
