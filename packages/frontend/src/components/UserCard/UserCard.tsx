import React from 'react'
//import './styles.css'

import { useSignOut } from '../../lib/firebase'
import { useNavigate } from 'react-router-dom'

const UserCard = ({ user }: any) => {
  const signOut = useSignOut()

  const navigate = useNavigate()

  return (
    <div className='profile'>
      <div className='profile name'>
        <a
          onClick={() => {
            navigate(`/player/${user.uid}`)
          }}
        >
          {user.displayName}
        </a>
        <a
          onClick={() => {
            signOut()
          }}
        >
          Sign out
        </a>
      </div>
      <img
        src={user && user.photoURL}
        style={{ borderRadius: '50%', padding: '3px' }}
        alt='Profile'
        referrerPolicy='no-referrer'
      />
    </div>
  )
}

export default UserCard
