import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'
import NavBar from './components/NavBar/NavBar'
import LeaderBoard from './pages/Leaderboard/LeaderBoard'
import { SolarSystem } from './pages/SolarSystem/SolarSystem'

import { useEffect, useRef } from 'react'

import { useUser } from 'src/lib/firebase'
import usePlanets from 'src/lib/hooks/usePlanets'
import useWarehouse from 'src/lib/hooks/useWarehouse'

import { StartAllSocketListeners, newSocketReference } from './lib/Networking/SocketListeners'
import { SocketEmitter } from './lib/Networking/SocketEmitter'
import Player from './pages/Player/Player'
import SignUp from './pages/SignUp/SignUp'
import SignIn from './pages/SignIn/SignIn'
import { User } from 'firebase/auth'

function App() {
  const user: User | null = useUser()
  const { planets, updatePlanet, updateAllPlanets }: any = usePlanets()
  const { warehouse, updateWarehouse }: any = useWarehouse()

  const socketEmitter = useRef<SocketEmitter | null>()

  // dont think this needed any dependancies..
  useEffect(() => {
    if (!socketEmitter.current?.socket) {
      socketEmitter.current = new SocketEmitter(newSocketReference())
      StartAllSocketListeners(socketEmitter.current.socket, updateAllPlanets, updateWarehouse, updatePlanet)
    }
  })

  // TODO: move the user, planets, and warehouses from here into the solarsystem component.
  //       it should be handling its own dependancies to reduce uneccesary calls to the database and the server
  return (
    <Router>
      <NavBar />
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              socketEmitter.current &&
              user && (
                <SolarSystem
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
          <Route path='/signup' element={socketEmitter.current && <SignUp socketEmitter={socketEmitter.current} />} />
          <Route path='/signin' element={socketEmitter.current && <SignIn />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
