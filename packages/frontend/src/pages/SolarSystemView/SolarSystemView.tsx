import React, { useEffect, useRef } from "react"

import { Socket } from "socket.io-client"

import { useUser } from "../../lib/firebase"
import usePlanets from "../../lib/gameData/usePlanets"
import useWarehouse from "../../lib/gameData/useWarehouse"

import { StartAllSocketListeners, disableAllSocketListeners, setupNewSocketRef } from './helpers/SocketListeners'
import { upgradeClick, onUpgradeTimeComplete } from "./helpers/ButtonActions"

import SignInScreen from "../../components/SignInScreen/SignInScreen"
import PlanetView from "../../components/PlanetView/PlanetView"
import ResourceDisplay from "../../components/ResourceDisplay/ResourceDisplay"

import './styles.css'

export const SolarSystemView = () => {
  const user: any = useUser()
  const { planets, updatePlanet, updateAllPlanets, clearPlanets }: any = usePlanets()
  const { warehouse, updateWarehouse }: any = useWarehouse()

  const socketRef = useRef<Socket | null>()

  useEffect(() => {
    !user && clearPlanets()
    user && socketRef?.current?.emit("userStateChanged", user)
  }, [user, user?.uid, clearPlanets])

  useEffect(() => {
    setupNewSocketRef(socketRef)

    if (socketRef?.current ) { StartAllSocketListeners(socketRef?.current , updateAllPlanets, updateWarehouse, updatePlanet) }

    return () => {
      if (socketRef?.current) { disableAllSocketListeners(socketRef?.current) }
    }
  }, [updateAllPlanets, updatePlanet, updateWarehouse])

  return (
    <div>
      {user ? (
        <div className='UIdisplay'>
          <ResourceDisplay warehouse={warehouse} />
          <PlanetView planets={planets} upgradeClick={upgradeClick} onUpgradeTimeComplete={onUpgradeTimeComplete} />
        </div>
      ) : (
        <SignInScreen />
      )}
    </div>
  )
}




