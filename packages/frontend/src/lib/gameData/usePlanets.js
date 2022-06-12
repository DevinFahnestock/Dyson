import React, { useContext, useState, useCallback } from "react"

export const PlanetsContext = React.createContext([])

export const PlanetsProvider = ({ children }) => {
  const [planets, setPlanets] = useState([])

  const clearPlanets = useCallback(() => {
    setPlanets([])
  }, [setPlanets])

  const updatePlanet = useCallback(
    (planetData) => {
      if (!planetData) {
        return
      }

      setPlanets((planets) => {
        const planetIndex = planets.findIndex(
          (planet) => planet.id === planetData.id
        )

        let copy = [...planets]
        copy[planetIndex] = planetData

        return copy
      })
    },
    [setPlanets]
  )

  const updateAllPlanets = useCallback(
    (data) => {
      setPlanets(data)
    },
    [setPlanets]
  )

  const planetApi = {
    planets,
    clearPlanets,
    updatePlanet,
    updateAllPlanets,
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
