import "./App.css"
import PlanetTile from "./components/PlanetTile/PlanetTile"

import { useState, useEffect } from "react"

import io from "socket.io-client"

import { useSignInWithGoogle, useUser, useSignOut } from "./lib/firebase"

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

  const user = useUser()
  const signOut = useSignOut()

  const { signInWithPopup, loading, error } = useSignInWithGoogle()

  return (
    <div className="App">
      <nav>
        <a href="http://localhost:3000/">Home</a>
        {!user && (<a onClick={() => signInWithPopup()}>Sign in</a>)}
        {user && <div className="profile">
        {user.displayName}
        <img src={user.photoURL} alt="Profile" />  
        <a onClick={() => signOut()}>Sign out</a>
        </div>}
      </nav>
      <header>
        <h1>Dyson</h1>
      </header>
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
