export interface INetworking {
  onUserStateChange()

  onUpgradePlanet()

  newUserCreation(uid: string)

  onStartPlanetUpgrade()

  queryPlanets()

  resolveUserNames()

  updateResourceGeneration()

  getCounters()

  getUser()
}
