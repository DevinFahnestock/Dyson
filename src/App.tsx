import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import "./App.css";
import PlanetTile from "./components/PlanetTile/PlanetTile";
import CelestialBodyRenderer from "./components/PlanetTile/CelestialBodyRenderer";

import { useSignInWithGoogle, useUser, useSignOut } from "./lib/firebase";
// import WetPlanet from "./lib/pixelPlanets/bodies/planets/prototypes/WetPlanet";
// import AtmospherelessPlanet from "./lib/pixelPlanets/bodies/planets/prototypes/AtmospherelessPlanet";
import LavaPlanet from "./lib/pixelPlanets/bodies/planets/prototypes/LavaPlanet";

const socket = io("http://localhost:3001", {
  transports: ["websocket", "polling"],
});

function App() {
  const [planets, setPlanets] = useState([]);

  const updatePlanet = (planetData: any) => {
    setPlanets((planets) => {
      let copy: any = [...planets];
      copy[planetData.id] = planetData;
      return copy;
    });
  };

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("newConnection");
    });

    socket.on("planets", (planetData) => {
      setPlanets(planetData);
    });

    socket.on("planetUpdate", updatePlanet);

    return () => {
      socket.off("planets");
      socket.off("planetUpdate");
    };
  }, []);

  const user: any = useUser();
  const signOut = useSignOut();

  const { signInWithPopup } = useSignInWithGoogle();

  const planet = new LavaPlanet(123345);

  return (
    <div className="App">
      <nav>
        <a href="http://localhost:3000/">Home</a>
        {!user && <a onClick={() => signInWithPopup()}>Sign in</a>}
        {user && (
          <div className="profile">
            {user.displayName}
            <img src={user.photoURL} alt="Profile" />
            <a onClick={() => signOut()}>Sign out</a>
          </div>
        )}
      </nav>
      <header>
        <h1>Dyson</h1>
      </header>
      <CelestialBodyRenderer celestialBody={planet} />
      <div className="Planetview">
        <h3>Planets:</h3>
        <div className="Planetgrid">
          {planets.map((planet: any) => (
            <PlanetTile
              key={planet.id}
              planet={planet}
              upgradeClick={() => {
                socket.emit("upgradePlanet", planet);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
