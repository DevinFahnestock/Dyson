import React, { useContext, useState, useCallback } from "react"
import { Warehouse } from "../Warehouse"

export const WarehouseContext = React.createContext({})

export const WarehouseProvider = ({ children }: any) => {
  const [warehouse, setWarehouse] = useState({})

  const clearWarehouse = useCallback(() => {
    setWarehouse({})
  }, [setWarehouse])

  const updateWarehouse = useCallback(
    (data: Warehouse) => {
      setWarehouse(data)
    },
    [setWarehouse]
  )

  const updateResource = useCallback(({ resource, amount }: any) => {
    setWarehouse((warehouse) => {
      const resourceIndex = Object.keys(warehouse).findIndex(
        (element) => resource === element
      )

      warehouse[resourceIndex] = amount
      return warehouse
    })
  }, [])

  const warehouseApi = {
    warehouse,
    clearWarehouse,
    updateResource,
    updateWarehouse,
  }

  return (
    <WarehouseContext.Provider value={warehouseApi}>
      {children}
    </WarehouseContext.Provider>
  )
}

export const useWarehouse = () => {
  return useContext(WarehouseContext)
}

export default useWarehouse
