export interface IGalaxyRepository {
  AddPlanetsToGalaxy(numberOfPlanetsToAdd: number): any

  fetchGalaxy(): any

  fetchGalaxyPlanets(limit: number, offset: number): any
}
