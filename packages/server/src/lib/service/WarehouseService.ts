import { IWarehouseRepository } from '../repositories/IWarehouseRepository'
import { Warehouse } from '@dyson/shared/dist/Warehouse'
import { IWarehouseService } from './IWarehouseService'
import upgradeCosts from '@dyson/shared/src/resources/upgrade-costs.json'

import config from '@dyson/shared/src/resources/config.json'

export class WarehouseService implements IWarehouseService {
  private readonly starterResources = config.StarterResources

  private readonly warehouseRepository: IWarehouseRepository

  constructor(warehouseRepository: IWarehouseRepository) {
    this.warehouseRepository = warehouseRepository
  }

  async deleteWarehouseByID(warehouseID: string): Promise<void> {
    await this.warehouseRepository.deleteWarehouseByID(warehouseID)
  }

  async deleteAllWarehousesByUserID(userID: string): Promise<void> {
    const warehouses = await this.warehouseRepository.fetchUserWarehouses(userID)
    warehouses.map(async (warehouse) => {
      await this.warehouseRepository.deleteWarehouseByID(warehouse.id)
    })
  }

  async getUserWarehouses(userID: string): Promise<any[]> {
    return await this.warehouseRepository.fetchUserWarehouses(userID)
  }

  async updateResources(warehouse: Warehouse, userID: string): Promise<boolean> {
    return await this.warehouseRepository.updateResources(warehouse, userID)
  }

  async createWarehouse(userID: string): Promise<string> {
    return await this.warehouseRepository.createWarehouse(
      {
        id: null,
        owner: userID,
        metal: this.starterResources.metal,
        organic: this.starterResources.organic,
        food: this.starterResources.food,
        money: this.starterResources.money,
      },
      userID
    )
  }

  async getWarehouse(userID: string, warehouseID?: string): Promise<Warehouse> {
    if (warehouseID) {
      return await this.warehouseRepository.fetchWarehouseByID(userID, warehouseID)
    } else {
      const warehouse = await this.warehouseRepository.fetchWarehousesByUser(userID)
      return warehouse[0]
    }
  }
}
