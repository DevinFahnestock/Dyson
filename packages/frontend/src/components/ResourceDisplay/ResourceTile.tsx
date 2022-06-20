import React from 'react'
import './styles.css'

const ResourceTile = ({ type, amount }: any) => {
  return (
    <div className='ResourceTile'>
      {type}: {amount}
    </div>
  )
}

export default ResourceTile
