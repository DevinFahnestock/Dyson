import { useContext, useEffect, useState } from 'react'

import { fetchPlanetData, fetchUserData, fetchWarehouseData } from '../Networking/SocketEmitter'
import useSocket from './useSocket'
import { useUser } from '../firebase'
import React from 'react'

export const DataContext = React.createContext<any>({})

export const DataProvider = ({ children }: any) => {
  const user = useUser()
  const [userData, setUser] = useState<any>(null)
  const [planets, setPlanets] = useState<Array<any>>([])
  const [warehouse, setWarehouse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { socket } = useSocket()

  useEffect(() => {
    if (user) {
      user?.getIdToken().then((token) => {
        getAllData(token)
      })
    }
  }, [user])

  async function getAllData(token: string) {
    setLoading(true)
    const dataPromises = [
      fetchUserData(socket, token),
      fetchPlanetData(socket, token),
      fetchWarehouseData(socket, token),
    ]
    const data = await Promise.all(dataPromises)
    console.log(data)
    setUser(data[0])
    setPlanets(data[1])
    setWarehouse(data[2])
    setLoading(false)
  }

  async function fetchUser(token: string) {
    setLoading(true)
    setUser(await fetchUserData(socket, token))
    setLoading(false)
  }

  async function fetchPlanets(token: string) {
    setLoading(true)
    setPlanets(await fetchPlanetData(socket, token))
    setLoading(false)
  }

  async function fetchWarehouse(token: string) {
    setLoading(true)
    setWarehouse(await fetchWarehouseData(socket, token))
    setLoading(false)
  }

  const dataApi = {
    user: userData,
    planets: planets,
    warehouse: warehouse,
    loading: loading,
    fetchUser: fetchUser,
    fetchPlanets: fetchPlanets,
    fetchWarehouse: fetchWarehouse,
  }

  return <DataContext.Provider value={dataApi}>{children}</DataContext.Provider>
}

export const useUserData = () => {
  return useContext(DataContext)
}

export default useUserData
