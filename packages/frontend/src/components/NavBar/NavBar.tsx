import React from 'react'
import './styles.css'

import { useSignInWithGoogle, useUser } from '../../lib/firebase'
import { Link } from 'react-router-dom'
import { User } from 'firebase/auth'
import UserCard from './UserCard/UserCard'

const NavBar = () => {
  const user: User | null = useUser()
  const { signInWithPopup } = useSignInWithGoogle()

  return (
    <div className='container'>
      <nav>
        <a href='/'>
          <h1>Dyson</h1>
        </a>
        <Link to='/'>My Planets</Link>
        <Link to='/leaderboard'>leaderboard</Link>
        {!user && (
          <a className='SignInButton' onClick={() => signInWithPopup()}>
            Sign in
          </a>
        )}
        {user && <UserCard user={user} />}
      </nav>
    </div>
  )
}

export default NavBar
