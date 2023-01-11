import { Socketcom } from '@dyson/shared/dist/Socketcom'
import io, { Socket } from 'socket.io-client'
import usePlanets from '../hooks/usePlanets'
import useSocket from '../hooks/useSocket'
import useWarehouse from '../hooks/useWarehouse'

// TODO: use the direct hook references for this?
export function StartAllSocketListeners(socket: Socket) {
  const { updateAllPlanets, updatePlanet } = usePlanets()
  const { updateWarehouse } = useWarehouse()

  socket.on('connect', () => {
    console.log('Successfully connected to server')
  })

  socket.on(Socketcom.updatePlanetsAndWarehouse, ({ planets, resources }: any) => {
    updateAllPlanets(planets)
    updateWarehouse(resources)
  })

  socket.on(Socketcom.planetUpdate, (data: any) => {
    updatePlanet(data)
  })

  socket.on(Socketcom.warehouseUpdate, (data: any) => {
    updateWarehouse(data)
  })
}

export function startUpdatePlanetsAndWarehouseListener(socket: Socket, updateAllPlanets: any, updateWarehouse: any) {
  socket.on(Socketcom.updatePlanetsAndWarehouse, ({ planets, resources }: any) => {
    updateAllPlanets(planets)
    updateWarehouse(resources)
  })
}

export function DisableAllSocketListeners() {
  const { socket } = useSocket()

  socket.off('connect')
  socket.off(Socketcom.updatePlanetsAndWarehouse)
  socket.off(Socketcom.planetUpdate)
  socket.off(Socketcom.warehouseUpdate)
}

const address = '192.168.50.250:25145' || 'localhost:25145'
export function newSocketReference(): Socket {
  return io(`${address}`, {
    transports: ['websocket', 'polling'],
  })
}
