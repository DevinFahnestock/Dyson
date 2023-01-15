import React, { useContext, useState } from 'react'
import { Socket } from 'socket.io-client'
import { newSocketReference } from '../Networking/SocketListener'

export const SocketContext = React.createContext<any>({})

type SocketApiType = {
  socket: Socket
  setSocket: any
}

export const SocketProvider = ({ children }: any) => {
  const newSocket = newSocketReference()
  const [socket, setSocket] = useState<Socket>(newSocket)

  const SocketApi: SocketApiType = { socket, setSocket }

  return <SocketContext.Provider value={SocketApi}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  return useContext(SocketContext)
}

export default useSocket
