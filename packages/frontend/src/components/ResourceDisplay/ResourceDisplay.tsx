import React from 'react'
import useFetchUserData from 'src/lib/hooks/useFetchUserData'
import ResourceTile from './ResourceTile'
import './styles.css'
const ResourceDisplay = () => {
  const { warehouse } = useFetchUserData()

  return (
    <div className='ResourceDisplay'>
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
