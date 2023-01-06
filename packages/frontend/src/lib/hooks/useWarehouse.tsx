import React, { useContext, useState, useCallback } from 'react'
import { Warehouse } from '@dyson/shared/dist/Warehouse'
import { User } from 'firebase/auth'
import { GetWarehousesByUserID } from '../Networking/SocketEmitter'
import useSocket from './useSocket'

export const WarehouseContext = React.createContext<any>({})

export const WarehouseProvider = ({ children }: any) => {
  const [warehouse, setWarehouse] = useState({})

  const { socket } = useSocket()
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
      const resourceIndex = Object.keys(warehouse).findIndex((element) => resource === element)

      warehouse[resourceIndex] = amount
      return warehouse
    })
  }, [])

  const fetchWarehouse = (user: User) => {
    user.getIdToken().then((token) => {
      GetWarehousesByUserID(socket, user.uid, token)
    })
  }

  const warehouseApi = {
    warehouse,
    clearWarehouse,
    updateResource,
    updateWarehouse,
    fetchWarehouse,
  }

  return <WarehouseContext.Provider value={warehouseApi}>{children}</WarehouseContext.Provider>
}

export const useWarehouse = () => {
  return useContext(WarehouseContext)
}

export default useWarehouse
