import "./App.css"
import PlanetTile from "./components/PlanetTile/PlanetTile"

import { useState, useEffect } from "react"

import io from "socket.io-client"


import NavBar from "./components/NavBar/NavBar"

const socket = io("http://localhost:3001", { transports: ["websocket", "polling"] })

function App() {
  const [planets, setPlanets] = useState([])

  const updatePlanet = (planetData) => {
    setPlanets((planets) => {
      let copy = [...planets]
      copy[planetData.id] = planetData
      return copy
    })
  }

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("newConnection", this)
    })

    socket.on("planets", (planetData) => {
      setPlanets(planetData)
    })

    socket.on("planetUpdate", updatePlanet)

    return () => {
      socket.off("planets")
      socket.off("planetUpdate")
    }
  }, [])

  return (
    <div className="App">
      <NavBar />
      <div className="Planetview">
        <h3>Planets:</h3>
        <div className="Planetgrid">
          {planets.map((planet) => (
            <PlanetTile
              key={planet.id}
              planet={planet}
              upgradeClick={() => {
                socket.emit("upgradePlanet", planet)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
