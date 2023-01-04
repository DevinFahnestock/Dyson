import { Planet } from '@dyson/shared/dist/Planet'
import { Socketcom } from '@dyson/shared/dist/Socketcom'
import { useEffect, useState } from 'react'
import { SocketEmitter } from '../Networking/SocketEmitter'

const useLeaderboard = (socketEmitter: SocketEmitter, offset: number) => {
  const [leaderboard, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const getLeaders = (offset: number) => {
    setLoading(true)
    socketEmitter.QueryPlanets(offset)
    socketEmitter.socket.on(Socketcom.leaderboardUpdate, (data: any) => {
      socketEmitter.socket.off(Socketcom.leaderboardUpdate)
      setData(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    getLeaders(offset)
  }, [])

  const updateLeaderboardOffset = (offset: number) => {
    getLeaders(offset)
  }

  return [leaderboard, loading, updateLeaderboardOffset] as [Array<Planet>, boolean, any]
}

export default useLeaderboard
