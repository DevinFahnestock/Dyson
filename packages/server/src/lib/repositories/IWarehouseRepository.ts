import { ResourceType } from "@dyson/shared/src/shared";
import { Warehouse } from "@dyson/shared/src/Warehouse";

export interface IWarehouseRepository {

    setResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<number>

    getResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<number>

    updateResources(warehouse: Warehouse, userID: string): Promise<boolean>

    fetchWarehouseByID(userID: string, warehouseID?: string): Promise<Warehouse>

    fetchWarehousesByUser(userID: string): Promise<Array<Warehouse>>

    createWarehouse(warehouse: any, userID: string): Promise<string>

    updateWarehouse(warehouseID: string, userID: string): Promise<Array<any>>

}