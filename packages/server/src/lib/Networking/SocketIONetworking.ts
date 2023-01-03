import { INetworking } from './INetworking'
import { Server, Socket } from 'socket.io'
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
  protected readonly server: Server
  protected readonly planetService: IPlanetService
  protected readonly userService: IUserService
  protected readonly warehouseService: IWarehouseService

  protected readonly counterRepository: ICounterRepository

  protected readonly admin: app.App

  protected readonly auth: Auth

  constructor(
    port: number,
    planetService: IPlanetService,
    userService: IUserService,
    warehouseService: IWarehouseService,
    counterRepository: ICounterRepository,
    admin: app.App,
    auth: Auth
  ) {
    this.port = port
    this.server = new Server(this.port)
    this.planetService = planetService
    this.userService = userService
    this.warehouseService = warehouseService

    this.counterRepository = counterRepository

    this.admin = admin

    this.auth = auth
  }

  public listenForConnections() {
    console.log('waiting on connection')
    this.server.on('connection', (socket) => {
      console.log('Connection established with socket ID: ', socket.handshake.address)

      this.onUpgradePlanet(socket)
      this.onUserStateChange(socket)
      this.onStartPlanetUpgrade(socket)
      this.fetchLeaderboard(socket)
      this.resolveUserNames(socket)
      this.updateResourceGeneration(socket)
      this.getCounters(socket)
      this.getUser(socket)
    })
  }

  async onUserStateChange(socket: Socket) {
    socket.on(Socketcom.userStateChanged, async (token: string) => {
      // TODO: check if the user is a new user and if so create initial planets and warehouse

      const decodedIDToken: DecodedIdToken = await this.auth.decodeToken(token)
      let userData: any
      try {
        userData = await this.userService.fetchUserByID(decodedIDToken.uid)
      } catch (error) {
        //user doesnt exist in database, create a new Starting account
        await this.userService.createNewUser(decodedIDToken.uid)
        userData = await this.userService.fetchUserByID(decodedIDToken.uid)
        await this.newUserCreation(socket, decodedIDToken.uid)
      }

      //return warehouse and planets if user exists, if not, throw exception
      socket.emit(Socketcom.updatePlanetsAndWarehouse, {
        planets: await this.planetService.getUserPlanets(decodedIDToken.uid),
        resources: await this.warehouseService.getWarehouse(decodedIDToken.uid),
      })
    })
  }

  async onUpgradePlanet(socket: Socket) {
    socket.on(Socketcom.checkCompleteUpgrade, async ({ planetID, token }) => {
      const decodedIDToken: DecodedIdToken = await this.auth.decodeToken(token)

      const newPlanetData = await this.planetService.checkForUpgradeCompleted(decodedIDToken.uid, planetID)

      if (newPlanetData) {
        socket.emit(Socketcom.planetUpdate, newPlanetData)
      }
    })
  }

  async newUserCreation(socket: Socket, userID: string) {
    //create starter planets
    await this.planetService.createPlanet(userID, PlanetType.Lava)
    await this.planetService.createPlanet(userID, PlanetType.Wet)
    await this.planetService.createPlanet(userID, PlanetType.NoAtmosphere)
    await this.planetService.createPlanet(userID, PlanetType.Lava)

    //create warehouse
    const warehouseID = await this.warehouseService.createWarehouse(userID)

    socket.emit(Socketcom.updatePlanetsAndWarehouse, {
      planets: await this.planetService.getUserPlanets(userID),
      resources: await this.warehouseService.getWarehouse(warehouseID, userID),
    })
  }

  async onStartPlanetUpgrade(socket: Socket) {
    socket.on(Socketcom.upgradePlanet, async ({ planetID, token }) => {
      const decodedIDToken: DecodedIdToken = await this.auth.decodeToken(token)

      const warehouse = await this.warehouseService.getWarehouse(decodedIDToken.uid)
      const data = await this.planetService.startPlanetUpgrade(planetID, warehouse, decodedIDToken.uid, (warehouse) => {
        this.warehouseService.updateResources(warehouse, decodedIDToken.uid)
        socket.emit(Socketcom.warehouseUpdate, warehouse)
      })

      socket.emit(Socketcom.planetUpdate, data)
    })
  }

  async fetchLeaderboard(socket: Socket) {
    socket.on(Socketcom.fetchLeaderboard, async (offset) => {
      const planets = await this.planetService.fetchLeaderboard(offset)
      socket.emit(Socketcom.leaderboardUpdate, planets)
    })
  }

  async resolveUserNames(socket: Socket) {
    socket.on(Socketcom.resolveUserNames, async (ids) => {
      console.log('resolving usernames')
      const names = await this.userService.resolveUserNames(ids)
      socket.emit(Socketcom.usernamesResolved, names)
    })
  }

  async updateResourceGeneration(socket: Socket) {
    socket.on(Socketcom.UpdateResourceGeneration, async ({ planetID, token }) => {
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
      socket.emit(Socketcom.warehouseUpdate, warehouse)
      planet.LastGeneratedTime = dayjs.utc().toISOString()
      this.planetService.updatePlanet(planet, decodedIDToken.uid)
      socket.emit(Socketcom.planetUpdate, planet)
    })
  }

  async getCounters(socket: Socket) {
    socket.on(Socketcom.getCounters, async () => {
      const counters = await this.counterRepository.getCounters()
      socket.emit(Socketcom.counters, counters)
    })
  }

  async getUser(socket: Socket) {
    socket.on(Socketcom.getUser, async (userID) => {
      console.log('getting user for id ', userID)
      const userdata = {
        user: await this.userService.fetchUserByID(userID),
        planets: await this.planetService.getUserPlanets(userID),
      }
      socket.emit(Socketcom.userPageData, userdata)
    })
  }
}
