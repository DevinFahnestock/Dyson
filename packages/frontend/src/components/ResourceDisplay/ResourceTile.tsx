import React from 'react'
import './styles.css'

import components from './resources'

const ResourceTile = ({ type, amount }: any) => {
  const Component = components[type]

  return (
    <div className='ResourceTile'>
      <Component />
      {type}: {amount}
    </div>
  )
}

export default ResourceTile
