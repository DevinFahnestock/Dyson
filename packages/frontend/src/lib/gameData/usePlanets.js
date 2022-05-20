import React, { useContext, useEffect, useState } from 'react'
import { useUser } from '../firebase'

export const PlanetsContext = React.createContext([])

export const PlanetsProvider = ({ children }) => {
  
  const user = useUser()
  const [planets, setPlanets] = useState([])

  const clearPlanets = () => {
    setPlanets([])
  }

  const updatePlanet = (planetData) => {
    if (!planetData) {
      return
    }
    setPlanets((planets) => {
      let copy = [...planets]
      copy[copy.findIndex((planet) => planet.id === planetData.id)] = planetData
      return copy
    })
  }

  const updateAllPlanets = (data) => {
    setPlanets(data)
  }
  

  const planetApi = {
    planets,
    clearPlanets,
    updatePlanet,
    updateAllPlanets
  }

  return ( 
    <PlanetsContext.Provider value={planetApi}>
      {children}
    </PlanetsContext.Provider>
  )
}


export const usePlanets = () => {
  return useContext(PlanetsContext)
}




export default usePlanets