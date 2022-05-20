import React, { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

import { useUser } from "./lib/firebase";

import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import PlanetView from "./components/PlanetView/PlanetView";
import SignInScreen from "./components/SignInScreen/SignInScreen";
import usePlanets from "./lib/gameData/usePlanets";

const address = process.env.SERVER_ADDRESS || "localhost:25145";

function App() {
  const user: any = useUser();
  const { planets, updatePlanet, updateAllPlanets, clearPlanets }: any =
    usePlanets();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    !user && clearPlanets();
    user && socketRef?.current?.emit("userStateChanged", user);
  }, [user, user?.uid, clearPlanets]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${address}`, {
        transports: ["websocket", "polling"],
      });
    }

    socketRef.current.on("connect", () => {
      console.log("Successfully connected to server");
    });

    socketRef.current.on("updateAllPlanets", (data) => {
      updateAllPlanets(data);
    });

    socketRef.current.on("planetUpdate", (data) => {
      updatePlanet(data);
    });

    return () => {
      socketRef?.current?.off("connect");
      socketRef?.current?.off("updateAllPlanets");
      socketRef?.current?.off("planetUpdate");
    };
  }, [updateAllPlanets, updatePlanet]);

  const upgradeClick = (planetID: string) => {
    socketRef?.current?.emit("upgradePlanet", {
      planetID: planetID,
      userID: user.uid,
    });
  };

  const onUpgradeTimeComplete = (planetID: string) => {
    console.log('checking')
    socketRef?.current?.emit("checkCompleteUpgrade", {
      planetID: planetID,
      userID: user.uid,
    });
  };

  return (
    <div className="App">
      <NavBar />
      {user ? (
        <PlanetView
          planets={planets}
          upgradeClick={upgradeClick}
          onUpgradeTimeComplete={onUpgradeTimeComplete}
        />
      ) : (
        <SignInScreen />
      )}
    </div>
  );
}

export default App;
