export type Counters = {
  planets: number
  users: number
  warehouses: number
  galaxyPlanets: number
}

export interface ICounterRepository {
  getCounters(): Promise<Counters>

  getCounter(counterToGet: string): Promise<number>

  incrementCounter(counterToIncrement: string, valueToIncrementBy: number): Promise<void>
}
