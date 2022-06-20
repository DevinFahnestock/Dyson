import type { User } from '@dyson/shared/dist/User'

import { INetworking } from './INetworking'
import { Server, Socket } from 'socket.io'
import { IPlanetService, IUserService, IWarehouseService } from '../service'
import { PlanetType } from '@dyson/shared/dist/shared'
import { Warehouse } from '@dyson/shared/dist/Warehouse'

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
    socket.on('topTenPlanets', async () => {
      const planets = await this.planetService.getTopTenPlanets()
      socket.emit('topTenUpdate', planets)
    })
  }
}
