import React from 'react'
import ResourceTile from './ResourceTile'
import './styles.css'
const ResourceDisplay = ({ warehouse }: any) => {
  return (
    <div>
      <h3>Resources</h3>
      <div className='ResourceGrid'>
        {warehouse && <ResourceTile type='money' amount={warehouse.money} />}
        {warehouse && <ResourceTile type='metal' amount={warehouse.metal} />}
        {warehouse && <ResourceTile type='organic' amount={warehouse.organic} />}
        {warehouse && <ResourceTile type='food' amount={warehouse.food} />}
      </div>
    </div>
  )
}

export default ResourceDisplay
