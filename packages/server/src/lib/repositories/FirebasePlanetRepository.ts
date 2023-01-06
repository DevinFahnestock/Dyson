import type { app } from 'firebase-admin'
import { IPlanetRepository } from './IPlanetRepository'
import { Planet } from '@dyson/shared/dist/Planet'
import { ICounterRepository } from './ICounterRepository'

export class FirebasePlanetRepository implements IPlanetRepository {
  protected readonly admin: app.App
  protected readonly counterRepository: ICounterRepository

  constructor(admin: app.App, counterRepository: ICounterRepository) {
    this.admin = admin
    this.counterRepository = counterRepository
  }

  async createPlanet(planet: Planet): Promise<Planet> {
    const docRef = this.admin.firestore().collection('admin').doc('gameData').collection('planetData').doc()

    planet.id = docRef.id

    await docRef.set(planet)
    await this.counterRepository.incrementCounter('planets', 1)

    return planet
  }

  async deletePlanet(planet: Planet): Promise<void> {
    await this.admin.firestore().collection('admin').doc('gameData').collection('planetData').doc(planet.id).delete()
    await this.counterRepository.incrementCounter('planets', -1)
  }

  async deletePlanetByID(planetID: string): Promise<void> {
    await this.admin.firestore().collection('admin').doc('gameData').collection('planetData').doc(planetID).delete()
    await this.counterRepository.incrementCounter('planets', -1)
  }

  async updatePlanet(planet: Planet): Promise<void> {
    await this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('planetData')
      .doc(planet.id.toString())
      .update(planet)
  }

  async fetchPlanet(planetID: string): Promise<Planet> {
    const data = await this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('planetData')
      .doc(planetID)
      .get()
    return data.data() as Planet
  }

  async fetchUserPlanets(userID: string): Promise<Array<Planet>> {
    const planetData = this.admin.firestore().collection('admin').doc('gameData').collection('planetData')
    const planets = await planetData.where('owner', '==', userID).get()

    const results = []
    planets.docs.map((doc) => {
      results.push(doc.data())
    })
    return results
  }

  async queryPlanets(limit: number, offset: number): Promise<Planet[]> {
    const planetsRef = this.admin.firestore().collection('admin').doc('gameData').collection('planetData')

    const planetsQuery = await planetsRef.orderBy('level', 'desc').limit(limit).offset(offset).get()
    let planets = []

    planetsQuery.forEach((planetDocumentReference) => {
      planets.push(planetDocumentReference.data())
    })

    return planets
  }
}
