import React, { useState, useEffect } from "react"
import io from "socket.io-client"

import { useUser } from "./lib/firebase"

import "./App.css"
import NavBar from "./components/NavBar/NavBar"
import PlanetView from "./components/PlanetView/PlanetView"
import SignInScreen from "./components/SignInScreen/SignInScreen"

const address = process.env.SERVER_ADDRESS || "localhost:25145"

const socket = io(`${address}`, { transports: ["websocket", "polling"] })

function App() {
  const [planets, setPlanets] = useState<any[]>([])

  const user: any = useUser()



  const updatePlanet = (planetData: any) => {
    // if other info changed
    setPlanets((planets) => {
      let copy: any[] = [...planets]
      copy[copy.findIndex(planet => planet.id === planetData.id)] = planetData
      
      return copy
    })

    // if just level changed

    setPlanets((planets) => {
      let copy: any[] = planets
      copy[copy.findIndex(planet => planet.id === planetData.id)] = planetData
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

    socket.on("planetUpdate", (data) => {
      updatePlanet(data)
    })

    return () => {
      socket.off("planets")
      socket.off("planetUpdate")
    }
  }, [planets])

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
