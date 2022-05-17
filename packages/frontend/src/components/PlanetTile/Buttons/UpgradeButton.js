import React from 'react'
import './styles.css'

const UpgradeButton = ( {text, onClick} ) => {
  return (
    <button type="button" className='UpgradeButton' onClick={onClick}>{text}</button>
  )
}

export default UpgradeButton