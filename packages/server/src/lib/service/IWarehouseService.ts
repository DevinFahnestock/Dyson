import { Warehouse } from "../Warehouse"

export interface IWarehouseService {
    
    updateResources(): Promise<void>

    createWarehouse(userID: string): Promise<string>

    getWarehouse(userID: string, warehouseID?: string): Promise<Warehouse>

}