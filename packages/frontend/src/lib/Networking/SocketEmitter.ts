import { Socket } from 'socket.io-client'
import { User } from '@dyson/shared/src/User'

export class SocketEmitter {
  public readonly socket: Socket

  constructor(socket: Socket) {
    this.socket = socket
  }

  public TopTenPlanets() {
    this.socket.emit('topTenPlanets')
  }

  public ResolveUserNames(userIDs: String[]) {
    this.socket.emit('resolveUserNames', userIDs)
  }

  public CheckCompleteUpgrade(planetID: String, userID: String) {
    this.socket.emit('checkCompleteUpgrade', {
      planetID: planetID,
      userID: userID,
    })
  }
  public UserStateChange(user: User) {
    this.socket.emit('userStateChanged', user)
  }

  public CheckForCompleteUpgrade(planetID: String, userID: String) {
    this.socket.emit('checkCompleteUpgrade', {
      planetID: planetID,
      userID: userID,
    })
  }

  public UpgradePlanet(planetID: String, userID: String) {
    this.socket.emit('upgradePlanet', {
      planetID: planetID,
      userID: userID,
    })
  }
}
