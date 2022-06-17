import { IWarehouseRepository } from "../repositories/IWarehouseRepository";
import { Warehouse } from "@dyson/shared/dist/Warehouse";
import { IWarehouseService } from "./IWarehouseService";
import upgradeCosts from '@dyson/shared/src/resources/upgrade-costs.json'

import config from '@dyson/shared/src/resources/config.json'

export class WarehouseService implements IWarehouseService {

    private readonly starterResources = config.StarterResources

    private readonly warehouseRepository: IWarehouseRepository

    constructor(warehouseRepository: IWarehouseRepository) {
        this.warehouseRepository = warehouseRepository
    }

    updateResources(warehouse: Warehouse, userID: string): Promise<boolean> {
        return this.warehouseRepository.updateResources(warehouse, userID)
    }

    createWarehouse(userID: string): Promise<string> {
        return this.warehouseRepository.createWarehouse({
            id: null,
            owner: userID,
            metal: this.starterResources.metal,
            organic: this.starterResources.organic,
            food: this.starterResources.food,
            money: this.starterResources.money
        }, userID)
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