import { useEffect, useState } from 'react'

import { Socketcom } from '@dyson/shared/dist/Socketcom'

import { GetUserData } from '../Networking/SocketEmitter'
import useSocket from './useSocket'
import { useUser } from '../firebase'

type UpdateUserDataTypes = {
  userData: any
  planetData: Array<any>
  warehouseData: any
}

const useFetchUserData = (id?: string) => {
  const user = useUser()
  const [userData, setUser] = useState<any>(null)
  const [planets, setPlanets] = useState<Array<any>>([])
  const [warehouse, setWarehouse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { socket } = useSocket()

  useEffect(() => {
    const idToUse = id || user?.uid
    if (idToUse) {
      setLoading(true)
      GetUserData(socket, idToUse)
      socket.on(Socketcom.UpdateUserData, ({ userData, planetData, warehouseData }: UpdateUserDataTypes) => {
        socket.off(Socketcom.UpdateUserData)
        setUser(userData)
        setPlanets(planetData)
        setWarehouse(warehouseData)
        setLoading(false)
      })
    }
  }, [user])

  return { user: userData, planets: planets, warehouse: warehouse, loading: loading } as {
    user: any
    planets: Array<any>
    warehouse: any
    loading: boolean
  }
}

export default useFetchUserData
