import type { User } from '@dyson/shared/dist/User'

import { INetworking } from './INetworking'
import { Server, Socket } from 'socket.io'
import { IPlanetService, IUserService, IWarehouseService } from '../service'
import { PlanetType } from '@dyson/shared/dist/shared'
import { Warehouse } from '@dyson/shared/dist/Warehouse'

import { getResourcesGenerated } from '@dyson/shared/dist/GenerationCalculator'
import dayjs from '@dyson/shared/dist/Time/Time'

export class SocketIONetworking implements INetworking {
  protected readonly port: number
  protected readonly server: Server
  protected readonly planetService: IPlanetService
  protected readonly userService: IUserService
  protected readonly warehouseService: IWarehouseService

  constructor(
    port: number,
    planetService: IPlanetService,
    userService: IUserService,
    warehouseService: IWarehouseService
  ) {
    this.port = port
    this.server = new Server(this.port)
    this.planetService = planetService
    this.userService = userService
    this.warehouseService = warehouseService
  }

  public listenForConnections() {
    console.log('waiting on connection')
    this.server.on('connection', (socket) => {
      console.log('Connection established with socket ID: ', socket.handshake.address)

      this.onUpgradePlanet(socket)
      this.onUserStateChange(socket)
      this.onStartPlanetUpgrade(socket)
      this.getTopTenPlanets(socket)
      this.resolveUserNames(socket)
      this.updateResourceGeneration(socket)
      this.getCounters(socket)
      this.getUser(socket)
    })
  }

  private onUpgradePlanet(socket: Socket) {
    socket.on('checkCompleteUpgrade', async ({ planetID, userID }) => {
      const newPlanetData = await this.planetService.checkForUpgradeCompleted(userID, planetID)

      if (newPlanetData) {
        socket.emit('planetUpdate', newPlanetData)
      }
    })
  }

  private onUserStateChange(socket: Socket) {
    socket.on('userStateChanged', async (user: User) => {
      const userData = await this.userService.fetchUser(user)

      if (userData) {
        socket.emit('updateAll', {
          planets: await this.planetService.getUserPlanets(user.uid),
          resources: await this.warehouseService.getWarehouse(user.uid),
        })

        return userData
      }

      //create starter planets
      await this.planetService.createPlanet(user.uid, PlanetType.Lava)
      await this.planetService.createPlanet(user.uid, PlanetType.Wet)
      await this.planetService.createPlanet(user.uid, PlanetType.NoAtmosphere)
      await this.planetService.createPlanet(user.uid, PlanetType.Lava)

      //create warehouse
      const warehouseID = await this.warehouseService.createWarehouse(user.uid)

      socket.emit('updateAll', {
        planets: await this.planetService.getUserPlanets(user.uid),
        resources: await this.warehouseService.getWarehouse(warehouseID, user.uid),
      })
    })
  }

  private onStartPlanetUpgrade(socket: Socket) {
    socket.on('upgradePlanet', async ({ planetID, userID }) => {
      const warehouse = await this.warehouseService.getWarehouse(userID)
      const data = await this.planetService.startPlanetUpgrade(planetID, warehouse, userID, (warehouse) => {
        this.warehouseService.updateResources(warehouse, userID)
        socket.emit('warehouseUpdate', warehouse)
      })

      socket.emit('planetUpdate', data)
    })
  }

  private getTopTenPlanets(socket: Socket) {
    socket.on('topTenPlanets', async (offset) => {
      const planets = await this.planetService.getTopTenPlanets(offset)
      socket.emit('topTenUpdate', planets)
    })
  }

  private resolveUserNames(socket: Socket) {
    socket.on('resolveUserNames', async (ids) => {
      const names = await this.userService.resolveUserNames(ids)
      socket.emit('usernamesResolved', names)
    })
  }

  private updateResourceGeneration(socket: Socket) {
    socket.on('UpdateResourceGeneration', async ({ planetID, userID }) => {
      console.log('checking for resources')
      const planet = await this.planetService.getPlanet(planetID)
      if (planet.owner !== userID) {
        console.log('not the owner of the planet. cant generate resources.')
        return null
      }
      if (!planet.LastGeneratedTime) {
        planet.LastGeneratedTime = dayjs.utc().toISOString()
        console.log('migrating planet. [adding LastGeneratedTime]')
      }

      const warehouse = await this.warehouseService.getWarehouse(userID)

      const generated = getResourcesGenerated(planet)

      for (const [resource, amount] of Object.entries(generated)) {
        warehouse[resource] += amount
      }

      this.warehouseService.updateResources(warehouse, userID)
      socket.emit('warehouseUpdate', warehouse)
      planet.LastGeneratedTime = dayjs.utc().toISOString()
      this.planetService.updatePlanet(planet, userID)
      socket.emit('planetUpdate', planet)
    })
  }

  private getCounters(socket: Socket) {
    socket.on('getCounters', async () => {
      const counters = await this.planetService.getCounters()
      socket.emit('counters', counters)
    })
  }

  private getUser(socket: Socket) {
    socket.on('getUser', async (userID) => {
      console.log(userID)
      const userdata = {
        user: await this.userService.fetchUserByID(userID),
        planets: await this.planetService.getUserPlanets(userID),
      }
      socket.emit('userPageData', userdata)
    })
  }
}
