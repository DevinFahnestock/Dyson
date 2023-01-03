export interface IGalaxyRepository {
  createGalaxy(): any

  fetchGalaxy(): any

  fetchGalaxyPlanets(limit: number, offset: number): any

  getCounters(): Promise<any>
}
