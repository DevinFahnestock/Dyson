import React, { useEffect, useRef } from "react"
import io, { Socket } from "socket.io-client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { useUser } from "./lib/firebase"

import "./App.css"
import NavBar from "./components/NavBar/NavBar"
import PlanetView from "./components/PlanetView/PlanetView"
import SignInScreen from "./components/SignInScreen/SignInScreen"
import usePlanets from "./lib/gameData/usePlanets"
import ResourceDisplay from "./components/ResourceDisplay/ResourceDisplay"
import useWarehouse from "./lib/gameData/useWarehouse"
import LeaderBoard from "./components/Leaderboard/LeaderBoard"

const address = process.env.SERVER_ADDRESS || "localhost:25145"

function App() {
  const user: any = useUser()
  const { planets, updatePlanet, updateAllPlanets, clearPlanets }: any =
    usePlanets()
  //const { warehouse, clearWarehouse, updateResource, updateWarehouse }: any =
  const { warehouse, updateWarehouse }: any = useWarehouse()

  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    !user && clearPlanets()
    user && socketRef?.current?.emit("userStateChanged", user)
  }, [user, user?.uid, clearPlanets])

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${address}`, {
        transports: ["websocket", "polling"],
      })
    }

    socketRef.current.on("connect", () => {
      console.log("Successfully connected to server")
    })

    socketRef.current.on("updateAll", ({ planets, resources }) => {
      updateAllPlanets(planets)
      updateWarehouse(resources)
    })

    socketRef.current.on("planetUpdate", (data) => {
      updatePlanet(data)
    })

    socketRef.current.on("warehouseUpdate", (data) => {
      updateWarehouse(data)
    })

    return () => {
      socketRef?.current?.off("connect")
      socketRef?.current?.off("updateAll")
      socketRef?.current?.off("planetUpdate")
      socketRef?.current?.off("warehouseUpdate")
    }
  }, [updateAllPlanets, updatePlanet, updateWarehouse])

  const upgradeClick = (planetID: string) => {
    socketRef?.current?.emit("upgradePlanet", {
      planetID: planetID,
      userID: user.uid,
    })
  }

  const onUpgradeTimeComplete = (planetID: string) => {
    socketRef?.current?.emit("checkCompleteUpgrade", {
      planetID: planetID,
      userID: user.uid,
    })
  }

  return (
    <Router>
      <div className='App'>
        <NavBar />
        <Routes>
          <Route
            path='/'
            element={
              user ? (
                <div className='UIdisplay'>
                  <ResourceDisplay warehouse={warehouse} />
                  <PlanetView
                    planets={planets}
                    upgradeClick={upgradeClick}
                    onUpgradeTimeComplete={onUpgradeTimeComplete}
                  />
                </div>
              ) : (
                <SignInScreen />
              )
            }
          />
          <Route path='/leaderboard' element={<LeaderBoard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
