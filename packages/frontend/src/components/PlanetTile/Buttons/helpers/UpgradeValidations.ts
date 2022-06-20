import { Planet } from '@dyson/shared/dist/Planet'
import { Warehouse } from '@dyson/shared/dist/Warehouse'

export const resourcesMet = (nextLevelReq: any, warehouse: Warehouse) => {
  if (nextLevelReq.food >= warehouse.food) {
    return false
  }
  if (nextLevelReq.metal >= warehouse.metal) {
    return false
  }
  if (nextLevelReq.money >= warehouse.money) {
    return false
  }
  if (nextLevelReq.organic >= warehouse.organic) {
    return false
  }
  return true
}

export const isUpgrading = (planet: Planet) => {
  if (planet?.upgradeFinishedTime) {
    return true
  }
  return false
}
