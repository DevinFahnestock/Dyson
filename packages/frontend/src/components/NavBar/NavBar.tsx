import React from 'react'
import './styles.css'

import { useUser } from '../../lib/firebase'
import { Link, useNavigate } from 'react-router-dom'
import { User } from 'firebase/auth'
import UserCard from './UserCard/UserCard'

const NavBar = () => {
  const user: User | null = useUser()

  const navigate = useNavigate()

  return (
    <div className='container'>
      <nav>
        <a href='/'>
          <h1>Dyson</h1>
        </a>
        <Link to='/' className='hide'>
          My Planets
        </Link>
        <Link to='/leaderboard' className='hide'>
          leaderboard
        </Link>
        {!user && (
          <div>
            <a
              className='SignInButton'
              onClick={() => {
                navigate('/Signin')
              }}
            >
              Sign in
            </a>
            <a
              className='SignUpButton'
              onClick={() => {
                navigate('/Signup')
              }}
            >
              Sign up
            </a>
          </div>
        )}
        {user && <UserCard user={user} />}
      </nav>
    </div>
  )
}

export default NavBar
