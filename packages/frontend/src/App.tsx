import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import "./App.css"
import NavBar from "./components/NavBar/NavBar"
import LeaderBoard from "./components/Leaderboard/LeaderBoard"
import { SolarSystemView } from "./components/SolarSystemView/SolarSystemView"

function App() {
  return (
    <Router>
      <div className='App'>
        <NavBar />
        <Routes>
          <Route path='/' element={<SolarSystemView />} />
          <Route path='/leaderboard' element={<LeaderBoard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
