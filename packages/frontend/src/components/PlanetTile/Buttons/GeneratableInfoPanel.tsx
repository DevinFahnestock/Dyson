import React, { useEffect, useState } from 'react'
import './styles.css'

import { getResourcesGenerated } from '@dyson/shared/dist/GenerationCalculator'
import { Planet } from '@dyson/shared/dist/Planet'

interface props {
  planet: Planet
}

const GeneratableInfoPanel = ({ planet }: props) => {
  const [gen, setGen] = useState<{
    money: number
    organic: number
    metal: number
    food: number
  }>(getResourcesGenerated(planet))

  useEffect(() => {
    let timer: null | NodeJS.Timer = null

    timer = setInterval(() => {
      setGen(getResourcesGenerated(planet))
    }, 2000)

    return () => {
      timer && clearInterval(timer)
    }
  }, [planet])

  return (
    <div className='GeneratableInfoPanel'>
      Money: {gen.money}
      <br />
      Metal: {gen.metal}
      <br />
      Organic: {gen.organic}
      <br />
      Food: {gen.food}
    </div>
  )
}

export default GeneratableInfoPanel
