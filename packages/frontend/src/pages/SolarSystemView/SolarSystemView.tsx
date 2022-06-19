import React from "react"

import { upgradeClick, onUpgradeTimeComplete } from "./helpers/ButtonActions"

import SignInScreen from "../../components/SignInScreen/SignInScreen"
import PlanetView from "../../components/PlanetView/PlanetView"
import ResourceDisplay from "../../components/ResourceDisplay/ResourceDisplay"

import './styles.css'

export const SolarSystemView = ({user, warehouse, planets, socketRef}: any) => {
  
  return (
    <div>
      {user ? (
        <div className='UIdisplay'>
          <ResourceDisplay warehouse={warehouse} />
          <PlanetView planets={planets} upgradeClick={upgradeClick} onUpgradeTimeComplete={onUpgradeTimeComplete} socket={socketRef.current} user={user}/>
        </div>
      ) : (
        <SignInScreen />
      )}
    </div>
  )
}




