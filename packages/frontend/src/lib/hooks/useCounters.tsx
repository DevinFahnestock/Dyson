import { Socketcom } from '@dyson/shared/dist/Socketcom'
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
    GetCounters(socket)

    socket.on(Socketcom.counters, (counters: any) => {
      setCounters(counters)
    })

    return () => {
      socket.off(Socketcom.counters)
    }
  }, [])

  return [counters] as [{ planets: number; users: number; warehouses: number }]
}

export default useCounters
