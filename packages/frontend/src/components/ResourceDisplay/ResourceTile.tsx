import React from 'react'

const ResourceTile = ({ type, amount }: any ) => {
  return (
    <div>
        {type}: {amount}
    </div>
  )
}

export default ResourceTile