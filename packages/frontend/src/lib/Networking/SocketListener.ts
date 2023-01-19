import io, { Socket } from 'socket.io-client'

const address = '192.168.50.250:25145' || 'localhost:25145'

export function StartSocketConnectListener(socket: Socket) {
  socket.on('connect', () => {
    console.log('Successfully connected to server')
  })
}

export function newSocketReference(): Socket {
  return io(`${address}`, {
    transports: ['websocket', 'polling'],
  })
}
