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
    this.UpdateUserData()
    this.onUserStateChange()
    this.onStartPlanetUpgrade()
    this.queryPlanets()
    this.resolveUserNames()
    this.updateResourceGeneration()
    this.getCounters()
    this.getUser()
    //this.userExistsCheck()
    this.createUser()
  }

  async onUserStateChange() {
    this.socket.on(Socketcom.userStateChanged, async (token: string) => {
      // TODO: check if the user is a new user and if so create initial planets and warehouse

      const decodedIDToken: DecodedIdToken = await this.auth.decodeToken(token)

      try {
        await this.userService.fetchUserByID(decodedIDToken.uid)
      } catch (error) {
        //user doesnt exist in database, create a new Starting account
        await this.newUserCreation(decodedIDToken.uid)
      }

      //return warehouse and planets if user exists, if not, throw exception
      this.socket.emit(Socketcom.updatePlanetsAndWarehouse, {
        planets: await this.planetService.getUserPlanets(decodedIDToken.uid),
        resources: await this.warehouseService.getWarehouse(decodedIDToken.uid),
      })
    })
  }

  async userExistsCheck() {
    this.socket.on(Socketcom.userExistsCheck, async (userID, callback) => {
      try {
        console.log(await this.userService.fetchUserByID(userID))
        callback(true)
      } catch (error) {
        callback(false)
      }
    })
  }

  async createUser() {
    this.socket.on(Socketcom.createNewUser, async (userID, token, callback) => {
      try {
        await this.userService.fetchUserByID(userID)
        callback({ error: 'UserAlreadyExists' })
        return
      } catch (error) {
        //user doesnt exist, create it after verifying token
        const decodedToken = await this.auth.decodeToken(token)
        if (decodedToken) {
          await this.newUserCreation(decodedToken.uid)
          callback({
            status: 'User Created Successfully',
            userID: decodedToken.uid,
          })
        }
      }
    })
  }

  async UpdateUserData() {
    this.socket.on(Socketcom.fetchUserData, async (userID) => {
      const userData = await this.userService.fetchUserByID(userID)
      const planetData = await this.planetService.getUserPlanets(userID)
      const warehouseData = await this.warehouseService.getWarehouse(userID)
      const dataToSend = { userData, planetData, warehouseData }
      this.socket.emit(Socketcom.UpdateUserData, dataToSend)
    })
  }

  async onUpgradePlanet() {
    this.socket.on(Socketcom.checkCompleteUpgrade, async ({ planetID, token }) => {
      const decodedIDToken: DecodedIdToken = await this.auth.decodeToken(token)

      const newPlanetData = await this.planetService.checkForUpgradeCompleted(decodedIDToken.uid, planetID)

      if (newPlanetData) {
        this.socket.emit(Socketcom.planetUpdate, newPlanetData)
      }
    })
  }

  async newUserCreation(userID: string) {
    // create user database entry
    await this.userService.createNewUser(userID)

    //create starter planets

    await this.planetService.createPlanet(userID, PlanetType.Lava)
    await this.planetService.createPlanet(userID, PlanetType.Wet)
    await this.planetService.createPlanet(userID, PlanetType.NoAtmosphere)
    await this.planetService.createPlanet(userID, PlanetType.Lava)

    //create warehouse
    await this.warehouseService.createWarehouse(userID)

    // this.socket.emit(Socketcom.updatePlanetsAndWarehouse, {
    //   planets: await this.planetService.getUserPlanets(userID),
    //   resources: await this.warehouseService.getWarehouse(warehouseID, userID),
    // })
  }

  async onStartPlanetUpgrade() {
    this.socket.on(Socketcom.upgradePlanet, async ({ planetID, token }) => {
      const decodedIDToken: DecodedIdToken = await this.auth.decodeToken(token)

      const warehouse = await this.warehouseService.getWarehouse(decodedIDToken.uid)
      const data = await this.planetService.startPlanetUpgrade(planetID, warehouse, decodedIDToken.uid, (warehouse) => {
        this.warehouseService.updateResources(warehouse, decodedIDToken.uid)
        this.socket.emit(Socketcom.warehouseUpdate, warehouse)
      })

      this.socket.emit(Socketcom.planetUpdate, data)
    })
  }

  async queryPlanets() {
    this.socket.on(Socketcom.queryPlanets, async (offset) => {
      const planets = await this.planetService.fetchLeaderboard(offset)
      this.socket.emit(Socketcom.leaderboardUpdate, planets)
    })
  }

  async resolveUserNames() {
    this.socket.on(Socketcom.resolveUserNames, async (ids) => {
      console.log('resolving usernames')
      const names = await this.userService.resolveUserNames(ids)
      this.socket.emit(Socketcom.usernamesResolved, names)
    })
  }

  async updateResourceGeneration() {
    this.socket.on(Socketcom.UpdateResourceGeneration, async ({ planetID, token }) => {
      const decodedIDToken: DecodedIdToken = await this.auth.decodeToken(token)
      const planet = await this.planetService.getPlanet(planetID)
      if (planet.owner !== decodedIDToken.uid) {
        console.log('not the owner of the planet. cant generate resources.')
        return null
      }
      if (!planet.LastGeneratedTime) {
        planet.LastGeneratedTime = dayjs.utc().toISOString()
        console.log('migrating planet. [adding LastGeneratedTime]')
      }

      const warehouse = await this.warehouseService.getWarehouse(decodedIDToken.uid)

      const generated = getResourcesGenerated(planet)

      for (const [resource, amount] of Object.entries(generated)) {
        warehouse[resource] += amount
      }

      this.warehouseService.updateResources(warehouse, decodedIDToken.uid)
      this.socket.emit(Socketcom.warehouseUpdate, warehouse)
      planet.LastGeneratedTime = dayjs.utc().toISOString()
      this.planetService.updatePlanet(planet, decodedIDToken.uid)
      this.socket.emit(Socketcom.planetUpdate, planet)
    })
  }

  async getCounters() {
    this.socket.on(Socketcom.getCounters, async () => {
      const counters = await this.counterRepository.getCounters()
      this.socket.emit(Socketcom.counters, counters)
    })
  }

  async getUser() {
    this.socket.on(Socketcom.getUser, async (userID) => {
      console.log('getting user for id ', userID)
      const userdata = {
        user: await this.userService.fetchUserByID(userID),
        planets: await this.planetService.getUserPlanets(userID),
      }
      this.socket.emit(Socketcom.fetchUserData, userdata)
    })
  }
}
