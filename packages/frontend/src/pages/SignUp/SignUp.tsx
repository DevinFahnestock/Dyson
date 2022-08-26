import React, { useRef, useState } from 'react'
import './styles.css'

import { useAuthentication, useSignInWithGoogle } from 'src/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { SocketEmitter } from 'src/lib/Networking/SocketEmitter'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from 'firebase/auth'
import useToken from 'src/lib/gameData/useToken'

import validator from 'validator'

const SignUp = ({ socketEmitter }: { socketEmitter: SocketEmitter }) => {
  const { signInWithPopup } = useSignInWithGoogle()

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
  const { updateToken }: any = useToken()

  const verifyCreation = () => {
    let acc = newAccount.current
    if (!auth) {
      setError('Error with authentification Provider, please contact the server administrator')
      return
    }

    if (!validator.isLength(acc.displayName, { min: 5 })) {
      setError('Username must be at least 5 characters long')
      return
    }

    if (acc.password !== acc.passwordVerify) {
      setError('Passwords do not match!')
      return
    }

    if (!validator.isStrongPassword(acc.password)) {
      setError('Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 symbol')
      return
    }

    if (!validator.isEmail(acc.email)) {
      setError('Please enter a valid email')
      return
    }

    createUserWithEmailAndPassword(auth, acc.email, acc.password)
      .then(async (userCredential) => {
        if (auth.currentUser) {
          console.log('updating username')
          await updateProfile(auth.currentUser, {
            displayName: acc.displayName,
          })

          await updateToken(await auth.currentUser.getIdToken())
        }

        console.log('account created successfully', userCredential)
        navigate('/')
      })
      .catch((error) => {
        console.table(error)
        //setError(error)
      })
  }

  return (
    <div className='SignupForm'>
      Create a new Account
      <div className='Signuptype'>
        <div className='group'>
          <input
            type='text'
            id='username'
            onChange={(e) => {
              newAccount.current['displayName'] = e.target.value
            }}
          />
          <span className='highlight' />
          <span className='bar' />
          <label>Username</label>
        </div>
        <div className='group'>
          <input
            type='password'
            id='password'
            onChange={(e) => {
              newAccount.current['password'] = e.target.value
            }}
          />
          <span className='highlight' />
          <span className='bar' />
          <label>Password</label>
        </div>
        <div className='group'>
          <input
            type='password'
            id='passwordVerify'
            onChange={(e) => {
              newAccount.current['passwordVerify'] = e.target.value
            }}
          />
          <span className='highlight' />
          <span className='bar' />
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
          <span className='highlight' />
          <span className='bar' />
          <label>Email</label>
        </div>
        <div className='group'>
          <input
            type='text'
            id='phone'
            onChange={(e) => {
              newAccount.current['phone'] = e.target.value
            }}
          />
          <span className='highlight' />
          <span className='bar' />
          <label>Phone Number</label>
        </div>
        <button type='submit' onClick={() => verifyCreation()}>
          Create my Account
        </button>
      </div>
      <div className='Signuptype'>
        <button type='button' onClick={() => signInWithPopup()}>
          Sign in With Google
        </button>
      </div>
      {error}
    </div>
  )
}

export default SignUp
