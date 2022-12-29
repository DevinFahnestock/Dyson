import { User } from '@firebase/auth'

import { INetworking } from './INetworking'
import { Server, Socket } from 'socket.io'
import { IPlanetService, IUserService, IWarehouseService } from '../service'
import { PlanetType } from '@dyson/shared/dist/shared'
import { Warehouse } from '@dyson/shared/dist/Warehouse'
import { Socketcom } from '@dyson/shared/dist/Socketcom'

import { getResourcesGenerated } from '@dyson/shared/dist/GenerationCalculator'
import dayjs from '@dyson/shared/dist/Time/Time'
import { app } from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

export class SocketIONetworking implements INetworking {
  protected readonly port: number
  protected readonly server: Server
  protected readonly planetService: IPlanetService
  protected readonly userService: IUserService
  protected readonly warehouseService: IWarehouseService
  protected readonly admin: app.App

  constructor(
    port: number,
    planetService: IPlanetService,
    userService: IUserService,
    warehouseService: IWarehouseService,
    admin: app.App
  ) {
    this.port = port
    this.server = new Server(this.port)
    this.planetService = planetService
    this.userService = userService
    this.warehouseService = warehouseService
    this.admin = admin
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

  private async decodeToken(token: string): Promise<DecodedIdToken> {
    const decodedToken = await this.admin.auth().verifyIdToken(token)
    return decodedToken
  }

  private onUserStateChange(socket: Socket) {
    socket.on(Socketcom.userStateChanged, async (token: string) => {
      //return warehouse and planets if user exists, if not, return null
      const decodedToken = await this.decodeToken(token)

      socket.emit(Socketcom.updatePlanetsAndWarehouse, {
        planets: await this.planetService.getUserPlanets(decodedToken.uid),
        resources: await this.warehouseService.getWarehouse(decodedToken.uid),
      })
    })
  }

  private onUpgradePlanet(socket: Socket) {
    socket.on(Socketcom.checkCompleteUpgrade, async ({ planetID, token }) => {
      const decodedToken = await this.decodeToken(token)

      const newPlanetData = await this.planetService.checkForUpgradeCompleted(decodedToken.uid, planetID)

      if (newPlanetData) {
        socket.emit(Socketcom.planetUpdate, newPlanetData)
      }
    })
  }

  private async newUserCreation(socket: Socket, uid: string) {
    //create starter planets
    await this.planetService.createPlanet(uid, PlanetType.Lava)
    await this.planetService.createPlanet(uid, PlanetType.Wet)
    await this.planetService.createPlanet(uid, PlanetType.NoAtmosphere)
    await this.planetService.createPlanet(uid, PlanetType.Lava)

    //create warehouse
    const warehouseID = await this.warehouseService.createWarehouse(uid)

    socket.emit(Socketcom.updatePlanetsAndWarehouse, {
      planets: await this.planetService.getUserPlanets(uid),
      resources: await this.warehouseService.getWarehouse(warehouseID, uid),
    })
  }

  private onStartPlanetUpgrade(socket: Socket) {
    socket.on(Socketcom.upgradePlanet, async ({ planetID, token }) => {
      const decodedToken = await this.decodeToken(token)

      const warehouse = await this.warehouseService.getWarehouse(decodedToken.uid)
      const data = await this.planetService.startPlanetUpgrade(planetID, warehouse, decodedToken.uid, (warehouse) => {
        this.warehouseService.updateResources(warehouse, decodedToken.uid)
        socket.emit(Socketcom.warehouseUpdate, warehouse)
      })

      socket.emit(Socketcom.planetUpdate, data)
    })
  }

  private fetchLeaderboard(socket: Socket) {
    socket.on(Socketcom.fetchLeaderboard, async (offset) => {
      const planets = await this.planetService.fetchLeaderboard(offset)
      socket.emit(Socketcom.leaderboardUpdate, planets)
    })
  }

  private resolveUserNames(socket: Socket) {
    socket.on(Socketcom.resolveUserNames, async (ids) => {
      console.log('resolving usernames')
      const names = await this.userService.resolveUserNames(ids)
      socket.emit(Socketcom.usernamesResolved, names)
    })
  }

  private updateResourceGeneration(socket: Socket) {
    socket.on(Socketcom.UpdateResourceGeneration, async ({ planetID, token }) => {
      const decodedToken = await this.decodeToken(token)
      const planet = await this.planetService.getPlanet(planetID)
      if (planet.owner !== decodedToken.uid) {
        console.log('not the owner of the planet. cant generate resources.')
        return null
      }
      if (!planet.LastGeneratedTime) {
        planet.LastGeneratedTime = dayjs.utc().toISOString()
        console.log('migrating planet. [adding LastGeneratedTime]')
      }

      const warehouse = await this.warehouseService.getWarehouse(decodedToken.uid)

      const generated = getResourcesGenerated(planet)

      for (const [resource, amount] of Object.entries(generated)) {
        warehouse[resource] += amount
      }

      this.warehouseService.updateResources(warehouse, decodedToken.uid)
      socket.emit(Socketcom.warehouseUpdate, warehouse)
      planet.LastGeneratedTime = dayjs.utc().toISOString()
      this.planetService.updatePlanet(planet, decodedToken.uid)
      socket.emit(Socketcom.planetUpdate, planet)
    })
  }

  private getCounters(socket: Socket) {
    socket.on(Socketcom.getCounters, async () => {
      const counters = await this.planetService.getCounters()
      socket.emit(Socketcom.counters, counters)
    })
  }

  private getUser(socket: Socket) {
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
