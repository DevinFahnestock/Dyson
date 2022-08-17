import { Planet } from './Planet'
import dayjs from './Time/Time'

export const getResourcesGenerated = (planet: Planet) => {
  const timeElapsed = (dayjs.utc(planet.LastGeneratedTime).diff(dayjs.utc()) / 1000) * -1

  let gen = {
    food: Math.floor(0.8 * planet.level * timeElapsed),
    metal: Math.floor(1.2 * planet.level * timeElapsed),
    money: Math.floor(1.0 * planet.level * timeElapsed),
    organic: Math.floor(0.9 * planet.level * timeElapsed),
  }

  return gen
}
