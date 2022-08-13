import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'
import NavBar from './components/NavBar/NavBar'
import LeaderBoard from './pages/Leaderboard/LeaderBoard'
import { SolarSystemView } from './pages/SolarSystemView/SolarSystemView'

import { useEffect, useRef } from 'react'

import { Socket } from 'socket.io-client'

import { useUser } from 'src/lib/firebase'
import usePlanets from 'src/lib/gameData/usePlanets'
import useWarehouse from 'src/lib/gameData/useWarehouse'

import { StartAllSocketListeners, disableAllSocketListeners, setupNewSocketRef } from './lib/Networking/SocketListeners'

function App() {
  const user: any = useUser()
  const { planets, updatePlanet, updateAllPlanets, clearPlanets }: any = usePlanets()
  const { warehouse, updateWarehouse }: any = useWarehouse()

  const socketRef = useRef<Socket | null>()

  useEffect(() => {
    !user && clearPlanets()
    user && socketRef?.current?.emit('userStateChanged', user)
  }, [user, user?.uid, clearPlanets])

  useEffect(() => {
    setupNewSocketRef(socketRef)

    if (socketRef?.current) {
      StartAllSocketListeners(socketRef?.current, updateAllPlanets, updateWarehouse, updatePlanet)
    }

    return () => {
      if (socketRef?.current) {
        disableAllSocketListeners(socketRef?.current)
      }
    }
  }, [updateAllPlanets, updatePlanet, updateWarehouse])

  return (
    <Router>
      <div className='App'>
        <NavBar />
        <Routes>
          <Route
            path='/'
            element={<SolarSystemView socketRef={socketRef} user={user} planets={planets} warehouse={warehouse} />}
          />
          <Route path='/leaderboard' element={<LeaderBoard socketRef={socketRef} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
