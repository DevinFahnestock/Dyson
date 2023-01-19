import { useEffect, useState } from 'react'
import { GetCounters } from '../Networking/SocketEmitter'
import useSocket from './useSocket'

const useCounters = () => {
  const [counters, setCounters] = useState<{ planets: number; users: number; warehouses: number }>({
    planets: 0,
    users: 0,
    warehouses: 0,
  })

  const { socket } = useSocket()

  useEffect(() => {
    getCounterData()

    async function getCounterData() {
      setCounters(await GetCounters(socket))
    }
  }, [])

  return [counters] as [{ planets: number; users: number; warehouses: number }]
}

export default useCounters
