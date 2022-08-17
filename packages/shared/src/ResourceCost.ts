export const PlanetResourceUpgradeCost = (level: number) => {
  return {
    metal: Math.floor(20 * Math.pow(1.39, level)),
    organic: Math.floor(15 * Math.pow(1.35, level)),
    food: Math.floor(10 * Math.pow(1.46, level)),
    money: Math.floor(25 * Math.pow(1.26, level)),
  }
}

export const PlanetTimeUpgradeCost = (level: number) => {
  let sec = 60 * Math.pow(1.61, level)
  let min = (sec / 60) % 60
  let hour = sec / 3600

  sec = sec % 60

  sec = Math.floor(sec)
  min = Math.floor(min)
  hour = Math.floor(hour)

  return {
    hours: hour,
    minutes: min,
    seconds: sec,
  }
}
