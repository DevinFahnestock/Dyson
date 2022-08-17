import React from 'react'
import './styles.css'

const CollectButton = ({ onClick }: any) => {
  return (
    <button type='button' className='CollectButton' onClick={onClick}>
      Collect
    </button>
  )
}

export default CollectButton
