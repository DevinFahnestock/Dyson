import io, { Socket } from 'socket.io-client'

const address = process.env.SERVER_ADDRESS || 'localhost:25145'

export const StartAllSocketListeners = (
  currentSocket: Socket,
  updateAllPlanets: any,
  updateWarehouse: any,
  updatePlanet: any
) => {
  currentSocket.on('connect', () => {
    console.log('Successfully connected to server')
  })

  currentSocket.on('updateAll', ({ planets, resources }) => {
    updateAllPlanets(planets)
    updateWarehouse(resources)
  })

  currentSocket.on('planetUpdate', (data) => {
    updatePlanet(data)
  })

  currentSocket.on('warehouseUpdate', (data) => {
    updateWarehouse(data)
  })
}

export const disableAllSocketListeners = (currentSocket: Socket | null) => {
  currentSocket?.off('connect')
  currentSocket?.off('updateAll')
  currentSocket?.off('planetUpdate')
  currentSocket?.off('warehouseUpdate')
}

export const setupNewSocketRef = (socketRef: any) => {
  if (!socketRef?.current) {
    socketRef.current = io(`${address}`, {
      transports: ['websocket', 'polling'],
    })
  }
}
