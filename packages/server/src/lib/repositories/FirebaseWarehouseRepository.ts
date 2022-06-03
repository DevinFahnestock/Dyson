import { app } from "firebase-admin";
import { ResourceType } from "../shared";
import { Warehouse } from "../Warehouse";
import { IWarehouseRepository as IWarehouseRepository } from "./IWarehouseRepository";

export class FirebaseWarehouseRepository implements IWarehouseRepository {
    protected readonly admin: app.App

    constructor(admin: app.App) {
      this.admin = admin
    }

    setResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    getResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    async updateResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<void> {
        this.admin.firestore().collection("admin").doc("gameData").collection("warehouseData").doc(warehouseID) //find the resource and update its value to the number passed
    }

    async fetchWarehouse(userID: string, warehouseID?: string): Promise<Warehouse> {
        const warehousesRef = this.admin.firestore().collection("admin").doc("gameData").collection("warehouseData").doc(warehouseID)
        const warehouse: Warehouse = <Warehouse>(await warehousesRef.get()).data()
        if (userID === warehouse?.owner) { return warehouse }
        return null 
    }

    async createWarehouse(warehouse: Warehouse, userID: string): Promise<string> {
        const docRef = this.admin.firestore().collection("admin").doc("gameData").collection("warehouseData").doc()
        warehouse.id = docRef.id
        await docRef.set(warehouse)
        return warehouse.id
    }

    updateWarehouse(warehouseID: string, userID: string): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

}