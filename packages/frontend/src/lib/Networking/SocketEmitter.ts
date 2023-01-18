import { Socketcom } from '@dyson/shared/dist/Socketcom'
import { Socket } from 'socket.io-client'

export async function checkUserExists(socket: Socket, userID: string, token: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    socket.emit(Socketcom.createNewUser, userID, token, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response.status)
      }
    })
  })
}

export function QueryPlanets(socket: Socket, offset: number): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(Socketcom.queryPlanets, offset, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response.status)
      }
    })
  })
}

export function ResolveUserNames(socket: Socket, userIDs: string[]): Promise<Array<any>> {
  return new Promise((resolve, reject) => {
    socket.emit(Socketcom.resolveUserNames, userIDs, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  })
}

export function CheckCompleteUpgrade(socket: Socket, planetID: string, token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(Socketcom.checkCompleteUpgrade, planetID, token, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  })
}

export function UserStateChange(socket: Socket, token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(Socketcom.userStateChanged, token, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  })
}

export function UpgradePlanet(socket: Socket, planetID: string, token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(Socketcom.upgradePlanet, planetID, token, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  })
}

export function UpdateResourceGeneration(socket: Socket, planetID: string, token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(Socketcom.UpdateResourceGeneration, planetID, token, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  })
}

export function GetCounters(socket: Socket): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(Socketcom.getCounters, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  })
}

export function GetUserData(socket: Socket, userID: string): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(Socketcom.fetchUserData, userID, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  })
}

export function GetWarehousesByUserID(socket: Socket, userID: string, token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(Socketcom.GetWarehousesByUserID, userID, token, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  })
}

export function GetWarehouseByID(socket: Socket, warehouseID: string, token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(Socketcom.getWarehouseByID, warehouseID, token, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  })
}
