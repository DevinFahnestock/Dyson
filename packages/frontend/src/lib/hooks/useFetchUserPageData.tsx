import { Planet } from '@dyson/shared/dist/Planet'
import { Socketcom } from '@dyson/shared/dist/Socketcom'
import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { SocketEmitter } from '../Networking/SocketEmitter'

const useFetchUserPageData = (socketEmitter: SocketEmitter, id: String | undefined) => {
  const [userPageData, setData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      setLoading(true)
      socketEmitter.GetUserPage(id)
      socketEmitter.socket.on(Socketcom.userPageData, (data) => {
        socketEmitter.socket.off('userPageData')
        setData(data)
        setLoading(false)
      })
    }
  }, [])

  return [userPageData, loading] as [{ user: User; planets: Planet[] }, boolean]
}

export default useFetchUserPageData
