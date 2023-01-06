import React from 'react'
import ModifiablePlanetView from '../../components/ModifiablePlanetView/ModifiablePlanetView'
import ResourceDisplay from '../../components/ResourceDisplay/ResourceDisplay'

import './styles.css'
import { useNavigate } from 'react-router-dom'
import { useUser } from 'src/lib/firebase'

export const SolarSystem = () => {
  const navigate = useNavigate()
  const user = useUser()

  if (!user) {
    navigate('/Signin')
  }

  return (
    <div>
      {user && (
        <div className='UIdisplay'>
          <ResourceDisplay />
          <ModifiablePlanetView />
        </div>
      )}
    </div>
  )
}
