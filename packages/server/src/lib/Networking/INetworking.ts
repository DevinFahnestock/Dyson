import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { Socket } from 'socket.io'

export interface INetworking {
  listenForConnections()

  private decodeToken(token: string): Promise<DecodedIdToken>

  private onUserStateChange(socket: Socket)

  private onUpgradePlanet(socket: Socket)

  private newUserCreation(socket: Socket, uid: string)

  private onStartPlanetUpgrade(socket: Socket)

  private fetchLeaderboard(socket: Socket)

  private resolveUserNames(socket: Socket)

  private updateResourceGeneration(socket: Socket)

  private getCounters(socket: Socket)

  private getUser(socket: Socket)
}
