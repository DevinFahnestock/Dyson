import React from 'react'
import ModifiablePlanetView from '../../components/ModifiablePlanetView/ModifiablePlanetView'
import ResourceDisplay from '../../components/ResourceDisplay/ResourceDisplay'

import './styles.css'
import { User } from '@firebase/auth'
import { Warehouse } from '@dyson/shared/dist/Warehouse'
import { Planet } from '@dyson/shared/dist/Planet'
import { SocketEmitter } from 'src/lib/Networking/SocketEmitter'
import { useNavigate } from 'react-router-dom'

type props = {
  user: User
  warehouse: Warehouse
  planets: Planet[]
  socketEmitter: SocketEmitter
}

export const SolarSystem = ({ user, warehouse, planets, socketEmitter }: props) => {
  const navigate = useNavigate()
  if (!user) {
    navigate('/Signin')
  }

  return (
    <div>
      {user && (
        <div className='UIdisplay'>
          <ResourceDisplay warehouse={warehouse} />
          <ModifiablePlanetView planets={planets} socketEmitter={socketEmitter} user={user} />
        </div>
      )}
    </div>
  )
}
