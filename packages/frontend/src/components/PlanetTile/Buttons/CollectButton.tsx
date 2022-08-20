import React from 'react'
import './styles.css'

import ReactTooltip from 'react-tooltip'
import Generatable from './GeneratableInfoPanel'

const CollectButton = ({ onClick, planet }: any) => {
  const tooltipID = `tooltip-collectable-${planet.id}`
  ReactTooltip.rebuild()
  return (
    <div>
      <ReactTooltip id={tooltipID}>
        <Generatable planet={planet} />
      </ReactTooltip>
      <button
        data-tip
        data-for={tooltipID}
        data-background-color='clear'
        type='button'
        className='CollectButton'
        onClick={onClick}
      >
        Collect
      </button>
    </div>
  )
}

export default CollectButton
