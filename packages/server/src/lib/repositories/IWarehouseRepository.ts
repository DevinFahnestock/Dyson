import { ResourceType } from "../shared";

export interface IWarehouseRepository {

    setResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<number>

    getResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<number>

    updateResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<void>

    fetchWarehouse(userID: string, warehouseID?: string): Promise<any>

    createWarehouse(warehouse: any, userID: string): Promise<string>

    updateWarehouse(warehouseID: string, userID: string): Promise<Array<any>>

}