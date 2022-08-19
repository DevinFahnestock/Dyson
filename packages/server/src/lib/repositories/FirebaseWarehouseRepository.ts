import { app } from 'firebase-admin'
import { ResourceType } from '@dyson/shared/dist/shared'
import { Warehouse } from '@dyson/shared/dist/Warehouse'
import { IWarehouseRepository as IWarehouseRepository } from './IWarehouseRepository'
import FieldValue from 'firebase/firestore'

export class FirebaseWarehouseRepository implements IWarehouseRepository {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  setResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<number> {
    throw new Error('Method not implemented.')
  }

  getResource(resourceType: ResourceType, warehouseID: string, userID: string): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async updateResources(warehouse: Warehouse, userID: string): Promise<boolean> {
    const warehouseRef = this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('warehouseData')
      .doc(warehouse.id)
    const warehouseData = (await warehouseRef.get()).data()
    if (warehouseData.owner !== userID) {
      return false
    }
    warehouseRef.update(warehouse)
    return true
  }

  async fetchWarehouseByID(userID: string, warehouseID: string): Promise<Warehouse> {
    const warehousesRef = this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('warehouseData')
      .doc(warehouseID)
    const warehouse: Warehouse = <Warehouse>(await warehousesRef.get()).data()
    if (userID === warehouse?.owner) {
      return warehouse
    }
    return null
  }

  async fetchWarehousesByUser(userID: string): Promise<Array<Warehouse>> {
    const warehouseQuery = await this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('warehouseData')
      .where('owner', '==', userID)
      .get()
    const warehouses = []
    warehouseQuery.forEach((warehouse) => {
      warehouses.push(warehouse.data())
    })
    return warehouses
  }

  async createWarehouse(warehouse: Warehouse, userID: string): Promise<string> {
    const docRef = this.admin.firestore().collection('admin').doc('gameData').collection('warehouseData').doc()
    warehouse.id = docRef.id
    await docRef.set(warehouse)
    this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('counters')
      .doc('Jl2JWvpXIVqDRFMlf6LF')
      .set({ warehouses: FieldValue.increment(1) }, { merge: true })
    return warehouse.id
  }

  updateWarehouse(warehouseID: string, userID: string): Promise<any[]> {
    throw new Error('Method not implemented.')
  }
}
