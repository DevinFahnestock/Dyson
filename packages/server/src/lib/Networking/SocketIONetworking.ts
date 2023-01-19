import { INetworking } from './INetworking'
import { Socket } from 'socket.io'
import { IPlanetService, IUserService, IWarehouseService } from '../service'
import { PlanetType } from '@dyson/shared/dist/shared'
import { Socketcom } from '@dyson/shared/dist/Socketcom'

import { getResourcesGenerated } from '@dyson/shared/dist/GenerationCalculator'
import dayjs from '@dyson/shared/dist/Time/Time'
import { app } from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { ICounterRepository } from '../repositories'
import { Auth } from '../firebase/auth'

export class SocketIONetworking implements INetworking {
  protected readonly port: number

  protected readonly planetService: IPlanetService
  protected readonly userService: IUserService
  protected readonly warehouseService: IWarehouseService

  protected readonly counterRepository: ICounterRepository

  protected readonly admin: app.App

  protected readonly auth: Auth

  protected readonly socket: Socket

  constructor(
    port: number,
    planetService: IPlanetService,
    userService: IUserService,
    warehouseService: IWarehouseService,
    counterRepository: ICounterRepository,
    admin: app.App,
    auth: Auth,
    socket: Socket
  ) {
    this.port = port

    this.planetService = planetService
    this.userService = userService
    this.warehouseService = warehouseService

    this.counterRepository = counterRepository

    this.admin = admin

    this.auth = auth

    this.socket = socket

    // start all listener functions
    this.onUpgradePlanet()
    this.fetchUserData()
    this.fetchPlanetData()
    this.fetchWarehouseData()
    this.onStartPlanetUpgrade()
    this.queryPlanets()
    this.resolveUserNames()
    this.updateResourceGeneration()
    this.getCounters()
    this.createNewUser()
  }

  // returns: boolean. true if user exists
  async userExistsCheck() {
    this.socket.on(Socketcom.userExistsCheck, async (userID, callback) => {
      try {
        await this.userService.fetchUserByID(userID)
        callback(true)
      } catch (error) {
        callback(false)
      }
    })
  }

  // returns: userID status
  async createNewUser() {
    this.socket.on(Socketcom.createNewUser, async (userID, token, callback) => {
      try {
        await this.userService.fetchUserByID(userID)
        callback({ error: `User already exists with id: ${userID}` })
        return
      } catch (error) {
        //user doesnt exist, create it after verifying token
        const decodedToken = await this.auth.decodeToken(token)
        if (decodedToken) {
          await this._createNewUserDatabaseEntry(decodedToken.uid)
          callback({
            status: 'User Created Successfully',
            userID: decodedToken.uid,
          })
        }
      }
    })
  }

  async fetchUserData() {
    this.socket.on(Socketcom.fetchUserData, async (token, callback) => {
      const decodedIDToken = await this.auth.decodeToken(token)
      if (decodedIDToken) {
        try {
          const userData = await this.userService.fetchUserByID(decodedIDToken.uid)
          callback(userData)
        } catch (error) {
          callback({ error: error })
        }
      } else {
        callback({ error: 'could not verify token' })
      }
    })
  }

  async fetchPlanetData() {
    this.socket.on(Socketcom.fetchPlanetData, async (token, callback) => {
      const decodedIDToken = await this.auth.decodeToken(token)
      if (decodedIDToken) {
        try {
          const planetData = await this.planetService.getUserPlanets(decodedIDToken.uid)
          callback(planetData)
        } catch (error) {
          callback({ error: error })
        }
      } else {
        callback({ error: 'could not verify token' })
      }
    })
  }

  async fetchWarehouseData() {
    this.socket.on(Socketcom.fetchWarehouseData, async (token, callback) => {
      const decodedIDToken = await this.auth.decodeToken(token)
      if (decodedIDToken) {
        try {
          const warehouseData = await this.warehouseService.getWarehouse(decodedIDToken.uid)
          callback(warehouseData)
        } catch (error) {
          callback({ error: error })
        }
      } else {
        callback({ error: 'could not verify token' })
      }
    })
  }

  // returns: the new planet data (can maybe change this to only update the planets last update time)
  async onUpgradePlanet() {
    this.socket.on(Socketcom.checkCompleteUpgrade, async (planetID, token, callback) => {
      try {
        const decodedIDToken: DecodedIdToken = await this.auth.decodeToken(token)
        const newPlanetData = await this.planetService.checkForUpgradeCompleted(decodedIDToken.uid, planetID)

        callback(newPlanetData)
      } catch (error) {
        callback({ error: error })
      }
    })
  }

  async onStartPlanetUpgrade() {
    this.socket.on(Socketcom.upgradePlanet, async ({ planetID, token }) => {
      const decodedIDToken: DecodedIdToken = await this.auth.decodeToken(token)

      const warehouse = await this.warehouseService.getWarehouse(decodedIDToken.uid)
      const data = await this.planetService.startPlanetUpgrade(planetID, warehouse, decodedIDToken.uid, (warehouse) => {
        this.warehouseService.updateResources(warehouse, decodedIDToken.uid)
        //make a callback
      })
    })
  }

  async queryPlanets() {
    this.socket.on(Socketcom.queryPlanets, async (offset, callback) => {
      try {
        const planets = await this.planetService.fetchLeaderboard(offset)
        callback(planets)
      } catch (error) {
        callback({ error: error })
      }
    })
  }

  async resolveUserNames() {
    this.socket.on(Socketcom.resolveUserNames, async (ids, callback) => {
      try {
        const userNames = await this.userService.resolveUserNames(ids)
        callback(userNames)
      } catch (error) {
        callback({ error: error })
      }
    })
  }

  async updateResourceGeneration() {
    this.socket.on(Socketcom.UpdateResourceGeneration, async (planetID, token, callback) => {
      try {
        const decodedIDToken: DecodedIdToken = await this.auth.decodeToken(token)
        const planet = await this.planetService.getPlanet(planetID)
        if (planet.owner !== decodedIDToken.uid) {
          callback({ error: 'Authenticated user did not match the owner of the planet' })
          return
        }
        const warehouse = await this.warehouseService.getWarehouse(decodedIDToken.uid)

        const generated = getResourcesGenerated(planet.level, planet.LastGeneratedTime)

        for (const [resource, amount] of Object.entries(generated)) {
          warehouse[resource] += amount
        }

        this.warehouseService.updateResources(warehouse, decodedIDToken.uid)
        planet.LastGeneratedTime = dayjs.utc().toISOString()
        this.planetService.updatePlanet(planet, decodedIDToken.uid)
        callback(planet, warehouse)
      } catch (error) {
        callback({ error: error })
      }
    })
  }

  async getCounters() {
    this.socket.on(Socketcom.getCounters, async (callback) => {
      try {
        const counters = await this.counterRepository.getCounters()
        callback(counters)
      } catch (error) {
        callback({ error: error })
      }
    })
  }

  async _createNewUserDatabaseEntry(userID: string) {
    // create user database entry
    await this.userService.createNewUser(userID)

    //create starter planets

    await this.planetService.createPlanet(userID, PlanetType.Lava)
    await this.planetService.createPlanet(userID, PlanetType.Wet)
    await this.planetService.createPlanet(userID, PlanetType.NoAtmosphere)
    await this.planetService.createPlanet(userID, PlanetType.Lava)

    //create warehouse
    await this.warehouseService.createWarehouse(userID)
  }
}
