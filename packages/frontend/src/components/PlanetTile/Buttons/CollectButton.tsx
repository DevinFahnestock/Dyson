import React, { useEffect, useState } from 'react'
import './styles.css'

import { getResourcesGenerated } from '@dyson/shared/dist/GenerationCalculator'
import { Planet } from '@dyson/shared/dist/Planet'

const CollectButton = ({ onClick, planet }: any) => {
  function getGeneratedResourceTotal(planet: Planet) {
    const newGen = getResourcesGenerated(planet)
    let total: number = 0
    for (const amount of Object.values(newGen)) {
      total += amount as number
    }
    return total
  }

  const [total, setTotal] = useState<number>(getGeneratedResourceTotal(planet))

  useEffect(() => {
    let timer: null | NodeJS.Timer = null

    timer = setInterval(() => {
      setTotal(getGeneratedResourceTotal(planet))
    }, 2000)

    return () => {
      timer && clearInterval(timer)
    }
  }, [planet])

  return (
    <button type='button' className='CollectButton' onClick={onClick}>
      Collect +{total}
    </button>
  )
}

export default CollectButton
