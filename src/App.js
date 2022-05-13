import "./App.css"
import PlanetTile from "./components/PlanetTile/PlanetTile"

import { useState, useEffect } from "react"

import io from "socket.io-client"

import { useUser } from "./lib/firebase"

import NavBar from "./components/NavBar/NavBar"
import PlanetView from "./components/PlanetView/PlanetView"
import SignInScreen from "./components/SignInScreen/SignInScreen"

const socket = io("http://localhost:3001", { transports: ["websocket", "polling"] })

function App() {
  const [planets, setPlanets] = useState([])

  const user = useUser()

  const updatePlanet = (planetData) => {
    setPlanets((planets) => {
      let copy = [...planets]
      copy[planetData.id] = planetData
      return copy
    })
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Successfully connected to server")
    })

    socket.on("updateAllGameData", gameData => {
      setPlanets(gameData)
    })

    socket.on("planetUpdate", updatePlanet)

    

    return () => {
      socket.off("planets")
      socket.off("planetUpdate")
    }
  }, [])

  useEffect(() => {

    !user && setPlanets([])

    user && socket.emit("userStateChanged", user.uid)
    
    socket.on("NoUserExists", () => { 
      user && socket.emit("CreateNewUserData", user)}) 
  }, [user, user?.uid])

  return (
    <div className="App">
      <NavBar />
      {user && (<PlanetView socket={socket} user={user} planets={planets} />)}
      {!user && <SignInScreen />}
    </div>
  )
}

export default App
