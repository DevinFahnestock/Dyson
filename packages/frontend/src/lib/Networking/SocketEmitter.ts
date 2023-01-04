import { Socketcom } from '@dyson/shared/dist/Socketcom'
import { Socket } from 'socket.io-client'

export class SocketEmitter {
  public socket: Socket

  constructor(socket: Socket) {
    this.socket = socket
  }

  public QueryPlanets(offset: number) {
    this.socket.emit(Socketcom.queryPlanets, offset)
  }

  public ResolveUserNames(userIDs: String[]) {
    this.socket.emit(Socketcom.resolveUserNames, userIDs)
  }

  public CheckCompleteUpgrade(planetID: String, token: String) {
    this.socket.emit(Socketcom.checkCompleteUpgrade, {
      planetID: planetID,
      token: token,
    })
  }

  public UserStateChange(token: string) {
    this.socket.emit(Socketcom.userStateChanged, token)
  }

  public UpgradePlanet(planetID: String, token: String) {
    this.socket.emit(Socketcom.upgradePlanet, {
      planetID: planetID,
      token: token,
    })
  }

  public UpdateResourceGeneration(planetID: String, token: String) {
    this.socket.emit(Socketcom.UpdateResourceGeneration, {
      planetID: planetID,
      token: token,
    })
  }

  public GetCounters() {
    this.socket.emit(Socketcom.getCounters)
  }

  public GetUserPage(userID: String) {
    this.socket.emit(Socketcom.userPageData, userID)
  }
}
