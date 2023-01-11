import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'
import NavBar from './components/NavBar/NavBar'
import LeaderBoard from './pages/Leaderboard/LeaderBoard'
import { SolarSystem } from './pages/SolarSystem/SolarSystem'

import { useUser } from 'src/lib/firebase'

import Player from './pages/Player/Player'
import SignUp from './pages/SignUp/SignUp'
import SignIn from './pages/SignIn/SignIn'
import { User } from 'firebase/auth'

function App() {
  const user: User | null = useUser()

  // TODO: move the user, planets, and warehouses from here into the solarsystem component.
  //       it should be handling its own dependancies to reduce uneccesary calls to the database and the server
  return (
    <Router>
      <NavBar />
      <div className='App'>
        <Routes>
          <Route path='/' element={user && <SolarSystem />} />
          <Route path='/leaderboard' element={<LeaderBoard />} />
          <Route path='/player/:id' element={<Player />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
