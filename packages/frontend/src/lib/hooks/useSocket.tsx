import React, { useContext, useState } from 'react'
import { Socket } from 'socket.io-client'
import { newSocketReference } from '../Networking/SocketListener'

export const SocketContext = React.createContext<any>({})

export const SocketProvider = ({ children }: any) => {
  const newSocket = newSocketReference()
  const [socket, setSocket] = useState<Socket>(newSocket)

  return <SocketContext.Provider value={{ socket, setSocket }}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  return useContext(SocketContext)
}

export default useSocket
