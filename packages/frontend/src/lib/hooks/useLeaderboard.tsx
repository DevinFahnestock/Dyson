import { Planet } from '@dyson/shared/dist/Planet'
import { Socketcom } from '@dyson/shared/dist/Socketcom'
import { useEffect, useState } from 'react'
import { QueryPlanets } from '../Networking/SocketEmitter'
import useSocket from './useSocket'

const useLeaderboard = (offset: number) => {
  const [leaderboard, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const { socket } = useSocket()

  useEffect(() => {
    getLeaders(offset)
  }, [])

  function getLeaders(offset: number) {
    setLoading(true)
    QueryPlanets(socket, offset)
    socket.on(Socketcom.leaderboardUpdate, (data: any) => {
      socket.off(Socketcom.leaderboardUpdate)
      setData(data)
      setLoading(false)
    })
  }

  function updateLeaderboardOffset(offset: number) {
    getLeaders(offset)
  }

  return [leaderboard, loading, updateLeaderboardOffset] as [Array<Planet>, boolean, any]
}

export default useLeaderboard
