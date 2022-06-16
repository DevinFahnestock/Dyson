import React, { useContext, useState, useCallback } from "react"
import { Planet } from "../Planet"

export const PlanetsContext = React.createContext<any>([])

interface PlanetApi {
  planets: Planet[],
  clearPlanets: () => void,
  updatePlanet: (planetData: Planet) => void,
  updateAllPlanets: (data: Planet[]) => void,
}


export const PlanetsProvider = ({ children }: any) => {
  const [planets, setPlanets] = useState<Planet[]>([])

  const clearPlanets = useCallback(() => {
    setPlanets([])
  }, [setPlanets])

  const updatePlanet = useCallback(
    (planetData: Planet) => {
      if (!planetData) {
        return
      }

      setPlanets((planets) => {
        const planetIndex = planets.findIndex(
          (planet: Planet) => planet.id === planetData.id
        )

        let copy = [...planets]
        copy[planetIndex] = planetData

        return copy
      })
    },
    [setPlanets]
  )

  const updateAllPlanets = useCallback(
    (data: Planet[]) => {
      setPlanets(data)
    },
    [setPlanets]
  )

  const planetApi: PlanetApi = {
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
