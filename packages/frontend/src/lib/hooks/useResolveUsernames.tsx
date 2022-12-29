import { Socketcom } from '@dyson/shared/dist/Socketcom'
import { useEffect, useState } from 'react'
import { SocketEmitter } from '../Networking/SocketEmitter'

const useResolveUsernames = (socketEmitter: SocketEmitter, userIDs: Array<String>) => {
  const [usernames, setUsernames] = useState<Object>({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      setLoading(true)
      socketEmitter.ResolveUserNames(userIDs)
      socketEmitter.socket.on(Socketcom.usernamesResolved, (data: Array<Object>) => {
        setUsernames(data)
        console.log('recieved usernames from the server', data)
        socketEmitter.socket.off(Socketcom.usernamesResolved)
      })
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return { usernames, error, loading }
}

export default useResolveUsernames
