import io, { Socket } from 'socket.io-client'

const address = '192.168.50.250:25145' || 'localhost:25145'

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

export const setupNewSocketRef = () => {
  return io(`${address}`, {
    transports: ['websocket', 'polling'],
  })
}
