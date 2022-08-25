import { Socket } from 'socket.io-client'

export class SocketEmitter {
  public socket: Socket

  constructor(socket: Socket) {
    this.socket = socket
  }

  public TopTenPlanets(offset: number) {
    this.socket.emit('topTenPlanets', offset)
  }

  public ResolveUserNames(userIDs: String[]) {
    this.socket.emit('resolveUserNames', userIDs)
  }

  public CheckCompleteUpgrade(planetID: String, token: String) {
    this.socket.emit('checkCompleteUpgrade', {
      planetID: planetID,
      token: token,
    })
  }

  public UserStateChange(token: string) {
    this.socket.emit('userStateChanged', token)
  }

  public UpgradePlanet(planetID: String, token: String) {
    this.socket.emit('upgradePlanet', {
      planetID: planetID,
      token: token,
    })
  }

  public UpdateResourceGeneration(planetID: String, token: String) {
    this.socket.emit('UpdateResourceGeneration', {
      planetID: planetID,
      token: token,
    })
  }

  public GetCounters() {
    this.socket.emit('getCounters')
  }

  public GetUserPage(userID: String) {
    this.socket.emit('getUser', userID)
  }
}
