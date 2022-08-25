import React from 'react'

import SignInScreen from '../../components/SignInScreen/SignInScreen'
import PlanetView from '../../components/PlanetView/PlanetView'
import ResourceDisplay from '../../components/ResourceDisplay/ResourceDisplay'

import './styles.css'
import { User } from '@firebase/auth'
import { Warehouse } from '@dyson/shared/dist/Warehouse'
import { Planet } from '@dyson/shared/dist/Planet'
import { SocketEmitter } from 'src/lib/Networking/SocketEmitter'

type props = {
  user: User
  warehouse: Warehouse
  planets: Planet[]
  socketEmitter: SocketEmitter
}

export const SolarSystemView = ({ user, warehouse, planets, socketEmitter }: props) => {
  return (
    <div>
      {user ? (
        <div className='UIdisplay'>
          <ResourceDisplay warehouse={warehouse} />
          <PlanetView planets={planets} socketEmitter={socketEmitter} user={user} />
        </div>
      ) : (
        <SignInScreen />
      )}
    </div>
  )
}
