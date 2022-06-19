import React, { useEffect, useRef } from "react"
import SimplePlanetView from "src/components/PlanetView/SimplePlanetView"

const LeaderBoard = ({ socketRef }: any) => {
  let planets = useRef()

  socketRef?.current?.emit("topTenPlanets")
  

  useEffect(() => {
    socketRef?.current?.on("topTenUpdate", (data: any) => {
      planets.current = data
    })
    return () => {
        socketRef?.current?.off("")
    }
  })

  socketRef?.current?.emit("topTenPlanets")

  return (
    <div>
      Rankings
      <div className='UIdisplay'>
        {planets && (<SimplePlanetView planets={planets.current} />)}
      </div>
    </div>
  )
}

export default LeaderBoard

//topTenPlanets
