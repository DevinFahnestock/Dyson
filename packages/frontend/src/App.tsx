import React, { useState, useEffect, useRef } from "react"
import io, { Socket }  from "socket.io-client"

import { useUser } from "./lib/firebase"

import "./App.css"
import NavBar from "./components/NavBar/NavBar"
import PlanetView from "./components/PlanetView/PlanetView"
import SignInScreen from "./components/SignInScreen/SignInScreen"

const address = process.env.SERVER_ADDRESS || "localhost:25145"

function App() {
  const [planets, setPlanets] = useState<any[]>([])

  const user: any = useUser()

  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${address}`, { transports: ["websocket", "polling"] })
    }
  })


  useEffect(() => {
    setPlanets([])
  }, [user])

  const updatePlanet = (planetData: any) => {
    setPlanets((planets) => {
      let copy: any[] = [...planets]
      copy[copy.findIndex(planet => planet.id === planetData.id)] = planetData
      
      return copy
    })
  }

  useEffect(() => {
    socketRef?.current?.on("connect", () => {
      console.log("Successfully connected to server")
    })

    socketRef?.current?.on("updateAllGameData", gameData => {
      setPlanets(gameData)
    })

    socketRef?.current?.on("planetUpdate", (data) => {
      updatePlanet(data)
    })

    return () => {
      socketRef?.current?.off("planets")
      socketRef?.current?.off("planetUpdate")
    }
  }, [planets])

  useEffect(() => {

    !user && setPlanets([])

    user && socketRef?.current?.emit("userStateChanged", user.uid)
    
    socketRef?.current?.on("NoUserExists", () => { 
      user && socketRef?.current?.emit("CreateNewUserData", user)}) 
  }, [user, user?.uid])

  return (
    <div className="App">
      <NavBar />
      {user && (<PlanetView socket={socketRef.current} user={user} planets={planets} />)}
      {!user && <SignInScreen />}
    </div>
  )
}

export default App
