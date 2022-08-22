import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'
import NavBar from './components/NavBar/NavBar'
import LeaderBoard from './pages/Leaderboard/LeaderBoard'
import { SolarSystemView } from './pages/SolarSystemView/SolarSystemView'

import { useEffect, useRef } from 'react'

import { useUser } from 'src/lib/firebase'
import usePlanets from 'src/lib/gameData/usePlanets'
import useWarehouse from 'src/lib/gameData/useWarehouse'

import { StartAllSocketListeners, disableAllSocketListeners, setupNewSocketRef } from './lib/Networking/SocketListeners'
import { SocketEmitter } from './lib/Networking/SocketEmitter'
import Player from './pages/Player/Player'

function App() {
  const user: any = useUser()
  const { planets, updatePlanet, updateAllPlanets, clearPlanets }: any = usePlanets()
  const { warehouse, updateWarehouse }: any = useWarehouse()

  const socketEmitter = useRef<SocketEmitter | null>()

  useEffect(() => {
    !user && clearPlanets()
    user && socketEmitter.current?.UserStateChange(user)
  }, [user, user?.uid, clearPlanets])

  useEffect(() => {
    if (!socketEmitter.current?.socket) {
      socketEmitter.current = new SocketEmitter(setupNewSocketRef())
    } else {
      socketEmitter.current.socket = setupNewSocketRef()
    }

    if (socketEmitter.current.socket) {
      console.log('starting sockets', socketEmitter.current.socket)
      StartAllSocketListeners(socketEmitter.current.socket, updateAllPlanets, updateWarehouse, updatePlanet)
    }

    return () => {
      if (socketEmitter?.current?.socket) {
        console.log('closing socket', socketEmitter?.current?.socket)
        disableAllSocketListeners(socketEmitter.current.socket)
      }
    }
  }, [updateAllPlanets, updatePlanet, updateWarehouse])

  return (
    <Router>
      <NavBar />
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              socketEmitter.current && (
                <SolarSystemView
                  socketEmitter={socketEmitter?.current}
                  user={user}
                  planets={planets}
                  warehouse={warehouse}
                />
              )
            }
          />
          <Route
            path='/leaderboard'
            element={socketEmitter.current && <LeaderBoard socketEmitter={socketEmitter.current} />}
          />
          <Route
            path='/player/:id'
            element={socketEmitter.current && <Player socketEmitter={socketEmitter.current} />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
