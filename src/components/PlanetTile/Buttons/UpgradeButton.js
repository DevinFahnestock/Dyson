import React from 'react'

const UpgradeButton = ( {text, onClick} ) => {
  return (
    <button type="button" className='UpgradeButton' onClick={onClick}>{text}</button>
  )
}

export default UpgradeButton