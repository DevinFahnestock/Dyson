import type { app } from 'firebase-admin'
import { firestore } from 'firebase-admin'
import { IPlanetRepository } from './IPlanetRepository'
import { Planet } from '@dyson/shared/dist/Planet'

export class FirebasePlanetRepository implements IPlanetRepository {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  async createPlanet(planet: Planet): Promise<Planet> {
    const docRef = this.admin.firestore().collection('admin').doc('gameData').collection('planetData').doc()

    planet.id = docRef.id

    await docRef.set(planet)
    await this.incrementPlanetCounter(1)

    return planet
  }

  async deletePlanet(planet: Planet): Promise<void> {
    await this.admin.firestore().collection('admin').doc('gameData').collection('planetData').doc(planet.id).delete()
    await this.incrementPlanetCounter(-1)
  }

  async deletePlanetByID(planetID: string): Promise<void> {
    await this.admin.firestore().collection('admin').doc('gameData').collection('planetData').doc(planetID).delete()
    await this.incrementPlanetCounter(-1)
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

  async fetchTopPlanets(limit: number, offset: number): Promise<Planet[]> {
    const planetsRef = this.admin.firestore().collection('admin').doc('gameData').collection('planetData')

    const topPlanetsQuery = await planetsRef.orderBy('level', 'desc').limit(limit).offset(offset).get()
    let planets = []

    topPlanetsQuery.forEach((docRef) => {
      planets.push(docRef.data())
    })

    console.log('fetching leaderboard data')
    return planets
  }

  async getCounters() {
    const query = await (await this._getCounterDocumentReference()).get()
    return query.data()
  }

  private async _getCounterDocumentReference() {
    return await this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('counters')
      .doc('Jl2JWvpXIVqDRFMlf6LF')
  }

  private async incrementPlanetCounter(valueToIncrementBy: number) {
    const planetCounter = await this._getCounterDocumentReference()
    await planetCounter.set({ planets: firestore.FieldValue.increment(valueToIncrementBy) }, { merge: true })
  }
}
