//import { Socketcom } from '@dyson/shared/dist/Socketcom'
import { useEffect, useState } from 'react'
import { ResolveUserNames } from '../Networking/SocketEmitter'

import { useSocket } from './useSocket'

const useResolveUsernames = (userIDs?: Array<string>) => {
  const [usernames, setUsernames] = useState<Object>()
  const [loading, setLoading] = useState(false)

  const { socket } = useSocket()

  const setUserIDs = (ids: Array<string>) => {
    getNames(ids)
  }

  const getNames = (ids: Array<string>) => {
    setLoading(true)
    ResolveUserNames(socket, ids)
    // socket.on(Socketcom.usernamesResolved, (data: Array<Object>) => {
    //   setUsernames(data)
    //   socket.off(Socketcom.usernamesResolved)
    //   setLoading(false)
    // })
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
