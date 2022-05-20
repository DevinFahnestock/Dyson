import React, { useEffect, useRef } from "react"
import io, { Socket } from "socket.io-client"

import { useUser } from "./lib/firebase"

import "./App.css"
import NavBar from "./components/NavBar/NavBar"
import PlanetView from "./components/PlanetView/PlanetView"
import SignInScreen from "./components/SignInScreen/SignInScreen"
import usePlanets from "./lib/gameData/usePlanets"

const address = process.env.SERVER_ADDRESS || "localhost:25145"

function App() {
  
  const user: any = useUser()

  const planets: any = usePlanets()

  const socketRef = useRef<Socket | null>(null)


  useEffect(() => {
    !user && planets.clearPlanets()
    user && socketRef?.current?.emit("userStateChanged", user)
  }, [user, user?.uid])


  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${address}`, { transports: ["websocket", "polling"] })

      socketRef.current.on("connect", () => {
        console.log("Successfully connected to server")
      })

      socketRef.current.on("updateAllPlanets", (gameData) => {
        planets.updateAllPlanets(gameData)
      })

      socketRef.current.on("planetUpdate", (data) => {
        console.log('doing things')
        planets.updatePlanet(data)
      })
       
    }
    return () => {
      socketRef?.current?.off("updateAllPlanets")
      socketRef?.current?.off("planetUpdate")
    }
  }, [])

 const upgradeClick = (planetID: string) => {
    socketRef?.current?.emit("upgradePlanet", {planetID: planetID, userID: user.id})
 }

const onUpgradeTimeComplete = (planetID: string) => {
  socketRef?.current?.emit("checkCompleteUpgrade", {planetID: planetID, userID: user.id})
}

  return (
    <div className="App">
      <NavBar />
      {user && <PlanetView planets={planets.planets} upgradeClick={upgradeClick} onUpgradeTimeComplete={onUpgradeTimeComplete} /> }
      {!user && <SignInScreen />}
    </div>
  )
}

export default App
