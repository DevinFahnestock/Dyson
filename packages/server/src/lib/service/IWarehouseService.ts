import { Warehouse } from "@dyson/shared/dist/Warehouse"

export interface IWarehouseService {
    
    updateResources(warehouse: Warehouse, userID: string): Promise<boolean>

    createWarehouse(userID: string): Promise<string>

    getWarehouse(userID: string, warehouseID?: string): Promise<Warehouse>

}