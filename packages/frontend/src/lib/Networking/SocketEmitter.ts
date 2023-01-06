import { Socketcom } from '@dyson/shared/dist/Socketcom'
import { Socket } from 'socket.io-client'

export function QueryPlanets(socket: Socket, offset: number) {
  socket.emit(Socketcom.queryPlanets, offset)
}

export function ResolveUserNames(socket: Socket, userIDs: string[]) {
  socket.emit(Socketcom.resolveUserNames, userIDs)
}

export function CheckCompleteUpgrade(socket: Socket, planetID: string, token: string) {
  socket.emit(Socketcom.checkCompleteUpgrade, {
    planetID: planetID,
    token: token,
  })
}

export function UserStateChange(socket: Socket, token: string) {
  socket.emit(Socketcom.userStateChanged, token)
}

export function UpgradePlanet(socket: Socket, planetID: string, token: string) {
  socket.emit(Socketcom.upgradePlanet, {
    planetID: planetID,
    token: token,
  })
}

export function UpdateResourceGeneration(socket: Socket, planetID: string, token: string) {
  socket.emit(Socketcom.UpdateResourceGeneration, {
    planetID: planetID,
    token: token,
  })
}

export function GetCounters(socket: Socket) {
  socket.emit(Socketcom.getCounters)
}

export function GetUserData(socket: Socket, userID: string) {
  socket.emit(Socketcom.fetchUserData, userID)
}

export function GetWarehousesByUserID(socket: Socket, userID: string, token: string) {
  socket.emit(Socketcom.GetWarehousesByUserID, { userID, token })
}

export function GetWarehouseByID(socket: Socket, warehouseID: string, token: string) {
  socket.emit(Socketcom.getWarehouseByID, { warehouseID, token })
}
