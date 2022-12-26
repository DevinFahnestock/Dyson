import { Planet } from '@dyson/shared/dist/Planet'
import { Warehouse } from '@dyson/shared/dist/Warehouse'

export const resourcesMet = (nextLevelReq: any, warehouse: Warehouse) => {
  if (Object.keys(nextLevelReq).find((key) => nextLevelReq[key] >= warehouse[key])) {
    return false
  }
  return true
}

export const isUpgrading = (planet: Planet) => {
  if (planet.upgradeFinishedTime) {
    return true
  }
  return false
}
