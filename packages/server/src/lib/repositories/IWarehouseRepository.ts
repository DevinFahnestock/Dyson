import { ResourceType } from "../shared";
import { Warehouse } from "../Warehouse";

export interface IWarehouseRepository {

    setResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<number>

    getResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<number>

    updateResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<void>

    fetchWarehouseByID(userID: string, warehouseID?: string): Promise<Warehouse>

    fetchWarehousesByUser(userID: string): Promise<Array<Warehouse>>

    createWarehouse(warehouse: any, userID: string): Promise<string>

    updateWarehouse(warehouseID: string, userID: string): Promise<Array<any>>

}