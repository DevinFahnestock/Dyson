import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { Socket } from 'socket.io'

export interface INetworking {
  listenForConnections()

  onUserStateChange(socket: Socket)

  onUpgradePlanet(socket: Socket)

  newUserCreation(socket: Socket, uid: string)

  onStartPlanetUpgrade(socket: Socket)

  fetchLeaderboard(socket: Socket)

  resolveUserNames(socket: Socket)

  updateResourceGeneration(socket: Socket)

  getCounters(socket: Socket)

  getUser(socket: Socket)
}
