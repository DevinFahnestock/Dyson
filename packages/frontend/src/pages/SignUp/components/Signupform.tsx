import React, { useRef, useState } from 'react'
import './styles.css'

import { useAuthentication } from 'src/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { SocketEmitter } from 'src/lib/Networking/SocketEmitter'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from 'firebase/auth'

const Signupform = ({ socketEmitter }: { socketEmitter: SocketEmitter }) => {
  let newAccount = useRef<{
    displayName: string
    email: string
    password: string
    passwordVerify: string
    phone: string
  }>({ displayName: '', email: '', password: '', passwordVerify: '', phone: '' })

  const [error, setError] = useState<String>()

  let navigate = useNavigate()
  const auth = useAuthentication()

  const verifyCreation = () => {
    let acc = newAccount.current
    if (!auth) {
      setError('Error with authentification Provider')
      return
    }

    if (acc.displayName.length < 5) {
      setError('Username must be at least 5 characters long')
      return
    }

    if (acc.password !== acc.passwordVerify) {
      setError('Passwords do not match!')
      return
    }

    if (acc.password.length < 5) {
      setError('Username must be at least 5 characters long')
      return
    }

    createUserWithEmailAndPassword(auth, acc.email, acc.password)
      .then(async (userCredential) => {
        console.log(auth.currentUser)
        if (auth.currentUser) {
          console.log('updating username')
          await updateProfile(auth.currentUser, {
            displayName: acc.displayName,
          })
        }

        console.log('account created successfully', userCredential)
      })
      .catch((error) => {
        console.error(error)
        setError(error)
      })
      .finally(() => navigate('/'))

    console.log(error)
  }

  return (
    <div className='SignupForm'>
      Create a new Account
      <br />
      <div className='group'>
        <input
          type='text'
          required
          id='username'
          onChange={(e) => {
            newAccount.current['displayName'] = e.target.value
          }}
        />
        <span className='highlight'></span>
        <span className='bar'></span>
        <label>Username</label>
      </div>
      <div className='group'>
        <input
          type='password'
          required
          id='password'
          onChange={(e) => {
            newAccount.current['password'] = e.target.value
          }}
        />
        <span className='highlight'></span>
        <span className='bar'></span>
        <label>Password</label>
      </div>
      <div className='group'>
        <input
          type='password'
          required
          id='passwordVerify'
          onChange={(e) => {
            newAccount.current['passwordVerify'] = e.target.value
          }}
        />
        <span className='highlight'></span>
        <span className='bar'></span>
        <label>Verify Password</label>
      </div>
      <div className='group'>
        <input
          type='text'
          id='email'
          onChange={(e) => {
            newAccount.current['email'] = e.target.value
          }}
        />
        <span className='highlight'></span>
        <span className='bar'></span>
        <label>Email</label>
      </div>
      <div className='group'>
        <input
          type='text'
          required
          id='phone'
          onChange={(e) => {
            newAccount.current['phone'] = e.target.value
          }}
        />
        <span className='highlight'></span>
        <span className='bar'></span>
        <label>Phone Number</label>
      </div>
      <button type='submit' onClick={() => verifyCreation()}>
        Create my Account
      </button>
      {error}
    </div>
  )
}

export default Signupform
