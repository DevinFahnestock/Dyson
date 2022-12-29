import { Socketcom } from '@dyson/shared/dist/Socketcom'
import { useEffect, useState } from 'react'
import { SocketEmitter } from '../Networking/SocketEmitter'

const useResolveUsernames = (socketEmitter: SocketEmitter, userIDs?: Array<String>) => {
  const [usernames, setUsernames] = useState<Object>()
  const [loading, setLoading] = useState(false)

  const setUserIDs = (ids: Array<String>) => {
    getNames(ids)
  }

  const getNames = (ids: Array<String>) => {
    setLoading(true)
    socketEmitter.ResolveUserNames(ids)
    socketEmitter.socket.on(Socketcom.usernamesResolved, (data: Array<Object>) => {
      setUsernames(data)
      socketEmitter.socket.off(Socketcom.usernamesResolved)
      setLoading(false)
    })
  }

  useEffect(() => {
    if (userIDs) {
      getNames(userIDs)
    }
  }, [])

  const clearUsernames = () => {
    setUsernames({})
  }

  return [usernames, loading, setUserIDs, clearUsernames] as [Object, boolean, (ids: String[]) => void, () => void]
}

export default useResolveUsernames
