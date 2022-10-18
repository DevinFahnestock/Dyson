import React from 'react'
//import './styles.css'

import { useSignOut } from '../../../lib/firebase'

const UserCard = ({ user }: any) => {
  const signOut = useSignOut()

  return (
    <div className='profile'>
      <div className='profile name'>
        {user.displayName}
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
