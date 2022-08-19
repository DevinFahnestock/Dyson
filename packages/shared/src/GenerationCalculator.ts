import { Planet } from './Planet'
import dayjs from './Time/Time'

export const getResourcesGenerated = (planet: Planet) => {
  const timeElapsed = (dayjs.utc(planet.LastGeneratedTime).diff(dayjs.utc()) / 1000) * -1

  let gen = {
    food: Math.floor(0.018 * planet.level * timeElapsed),
    metal: Math.floor(0.012 * planet.level * timeElapsed),
    money: Math.floor(0.01 * planet.level * timeElapsed),
    organic: Math.floor(0.019 * planet.level * timeElapsed),
  }

  return gen
}
