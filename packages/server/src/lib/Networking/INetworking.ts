export interface INetworking {
  onUserStateChange()

  onUpgradePlanet()

  newUserCreation(uid: string)

  onStartPlanetUpgrade()

  fetchLeaderboard()

  resolveUserNames()

  updateResourceGeneration()

  getCounters()

  getUser()
}
