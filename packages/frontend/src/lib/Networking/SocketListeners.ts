import { Socketcom } from '@dyson/shared/dist/Socketcom'
import io, { Socket } from 'socket.io-client'

const address = '192.168.50.250:25145' || 'localhost:25145'

export function StartAllSocketListeners(
  currentSocket: Socket,
  updateAllPlanets: any,
  updateWarehouse: any,
  updatePlanet: any
) {
  currentSocket.on('connect', () => {
    console.log('Successfully connected to server')
  })

  currentSocket.on(Socketcom.updatePlanetsAndWarehouse, ({ planets, resources }) => {
    updateAllPlanets(planets)
    updateWarehouse(resources)
  })

  currentSocket.on(Socketcom.planetUpdate, (data) => {
    updatePlanet(data)
  })

  currentSocket.on(Socketcom.warehouseUpdate, (data) => {
    updateWarehouse(data)
  })
}

export const disableAllSocketListeners = (currentSocket: Socket | null) => {
  currentSocket?.off('connect')
  currentSocket?.off(Socketcom.updatePlanetsAndWarehouse)
  currentSocket?.off(Socketcom.planetUpdate)
  currentSocket?.off(Socketcom.warehouseUpdate)
}

export const newSocketReference = () => {
  return io(`${address}`, {
    transports: ['websocket', 'polling'],
  })
}
