import { Planet } from '@dyson/shared/dist/Planet'
import { PlanetType } from '@dyson/shared/dist/shared'
import { app, firestore } from 'firebase-admin'
import { IGalaxyRepository } from './IGalaxyRepository'
import PlanetNames from '@dyson/shared/src/resources/planet-names.json'
import Time from '@dyson/shared/dist/Time/Time'

export class FirebaseGalaxyRepository implements IGalaxyRepository {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  async createGalaxy() {
    let planets: Array<Planet> = []

    for (let i = 0; i < 20; i++) {
      planets[i] = {
        level: 0,
        owner: null,
        type: PlanetType.Lava,
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
    }

    planets.forEach(async (planet) => {
      console.log(planet)
      const docRef = this.admin
        .firestore()
        .collection('admin')
        .doc('gameData')
        .collection('galaxyData')
        .doc('galaxy1')
        .collection('planets')
        .doc()

      planet.id = docRef.id

      await docRef.set(planet)

      console.log('got doc ref for planet', planet)

      await this.admin
        .firestore()
        .collection('admin')
        .doc('gameData')
        .collection('counters')
        .doc('Jl2JWvpXIVqDRFMlf6LF')
        .set({ galaxyPlanets: firestore.FieldValue.increment(1) }, { merge: true })
    })
  }

  async fetchGalaxy() {
    throw new Error('Method not implemented.')
  }

  async fetchGalaxyPlanets(limit: number, offset: number) {
    const planetsRef = this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('galaxyData')
      .doc('galaxy1')
      .collection('planets')

    const galaxyPlanets = await planetsRef.orderBy('level', 'desc').limit(limit).offset(offset).get()
    let planets = []

    galaxyPlanets.forEach((docRef) => {
      planets.push(docRef.data())
    })

    console.log('fetching galaxy data')
    return planets
  }

  async getCounters() {
    const query = await this._getCounterDocumentReference().get()
    return query.data()
  }

  private _getCounterDocumentReference() {
    return this.admin.firestore().collection('admin').doc('gameData').collection('counters').doc('Jl2JWvpXIVqDRFMlf6LF')
  }

  private async incrementGalaxyPlanetCounter(valueToIncrementBy: number) {
    const planetCounter = await this._getCounterDocumentReference()
    await planetCounter.set({ galaxyPlanets: firestore.FieldValue.increment(valueToIncrementBy) }, { merge: true })
  }
}
