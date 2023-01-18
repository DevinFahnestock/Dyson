import dayjs from './Time/Time'

export const getResourcesGenerated = (planetLevel, planetLastGeneratedTime) => {
  const timeElapsed = (dayjs.utc(planetLastGeneratedTime).diff(dayjs.utc()) / 1000) * -1

  let gen = {
    food: Math.floor(0.018 * planetLevel * timeElapsed),
    metal: Math.floor(0.012 * planetLevel * timeElapsed),
    money: Math.floor(0.01 * planetLevel * timeElapsed),
    organic: Math.floor(0.019 * planetLevel * timeElapsed),
  }

  return gen
}
