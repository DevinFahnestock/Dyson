import { Warehouse } from "../Warehouse"

export interface IWarehouseService {
    
    updateResources(): Promise<void>

    createWarehouse(userID: string): Promise<string>

    getWarehouse(warehouseID: string, userID: string): Promise<Warehouse>

}