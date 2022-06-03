import { IWarehouseRepository } from "../repositories/IWarehouseRepository";
import { Warehouse } from "../Warehouse";
import { IWarehouseService } from "./IWarehouseService";

export class WarehouseService implements IWarehouseService {

    private readonly warehouseRepository: IWarehouseRepository

    constructor(warehouseRepository: IWarehouseRepository) {
        this.warehouseRepository = warehouseRepository
    }

    updateResources(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    createWarehouse(userID: string): Promise<string> {
        return this.warehouseRepository.createWarehouse({
            id: null,
            owner: userID,
            metal: 10,
            organic: 10,
            food: 10,
            money: 0
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