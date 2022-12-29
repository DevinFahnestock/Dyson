import { Socketcom } from '@dyson/shared/dist/Socketcom'
import { useEffect, useState } from 'react'
import { SocketEmitter } from '../Networking/SocketEmitter'

const useCounters = (socketEmitter: SocketEmitter) => {
  const [counters, setCounters] = useState<{ planets: number; users: number; warehouses: number }>({
    planets: 0,
    users: 0,
    warehouses: 0,
  })

  useEffect(() => {
    socketEmitter.GetCounters()

    socketEmitter.socket.on(Socketcom.counters, (counters) => {
      setCounters(counters)
    })

    return () => {
      socketEmitter.socket.off(Socketcom.counters)
    }
  }, [])

  return [counters] as [{ planets: number; users: number; warehouses: number }]
}

export default useCounters
